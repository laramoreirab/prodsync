import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import SetorController from '../controllers/SetorController.js'

const router = Router()

router.use(authMiddleware)

router.post('/criarSetor', SetorController.criarSetor)
router.post('/:id_setor/maquinas', SetorController.associarMaquinas)
router.get('/gestor', SetorController.listarMeusSetores)
router.get('/empresa', SetorController.listarSetores)
router.get('/:id_setor', SetorController.obterSetorPorId)
router.put('/:id_setor', SetorController.atualizarSetor)
router.delete('/:id_setor', SetorController.deletarSetor)
router.post('/:id_setor/gestores', SetorController.associarGestor)
router.delete('/:id_setor/gestores', SetorController.removerGestor)
router.get('/:id_setor/gestores', SetorController.listarGestoresDoSetor)
// --------Dashboards-------------
router.get('/obterProducaoPorSetor', SetorController.obterProducaoPorSetor)
router.get('/obterQuantidadeMaquinasPorSetor', SetorController.obterQuantidadeMaquinasPorSetor)
router.get('/obterTempoMedioParadaPorSetor', SetorController.obterTempoMedioParadaPorSetor)
router.get('/obterProducaoDefeitosPorSetor', SetorController.obterProducaoDefeitosPorSetor)
router.get('/obterQuantidadeOperadoresPorSetor', SetorController.obterQuantidadeOperadoresPorSetor)

export default router
