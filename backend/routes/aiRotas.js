import { Router } from 'express';
import AIController from '../controllers/AIController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadArquivos, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Só usuários autenticados podem acessar chat
router.post('/chat', authMiddleware, AIController.chat);

// Rota para analisar arquivos (PDF, Imagens, etc)
router.post('/analisar-arquivo', authMiddleware, uploadArquivos.single('arquivo'), handleUploadError, AIController.analisarArquivo);

export default router;
