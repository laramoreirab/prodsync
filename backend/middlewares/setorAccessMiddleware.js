import prisma from '../config/prisma.js';

async function obterSetoresGeridos(req) {
    if (req.user.tipo !== 'Gestor') return [];

    if (req.gestorSetores) return req.gestorSetores;

    const setores = await prisma.setor_Gestor.findMany({
        where: {
            id_empresa: Number(req.user.id_empresa),
            id_gestor: Number(req.user.id_usuario)
        },
        select: { id_setor: true }
    });

    req.gestorSetores = setores.map((setor) => setor.id_setor);
    req.setorAutorizadoId = req.gestorSetores[0] ?? null;
    req.user.id_setor = req.setorAutorizadoId;

    return req.gestorSetores;
}

function negarSetor(res) {
    return res.status(403).json({
        sucesso: false,
        erro: 'Acesso negado',
        mensagem: 'Gestor sem permissao para acessar dados deste setor'
    });
}

function negarOperador(res) {
    return res.status(403).json({
        sucesso: false,
        erro: 'Acesso negado',
        mensagem: 'Operador sem permissao para acessar dados desta maquina'
    });
}

async function aplicarEscopoGestor(req, res, next) {
    try {
        if (req.user.tipo !== 'Gestor') return next();

        const setores = await obterSetoresGeridos(req);
        if (setores.length === 0) return negarSetor(res);

        req.query.setorId = String(req.setorAutorizadoId);
        req.query.id_setor = String(req.setorAutorizadoId);
        if (req.path.startsWith('/status_maquinas') || req.path.startsWith('/ranking_produtividade') || req.path.startsWith('/secoes')) {
            req.query.scope = 'sector';
        }
        return next();
    } catch (error) {
        console.error('Erro ao aplicar escopo do gestor:', error);
        return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
    }
}

