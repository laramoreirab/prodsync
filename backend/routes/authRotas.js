import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import AuthController from '../controllers/AuthController.js'

const router = Router()

router.post('/login', AuthController.login)
router.post('/cadastrar', AuthController.cadastrar)

export default router