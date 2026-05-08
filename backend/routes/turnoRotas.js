import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import TurnoController from '../controllers/TurnoController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', TurnoController.criarTurno);
router.get('/', TurnoController.obterTurnosPorEmpresa);
router.get('/atual', TurnoController.obterTurnoAtual);
router.get('/:id_turno', TurnoController.obterTurnoPorId);
router.put('/:id_turno', TurnoController.atualizarTurno);
router.delete('/:id_turno', TurnoController.deletarTurno);

router.get('/:id_turno/operadores', TurnoController.listarOperadoresTurno);
router.get('/operador/:id_operador/conflito', TurnoController.verificarConflitoTurno);

// Dashboards
router.get('/kpis/atual', TurnoController.obterKpisTurnoAtual);
router.get('/kpis/:idTurno', TurnoController.obterKpisTurno);
router.get('/status-maquinas', TurnoController.obterStatusMaquinasPorTurno);
router.get('/:idTurno/producao-timeline', TurnoController.obterProducaoTimeline);

export default router;