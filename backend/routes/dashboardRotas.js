import { Router } from 'express'
import { adminMiddleware, authMiddleware } from '../middlewares/authMiddleware.js'
import DashboardController from '../controllers/DashboardController.js'

const router = Router()

router.use(authMiddleware, adminMiddleware)

router.get('/producao-dia', DashboardController.producaoDiaria)
router.get('/tendencia-refugo',DashboardController.tendenciaRefugo)
router.get('/media-paradas-por-dia', DashboardController.mediaParadasPorDia)
router.get('/pecas-por-minuto', DashboardController.pecasPorMinuto)

export default router