import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { aplicarEscopoGestor } from '../middlewares/setorAccessMiddleware.js'
import DashboardController from '../controllers/DashboardController.js'

const router = Router()

router.use(authMiddleware, (req, res, next) => {
    if (!['Adm', 'Gestor'].includes(req.user.tipo)) {
        return res.status(403).json({
            erro: 'Acesso negado',
            mensagem: 'Apenas administradores e gestores podem acessar este recurso'
        })
    }

    next()
}, aplicarEscopoGestor)

router.get('/producao-dia', DashboardController.producaoDiaria)
router.get('/tendencia-refugo',DashboardController.tendenciaRefugo)
router.get('/media-paradas-por-dia', DashboardController.mediaParadasPorDia)
router.get('/top-motivos-parada', DashboardController.top3MotivosParadaGeral)

export default router
