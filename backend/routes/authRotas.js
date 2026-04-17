import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/login', authController.login)
router.post('/cadastrar', authController.cadastrar)

export default router