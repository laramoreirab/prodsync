import NotificacaoModel from '../models/NotificacaoModel.js';
import prisma from '../config/prisma.js';

class NotificacaoController {
    static async listar(req, res) {
        try {
            const { id_empresa, id_usuario } = req.user;
            const apenasNaoLidas = req.query.nao_lidas === 'true';

            const dados = await NotificacaoModel.listarPorUsuario(
                id_empresa,
                id_usuario,
                req.user.tipo,
                {
                    apenasNaoLidas,
                    limite: Number(req.query.limite) || 20,
                }
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar notificações:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar as notificações',
            });
        }
    }

    static async contagem(req, res) {
        try {
            const { id_empresa, id_usuario } = req.user;
            const total = await NotificacaoModel.contarNaoLidas(
                id_empresa,
                id_usuario,
                req.user.tipo
            );

            return res.status(200).json({ sucesso: true, dados: { total } });
        } catch (error) {
            console.error('Erro ao contar notificações:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível contar as notificações',
            });
        }
    }

    static async marcarLida(req, res) {
        try {
            const { id_empresa, id_usuario } = req.user;
            const dados = await NotificacaoModel.marcarComoLida(
                id_empresa,
                id_usuario,
                req.params.id
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            if (error.message === 'Notificação não encontrada') {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Não encontrada',
                    mensagem: error.message,
                });
            }

            console.error('Erro ao marcar notificação como lida:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar a notificação',
            });
        }
    }

    static async marcarTodasLidas(req, res) {
        try {
            const { id_empresa, id_usuario } = req.user;
            await NotificacaoModel.marcarTodasComoLidas(id_empresa, id_usuario);

            return res.status(200).json({ sucesso: true, mensagem: 'Todas as notificações foram marcadas como lidas' });
        } catch (error) {
            console.error('Erro ao marcar todas notificações:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar as notificações',
            });
        }
    }

    static async excluir(req, res) {
        try {
            const { id_empresa, id_usuario } = req.user;
            await NotificacaoModel.excluir(id_empresa, id_usuario, req.params.id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Notificação excluída com sucesso',
            });
        } catch (error) {
            if (error.message === 'Notificação não encontrada') {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Não encontrada',
                    mensagem: error.message,
                });
            }

            console.error('Erro ao excluir notificação:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir a notificação',
            });
        }
    }

    static async solicitarJustificativa(req, res) {
        try {
            const { id_evento } = req.body;

            if (!id_evento) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    mensagem: 'id_evento é obrigatório',
                });
            }

            if (!['Adm', 'Gestor'].includes(req.user.tipo)) {
                return res.status(403).json({
                    sucesso: false,
                    erro: 'Acesso negado',
                    mensagem: 'Apenas administradores e gestores podem solicitar justificativa',
                });
            }

            const usuario = await prisma.usuarios.findFirst({
                where: { id_usuario: req.user.id_usuario },
                select: { nome: true },
            });

            const dados = await NotificacaoModel.solicitarJustificativa(
                req.user.id_empresa,
                id_evento,
                { ...req.user, nome: usuario?.nome }
            );

            return res.status(201).json({
                sucesso: true,
                dados,
                mensagem: 'Justificativa solicitada ao operador com sucesso',
            });
        } catch (error) {
            if (error.message === 'Evento não encontrado') {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Não encontrado',
                    mensagem: error.message,
                });
            }

            if (
                error.message === 'Gestor sem permissão para este setor' ||
                error.message === 'Nenhum operador vinculado à máquina deste evento'
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Operação inválida',
                    mensagem: error.message,
                });
            }

            console.error('Erro ao solicitar justificativa:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível solicitar a justificativa',
            });
        }
    }
}

export default NotificacaoController;
