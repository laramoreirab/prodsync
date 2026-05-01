import { Router } from 'express';
import OEEController from '../controllers/OEEController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/geral', OEEController.geralFabrica);
router.get('/maquinas/:id_maquina/evolucao', OEEController.obterEvolucaoOeeMaquina);
router.get('/maquinas/:id_maquina/ordens/:id_ordem', OEEController.maquinaPorOP);
router.get('/maquinas/:id_maquina', OEEController.obterOeeMaquina);
router.get('/setores/media', OEEController.mediaPorSetor);
router.get('/setores/critico', OEEController.setorCritico);
router.get('/setores/:id_setor', OEEController.individualSetor);

export default router;