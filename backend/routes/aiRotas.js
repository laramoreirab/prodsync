import { Router } from 'express';
import AIController from '../controllers/AIController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

//só usuários autenticados podem acessar chat
router.post('/chat', authMiddleware, AIController.chat);

export default router;
