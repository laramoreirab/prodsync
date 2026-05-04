// controllers/DashboardController.js
import DashboardModel from '../models/DashboardModel.js'

class DashboardController {

    // GET /api/dashboard/producao-dia
    static async producaoDiaria(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const dados = await DashboardModel.buscarProducaoDiaria(id_empresa)
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
            const dados = await DashboardModel.buscarTendenciaRefugo(id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Tendência de Refugo:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // GET /api/dashboard/paradas-ppm
    static async paradasEPPM(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const dados = await DashboardModel.buscarParadasEPPM(id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro nos KPIs de Paradas e PPM:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
}

export default DashboardController