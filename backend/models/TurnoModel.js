import prisma from '../config/prisma.js';

class TurnoModel {
    static diasSemana = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

    static normalizarDataReferencia(valor = new Date()) {
        if (valor instanceof Date) return valor;

        if (typeof valor === 'string' && /^\d{1,2}:\d{2}/.test(valor)) {
            const [hora, minuto = '0', segundo = '0'] = valor.split(':');
            const data = new Date();
            data.setHours(Number(hora), Number(minuto), Number(segundo), 0);
            return data;
        }

        return new Date(valor);
    }

    static obterNomeDiaSemana(data) {
        return this.diasSemana[data.getDay()];
    }

    static obterNomeDiaAnterior(data) {
        const anterior = new Date(data);
        anterior.setDate(data.getDate() - 1);
        return this.obterNomeDiaSemana(anterior);
    }

    static minutosDoDia(valor) {
        if (typeof valor === 'string') {
            const [hora, minuto = '0'] = valor.split(':');
            return (Number(hora) * 60) + Number(minuto);
        }

        const data = new Date(valor);
        return (data.getHours() * 60) + data.getMinutes();
    }

    static horarioPertenceAoTurno(minutoAtual, minutoInicio, minutoFim) {
        if (minutoInicio <= minutoFim) {
            return minutoAtual >= minutoInicio && minutoAtual <= minutoFim;
        }

        return minutoAtual >= minutoInicio || minutoAtual <= minutoFim;
    }

    static montarDataComMinutos(dataReferencia, minutos) {
        const data = new Date(dataReferencia);
        data.setHours(Math.floor(minutos / 60), minutos % 60, 0, 0);
        return data;
    }

    static obterPeriodoTurno(turno, dataReferencia = new Date()) {
        const data = this.normalizarDataReferencia(dataReferencia);
        const inicioMinutos = this.minutosDoDia(turno.hora_inicio);
        const fimMinutos = this.minutosDoDia(turno.hora_fim);
        const minutoAtual = this.minutosDoDia(data);

        let inicio = this.montarDataComMinutos(data, inicioMinutos);
        let fim = this.montarDataComMinutos(data, fimMinutos);

        if (inicioMinutos > fimMinutos) {
            if (minutoAtual <= fimMinutos) {
                inicio.setDate(inicio.getDate() - 1);
            } else {
                fim.setDate(fim.getDate() + 1);
            }
        }

        return { inicio, fim };
    }

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
    static async obterTurnoAtual(id_empresa, hora_atual = new Date(), dia_semana = null) {
        try {
            const dataReferencia = this.normalizarDataReferencia(hora_atual);
            const minutoAtual = this.minutosDoDia(dataReferencia);
            const diaAtual = dia_semana || this.obterNomeDiaSemana(dataReferencia);
            const diaAnterior = this.obterNomeDiaAnterior(dataReferencia);

            const turnos = await prisma.turno.findMany({
                where: {
                    id_empresa,
                    dia_semana: {
                        in: Array.from(new Set([diaAtual, diaAnterior]))
                    }
                },
                orderBy: {
                    hora_inicio: 'asc'
                }
            });

            const turnoAtual = turnos.find(turno => {
                const inicio = this.minutosDoDia(turno.hora_inicio);
                const fim = this.minutosDoDia(turno.hora_fim);
                const cruzaMeiaNoite = inicio > fim;

                if (!cruzaMeiaNoite && turno.dia_semana !== diaAtual) {
                    return false;
                }

                if (cruzaMeiaNoite && ![diaAtual, diaAnterior].includes(turno.dia_semana)) {
                    return false;
                }

                return this.horarioPertenceAoTurno(minutoAtual, inicio, fim);
            });

            return turnoAtual || null;
        } catch (error) {
            console.error('Erro ao obter turno atual:', error);
            throw error;
        }
    }

    static async listarOperadoresTurno(id_turno, dia_semana, id_empresa) {
        try {
            return await prisma.escalaTrabalho.findMany({
                where: {
                    id_turno,
                    id_empresa,
                    turno: {
                        dia_semana
                    }
                },
                include: {
                    operador: {
                        select: {
                            id_usuario: true,
                            nome: true,
                            email: true,
                            tipo: true
                        }
                    },
                    maquina: {
                        select: {
                            id_maquina: true,
                            nome: true,
                            serie: true,
                            status_atual: true
                        }
                    },
                    setor: {
                        select: {
                            id_setor: true,
                            nome_setor: true
                        }
                    },
                    turno: true
                }
            });
        } catch (error) {
            console.error('Erro ao listar operadores do turno:', error);
            throw error;
        }
    }

