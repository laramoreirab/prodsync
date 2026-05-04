import OEEModel from '../models/OEEModel.js';

class OEEController {
    static obterId(req, res, nome = 'id') {
        const valor = req.params[nome];

        if (!valor || isNaN(valor)) {
            res.status(400).json({
                sucesso: false,
                erro: 'ID invalido',
                mensagem: `O parametro ${nome} deve ser um numero valido`
            });
            return null;
        }

        return parseInt(valor);
    }

    static async geralFabrica(req, res) {
        try {
            const dados = await OEEModel.geralFabrica(req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter OEE geral da fabrica:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterOeeMaquina(req, res) {
        try {
            const id_maquina = OEEController.obterId(req, res, 'id_maquina');
            if (!id_maquina) return;

            const dados = await OEEModel.obterOeeMaquina(id_maquina, req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter OEE da maquina:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterEvolucaoOeeMaquina(req, res) {
        try {
            const id_maquina = OEEController.obterId(req, res, 'id_maquina');
            if (!id_maquina) return;

            const dados = await OEEModel.obterEvolucaoOeeMaquina(id_maquina, req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter evolucao de OEE da maquina:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async mediaPorSetor(req, res) {
        try {
            const dados = await OEEModel.mediaPorSetor(req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter OEE medio por setor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async setorCritico(req, res) {
        try {
            const dados = await OEEModel.setorCritico(req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter setor critico por OEE:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async individualSetor(req, res) {
        try {
            const id_setor = OEEController.obterId(req, res, 'id_setor');
            if (!id_setor) return;

            const dados = await OEEModel.individualSetor(id_setor, req.user.id_empresa);

            if (!dados) {
                return res.status(404).json({ sucesso: false, erro: 'Setor nao encontrado' });
            }

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter OEE do setor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async maquinaPorOP(req, res) {
        try {
            const id_maquina = OEEController.obterId(req, res, 'id_maquina');
            const id_ordem = OEEController.obterId(req, res, 'id_ordem');
            if (!id_maquina || !id_ordem) return;

            const dados = await OEEModel.maquinaPorOP(id_maquina, id_ordem, req.user.id_empresa);

            if (!dados) {
                return res.status(404).json({ sucesso: false, erro: 'Ordem de producao nao encontrada para a maquina' });
            }

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter OEE da maquina por OP:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
}

export default OEEController;
