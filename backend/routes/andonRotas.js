import { Router } from 'express';
import AndonController from '../controllers/AndonController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/status_maquinas', AndonController.obterStatusMaquinas);
router.get('/ranking_produtividade', AndonController.obterRankingProdutividade);
router.get('/secoes', AndonController.obterSecoes);

export default router;
