import { Router } from 'express';
import MaquinaController from '../controllers/MaquinaController.js';
import { authMiddleware, adminMiddleware, gestorOuAdminMiddleware } from '../middlewares/authMiddleware.js';
import { aplicarEscopoGestor, autorizarMaquinaParam, autorizarSetorParam, autorizarUsuarioParam } from '../middlewares/setorAccessMiddleware.js';
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js';
import { uploadImagensCloudinary, handleUploadError } from '../middlewares/uploadMiddleware.js';
import multer from 'multer';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.get('/', aplicarEscopoGestor, paginacaoMiddleware, MaquinaController.listarMaquinas);
router.post('/criarMaquina', adminMiddleware, uploadImagensCloudinary.single('imagem'), handleUploadError, MaquinaController.criarMaquina);

router.get('/dashboard/status-geral', aplicarEscopoGestor, MaquinaController.obterStatusGeralMaquinas);
router.get('/dashboard/taxa-cumprimento-meta-setor', aplicarEscopoGestor, MaquinaController.taxaCumprimentoMetaPorSetor);
router.get('/dashboard/obter-pecas-por-minuto', aplicarEscopoGestor, MaquinaController.obterPecasPorMinuto)
router.get('/dashboard/obter-tempo-parada-maquinas', aplicarEscopoGestor, MaquinaController.obterMediaParadasPorDia)
router.get('/dashboard/obter-producao-total-maquinas', aplicarEscopoGestor, MaquinaController.obterProducaoTotalMaquinas)

router.get('/dashboard/pecasProduzidas7dias/:id_setor', autorizarSetorParam('id_setor'), MaquinaController.pecasProduzidas7Dias)
router.get('/statusMaquinas/:id_setor', autorizarSetorParam('id_setor'), MaquinaController.statusMaquinas)
router.get('/producaoMaquinas/:id_setor', autorizarSetorParam('id_setor'), MaquinaController.producaoMaquinas)

router.post('/cadastro-lote', authMiddleware, adminMiddleware, upload.single('file'), MaquinaController.cadastroLote);

router.get('/status/:status', aplicarEscopoGestor, MaquinaController.listarMaquinasPorStatus);
router.get('/setor/:id_setor/disponiveis', autorizarSetorParam('id_setor'), MaquinaController.listarMaquinasDisponiveisPorTurno);
router.get('/setor/:id_setor', autorizarSetorParam('id_setor'), MaquinaController.listarMaquinasPorSetor);
router.get('/obter-maquina-operador/:id_operador', autorizarUsuarioParam('id_operador'), MaquinaController.obterMaquinaOperador)

router.get('/:id/top-motivos-parada', autorizarMaquinaParam('id'), MaquinaController.obterTopMotivosParada);
router.get('/:id/refugo_motivos', autorizarMaquinaParam('id'), MaquinaController.obterRefugosMaquina);
router.get('/:id/setup_motivos', autorizarMaquinaParam('id'), MaquinaController.obterTopMotivosParada); // Usando top-motivos por enquanto como fallback
router.get('/:id/oee', autorizarMaquinaParam('id'), MaquinaController.obterResumoOeeMaquina);
router.get('/:id/oee_evolucao', autorizarMaquinaParam('id'), MaquinaController.obterEvolucaoOeeMaquina);
router.get('/:id/velocidade', autorizarMaquinaParam('id'), MaquinaController.obterVelocidadeMaquina);
router.get('/:id/historico-eventos', autorizarMaquinaParam('id'), MaquinaController.obterHistoricoEventosTabela);

router.get('/eficienciaMaquina/:id_operador', autorizarUsuarioParam('id_operador'), MaquinaController.eficienciaMaquina)

// Pareamento / Sincronização de placa (ESP32)
router.post('/:id/sincronizar-placa', gestorOuAdminMiddleware, autorizarMaquinaParam('id'), MaquinaController.iniciarSincronizacaoPlaca);
router.get('/:id/sincronizacao-placa', gestorOuAdminMiddleware, autorizarMaquinaParam('id'), MaquinaController.obterStatusSincronizacaoPlaca);
router.post('/:id/parar-sincronizacao', gestorOuAdminMiddleware, autorizarMaquinaParam('id'), MaquinaController.pararSincronizacaoPlaca);
router.post('/:id/desconectar-placa', gestorOuAdminMiddleware, autorizarMaquinaParam('id'), MaquinaController.desconectarPlacaMaquina);

router.get('/:id', autorizarMaquinaParam('id'), MaquinaController.buscarMaquinaPorId);
router.put('/:id', adminMiddleware, uploadImagensCloudinary.single('imagem'), handleUploadError, MaquinaController.atualizarMaquina);
router.put('/:id/status', autorizarMaquinaParam('id'), MaquinaController.atualizarStatus);
router.delete('/:id', adminMiddleware, MaquinaController.deletarMaquina);

export default router;
