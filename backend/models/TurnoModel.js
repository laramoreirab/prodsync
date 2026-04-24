import prisma from '../config/prisma.js';

class TurnoModel {

    //Cria os turnos da empresa
    static async criarTurno(dados) {
        try {
            const turno = await prisma.turno.create({
                data: {
                    nome_turno: dados.nome_turno,
                    hora_inicio: dados.hora_inicio,
                    hora_fim: dados.hora_fim,
                    dia_semana: dados.dia_semana,
                    id_empresa: dados.id_empresa
                }
            });
            return turno;
        } catch (error) {
            console.error('Erro ao criar turno:', error);
            throw error;
        }
    }

    //Obtém todos os turnos de uma empresa
    static async obterTurnosPorEmpresa(id_empresa) {
        return await prisma.turno.findMany({
            where: { id_empresa: id_empresa }
        });
    }

    //Obtém um turno específico por ID e ID da empresa
    static async obterTurnoPorId(id_turno, id_empresa) {
        try {
            const turno = await prisma.turno.findFirst({
                where: {
                    id_turno: id_turno,
                    id_empresa: id_empresa
                }
            });
            return turno || null;
        } catch (error) {
            console.error('Erro ao obter turno por ID:', error);
            throw error;
        }
    }

    //Atualiza os dados de um turno específico
    static async atualizarTurno(id_turno, id_empresa, dados) {
        try {
            const turno = await prisma.turno.updateMany({
                where: {
                    id_turno,
                    id_empresa
                },
                data: dados
            });

            if (turno.count === 0) {
                throw new Error('Turno não encontrado ou não pertence à empresa');
            } return true;

        } catch (error) {
            console.error('Erro ao atualizar turno:', error);
            throw error;
        }
    }

    //Deleta um turno específico por ID e ID da empresa
    static async deletarTurno(id_turno, id_empresa) {
        try {
            const result = await prisma.turno.deleteMany({
                where: {
                    id_turno,
                    id_empresa: id_empresa
                }
            });
            if (result.count === 0) {
                throw new Error('Turno não encontrado ou não pertence à empresa');
            }
        } catch (error) {
            console.error('Erro ao deletar turno:', error);
            throw error;
        }
    }

    //Obtém o turno atual com base na hora atual e ID da empresa
    static async obterTurnoAtual(id_empresa, hora_atual, dia_semana) {
        try {
            const turnoAtual = await prisma.turno.findFirst({
                where: {
                    id_empresa: id_empresa,
                    dia_semana: dia_semana,
                    hora_inicio: {
                        lte: hora_atual
                    },
                    hora_fim: {
                        gte: hora_atual
                    }
                }
            });
            return turnoAtual || null;
        } catch (error) {
            console.error('Erro ao obter turno atual:', error);
            throw error;
        }
    }

    // ------------------------ Dashboards ----------------------- //

    // Busca a soma total de lotes produzidos em um turno específico
    static async obterLotesProduzidosPorTurno(id_empresa) {
        try {
            const lotesPorTurno = await prisma.evento.groupBy({
                by: ['id_turno'],
                where: {
                    id_empresa: id_empresa,
                    tipo_evento: 'Produção'
                },
                _sum: {
                    quantidade_lotes: true
                }
            });
            return lotesPorTurno;
        } catch (error) {
            console.error('Erro ao obter lotes produzidos por turno:', error);
            throw error;
        }
    }

    // Busca a quantidade de máquinas únicas ativas em um turno específico
    static async obterMaquinasAtivasPorTurno(id_empresa) {
        try {
            const maquinasAtivasPorTurno = await prisma.evento.groupBy({
                by: ['id_turno'],
                where: {
                    id_empresa: id_empresa,
                    tipo_evento: 'Produção'
                },
                _count: {
                    id_maquina: true
                }
            });
            return maquinasAtivasPorTurno;
        } catch (error) {
            console.error('Erro ao obter máquinas ativas por turno:', error);
            throw error;
        }
    }

    // Busca a soma total de lotes produzidos em um turno específico (para KPI)
    static async buscarProducaoTurnoLotes(id_turno) {
        try {
            const result = await prisma.evento.aggregate({
                where: {
                    id_turno: Number(id_turno),
                    tipo_evento: 'Produção'
                },
                _sum: {
                    quantidade_lotes: true
                }
            });
            return result._sum.quantidade_lotes || 0;
        } catch (error) {
            console.error('Erro ao buscar produção do turno:', error);
            throw error;
        }
    }

    // Busca a quantidade de máquinas únicas ativas em um turno específico (para KPI)
    static async buscarMaquinasAtivasTurno(id_turno) {
        try {
            const result = await prisma.evento.findMany({
                where: {
                    id_turno: Number(id_turno),
                    tipo_evento: 'Produção'
                },
                distinct: ['id_maquina'],
                select: {
                    id_maquina: true
                }
            });
            return result.length;
        } catch (error) {
            console.error('Erro ao buscar máquinas ativas do turno:', error);
            throw error;
        }
    }