function autorizarSetorParam(nomeParam = 'id_setor') {
    return async (req, res, next) => {
        try {
            if (req.user.tipo !== 'Gestor') return next();

            const setores = await obterSetoresGeridos(req);
            const idSetor = Number(req.params[nomeParam] ?? req.body[nomeParam] ?? req.query[nomeParam]);

            if (!Number.isInteger(idSetor) || !setores.includes(idSetor)) {
                return negarSetor(res);
            }

            req.query.setorId = String(idSetor);
            return next();
        } catch (error) {
            console.error('Erro ao validar setor do gestor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    };
}

function autorizarMaquinaParam(nomeParam = 'id') {
    return async (req, res, next) => {
        try {
            if (req.user.tipo === 'Operador') {
                const idMaquina = Number(req.params[nomeParam] ?? req.body[nomeParam] ?? req.query[nomeParam]);

                const escala = Number.isInteger(idMaquina)
                    ? await prisma.escalaTrabalho.findFirst({
                        where: {
                            id_empresa: Number(req.user.id_empresa),
                            id_operador: Number(req.user.id_usuario),
                            id_maquina: idMaquina
                        },
                        select: { id_maquina: true }
                    })
                    : null;

                if (!escala) return negarOperador(res);
                return next();
            }

            if (req.user.tipo !== 'Gestor') return next();

            const setores = await obterSetoresGeridos(req);
            const idMaquina = Number(req.params[nomeParam] ?? req.body[nomeParam] ?? req.query[nomeParam]);

            const maquina = Number.isInteger(idMaquina)
                ? await prisma.maquinas.findFirst({
                    where: {
                        id_empresa: Number(req.user.id_empresa),
                        id_maquina: idMaquina,
                        id_setor: { in: setores },
                        ativo: true
                    },
                    select: { id_setor: true }
                })
                : null;

            if (!maquina) return negarSetor(res);

            req.query.setorId = String(maquina.id_setor);
            return next();
        } catch (error) {
            console.error('Erro ao validar maquina do gestor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    };
}

function autorizarOrdemParam(nomeParam = 'id_ordem') {
    return async (req, res, next) => {
        try {
            if (req.user.tipo !== 'Gestor') return next();

            const setores = await obterSetoresGeridos(req);
            const idOrdem = Number(req.params[nomeParam] ?? req.body[nomeParam] ?? req.query[nomeParam]);

            const ordem = Number.isInteger(idOrdem)
                ? await prisma.ordemProducao.findFirst({
                    where: {
                        id_empresa: Number(req.user.id_empresa),
                        id_ordem: idOrdem,
                        id_setor: { in: setores }
                    },
                    select: { id_setor: true }
                })
                : null;

            if (!ordem) return negarSetor(res);

            req.query.setorId = String(ordem.id_setor);
            return next();
        } catch (error) {
            console.error('Erro ao validar ordem do gestor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    };
}

function autorizarUsuarioParam(nomeParam = 'id') {
    return async (req, res, next) => {
        try {
            if (req.user.tipo === 'Operador') {
                const idUsuario = Number(req.params[nomeParam] ?? req.body[nomeParam] ?? req.query[nomeParam]);
                return idUsuario === Number(req.user.id_usuario)
                    ? next()
                    : negarOperador(res);
            }

            if (req.user.tipo !== 'Gestor') return next();

            const setores = await obterSetoresGeridos(req);
            const idUsuario = Number(req.params[nomeParam] ?? req.body[nomeParam] ?? req.query[nomeParam]);

            if (idUsuario === Number(req.user.id_usuario)) return next();

            const operador = Number.isInteger(idUsuario)
                ? await prisma.escalaTrabalho.findFirst({
                    where: {
                        id_empresa: Number(req.user.id_empresa),
                        id_operador: idUsuario,
                        id_setor: { in: setores }
                    },
                    select: { id_setor: true }
                })
                : null;

            if (!operador) return negarSetor(res);

            req.query.setorId = String(operador.id_setor);
            return next();
        } catch (error) {
            console.error('Erro ao validar usuario do gestor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    };
}

function autorizarEventoParam(nomeParam = 'id') {
    return async (req, res, next) => {
        try {
            if (req.user.tipo !== 'Gestor') return next();

            const setores = await obterSetoresGeridos(req);
            const idEvento = Number(req.params[nomeParam] ?? req.body.id_evento ?? req.query[nomeParam]);

            const evento = Number.isInteger(idEvento)
                ? await prisma.historico_Eventos.findFirst({
                    where: {
                        id_empresa: Number(req.user.id_empresa),
                        id_evento: idEvento,
                        setor_afetado: { in: setores }
                    },
                    select: { setor_afetado: true }
                })
                : null;

            if (!evento) return negarSetor(res);

            req.query.setorId = String(evento.setor_afetado);
            return next();
        } catch (error) {
            console.error('Erro ao validar evento do gestor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    };
}

function autorizarMaquinasBody(nomeCampo = 'maquinas') {
    return async (req, res, next) => {
        try {
            if (req.user.tipo !== 'Gestor') return next();

            const setores = await obterSetoresGeridos(req);
            const ids = Array.isArray(req.body[nomeCampo])
                ? req.body[nomeCampo].map(Number).filter((id) => Number.isInteger(id) && id > 0)
                : [];

            if (ids.length === 0) return negarSetor(res);

            const total = await prisma.maquinas.count({
                where: {
                    id_empresa: Number(req.user.id_empresa),
                    id_maquina: { in: ids },
                    id_setor: { in: setores },
                    ativo: true
                }
            });

            if (total !== ids.length) return negarSetor(res);

            return next();
        } catch (error) {
            console.error('Erro ao validar maquinas do gestor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    };
}

function validarBodySetorGestor(nomeCampo = 'id_setor') {
    return async (req, res, next) => {
        try {
            if (req.user.tipo !== 'Gestor') return next();

            const setores = await obterSetoresGeridos(req);
            const idSetor = Number(req.body[nomeCampo] ?? req.query[nomeCampo] ?? req.query.setorId);

            if (!Number.isInteger(idSetor) || !setores.includes(idSetor)) {
                return negarSetor(res);
            }

            req.body[nomeCampo] = idSetor;
            req.query.setorId = String(idSetor);
            return next();
        } catch (error) {
            console.error('Erro ao validar setor no corpo da requisicao:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    };
}

export {
    aplicarEscopoGestor,
    autorizarSetorParam,
    autorizarMaquinaParam,
    autorizarOrdemParam,
    autorizarUsuarioParam,
    autorizarEventoParam,
    autorizarMaquinasBody,
    validarBodySetorGestor,
    obterSetoresGeridos
};
