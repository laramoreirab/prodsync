// controllers/DashboardController.js
import DashboardModel from '../models/DashboardModel.js'

class DashboardController {

    // GET /api/dashboard/producao-dia
    static async producaoDiaria(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const dados = await DashboardModel.buscarProducaoDiaria(id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Produção ao Longo do Dia:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // GET /api/dashboard/tendencia-refugo
    static async tendenciaRefugo(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const dados = await DashboardModel.buscarTendenciaRefugo(id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Tendência de Refugo:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // GET /api/dashboard/media-paradas-por-dia
    static async mediaParadasPorDia(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const dados = await DashboardModel.mediaParadasPorDia(id_empresa, req.query.setorId, req.query.dias)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro nos KPIs de Média de Parada por Dia:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    // GET /api/dashboard/top-motivos-parada
    static async top3MotivosParadaGeral(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const dados = await DashboardModel.top3MotivosParadaGeral(id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico TOP 3 Motivos de Parada da fábrica:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
}

export default DashboardController
