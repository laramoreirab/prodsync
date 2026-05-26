import { Router } from 'express';
import NotificacaoController from '../controllers/NotificacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', NotificacaoController.listar);
router.get('/contagem', NotificacaoController.contagem);
router.patch('/marcar-todas-lidas', NotificacaoController.marcarTodasLidas);
router.post('/solicitar-justificativa', NotificacaoController.solicitarJustificativa);
router.delete('/:id', NotificacaoController.excluir);
router.patch('/:id/lida', NotificacaoController.marcarLida);

export default router;
