import prisma from '../config/prisma.js';

class OEEModel {
    static arredondarPercentual(valor) {
        const percentual = Number((valor * 100).toFixed(1));
        return Math.min(100, Math.max(0, percentual));
    }

    static calcularDuracaoMinutos(inicio, fim) {
        if (!inicio || !fim) return 0;

        const duracao = (new Date(fim) - new Date(inicio)) / 1000 / 60;
        return Number.isFinite(duracao) && duracao > 0 ? duracao : 0;
    }

    static calcularOEE({ tempo_produzindo, tempo_parado, qtd_planejada, qtd_boa, qtd_refugo }) {
        const tempo_total = tempo_produzindo + tempo_parado;
        const qtd_total = qtd_boa + qtd_refugo;

        const disponibilidade = tempo_total > 0 ? tempo_produzindo / tempo_total : 0;
        const performance = qtd_planejada > 0 ? qtd_total / qtd_planejada : 0;
        const qualidade = qtd_total > 0 ? qtd_boa / qtd_total : 0;
        const oee = disponibilidade * performance * qualidade;

        return {
            disponibilidade: this.arredondarPercentual(disponibilidade),
            performance: this.arredondarPercentual(performance),
            qualidade: this.arredondarPercentual(qualidade),
            oee: this.arredondarPercentual(oee)
        };
    }

    static inicioDoDia(data) {
        const inicio = new Date(data);
        inicio.setHours(0, 0, 0, 0);
        return inicio;
    }

    static fimDoDia(data) {
        const fim = new Date(data);
        fim.setHours(23, 59, 59, 999);
        return fim;
    }

    static criarMapaUltimosDias(quantidadeDias = 7) {
        const dias = [];
        const hoje = this.inicioDoDia(new Date());

        for (let i = quantidadeDias - 1; i >= 0; i--) {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() - i);
            dias.push(data.toISOString().slice(0, 10));
        }

