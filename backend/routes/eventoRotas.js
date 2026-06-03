import { Router } from 'express';
import EventoController from '../controllers/EventoController.js';
import MotivoParadaController from '../controllers/MotivoParadaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';
import { aplicarEscopoGestor, autorizarEventoParam, autorizarMaquinaParam, autorizarMaquinasBody, validarBodySetorGestor } from '../middlewares/setorAccessMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', aplicarEscopoGestor, paginacaoMiddleware, EventoController.listarTodos);
router.get('/pendente', aplicarEscopoGestor, EventoController.obterEventoPendente);
router.get('/motivos-parada', MotivoParadaController.listarMotivosEmpresa);
router.get('/justificadas', aplicarEscopoGestor, paginacaoMiddleware, EventoController.listarJustificadas);
router.get('/nao-justificadas', aplicarEscopoGestor, paginacaoMiddleware, EventoController.listarNaoJustificadas);
router.post('/sistema', validarBodySetorGestor('setor_afetado'), autorizarMaquinasBody('maquinas'), EventoController.registrarEventoSistema);
router.post('/justificar', autorizarEventoParam('id_evento'), EventoController.justificarEvento);
router.post('/:id/justificar', autorizarEventoParam('id'), EventoController.justificarEvento);
router.put('/:id', autorizarEventoParam('id'), validarBodySetorGestor('setor_afetado'), EventoController.atualizarEvento);

router.get('/tempo_parado_produzindo', aplicarEscopoGestor, EventoController.tempoParadoTempoProduzindoEvento);
router.get('/top_motivos_tempo', aplicarEscopoGestor, EventoController.obterTopMotivosTempo);
router.get('/top3-motivos-parada', aplicarEscopoGestor, EventoController.top3MotivosParada);
router.get('/relatorio', aplicarEscopoGestor, EventoController.listarParaRelatorio);
router.get('/:id', autorizarEventoParam('id'), EventoController.buscarPorId);

export default router;
