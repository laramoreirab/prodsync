import { Router } from 'express';
import PlacaController from '../controllers/PlacaController.js';

const router = Router();

router.post('/pareamento', PlacaController.solicitarPareamento);
router.post('/eventos', PlacaController.registrarEvento);

export default router;
