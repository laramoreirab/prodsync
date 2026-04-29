import { Router } from 'express'
import authRotas from './authRotas.js'
import usuariosRotas from './usuarioRotas.js'
import maquinaRotas from './maquinaRotas.js'
import oeeRotas from './oeeRotas.js'

const router = Router()

router.use('/auth', authRotas)
router.use('/usuarios', usuariosRotas)
router.use('/maquinas', maquinaRotas)
router.use('/oee', oeeRotas)


export default router
