import { AzureOpenAI } from "openai";
import prisma from "../config/prisma.js";

class AIController {
    static async chat(req, res) {
        try {
            const { mensagem, historico = [] } = req.body;
            const { nome = "Usuário", id_empresa } = req.user || {};
            const idEmpresaNum = parseInt(id_empresa);

            const client = new AzureOpenAI({
                endpoint: process.env.AZURE_OPENAI_ENDPOINT,
                apiKey: process.env.AZURE_OPENAI_KEY,
                deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                apiVersion: process.env.AZURE_OPENAI_API_VERSION,
            });

            const tools = [
                {
                    type: "function",
                    function: {
                        name: "get_detailed_dashboard_data",
                        description: "Busca dados analíticos para explicar os gráficos: OEE médio, evolução de produção, motivos de parada frequentes e status de máquinas por setor.",
                        parameters: { type: "object", properties: {} },
                    },
                }
            ];

            const systemPrompt = `
                Você é o Sy, o Assistente Analítico do ProdSync.
                Sua especialidade é interpretar gráficos e dados industriais.

                DIRETRIZES:
                1. Quando o usuário perguntar sobre gráficos, resumos ou "como estamos", chame 'get_detailed_dashboard_data'.
                2. Use os dados retornados para explicar tendências: "Nossa produção subiu 10% ontem", "O setor X está com o maior índice de refugo", etc.
                3. Compare os dados: Se o OEE estiver baixo, identifique se o problema é Disponibilidade (paradas) ou Qualidade (refugo).
                4. Sempre use Markdown para tabelas e destaque os pontos críticos em negrito.
                5. Empresa do Usuário: ${idEmpresaNum}.
            `;

            let messages = [
                { role: "system", content: systemPrompt },
                ...historico.slice(-5), // Mantém apenas as últimas 5 para contexto
                { role: "user", content: mensagem }
            ];

            const response = await client.chat.completions.create({
                messages,
                tools,
                tool_choice: "auto",
            });

            let responseMessage = response.choices[0].message;

            if (responseMessage.tool_calls) {
                console.log("[AI] Analisando dados para os gráficos...");
                messages.push(responseMessage);

                for (const toolCall of responseMessage.tool_calls) {
                    if (toolCall.function.name === "get_detailed_dashboard_data") {
                        const hoje = new Date();
                        const seteDiasAtras = new Date();
                        seteDiasAtras.setDate(hoje.getDate() - 7);

                        // BUSCA ANALÍTICA PARA OS GRÁFICOS
                        const [statusMaquinas, producao7Dias, topParadas, resumoSetores] = await Promise.all([
                            // 1. Status Geral (Gráfico de Rosca/Donut)
                            prisma.maquinas.groupBy({
                                by: ['status_atual'],
                                where: { id_empresa: idEmpresaNum },
                                _count: { id_maquina: true }
                            }),
                            // 2. Produção da última semana (Gráfico de Área/Barras)
                            prisma.apontamento.groupBy({
                                by: ['data_hora_inicio'],
                                where: { id_empresa: idEmpresaNum, data_hora_inicio: { gte: seteDiasAtras } },
                                _sum: { qtd_boa: true, qtd_refugo: true }
                            }),
                            // 3. Principais Motivos de Parada (Gráfico de Barras)
                            prisma.historico_Eventos.findMany({
                                where: { id_empresa: idEmpresaNum, motivo_parada: { isNot: null } },
                                take: 5,
                                orderBy: { duracao: 'desc' },
                                include: { motivo_parada: true, maquina: true }
                            }),
                            // 4. Setores e sua saúde
                            prisma.setores.findMany({
                                where: { id_empresa: idEmpresaNum },
                                include: {
                                    maquinas: { select: { status_atual: true } },
                                    _count: { select: { maquinas: true } }
                                }
                            })
                        ]);

                        const analyticsResponse = {
                            resumo_maquinas: statusMaquinas,
                            tendencia_producao: producao7Dias,
                            maiores_gargalos: topParadas.map(p => ({
                                maquina: p.maquina.nome,
                                motivo: p.motivo_parada.descricao,
                                duracao_minutos: p.duracao
                            })),
                            saude_setores: resumoSetores.map(s => ({
                                nome: s.nome_setor,
                                total_maquinas: s._count.maquinas,
                                maquinas_paradas: s.maquinas.filter(m => m.status_atual === 'Parada').length
                            }))
                        };

                        messages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            name: "get_detailed_dashboard_data",
                            content: JSON.stringify(analyticsResponse),
                        });
                    }
                }

                const secondResponse = await client.chat.completions.create({ messages });
                return res.status(200).json({
                    sucesso: true,
                    resposta: secondResponse.choices[0].message.content
                });
            }

            return res.status(200).json({ sucesso: true, resposta: responseMessage.content });

        } catch (error) {
            console.error("[AI ERROR]", error);
            return res.status(500).json({ sucesso: false, erro: "Erro ao gerar análise", detalhes: error.message });
        }
    }
}

export default AIController;
