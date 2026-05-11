import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import UsuarioController from '../controllers/UsuarioController.js'

const router = Router()

// Rotas de Dashboard do Operador
router.get('/:id/producao_por_hora', authMiddleware, UsuarioController.getProducaoPorHora);
router.get('/:id/produtividade_dia', authMiddleware, UsuarioController.getProdutividadeDia);
router.get('/:id/qualidade', authMiddleware, UsuarioController.getQualidade);
router.get('/:id/velocimetro', authMiddleware, UsuarioController.getVelocimetro);
router.get('/:id/pecas_por_dia', authMiddleware, UsuarioController.getPecasPorDia);
router.get('/:id/oee', authMiddleware, UsuarioController.getOEE);
router.get('/:id/meta', authMiddleware, UsuarioController.metaProducao);
router.get('/:id/tempo_parado_tempo_produzindo_operador', authMiddleware, UsuarioController.tempoParadoTempoProduzindoUsuario);
router.get('/:id/oee_maquina', authMiddleware, UsuarioController.getOEEMaquina);
router.get('/:id/maquina_oee_detalhes', authMiddleware, UsuarioController.getOEEMaquinaDetalhes);

export default router