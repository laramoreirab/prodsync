import { executeTool as executeReadTool } from './readActions.js';

export const tools = [
    {
        type: "function",
        function: {
            name: "buscar_status_maquinas",
            description: "Retorna a lista de máquinas da empresa com seus respectivos status (Produzindo, Parada, etc), setor e operador atual.",
            parameters: {
                type: "object",
                properties: {
                    limite: {
                        type: "integer",
                        description: "Quantidade máxima de máquinas a retornar (default 10)."
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "buscar_resumo_producao",
            description: "Retorna o resumo das ordens de produção ativas, incluindo produto, lote, quantidade planejada e prioridade.",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    },
    {
        type: "function",
        function: {
            name: "buscar_eventos_recentes",
            description: "Lista os eventos de parada ou troca de status mais recentes no chão de fábrica.",
            parameters: {
                type: "object",
                properties: {
                    limite: {
                        type: "integer",
                        description: "Quantidade de eventos (default 5)."
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "buscar_contexto_operacional",
            description: "Busca um panorama geral e completo da empresa: resumo de máquinas, produção e eventos recentes.",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    }
];

export const executeTool = async ({ name, args, user }) => {
    // Por enquanto apenas ferramentas de leitura (Read)
    return await executeReadTool({ name, args, user });
};
