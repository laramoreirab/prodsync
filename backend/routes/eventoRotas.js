import { Router } from 'express';
import EventoController from '../controllers/EventoController.js';
import MotivoParadaController from '../controllers/MotivoParadaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', paginacaoMiddleware, EventoController.listarTodos);
router.get('/pendente', EventoController.obterEventoPendente);
router.get('/motivos-parada', MotivoParadaController.listarMotivosEmpresa);
router.get('/justificadas', paginacaoMiddleware, EventoController.listarJustificadas);
router.get('/nao-justificadas', paginacaoMiddleware, EventoController.listarNaoJustificadas);
router.post('/sistema', EventoController.registrarEventoSistema);
router.post('/maquina', EventoController.registrarEventoMaquina);
router.post('/justificar', EventoController.justificarEvento);
router.post('/:id/justificar', EventoController.justificarEvento);

router.get('/tempo_parado_produzindo', EventoController.tempoParadoTempoProduzindoEvento);
router.get('/top_motivos_tempo', EventoController.obterTopMotivosTempo);
router.get('/top3-motivos-parada', EventoController.top3MotivosParada);

export default router;
