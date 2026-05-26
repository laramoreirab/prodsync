import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'
import UsuarioController from '../controllers/UsuarioController.js'
import { paginacaoMiddleware } from '../middlewares/paginacaoMiddleware.js'
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js'
import { aplicarEscopoGestor, autorizarSetorParam, autorizarUsuarioParam, validarBodySetorGestor } from '../middlewares/setorAccessMiddleware.js'

const router = Router()

// Rotas de Dashboard do Operador
router.get('/', authMiddleware, aplicarEscopoGestor, UsuarioController.listarUsuarios)
router.get('/listarSemAdms', authMiddleware, UsuarioController.listarSemAdms)
router.get('/dashboard/qtdUsuariosPorTipo', authMiddleware, aplicarEscopoGestor, UsuarioController.qtdDeUsuariosTipo)
router.get('/dashboard/qtdUsuariosPorSetor', authMiddleware, aplicarEscopoGestor, UsuarioController.qtdUsuariosPorSetor)
router.get('/dashboard/top5Operadores', authMiddleware, aplicarEscopoGestor, UsuarioController.top5Operadores)
router.get('/dashboard/tempo-medio-sessao-perfil',authMiddleware, aplicarEscopoGestor, UsuarioController.tempoMedioSessaoTipo)
router.get('/dashboard/rotatividadeUsuarios', authMiddleware, aplicarEscopoGestor, UsuarioController.rotatividade )
router.get('/dashboard/producaoMediaPorSetor', authMiddleware, aplicarEscopoGestor, UsuarioController.producaoMediaPorDiaSetor)
router.get('/dashboard/metaProducaoPorSetor', authMiddleware, aplicarEscopoGestor, UsuarioController.metaProducaoPorSetor)
router.get('/turnos', authMiddleware, aplicarEscopoGestor, UsuarioController.turnosOperadores)
router.get('/taxa_refugo', authMiddleware, aplicarEscopoGestor, UsuarioController.taxaRefugo)
router.get('/producao_media_por_usuario', authMiddleware, aplicarEscopoGestor, UsuarioController.producaoMediaPorUsuario)
router.post('/criar', authMiddleware, uploadImagens.single('imagem_perfil'), handleUploadError, validarBodySetorGestor('id_setor'), UsuarioController.criarUsuario)
router.get('/operadores/:id_setor', authMiddleware, autorizarSetorParam('id_setor'), UsuarioController.listarOperadoresporSetor)
router.get('/:id', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.buscarPorId)
router.delete('/:id/deletar', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.deletarUsuario)
router.put('/:id/atualizar', authMiddleware, autorizarUsuarioParam('id'), uploadImagens.single('imagem_perfil'), handleUploadError, validarBodySetorGestor('id_setor'), UsuarioController.atualizarUsuario)
router.get('/:id/historico-eventos', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.listarHistoricoEventosUsuario)
router.get('/:id/apontamentos', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.listarApontamentosUsuario)
router.get('/:id/producao_por_hora', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.getProducaoPorHora);
router.get('/:id/produtividade_dia', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.getProdutividadeDia);
router.get('/:id/qualidade', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.getQualidade);
router.get('/:id/velocimetro', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.getVelocimetro);
router.get('/:id/pecas_por_dia', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.getPecasPorDia);
router.get('/:id/meta', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.metaProducao);
router.get('/:id/tempo_parado_tempo_produzindo_operador', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.tempoParadoTempoProduzindoUsuario);
router.get('/:id/oee_maquinas', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.getOEEMaquina);
router.get('/:id/maquina_oee_detalhe', authMiddleware, autorizarUsuarioParam('id'), UsuarioController.getOEEMaquinaDetalhes);
router.post('/deletarEmpresa', authMiddleware, adminMiddleware, UsuarioController.deletarEmpresa)

export default router
