import { Router } from 'express';
import OrdemProducaoController from '../controllers/OrdemProducaoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';
import { aplicarEscopoGestor, autorizarOrdemParam, validarBodySetorGestor } from '../middlewares/setorAccessMiddleware.js';
import multer from 'multer';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

// Rotas de CRUD básico
router.get('/kpi/ativas', aplicarEscopoGestor, OrdemProducaoController.totalOPsAtivas);
router.get('/kpi/atrasadas', aplicarEscopoGestor, OrdemProducaoController.totalOPsAtrasadas);
router.get('/kpi/pecas-boas', aplicarEscopoGestor, OrdemProducaoController.totalPecasBoas);
router.get('/kpi/refugo', aplicarEscopoGestor, OrdemProducaoController.totalRefugo);

// Rotas de Dashboard específico de OP
router.get('/dashboard/progresso/:id_ordem', autorizarOrdemParam('id_ordem'), OrdemProducaoController.progressoOP);
router.get('/dashboard/eficiencia', aplicarEscopoGestor, OrdemProducaoController.eficienciaGeral);
router.get('/dashboard/top-refugo', aplicarEscopoGestor, OrdemProducaoController.top3OPsMaiorRefugo);
router.get('/dashboard/carga-setor', aplicarEscopoGestor, OrdemProducaoController.cargaPorSetor);
router.get('/dashboard/status', aplicarEscopoGestor, OrdemProducaoController.statusOPs);
router.get('/dashboard/concluidas-dia', aplicarEscopoGestor, OrdemProducaoController.opsConcluidasPorDia);

router.post('/cadastro-lote', authMiddleware, adminMiddleware, upload.single('file'), OrdemProducaoController.cadastroLote);

router.get('/', aplicarEscopoGestor, paginacaoMiddleware, OrdemProducaoController.listarTodos);
router.post('/', validarBodySetorGestor('id_setor'), OrdemProducaoController.criar);
router.get('/:id_ordem/historico-eventos', autorizarOrdemParam('id_ordem'), OrdemProducaoController.listarHistoricoEventos);
router.get('/:id_ordem/apontamentos', autorizarOrdemParam('id_ordem'), OrdemProducaoController.listarApontamentos);
router.get('/:id_ordem', autorizarOrdemParam('id_ordem'), OrdemProducaoController.buscarPorId);
router.put('/:id_ordem', autorizarOrdemParam('id_ordem'), validarBodySetorGestor('id_setor'), OrdemProducaoController.atualizar);
router.delete('/:id_ordem', autorizarOrdemParam('id_ordem'), OrdemProducaoController.deletar);

export default router;
