import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import UsuarioController from '../controllers/UsuarioController.js'

const router = Router()

