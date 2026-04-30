import prisma from '../config/prisma.js';
import { paginarPrisma } from '../utils/paginacaoUtil.js';

class OrdemProducaoModel {

    static async listarTodos(id_empresa, paginacao) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                },
                orderBy: {
                    id_ordem: 'asc' // Mantém a lista organizada
                },
            }

            const resultadoPaginado = await paginarPrisma(
                prisma.ordemproducao,
                regrasDaBusca,
                paginacao
            );

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

            const resultado = await prisma.ordemproducao.create({
                data: {
                    ...dados,
                    data_inicio: inicio,
                    data_fim: fim,
                    observacao_op: dados.observacao_op || null
                }
            })
            return resultado
        } catch (error) {
            console.error('Erro ao criar Ordem de Produção:', error);
            throw error;
        }
    }
    static async converterTimestamp(timestamp) {
        const ms = String(timestamp).length === 10
            ? timestamp * 1000   // veio em segundos → converte
            : timestamp          // veio em milissegundos → usa direto
        return new Date(ms)
        //  ex: 1711461000 → 2024-03-26T14:10:00.000Z
    }
    static async buscarOrdem(id_ordem) {
        try {
            const resultado = await prisma.ordemproducao.findFirst({
                where: {
                    id_ordem: id_ordem
                }
            })
            return resultado
        } catch (error) {
            console.error('Erro ao buscar Ordem de Produção:', error);
            throw error;
        }
    }
    static async buscarOrdemAtiva(id_maquina) {
        //retorna o ID da ordem de prodção pelo ID da máquina
        try {
            const ordemId = await prisma.ordemproducao.findFirst({
                where: {
                    id_maquina: id_maquina,
                    status_op: 'Em Andamento'
                },
                select: {
                    id_ordem: true
                }
            })
            return ordemId
        } catch (error) {
            console.error('Erro ao buscar Ordem de Produção ativa:', error);
            throw error;
        }
    }
    static async atualizar(id_ordem, id_empresa, dados) {
        try {
            const resultado = prisma.ordemproducao.update({
                where: {
                    id_ordem: id_ordem,
                    id_empresa: id_empresa
                },
                data: {
                    ...dados
                }
            })

            return resultado
        } catch (error) {
            console.error('Erro ao atualizar Ordem de Produção:', error);
            throw error;
        }
    }
    static async deletar(id_ordem, id_empresa) {
        try {
            const deletar = await prisma.ordemproducao.delete({
                where: {
                    id_empresa: id_empresa,
                    id_ordem: id_ordem
                }
            })
            return deletar
        } catch (error) {
            console.error('Erro deletar Ordem de Produção no banco de dados:', error);
            throw error;
        }
    }
    static async totalOPsAtivas(id_empresa) {
        try {
            const res = await prisma.ordemproducao.count({
                where: {
                    id_empresa: id_empresa,
                    status_op: 'Em Andamento'
                }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de OPs Ativas do banco de dados:', error);
            throw error;
        }
    }
    static async totalOPsAtrasadas(id_empresa) {
        try {
            const res = await prisma.ordemproducao.count({
                where: {
                    id_empresa: id_empresa,
                    status_op: { in: ['Parada', 'Setup'] }
                }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de OPs Atrasadas do banco de dados:', error);
            throw error;
        }
    }
    static async totalPecasBoas(id_empresa) {
        try {
            const res = await prisma.apontamento.aggregate({
                where: {
                    id_empresa: id_empresa,
                },
                _sum: { qtd_boa: true }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de Peças Boas produzidas do banco de dados:', error);
            throw error;
        }
    }
    static async totalRefugo(id_empresa) {
        try {
            const res = await prisma.apontamento.aggregate({
                where: {
                    id_empresa: id_empresa,
                },
                _sum: { qtd_refugo: true }
            })
            return res
        } catch (error) {
            console.error('Erro ao retornar total de Refugo produzido do banco de dados:', error);
            throw error;
        }
    }

    // ------------------------------------------Dashboard pag especifica OP -----------------------------------------------------------

    static async progressoOP(id_empresa, id_ordem) {
        try {
            const [ordem, apontamentos] = await Promise.all([
                prisma.ordemProducao.findUnique({
                    where: { id_ordem: Number(id_ordem), id_empresa },
                    select: { qtd_planejada: true, produto: true }
                }),
                prisma.apontamento.aggregate({
                    where: { id_empresa, id_ordemProducao: Number(id_ordem) },
                    _sum: { qtd_boa: true }
                })
            ])

            if (!ordem) return null

            const produzidos = apontamentos._sum.qtd_boa ?? 0
            const aProduzir = Math.max(ordem.qtd_planejada - produzidos, 0)
            const progresso = ordem.qtd_planejada > 0
                ? Math.round((produzidos / ordem.qtd_planejada) * 100)
                : 0

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

    static async eficienciaGeral(id_empresa) {
        try {
            const [apontamentos, ordens] = await Promise.all([
                prisma.apontamento.aggregate({
                    where: { id_empresa },
                    _sum: { qtd_boa: true }
                }),
                prisma.ordemProducao.aggregate({
                    where: { id_empresa },
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
    static async top3OPsMaiorRefugo(id_empresa) {
        try {
            const resultado = await prisma.apontamento.groupBy({
                by: ['id_ordemProducao'],
                where: { id_empresa },
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
                    produto: true,
                    setores: { select: { nome_setor: true } }
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
    static async cargaPorSetor(id_empresa) {
        try {
            const statusAtivos = ['Em Andamento', 'Aguardando', 'Parada', 'Setup']

            const resultado = await prisma.ordemProducao.groupBy({
                by: ['id_setor'],
                where: {
                    id_empresa,
                    status_op: { in: statusAtivos }
                },
                _count: { id_ordem: true }
            })

            const setores = await prisma.setores.findMany({
                where: { id_empresa },
                select: { id_setor: true, nome_setor: true }
            })

            const nomeSetor = Object.fromEntries(
                setores.map(s => [s.id_setor, s.nome_setor])
            )

            return resultado
                .map(r => ({
                    setor: nomeSetor[r.id_setor] ?? 'Sem setor',
                    qtd_ops: r._count.id_ordem
                }))
                .sort((a, b) => b.qtd_ops - a.qtd_ops)
        } catch (error) {
            console.error('Erro ao retornar gráfico Carga de Trabalho por Setor do banco de dados:', error);
            throw error;
        }
    }

    static async statusOPs(id_empresa) {
        try {
            const resultado = await prisma.ordemProducao.groupBy({
                by: ['status_op'],
                where: { id_empresa },
                _count: { status_op: true }
            })

            // mapeia os nomes dos status para exibição
            const nomeStatus = {
                Em_Andamento: 'Em Produção',
                Parada: 'Pausadas',
                Setup: 'Pausadas (Setup)',
                Aguardando: 'Aguardando Início'
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
    static async opsConcluídasPorDia(id_empresa) {
        const hoje = new Date()
        hoje.setHours(23, 59, 59, 999)

        const seteDiasAtras = new Date()
        seteDiasAtras.setDate(hoje.getDate() - 6)
        seteDiasAtras.setHours(0, 0, 0, 0)

        const ordens = await prisma.ordemProducao.findMany({
            where: {
                id_empresa,
                status_op: 'Finaliazada',
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