import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';
import OEEModel from './OEEModel.js';
import EventoModel from './EventoModel.js';
import { EventEmitter } from 'events';

class MaquinaModel {
    static TEMPO_EXPIRACAO_PAREAMENTO_MS = 3 * 60 * 1000;
    static _sessoesPareamentoPlaca = new Map();
    static _placasAguardandoPareamento = new Map();
    static _placasAguardandoPareamentoPorUid = new Map();
    static eventosPlaca = new EventEmitter();

    static gerarCodigoPareamento() {
        // 6 dígitos, fácil de digitar em displays/serial
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    static normalizarBoardUid(board_uid) {
        return String(board_uid ?? '').trim();
    }

    static criarChaveEmpresa(id_empresa) {
        return String(Number(id_empresa));
    }

    static removerPareamentoPendentePorUid(boardUid) {
        if (!boardUid) return;

        this._placasAguardandoPareamentoPorUid.delete(boardUid);
        for (const [chaveEmpresa, pareamento] of this._placasAguardandoPareamento.entries()) {
            if (pareamento?.board_uid === boardUid) {
                this._placasAguardandoPareamento.delete(chaveEmpresa);
            }
        }
    }

    static registroExpirado(registro) {
        return !registro?.expires_at || registro.expires_at.getTime() <= Date.now();
    }

    static async expirarSessoesSincronizacaoPlaca(id_empresa) {
        const chaveEmpresa = this.criarChaveEmpresa(id_empresa);

        for (const [key, sessao] of this._sessoesPareamentoPlaca.entries()) {
            if (key.startsWith(`${chaveEmpresa}:`) && this.registroExpirado(sessao)) {
                this._sessoesPareamentoPlaca.delete(key);
            }
        }

        const placa = this._placasAguardandoPareamento.get(chaveEmpresa);
        if (this.registroExpirado(placa)) {
            this._placasAguardandoPareamento.delete(chaveEmpresa);
            if (placa?.board_uid) {
                this._placasAguardandoPareamentoPorUid.delete(placa.board_uid);
            }
        }

        for (const [boardUid, pareamento] of this._placasAguardandoPareamentoPorUid.entries()) {
            if (this.registroExpirado(pareamento)) {
                this._placasAguardandoPareamentoPorUid.delete(boardUid);
            }
        }
    }

    static async buscarPareamentoDisponivel(id_empresa) {
        await this.expirarSessoesSincronizacaoPlaca(id_empresa);
        const pareamentoEmpresa = this._placasAguardandoPareamento.get(this.criarChaveEmpresa(id_empresa));
        if (pareamentoEmpresa) return pareamentoEmpresa;

        return this.buscarPareamentoGlobalDisponivel();
    }

    static buscarPareamentoGlobalDisponivel() {
        const pareamentos = Array.from(this._placasAguardandoPareamentoPorUid.values())
            .filter((pareamento) => !this.registroExpirado(pareamento))
            .sort((a, b) => b.created_at - a.created_at);

        if (pareamentos.length === 1) return pareamentos[0];
        return null;
    }

    static async buscarSessaoSincronizacaoPendente(id_empresa) {
        await this.expirarSessoesSincronizacaoPlaca(id_empresa);

        const chaveEmpresa = this.criarChaveEmpresa(id_empresa);
        const sessoes = Array.from(this._sessoesPareamentoPlaca.values())
            .filter((sessao) => String(sessao.id_empresa) === chaveEmpresa)
            .sort((a, b) => b.created_at - a.created_at);

        return sessoes[0] ?? null;
    }

    static async buscarSessaoSincronizacaoPendenteGlobal() {
        for (const [key, sessao] of this._sessoesPareamentoPlaca.entries()) {
            if (this.registroExpirado(sessao)) {
                this._sessoesPareamentoPlaca.delete(key);
            }
        }

        const sessoes = Array.from(this._sessoesPareamentoPlaca.values())
            .filter((sessao) => !this.registroExpirado(sessao))
            .sort((a, b) => b.created_at - a.created_at);

        if (sessoes.length === 1) return sessoes[0];
        return null;
    }

    static async concluirSincronizacaoPlaca(sessao, pareamento) {
        const agora = new Date();
        const boardUid = this.normalizarBoardUid(pareamento.board_uid);

        if (!boardUid) {
            throw new Error('Identificador da placa e obrigatorio');
        }

        const maquina = await prisma.$transaction(async (tx) => {
            await tx.maquinas.updateMany({
                where: {
                    board_uid: boardUid,
                    id_maquina: { not: sessao.id_maquina }
                },
                data: {
                    board_uid: null,
                    board_sincronizado_em: null
                }
            });

            return tx.maquinas.update({
                where: { id_maquina: sessao.id_maquina },
                data: {
                    board_uid: boardUid,
                    board_sincronizado_em: agora,
                    board_ultimo_contato_em: agora
                }
            });
        });

        const chaveEmpresa = this.criarChaveEmpresa(sessao.id_empresa);
        this._sessoesPareamentoPlaca.delete(`${chaveEmpresa}:${sessao.id_maquina}`);
        this.removerPareamentoPendentePorUid(boardUid);

        const resultado = {
            id_empresa: sessao.id_empresa,
            id_maquina: sessao.id_maquina,
            board_uid: boardUid,
            status: 'Concluida',
            paired: true,
            pairing_code: sessao.pairing_code,
            expires_at: sessao.expires_at.toISOString(),
            completed_at: agora.toISOString(),
            maquina
        };

        this.eventosPlaca.emit('pareamentoConcluido', resultado);

        return resultado;
    }

    static async criarSessaoSincronizacaoPlaca({ id_empresa, id_maquina, id_usuario }) {
        // Valida que a máquina existe e pertence à empresa (autorizações já passam pelos middlewares)
        const maquina = await prisma.maquinas.findFirst({
            where: { id_empresa: Number(id_empresa), id_maquina: Number(id_maquina), ativo: true },
            select: { id_maquina: true }
        });
        if (!maquina) {
            throw new Error('Máquina não encontrada');
        }

        await this.expirarSessoesSincronizacaoPlaca(id_empresa);

        const pairing_code = this.gerarCodigoPareamento();
        const expires_at = new Date(Date.now() + this.TEMPO_EXPIRACAO_PAREAMENTO_MS);

        const sessao = {
            id_empresa: Number(id_empresa),
            id_maquina: Number(id_maquina),
            id_usuario: Number(id_usuario),
            pairing_code,
            expires_at,
            created_at: new Date()
        };

        const chaveEmpresa = this.criarChaveEmpresa(id_empresa);
        this._sessoesPareamentoPlaca.set(`${chaveEmpresa}:${Number(id_maquina)}`, sessao);
        console.log(`[PAREAMENTO SITE] Sessao criada para empresa ${sessao.id_empresa}, maquina ${sessao.id_maquina}, codigo ${pairing_code}.`);

        const pareamento = await this.buscarPareamentoDisponivel(id_empresa);
        if (pareamento) {
            console.log(`[PAREAMENTO SITE] Placa ${pareamento.board_uid} encontrada aguardando. Concluindo sincronizacao.`);
            return this.concluirSincronizacaoPlaca(sessao, pareamento);
        }

        return {
            id_maquina: Number(id_maquina),
            pairing_code,
            status: 'Pendente',
            board_uid: null,
            expires_at: expires_at.toISOString(),
            completed_at: null
        };
    }

    static async registrarSolicitacaoPareamentoPlaca({ id_empresa, board_uid, mac = null, firmware_version = null, mqtt_topic = null }) {
        const empresaIdInformado = Number(id_empresa);
        const boardUid = this.normalizarBoardUid(board_uid);

        if (!boardUid) {
            throw new Error('Identificador da placa e obrigatorio');
        }

        const empresaIdValido = Number.isInteger(empresaIdInformado) && empresaIdInformado > 0;
        let empresa = null;
        let sessao = null;

        if (empresaIdValido) {
            empresa = await prisma.empresas.findUnique({
                where: { id_empresa: empresaIdInformado },
                select: { id_empresa: true }
            });

            if (empresa) {
                sessao = await this.buscarSessaoSincronizacaoPendente(empresa.id_empresa);
            }
        }

        if (!sessao) {
            sessao = await this.buscarSessaoSincronizacaoPendenteGlobal();
            if (sessao) {
                console.log(`[PAREAMENTO PLACA] Usando sessao pendente unica da empresa ${sessao.id_empresa}, maquina ${sessao.id_maquina}.`);
            }
        }

        const empresaId = sessao
            ? Number(sessao.id_empresa)
            : empresa
                ? Number(empresa.id_empresa)
                : null;
        const expires_at = new Date(Date.now() + this.TEMPO_EXPIRACAO_PAREAMENTO_MS);
        const agora = new Date();

        const pareamento = {
            id_empresa: empresaId,
            board_uid: boardUid,
            mac,
            firmware_version,
            mqtt_topic,
            expires_at,
            created_at: agora
        };

        if (empresaId) {
            this._placasAguardandoPareamento.set(this.criarChaveEmpresa(empresaId), pareamento);
        }
        this._placasAguardandoPareamentoPorUid.set(boardUid, pareamento);
        console.log(
            empresaId
                ? `[PAREAMENTO PLACA] Pedido da placa ${boardUid} associado a empresa ${empresaId}.`
                : `[PAREAMENTO PLACA] Pedido da placa ${boardUid} aguardando sessao aberta pelo site.`
        );

        if (sessao) {
            return this.concluirSincronizacaoPlaca(sessao, pareamento);
        }

        return {
            id_empresa: empresaId,
            board_uid: boardUid,
            status: 'AguardandoSessao',
            paired: false,
            expires_at: expires_at.toISOString()
        };
    }

    static async obterStatusSincronizacaoPlaca({ id_empresa, id_maquina }) {
        const empresaId = Number(id_empresa);
        const maquinaId = Number(id_maquina);

        const maquina = await prisma.maquinas.findFirst({
            where: { id_empresa: empresaId, id_maquina: maquinaId, ativo: true },
            select: {
                id_maquina: true,
                board_uid: true,
                board_sincronizado_em: true
            }
        });
        if (!maquina) {
            throw new Error('Máquina não encontrada');
        }

        await this.expirarSessoesSincronizacaoPlaca(empresaId);

        const chaveEmpresa = this.criarChaveEmpresa(empresaId);
        const sessao = this._sessoesPareamentoPlaca.get(`${chaveEmpresa}:${maquinaId}`);
        if (sessao) {
            return {
                id_maquina: maquinaId,
                pairing_code: sessao.pairing_code,
                board_uid: null,
                status: 'Pendente',
                paired: false,
                completed_at: null,
                expires_at: sessao.expires_at.toISOString()
            };
        }

        if (maquina.board_uid) {
            return {
                id_maquina: maquinaId,
                board_uid: maquina.board_uid,
                status: 'Concluida',
                paired: true,
                completed_at: maquina.board_sincronizado_em?.toISOString?.() ?? null,
                expires_at: null
            };
        }

        return {
            id_maquina: maquinaId,
            board_uid: null,
            status: 'SemSessao',
            paired: false,
            completed_at: null,
            expires_at: null
        };
    }

    static async buscarVinculoPlaca(board_uid) {
        const boardUid = this.normalizarBoardUid(board_uid);
        if (!boardUid) return null;

        return prisma.maquinas.findFirst({
            where: {
                board_uid: boardUid,
                ativo: true
            },
            select: {
                id_empresa: true,
                id_maquina: true,
                board_uid: true
            }
        });
    }

    static async registrarContatoPlaca(board_uid) {
        const boardUid = this.normalizarBoardUid(board_uid);
        if (!boardUid) return;

        await prisma.maquinas.updateMany({
            where: { board_uid: boardUid },
            data: { board_ultimo_contato_em: new Date() }
        });
    }
    static calcularDuracaoMinutos(inicio, fim) {
        if (!inicio || !fim) return 0;

        const duracao = (new Date(fim) - new Date(inicio)) / 1000 / 60;
        return Number.isFinite(duracao) && duracao > 0 ? duracao : 0;
    }

    static extrairNumeroCapacidade(capacidade) {
        if (capacidade === null || capacidade === undefined) return 0;

        const texto = String(capacidade).replace(',', '.');
        const match = texto.match(/\d+(\.\d+)?/);
        const valor = match ? Number(match[0]) : Number(texto);

        return Number.isFinite(valor) && valor > 0 ? valor : 0;
    }

    static calcularVelocidadePecasHora(pecas, minutos) {
        return minutos > 0
            ? Number(((pecas / minutos) * 60).toFixed(2))
            : 0;
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

    static async adicionarIdsExibicaoEmpresa(id_empresa, maquinas) {
        if (!Array.isArray(maquinas) || maquinas.length === 0) return maquinas;

        const idsOrdenados = await prisma.maquinas.findMany({
            where: {
                id_empresa: Number(id_empresa),
                ativo: true
            },
            orderBy: {
                id_maquina: 'asc'
            },
            select: {
                id_maquina: true
            }
        });

        const numeroPorId = new Map(
            idsOrdenados.map((maquina, index) => [maquina.id_maquina, index + 1])
        );

        return maquinas.map((maquina) => ({
            ...maquina,
            id_exibicao_empresa: numeroPorId.get(maquina.id_maquina) ?? maquina.id_maquina
        }));
    }

    //Lista as máquinas de uma empresa com paginação
    static async listarMaquinasPaginadas(id_empresa, paginacao, setorId = null) {
        try {
            // 1. Definimos APENAS as regras dessa busca específica
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    ativo: true
                },
                orderBy: {
                    id_maquina: 'asc' // Mantém a lista organizada
                },
                // Se no futuro quiser incluir o Setor na resposta, é só descomentar a linha abaixo:
                include: {
                    setor: { select: { id_setor: true, nome_setor: true } },
                    operador: { select: { id_usuario: true, nome: true } },
                    historico_eventos: {
                        where: {
                            status_atual: { in: ['Parada', 'Setup'] },
                            termino: { not: null }
                        },
                        orderBy: [
                            { termino: 'desc' },
                            { id_evento: 'desc' }
                        ],
                        take: 1,
                        select: {
                            id_evento: true,
                            status_atual: true,
                            inicio: true,
                            termino: true
                        }
                    }
                }
            };

            const resultadoPaginado = await paginarPrisma(
                prisma.maquinas, // Diz qual tabela ele vai usar
                regrasDaBusca,   // Manda as regras
                paginacao        // Manda a página e o limite
            );

            resultadoPaginado.dados = await this.adicionarIdsExibicaoEmpresa(id_empresa, resultadoPaginado.dados);

            return resultadoPaginado;
        } catch (error) {
            console.error('Erro ao listar máquinas paginadas no Model:', error);
            throw error;
        }
    }

