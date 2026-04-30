import prisma from '../config/prisma.js';
import TurnoModel from './TurnoModel.js';
import OrdemProducaoModel from './OrdemProducaoModel.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';

class EventoModel {
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

    static converterTimestamp(timestamp) {
        if (timestamp instanceof Date) return timestamp;

        const valor = Number(timestamp);
        if (!Number.isNaN(valor)) {
            const ms = String(Math.trunc(valor)).length === 10 ? valor * 1000 : valor;
            return new Date(ms);
        }

        return new Date(timestamp);
    }

    static calcularDuracao(inicio, fim) {
        const inicioDate = this.converterTimestamp(inicio);
        const fimDate = this.converterTimestamp(fim);
        const diferencaMinutos = (fimDate - inicioDate) / 1000 / 60;

        return Number.isFinite(diferencaMinutos) && diferencaMinutos > 0
            ? Math.round(diferencaMinutos)
            : 0;
    }

    static formatarTempo(minutos) {
        const total = Math.max(0, Number(minutos) || 0);
        const horas = Math.floor(total / 60);
        const resto = total % 60;

        if (horas === 0) return `${resto}m`;
        if (resto === 0) return `${horas}h`;
        return `${horas}h ${resto}m`;
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

    static formatarEvento(evento) {
        return {
            ...evento,
            inicio_formatado: evento.inicio
                ? new Date(evento.inicio).toLocaleString('pt-BR')
                : null,
            termino_formatado: evento.termino
                ? new Date(evento.termino).toLocaleString('pt-BR')
                : null
        };
    }

    static async listarTodos(id_empresa, paginacao) {
        try {
            const regrasDaBusca = {
                where: { id_empresa },
                include: {
                    maquina: {
                        select: { id_maquina: true, nome: true, serie: true }
                    },
                    motivo_parada: {
                        select: { id_motivo: true, descricao: true, tipo: true }
                    },
                    turno: {
                        select: { id_turno: true, nome_turno: true, dia_semana: true }
                    }
                },
                orderBy: { id_evento: 'asc' }
            };

            return await paginarPrisma(prisma.historico_Eventos, regrasDaBusca, paginacao);
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            throw error;
        }
    }
    //listar paradas não justificadas
    static async listarNaoJustificadas(id_empresa, paginacao) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    id_motivo_parada: {
                        equals: null
                    },
                }
            }
            const resultadoPaginado = await paginarPrisma(
                prisma.historico_eventos,
                regrasDaBusca,
                paginacao
            );
            return resultadoPaginado
        } catch (error) {
            console.error('Erro ao listar eventos nao justificados:', error);
            throw error;
        }
    }
    //listar tabelas justificadas
    static async listarJustificadas(id_empresa, paginacao) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    id_motivo_parada: {
                        not: null
                    },
                }
            }
            const resultadoPaginado = await paginarPrisma(
                prisma.historico_eventos,
                regrasDaBusca,
                paginacao
            );
            return resultadoPaginado

        } catch (error) {
            console.error('Erro ao listar eventos justificados:', error);
            throw error;
        }
    }

    static async registrarEventoMaquina(id_empresa, status_maquina, id_maquina, datastamp) {
        try {
            const inicio = this.converterTimestamp(datastamp);
            const maquina = await prisma.maquinas.findFirst({
                where: {
                    id_empresa,
                    id_maquina,
                    ativo: true
                },
                select: {
                    id_maquina: true,
                    id_setor: true
                }
            });

            if (!maquina) {
                throw new Error('Maquina nao encontrada ou inativa');
            }

            const turno = await TurnoModel.obterTurnoAtual(id_empresa, inicio);
            if (!turno) {
                throw new Error('Nenhum turno ativo encontrado para o horario informado');
            }

            const id_ordemProducao = await OrdemProducaoModel.buscarOrdemAtiva(id_maquina);

                },
                select: {
                    id_turno: true
                }
            })
            // busca a ordem de produção ativa da máquina
            const ordemProducaoId = await OrdemProducaoModel.buscarOrdemAtiva(id_maquina);

            //atualiza status da OP na tabela de Ordem de produção 
            const atualizaOP = await prisma.ordemProducao.update({
                where: {
                    id_ordem: ordemProducaoId,
                    id_maquina: id_maquina,
                    id_empresa: id_empresa
                },
                data: {
                    status_op: status_maquina,
                    prioridade: 'Critica'
                }
            })

            if (id_ordemProducao) {
                await prisma.ordemProducao.update({
                    where: { id_ordem: id_ordemProducao },
                    data: {
                        status_op: 'Parada',
                        prioridade: status_maquina === 'Parada' ? 'Critica' : undefined
                    }
                });
            }

            const resultado = await prisma.historico_Eventos.create({
                data: {
                    id_empresa,
                    id_maquina,
                    id_ordemProducao,
                    id_turno: turno.id_turno,
                    status_atual: status_maquina,
                    setor_afetado: maquina.id_setor ?? 0,
                    inicio,
                    observacao: ''
                }
            });

            return this.formatarEvento(resultado);
        } catch (error) {
            console.error('Erro registrar evento da maquina no banco de dados:', error);
            throw error;
        }
    }

    static async registrarEventoSistema(id_empresa, status_maquina, setor_afetado, id_maquina, inicio, fim, id_motivo_parada, observacao = null) {
        try {
            const duracao = await this.calcularDuracao(inicio, fim);
            const inicio_convertido = await this.converterTimestamp(inicio);
            const turno = await TurnoModel.obterTurnoAtual(id_empresa, inicio_convertido);

            // Mapeia todas as máquinas para criar os objetos de inserção
            const eventosData = await Promise.all(maquinas.map(async (id_maquina) => {

                const ordem = await prisma.ordemProducao.findFirst({
                    where: {
                        id_empresa,
                        id_maquina,
                        data_inicio: { lte: inicioConvertido },
                        OR: [
                            { data_fim: null },
                            { data_fim: { gte: inicioConvertido } }
                        ]
                    },
                    orderBy: { data_inicio: 'desc' },
                    select: { id_ordem: true }
                });

                return {
                    id_empresa,
                    id_maquina,
                    id_ordemProducao: ordem?.id_ordem ?? null,
                    id_turno: turno.id_turno,
                    status_atual: status_maquina,
                    setor_afetado: Number(setor_afetado),
                    inicio: inicioConvertido,
                    termino: fimConvertido,
                    duracao,
                    id_motivo_parada: Number(id_motivo_parada),
                    observacao: observacao ?? ''
                };
            }));

            const resultado = await prisma.historico_Eventos.createMany({
                data: eventosData
            });

            await prisma.maquinas.updateMany({
                where: {
                    id_empresa,
                    id_maquina: {
                        in: maquinasIds
                    }
                },
                data: {
                    status_atual: status_maquina
                }
            });

    } catch(error) {
        console.error('Erro registrar evento no banco de dados:', error);
        throw error;
    }

    static async verificaJustificativa(id_empresa, id_evento) {
        try {
            const evento = await prisma.historico_eventos.findFirst({
                where: {
                    id_empresa,
                    id_evento
                },
                select: {
                    id_motivo_parada: true
                }
            });

            return Boolean(evento?.id_motivo_parada);
        } catch (error) {
            console.error('Erro verificar justificativa no banco de dados:', error);
            throw error;
        }
    }

    static async justificar(id_empresa, id_evento, id_motivo_parada, observacao = '') {
        try {
            const resultado = await prisma.historico_Eventos.updateMany({
                where: {
                    id_empresa,
                    id_evento
                },
                data: {
                    id_motivo_parada,
                    observacao: observacao ?? ''
                }
            });

            if (resultado.count === 0) {
                throw new Error('Evento nao encontrado ou nao pertence a empresa');
            }

            return await prisma.historico_Eventos.findFirst({
                where: {
                    id_empresa,
                    id_evento
                }
            });
        } catch (error) {
            console.error('Erro salvar justificativa:', error);
            throw error;
        }
    }

    // -----------------------------------------------Dashboard de Eventos -------------------------------------------------------------------------------

    static async tempoParadoTempoProduzindoEvento() {
        function semanaAtual() {
            const hoje = new Date()
            const diaSemana = hoje.getDay()
            const diasParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1

            const inicio = new Date(hoje)
            inicio.setDate(hoje.getDate() - diasParaSegunda)
            inicio.setHours(0, 0, 0, 0)

            const fim = new Date(inicio)
            fim.setDate(inicio.getDate() + 6)
            fim.setHours(23, 59, 59, 999)

            return { inicio, fim }
        }

        const { inicio, fim } = semanaAtual()

        const [apontamentos, paradas] = await Promise.all([
            // tempo produzido — todos os apontamentos da empresa na semana
            prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    data_hora_inicio: { gte: inicio, lte: fim }
                },
                select: {
                    data_hora_inicio: true,
                    data_hora_fim: true
                }
            }),
            // tempo parado — todas as paradas da empresa na semana
            prisma.historico_Eventos.aggregate({
                where: {
                    id_empresa,
                    status_atual: { in: ['Parada', 'Manutencao', 'Setup'] },
                    inicio: { gte: inicio, lte: fim },
                    duracao: { not: null }
                },
                _sum: { duracao: true }
            })
        ])

        const tempoProduzido = apontamentos.reduce((acc, ap) => {
            if (!ap.data_hora_fim) return acc  // ← ignora em andamento

            const minutos = (new Date(ap.data_hora_fim) - new Date(ap.data_hora_inicio)) / 1000 / 60
            return acc + Math.round(minutos)
        }, 0)

        const tempoParado = paradas._sum.duracao ?? 0

        return [
            { nome: 'Tempo Produzido', valor: tempoProduzido },
            { nome: 'Tempo Parado', valor: tempoParado }
        ]
    }
    static async top3MotivosParada(id_empresa) {
        try {
            const resultado = await prisma.historico_eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa,
                    duracao: { not: null },
                    id_motivo_parada: { not: null }
                },
                _sum: { duracao: true },
                orderBy: { _sum: { duracao: 'desc' } },
                take: 3
            })
            // 2. Agora buscamos os NOMES na tabela 'motivos_parada'
            const resultadoComNomes = await Promise.all(
                agrupado.map(async (item) => {
                    const infoMotivo = await prisma.motivos_parada.findUnique({
                        where: { id: item.id_motivo_parada },
                        select: { nome_motivo: true } // Verifique se o nome da coluna é este mesmo!
                    });

                    return {
                        // O Recharts usará essas chaves: 'name' e 'minutos'
                        name: infoMotivo?.nome_motivo || "Outros",
                        minutos: item._sum.duracao || 0
                    };
                })
            );

        } catch (error) {
            console.error('Erro captar top 3 motivos de parada:', error);
            throw error;
        }
    }

    // -------------- Dashboards --------------- //

    static async obterMotivosParadaFrequentes(id_empresa, limite = 10) {
        try {
            const agrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa,
                    id_motivo_parada: {
                        not: null
                    },
                    status_atual: {
                        in: ['Parada', 'Manutencao']
                    }
                },
                _count: {
                    id_evento: true
                },
                _sum: {
                    duracao: true
                },
                orderBy: {
                    _count: {
                        id_evento: 'desc'
                    }
                },
                take: limite
            });

            const motivos = await prisma.motivos_Parada.findMany({
                where: {
                    id_empresa,
                    id_motivo: {
                        in: agrupados.map(item => item.id_motivo_parada)
                    }
                },
                select: {
                    id_motivo: true,
                    descricao: true,
                    tipo: true
                }
            });

            const motivosPorId = new Map(motivos.map(motivo => [motivo.id_motivo, motivo]));

            return agrupados.map(item => {
                const motivo = motivosPorId.get(item.id_motivo_parada);

                return {
                    id_motivo: item.id_motivo_parada,
                    motivo: motivo?.descricao ?? 'Sem motivo informado',
                    tipo: motivo?.tipo ?? null,
                    qtd: item._count.id_evento,
                    total_eventos: item._count.id_evento,
                    duracao_total_minutos: item._sum.duracao ?? 0
                };
            });
        } catch (error) {
            console.error('Erro ao obter motivos de parada frequentes:', error);
            throw error;
        }
    }

    static async obterTopMotivosSetup(id_empresa, limite = 3) {
        try {
            const agrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa,
                    id_motivo_parada: {
                        not: null
                    },
                    status_atual: 'Setup'
                },
                _count: {
                    id_evento: true
                },
                _sum: {
                    duracao: true
                },
                orderBy: {
                    _sum: {
                        duracao: 'desc'
                    }
                },
                take: limite
            });

            const motivos = await prisma.motivos_Parada.findMany({
                where: {
                    id_empresa,
                    id_motivo: {
                        in: agrupados.map(item => item.id_motivo_parada)
                    }
                },
                select: {
                    id_motivo: true,
                    descricao: true,
                    tipo: true
                }
            });

            const motivosPorId = new Map(motivos.map(motivo => [motivo.id_motivo, motivo]));

            return agrupados.map(item => {
                const minutos = item._sum.duracao ?? 0;
                const motivo = motivosPorId.get(item.id_motivo_parada);

                return {
                    id_motivo: item.id_motivo_parada,
                    motivo: motivo?.descricao ?? 'Sem motivo informado',
                    tempo: this.formatarTempo(minutos),
                    minutos,
                    total_eventos: item._count.id_evento
                };
            });
        } catch (error) {
            console.error('Erro ao obter top motivos de setup:', error);
            throw error;
        }
    }

    static async obterPrincipaisMotivosRefugo(id_empresa, limite = 10) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    qtd_refugo: {
                        gt: 0
                    }
                },
                select: {
                    qtd_refugo: true,
                    observacao: true
                }
            });

            const motivos = new Map();

            for (const apontamento of apontamentos) {
                const motivo = apontamento.observacao?.trim() || 'Sem motivo informado';
                const acumulado = motivos.get(motivo) ?? {
                    motivo,
                    qtd_refugo: 0,
                    total_apontamentos: 0
                };

                acumulado.qtd_refugo += apontamento.qtd_refugo ?? 0;
                acumulado.total_apontamentos += 1;
                motivos.set(motivo, acumulado);
            }

            return Array.from(motivos.values())
                .sort((a, b) => b.qtd_refugo - a.qtd_refugo)
                .slice(0, limite);
        } catch (error) {
            console.error('Erro ao obter principais motivos de refugo:', error);
            throw error;
        }
    }

    static async obterTendenciaRefugo(id_empresa, dias = 7) {
        try {
            const quantidadeDias = Number(dias) || 7;
            const chavesDias = this.criarMapaUltimosDias(quantidadeDias);
            const dataInicio = this.inicioDoDia(new Date(`${chavesDias[0]}T00:00:00`));

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    data_hora_fim: {
                        gte: dataInicio
                    }
                },
                select: {
                    qtd_refugo: true,
                    data_hora_fim: true
                }
            });

            const totaisPorDia = new Map(chavesDias.map((dia, index) => [
                dia,
                {
                    dia: `Dia ${index + 1}`,
                    data: dia,
                    qtd: 0,
                    qtd_refugo: 0
                }
            ]));

            for (const apontamento of apontamentos) {
                const dia = apontamento.data_hora_fim.toISOString().slice(0, 10);
                const acumulado = totaisPorDia.get(dia);

                if (acumulado) {
                    acumulado.qtd += apontamento.qtd_refugo ?? 0;
                    acumulado.qtd_refugo += apontamento.qtd_refugo ?? 0;
                }
            }

            return Array.from(totaisPorDia.values());
        } catch (error) {
            console.error('Erro ao obter tendencia de refugo:', error);
            throw error;
        }
    }

    static async obterParadasJustificadasComparativo(id_empresa) {
        try {
            const [justificadas, naoJustificadas] = await Promise.all([
                prisma.historico_Eventos.count({
                    where: {
                        id_empresa,
                        id_motivo_parada: {
                            not: null
                        }
                    }
                }),
                prisma.historico_Eventos.count({
                    where: {
                        id_empresa,
                        id_motivo_parada: null
                    }
                })
            ]);

            return [
                { name: 'justificada', value: justificadas },
                { name: 'naoJustificada', value: naoJustificadas }
            ];
        } catch (error) {
            console.error('Erro ao obter comparativo de paradas:', error);
            throw error;
        }
    }

    static async obterTopMotivosTempo(id_empresa, limite = 5) {
        try {
            const motivos = await this.obterMotivosParadaFrequentes(id_empresa, limite);

            return motivos
                .sort((a, b) => b.duracao_total_minutos - a.duracao_total_minutos)
                .slice(0, limite)
                .map(item => ({
                    motivo: item.motivo,
                    tempo: this.formatarTempo(item.duracao_total_minutos),
                    minutos: item.duracao_total_minutos
                }));
        } catch (error) {
            console.error('Erro ao obter top motivos por tempo:', error);
            throw error;
        }
    }
}

export default EventoModel;
