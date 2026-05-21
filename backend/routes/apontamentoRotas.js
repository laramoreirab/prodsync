import { Router } from 'express';
import ApontamentoController from '../controllers/ApontamentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, ApontamentoController.criarApontamento);

export default router;
