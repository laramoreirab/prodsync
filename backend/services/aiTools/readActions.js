import prisma from '../../config/prisma.js';

export const executeTool = async ({ name, args, user }) => {
    const id_empresa = Number(user.id_empresa);

    switch (name) {
        case 'buscar_status_maquinas':
            return await getMachinesStatus(id_empresa, args);
        case 'buscar_resumo_producao':
            return await getProductionSummary(id_empresa, args);
        case 'buscar_eventos_recentes':
            return await getRecentEvents(id_empresa, args);
        case 'buscar_contexto_operacional':
            return await getOperationalContext(id_empresa, args);
        default:
            throw new Error(`Ferramenta não suportada: ${name}`);
    }
};

async function getMachinesStatus(id_empresa, args) {
    const limite = args.limite || 10;
    const maquinas = await prisma.maquinas.findMany({
        where: { id_empresa },
        take: limite,
        select: {
            id_maquina: true,
            nome: true,
            status_atual: true,
            setor: { select: { nome_setor: true } },
            operador: { select: { nome: true } }
        }
    });

    return {
        total: maquinas.length,
        maquinas: maquinas.map(m => ({
            id: m.id_maquina,
            nome: m.nome,
            status: m.status_atual,
            setor: m.setor?.nome_setor,
            operador: m.operador?.nome
        }))
    };
}

async function getProductionSummary(id_empresa, args) {
    const ordens = await prisma.ordemProducao.findMany({
        where: { id_empresa, status_op: { in: ['Em_Andamento', 'Parada', 'Setup'] } },
        include: {
            maquina: { select: { nome: true } }
        }
    });

    return {
        total_ativas: ordens.length,
        ordens: ordens.map(o => ({
            id: o.id_ordem,
            lote: o.codigo_lote,
            produto: o.produto,
            qtd_planejada: o.qtd_planejada,
            status: o.status_op,
            prioridade: o.prioridade,
            maquina: o.maquina.nome
        }))
    };
}

async function getRecentEvents(id_empresa, args) {
    const limite = args.limite || 5;
    const eventos = await prisma.historico_Eventos.findMany({
        where: { id_empresa },
        take: limite,
        orderBy: { inicio: 'desc' },
        include: {
            maquina: { select: { nome: true } },
            motivo_parada: { select: { descricao: true } }
        }
    });

    return {
        eventos: eventos.map(e => ({
            id: e.id_evento,
            maquina: e.maquina.nome,
            status: e.status_atual,
            inicio: e.inicio,
            duracao_minutos: e.duracao,
            motivo: e.motivo_parada?.descricao,
            observacao: e.observacao
        }))
    };
}

async function getOperationalContext(id_empresa, args) {
    const [maquinas, ordens, eventos] = await Promise.all([
        getMachinesStatus(id_empresa, { limite: 20 }),
        getProductionSummary(id_empresa, {}),
        getRecentEvents(id_empresa, { limite: 10 })
    ]);

    return {
        timestamp: new Date().toISOString(),
        resumo: {
            total_maquinas: maquinas.total,
            maquinas_paradas: maquinas.maquinas.filter(m => m.status === 'Parada').length,
            maquinas_produzindo: maquinas.maquinas.filter(m => m.status === 'Produzindo').length,
            ops_ativas: ordens.total_ativas
        },
        maquinas: maquinas.maquinas,
        ordens_principais: ordens.ordens.slice(0, 5),
        eventos_recentes: eventos.eventos
    };
}
