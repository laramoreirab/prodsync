import { Router } from 'express'
import authRotas from './authRotas.js'
import authController from '../controllers/authController.js'
import UsuarioController from '../controllers/UsuarioController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

// '/api/auth' NÃO passa pela verificação de token — é a rota de login/registro
router.use('/auth', authRotas)
router.post('/login', authController.login)

// Toda rota abaixo dessa linha exige token
router.use(authMiddleware)

//Só o adm pode acessar 
router.use('/usuarios', UsuarioController)

export default router