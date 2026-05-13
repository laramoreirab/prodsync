import MaquinaModel from '../models/MaquinaModel.js';

class AndonController {
    static obterScope(req) {
        return req.query.scope === 'sector' ? 'sector' : 'factory';
    }

    static async obterStatusMaquinas(req, res) {
        try {
            const dados = await MaquinaModel.obterAndonStatus(
                req.user.id_empresa,
                AndonController.obterScope(req),
                req.user.id_usuario
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter status do Andon:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    static async obterRankingProdutividade(req, res) {
        try {
            const dados = await MaquinaModel.obterAndonRanking(
                req.user.id_empresa,
                AndonController.obterScope(req),
                req.user.id_usuario
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter ranking do Andon:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    static async obterSecoes(req, res) {
        try {
            const dados = await MaquinaModel.obterAndonSecoes(
                req.user.id_empresa,
                AndonController.obterScope(req),
                req.user.id_usuario
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter secoes do Andon:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }
}

export default AndonController;
