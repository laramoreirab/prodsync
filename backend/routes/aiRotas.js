import { Router } from 'express';
import AIController from '../controllers/AIController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

//apenas usuários logados podem usar a IA 
router.post('/chat', authMiddleware, AIController.chat);

export default router;