        return dias;
    }

    static montarFiltroPeriodo(campo, dataInicio, dataFim) {
        const filtro = {};

        if (dataInicio) filtro.gte = dataInicio;
        if (dataFim) filtro.lte = dataFim;

        return Object.keys(filtro).length > 0 ? { [campo]: filtro } : {};
    }

    static montarFiltroOrdemPeriodo(dataInicio, dataFim) {
        if (!dataInicio && !dataFim) return {};

        return {
            AND: [
                ...(dataFim ? [{ OR: [{ data_inicio: { lte: dataFim } }, { data_inicio: null }] }] : []),
                ...(dataInicio ? [{ OR: [{ data_fim: { gte: dataInicio } }, { data_fim: null }] }] : [])
            ]
        };
    }

    static async obterOeeMaquina(id_maquina, id_empresa, dataInicio = null, dataFim = null) {
        const filtroApontamentoPeriodo = this.montarFiltroPeriodo('data_hora_fim', dataInicio, dataFim);
        const filtroEventoPeriodo = this.montarFiltroPeriodo('inicio', dataInicio, dataFim);
        const filtroOrdemPeriodo = this.montarFiltroOrdemPeriodo(dataInicio, dataFim);

        const [apontamentos, ordens, paradas] = await Promise.all([
            prisma.apontamento.findMany({
                where: {
                    id_maquina,
                    id_empresa,
                    ...filtroApontamentoPeriodo
                },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    data_hora_inicio: true,
                    data_hora_fim: true
                }
            }),
            prisma.ordemProducao.aggregate({
                where: {
                    id_maquina,
                    id_empresa,
                    ...filtroOrdemPeriodo
                },
                _sum: {
                    qtd_planejada: true
                }
            }),
            prisma.historico_Eventos.aggregate({
                where: {
                    id_maquina,
                    id_empresa,
                    status_atual: {
                        in: ['Parada', 'Setup', 'Manutencao']
                    },
                    duracao: {
                        not: null
                    },
                    ...filtroEventoPeriodo
                },
                _sum: {
                    duracao: true
                }
            })
        ]);

        const totais = apontamentos.reduce((acc, apontamento) => {
            acc.qtd_boa += apontamento.qtd_boa ?? 0;
            acc.qtd_refugo += apontamento.qtd_refugo ?? 0;
            acc.tempo_produzindo += this.calcularDuracaoMinutos(
                apontamento.data_hora_inicio,
                apontamento.data_hora_fim
            );

            return acc;
        }, {
            qtd_boa: 0,
            qtd_refugo: 0,
            tempo_produzindo: 0
        });

        const tempo_parado = paradas._sum.duracao ?? 0;
        const qtd_planejada = ordens._sum.qtd_planejada ?? 0;

        return {
            ...this.calcularOEE({
                ...totais,
                tempo_parado,
                qtd_planejada
            }),
            totais: {
                tempo_produzindo_minutos: Number(totais.tempo_produzindo.toFixed(1)),
                tempo_parado_minutos: tempo_parado,
                qtd_planejada,
                qtd_boa: totais.qtd_boa,
                qtd_refugo: totais.qtd_refugo
            }
        };
    }

    static async obterEvolucaoOeeMaquina(id_maquina, id_empresa) {
        const dias = this.criarMapaUltimosDias(7);

        return Promise.all(
            dias.map(async dia => {
                const dataInicio = this.inicioDoDia(new Date(`${dia}T00:00:00`));
                const dataFim = this.fimDoDia(dataInicio);
                const oee = await this.obterOeeMaquina(id_maquina, id_empresa, dataInicio, dataFim);

                return {
                    data: dia,
                    disponibilidade: oee.disponibilidade,
                    performance: oee.performance,
                    qualidade: oee.qualidade,
                    oee: oee.oee,
                    produzido: oee.totais.qtd_boa + oee.totais.qtd_refugo,
                    refugo: oee.totais.qtd_refugo
                };
            })
        );
    }

    static async geralFabrica(id_empresa) {
        const maquinas = await prisma.maquinas.findMany({
            where: {
                id_empresa,
                ativo: true
            },
            select: {
                id_maquina: true
            }
        });

        const resultados = await Promise.all(
            maquinas.map(maquina => this.obterOeeMaquina(maquina.id_maquina, id_empresa))
        );

        if (resultados.length === 0) {
            return {
                disponibilidade: 0,
                performance: 0,
                qualidade: 0,
                oee: 0
            };
        }

        const soma = resultados.reduce((acc, item) => ({
            disponibilidade: acc.disponibilidade + item.disponibilidade,
            performance: acc.performance + item.performance,
            qualidade: acc.qualidade + item.qualidade,
            oee: acc.oee + item.oee
        }), {
            disponibilidade: 0,
            performance: 0,
            qualidade: 0,
            oee: 0
        });

        return {
            disponibilidade: Number((soma.disponibilidade / resultados.length).toFixed(1)),
            performance: Number((soma.performance / resultados.length).toFixed(1)),
            qualidade: Number((soma.qualidade / resultados.length).toFixed(1)),
            oee: Number((soma.oee / resultados.length).toFixed(1))
        };
    }

    static async individualMaquina(id_maquina, id_empresa) {
        return this.obterOeeMaquina(id_maquina, id_empresa);
    }

    static async calcularOEESetor(id_setor, id_empresa) {
        const maquinas = await prisma.maquinas.findMany({
            where: {
                id_empresa,
                id_setor,
                ativo: true
            },
            select: {
                id_maquina: true
            }
        });

        const resultados = await Promise.all(
            maquinas.map(maquina => this.obterOeeMaquina(maquina.id_maquina, id_empresa))
        );

        if (resultados.length === 0) {
            return {
                disponibilidade: 0,
                performance: 0,
                qualidade: 0,
                oee: 0
            };
        }

        const soma = resultados.reduce((acc, item) => ({
            disponibilidade: acc.disponibilidade + item.disponibilidade,
            performance: acc.performance + item.performance,
            qualidade: acc.qualidade + item.qualidade,
            oee: acc.oee + item.oee
        }), {
            disponibilidade: 0,
            performance: 0,
            qualidade: 0,
            oee: 0
        });

        return {
            disponibilidade: Number((soma.disponibilidade / resultados.length).toFixed(1)),
            performance: Number((soma.performance / resultados.length).toFixed(1)),
            qualidade: Number((soma.qualidade / resultados.length).toFixed(1)),
            oee: Number((soma.oee / resultados.length).toFixed(1))
        };
    }

    static async mediaPorSetor(id_empresa) {
        const setores = await prisma.setores.findMany({
            where: { id_empresa }
        });

        return Promise.all(
            setores.map(async setor => {
                const oee = await this.calcularOEESetor(setor.id_setor, id_empresa);

                return {
                    id_setor: setor.id_setor,
                    setor: setor.nome_setor,
                    oee: oee.oee
                };
            })
        );
    }

    static async setorCritico(id_empresa) {
        const setores = await this.mediaPorSetor(id_empresa);
        return setores.sort((a, b) => a.oee - b.oee)[0] ?? null;
    }

    static async individualSetor(id_setor, id_empresa) {
        const setor = await prisma.setores.findFirst({
            where: {
                id_setor,
                id_empresa
            }
        });

        if (!setor) return null;

        const oee = await this.calcularOEESetor(id_setor, id_empresa);

        return {
            id_setor: setor.id_setor,
            nome_setor: setor.nome_setor,
            ...oee
        };
    }

    static async maquinaPorOP(id_maquina, id_ordem, id_empresa) {
        const ordem = await prisma.ordemProducao.findFirst({
            where: {
                id_ordem,
                id_maquina,
                id_empresa
            },
            select: {
                id_ordem: true,
                produto: true,
                qtd_planejada: true
            }
        });

        if (!ordem) return null;

        const [apontamentos, paradas] = await Promise.all([
            prisma.apontamento.findMany({
                where: {
                    id_maquina,
                    id_ordemProducao: id_ordem,
                    id_empresa
                },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    data_hora_inicio: true,
                    data_hora_fim: true
                }
            }),
            prisma.historico_Eventos.aggregate({
                where: {
                    id_maquina,
                    id_ordemProducao: id_ordem,
                    id_empresa,
                    duracao: { not: null }
                },
                _sum: { duracao: true }
            })
        ]);

        const totais = apontamentos.reduce((acc, apontamento) => {
            acc.qtd_boa += apontamento.qtd_boa ?? 0;
            acc.qtd_refugo += apontamento.qtd_refugo ?? 0;
            acc.tempo_produzindo += this.calcularDuracaoMinutos(
                apontamento.data_hora_inicio,
                apontamento.data_hora_fim
            );

            return acc;
        }, {
            qtd_boa: 0,
            qtd_refugo: 0,
            tempo_produzindo: 0
        });

        return {
            id_maquina,
            id_ordem,
            produto: ordem.produto,
            ...this.calcularOEE({
                ...totais,
                tempo_parado: paradas._sum.duracao ?? 0,
                qtd_planejada: ordem.qtd_planejada ?? 0
            })
        };
    }
}

export default OEEModel;
