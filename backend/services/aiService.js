import azureAiService from './azureAiService.js';
import * as AiToolsRegistry from './aiTools/registry.js';
import prisma from '../config/prisma.js';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

class AIService {
    static async analisarArquivo({ file, user, promptCustomizado = "" }) {
        const filePath = file.path;
        const mimeType = file.mimetype;
        const fileName = file.originalname;
        const id_empresa = user?.id_empresa ? Number(user.id_empresa) : null;
        const id_usuario = user?.id_usuario ? Number(user.id_usuario) : null;

        if (!id_empresa) throw new Error("ID da empresa não encontrado.");

        let nomeUsuario = user?.nome || 'Gestor';
        if (!user?.nome && id_usuario) {
            try {
                const dbUser = await prisma.usuarios.findUnique({
                    where: { id_usuario: id_usuario },
                    select: { nome: true }
                });
                if (dbUser) nomeUsuario = dbUser.nome;
            } catch (err) {
                console.error("Erro ao buscar nome do usuário para análise:", err);
            }
        }

        let content = "";
        let metadataInfo = "";
        let isImage = false;

        try {
            if (mimeType.startsWith('image/')) {
                isImage = true;
                content = fs.readFileSync(filePath).toString('base64');
            } else if (mimeType === 'application/pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const { PDFParse } = require('pdf-parse');

                if (PDFParse) {
                    const parser = new PDFParse({ data: dataBuffer });

                    // Busca texto e informações do documento
                    const [result, info] = await Promise.all([
                        parser.getText(),
                        parser.getInfo().catch(() => ({ total: "desconhecido" }))
                    ]);

                    content = (result.text || "").replace(/\u0000/g, '').trim();
                    metadataInfo = `[PDF Info] Páginas: ${info.total}, Título: ${info.info?.Title || 'N/A'}`;

                    await parser.destroy();
                    console.log(`[AI] PDF processado: ${fileName} (${content.length} caracteres)`);
                }
            } else {
                content = fs.readFileSync(filePath, 'utf8');
            }

            if (content.length > 30000 && !isImage) {
                content = content.slice(0, 30000) + "\n\n[Conteúdo truncado...]";
            }

        } catch (error) {
            console.error("[AI] Erro de leitura:", error);
            content = `[Erro técnico ao acessar o arquivo]`;
        }

        const systemPrompt = `Você é o Assistente Especialista do ProdSync. Analise o arquivo e responda como especialista industrial. Contexto: Empresa ID ${id_empresa}, Usuário ${nomeUsuario}.`;

        // Melhora a instrução para a IA lidar com PDFs sem texto
        const contextStatus = content.length === 0 && !isImage
            ? "\nAVISO: O texto deste PDF não pôde ser extraído. Provavelmente é uma imagem escaneada. Peça ao usuário para enviar um print/imagem do documento."
            : "";

        const userPrompt = promptCustomizado || `Analise o arquivo ${fileName} e resuma os pontos principais.`;

        try {
            let resposta;
            if (isImage) {
                resposta = await azureAiService.generateWithVision({
                    messages: [
                        { role: "system", content: systemPrompt },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: userPrompt },
                                {
                                    type: "image_url",
                                    image_url: { url: `data:${mimeType};base64,${content}` }
                                }
                            ]
                        }
                    ]
                });
            } else {
                resposta = await azureAiService.generateText({
                    messages: [
                        { role: "system", content: systemPrompt + contextStatus },
                        {
                            role: "user",
                            content: `Arquivo: ${fileName}\n${metadataInfo}\n\nConteúdo extraído:\n${content || "[Vazio]"}\n\nInstrução: ${userPrompt}`
                        }
                    ]
                });
            }

            return { fileName, mimeType, resposta };

        } catch (error) {
            console.error("[AI] Erro Azure:", error);
            throw error;
        }
    }

    static async chat({ mensagem, user, historico = [] }) {
        const id_usuario = user?.id_usuario ? Number(user.id_usuario) : null;
        const id_empresa = user?.id_empresa ? Number(user.id_empresa) : null;

        if (!id_empresa) throw new Error("ID da empresa não encontrado.");

        let nomeUsuario = user?.nome || 'Gestor';
        if (!user?.nome && id_usuario) {
            try {
                const dbUser = await prisma.usuarios.findUnique({ where: { id_usuario }, select: { nome: true } });
                if (dbUser) nomeUsuario = dbUser.nome;
            } catch (err) {}
        }

        const systemPrompt = `Você é o Assistente Especialista do ProdSync. Empresa ID: ${id_empresa}, Usuário: ${nomeUsuario}. Responda sempre em Português e use ferramentas para dados reais.`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...historico.slice(-5),
            { role: "user", content: mensagem }
        ];

        try {
            const firstResponse = await azureAiService.generateWithTools({
                messages,
                tools: AiToolsRegistry.tools
            });

            if (!firstResponse.tool_calls || firstResponse.tool_calls.length === 0) {
                return { resposta: firstResponse.content };
            }

            const toolMessages = [];
            for (const toolCall of firstResponse.tool_calls) {
                const result = await AiToolsRegistry.executeTool({
                    name: toolCall.function.name,
                    args: JSON.parse(toolCall.function.arguments),
                    user
                });

                toolMessages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(result)
                });
            }

            const finalResposta = await azureAiService.generateText({
                messages: [...messages, firstResponse, ...toolMessages]
            });

            return { resposta: finalResposta };

        } catch (error) {
            console.error("Erro no AIService:", error);
            throw error;
        }
    }
}

export default AIService;
