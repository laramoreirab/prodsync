import prisma from '../config/prisma.js';

class NotificacaoModel {
    static tipoPorStatus(status) {
        if (status === 'Setup') return 'Maquina_Setup';
        if (status === 'Parada') return 'Maquina_Parada';
        return null;
    }

    static async obterAdministradores(id_empresa) {
        const administradores = await prisma.usuarios.findMany({
            where: { id_empresa, tipo: 'Adm' },
            select: { id_usuario: true },
        });

        return administradores.map((adm) => adm.id_usuario);
    }

    static async usuarioDeveReceberEvento(id_empresa, id_usuario, tipoUsuario, evento) {
        if (tipoUsuario === 'Adm') return true;

        if (tipoUsuario === 'Gestor') {
            const setores = await prisma.setor_Gestor.findMany({
                where: { id_empresa, id_gestor: Number(id_usuario) },
                select: { id_setor: true },
            });
            return setores.some((s) => s.id_setor === evento.setor_afetado);
        }

        if (tipoUsuario === 'Operador') {
            const idMaquinaOperador = await this.obterMaquinaDoOperador(id_empresa, id_usuario);
            return idMaquinaOperador === evento.id_maquina;
        }

        return false;
    }

    static async sincronizarEventosPendentes(id_empresa, id_usuario, tipoUsuario) {
        const eventosPendentes = await prisma.historico_Eventos.findMany({
            where: {
                id_empresa,
                id_motivo_parada: null,
                status_atual: { in: ['Parada', 'Setup'] },
            },
            include: {
                maquina: { select: { nome: true } },
            },
            orderBy: { inicio: 'desc' },
        });

        for (const evento of eventosPendentes) {
            const deveReceber = await this.usuarioDeveReceberEvento(
                id_empresa,
                id_usuario,
                tipoUsuario,
                evento
            );
            if (!deveReceber) continue;

            const tipo = this.tipoPorStatus(evento.status_atual);
            if (!tipo) continue;

            const statusLabel = evento.status_atual;
            const nomeMaquina = evento.maquina?.nome ?? `Máquina ${evento.id_maquina}`;

            await this.criarUnicaPorEvento({
                id_empresa,
                id_destinatario: id_usuario,
                tipo,
                titulo: `Máquina em ${statusLabel}`,
                mensagem: `A máquina ${nomeMaquina} está em ${statusLabel} e aguarda justificativa.`,
                id_evento: evento.id_evento,
                id_maquina: evento.id_maquina,
            });
        }
    }
    static formatar(notificacao) {
        return {
            id: notificacao.id_notificacao,
            id_notificacao: notificacao.id_notificacao,
            tipo: notificacao.tipo,
            titulo: notificacao.titulo,
            mensagem: notificacao.mensagem,
            id_evento: notificacao.id_evento,
            id_maquina: notificacao.id_maquina,
            lida: notificacao.lida,
            criado_em: notificacao.criado_em,
            maquina: notificacao.maquina?.nome ?? null,
            status_evento: notificacao.evento?.status_atual ?? null,
            solicitado_pelo_adm: notificacao.tipo === 'Solicitar_Justificativa',
        };
    }

