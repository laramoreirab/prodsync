import { Router } from 'express';
import MaquinaController from '../controllers/MaquinaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', paginacaoMiddleware, MaquinaController.listarMaquinas);
router.post('/', MaquinaController.criarMaquina);

router.get('/dashboard/status-geral', MaquinaController.obterStatusGeralMaquinas);
router.get('/dashboard/taxa-cumprimento-meta-setor', MaquinaController.taxaCumprimentoMetaPorSetor);

router.get('/status/:status', MaquinaController.listarMaquinasPorStatus);
router.get('/setor/:id_setor', MaquinaController.listarMaquinasPorSetor);

router.get('/:id/top-motivos-parada', MaquinaController.obterTopMotivosParada);
router.get('/:id/refugos', MaquinaController.obterRefugosMaquina);
router.get('/:id/historico-eventos', MaquinaController.obterHistoricoEventosTabela);

router.get('/:id', MaquinaController.buscarMaquinaPorId);
router.put('/:id', MaquinaController.atualizarMaquina);
router.put('/:id/status', MaquinaController.atualizarStatus);
router.delete('/:id', MaquinaController.deletarMaquina);

export default router;
