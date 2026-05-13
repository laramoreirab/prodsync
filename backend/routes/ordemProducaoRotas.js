import { Router } from 'express';
import OrdemProducaoController from '../controllers/OrdemProducaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Rotas de CRUD básico
router.get('/', paginacaoMiddleware, OrdemProducaoController.listarTodos);
router.post('/', OrdemProducaoController.criar);
router.put('/:id_ordem', OrdemProducaoController.atualizar);
router.delete('/:id_ordem', OrdemProducaoController.deletar);

// Rotas de KPIs
router.get('/kpi/ativas', OrdemProducaoController.totalOPsAtivas);
router.get('/kpi/atrasadas', OrdemProducaoController.totalOPsAtrasadas);
router.get('/kpi/pecas-boas', OrdemProducaoController.totalPecasBoas);
router.get('/kpi/refugo', OrdemProducaoController.totalRefugo);

// Rotas de Dashboard específico de OP
router.get('/dashboard/progresso/:id_ordem', OrdemProducaoController.progressoOP);
router.get('/dashboard/eficiencia', OrdemProducaoController.eficienciaGeral);
router.get('/dashboard/top-refugo', OrdemProducaoController.top3OPsMaiorRefugo);
router.get('/dashboard/carga-setor', OrdemProducaoController.cargaPorSetor);
router.get('/dashboard/status', OrdemProducaoController.statusOPs);
router.get('/dashboard/concluidas-dia', OrdemProducaoController.opsConcluídasPorDia);


export default router;