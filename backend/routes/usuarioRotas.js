import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import UsuarioController from '../controllers/UsuarioController.js'
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js'
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js'

const router = Router()

// Aplica autenticação em todas as rotas
router.use(authMiddleware)

// ─── CRUD de Usuários (ADM) ────
// GET  /api/usuarios ──── listar todos os usuários (paginado)
router.get('/', paginacaoMiddleware, UsuarioController.listarUsuarios)

// GET  /api/usuarios/:id ──── buscar usuário por id
router.get('/:id', UsuarioController.buscarPorId)

// POST /api/usuarios ──── criar novo usuário (com upload de foto opcional)
router.post('/', uploadImagens.single('foto'), handleUploadError, UsuarioController.criarUsuario)

// PUT  /api/usuarios ──── atualizar usuário (id_usuario no body, foto opcional)
router.put('/', uploadImagens.single('foto'), handleUploadError, UsuarioController.atualizarUsuario)

// DELETE /api/usuarios ──── excluir usuário (id_usuario no body)
router.delete('/', UsuarioController.deletarUsuario)

// ─── Dashboards de Usuários ───
router.get('/dashboard/quantidade_por_perfil', UsuarioController.qtdDeUsuariosTipo)
router.get('/dashboard/quantidade_por_setor', UsuarioController.qtdUsuariosPorSetor)
router.get('/dashboard/top_operadores', UsuarioController.top5Operadores)
router.get('/dashboard/tempo_sessao', UsuarioController.tempoMedioSessaoTipo)
router.get('/dashboard/rotatividade', UsuarioController.rotatividade)
router.get('/dashboard/producao_media_por_setor', UsuarioController.producaoMediaPorDiaSetor)

// ─── Rotas de Operador ───
router.get('/operadores/:id_setor', UsuarioController.listarOperadoresporSetor)
router.get('/:id/producao_por_hora', UsuarioController.getProducaoPorHora)
router.get('/:id/produtividade_dia', UsuarioController.getProdutividadeDia)
router.get('/:id/qualidade', UsuarioController.getQualidade)
router.get('/:id/velocimetro', UsuarioController.getVelocimetro)
router.get('/:id/pecas_por_dia', UsuarioController.getPecasPorDia)
router.get('/:id/oee', UsuarioController.getOEE)
router.get('/:id/meta', UsuarioController.metaProducao)
router.get('/:id/tempo_parado_tempo_produzindo_operador', UsuarioController.tempoParadoTempoProduzindoUsuario)
router.get('/:id/oee_maquina', UsuarioController.getOEEMaquina)
router.get('/:id/maquina_oee_detalhes', UsuarioController.getOEEMaquinaDetalhes)

export default router