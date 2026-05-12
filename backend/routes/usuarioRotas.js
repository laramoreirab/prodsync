import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import UsuarioController from '../controllers/UsuarioController.js'

const router = Router()

// Rotas de Dashboard do Operador
router.get('/', authMiddleware, UsuarioController.listarUsuarios)
router.get('/listarSemAdms', authMiddleware, UsuarioController.listarSemAdms)
router.get('/dashboard/qtdUsuariosPorTipo', authMiddleware, UsuarioController.qtdDeUsuariosTipo)
router.get('/dashboard/qtdUsuariosPorSetor', authMiddleware, UsuarioController.qtdUsuariosPorSetor)
router.get('/dashboard/top5Operadores', authMiddleware, UsuarioController.top5Operadores)
router.get('/dashboard/tempo-medio-sessao-perfil',authMiddleware, UsuarioController.tempoMedioSessaoTipo)
router.get('/dashboard/rotatividadeUsuarios', authMiddleware, UsuarioController.rotatividade )
router.get('/dashboard/producaoMediaPorSetor', authMiddleware, UsuarioController.producaoMediaPorDiaSetor)
router.get('/dashboard/metaProducaoPorSetor', authMiddleware, UsuarioController.metaProducaoPorSetor)
router.get('/criar', authMiddleware, UsuarioController.criarUsuario)
router.get('/:id', authMiddleware, UsuarioController.buscarPorId)
router.get('/:id/deletar', authMiddleware, UsuarioController.deletarUsuario)
router.get('/:id/atualizar', authMiddleware, UsuarioController.atualizarUsuario)
router.get('/operadores/:id_setor', authMiddleware, UsuarioController.listarOperadoresporSetor)
router.get('/:id/producao_por_hora', authMiddleware, UsuarioController.getProducaoPorHora);
router.get('/:id/produtividade_dia', authMiddleware, UsuarioController.getProdutividadeDia);
router.get('/:id/qualidade', authMiddleware, UsuarioController.getQualidade);
router.get('/:id/velocimetro', authMiddleware, UsuarioController.getVelocimetro);
router.get('/:id/pecas_por_dia', authMiddleware, UsuarioController.getPecasPorDia);
router.get('/:id/meta', authMiddleware, UsuarioController.metaProducao);
router.get('/:id/tempo_parado_tempo_produzindo_operador', authMiddleware, UsuarioController.tempoParadoTempoProduzindoUsuario);

export default router