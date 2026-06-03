import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';
import OEEModel from './OEEModel.js';

class MaquinaModel {
    static TEMPO_EXPIRACAO_PAREAMENTO_MS = 3 * 60 * 1000;

    static gerarCodigoPareamento() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    static normalizarBoardUid(board_uid) {
        return String(board_uid ?? '').trim();
    }

    /**
     * Busca uma máquina que está aguardando pareamento (tem pairing_code ativo)
     */
    static async buscarMaquinaAguardandoPareamento(id_empresa) {
        const agora = new Date();
        return prisma.maquinas.findFirst({
            where: {
                id_empresa: Number(id_empresa),
                pairing_code: { not: null },
                pairing_expires_at: { gt: agora },
                ativo: true
            },
            orderBy: { pairing_expires_at: 'desc' }
        });
    }

    /**
     * Busca uma solicitação de placa pendente para a empresa
     */
    static async buscarSolicitacaoPlacaPendente(id_empresa) {
        const agora = new Date();
        return prisma.solicitacoesPareamento.findFirst({
            where: {
                id_empresa: Number(id_empresa),
                expira_em: { gt: agora }
            },
            orderBy: { criado_em: 'desc' }
        });
    }

    /**
     * Conclui o vínculo entre uma máquina e uma placa
     */
    static async concluirSincronizacaoPlaca(id_maquina, board_uid) {
        const agora = new Date();
        const boardUid = this.normalizarBoardUid(board_uid);

        if (!boardUid) throw new Error('Identificador da placa e obrigatorio');

        return prisma.$transaction(async (tx) => {
            const maquina = await tx.maquinas.findFirst({
                where: { id_maquina: Number(id_maquina) }
            });

            if (!maquina) throw new Error('Maquina nao encontrada');

            // 1. Desvincular esta placa de qualquer outra máquina da mesma empresa
            await tx.maquinas.updateMany({
                where: {
                    id_empresa: maquina.id_empresa,
                    board_uid: boardUid,
                    id_maquina: { not: Number(id_maquina) }
                },
                data: {
                    board_uid: null,
                    board_sincronizado_em: null
                }
            });

            // 2. Vincular a placa à máquina e limpar campos de pareamento
            const maquinaAtualizada = await tx.maquinas.update({
                where: { id_maquina: Number(id_maquina) },
                data: {
                    board_uid: boardUid,
                    board_sincronizado_em: agora,
                    board_ultimo_contato_em: agora,
                    pairing_code: null,
                    pairing_expires_at: null
                }
            });

            // 3. Remover a solicitação de pareamento consumida
            await tx.solicitacoesPareamento.deleteMany({
                where: { id_empresa: maquina.id_empresa, board_uid: boardUid }
            });

            return {
                id_empresa: maquinaAtualizada.id_empresa,
                id_maquina: maquinaAtualizada.id_maquina,
                board_uid: boardUid,
                status: 'Concluida',
                paired: true,
                completed_at: agora.toISOString(),
                maquina: maquinaAtualizada
            };
        });
    }

    /**
     * Iniciado pelo Site: Máquina entra em modo de espera
     */
    static async criarSessaoSincronizacaoPlaca({ id_empresa, id_maquina, id_usuario }) {
        // Verifica se já existe uma solicitação de placa pendente para esta empresa
        const solicitacaoPendente = await this.buscarSolicitacaoPlacaPendente(id_empresa);

        if (solicitacaoPendente) {
            // Se já tem placa querendo conectar, vincula na hora
            return this.concluirSincronizacaoPlaca(id_maquina, solicitacaoPendente.board_uid);
        }

        // Caso contrário, gera código e aguarda a placa
        const pairing_code = this.gerarCodigoPareamento();
        const expires_at = new Date(Date.now() + this.TEMPO_EXPIRACAO_PAREAMENTO_MS);

        await prisma.maquinas.update({
            where: { id_maquina: Number(id_maquina) },
            data: {
                pairing_code,
                pairing_expires_at: expires_at
            }
        });

        return {
            id_maquina: Number(id_maquina),
            pairing_code,
            status: 'Pendente',
            board_uid: null,
            expires_at: expires_at.toISOString(),
            completed_at: null
        };
    }

