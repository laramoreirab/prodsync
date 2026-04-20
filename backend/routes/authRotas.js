import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import AuthController from '../controllers/AuthController.js'

const router = Router()

router.post('/login', authController.login)
router.post('/cadastrar', authController.cadastrar)

export default router