    static async verificarConflitoTurno(id_operador, dia_semana, hora_inicio, hora_fim, id_empresa = null) {
        try {
            const novoInicio = this.minutosDoDia(hora_inicio);
            const novoFim = this.minutosDoDia(hora_fim);

            const escalas = await prisma.escalaTrabalho.findMany({
                where: {
                    id_operador,
                    ...(id_empresa ? { id_empresa } : {}),
                    turno: {
                        dia_semana
                    }
                },
                include: {
                    turno: true
                }
            });

            return escalas.some(escala => {
                const inicio = this.minutosDoDia(escala.turno.hora_inicio);
                const fim = this.minutosDoDia(escala.turno.hora_fim);
                return novoInicio < fim && novoFim > inicio;
            });
        } catch (error) {
            console.error('Erro ao verificar conflito de turno:', error);
            throw error;
        }
    }

    // ------------------------ Dashboards ----------------------- //

    // Busca a soma total de lotes produzidos em um turno específico
    static async obterLotesProduzidosPorTurno(id_empresa) {
        try {
            const turnos = await prisma.turno.findMany({
                where: { id_empresa },
                select: {
                    id_turno: true,
                    nome_turno: true
                }
            });

            return await Promise.all(turnos.map(async turno => ({
                id_turno: turno.id_turno,
                turno: turno.nome_turno,
                lotes_produzidos: await this.buscarProducaoTurnoLotes(turno.id_turno, id_empresa)
            })));
        } catch (error) {
            console.error('Erro ao obter lotes produzidos por turno:', error);
            throw error;
        }
    }

    // Busca a quantidade de máquinas únicas ativas em um turno específico
    static async obterMaquinasAtivasPorTurno(id_empresa) {
        try {
            const turnos = await prisma.turno.findMany({
                where: { id_empresa },
                select: {
                    id_turno: true,
                    nome_turno: true
                }
            });

            return await Promise.all(turnos.map(async turno => ({
                id_turno: turno.id_turno,
                turno: turno.nome_turno,
                maquinas_ativas: await this.buscarMaquinasAtivasTurno(turno.id_turno, id_empresa)
            })));
        } catch (error) {
            console.error('Erro ao obter máquinas ativas por turno:', error);
            throw error;
        }
    }

