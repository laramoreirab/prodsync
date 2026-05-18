import { Router } from 'express'
import authRotas from './authRotas.js'
import usuariosRotas from './usuarioRotas.js'
import maquinaRotas from './maquinaRotas.js'
import oeeRotas from './oeeRotas.js'
import dashboardRotas from './dashboardRotas.js'
import setorRotas from './setorRotas.js'
import turnoRotas from './turnoRotas.js'
import andonRotas from './andonRotas.js'
import eventoRotas from './eventoRotas.js'
import ordemProducaoRotas from './ordemProducaoRotas.js'

const router = Router()

router.use('/auth', authRotas)
router.use('/usuarios', usuariosRotas)
router.use('/maquinas', maquinaRotas)
router.use('/oee', oeeRotas)
router.use('/dashboard', dashboardRotas)
router.use('/setores', setorRotas)
router.use('/turnos', turnoRotas)
router.use('/andon', andonRotas)
router.use('/eventos', eventoRotas)
router.use('/ordens', ordemProducaoRotas)
router.use('/ordens-producao', ordemProducaoRotas)


export default router
