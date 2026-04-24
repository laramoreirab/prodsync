import OEEModel from '../models/OEEModel.js'

class OEEController {
    static async geralFabrica(req, res) {
        //média de todas as máquinas da empresa
        const empresaId = req.usuario.id_empresa
        const dados = await OEEModel.geralFabrica(empresaId)
        return res.json(dados)
    }

    static async individualMaquina(req, res) {
        //OEE de uma máquina específica
        const { id_maquina } = req.body
        const empresaId = req.usuario.id_empresa
        const dados = await OEEModel.individualMaquina(id_maquina, empresaId)
        return res.json(dados)
    }

    static async medioPorSetor(req, res) {
        //OEE médio de cada setor
        const empresaId = req.usuario.id_empresa
        const dados = await OEEModel.medioPorSetor(empresaId)
        return res.json(dados)
    }
    static async setorCritico(req, res) {
        //setor com o pior OEE
        const empresaId = req.usuario.id_empresa
        const dados = await OEEModel.setorCritico(empresaId)
        return res.json(dados)
    }
    static async individualSetor(req, res) {
        //OEE de um setor específico
        const id_setor = req.body
        const empresaId = req.usuario.id_empresa
        const dados = await OEEModel.individualSetor(id_setor, empresaId)
        return res.json(dados)
    }
    static async maquinaPorOP(req, res) {
        //OEE de uma máquina dentro de uma ordem de produção
        const id_maquina, id_ordem  = req.params
        const empresaId = req.usuario.id_empresa
        const dados = await OEEModel.maquinaPorOP(id_maquina, id_ordem, empresaId)
        return res.json(dados)
    }
}

export default OEEController