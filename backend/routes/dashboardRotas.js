import { Router } from 'express'
import { adminMiddleware, authMiddleware } from '../middlewares/authMiddleware.js'
import DashboardController from '../controllers/DashboardController.js'

const router = Router()

router.use(authMiddleware, adminMiddleware)

router.get('/producao-dia', DashboardController.producaoDiaria)
router.get('/tendencia-refugo',DashboardController.tendenciaRefugo)
router.get('/media-paradas-por-dia', DashboardController.mediaParadasPorDia)
router.get('/top-motivos-parada', DashboardController.top3MotivosParadaGeral)

export default router