import { Router } from 'express';
import AIController from '../controllers/AIController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadArquivos, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = Router();

// só usuários autenticados podem acessar chat
router.post('/chat', authMiddleware, AIController.chat);

// rota para analisar arquivos (PDF, Imagens, etc) - aceita até 10 arquivos por vez, cada um com no máximo 5MB 
router.post('/analisar-arquivo', authMiddleware, uploadArquivos.array('files', 10), handleUploadError, AIController.analisarArquivo);

export default router;