    /**
     * Iniciado pela Placa: Placa entra em modo de espera ou vincula imediatamente
     */
    static async registrarSolicitacaoPareamentoPlaca({ id_empresa, board_uid, mac = null, firmware_version = null, mqtt_topic = null }) {
        const empresaId = Number(id_empresa);
        const boardUid = this.normalizarBoardUid(board_uid);
        const expires_at = new Date(Date.now() + this.TEMPO_EXPIRACAO_PAREAMENTO_MS);

        if (!boardUid) throw new Error('Identificador da placa e obrigatorio');

        // 1. Verifica se existe máquina aguardando no site
        const maquinaAguardando = await this.buscarMaquinaAguardandoPareamento(empresaId);

        if (maquinaAguardando) {
            // Vincula imediatamente
            return this.concluirSincronizacaoPlaca(maquinaAguardando.id_maquina, boardUid);
        }

        // 2. Se não tem máquina, registra a solicitação na tabela dedicada
        await prisma.solicitacoesPareamento.upsert({
            where: { id_solicitacao: -1 },
            create: {
                id_empresa: empresaId,
                board_uid: boardUid,
                mac,
                firmware_version,
                mqtt_topic,
                expira_em: expires_at
            },
            update: {
                mac,
                firmware_version,
                mqtt_topic,
                expira_em: expires_at,
                criado_em: new Date()
            }
        });

        // Limpa solicitações expiradas da empresa para manter a tabela leve
        await prisma.solicitacoesPareamento.deleteMany({
            where: { id_empresa: empresaId, expira_em: { lte: new Date() } }
        });

        return {
            id_empresa: empresaId,
            board_uid: boardUid,
            status: 'AguardandoSessao',
            paired: false,
            expires_at: expires_at.toISOString()
        };
    }

    static async pararSincronizacaoPlaca(id_maquina, id_empresa) {
        return prisma.$transaction([
            prisma.maquinas.updateMany({
                where: { id_maquina: Number(id_maquina), id_empresa: Number(id_empresa) },
                data: { pairing_code: null, pairing_expires_at: null }
            }),
            prisma.solicitacoesPareamento.deleteMany({
                where: { id_empresa: Number(id_empresa) }
            })
        ]);
    }

    static async buscarVinculoPlaca(board_uid) {
        const boardUid = this.normalizarBoardUid(board_uid);
        if (!boardUid) return null;
        return prisma.maquinas.findFirst({
            where: { board_uid: boardUid, ativo: true },
            select: { id_empresa: true, id_maquina: true, board_uid: true }
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

    // --- Métodos de utilidade mantidos ---

    static calcularDuracaoMinutos(inicio, fim) {
        if (!inicio || !fim) return 0;
        const duracao = (new Date(fim) - new Date(inicio)) / 1000 / 60;
        return Number.isFinite(duracao) && duracao > 0 ? duracao : 0;
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

    static async listarMaquinasPaginadas(id_empresa, paginacao, setorId = null) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    ativo: true
                },
                orderBy: { id_maquina: 'asc' },
                include: {
                    setor: { select: { id_setor: true, nome_setor: true } },
                    operador: { select: { id_usuario: true, nome: true } }
                }
            };
            return await paginarPrisma(prisma.maquinas, regrasDaBusca, paginacao);
        } catch (error) {
            console.error('Erro ao listar máquinas paginadas no Model:', error);
            throw error;
        }
    }

