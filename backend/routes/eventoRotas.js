import { Router } from 'express';
import EventoController from '../controllers/EventoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';

const router = Router();

// Aplica autenticação em todas as rotas
router.use(authMiddleware);

// ─── CRUD / Listagem de Eventos ────────────────────────────────────────────────
// GET  /api/eventos                  → listar todos os eventos (paginado)
router.get('/', paginacaoMiddleware, EventoController.listarTodos);

// GET  /api/eventos/justificadas     → listar paradas justificadas
router.get('/justificadas', paginacaoMiddleware, EventoController.listarJustificadas);

// GET  /api/eventos/nao-justificadas → listar paradas não justificadas
router.get('/nao-justificadas', paginacaoMiddleware, EventoController.listarNaoJustificadas);

// GET  /api/eventos/motivos-parada   → listar motivos de parada disponíveis
router.get('/motivos-parada', EventoController.listarMotivosParada);

// GET  /api/eventos/pendente         → buscar evento pendente de justificativa (operador logado)
router.get('/pendente', EventoController.buscarEventoPendente);

// GET  /api/eventos/:id              → buscar evento por id
router.get('/:id', EventoController.buscarPorId);

// POST /api/eventos/sistema          → registrar evento manualmente pelo sistema (ADM/Gestor)
router.post('/sistema', EventoController.registrarEventoSistema);

// POST /api/eventos/maquina          → registrar evento automático da máquina
router.post('/maquina', EventoController.registrarEventoMaquina);

// POST /api/eventos/justificar       → justificar um evento existente
router.post('/justificar', EventoController.justificarEvento);

// ─── Dashboards de Eventos ────────────────────────────────────────────────────
router.get('/dashboard/tempo_parado_produzindo', EventoController.tempoParadoTempoProduzindoEvento);
router.get('/dashboard/top3_motivos_parada', EventoController.top3MotivosParada);
router.get('/dashboard/motivos_frequentes', EventoController.obterMotivosParadaFrequentes);
router.get('/dashboard/top_motivos_setup', EventoController.obterTopMotivosSetup);
router.get('/dashboard/top_motivos_tempo', EventoController.obterTopMotivosTempo);
router.get('/dashboard/paradas_comparativo', EventoController.obterParadasJustificadasComparativo);

export default router;