    // Gráfico 1: Produção Timeline - Produção ao longo do tempo durante um turno
    static async obterProducaoTimeline(id_turno) {
        try {
            const eventos = await prisma.evento.findMany({
                where: {
                    id_turno: Number(id_turno),
                    tipo_evento: 'Produção'
                },
                select: {
                    data_evento: true,
                    quantidade_lotes: true,
                    id_maquina: true
                },
                orderBy: {
                    data_evento: 'asc'
                }
            });

            // Agrupar por intervalo de tempo (a cada 30 minutos)
            const timeline = {};
            eventos.forEach(evento => {
                const time = evento.data_evento.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
                if (!timeline[time]) {
                    timeline[time] = 0;
                }
                timeline[time] += evento.quantidade_lotes || 0;
            });

            return Object.entries(timeline).map(([timestamp, quantidade]) => ({
                timestamp,
                producao: quantidade
            }));
        } catch (error) {
            console.error('Erro ao obter produção timeline:', error);
            throw error;
        }
    }

    // Gráfico 2: Comparativo de Produção entre Todos os Turnos
    static async obterComparativoTurnos(id_empresa) {
        try {
            const resultado = await prisma.evento.groupBy({
                by: ['id_turno'],
                where: {
                    id_empresa: id_empresa,
                    tipo_evento: 'Produção'
                },
                _sum: {
                    quantidade_lotes: true
                }
            });

            // Buscar nome dos turnos
            const turnos = await prisma.turno.findMany({
                where: { id_empresa: id_empresa },
                select: { id_turno: true, nome_turno: true }
            });

            return resultado.map(item => {
                const turno = turnos.find(t => t.id_turno === item.id_turno);
                return {
                    id_turno: item.id_turno,
                    nome_turno: turno?.nome_turno || 'Desconhecido',
                    producao: item._sum.quantidade_lotes || 0
                };
            });
        } catch (error) {
            console.error('Erro ao obter comparativo de turnos:', error);
            throw error;
        }
    }

    // Gráfico 3: Distribuição de Produção por Máquina em um Turno
    static async obterDistribuicaoMaquinas(id_turno) {
        try {
            const resultado = await prisma.evento.groupBy({
                by: ['id_maquina'],
                where: {
                    id_turno: Number(id_turno),
                    tipo_evento: 'Produção'
                },
                _sum: {
                    quantidade_lotes: true
                }
            });

            // Buscar nome das máquinas
            const maquinas = await prisma.maquina.findMany({
                select: { id_maquina: true, nome_maquina: true }
            });

            return resultado.map(item => {
                const maquina = maquinas.find(m => m.id_maquina === item.id_maquina);
                const producao = item._sum.quantidade_lotes || 0;
                return {
                    id_maquina: item.id_maquina,
                    nome_maquina: maquina?.nome_maquina || 'Desconhecida',
                    producao: producao
                };
            });
        } catch (error) {
            console.error('Erro ao obter distribuição de máquinas:', error);
            throw error;
        }
    }

    // Gráfico 4: Tempo Parado vs Produção (e Disponibilidade)
    static async obterTempoParado(id_turno) {
        try {
            const [paradas, producao] = await Promise.all([
                prisma.evento.findMany({
                    where: {
                        id_turno: Number(id_turno),
                        tipo_evento: 'Parada'
                    },
                    select: {
                        motivo_parada: true,
                        duracao_minutos: true,
                        data_evento: true
                    }
                }),
                prisma.evento.aggregate({
                    where: {
                        id_turno: Number(id_turno),
                        tipo_evento: 'Produção'
                    },
                    _sum: {
                        quantidade_lotes: true
                    }
                })
            ]);

            // Calcular tempo total parado
            const tempoTotalParado = paradas.reduce((acc, p) => acc + (p.duracao_minutos || 0), 0);

            // Agrupar paradas por motivo
            const paradasPorMotivo = {};
            paradas.forEach(parada => {
                const motivo = parada.motivo_parada || 'Outro';
                if (!paradasPorMotivo[motivo]) {
                    paradasPorMotivo[motivo] = 0;
                }
                paradasPorMotivo[motivo] += parada.duracao_minutos || 0;
            });

            // Turno padrão é 8 horas = 480 minutos
            const duracao_turno = 480;
            const disponibilidade = Math.max(0, ((duracao_turno - tempoTotalParado) / duracao_turno) * 100);

            return {
                tempo_total_parado_minutos: tempoTotalParado,
                tempo_total_parado_horas: (tempoTotalParado / 60).toFixed(2),
                percentual_parado: ((tempoTotalParado / duracao_turno) * 100).toFixed(2),
                disponibilidade_percentual: disponibilidade.toFixed(2),
                producao_total_lotes: producao._sum.quantidade_lotes || 0,
                paradas_por_motivo: Object.entries(paradasPorMotivo).map(([motivo, tempo]) => ({
                    motivo,
                    tempo_minutos: tempo,
                    tempo_horas: (tempo / 60).toFixed(2)
                }))
            };
        } catch (error) {
            console.error('Erro ao obter tempo parado:', error);
            throw error;
        }
    }