    static async criarMaquina(id_empresa, id_setor, categoria, nome, serie, capacidade, status, data_aquisicao, id_operador, imagem) {
        try {
            const statusValidos = ['Produzindo', 'Parada', 'Manutencao', 'Setup', 'Aguardando'];
            const statusNormalizado = statusValidos.includes(status) ? status : 'Parada';
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
                    imagem: imagem || null
                }
            });
            if (idOperadorNormalizado) {
                await prisma.escalaTrabalho.updateMany({
                    where: { id_empresa: Number(id_empresa), id_operador: idOperadorNormalizado },
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

    static async buscarMaquinaPorID(id_maquina, id_empresa) {
        try {
            return await prisma.maquinas.findFirst({
                where: { id_maquina, id_empresa, ativo: true }
            });
        } catch (error) {
            console.error('Erro ao buscar a máquina específica: ', error)
            throw error;
        }
    }

    static async atualizarDados(id_maquina, id_empresa, dados) {
        try {
            if (dados.id_setor) {
                const maquinaAtual = await prisma.maquinas.findFirst({
                    where: { id_maquina, id_empresa, ativo: true },
                    select: { id_setor: true }
                });
                const novoSetor = Number(dados.id_setor);
                if (maquinaAtual?.id_setor && maquinaAtual.id_setor !== novoSetor) {
                    throw new Error('Maquina ja vinculada a outro setor');
                }
            }
            const dataUpdate = {
                nome: dados.nome,
                serie: dados.serie,
                id_setor: dados.id_setor ? parseInt(dados.id_setor) : undefined,
                categoria: dados.categoria,
                capacidade: dados.capacidade,
                status: dados.status,
                status_atual: dados.status || undefined,
                data_aquisicao: dados.data_aquisicao ? new Date(dados.data_aquisicao) : undefined,
                id_operador: dados.id_operador ? parseInt(dados.id_operador) : undefined,
            };
            if (dados.imagem) dataUpdate.imagem = dados.imagem;
            const atualizarMaquina = await prisma.maquinas.updateMany({
                where: { id_maquina: id_maquina, id_empresa: id_empresa, ativo: true },
                data: dataUpdate
            });
            if (atualizarMaquina.count === 0) throw new Error('Máquina não encontrada ou não pertence à empresa');
            if (dados.id_operador) {
                await prisma.escalaTrabalho.updateMany({
                    where: { id_empresa: Number(id_empresa), id_operador: Number(dados.id_operador) },
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

    static async deletarMaquina(id_maquina, id_empresa) {
        try {
            return await prisma.maquinas.updateMany({
                where: { id_maquina, id_empresa },
                data: { ativo: false }
            });
        } catch (error) {
            console.error('Erro ao deletar máquina:', error);
            throw error;
        }
    }

    static async atualizarStatus(id_maquina, id_empresa, status) {
        try {
            return await prisma.maquinas.updateMany({
                where: { id_maquina, id_empresa, ativo: true },
                data: { status_atual: status }
            });
        } catch (error) {
            console.error('Erro ao atualizar status da máquina:', error);
            throw error;
        }
    }

    static async listarMaquinasPorStatus(id_empresa, status, setorId = null) {
        try {
            return await prisma.maquinas.findMany({
                where: {
                    id_empresa,
                    status_atual: status,
                    ...(setorId ? { id_setor: Number(setorId) } : {}),
                    ativo: true
                }
            });
        } catch (error) {
            console.error('Erro ao listar máquinas por status:', error);
            throw error;
        }
    }

    static async listarMaquinasPorSetor(id_empresa, id_setor) {
        try {
            return await prisma.maquinas.findMany({
                where: { id_empresa, id_setor, ativo: true }
            });
        } catch (error) {
            console.error('Erro ao listar máquinas por setor:', error);
            throw error;
        }
    }

    static async obterMaquinaOperador(id_empresa, id_operador) {
        try {
            const maquina = await prisma.maquinas.findFirst({
                where: { id_empresa, id_operador: Number(id_operador), ativo: true },
                select: { id_maquina: true }
            });
            return maquina;
        } catch (error) {
            console.error('Erro ao obter máquina pelo ID do operador:', error);
            throw error;
        }
    }
}

export default MaquinaModel;