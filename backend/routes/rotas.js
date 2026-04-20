import { Router } from 'express'
import authRotas from './authRotas.js'
import usuariosRotas from './usuarioRotas.js'

const router = Router()

router.use('/auth', authRotas)
router.use('/usuarios', usuariosRotas)


export default router