    static async obterMaquinaDoOperador(id_empresa, id_operador) {
        const escala = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador),
                id_maquina: { not: null },
            },
            select: { id_maquina: true },
        });

        if (escala?.id_maquina) return escala.id_maquina;

        const maquina = await prisma.maquinas.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador),
                ativo: true,
            },
            select: { id_maquina: true },
        });

        return maquina?.id_maquina ?? null;
    }

    static async obterOperadorMaquina(id_empresa, id_maquina) {
        const maquina = await prisma.maquinas.findFirst({
            where: { id_empresa, id_maquina: Number(id_maquina) },
            select: { id_operador: true, id_setor: true },
        });

        if (maquina?.id_operador) return maquina.id_operador;

        const escalaMaquina = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa,
                id_maquina: Number(id_maquina),
            },
            select: { id_operador: true },
        });

        if (escalaMaquina?.id_operador) return escalaMaquina.id_operador;

        if (maquina?.id_setor) {
            const escalaSetor = await prisma.escalaTrabalho.findFirst({
                where: {
                    id_empresa,
                    id_setor: maquina.id_setor,
                    id_maquina: { not: null },
                },
                select: { id_operador: true },
            });

            if (escalaSetor?.id_operador) return escalaSetor.id_operador;
        }

        return null;
    }

    static async obterGestoresSetor(id_empresa, id_setor) {
        if (!id_setor) return [];

        const gestores = await prisma.setor_Gestor.findMany({
            where: {
                id_empresa,
                id_setor: Number(id_setor),
            },
            select: { id_gestor: true },
        });

        return gestores.map((g) => g.id_gestor);
    }

    static async criar({
        id_empresa,
        id_destinatario,
        tipo,
        titulo,
        mensagem,
        id_evento = null,
        id_maquina = null,
    }) {
        const notificacao = await prisma.notificacoes.create({
            data: {
                id_empresa,
                id_destinatario: Number(id_destinatario),
                tipo,
                titulo,
                mensagem,
                id_evento: id_evento ? Number(id_evento) : null,
                id_maquina: id_maquina ? Number(id_maquina) : null,
            },
            include: {
                maquina: { select: { nome: true } },
                evento: { select: { status_atual: true } },
            },
        });

        return this.formatar(notificacao);
    }

    static async criarUnicaPorEvento({
        id_empresa,
        id_destinatario,
        tipo,
        titulo,
        mensagem,
        id_evento,
        id_maquina = null,
        apenasNaoLida = false,
    }) {
        if (!id_evento) {
            return this.criar({
                id_empresa,
                id_destinatario,
                tipo,
                titulo,
                mensagem,
                id_evento,
                id_maquina,
            });
        }

        return prisma.$transaction(async (tx) => {
            const idDestinatario = Number(id_destinatario);
            const idEvento = Number(id_evento);
            const idMaquina = id_maquina ? Number(id_maquina) : null;
            const lockKey = `notificacao:${id_empresa}:${idDestinatario}:${idEvento}:${tipo}`;

            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

            const existente = await tx.notificacoes.findFirst({
                where: {
                    id_empresa,
                    id_destinatario: idDestinatario,
                    id_evento: idEvento,
                    tipo,
                    ...(apenasNaoLida ? { lida: false } : {}),
                },
                include: {
                    maquina: { select: { nome: true } },
                    evento: { select: { status_atual: true } },
                },
            });

            if (existente) return this.formatar(existente);

            const notificacao = await tx.notificacoes.create({
                data: {
                    id_empresa,
                    id_destinatario: idDestinatario,
                    tipo,
                    titulo,
                    mensagem,
                    id_evento: idEvento,
                    id_maquina: idMaquina,
                },
                include: {
                    maquina: { select: { nome: true } },
                    evento: { select: { status_atual: true } },
                },
            });

            return this.formatar(notificacao);
        });
    }

    static async notificarEventoMaquina(id_empresa, evento, nomeMaquina) {
        const status = evento.status_atual;
        if (!['Parada', 'Setup'].includes(status)) return;

        const tipo = status === 'Parada' ? 'Maquina_Parada' : 'Maquina_Setup';
        const titulo = `Máquina em ${status}`;
        const mensagem = `A máquina ${nomeMaquina} entrou em ${status} e aguarda justificativa.`;

        const destinatarios = new Set();

        const gestores = await this.obterGestoresSetor(id_empresa, evento.setor_afetado);
        gestores.forEach((id) => destinatarios.add(id));

        const administradores = await this.obterAdministradores(id_empresa);
        administradores.forEach((id) => destinatarios.add(id));

        const idOperador = await this.obterOperadorMaquina(id_empresa, evento.id_maquina);
        if (idOperador) destinatarios.add(idOperador);

        const criadas = [];
        for (const id_destinatario of destinatarios) {
            const notificacao = await this.criarUnicaPorEvento({
                id_empresa,
                id_destinatario,
                tipo,
                titulo,
                mensagem,
                id_evento: evento.id_evento,
                id_maquina: evento.id_maquina,
            });
            criadas.push(notificacao);
        }

        return criadas;
    }

    static async solicitarJustificativa(id_empresa, id_evento, solicitante) {
        const evento = await prisma.historico_Eventos.findFirst({
            where: { id_empresa, id_evento: Number(id_evento) },
            include: {
                maquina: { select: { id_maquina: true, nome: true, id_setor: true } },
            },
        });

        if (!evento) {
            throw new Error('Evento não encontrado');
        }

        if (evento.id_motivo_parada) {
            throw new Error('Evento ja justificado');
        }

        if (!['Parada', 'Setup'].includes(evento.status_atual)) {
            throw new Error('Evento nao requer justificativa');
        }

        if (solicitante.tipo === 'Gestor') {
            const setores = await prisma.setor_Gestor.findMany({
                where: {
                    id_empresa,
                    id_gestor: solicitante.id_usuario,
                },
                select: { id_setor: true },
            });
            const setoresIds = setores.map((s) => s.id_setor);
            const setorEvento = evento.setor_afetado ?? evento.maquina?.id_setor;
            if (!setoresIds.includes(setorEvento)) {
                throw new Error('Gestor sem permissão para este setor');
            }
        }

        const idOperador = await this.obterOperadorMaquina(id_empresa, evento.id_maquina);
        if (!idOperador) {
            throw new Error('Nenhum operador vinculado à máquina deste evento');
        }

        const nomeMaquina = evento.maquina?.nome ?? `Máquina ${evento.id_maquina}`;
        const statusLabel = evento.status_atual === 'Setup' ? 'Setup' : 'Parada';

        return this.criarUnicaPorEvento({
            id_empresa,
            id_destinatario: idOperador,
            tipo: 'Solicitar_Justificativa',
            titulo: 'Justificativa solicitada',
            mensagem: `${solicitante.nome ?? 'Administrador'} solicitou justificativa do evento de ${statusLabel} na máquina ${nomeMaquina}.`,
            id_evento: evento.id_evento,
            id_maquina: evento.id_maquina,
            apenasNaoLida: true,
        });
    }

    static async listarPorUsuario(id_empresa, id_usuario, tipoUsuario, { apenasNaoLidas = false, limite = 20 } = {}) {
        await this.sincronizarEventosPendentes(id_empresa, id_usuario, tipoUsuario);

        const notificacoes = await prisma.notificacoes.findMany({
            where: {
                id_empresa,
                id_destinatario: Number(id_usuario),
                ...(apenasNaoLidas ? { lida: false } : {}),
            },
            include: {
                maquina: { select: { nome: true } },
                evento: { select: { status_atual: true } },
            },
            orderBy: { criado_em: 'desc' },
            take: limite,
        });

        return notificacoes.map((n) => this.formatar(n));
    }

    static async contarNaoLidas(id_empresa, id_usuario, tipoUsuario) {
        await this.sincronizarEventosPendentes(id_empresa, id_usuario, tipoUsuario);

        return prisma.notificacoes.count({
            where: {
                id_empresa,
                id_destinatario: Number(id_usuario),
                lida: false,
            },
        });
    }

    static async marcarComoLida(id_empresa, id_usuario, id_notificacao) {
        const existente = await prisma.notificacoes.findFirst({
            where: {
                id_notificacao: Number(id_notificacao),
                id_empresa,
                id_destinatario: Number(id_usuario),
            },
        });

        if (!existente) {
            throw new Error('Notificação não encontrada');
        }

        const atualizada = await prisma.notificacoes.update({
            where: { id_notificacao: existente.id_notificacao },
            data: { lida: true, lida_em: new Date() },
            include: {
                maquina: { select: { nome: true } },
                evento: { select: { status_atual: true } },
            },
        });

        return this.formatar(atualizada);
    }

    static async marcarTodasComoLidas(id_empresa, id_usuario) {
        await prisma.notificacoes.updateMany({
            where: {
                id_empresa,
                id_destinatario: Number(id_usuario),
                lida: false,
            },
            data: { lida: true, lida_em: new Date() },
        });

        return { sucesso: true };
    }

    static async marcarEventoComoResolvido(id_empresa, id_evento) {
        await prisma.notificacoes.updateMany({
            where: {
                id_empresa,
                id_evento: Number(id_evento),
                lida: false,
            },
            data: { lida: true, lida_em: new Date() },
        });

        return { sucesso: true };
    }

    static async excluir(id_empresa, id_usuario, id_notificacao) {
        const existente = await prisma.notificacoes.findFirst({
            where: {
                id_notificacao: Number(id_notificacao),
                id_empresa,
                id_destinatario: Number(id_usuario),
            },
        });

        if (!existente) {
            throw new Error('Notificação não encontrada');
        }

        await prisma.notificacoes.delete({
            where: { id_notificacao: existente.id_notificacao },
        });

        return { sucesso: true };
    }
}

export default NotificacaoModel;
