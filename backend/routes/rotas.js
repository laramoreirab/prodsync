import { Router } from 'express'
import authRotas from './authRotas.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

// '/api/auth' NÃO passa pela verificação de token — é a rota de login/registro
router.use('/auth', authRotas)

// Toda rota abaixo dessa linha exige token
router.use(authMiddleware)

export default router