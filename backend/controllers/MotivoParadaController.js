import MotivoParadaModel from "../models/MotivoParadaModel.js";

class MotivoParadaController {

    // Criar um novo motivo de parada
    static async criarMotivoParada(req, res) {
        try {
            const { id_empresa } = req.params;
            const dados = req.body;
            const motivoParada = await MotivoParadaModel.criarMotivoParada(dados, id_empresa);
            res.status(201).json(motivoParada);
        } catch (error) {
            console.error('Erro ao criar motivo de parada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Listar todos os motivos de parada
    static async listarMotivosParada(req, res) {
        try {
            const { id_empresa } = req.params;
            const motivosParada = await MotivoParadaModel.buscarTodosMotivosParada(id_empresa);
            res.status(200).json(motivosParada);
        } catch (error) {
            console.error('Erro ao listar motivos de parada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Buscar um motivo de parada por ID
    static async buscarMotivoParadaPorId(req, res) {
        try {
            const { id, id_empresa } = req.params;
            const motivoParada = await MotivoParadaModel.buscarMotivoParadaPorId(id, id_empresa);
            res.status(200).json(motivoParada);
        } catch (error) {
            console.error('Erro ao buscar motivo de parada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Atualizar um motivo de parada
    static async atualizarMotivoParada(req, res) {
        try {
            const { id, id_empresa } = req.params;
            const dados = req.body;
            const motivoParada = await MotivoParadaModel.atualizarMotivoParada(id, dados, id_empresa);
            res.status(200).json(motivoParada);
        } catch (error) {
            console.error('Erro ao atualizar motivo de parada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Excluir um motivo de parada
    static async excluirMotivoParada(req, res) {
        try {
            const { id, id_empresa } = req.params;
            const resultado = await MotivoParadaModel.excluirMotivoParada(id, id_empresa);
            res.status(200).json(resultado);
        } catch (error) {
            console.error('Erro ao excluir motivo de parada:', error);
            res.status(500).json({ error: error.message });
        }
    }
    static async listarMotivosFrequentes(req, res) {
        try {
            const id_empresa = req.user?.id_empresa ?? Number(req.params.id_empresa);
            const limite = req.query.limite ? Number(req.query.limite) : 10;
            const dados = await MotivoParadaModel.buscarMotivosFrequentes(id_empresa, limite);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar motivos frequentes:', error);
            return res.status(500).json({ sucesso: false, erro: error.message });
        }
    }

    static async listarTopMotivosSetup(req, res) {
        try {
            const id_empresa = req.user?.id_empresa ?? Number(req.params.id_empresa);
            const limite = req.query.limite ? Number(req.query.limite) : 3;
            const dados = await MotivoParadaModel.buscarTopMotivosSetup(id_empresa, limite);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar top motivos de setup:', error);
            return res.status(500).json({ sucesso: false, erro: error.message });
        }
    }
}

export default MotivoParadaController;
