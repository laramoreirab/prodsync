import AIService from '../services/aiService.js';

class AIController {
    static async chat(req, res) {
        try {
            const { mensagem, historico = [] } = req.body;
            // O usuário vem do authMiddleware
            const user = req.user;

            if (!mensagem) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "A mensagem é obrigatória."
                });
            }

            const result = await AIService.chat({
                mensagem,
                user,
                historico
            });

            return res.status(200).json({
                sucesso: true,
                resposta: result.resposta
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

    static async analisarArquivo(req, res) {
        try {
            const file = req.file;
            const user = req.user;
            const { prompt } = req.body;

            if (!file) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Nenhum arquivo foi enviado."
                });
            }

            const result = await AIService.analisarArquivo({
                file,
                user,
                promptCustomizado: prompt
            });

            return res.status(200).json({
                sucesso: true,
                ...result
            });

        } catch (error) {
            console.error("Erro no AIController (Análise de Arquivo):", error);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro ao analisar arquivo",
                mensagem: error.message
            });
        }
    }
}

export default AIController;
