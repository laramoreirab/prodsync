import azureAiService from './azureAiService.js';
import * as AiToolsRegistry from './aiTools/registry.js';
import prisma from '../config/prisma.js';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

class AIService {
    static async #buscarNomeUsuario(user) {
        if (user?.nome) return user.nome;
        const id_usuario = user?.id_usuario ? Number(user.id_usuario) : null;
        if (id_usuario) {
            try {
                const dbUser = await prisma.usuarios.findUnique({ where: { id_usuario }, select: { nome: true } });
                return dbUser?.nome || 'Gestor';
            } catch (err) { console.error("Erro ao buscar nome:", err); }
        }
        return 'Gestor';
    }

    static #getInstrucoesFormatacao() {
        return `
        REGRAS DE OURO DE VISUALIZAÇÃO:
        1. ### 📊 Resumo Executivo
        2. TABELAS para listas técnicas.
        3. **Negrito** para KPIs.
        4. '>' para Insights.
        `.trim();
    }

    static async analisarArquivo({ files, user, promptCustomizado = "", contextoTela = null }) {
        const id_empresa = user?.id_empresa ? Number(user.id_empresa) : null;
        const nomeUsuario = await this.#buscarNomeUsuario(user);

        const aiContent = [];
        let metadataSummary = "";

        for (const file of files) {
            const filePath = file.path;
            const mimeType = file.mimetype;
            const fileName = file.originalname;

            try {
                if (mimeType.startsWith('image/')) {
                    const content = fs.readFileSync(filePath).toString('base64');
                    aiContent.push({
                        type: "image_url",
                        image_url: { url: `data:${mimeType};base64,${content}` }
                    });
                } else if (mimeType === 'application/pdf') {
                    const dataBuffer = fs.readFileSync(filePath);
                    const { PDFParse } = require('pdf-parse');
                    const parser = new PDFParse({ data: dataBuffer });
                    const result = await parser.getText();
                    let text = (result.text || "").replace(/\u0000/g, '').trim();

                    if (text.length < 150) {
                        const screenshot = await parser.getScreenshot({ scale: 2.0, first: 1 });
                        if (screenshot.pages?.length > 0) {
                            const b64 = Buffer.from(screenshot.pages[0].data).toString('base64');
                            aiContent.push({
                                type: "image_url",
                                image_url: { url: `data:image/png;base64,${b64}` }
                            });
                        }
                    } else {
                        aiContent.push({ type: "text", text: `CONTEÚDO PDF (${fileName}):\n${text.slice(0, 15000)}` });
                    }
                    await parser.destroy();
                } else {
                    const text = fs.readFileSync(filePath, 'utf8');
                    aiContent.push({ type: "text", text: `CONTEÚDO ARQUIVO (${fileName}):\n${text.slice(0, 15000)}` });
                }
            } catch (err) {
                console.error(`Erro no arquivo ${fileName}:`, err);
            }
        }

        const systemPrompt = `Você é o Sy, assistente do ProdSync. Empresa: ${id_empresa}. Usuário: ${nomeUsuario}.\n${this.#getInstrucoesFormatacao()}`;
        const userPrompt = promptCustomizado || "Faça um resumo dos arquivos enviados.";
        const contextPrompt = contextoTela ? `\n\nCONTEXTO DA TELA ATUAL: ${contextoTela}` : "";

        try {
            // adiciona o prompt de texto no início do array de conteúdo para a azure
            const finalMessages = [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: [
                        { type: "text", text: `${userPrompt}${contextPrompt}` },
                        ...aiContent
                    ]
                }
            ];

            const resposta = await azureAiService.generateWithVision({ messages: finalMessages });
            return { resposta };
        } catch (error) { throw error; }
    }

    static async chat({ mensagem, user, historico = [] }) {
        const id_empresa = Number(user.id_empresa);
        const nomeUsuario = await this.#buscarNomeUsuario(user);

        const systemPrompt = `
        Você é o Sy, Assistente do ProdSync.
        ${this.#getInstrucoesFormatacao()}
        Empresa ID: ${id_empresa}, Usuário: ${nomeUsuario}.
        `.trim();

        const messages = [
            { role: "system", content: systemPrompt },
            ...historico.slice(-6),
            { role: "user", content: mensagem }
        ];

        try {
            const firstResponse = await azureAiService.generateWithTools({ messages, tools: AiToolsRegistry.tools });
            if (!firstResponse.tool_calls) return { resposta: firstResponse.content };

            const toolMessages = [];
            for (const toolCall of firstResponse.tool_calls) {
                const result = await AiToolsRegistry.executeTool({
                    name: toolCall.function.name,
                    args: JSON.parse(toolCall.function.arguments),
                    user
                });
                toolMessages.push({ role: "tool", tool_call_id: toolCall.id, content: JSON.stringify(result) });
            }

            const finalResposta = await azureAiService.generateText({
                messages: [
                    ...messages,
                    firstResponse,
                    ...toolMessages,
                    { role: "system", content: "Lembre-se: Use TABELAS Markdown para dados técnicos. Seja visual." }
                ]
            });

            return { resposta: finalResposta };
        } catch (error) { throw error; }
    }
}

export default AIService;
