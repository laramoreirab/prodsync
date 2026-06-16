import prisma from '../config/prisma.js';
import TurnoModel from './TurnoModel.js';
import OrdemProducaoModel from './OrdemProducaoModel.js';
import NotificacaoModel from './NotificacaoModel.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';

const JANELA_EVENTO_DUPLICADO_MS = 1500;

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

    static normalizarStatusMaquina(status) {
        const valor = String(status ?? '')
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
            .replace(/[\s_-]+/g, ' ');

        if (['PRODUZINDO', 'PRODUCAO', 'EM PRODUCAO', 'PRODUCING', 'RUNNING', 'RUN', 'START', 'ON', 'LIGADA', 'GREEN', 'VERDE'].includes(valor)) {
            return 'Produzindo';
        }
        if (['PARADA', 'PARADO', 'STOPPED', 'STOP', 'OFF', 'DESLIGADA', 'RED', 'VERMELHO'].includes(valor)) {
            return 'Parada';
        }
        if (['SETUP', 'SETUP/AJUSTE', 'AJUSTE', 'YELLOW', 'AMARELO'].includes(valor)) {
            return 'Setup';
        }
        if (['MANUTENCAO', 'MAINTENANCE'].includes(valor)) {
            return 'Parada';
        }
        if (['AGUARDANDO', 'WAITING', 'IDLE'].includes(valor)) {
            return 'Aguardando';
        }

        return null;
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
        const duracaoMinutos = evento.duracao ?? (
            evento.inicio
                ? this.calcularDuracao(evento.inicio, evento.termino ?? new Date())
                : null
        );
        const horas = duracaoMinutos != null ? Math.floor(duracaoMinutos / 60) : 0;
        const mins = duracaoMinutos != null ? duracaoMinutos % 60 : 0;
        const duracaoTexto = duracaoMinutos != null
            ? `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
            : null;

        return {
            ...evento,
            inicio_formatado: evento.inicio
                ? new Date(evento.inicio).toLocaleString('pt-BR')
                : null,
            termino_formatado: evento.termino
                ? new Date(evento.termino).toLocaleString('pt-BR')
                : null,
            duracao: duracaoTexto
        };
    }

    static async obterMaquinaOperador(id_empresa, id_operador) {
        const escala = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador),
                id_maquina: { not: null }
            },
            select: { id_maquina: true }
        });

        if (escala?.id_maquina) return escala.id_maquina;

        const maquina = await prisma.maquinas.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador),
                ativo: true
            },
            select: { id_maquina: true }
        });

        return maquina?.id_maquina ?? null;
    }

    static async listarTodos(id_empresa, paginacao, setorId = null) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa,
                    ...(setorId ? { setor_afetado: Number(setorId) } : {})
                },
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
                orderBy: [
                    { inicio: 'desc' },
                    { id_evento: 'desc' }
                ]
            };

            return await paginarPrisma(prisma.historico_Eventos, regrasDaBusca, paginacao);
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            throw error;
        }
    }

    static async listarPorOperador(id_empresa, id_operador, paginacao) {
        try {
            const id_maquina = await this.obterMaquinaOperador(id_empresa, id_operador);

            if (!id_maquina) {
                return {
                    dados: [],
                    meta: {
                        totalItens: 0,
                        itensPorPagina: paginacao.limite,
                        totalPaginas: 0,
                        paginaAtual: paginacao.pagina
                    }
                };
            }

            const regrasDaBusca = {
                where: { id_empresa, id_maquina },
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
                orderBy: { inicio: 'desc' }
            };

            return await paginarPrisma(prisma.historico_Eventos, regrasDaBusca, paginacao);
        } catch (error) {
            console.error('Erro ao listar eventos do operador:', error);
            throw error;
        }
    }

    static async obterEventoPendente(id_empresa, id_operador = null) {
        try {
            const id_maquina = id_operador
                ? await this.obterMaquinaOperador(id_empresa, id_operador)
                : null;

            if (id_operador && !id_maquina) return null;

            const evento = await prisma.historico_Eventos.findFirst({
                where: {
                    id_empresa,
                    ...(id_maquina ? { id_maquina } : {}),
                    id_motivo_parada: null,
                    status_atual: {
                        in: ['Parada', 'Setup', 'Manutencao']
                    }
                },
                include: {
                    maquina: {
                        select: { id_maquina: true, nome: true, serie: true }
                    }
                },
                orderBy: { inicio: 'desc' }
            });

            return evento ? this.formatarEvento(evento) : null;
        } catch (error) {
            console.error('Erro ao buscar evento pendente:', error);
            throw error;
        }
    }
    //listar paradas não justificadas
    static async listarNaoJustificadas(id_empresa, paginacao, setorId = null) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { setor_afetado: Number(setorId) } : {}),
                    id_motivo_parada: {
                        equals: null
                    },
                }
            }
            const resultadoPaginado = await paginarPrisma(
                prisma.historico_Eventos,
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
    static async listarJustificadas(id_empresa, paginacao, setorId = null) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { setor_afetado: Number(setorId) } : {}),
                    id_motivo_parada: {
                        not: null
                    },
                }
            }
            const resultadoPaginado = await paginarPrisma(
                prisma.historico_Eventos,
                regrasDaBusca,
                paginacao
            );
            return resultadoPaginado

        } catch (error) {
            console.error('Erro ao listar eventos justificados:', error);
            throw error;
        }
    }

    static requerJustificativa(status) {
        return ['Parada', 'Setup', 'Manutencao'].includes(status);
    }

    static async obterUltimoEventoMaquina(id_empresa, id_maquina, db = prisma) {
        return db.historico_Eventos.findFirst({
            where: {
                id_empresa: Number(id_empresa),
                id_maquina: Number(id_maquina),
            },
            orderBy: [{ inicio: 'desc' }, { id_evento: 'desc' }],
        });
    }

    static async validarPodeRegistrarEvento(id_empresa, id_maquina, db = prisma) {
        const ultimoEvento = await this.obterUltimoEventoMaquina(id_empresa, id_maquina, db);

        if (
            ultimoEvento &&
            this.requerJustificativa(ultimoEvento.status_atual) &&
            !ultimoEvento.id_motivo_parada &&
            !ultimoEvento.termino
        ) {
            const erro = new Error(
                `A máquina ${id_maquina} possui o evento #${ultimoEvento.id_evento} (${ultimoEvento.status_atual}) sem justificativa. Justifique-o antes de registrar um novo evento.`
            );
            erro.code = 'EVENTO_PENDENTE';
            erro.id_evento = ultimoEvento.id_evento;
            throw erro;
        }
    }

    static async fecharEventosAbertosMaquina(db, id_empresa, id_maquina, termino, idEventoMantido = null) {
        const eventosAbertos = await db.historico_Eventos.findMany({
            where: {
                id_empresa: Number(id_empresa),
                id_maquina: Number(id_maquina),
                termino: null,
                ...(idEventoMantido ? { id_evento: { not: Number(idEventoMantido) } } : {})
            },
            select: {
                id_evento: true,
                inicio: true
            }
        });

        for (const evento of eventosAbertos) {
            await db.historico_Eventos.updateMany({
                where: {
                    id_empresa: Number(id_empresa),
                    id_maquina: Number(id_maquina),
                    id_evento: evento.id_evento
                },
                data: {
                    termino,
                    duracao: this.calcularDuracao(evento.inicio, termino)
                }
            });
        }
    }

    static async registrarEventoMaquina(id_empresa, status_maquina, id_maquina, datastamp) {
        try {
            const statusNormalizado = this.normalizarStatusMaquina(status_maquina);
            if (!statusNormalizado) {
                throw new Error(`Status de maquina invalido: ${status_maquina}`);
            }
            const empresaId = Number(id_empresa);
            const maquinaId = Number(id_maquina);
            const inicio = this.converterTimestamp(datastamp);
            let status_op = null
            let prioridade = null
            const maquina = await prisma.maquinas.findFirst({
                where: {
                    id_empresa: empresaId,
                    id_maquina: maquinaId,
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

            const turno = await TurnoModel.obterTurnoAtual(empresaId, inicio);
            if (!turno) {
                throw new Error('Nenhum turno ativo encontrado para o horario informado');
            }

            // Validacao feita dentro da transacao abaixo, apos adquirir a trava da maquina.

            const atualizarMaquina = await prisma.maquinas.updateMany({
                where:{ id_empresa: empresaId, id_maquina: maquinaId, ativo: true },
                data:{ status_atual: statusNormalizado }
            })
            if(atualizarMaquina.count === 0){
                throw new Error('Erro ao atualizar status da máquina'); 
            }

            //fazer um if se o status for produzindo mudar status da op vinculada a máquina para em_andamento, se vier setup ou parada buscar a op ativa e setar status
            switch (statusNormalizado) {
                case 'Produzindo':
                    status_op = 'Em_Andamento'
                    prioridade = 'Media'
                    break;

                case 'Setup':
                    status_op = 'Setup'
                    prioridade = 'Alta'

                    break;
                case 'Parada':
                    status_op = 'Parada'
                    prioridade = 'Critica'
                    break;
                default:
                    console.warn(`[AVISO] Status de máquina desconhecido recebido: ${status_maquina}`);
                    break;
            }

            // busca a ordem de produção ativa da máquina
            const ordemProducaoId = await OrdemProducaoModel.buscarOrdemAtiva(maquinaId);

            if (ordemProducaoId && status_op) {
                await prisma.ordemProducao.update({
                    where: { id_ordem: ordemProducaoId },
                    data: {
                        status_op: status_op,
                        prioridade: prioridade
                    }
                });
            } else if (statusNormalizado === 'Produzindo' && !ordemProducaoId) {
                console.warn(`[ALERTA] Maquina ${maquinaId} esta PRODUZINDO, mas nenhuma OP ativa foi encontrada no sistema!`);
            }

            const { resultado, criado } = await prisma.$transaction(async (tx) => {
                await tx.$queryRaw`SELECT pg_advisory_xact_lock(${empresaId}::int, ${maquinaId}::int)`;

                const eventoAtual = await this.obterUltimoEventoMaquina(empresaId, maquinaId, tx);
                if (eventoAtual?.status_atual === statusNormalizado) {
                    await tx.maquinas.updateMany({
                        where: { id_empresa: empresaId, id_maquina: maquinaId, ativo: true },
                        data: { status_atual: statusNormalizado }
                    });
                    await this.fecharEventosAbertosMaquina(tx, empresaId, maquinaId, eventoAtual.inicio, eventoAtual.id_evento);
                    console.warn(`[AVISO] Ultimo evento da maquina ${maquinaId} ja e ${statusNormalizado}. Evento duplicado ignorado.`);
                    return { resultado: eventoAtual, criado: false };
                }

                const inicioJanela = new Date(inicio.getTime() - JANELA_EVENTO_DUPLICADO_MS);
                const eventoDuplicadoRecente = await tx.historico_Eventos.findFirst({
                    where: {
                        id_empresa: empresaId,
                        id_maquina: maquinaId,
                        status_atual: statusNormalizado,
                        inicio: {
                            gte: inicioJanela,
                            lte: inicio
                        }
                    },
                    orderBy: [{ inicio: 'desc' }, { id_evento: 'desc' }]
                });

                if (eventoDuplicadoRecente) {
                    await tx.maquinas.updateMany({
                        where: { id_empresa: empresaId, id_maquina: maquinaId, ativo: true },
                        data: { status_atual: statusNormalizado }
                    });
                    await this.fecharEventosAbertosMaquina(tx, empresaId, maquinaId, eventoDuplicadoRecente.inicio, eventoDuplicadoRecente.id_evento);
                    console.warn(`[AVISO] Evento ${statusNormalizado} duplicado em janela curta ignorado para a maquina ${maquinaId}.`);
                    return { resultado: eventoDuplicadoRecente, criado: false };
                }

                await this.fecharEventosAbertosMaquina(tx, empresaId, maquinaId, inicio);
                await this.validarPodeRegistrarEvento(empresaId, maquinaId, tx);

                const eventoCriado = await tx.historico_Eventos.create({
                    data: {
                        id_empresa: empresaId,
                        id_maquina: maquinaId,
                        id_ordemProducao: ordemProducaoId,
                        id_turno: turno.id_turno,
                        status_atual: statusNormalizado,
                        setor_afetado: maquina.id_setor ?? 0,
                        inicio,
                        observacao: ''
                    }
                });

                return { resultado: eventoCriado, criado: true };
            });

            if (criado && this.requerJustificativa(statusNormalizado)) {
                const maquinaInfo = await prisma.maquinas.findFirst({
                    where: { id_empresa: empresaId, id_maquina: maquinaId },
                    select: { nome: true },
                });
                await NotificacaoModel.notificarEventoMaquina(
                    empresaId,
                    resultado,
                    maquinaInfo?.nome ?? `Maquina ${maquinaId}`
                ).catch((err) => {
                    console.error('Erro ao criar notificações do evento:', err);
                });
            }

            return this.formatarEvento(resultado);
        } catch (error) {
            console.error('Erro registrar evento da maquina no banco de dados:', error);
            throw error;
        }
    }

    static async registrarEventoSistema(id_empresa, status_maquina, setor_afetado, maquinas, inicio, fim, id_motivo_parada, observacao = null) {
        try {
            function capitalizar(texto) {
                if (!texto) return '';
                return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
            }
            const statusNormalizado = this.normalizarStatusMaquina(status_maquina) ?? capitalizar(status_maquina);
            const inicioConvertido = this.converterTimestamp(inicio)
            const fimConvertido = this.converterTimestamp(fim)
            const duracao = this.calcularDuracao(inicio, fim)
            const turno = await TurnoModel.obterTurnoAtual(id_empresa, inicioConvertido)
                ?? await prisma.turno.findFirst({ where: { id_empresa } })

            if (!turno) {
                throw new Error('Nenhum turno encontrado para registrar o evento');
            }

            const idsMaquinas = maquinas.map(Number).filter((id) => Number.isInteger(id) && id > 0);
            if (idsMaquinas.length === 0) {
                throw new Error('Nenhuma maquina valida informada');
            }

            for (const id_maquina of idsMaquinas) {
                await this.validarPodeRegistrarEvento(id_empresa, id_maquina);
            }

            const setorNumerico = Number(setor_afetado);
            const maquinasEncontradas = await prisma.maquinas.findMany({
                where: {
                    id_empresa,
                    id_maquina: { in: idsMaquinas },
                    ativo: true
                },
                select: { id_maquina: true, id_setor: true }
            });
            const setorPorMaquina = new Map(maquinasEncontradas.map(maquina => [maquina.id_maquina, maquina.id_setor]));

            const eventosData = await Promise.all(idsMaquinas.map(async (id_maquina) => {
                const ordem = await prisma.ordemProducao.findFirst({
                    where: {
                        id_empresa,
                        id_maquina,
                        data_inicio: { lte: inicioConvertido },
                        OR: [{ data_fim: null }, { data_fim: { gte: inicioConvertido } }]
                    },
                    orderBy: { data_inicio: 'desc' },
                    select: { id_ordem: true }
                })

                return {
                    id_empresa,
                    id_maquina,
                    id_ordemProducao: ordem?.id_ordem ?? null,
                    id_turno: turno.id_turno,
                    status_atual: statusNormalizado,
                    setor_afetado: Number.isInteger(setorNumerico)
                        ? setorNumerico
                        : (setorPorMaquina.get(id_maquina) ?? 0),
                    inicio: inicioConvertido,
                    termino: fimConvertido,
                    duracao,
                    id_motivo_parada: Number(id_motivo_parada),
                    observacao: observacao ?? ''
                }
            }))

            await prisma.historico_Eventos.createMany({ data: eventosData })

            await prisma.maquinas.updateMany({
                where: { id_empresa, id_maquina: { in: idsMaquinas } },
                data: { status_atual: statusNormalizado }
            })

            return eventosData
        } catch (error) {
            console.error('Erro registrar evento no banco de dados:', error)
            throw error
        }
    }

    static async atualizarEventoSistema(id_empresa, id_evento, dados) {
        try {
            const eventoAtual = await prisma.historico_Eventos.findFirst({
                where: { id_empresa, id_evento }
            });

            if (!eventoAtual) {
                throw new Error('Evento nao encontrado ou nao pertence a empresa');
            }

            const inicio = dados.inicio ? this.converterTimestamp(dados.inicio) : eventoAtual.inicio;
            const termino = dados.fim ? this.converterTimestamp(dados.fim) : (eventoAtual.termino ?? null);
            const idMaquina = Number(dados.id_maquina ?? dados.maquinas?.[0] ?? eventoAtual.id_maquina);
            const setorInformado = Number(dados.setor_afetado);
            const dataUpdate = {
                status_atual: dados.status_maquina
                    ? (this.normalizarStatusMaquina(dados.status_maquina) ?? dados.status_maquina)
                    : eventoAtual.status_atual,
                id_maquina: Number.isInteger(idMaquina) && idMaquina > 0 ? idMaquina : eventoAtual.id_maquina,
                inicio,
                termino,
                duracao: termino ? this.calcularDuracao(inicio, termino) : eventoAtual.duracao,
                id_motivo_parada: dados.id_motivo_parada ? Number(dados.id_motivo_parada) : eventoAtual.id_motivo_parada,
                observacao: dados.observacao ?? eventoAtual.observacao,
                setor_afetado: Number.isInteger(setorInformado) ? setorInformado : eventoAtual.setor_afetado
            };

            await prisma.historico_Eventos.updateMany({
                where: { id_empresa, id_evento },
                data: dataUpdate
            });

            return this.formatarEvento(await prisma.historico_Eventos.findFirst({
                where: { id_empresa, id_evento },
                include: {
                    maquina: { select: { id_maquina: true, nome: true, serie: true } },
                    motivo_parada: { select: { id_motivo: true, descricao: true, tipo: true } },
                    turno: { select: { id_turno: true, nome_turno: true } }
                }
            }));
        } catch (error) {
            console.error('Erro ao atualizar evento no banco de dados:', error);
            throw error;
        }
    }

    static async verificaJustificativa(id_empresa, id_evento) {
        try {
            const evento = await prisma.historico_Eventos.findFirst({
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

    static async justificar(id_empresa, id_maquina, id_evento, id_motivo_parada, observacao = '') {
        try {
            let status_op = null
            let prioridade = null

            if (
                observacao &&
                (observacao.toLowerCase().includes('finalizada') ||
                    observacao.toLowerCase().includes('terminada'))
            ) {
                status_op = 'Finalizada';
                prioridade = 'Baixa';
            }

            const ordemProducaoId = await OrdemProducaoModel.buscarOrdemAtiva(id_maquina);

            if (ordemProducaoId && status_op) {
                await prisma.ordemProducao.update({
                    where: { id_ordem: ordemProducaoId },
                    data: {
                        status_op: status_op,
                        prioridade: prioridade
                    }
                });
            }

            const resultado = await prisma.historico_Eventos.updateMany({
                where: {
                    id_empresa,
                    id_evento,
                    id_maquina
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
                    id_evento,
                    id_maquina
                }
            });
        } catch (error) {
            console.error('Erro salvar justificativa:', error);
            throw error;
        }
    }

    static async buscarPorId(id_evento, id_empresa){
        try {
              const resposta = await prisma.historico_Eventos.findFirst({
                where: { id_evento, id_empresa },
                include: {
                    maquina: { select: { id_maquina: true, nome: true, serie: true } },
                    motivo_parada: { select: { id_motivo: true, descricao: true, tipo: true } },
                    turno: { select: { id_turno: true, nome_turno: true } }
                }
            });

            return resposta
            
        } catch (error) {
            console.error('Erro buscar evento por ID no banco de dados', error);
            throw error;
        }
    }

    // -----------------------------------------------Dashboard de Eventos -------------------------------------------------------------------------------

    static async tempoParadoTempoProduzindoEvento(id_empresa, setorId = null) {
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
                    ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}),
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
                    ...(setorId ? { setor_afetado: Number(setorId) } : {}),
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
            { nome: 'Tempo Produzindo', valor: tempoProduzido },
            { nome: 'Tempo Parado', valor: tempoParado }
        ]
    }
    static async top3MotivosParada(id_empresa, setorId = null) {
        try {
            const resultado = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa,
                    ...(setorId ? { setor_afetado: Number(setorId) } : {}),
                    duracao: { not: null },
                    id_motivo_parada: { not: null }
                },
                _sum: { duracao: true },
                orderBy: { _sum: { duracao: 'desc' } },
                take: 3
            })

            const resultadoComNomes = await Promise.all(
                resultado.map(async (item) => {
                    const infoMotivo = await prisma.motivos_Parada.findUnique({
                        where: { id_motivo: item.id_motivo_parada },
                        select: { descricao: true }
                    })
                    return {
                        name: infoMotivo?.descricao || "Outros",
                        minutos: item._sum.duracao || 0
                    }
                })
            )
            return resultadoComNomes
        } catch (error) {
            console.error('Erro captar top 3 motivos de parada:', error)
            throw error
        }
    }

    // -------------- Dashboards --------------- //

    static async obterMotivosParadaFrequentes(id_empresa, limite = 10, setorId = null) {
        try {
            const agrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa,
                    ...(setorId ? { setor_afetado: Number(setorId) } : {}),
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

    static async obterParadasJustificadasComparativo(id_empresa, setorId = null) {
        try {
            const [justificadas, naoJustificadas] = await Promise.all([
                prisma.historico_Eventos.count({
                    where: {
                        id_empresa,
                        ...(setorId ? { setor_afetado: Number(setorId) } : {}),
                        id_motivo_parada: {
                            not: null
                        }
                    }
                }),
                prisma.historico_Eventos.count({
                    where: {
                        id_empresa,
                        ...(setorId ? { setor_afetado: Number(setorId) } : {}),
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

    static async obterTopMotivosTempo(id_empresa, limite = 3, setorId = null) {
        try {
            const agrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa: Number(id_empresa),
                    ...(setorId ? { setor_afetado: Number(setorId) } : {}),
                    id_motivo_parada: {
                        not: null
                    },
                    status_atual: {
                        in: ['Parada', 'Manutencao']
                    }
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
                    id_empresa: Number(id_empresa),
                    id_motivo: {
                        in: agrupados.map(item => item.id_motivo_parada)
                    }
                },
                select: {
                    id_motivo: true,
                    descricao: true
                }
            });

            const motivosPorId = new Map(motivos.map(motivo => [motivo.id_motivo, motivo]));

            return agrupados
                .map(item => ({
                    motivo: motivosPorId.get(item.id_motivo_parada)?.descricao ?? 'Sem motivo informado',
                    tempo: this.formatarTempo(item._sum.duracao ?? 0),
                    minutos: item._sum.duracao ?? 0
                }));
        } catch (error) {
            console.error('Erro ao obter top motivos por tempo:', error);
            throw error;
        }
    }

    static async listarParaRelatorio(id_empresa, dias = 7, setorId = null) {
        const diasValidos = [7, 15, 30].includes(Number(dias)) ? Number(dias) : 7;
        const inicio = this.inicioDoDia(new Date());
        inicio.setDate(inicio.getDate() - diasValidos);

        const eventos = await prisma.historico_Eventos.findMany({
            where: {
                id_empresa: Number(id_empresa),
                inicio: { gte: inicio },
                ...(setorId ? { setor_afetado: Number(setorId) } : {}),
            },
            include: {
                maquina: { select: { nome: true, serie: true } },
                motivo_parada: { select: { descricao: true } },
            },
            orderBy: { inicio: 'desc' },
            take: 500,
        });

        return eventos.map((evento) => {
            const duracaoMinutos = evento.duracao ?? (
                evento.inicio
                    ? this.calcularDuracao(evento.inicio, evento.termino ?? new Date())
                    : null
            );
            const horas = duracaoMinutos != null ? Math.floor(duracaoMinutos / 60) : 0;
            const mins = duracaoMinutos != null ? duracaoMinutos % 60 : 0;

            return {
                id: evento.id_evento,
                id_evento: evento.id_evento,
                maquina: evento.maquina?.nome ?? evento.maquina?.serie ?? '—',
                tipo: evento.status_atual === 'Setup' ? 'Setup' : 'Parada',
                inicio: evento.inicio ? new Date(evento.inicio).toISOString() : null,
                fim: evento.termino ? new Date(evento.termino).toISOString() : null,
                duracao: duracaoMinutos != null
                    ? `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
                    : '—',
                motivo: evento.motivo_parada?.descricao ?? 'Aguardando justificativa',
                observacao: evento.observacao || '—',
                justificada: Boolean(evento.id_motivo_parada),
            };
        });
    }
}

export default EventoModel;
