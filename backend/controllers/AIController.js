import { AzureOpenAI } from "openai";

class AIController {
    static async chat(req, res) {
        try {
            const { mensagem, historico = [] } = req.body;
            //pegando dados do usuário autenticado pelo middleware de auth para personalizar a resposta da IA
            const { nome, id_empresa } = req.user; 

            const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_KEY;
            const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
            const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

            if (!endpoint || !apiKey || !deployment) {
                return res.status(500).json({
                    sucesso: false,
                    erro: "Configuração da IA ausente",
                    mensagem: "As variáveis de ambiente da Azure OpenAI não foram configuradas corretamente."
                });
            }

            const client = new AzureOpenAI({
                endpoint,
                apiKey,
                deployment,
                apiVersion,
            });

            const systemPrompt = `
                Você é o Assistente Especialista do ProdSync, um sistema avançado de Gestão de Chão de Fábrica (MES).
                Seu objetivo é ser o braço direito de gestores e operadores, transformando dados complexos em insights acionáveis.

                CONTEXTO DO USUÁRIO:
                - Nome do Usuário: ${nome}
                - ID da Empresa: ${id_empresa}

                SUAS CAPACIDADES E RESPONSABILIDADES:
                1. Análise de OEE (Overall Equipment Effectiveness): Você entende que OEE é o produto de Disponibilidade, Performance e Qualidade.
                2. Gestão de Paradas: Você analisa motivos de downtime (programados e não programados) e identifica gargalos.
                3. Resumo de Dashboards: Ao receber dados brutos de produção, você deve criar resumos executivos focados em:
                   - O que está indo bem (metas batidas).
                   - O que é crítico (máquinas paradas há muito tempo, excesso de refugo).
                   - Sugestões de melhoria (ex: "A máquina X está com setup muito longo, considerar treinamento").
                4. Suporte Operacional: Auxiliar operadores em dúvidas sobre ordens de produção e status de máquinas.

                CONHECIMENTO DO DOMÍNIO PRODSYNC:
                - Status de Máquina: Produzindo, Parada, Setup.
                - Prioridades de OP: Alta, Média, Baixa, Crítica.
                - Tipos de Eventos: Paradas programadas e não programadas, Setup.

                ESTRUTURA DE DADOS (Conhecimento do Banco):
                Você tem ciência de que o sistema possui as seguintes entidades:
                - Maquinas (conectadas a setores e operadores).
                - Ordens de Produção (lotes, produtos, quantidades planejadas).
                - Apontamentos (registros de peças boas e refugo/sucata).
                - Histórico de Eventos (log detalhado de cada mudança de status).

                DIRETRIZES DE RESPOSTA:
                - Use Markdown para formatar as respostas (negrito, tabelas e listas).
                - Se o usuário perguntar "Como está o dia hoje?", e você não tiver os dados, peça para ele fornecer o resumo do dashboard ou os dados específicos.
                - Seja técnico, mas direto. Use termos como "Gargalo", "Lead Time", "Downtime" e "Setup".
                - Segurança: Nunca sugira ações que comprometam a segurança física dos operadores.
                - SEMPRE mantenha o foco na eficiência industrial da empresa ID ${id_empresa}.
            `;

            const response = await client.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...historico,
                    { role: "user", content: mensagem }
                ],
                max_tokens: 800,
                temperature: 0.7,
            });

            return res.status(200).json({
                sucesso: true,
                resposta: response.choices[0].message.content
            });

        } catch (error) {
            console.error("Erro no AIController:", error);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro ao processar solicitação com a IA",
                mensagem: error.message
            });
        }
    }
}

export default AIController;
