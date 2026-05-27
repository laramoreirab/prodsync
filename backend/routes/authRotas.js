import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import AuthController from '../controllers/authController.js'

const router = Router()

router.post('/login', AuthController.login)
router.post('/cadastrar', AuthController.cadastrar)
router.post('/primeiroAcesso', AuthController.primeiroAcesso)
router.post('/registroSenha', authMiddleware, AuthController.registroSenha)
//obter informações do perfil de quem está logado
router.get('/perfil', authMiddleware, AuthController.obterPerfil)
router.post('/trocarSenha', authMiddleware, AuthController.trocarSenha)

export default router