    // Gráfico 5: Ocupação de Operadores por Turno
    static async obterOcupacaoOperadores(id_turno) {
        try {
            const operadores = await prisma.escalaTrabalhо.findMany({
                where: {
                    id_turno: Number(id_turno)
                },
                include: {
                    usuario: {
                        select: {
                            id_usuario: true,
                            nome_usuario: true
                        }
                    }
                }
            });

            // Se não encontrar por nome exato, tentar alternativa
            if (operadores.length === 0) {
                const operadoresAlt = await prisma.usuario.findMany({
                    select: {
                        id_usuario: true,
                        nome_usuario: true
                    }
                });
                return operadoresAlt.map(op => ({
                    id_usuario: op.id_usuario,
                    nome_usuario: op.nome_usuario,
                    status: 'Disponível',
                    horas_trabalhadas: 0
                }));
            }

            return operadores.map(e => ({
                id_usuario: e.usuario.id_usuario,
                nome_usuario: e.usuario.nome_usuario,
                status: 'Ativo',
                horas_trabalhadas: 8 // Padrão para turno completo
            }));
        } catch (error) {
            console.error('Erro ao obter ocupação de operadores:', error);
            throw error;
        }
    }

    // Gráfico 6: Distribuição de Paradas por Motivo (Pizza)
    static async obterDistribuicaoParadas(id_turno) {
        try {
            const paradas = await prisma.evento.findMany({
                where: {
                    id_turno: Number(id_turno),
                    tipo_evento: 'Parada'
                },
                select: {
                    motivo_parada: true,
                    duracao_minutos: true
                }
            });

            const distribuicao = {};
            let totalParadas = 0;

            paradas.forEach(parada => {
                const motivo = parada.motivo_parada || 'Outro';
                if (!distribuicao[motivo]) {
                    distribuicao[motivo] = 0;
                }
                const duracao = parada.duracao_minutos || 0;
                distribuicao[motivo] += duracao;
                totalParadas += duracao;
            });

            return Object.entries(distribuicao).map(([motivo, tempo]) => ({
                motivo,
                tempo_minutos: tempo,
                percentual: totalParadas > 0 ? ((tempo / totalParadas) * 100).toFixed(2) : 0
            }));
        } catch (error) {
            console.error('Erro ao obter distribuição de paradas:', error);
            throw error;
        }
    }

    // Gráfico 7: Dados Agregados e Resumo do Turno
    static async obterResumoTurno(id_turno) {
        try {
            const [turno, producao, paradas, maquinas] = await Promise.all([
                prisma.turno.findUnique({
                    where: { id_turno: Number(id_turno) }
                }),
                prisma.evento.aggregate({
                    where: {
                        id_turno: Number(id_turno),
                        tipo_evento: 'Produção'
                    },
                    _sum: {
                        quantidade_lotes: true
                    }
                }),
                prisma.evento.aggregate({
                    where: {
                        id_turno: Number(id_turno),
                        tipo_evento: 'Parada'
                    },
                    _count: true,
                    _sum: {
                        duracao_minutos: true
                    }
                }),
                prisma.evento.findMany({
                    where: {
                        id_turno: Number(id_turno),
                        tipo_evento: 'Produção'
                    },
                    distinct: ['id_maquina'],
                    select: { id_maquina: true }
                })
            ]);

            const tempoParado = paradas._sum.duracao_minutos || 0;
            const disponibilidade = Math.max(0, ((480 - tempoParado) / 480) * 100);

            return {
                turno: turno?.nome_turno || 'Desconhecido',
                hora_inicio: turno?.hora_inicio,
                hora_fim: turno?.hora_fim,
                producao_total_lotes: producao._sum.quantidade_lotes || 0,
                maquinas_ativas: maquinas.length,
                numero_paradas: paradas._count,
                tempo_parado_minutos: tempoParado,
                tempo_parado_horas: (tempoParado / 60).toFixed(2),
                disponibilidade_percentual: disponibilidade.toFixed(2),
                eficiencia_estimada: (disponibilidade * 0.8).toFixed(2) // OEE estimado
            };
        } catch (error) {
            console.error('Erro ao obter resumo do turno:', error);
            throw error;
        }
    }
}

export default TurnoModel;