import { Router } from 'express';
import MaquinaController from '../controllers/MaquinaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', paginacaoMiddleware, MaquinaController.listarMaquinas);
router.post('/', uploadImagens.single('imagem'), handleUploadError, MaquinaController.criarMaquina);

router.get('/dashboard/status-geral', MaquinaController.obterStatusGeralMaquinas);
router.get('/dashboard/taxa-cumprimento-meta-setor', MaquinaController.taxaCumprimentoMetaPorSetor);
router.get('/dashboard/obter-pecas-por-minuto', MaquinaController.obterPecasPorMinuto)
router.get('/dashboard/obter-tempo-parada-maquinas', MaquinaController.obterMediaParadasPorDia)
router.get('/dashboard/obter-producao-total-maquinas', MaquinaController.obterProducaoTotalMaquinas)

router.get('/status/:status', MaquinaController.listarMaquinasPorStatus);
router.get('/setor/:id_setor', MaquinaController.listarMaquinasPorSetor);

router.get('/:id/top-motivos-parada', MaquinaController.obterTopMotivosParada);
router.get('/:id/refugo_motivos', MaquinaController.obterRefugosMaquina);
router.get('/:id/setup_motivos', MaquinaController.obterTopMotivosParada); // Usando top-motivos por enquanto como fallback
router.get('/:id/oee', MaquinaController.obterResumoOeeMaquina);
router.get('/:id/oee_evolucao', MaquinaController.obterEvolucaoOeeMaquina);
router.get('/:id/velocidade', MaquinaController.obterVelocidadeMaquina);
router.get('/:id/historico-eventos', MaquinaController.obterHistoricoEventosTabela);

router.get('/:id', MaquinaController.buscarMaquinaPorId);
router.put('/:id', uploadImagens.single('imagem'), handleUploadError, MaquinaController.atualizarMaquina);
router.put('/:id/status', MaquinaController.atualizarStatus);
router.delete('/:id', MaquinaController.deletarMaquina);

export default router;