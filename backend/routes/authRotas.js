import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import AuthController from '../controllers/authController.js'

const router = Router()

router.post('/login', AuthController.login)
router.post('/cadastrar', AuthController.cadastrar)
router.post('/primeiroAcesso', AuthController.primeiroAcesso)
router.post('/registroSenha', AuthController.registroSenha)
//obter informações do perfil de quem está logado
router.get('/perfil', AuthController.obterPerfil)

export default router