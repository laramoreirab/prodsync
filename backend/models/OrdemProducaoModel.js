import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';
import MaquinaModel from './MaquinaModel.js';

class OrdemProducaoModel {

    static calcularProgresso(produzido, qtd_planejada) {
        const planejado = Number(qtd_planejada) || 0;
        const boas = Number(produzido) || 0;
        if (planejado <= 0) return 0;
        return Math.min(100, Math.round((boas / planejado) * 100));
    }

    static async adicionarIdsExibicaoEmpresa(id_empresa, ordens) {
        if (!Array.isArray(ordens) || ordens.length === 0) return ordens;

        const idsOrdenados = await prisma.ordemProducao.findMany({
            where: {
                id_empresa: Number(id_empresa)
            },
            orderBy: {
                id_ordem: 'asc'
            },
            select: {
                id_ordem: true
            }
        });

        const numeroPorId = new Map(
            idsOrdenados.map((ordem, index) => [ordem.id_ordem, index + 1])
        );

        return ordens.map((ordem) => ({
            ...ordem,
            id_exibicao_empresa: numeroPorId.get(ordem.id_ordem) ?? ordem.id_ordem
        }));
    }

    static async listarTodos(id_empresa, paginacao, setorId = null) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                },
                include: {
                    maquina: {
                        select: {
                            id_maquina: true,
                            nome: true,
                            serie: true,
                            setor: { select: { id_setor: true, nome_setor: true } }
                        }
                    }
                },
                orderBy: {
                    id_ordem: 'asc' // Mantém a lista organizada
                },
            }

            const resultadoPaginado = await paginarPrisma(
                prisma.ordemProducao,
                regrasDaBusca,
                paginacao
            );

            resultadoPaginado.dados = await this.adicionarIdsExibicaoEmpresa(id_empresa, resultadoPaginado.dados);

            const ids = resultadoPaginado.dados.map((ordem) => ordem.id_ordem);
            if (ids.length === 0) return resultadoPaginado;

            const agregados = await prisma.apontamento.groupBy({
                by: ['id_ordemProducao'],
                where: {
                    id_ordemProducao: { in: ids }
                },
                _sum: { qtd_boa: true, qtd_refugo: true }
            });

            const mapaProducao = Object.fromEntries(
                agregados.map((item) => [
                    item.id_ordemProducao,
                    {
                        produzido: item._sum.qtd_boa ?? 0,
                        refugo: item._sum.qtd_refugo ?? 0
                    }
                ])
            );

            resultadoPaginado.dados = resultadoPaginado.dados.map((ordem) => {
                const { produzido = 0, refugo = 0 } = mapaProducao[ordem.id_ordem] ?? {};
                const progresso = OrdemProducaoModel.calcularProgresso(produzido, ordem.qtd_planejada);

                return { ...ordem, produzido, refugo, progresso };
            });

            return resultadoPaginado;
        } catch (error) {
            console.error('Erro ao listar Ordens de Produção:', error);
            throw error;
        }
    }

    static async criar(dados) {
        try {
            const inicio = await this.converterTimestamp(dados.data_inicio)
            const fim = await this.converterTimestamp(dados.data_fim)

            const resultado = await prisma.ordemProducao.create({
                data: {
                    ...dados,
                    data_inicio: inicio,
                    data_fim: fim,
                    observacao_op: dados.observacao_op || ''
                }
            })
            return resultado
        } catch (error) {
            console.error('Erro ao criar Ordem de Produção:', error);
            throw error;
        }
    }
    static async converterTimestamp(timestamp) {
        if (!timestamp) return null
        if (timestamp instanceof Date) return timestamp
        const valorNumerico = Number(timestamp)
        if (Number.isNaN(valorNumerico)) return new Date(timestamp)
        const ms = String(timestamp).length === 10
            ? timestamp * 1000   // veio em segundos → converte
            : timestamp          // veio em milissegundos → usa direto
        return new Date(ms)
        //  ex: 1711461000 → 2024-03-26T14:10:00.000Z
    }
    static async buscarOrdem(id_ordem, id_empresa = null) {
        try {
            const resultado = await prisma.ordemProducao.findFirst({
                where:{
                    id_ordem: Number(id_ordem),
                    ...(id_empresa ? { id_empresa: Number(id_empresa) } : {})
                },
                include: {
                    maquina: {
                        select: {
                            id_maquina: true,
                            nome: true,
                            serie: true,
                            imagem: true,
                            status_atual: true,
                            setor: { select: { id_setor: true, nome_setor: true } },
                            operador: { select: { id_usuario: true, nome: true } }
                        }
                    }
                }
            })

            if (!resultado) return null;

            const agregado = await prisma.apontamento.aggregate({
                where: {
                    id_ordemProducao: Number(id_ordem)
                },
                _sum: { qtd_boa: true, qtd_refugo: true }
            });

            const produzido = agregado._sum.qtd_boa ?? 0;
            const refugo_total = agregado._sum.qtd_refugo ?? 0;

            return {
                ...resultado,
                produzido,
                refugo_total,
                progresso: OrdemProducaoModel.calcularProgresso(produzido, resultado.qtd_planejada)
            };
        } catch (error) {
            console.error('Erro ao buscar Ordem de Produção:', error);
            throw error;
        }
    }

    static async listarEventosOrdem(id_ordem, id_empresa, limite = 50) {
        const where = {
            id_ordemProducao: Number(id_ordem),
            id_empresa: Number(id_empresa)
        };

        const [eventos, idsEventosOrdem] = await Promise.all([
            prisma.historico_Eventos.findMany({
                where,
                include: {
                    motivo_parada: { select: { descricao: true } }
                },
                orderBy: { inicio: 'desc' },
                take: limite
            }),
            prisma.historico_Eventos.findMany({
                where,
                select: { id_evento: true },
                orderBy: { id_evento: 'asc' }
            })
        ]);

        const numeroEventoOrdem = new Map(
            idsEventosOrdem.map((evento, index) => [evento.id_evento, index + 1])
        );

        return eventos.map((evento) => ({
            id: evento.id_evento,
            id_evento: evento.id_evento,
            id_exibicao_op: numeroEventoOrdem.get(evento.id_evento) ?? evento.id_evento,
            numero_evento_op: numeroEventoOrdem.get(evento.id_evento) ?? evento.id_evento,
            tipo: evento.status_atual,
            evento: evento.status_atual,
            inicio: evento.inicio,
            fim: evento.termino,
            duracao_minutos: evento.duracao ?? MaquinaModel.calcularDuracaoMinutos(evento.inicio, evento.termino),
            motivo: evento.motivo_parada?.descricao ?? '-',
            observacao: evento.observacao ?? '-'
        }));
    }

    static async listarApontamentosOrdem(id_ordem, id_empresa, limite = 50) {
        const apontamentos = await prisma.apontamento.findMany({
            where: {
                id_ordemProducao: Number(id_ordem),
                id_empresa: Number(id_empresa)
            },
            include: {
                operador: { select: { id_usuario: true, nome: true } }
            },
            orderBy: { data_hora_inicio: 'desc' },
            take: limite
        });

        return apontamentos.map((ap) => ({
            id: ap.id_apontamento,
            inicio: ap.data_hora_inicio,
            fim: ap.data_hora_fim,
            produzido: String(ap.qtd_boa ?? 0),
            refugo: String(ap.qtd_refugo ?? 0),
            observacao: ap.observacao || '-',
            operador: ap.operador?.nome ?? '-',
            id_operador: ap.operador?.id_usuario ?? null
        }));
    }
    static async buscarOrdemAtiva(id_maquina) {
        //retorna o ID da ordem de prodção pelo ID da máquina
        try {
            const ordem = await prisma.ordemProducao.findFirst({
                where:{
                    id_maquina: id_maquina,
                    status_op: { in: ['Em_Andamento', 'Parada', 'Setup'] }
                },
                select: {
                    id_ordem: true
                }
            })
            return ordem?.id_ordem ?? null
        } catch (error) {
            console.error('Erro ao buscar Ordem de Produção ativa:', error);
            throw error;
        }
    }
    static async atualizar(id_ordem, id_empresa, dados) {
        try {
            const resultado = await prisma.ordemProducao.updateMany({
                where:{
                    id_ordem: Number(id_ordem),
                    id_empresa: Number(id_empresa)
                },
                data: {
                    ...dados
                }
            })

            if (resultado.count === 0) {
                throw new Error('Ordem de producao nao encontrada ou nao pertence a empresa');
            }

            return await prisma.ordemProducao.findFirst({
                where: {
                    id_ordem: Number(id_ordem),
                    id_empresa: Number(id_empresa)
                },
                include: {
                    maquina: {
                        select: {
                            id_maquina: true,
                            nome: true,
                            serie: true,
                            setor: { select: { id_setor: true, nome_setor: true } }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar Ordem de Produção:', error);
            throw error;
        }
    }
    static async deletar(id_ordem, id_empresa) {
        try {
            const deletar = await prisma.ordemProducao.deleteMany({
                where: {
                    id_empresa: id_empresa,
                    id_ordem: Number(id_ordem)
                }
            })
            return deletar
        } catch (error) {
            console.error('Erro deletar Ordem de Produção no banco de dados:', error);
            throw error;
        }
    }
    static async totalOPsAtivas(id_empresa, setorId = null) {
        try {
            const res = await prisma.ordemProducao.count({
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    status_op: 'Em_Andamento'
                }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de OPs Ativas do banco de dados:', error);
            throw error;
        }
    }
    static async totalOPsAtrasadas(id_empresa, setorId = null) {
        try {
            const res = await prisma.ordemProducao.count({
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    data_fim: { lt: new Date() },
                    status_op: { not: 'Finalizada' }
                }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de OPs Atrasadas do banco de dados:', error);
            throw error;
        }
    }
    static async totalPecasBoas(id_empresa, setorId = null) {
        try {
            const res = await prisma.apontamento.aggregate({
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}),
                },
                _sum: { qtd_boa: true }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de Peças Boas produzidas do banco de dados:', error);
            throw error;
        }
    }
    static async totalRefugo(id_empresa, setorId = null) {
        try {
            const res = await prisma.apontamento.aggregate({
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}),
                },
                _sum: { qtd_refugo: true }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de Refugo produzido do banco de dados:', error);
            throw error;
        }
    }

        static async cadastrarLote(dados){
            try {
                const resultado = await prisma.ordemProducao.createMany({
                    data: dados,
                    skipDuplicates: true, // Impede que a query quebre caso um CPF já exista
                });
                return resultado.count
            } catch (error) {
                console.error('Erro cadastrar lote csv de Ordens de Produção no banco de dados', error);
                throw error;
            }
        }

    // ------------------------------------------Dashboard pag especifica OP -----------------------------------------------------------

    static async progressoOP(id_empresa, id_ordem) {
        try {
            const [ordem, apontamentos] = await Promise.all([
                prisma.ordemProducao.findFirst({
                    where: { id_ordem: Number(id_ordem), id_empresa },
                    select: { qtd_planejada: true, produto: true }
                }),
                prisma.apontamento.aggregate({
                    where: { id_ordemProducao: Number(id_ordem) },
                    _sum: { qtd_boa: true }
                })
            ])

            if (!ordem) return null

            const produzidos = apontamentos._sum.qtd_boa ?? 0
            const aProduzir = Math.max(ordem.qtd_planejada - produzidos, 0)
            const progresso = OrdemProducaoModel.calcularProgresso(produzidos, ordem.qtd_planejada)

            return [
                { nome: 'Produzidos', valor: produzidos, percentual: progresso },
                { nome: 'A Produzir', valor: aProduzir, percentual: 100 - progresso }
            ]
        } catch (error) {
            console.error('Erro ao retornar gráfico Progresso da OP do banco de dados:', error);
            throw error;
        }
    }

    // --------------------------------------------Dashboard Ordem De Produção------------------------------------------------------

    static async eficienciaGeral(id_empresa, setorId = null) {
        try {
            const [apontamentos, ordens] = await Promise.all([
                prisma.apontamento.aggregate({
                    where: { id_empresa, ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}) },
                    _sum: { qtd_boa: true }
                }),
                prisma.ordemProducao.aggregate({
                    where: { id_empresa, ...(setorId ? { id_setor: Number(setorId) } : {}) },
                    _sum: { qtd_planejada: true }
                })
            ])

            const qtdBoa = apontamentos._sum.qtd_boa ?? 0
            const qtdPlanejada = ordens._sum.qtd_planejada ?? 0

            const eficiencia = qtdPlanejada > 0
                ? Math.round((qtdBoa / qtdPlanejada) * 100)
                : 0

            return { eficiencia }
        } catch (error) {
            console.error('Erro ao retornar gráfico Eficiência Geral das OPs do banco de dados:', error);
            throw error;
        }
    }
    static async top3OPsMaiorRefugo(id_empresa, setorId = null) {
        try {
            const resultado = await prisma.apontamento.groupBy({
                by: ['id_ordemProducao'],
                where: { id_empresa, ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}) },
                _sum: { qtd_refugo: true },
                orderBy: { _sum: { qtd_refugo: 'desc' } },
                take: 3
            })

            // busca detalhes das OPs
            const ids = resultado.map(r => r.id_ordemProducao)
            const ordens = await prisma.ordemProducao.findMany({
                where: { id_ordem: { in: ids } },
                select: {
                    id_ordem: true,
                    codigo_lote: true,
                    produto: true
                }
            })

            const detalhesOP = Object.fromEntries(
                ordens.map(op => [op.id_ordem, op])
            )

            return resultado.map(r => ({
                label: `#${r.id_ordemProducao} (${detalhesOP[r.id_ordemProducao]?.produto ?? ''})`,
                qtd_refugo: r._sum.qtd_refugo ?? 0
            }))
        } catch (error) {
            console.error('Erro ao retornar gráfico Top 3 OPs com Maior Refugo do banco de dados:', error);
            throw error;
        }
    }
    static async cargaPorSetor(id_empresa, setorId = null) {
        try {
            const statusAtivos = ['Em_Andamento', 'Parada', 'Setup']

            const ordens = await prisma.ordemProducao.findMany({
                where: {
                    id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    status_op: { in: statusAtivos }
                },
                select: {
                    id_ordem: true,
                    id_setor: true,
                    qtd_planejada: true
                }
            })

            const setores = await prisma.setores.findMany({
                where: { id_empresa },
                select: { id_setor: true, nome_setor: true }
            })

            const nomeSetor = Object.fromEntries(
                setores.map(s => [s.id_setor, s.nome_setor])
            )

            if (ordens.length === 0) return []

            const idsOrdens = ordens.map(ordem => ordem.id_ordem)
            const apontamentosPorOrdem = await prisma.apontamento.groupBy({
                by: ['id_ordemProducao'],
                where: {
                    id_empresa,
                    id_ordemProducao: { in: idsOrdens }
                },
                _sum: {
                    qtd_boa: true,
                    qtd_refugo: true
                }
            })

            const produzidoPorOrdem = new Map(
                apontamentosPorOrdem.map(item => [
                    item.id_ordemProducao,
                    (item._sum.qtd_boa ?? 0) + (item._sum.qtd_refugo ?? 0)
                ])
            )

            const cargaPorSetor = new Map()

            for (const ordem of ordens) {
                const produzido = produzidoPorOrdem.get(ordem.id_ordem) ?? 0
                const restante = Math.max((ordem.qtd_planejada ?? 0) - produzido, 0)
                const atual = cargaPorSetor.get(ordem.id_setor) ?? 0

                cargaPorSetor.set(ordem.id_setor, atual + restante)
            }

            return Array.from(cargaPorSetor.entries())
                .map(([idSetor, cargaRestante]) => ({
                    setor: nomeSetor[idSetor] ?? 'Sem setor',
                    carga_restante: cargaRestante
                }))
                .sort((a, b) => b.carga_restante - a.carga_restante)
        } catch (error) {
            console.error('Erro ao retornar gráfico Carga de Trabalho por Setor do banco de dados:', error);
            throw error;
        }
    }

    static async statusOPs(id_empresa, setorId = null) {
        try {
            const resultado = await prisma.ordemProducao.groupBy({
                by: ['status_op'],
                where: {
                    id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    status_op: { in: ['Em_Andamento', 'Parada', 'Setup', 'Finalizada'] }
                },
                _count: { status_op: true }
            })

            // mapeia os nomes dos status para exibição
            const nomeStatus = {
                Em_Andamento: 'Em Produção',
                Parada: 'Pausadas',
                Setup: 'Pausadas (Setup)',
                Finalizada: 'Concluída'
            }

            return resultado.map(r => ({
                status: nomeStatus[r.status_op] ?? r.status_op,
                quantidade: r._count.status_op
            }))
        } catch (error) {
            console.error('Erro ao retornar gráfico Status das OPs do banco de dados:', error);
            throw error;
        }
    }
    static async opsConcluidasPorDia(id_empresa, setorId = null) {
        const hoje = new Date()
        hoje.setHours(23, 59, 59, 999)

        const seteDiasAtras = new Date()
        seteDiasAtras.setDate(hoje.getDate() - 6)
        seteDiasAtras.setHours(0, 0, 0, 0)

        const ordens = await prisma.ordemProducao.findMany({
            where: {
                id_empresa,
                ...(setorId ? { id_setor: Number(setorId) } : {}),
                status_op: 'Finalizada',
                data_fim: { gte: seteDiasAtras, lte: hoje }
            },
            select: { data_fim: true }
        })

        // monta os 7 dias com chave por data string
        const agrupado = {}
        for (let i = 0; i < 7; i++) {
            const data = new Date()
            data.setDate(data.getDate() - (6 - i))
            const chave = data.toISOString().split('T')[0]  // "2024-03-26"
            agrupado[chave] = { dia: `Dia ${i + 1}`, ops_concluidas: 0 }
        }

        // agrupa por chave de data — sem risco de índice errado
        for (const op of ordens) {
            const chave = new Date(op.data_fim).toISOString().split('T')[0]
            if (agrupado[chave]) agrupado[chave].ops_concluidas++
        }

        return Object.values(agrupado)
    }

}

export default OrdemProducaoModel;