    // Cria uma nova máquina
    static async criarMaquina(id_empresa, id_setor, categoria, nome, serie, capacidade, status, data_aquisicao, id_operador, imagem, imagem_public_id = null) {
        try {
            const statusValidos = ['Produzindo', 'Parada', 'Setup', 'Aguardando'];
            const statusRecebido = status === 'Manutencao' ? 'Parada' : status;
            const statusNormalizado = statusValidos.includes(statusRecebido) ? statusRecebido : 'Parada';
            const idSetorNormalizado = id_setor ? Number(id_setor) : null;
            const idOperadorNormalizado = id_operador ? Number(id_operador) : null;
            const maquina = await prisma.maquinas.create({
                data: {
                    id_empresa: Number(id_empresa),
                    id_setor: idSetorNormalizado,
                    categoria: categoria || null,
                    nome: nome,
                    serie: serie || null,
                    capacidade: capacidade || null,
                    status_atual: statusNormalizado,
                    data_aquisicao: data_aquisicao ? new Date(data_aquisicao) : null,
                    id_operador: idOperadorNormalizado,
                    imagem: imagem || null,
                    imagem_public_id: imagem_public_id || null
                }
            });
            if (idOperadorNormalizado) {
                await prisma.escalaTrabalho.updateMany({
                    where: {
                        id_empresa: Number(id_empresa),
                        id_operador: idOperadorNormalizado
                    },
                    data: {
                        id_maquina: maquina.id_maquina,
                        ...(idSetorNormalizado ? { id_setor: idSetorNormalizado } : {})
                    }
                });
            }
            return maquina;
        } catch (error) {
            console.error('Erro ao criar máquina:', error);
            throw error;
        }
    }

