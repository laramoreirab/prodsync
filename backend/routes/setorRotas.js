import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import SetorController from '../controllers/SetorController.js'

const router = Router()

router.use(authMiddleware)

// --------Dashboards-------------
router.get('/obterProducaoPorSetor', SetorController.obterProducaoPorSetor)
router.get('/obterQuantidadeMaquinasPorSetor', SetorController.obterQuantidadeMaquinasPorSetor)
router.get('/obterTempoMedioParadaPorSetor', SetorController.obterTempoMedioParadaPorSetor)
router.get('/obterProducaoDefeitosPorSetor', SetorController.obterProducaoDefeitosPorSetor)
router.get('/obterQuantidadeOperadoresPorSetor', SetorController.obterQuantidadeOperadoresPorSetor)

router.get('/totalSetores', SetorController.totalDeSetores)

router.post('/criarSetor', SetorController.criarSetor)
router.post('/:id_setor/maquinas', SetorController.associarMaquinas)

router.get('/gestor', SetorController.listarMeusSetores)
router.get('/empresa', SetorController.listarSetores)

router.get('/:id_setor', SetorController.obterSetorPorId)
router.put('/:id_setor', SetorController.atualizarSetor)
router.delete('/:id_setor', SetorController.deletarSetor)

router.get('/motivosParada/:id_setor', SetorController.motivosParada)
router.get('/top5operadoresPorSetor/:id_setor', SetorController.top5Operadores)

router.post('/:id_setor/gestores', SetorController.associarGestor)
router.delete('/:id_setor/gestores', SetorController.removerGestor)
router.get('/:id_setor/gestores', SetorController.listarGestoresDoSetor)

router.post('/:id_setor/operadores', SetorController.associarOperadores)
router.delete('/:id_setor/operadores', SetorController.removerOperador)
router.get('/:id_setor/operadores', SetorController.listarOperadoresDoSetor)


export default router
