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
            const files = req.files; // array de arquivos
            const user = req.user;
            const { prompt, contexto } = req.body;

            if (!files || files.length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Nenhum arquivo foi enviado."
                });
            }

            const result = await AIService.analisarArquivo({
                files,
                user,
                promptCustomizado: prompt,
                contextoTela: contexto
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