    // Busca uma máquina específica por ID
    static async buscarMaquinaPorID(id_maquina, id_empresa) {
        try {
            const maquina = await prisma.maquinas.findFirst({
                where: {
                    id_maquina,
                    id_empresa,
                    ativo: true
                }
            });
            return maquina;
        } catch (error) {
            console.error('Erro ao buscar a máquina específica: ', error)
            throw error;
        }
    }

    // Atualiza dados cadastrais
    static async atualizarDados(id_maquina, id_empresa, dados) {
        try {
            if (dados.id_setor) {
                const maquinaAtual = await prisma.maquinas.findFirst({
                    where: {
                        id_maquina,
                        id_empresa,
                        ativo: true
                    },
                    select: {
                        id_setor: true
                    }
                });

                const novoSetor = Number(dados.id_setor);
                if (maquinaAtual?.id_setor && maquinaAtual.id_setor !== novoSetor) {
                    throw new Error('Maquina ja vinculada a outro setor');
                }
            }

            const statusRecebido = dados.status === 'Manutencao' ? 'Parada' : dados.status;
            const dataUpdate = {
                nome: dados.nome,
                serie: dados.serie,
                id_setor: dados.id_setor ? parseInt(dados.id_setor) : undefined,
                categoria: dados.categoria,
                capacidade: dados.capacidade,
                status: statusRecebido,
                status_atual: statusRecebido || undefined,
                data_aquisicao: dados.data_aquisicao ? new Date(dados.data_aquisicao) : undefined,
                id_operador: dados.id_operador ? parseInt(dados.id_operador) : undefined,
            };

            if (dados.imagem) {
                dataUpdate.imagem = dados.imagem;
            }

            if (dados.imagem_public_id) {
                dataUpdate.imagem_public_id = dados.imagem_public_id;
            }

            const atualizarMaquina = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa,
                    ativo: true
                },
                data: dataUpdate
            });
            if (atualizarMaquina.count === 0) {
                throw new Error('Máquina não encontrada ou não pertence à empresa');
            }
            if (dados.id_operador) {
                await prisma.escalaTrabalho.updateMany({
                    where: {
                        id_empresa: Number(id_empresa),
                        id_operador: Number(dados.id_operador)
                    },
                    data: {
                        id_maquina: Number(id_maquina),
                        ...(dados.id_setor ? { id_setor: Number(dados.id_setor) } : {})
                    }
                });
            }
            return atualizarMaquina;
        } catch (error) {
            console.error('Erro ao atualizar informações da máquina:', error)
            throw error;
        }
    }

    // Deleta/desativa uma máquina
    static async deletarMaquina(id_maquina, id_empresa) {
        try {
            const deletarMaquina = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa
                },
                data: {
                    ativo: false
                }
            });
            if (deletarMaquina.count === 0) {
                throw new Error('Máquina não encontrada ou não pertence à empresa');
            }
            return deletarMaquina;
        } catch (error) {
            console.error('Erro ao deletar máquina:', error);
            throw error;
        }
    }

    // Atualiza o status da máquina (Ex: string 'Produzindo', 'Parada')
    static async atualizarStatus(id_maquina, id_empresa, status_atual) {
        try {
            const atualizarStatus = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa,
                    ativo: true
                },
                data: {
                    status_atual: status_atual
                }
            });
            if (atualizarStatus.count === 0) {
                throw new Error('Máquina não encontrada ou não pertence à empresa');
            }
            return atualizarStatus;
        } catch (error) {
            console.error('Erro ao atualizar status da máquina:', error);
            throw error;
        }
    }

    // Lista as máquinas por status
    static async listarMaquinasPorStatus(id_empresa, status_atual, setorId = null) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    status_atual: status_atual,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    ativo: true
                }
            });
            return maquinas;
        } catch (error) {
            console.error('Erro ao listar máquinas por status:', error);
            throw error;
        }
    }

    // Lista todas as máquinas de uma empresa
    static async listarMaquinasPorEmpresa(id_empresa) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    ativo: true
                }
            });
            return maquinas;
        } catch (error) {
            console.error('Erro ao listar todas as máquinas por empresa:', error);
            throw error;
        }
    }

    // Lista as máquinas por setor
    static async listarMaquinasPorSetor(id_empresa, id_setor) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    id_setor: id_setor,
                    ativo: true
                },
                include: {
                    operador: {
                        select: {
                            id_usuario: true,
                            nome: true
                        }
                    },
                    historico_eventos: {
                        where: {
                            status_atual: {
                                in: ['Parada', 'Manutencao', 'Setup']
                            }
                        },
                        orderBy: {
                            inicio: 'desc'
                        },
                        take: 1,
                        select: {
                            id_evento: true,
                            status_atual: true,
                            inicio: true,
                            termino: true
                        }
                    }
                }
            });
            return maquinas.map(maquina => {
                const { historico_eventos, ...dadosMaquina } = maquina;
                return {
                    ...dadosMaquina,
                    ultimo_evento: historico_eventos[0] ?? null,
                    ultima_parada: historico_eventos[0]?.inicio ?? null
                };
            });
        } catch (error) {
            console.error('Erro ao listar máquinas por setor:', error);
            throw error;
        }
    }

    // Lista as máquinas por categoria
    static async listarMaquinasDisponiveisPorTurno(id_empresa, id_setor, id_turno, id_operador = null) {
        try {
            const turnoId = Number(id_turno);
            const operadorId = id_operador ? Number(id_operador) : null;

            const escalasOcupadas = await prisma.escalaTrabalho.findMany({
                where: {
                    id_empresa: Number(id_empresa),
                    id_setor: Number(id_setor),
                    id_turno: turnoId,
                    id_maquina: { not: null },
                    ...(operadorId ? { id_operador: { not: operadorId } } : {})
                },
                select: {
                    id_maquina: true
                }
            });

            const idsOcupados = escalasOcupadas
                .map((escala) => escala.id_maquina)
                .filter(Boolean);

            return await prisma.maquinas.findMany({
                where: {
                    id_empresa: Number(id_empresa),
                    id_setor: Number(id_setor),
                    ativo: true,
                    ...(idsOcupados.length ? { id_maquina: { notIn: idsOcupados } } : {})
                },
                orderBy: {
                    nome: 'asc'
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
        } catch (error) {
            console.error('Erro ao listar maquinas disponiveis por turno:', error);
            throw error;
        }
    }

    static async listarMaquinasPorCategoria(id_empresa, id_categoria) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    categoria: String(id_categoria),
                    ativo: true
                }
            });
            return maquinas;
        } catch (error) {
            console.error('Erro ao listar máquinas por categoria:', error);
            throw error;
        }
    }

    // Faz um "Raio-X" da máquina - informações em tempo real, última ordem de produção, último evento, escala atual e operador
    static async raioXMaquina(id_maquina, id_empresa) {
        try {
            const raioX = await prisma.maquinas.findFirst({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa,
                    ativo: true
                },
                include: {
                    ordens_producao: {
                        orderBy: { id_ordem: 'desc' },
                        take: 1
                    },
                    escala_trabalho: {
                        include: {
                            operador: {
                                select: { nome: true, id_usuario: true }
                            }
                        }
                    },
                    historico_eventos: {
                        orderBy: { inicio: 'desc' },
                        take: 1,
                        include: {
                            motivo_parada: true
                        }
                    }
                }
            });
            return raioX;
        } catch (error) {
            console.error('Erro ao obter informações em tempo real da máquina:', error);
            throw error;
        }
    }

    static async obterMaquinaOperador(id_empresa, id_operador){
        try {
            const resposta = await prisma.escalaTrabalho.findFirst({
                where:{
                    id_empresa: id_empresa,
                    id_operador: Number(id_operador)
                },
                select:{
                    id_maquina: true
                }
            })
            return resposta
            
        } catch (error) {
            console.error('Erro ao obter máquina pelo ID do operador no banco', error);
            throw error;
        }
    }

    static async eficienciaMaquina(id_empresa, id_operador) {
        const escala = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa: Number(id_empresa),
                id_operador: Number(id_operador),
                id_maquina: { not: null }
            },
            select: { id_maquina: true }
        });

        if (!escala?.id_maquina) return [];

        const dias = this.criarMapaUltimosDias(7);
        return Promise.all(dias.map(async (dia, index) => {
            const inicio = this.inicioDoDia(new Date(`${dia}T00:00:00`));
            const fim = this.fimDoDia(inicio);
            const oee = await OEEModel.obterOeeMaquina(escala.id_maquina, Number(id_empresa), inicio, fim);

            return {
                dia: `Dia ${index + 1}`,
                eficiencia: oee.oee
            };
        }));
    }

    static mapearStatusAndon(status) {
        if (status === 'Produzindo') return 'emProducao';
        if (status === 'Setup') return 'emSetup';
        return 'emParada';
    }

    static formatarTempoDesde(data) {
        if (!data) return 'Sem evento recente';

        const minutos = Math.max(0, Math.round((new Date() - new Date(data)) / 1000 / 60));
        const horas = Math.floor(minutos / 60);
        const resto = minutos % 60;

        if (horas <= 0) return `${resto} min no status`;
        if (resto === 0) return `${horas}h no status`;
        return `${horas}h ${resto}min no status`;
    }

    static async obterSetorOperador(id_empresa, id_operador) {
        const setorGerido = await prisma.setor_Gestor.findFirst({
            where: {
                id_empresa,
                id_gestor: Number(id_operador)
            },
            select: { id_setor: true }
        });
        if (setorGerido?.id_setor) return setorGerido.id_setor;

        const escala = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador)
            },
            select: {
                id_setor: true,
                id_maquina: true
            }
        });

        if (escala?.id_setor) return escala.id_setor;

        if (escala?.id_maquina) {
            const maquinaEscala = await prisma.maquinas.findFirst({
                where: { id_empresa, id_maquina: escala.id_maquina, ativo: true },
                select: { id_setor: true }
            });
            if (maquinaEscala?.id_setor) return maquinaEscala.id_setor;
        }

        const maquina = await prisma.maquinas.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador),
                ativo: true
            },
            select: { id_setor: true }
        });

        return maquina?.id_setor ?? null;
    }

    static async montarFiltroAndon(id_empresa, scope, id_operador, id_setor = null) {
        const filtro = { id_empresa, ativo: true };

        if (scope === 'sector') {
            const setorInformado = id_setor ? Number(id_setor) : null;
            const setor = Number.isInteger(setorInformado) && setorInformado > 0
                ? setorInformado
                : await this.obterSetorOperador(id_empresa, id_operador);
            if (!setor) return { ...filtro, id_maquina: -1 };
            filtro.id_setor = setor;
        }

        return filtro;
    }

    static async obterAndonStatus(id_empresa, scope = 'factory', id_operador = null, id_setor = null) {
        const where = await this.montarFiltroAndon(id_empresa, scope, id_operador, id_setor);
        const agrupados = await prisma.maquinas.groupBy({
            by: ['status_atual'],
            where,
            _count: { status_atual: true }
        });

        return agrupados.reduce((acc, item) => {
            acc[this.mapearStatusAndon(item.status_atual)] += item._count.status_atual;
            return acc;
        }, {
            emProducao: 0,
            emSetup: 0,
            emParada: 0
        });
    }

    static calcularProdutividade(qtdPlanejada, qtdProduzida) {
        if (!qtdPlanejada || qtdPlanejada <= 0) return 0;
        return Math.min(100, Math.round((qtdProduzida / qtdPlanejada) * 100));
    }

    static async obterAndonRanking(id_empresa, scope = 'factory', id_operador = null, id_setor = null) {
        const where = await this.montarFiltroAndon(id_empresa, scope, id_operador, id_setor);
        const maquinas = await prisma.maquinas.findMany({
            where,
            select: {
                id_maquina: true,
                nome: true,
                serie: true,
                setor: {
                    select: {
                        id_setor: true,
                        nome_setor: true
                    }
                },
                ordens_producao: {
                    select: { qtd_planejada: true }
                },
                apontamentos: {
                    select: {
                        qtd_boa: true,
                        qtd_refugo: true
                    }
                }
            }
        });

        const agrupado = new Map();

        for (const maquina of maquinas) {
            const chave = scope === 'sector'
                ? String(maquina.id_maquina)
                : String(maquina.setor?.id_setor ?? 'sem-setor');
            const nome = scope === 'sector'
                ? (maquina.serie ?? maquina.nome)
                : (maquina.setor?.nome_setor ?? 'Sem setor');
            const atual = agrupado.get(chave) ?? { setor: nome, planejado: 0, produzido: 0 };

            atual.planejado += maquina.ordens_producao.reduce((acc, ordem) => acc + (ordem.qtd_planejada ?? 0), 0);
            atual.produzido += maquina.apontamentos.reduce(
                (acc, apontamento) => acc + (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0),
                0
            );

            agrupado.set(chave, atual);
        }

        return Array.from(agrupado.values())
            .map(item => ({
                setor: item.setor,
                produtividade: this.calcularProdutividade(item.planejado, item.produzido)
            }))
            .sort((a, b) => b.produtividade - a.produtividade)
            .slice(0, 8);
    }

    static async montarCardAndon(maquina, id_empresa) {
        const ordemAtual = maquina.ordens_producao?.[0];
        const ultimoEvento = maquina.historico_eventos?.[0];
        const oee = await OEEModel.obterOeeMaquina(maquina.id_maquina, id_empresa);
        const produzido = maquina.apontamentos.reduce(
            (acc, apontamento) => acc + (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0),
            0
        );

        return {
            id: String(maquina.id_maquina),
            codigo: maquina.serie ?? maquina.nome,
            status: this.mapearStatusAndon(maquina.status_atual),
            operador: maquina.operador?.nome ?? 'Sem operador',
            detalheLabel: ordemAtual?.produto ? 'Produto' : 'OP',
            detalheValor: ordemAtual?.produto ?? ordemAtual?.codigo_lote ?? 'Sem OP ativa',
            metaTurno: `${produzido}/${ordemAtual?.qtd_planejada ?? 0}`,
            metaDia: `${produzido}/${ordemAtual?.qtd_planejada ?? 0}`,
            oee: oee.oee ?? 0,
            tempoStatus: this.formatarTempoDesde(ultimoEvento?.inicio ?? maquina.data_ativacao)
        };
    }

    static async obterAndonSecoes(id_empresa, scope = 'factory', id_operador = null, id_setor = null) {
        const where = await this.montarFiltroAndon(id_empresa, scope, id_operador, id_setor);
        const maquinas = await prisma.maquinas.findMany({
            where,
            include: {
                setor: {
                    select: {
                        id_setor: true,
                        nome_setor: true
                    }
                },
                operador: {
                    select: {
                        nome: true
                    }
                },
                ordens_producao: {
                    orderBy: { data_inicio: 'desc' },
                    take: 1,
                    select: {
                        codigo_lote: true,
                        produto: true,
                        qtd_planejada: true
                    }
                },
                apontamentos: {
                    select: {
                        qtd_boa: true,
                        qtd_refugo: true
                    }
                },
                historico_eventos: {
                    orderBy: { inicio: 'desc' },
                    take: 1,
                    select: {
                        inicio: true
                    }
                }
            },
            orderBy: [
                { id_setor: 'asc' },
                { nome: 'asc' }
            ]
        });

        const secoes = new Map();

        for (const maquina of maquinas) {
            const idSecao = String(maquina.setor?.id_setor ?? 'sem-setor');
            const secao = secoes.get(idSecao) ?? {
                id: idSecao,
                titulo: maquina.setor?.nome_setor ?? 'Sem setor',
                maquinas: []
            };

            secao.maquinas.push(await this.montarCardAndon(maquina, id_empresa));
            secoes.set(idSecao, secao);
        }

        return Array.from(secoes.values()).filter(secao => secao.maquinas.length > 0);
    }

        static async cadastrarLote(dados){
            try {
                const resultado = await prisma.maquinas.createMany({
                    data: dados,
                    skipDuplicates: true, 
                });
                return resultado.count
            } catch (error) {
                console.error('Erro cadastrar lote csv de máquinas no banco de dados', error);
                throw error;
            }
        }

    // -------------------------------------dashboard--------------------------------------------------
    static async taxaCumprimentoMetaPorSetor(id_empresa, setorId = null) {
        try {
            // busca ordens de produção agrupadas por setor com qtd planejada
            const ordens = await prisma.ordemProducao.findMany({
                where: { id_empresa, ...(setorId ? { id_setor: Number(setorId) } : {}) },
                select: {
                    qtd_planejada: true,
                    id_setor: true
                }
            })

            // busca apontamentos com qtd produzida por setor
            const apontamentos = await prisma.apontamento.findMany({
                where: { id_empresa, ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}) },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    maquina: {
                        select: {
                            setor: { select: { id_setor: true, nome_setor: true } }
                        }
                    }
                }
            })

            // agrupa qtd planejada por setor
            const planejadoPorSetor = {}
            const setoresIds = [...new Set(ordens.map(ordem => ordem.id_setor).filter(Boolean))]
            const setoresInfo = await prisma.setores.findMany({
                where: {
                    id_empresa,
                    id_setor: {
                        in: setoresIds
                    }
                },
                select: {
                    id_setor: true,
                    nome_setor: true
                }
            })
            const setoresPorId = new Map(setoresInfo.map(setor => [setor.id_setor, setor.nome_setor]))

            for (const ordem of ordens) {
                const setor = setoresPorId.get(ordem.id_setor) ?? 'Sem setor'
                if (!planejadoPorSetor[setor]) planejadoPorSetor[setor] = 0
                planejadoPorSetor[setor] += ordem.qtd_planejada ?? 0
            }

            // agrupa qtd produzida por setor
            const produzidoPorSetor = {}
            for (const ap of apontamentos) {
                const setor = ap.maquina?.setor?.nome_setor ?? 'Sem setor'
                if (!produzidoPorSetor[setor]) produzidoPorSetor[setor] = 0
                produzidoPorSetor[setor] += (ap.qtd_boa ?? 0) + (ap.qtd_refugo ?? 0)
            }

            // calcula a taxa de cumprimento de cada setor
            const setores = new Set([
                ...Object.keys(planejadoPorSetor),
                ...Object.keys(produzidoPorSetor)
            ])

            return Array.from(setores).map(setor => {
                const planejado = planejadoPorSetor[setor] ?? 0
                const produzido = produzidoPorSetor[setor] ?? 0

                const taxa = planejado > 0
                    ? Math.round((produzido / planejado) * 100)
                    : 0

                return {
                    setor,             // eixo X
                    taxa_cumprimento: taxa  // eixo Y — porcentagem
                }
            }).sort((a, b) => b.taxa_cumprimento - a.taxa_cumprimento)
        } catch (error) {
            console.error('Erro ao retornar a taxa de cumprimento de meta por setor no banco de dados:', error);
            throw error;
        }
    }

    static async obterStatusGeralMaquinas(id_empresa, setorId = null) {
        try {
            const statusAgrupados = await prisma.maquinas.groupBy({
                by: ['status_atual'],
                where: {
                    id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    ativo: true
                },
                _count: {
                    status_atual: true
                },
                orderBy: {
                    _count: {
                        status_atual: 'desc'
                    }
                }
            });

            const totaisPorStatus = statusAgrupados.reduce((acc, status) => {
                const statusNormalizado = status.status_atual === 'Manutencao' ? 'Parada' : status.status_atual;
                acc[statusNormalizado] = (acc[statusNormalizado] ?? 0) + status._count.status_atual;
                return acc;
            }, {});

            return Object.entries(totaisPorStatus).map(([status, total]) => ({
                name: status,
                value: total,
                setorId: setorId ? Number(setorId) : undefined,
                status,
                total
            }));
        } catch (error) {
            console.error('Erro ao obter status geral das maquinas:', error);
            throw error;
        }
    }

    static async obterProducaoTotalMaquinas(id_empresa, dias, setorId = null) {
        try {
            const quantidadeDias = Number(dias) || 7;
            const chavesDias = this.criarMapaUltimosDias(quantidadeDias);
            const dataInicio = this.inicioDoDia(new Date(`${chavesDias[0]}T00:00:00`));

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}),
                    data_hora_fim: {
                        gte: dataInicio
                    }
                },
                select: {
                    data_hora_fim: true,
                    qtd_boa: true,
                    qtd_refugo: true
                },
                orderBy: {
                    data_hora_fim: 'asc'
                }
            });

            const producaoPorDia = new Map(chavesDias.map(dia => [
                dia,
                {
                    data: dia,
                    setorId: setorId ? Number(setorId) : undefined,
                    produzidas: 0,
                    refugo: 0,
                    total: 0,
                }
            ]));

            for (const apontamento of apontamentos) {
                const dia = apontamento.data_hora_fim.toISOString().slice(0, 10);
                const acumulado = producaoPorDia.get(dia);

                if (acumulado) {
                    acumulado.produzidas += apontamento.qtd_boa ?? 0;
                    acumulado.refugo += apontamento.qtd_refugo ?? 0;
                    acumulado.total += (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0);
                }
            }

            return Array.from(producaoPorDia.values());
        } catch (error) {
            console.error('Erro ao obter producao total das maquinas:', error);
            throw error;
        }
    }

    static async obterMediaParadasPorDia(id_empresa, dias = 7, setorId = null) {
        try {
            const quantidadeDias = Number(dias) || 7;
            const chavesDias = this.criarMapaUltimosDias(quantidadeDias);
            const dataInicio = this.inicioDoDia(new Date(`${chavesDias[0]}T00:00:00`));

            const totalParadas = await prisma.historico_Eventos.count({
                where: {
                    id_empresa,
                    ...(setorId ? { setor_afetado: Number(setorId) } : {}),
                    status_atual: {
                        in: ['Parada', 'Manutencao']
                    },
                    inicio: {
                        gte: dataInicio
                    }
                }
            });

            const media = quantidadeDias > 0 ? Number((totalParadas / quantidadeDias).toFixed(1)) : 0;

            return {
                titulo: 'Media de Paradas por Dia',
                valor: String(media),
                media,
                total_paradas: totalParadas,
                periodo_dias: quantidadeDias
            };
        } catch (error) {
            console.error('Erro ao obter media de paradas por dia:', error);
            throw error;
        }
    }

    static async obterPecasPorMinuto(id_empresa, dias = 7, setorId = null) {
        try {
            const quantidadeDias = Number(dias) || 7;
            const chavesDias = this.criarMapaUltimosDias(quantidadeDias);
            const dataInicio = this.inicioDoDia(new Date(`${chavesDias[0]}T00:00:00`));

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}),
                    data_hora_fim: {
                        gte: dataInicio
                    }
                },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    data_hora_inicio: true,
                    data_hora_fim: true
                }
            });

            const totais = apontamentos.reduce((acc, apontamento) => {
                acc.pecas += (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0);
                acc.minutos += this.calcularDuracaoMinutos(
                    apontamento.data_hora_inicio,
                    apontamento.data_hora_fim
                );
                return acc;
            }, { pecas: 0, minutos: 0 });

            const pecasPorMinuto = totais.minutos > 0
                ? Number((totais.pecas / totais.minutos).toFixed(2))
                : 0;

            return {
                titulo: 'Peças por Minuto',
                valor: String(pecasPorMinuto)
                // pecas_por_minuto: pecasPorMinuto,
                // total_pecas: totais.pecas,
                // tempo_producao_minutos: Number(totais.minutos.toFixed(1))
            };
        } catch (error) {
            console.error('Erro ao obter pecas por minuto:', error);
            throw error;
        }
    }

    static async obterResumoOeeMaquina(id_maquina, id_empresa) {
        try {
            return await OEEModel.obterOeeMaquina(id_maquina, id_empresa);
        } catch (error) {
            console.error('Erro ao obter resumo OEE da maquina:', error);
            throw error;
        }
    }

    static async obterEvolucaoOeeMaquina(id_maquina, id_empresa) {
        try {
            return await OEEModel.obterEvolucaoOeeMaquina(id_maquina, id_empresa);
        } catch (error) {
            console.error('Erro ao obter evolucao OEE da maquina:', error);
            throw error;
        }
    }

    static async obterVelocidadeMaquina(id_maquina, id_empresa) {
        try {
            const [maquina, ordemAtiva] = await Promise.all([
                prisma.maquinas.findFirst({
                    where: {
                        id_maquina,
                        id_empresa,
                        ativo: true
                    },
                    select: {
                        capacidade: true
                    }
                }),
                prisma.ordemProducao.findFirst({
                    where: {
                        id_maquina,
                        id_empresa,
                        status_op: {
                            in: ['Em_Andamento', 'Setup', 'Parada']
                        }
                    },
                    orderBy: [
                        { data_inicio: 'desc' },
                        { id_ordem: 'desc' }
                    ],
                    select: {
                        id_ordem: true
                    }
                })
            ]);

            const inicioPeriodoRecente = this.inicioDoDia(new Date());
            inicioPeriodoRecente.setDate(inicioPeriodoRecente.getDate() - 6);

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_maquina,
                    id_empresa,
                    ...(ordemAtiva?.id_ordem
                        ? { id_ordemProducao: ordemAtiva.id_ordem }
                        : { data_hora_fim: { gte: inicioPeriodoRecente } })
                },
                orderBy: {
                    data_hora_fim: 'desc'
                },
                select: {
                    id_apontamento: true,
                    qtd_boa: true,
                    qtd_refugo: true,
                    data_hora_inicio: true,
                    data_hora_fim: true
                }
            });

            const totais = apontamentos.reduce((acc, apontamento) => {
                acc.pecas += (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0);
                acc.minutos += this.calcularDuracaoMinutos(
                    apontamento.data_hora_inicio,
                    apontamento.data_hora_fim
                );
                return acc;
            }, { pecas: 0, minutos: 0 });

            const velocidadeAtual = this.calcularVelocidadePecasHora(totais.pecas, totais.minutos);
            const velocidadePadrao = this.extrairNumeroCapacidade(maquina?.capacidade);

            return {
                velocidade_atual: velocidadeAtual,
                velocidade_padrao: velocidadePadrao,
                unidade: 'pecas/hora',
                percentual: velocidadePadrao > 0
                    ? Number(((velocidadeAtual / velocidadePadrao) * 100).toFixed(1))
                    : 0,
                referencia_apontamento: apontamentos[0]?.id_apontamento ?? null,
                referencia_ordem: ordemAtiva?.id_ordem ?? null,
                periodo_base: ordemAtiva?.id_ordem ? 'ordem_ativa' : 'ultimos_7_dias'
            };
        } catch (error) {
            console.error('Erro ao obter velocidade da maquina:', error);
            throw error;
        }
    }

    static async obterTopMotivosParada(id_maquina, id_empresa) {
        try {
            const motivosAgrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_maquina,
                    id_empresa,
                    id_motivo_parada: {
                        not: null
                    },
                    status_atual: {
                        in: ['Parada', 'Setup']
                    }
                },
                _count: {
                    id_motivo_parada: true
                },
                _sum: {
                    duracao: true
                },
                orderBy: {
                    _count: {
                        id_motivo_parada: 'desc'
                    }
                },
                take: 3
            });

            const idsMotivos = motivosAgrupados.map(motivo => motivo.id_motivo_parada);
            const motivos = await prisma.motivos_Parada.findMany({
                where: {
                    id_empresa,
                    id_motivo: {
                        in: idsMotivos
                    }
                },
                select: {
                    id_motivo: true,
                    descricao: true,
                    tipo: true
                }
            });

            const motivosPorId = new Map(motivos.map(motivo => [motivo.id_motivo, motivo]));

            return motivosAgrupados.map(motivo => {
                const dadosMotivo = motivosPorId.get(motivo.id_motivo_parada);

                return {
                    id_motivo: motivo.id_motivo_parada,
                    descricao: dadosMotivo?.descricao ?? 'Sem motivo informado',
                    tipo: dadosMotivo?.tipo ?? null,
                    total_eventos: motivo._count.id_motivo_parada,
                    duracao_total_minutos: motivo._sum.duracao ?? 0
                };
            });
        } catch (error) {
            console.error('Erro ao obter top motivos de parada:', error);
            throw error;
        }
    }

    static async obterRefugosMaquina(id_maquina, id_empresa) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_maquina,
                    id_empresa,
                    qtd_refugo: {
                        gt: 0
                    }
                },
                select: {
                    qtd_refugo: true,
                    data_hora_fim: true,
                    id_ordemProducao: true,
                    ordem_producao: {
                        select: {
                            codigo_lote: true,
                            produto: true
                        }
                    }
                },
                orderBy: {
                    data_hora_fim: 'asc'
                }
            });

            const refugosPorDia = new Map();
            const refugosPorOrdem = new Map();

            for (const apontamento of apontamentos) {
                const dia = apontamento.data_hora_fim.toISOString().slice(0, 10);
                const refugo = apontamento.qtd_refugo ?? 0;

                refugosPorDia.set(dia, (refugosPorDia.get(dia) ?? 0) + refugo);

                const chaveOrdem = apontamento.id_ordemProducao;
                const ordem = refugosPorOrdem.get(chaveOrdem) ?? {
                    id_ordem: chaveOrdem,
                    codigo_lote: apontamento.ordem_producao?.codigo_lote ?? null,
                    produto: apontamento.ordem_producao?.produto ?? null,
                    qtd_refugo: 0
                };

                ordem.qtd_refugo += refugo;
                refugosPorOrdem.set(chaveOrdem, ordem);
            }

            return {
                por_dia: Array.from(refugosPorDia.entries()).map(([data, qtd_refugo]) => ({
                    data,
                    qtd_refugo
                })),
                por_ordem: Array.from(refugosPorOrdem.values()).sort((a, b) => b.qtd_refugo - a.qtd_refugo)
            };
        } catch (error) {
            console.error('Erro ao obter refugos da maquina:', error);
            throw error;
        }
    }

    static async obterHistoricoEventosTabela(id_maquina, id_empresa, limite = 50) {
        try {
            await EventoModel.encerrarEventosJustificadosAbertos(id_empresa, id_maquina);

            const [eventos, idsEventosMaquina, apontamentos] = await Promise.all([
                prisma.historico_Eventos.findMany({
                    where: {
                        id_maquina,
                        id_empresa
                    },
                    include: {
                        motivo_parada: {
                            select: {
                                id_motivo: true,
                                descricao: true,
                                tipo: true,
                            }
                        },
                        ordem_producao: {
                            select: {
                                id_ordem: true,
                                codigo_lote: true,
                                produto: true
                            }
                        }
                    },
                    orderBy: [
                        { inicio: 'desc' },
                        { id_evento: 'desc' }
                    ],
                    take: limite
                }),
                prisma.historico_Eventos.findMany({
                    where: {
                        id_maquina,
                        id_empresa
                    },
                    select: { id_evento: true },
                    orderBy: { id_evento: 'asc' }
                }),
                prisma.apontamento.findMany({
                    where: {
                        id_maquina,
                        id_empresa
                    },
                    include: {
                        operador: {
                            select: {
                                id_usuario: true,
                                nome: true
                            }
                        },
                        ordem_producao: {
                            select: {
                                id_ordem: true,
                                codigo_lote: true,
                                produto: true
                            }
                        }
                    },
                    orderBy: {
                        data_hora_fim: 'desc'
                    },
                    take: limite
                })
            ]);

            const numeroEventoMaquina = new Map(idsEventosMaquina.map((evento, index) => [evento.id_evento, index + 1]));

            const historicoEventos = eventos.map((evento, index) => ({
                id: evento.id_evento,
                id_evento: evento.id_evento,
                numero_evento: numeroEventoMaquina.get(evento.id_evento) ?? index + 1,
                numero_evento_maquina: numeroEventoMaquina.get(evento.id_evento) ?? index + 1,
                tipo: evento.status_atual === 'Setup' ? 'Setup' : 'Parada',
                data: evento.inicio,
                inicio: evento.inicio,
                fim: evento.termino,
                duracao_minutos: evento.duracao ?? this.calcularDuracaoMinutos(evento.inicio, evento.termino),
                observacao: evento.observacao === '' ? 'Sem observação' : evento.observacao,
                motivo: evento.motivo_parada?.descricao ?? null,
                produzido: 0,
                refugo: 0,
                operador: null,
                ordem_producao: evento.ordem_producao
            }));

            const historicoApontamentos = apontamentos.map(apontamento => ({
                id: apontamento.id_apontamento,
                id_apontamento: apontamento.id_apontamento,
                tipo: 'Producao',
                data: apontamento.data_hora_inicio,
                inicio: apontamento.data_hora_inicio,
                fim: apontamento.data_hora_fim,
                duracao_minutos: this.calcularDuracaoMinutos(
                    apontamento.data_hora_inicio,
                    apontamento.data_hora_fim
                ),
                motivo: apontamento.observacao ?? null,
                produzido: apontamento.qtd_boa ?? 0,
                refugo: apontamento.qtd_refugo ?? 0,
                operador: apontamento.operador ?? null,
                ordem_producao: apontamento.ordem_producao
            }));

            return [...historicoEventos, ...historicoApontamentos]
                .sort((a, b) => new Date(b.inicio) - new Date(a.inicio))
                .slice(0, limite);
        } catch (error) {
            console.error('Erro ao obter historico de eventos da maquina:', error);
            throw error;
        }
    }

    // ----------------------------------------------------Tela de Gestor -----------------------------------------------------------
    static ultimosSeteDias() {
    const dias = []
    for (let i = 6; i >= 0; i--) {
      const data = new Date()
      data.setDate(data.getDate() - i)
      data.setHours(0, 0, 0, 0)
      dias.push(data.toISOString().split('T')[0])
    }
    return dias
  }
    static async pecasProduzidas7Dias(id_setor, id_empresa) {
    const dias = this.ultimosSeteDias()
    const inicio = new Date(dias[0])

    const apontamentos = await prisma.apontamento.findMany({
      where: {
        id_empresa,
        data_hora_inicio: { gte: inicio },
        maquina: { id_setor }
      },
      select: {
        qtd_boa:          true,
        qtd_refugo:       true,
        data_hora_inicio: true
      }
    })

    // agrupa por dia
    const agrupado = Object.fromEntries(
      dias.map((d, i) => [d, { dia: `Dia ${i + 1}`, qtd: 0 }])
    )

    for (const ap of apontamentos) {
      const chave = ap.data_hora_inicio.toISOString().split('T')[0]
      if (agrupado[chave]) {
        agrupado[chave].qtd += (ap.qtd_boa ?? 0) + (ap.qtd_refugo ?? 0)
      }
    }

    return Object.values(agrupado)
  }

   static async statusMaquinasSetor(id_setor, id_empresa) {
    const resultado = await prisma.maquinas.groupBy({
      by:    ['status_atual'],
      where: { id_empresa, id_setor, ativo: true },
      _count: { status_atual: true }
    })

    const nomeStatus = {
      Produzindo: 'Produzindo',
      Parada:     'Parada',
      Setup:      'Setup',
      Aguardando: 'Aguardando'
    }

    return resultado.map(r => ({
      name:  nomeStatus[r.status_atual] ?? r.status_atual,
      value: r._count.status_atual
    }))
  }
