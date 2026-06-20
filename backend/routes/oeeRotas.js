import { Router } from 'express';
import OEEController from '../controllers/OEEController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { aplicarEscopoGestor, autorizarMaquinaParam, autorizarOrdemParam, autorizarSetorParam } from '../middlewares/setorAccessMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/geral', aplicarEscopoGestor, OEEController.geralFabrica);
router.get('/maquinas/:id_maquina/evolucao', autorizarMaquinaParam('id_maquina'), OEEController.obterEvolucaoOeeMaquina);
router.get('/maquinas/:id_maquina/ordens/:id_ordem', autorizarOrdemParam('id_ordem'), OEEController.maquinaPorOP);
router.get('/maquinas/:id_maquina', autorizarMaquinaParam('id_maquina'), OEEController.obterOeeMaquina);
router.get('/setores/media', aplicarEscopoGestor, OEEController.mediaPorSetor);
router.get('/setores/critico', aplicarEscopoGestor, OEEController.setorCritico);
router.get('/setores/:id_setor', autorizarSetorParam('id_setor'), OEEController.individualSetor);
router.get('/evolucaoOEEsetor/:id_setor', autorizarSetorParam('id_setor'), OEEController.evolucaoOEESetor)

export default router;