    // Busca a soma total de lotes produzidos em um turno específico (para KPI)
    static async buscarProducaoTurnoLotes(id_turno, id_empresa = null, dataInicio = null, dataFim = null) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_turno: Number(id_turno),
                    id_ordemProducao: {
                        not: null
                    },
                    ...(id_empresa ? { id_empresa } : {}),
                    ...(dataInicio || dataFim ? {
                        data_hora_fim: {
                            ...(dataInicio ? { gte: dataInicio } : {}),
                            ...(dataFim ? { lte: dataFim } : {})
                        }
                    } : {})
                },
                distinct: ['id_ordemProducao'],
                select: {
                    id_ordemProducao: true
                }
            });
            return apontamentos.length;
        } catch (error) {
            console.error('Erro ao buscar produção do turno:', error);
            throw error;
        }
    }

    // Busca a quantidade de máquinas únicas ativas em um turno específico (para KPI)
    static async buscarMaquinasAtivasTurno(id_turno, id_empresa = null, dataInicio = null, dataFim = null) {
        try {
            const result = await prisma.apontamento.findMany({
                where: {
                    id_turno: Number(id_turno),
                    ...(id_empresa ? { id_empresa } : {}),
                    ...(dataInicio || dataFim ? {
                        data_hora_fim: {
                            ...(dataInicio ? { gte: dataInicio } : {}),
                            ...(dataFim ? { lte: dataFim } : {})
                        }
                    } : {})
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

    static async obterKpisTurnoAtual(id_empresa, dataReferencia = new Date()) {
        try {
            const turno = await this.obterTurnoAtual(id_empresa, dataReferencia);

            if (!turno) {
                return {
                    turno: null,
                    maquinasAtivas: 0,
                    producaoLotes: 0
                };
            }

            const periodo = this.obterPeriodoTurno(turno, dataReferencia);
            const [maquinasAtivas, producaoLotes] = await Promise.all([
                this.buscarMaquinasAtivasTurno(turno.id_turno, id_empresa, periodo.inicio, periodo.fim),
                this.buscarProducaoTurnoLotes(turno.id_turno, id_empresa, periodo.inicio, periodo.fim)
            ]);

            return {
                turno: {
                    id_turno: turno.id_turno,
                    nome_turno: turno.nome_turno,
                    dia_semana: turno.dia_semana,
                    inicio: periodo.inicio,
                    fim: periodo.fim
                },
                maquinasAtivas,
                producaoLotes
            };
        } catch (error) {
            console.error('Erro ao obter KPIs do turno atual:', error);
            throw error;
        }
    }

    static async obterStatusMaquinasPorTurno(id_empresa) {
        try {
            const turnos = await prisma.turno.findMany({
                where: { id_empresa },
                include: {
                    escalas: {
                        include: {
                            maquina: {
                                select: {
                                    id_maquina: true,
                                    status_atual: true,
                                    ativo: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    id_turno: 'asc'
                }
            });

            return turnos.map(turno => {
                const maquinasUnicas = new Map();

                for (const escala of turno.escalas) {
                    if (escala.maquina?.ativo) {
                        maquinasUnicas.set(escala.maquina.id_maquina, escala.maquina.status_atual);
                    }
                }

                const contadores = {
                    ativas: 0,
                    paradas: 0,
                    manutencao: 0
                };

                for (const status of maquinasUnicas.values()) {
                    if (status === 'Produzindo') contadores.ativas += 1;
                    else if (status === 'Manutencao') contadores.manutencao += 1;
                    else contadores.paradas += 1;
                }

                return {
                    id_turno: turno.id_turno,
                    turno: turno.nome_turno,
                    dia_semana: turno.dia_semana,
                    ...contadores
                };
            });
        } catch (error) {
            console.error('Erro ao obter status de maquinas por turno:', error);
            throw error;
        }
    }

    // Gráfico 1: Produção Timeline - Produção ao longo do tempo durante um turno
    static async obterProducaoTimeline(id_turno) {
        try {
            const eventos = await prisma.apontamento.findMany({
                where: {
                    id_turno: Number(id_turno)
                },
                select: {
                    data_hora_fim: true,
                    qtd_boa: true,
                    id_maquina: true
                },
                orderBy: {
                    data_hora_fim: 'asc'
                }
            });

            // Agrupar por intervalo de tempo (hora/minuto do apontamento)
            const timeline = {};
            eventos.forEach(evento => {
                const time = evento.data_hora_fim.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
                if (!timeline[time]) {
                    timeline[time] = 0;
                }
                timeline[time] += evento.qtd_boa || 0;
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
            const resultado = await prisma.apontamento.groupBy({
                by: ['id_turno'],
                where: {
                    id_empresa: id_empresa
                },
                _sum: {
                    qtd_boa: true
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
                    producao: item._sum.qtd_boa || 0
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
            const resultado = await prisma.apontamento.groupBy({
                by: ['id_maquina'],
                where: {
                    id_turno: Number(id_turno)
                },
                _sum: {
                    qtd_boa: true
                }
            });

            // Buscar nome das máquinas
            const maquinas = await prisma.maquinas.findMany({
                select: { id_maquina: true, nome: true }
            });

            return resultado.map(item => {
                const maquina = maquinas.find(m => m.id_maquina === item.id_maquina);
                const producao = item._sum.qtd_boa || 0;
                return {
                    id_maquina: item.id_maquina,
                    nome: maquina?.nome || 'Desconhecida',
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
                prisma.historico_Eventos.findMany({
                    where: {
                        id_turno: Number(id_turno),
                        status_atual: 'Parada'
                    },
                    select: {
                        motivo_parada: true,
                        duracao: true,
                        inicio: true
                    }
                }),
                prisma.apontamento.aggregate({
                    where: {
                        id_turno: Number(id_turno)
                    },
                    _sum: {
                        qtd_boa: true
                    }
                })
            ]);

            // Calcular tempo total parado
            const tempoTotalParado = paradas.reduce((acc, p) => acc + (p.duracao || 0), 0);

            // Agrupar paradas por motivo
            const paradasPorMotivo = {};
            paradas.forEach(parada => {
                const motivo = parada.motivo_parada?.descricao || 'Outro';
                if (!paradasPorMotivo[motivo]) {
                    paradasPorMotivo[motivo] = 0;
                }
                paradasPorMotivo[motivo] += parada.duracao || 0;
            });

            // Turno padrão é 8 horas = 480 minutos
            const duracao_turno = 480;
            const disponibilidade = Math.max(0, ((duracao_turno - tempoTotalParado) / duracao_turno) * 100);

            return {
                tempo_total_parado_minutos: tempoTotalParado,
                tempo_total_parado_horas: (tempoTotalParado / 60).toFixed(2),
                percentual_parado: ((tempoTotalParado / duracao_turno) * 100).toFixed(2),
                disponibilidade_percentual: disponibilidade.toFixed(2),
                producao_total_lotes: producao._sum.qtd_boa || 0,
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
            const operadores = await prisma.escalaTrabalho.findMany({
                where: {
                    id_turno: Number(id_turno)
                },
                include: {
                    operador: {
                        select: {
                            id_usuario: true,
                            nome: true
                        }
                    }
                }
            });

            // Se não encontrar por nome exato, tentar alternativa
            if (operadores.length === 0) {
                const operadoresAlt = await prisma.usuarios.findMany({
                    select: {
                        id_usuario: true,
                        nome: true
                    }
                });
                return operadoresAlt.map(op => ({
                    id_usuario: op.id_usuario,
                    nome: op.nome,
                    status: 'Disponível',
                    horas_trabalhadas: 0
                }));
            }

            return operadores.map(e => ({
                id_usuario: e.operador.id_usuario,
                nome: e.operador.nome,
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
            const paradas = await prisma.historico_Eventos.findMany({
                where: {
                    id_turno: Number(id_turno),
                    status_atual: 'Parada'
                },
                select: {
                    motivo_parada: true,
                    duracao: true
                }
            });

            const distribuicao = {};
            let totalParadas = 0;

            paradas.forEach(parada => {
                const motivo = parada.motivo_parada?.descricao || 'Outro';
                if (!distribuicao[motivo]) {
                    distribuicao[motivo] = 0;
                }
                const duracao = parada.duracao || 0;
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

    // Gráfico 7: Resumo Geral do Turno (OEE, Disponibilidade, Produção)
    static async obterResumoTurno(id_turno) {
        try {
            const [turno, producao, paradas, maquinas] = await Promise.all([
                prisma.turno.findUnique({
                    where: { id_turno: Number(id_turno) }
                }),
                prisma.apontamento.aggregate({
                    where: {
                        id_turno: Number(id_turno)
                    },
                    _sum: {
                        qtd_boa: true
                    }
                }),
                prisma.historico_Eventos.aggregate({
                    where: {
                        id_turno: Number(id_turno),
                        status_atual: 'Parada'
                    },
                    _count: {
                        id_evento: true
                    },
                    _sum: {
                        duracao: true
                    }
                }),
                prisma.apontamento.findMany({
                    where: {
                        id_turno: Number(id_turno)
                    },
                    distinct: ['id_maquina'],
                    select: { id_maquina: true }
                })
            ]);

            const tempoParado = paradas._sum.duracao || 0;
            const disponibilidade = Math.max(0, ((480 - tempoParado) / 480) * 100);

            return {
                turno: turno?.nome_turno || 'Desconhecido',
                hora_inicio: turno?.hora_inicio,
                hora_fim: turno?.hora_fim,
                producao_total_lotes: producao._sum.qtd_boa || 0,
                maquinas_ativas: maquinas.length,
                numero_paradas: paradas._count.id_evento,
                tempo_parado_minutos: tempoParado,
                tempo_parado_horas: (tempoParado / 60).toFixed(2),
                disponibilidade_percentual: disponibilidade.toFixed(2),
                eficiencia_estimada: (disponibilidade * 0.8).toFixed(2) // OEE estimado multiplicando por uma performance padrão
            };
        } catch (error) {
            console.error('Erro ao obter resumo do turno:', error);
            throw error;
        }
    }
}

export default TurnoModel;