static async producaoMaquinasSetor(id_setor, id_empresa) {
    const resultado = await prisma.apontamento.groupBy({
      by:    ['id_maquina'],
      where: {
        id_empresa,
        maquina: { id_setor }
      },
      _sum:    { qtd_boa: true, qtd_refugo: true },
      orderBy: { _sum: { qtd_boa: 'desc' } }
    })

    const ids      = resultado.map(r => r.id_maquina)
    const maquinas = await prisma.maquinas.findMany({
      where:  { id_maquina: { in: ids } },
      select: { id_maquina: true, nome: true, serie: true }
    })

    const nomeMaquina = Object.fromEntries(
      maquinas.map(m => [m.id_maquina, m.serie ?? m.nome])
    )

    return resultado.map(r => ({
      maquina: nomeMaquina[r.id_maquina] ?? `Máquina ${r.id_maquina}`,
      qtd:   (r._sum.qtd_boa ?? 0) + (r._sum.qtd_refugo ?? 0)
    }))
  }

  static async cancelarSessaoSincronizacaoPlaca({ id_empresa, id_maquina }) {
    // Valida que a máquina existe e pertence à empresa
    const maquina = await prisma.maquinas.findFirst({
      where: { id_empresa: Number(id_empresa), id_maquina: Number(id_maquina), ativo: true },
      select: { id_maquina: true }
    });
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    const chaveEmpresa = this.criarChaveEmpresa(id_empresa);
    const chaveSessiono = `${chaveEmpresa}:${Number(id_maquina)}`;
    const placaAguardando = this._placasAguardandoPareamento.get(chaveEmpresa) ?? this.buscarPareamentoGlobalDisponivel();
    
    // Remove a sessão de pareamento
    this._sessoesPareamentoPlaca.delete(chaveSessiono);
    this._placasAguardandoPareamento.delete(chaveEmpresa);
    if (placaAguardando?.board_uid) {
      this.removerPareamentoPendentePorUid(placaAguardando.board_uid);
    }

    if (placaAguardando?.board_uid) {
      this.eventosPlaca.emit('pareamentoCancelado', {
        id_empresa: Number(id_empresa),
        id_maquina: Number(id_maquina),
        board_uid: placaAguardando.board_uid
      });
    }

    return {
      mensagem: 'Sincronização cancelada com sucesso',
      board_uid: placaAguardando?.board_uid ?? null
    };
  }

  static async desconectarPlacaMaquina({ id_empresa, id_maquina }) {
    const empresaId = Number(id_empresa);
    const maquinaId = Number(id_maquina);

    const maquina = await prisma.maquinas.findFirst({
      where: { id_empresa: empresaId, id_maquina: maquinaId, ativo: true },
      select: { id_maquina: true, board_uid: true }
    });

    if (!maquina) {
      throw new Error('Maquina nao encontrada');
    }

    if (!maquina.board_uid) {
      return {
        mensagem: 'Maquina nao possui placa sincronizada',
        board_uid: null
      };
    }

    const boardUid = maquina.board_uid;
    const chaveEmpresa = this.criarChaveEmpresa(empresaId);

    await prisma.maquinas.updateMany({
      where: { id_empresa: empresaId, id_maquina: maquinaId, ativo: true },
      data: {
        board_uid: null,
        board_sincronizado_em: null,
        board_ultimo_contato_em: null
      }
    });

    this._sessoesPareamentoPlaca.delete(`${chaveEmpresa}:${maquinaId}`);
    this.removerPareamentoPendentePorUid(boardUid);

    this.eventosPlaca.emit('pareamentoCancelado', {
      id_empresa: empresaId,
      id_maquina: maquinaId,
      board_uid: boardUid
    });

    return {
      mensagem: 'Placa desconectada com sucesso',
      board_uid: boardUid
    };
  }

}

export default MaquinaModel;
