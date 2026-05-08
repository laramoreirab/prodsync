import { Router } from 'express';
import TurnoController from '../controllers/TurnoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Criar turno
router.post('/criarTurno', adminMiddleware, TurnoController.criarTurno)

// Obter todos os turnos da empresa
router.get('/listarTurnos',TurnoController.obterTurnosPorEmpresa)

// Obter turno atual
router.get('/turno/atual',TurnoController.obterTurnoAtual)

// Verificar conflito de horário
router.get('/operadores/:id_operador/conflito',TurnoController.verificarConflitoTurno)

// ---------------KPIs--------------------

// KPIs do turno atual
router.get('/kpis/turno-atual',TurnoController.obterKpisTurnoAtual)

// Status de máquinas por turno
router.get('/status-maquinas-por-turno',TurnoController.obterStatusMaquinasPorTurno)

// Comparativo entre turnos
router.get('/comparativo/producao',TurnoController.obterComparativoTurnos)

// KPIs de um turno específico
router.get('/kpis/:idTurno',TurnoController.obterKpisTurno)

// Obter turno por ID
router.get('/:id_turno',TurnoController.obterTurnoPorId)

// Atualizar turno
router.put('/:id_turno',adminMiddleware,TurnoController.atualizarTurno)

// Deletar turno
router.delete('/:id_turno',adminMiddleware,TurnoController.deletarTurno)


// Listar operadores de um turno
router.get('/:id_turno/operadores',TurnoController.listarOperadoresTurno)


// --------- GRÁFICOS -------

// Timeline de produção
router.get('/:idTurno/producao-timeline',TurnoController.obterProducaoTimeline)


// Distribuição de máquinas
router.get('/:idTurno/distribuicao-maquinas',TurnoController.obterDistribuicaoMaquinas)

// Tempo parado
router.get('/:idTurno/tempo-parado',TurnoController.obterTempoParado)

// Ocupação de operadores
router.get('/:idTurno/ocupacao-operadores',TurnoController.obterOcupacaoOperadores)

// Distribuição de paradas
router.get('/:idTurno/distribuicao-paradas',TurnoController.obterDistribuicaoParadas)

// Resumo do turno
router.get('/:idTurno/resumo',TurnoController.obterResumoTurno)

export default router