import { Router } from 'express'
import { authMiddleware, adminMiddleware, gestorMiddleware } from '../middlewares/authMiddleware.js'
import { aplicarEscopoGestor, autorizarSetorParam } from '../middlewares/setorAccessMiddleware.js'
import SetorController from '../controllers/SetorController.js'

const router = Router()

router.use(authMiddleware)

// --------Dashboards-------------
router.get('/obterProducaoPorSetor', aplicarEscopoGestor, SetorController.obterProducaoPorSetor)
router.get('/obterQuantidadeMaquinasPorSetor', aplicarEscopoGestor, SetorController.obterQuantidadeMaquinasPorSetor)
router.get('/obterTempoMedioParadaPorSetor', aplicarEscopoGestor, SetorController.obterTempoMedioParadaPorSetor)
router.get('/obterProducaoDefeitosPorSetor', aplicarEscopoGestor, SetorController.obterProducaoDefeitosPorSetor)
router.get('/obterQuantidadeOperadoresPorSetor', aplicarEscopoGestor, SetorController.obterQuantidadeOperadoresPorSetor)

router.get('/totalSetores', aplicarEscopoGestor, SetorController.totalDeSetores)

router.post('/criarSetor', adminMiddleware, SetorController.criarSetor)
router.post('/:id_setor/maquinas', adminMiddleware, SetorController.associarMaquinas)
router.get('/:id_setor/turnos', autorizarSetorParam('id_setor'), SetorController.listarTurnosDoSetor)
router.put('/:id_setor/turnos/grupo', adminMiddleware, SetorController.atualizarGrupoTurno)
router.put('/:id_setor/turnos', adminMiddleware, SetorController.sincronizarTurnos)

router.get('/gestor', gestorMiddleware, SetorController.listarMeusSetores)
router.get('/empresa', aplicarEscopoGestor, SetorController.listarSetores)

router.get('/:id_setor', autorizarSetorParam('id_setor'), SetorController.obterSetorPorId)
router.put('/:id_setor', adminMiddleware, SetorController.atualizarSetor)
router.delete('/:id_setor', adminMiddleware, SetorController.deletarSetor)

router.get('/motivosParada/:id_setor', autorizarSetorParam('id_setor'), SetorController.motivosParada)
router.get('/top5operadoresPorSetor/:id_setor', autorizarSetorParam('id_setor'), SetorController.top5Operadores)

router.post('/:id_setor/gestores', adminMiddleware, SetorController.associarGestor)
router.delete('/:id_setor/gestores', adminMiddleware, SetorController.removerGestor)
router.get('/:id_setor/gestores', adminMiddleware, SetorController.listarGestoresDoSetor)

router.post('/:id_setor/operadores', adminMiddleware, SetorController.associarOperadores)
router.delete('/:id_setor/operadores', adminMiddleware, SetorController.removerOperador)
router.get('/:id_setor/operadores', autorizarSetorParam('id_setor'), SetorController.listarOperadoresDoSetor)


export default router
