import { Router } from 'express';
import AndonController from '../controllers/AndonController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Aplica autenticação em todas as rotas
router.use(authMiddleware);

// GET /api/andon/status_maquinas?scope=factory|sector&id_setor=<id>
router.get('/status_maquinas', AndonController.getStatusMaquinas);

// GET /api/andon/ranking_produtividade?scope=factory|sector&id_setor=<id>
router.get('/ranking_produtividade', AndonController.getRankingProdutividade);

// GET /api/andon/secoes?scope=factory|sector&id_setor=<id>
router.get('/secoes', AndonController.getSecoes);

export default router;