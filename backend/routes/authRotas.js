import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import authController from '../controllers/AuthController.js'

const router = express.Router()

router.post('/login', authController.login)
router.post('/cadastrar', authController.cadastrar)

