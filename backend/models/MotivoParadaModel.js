import prisma from '../config/prisma.js';

const TIPOS_VALIDOS = ['Programada', 'Nao_Programada'];

class MotivoParadaModel {
    static validarId(id, nome = 'ID') {
        const numero = Number(id);
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new Error(`${nome} invalido`);
        }
        return numero;
    }

    static validarEmpresa(id_empresa) {
        if (id_empresa === undefined || id_empresa === null) return undefined;

        const numero = Number(id_empresa);
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new Error('ID de empresa invalido');
        }
        return numero;
    }

    static validarDados(dados) {
        if (!dados || typeof dados !== 'object') {
            throw new Error('Dados invalidos');
        }

        const updateData = {};

        if (dados.descricao !== undefined) {
            const descricao = String(dados.descricao).trim();
            if (descricao.length < 3) {
                throw new Error('Descricao do motivo deve ter pelo menos 3 caracteres');
            }
            updateData.descricao = descricao;
        }

        if (dados.tipo !== undefined) {
            if (!TIPOS_VALIDOS.includes(dados.tipo)) {
                throw new Error('Tipo de motivo invalido');
            }
            updateData.tipo = dados.tipo;
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error('Nenhum dado valido fornecido para operacao');
        }

        return updateData;
    }

    static async criarMotivoParada(dados, id_empresa) {
        try {
            const idEmpresa = this.validarEmpresa(id_empresa ?? dados.id_empresa);
            const validated = this.validarDados(dados);

            const motivoParada = await prisma.motivos_Parada.create({
                data: {
                    ...validated,
                    id_empresa: idEmpresa
                }
            });

            return motivoParada;
        } catch (error) {
            console.error('Erro ao criar motivo de parada:', error);
            throw new Error(`Nao foi possivel criar o motivo de parada: ${error.message}`);
        }
    }

    static async buscarTodosMotivosParada(id_empresa) {
        try {
            id_empresa = this.validarEmpresa(id_empresa);
            const where = id_empresa ? { id_empresa } : undefined;

            return await prisma.motivos_Parada.findMany({ where });
        } catch (error) {
            console.error('Erro ao buscar motivos de parada:', error);
            throw new Error(`Nao foi possivel buscar os motivos de parada: ${error.message}`);
        }
    }

    static async buscarMotivoParadaPorId(id, id_empresa) {
        try {
            id = this.validarId(id, 'ID do motivo');
            id_empresa = this.validarEmpresa(id_empresa);

            return await prisma.motivos_Parada.findFirst({
                where: id_empresa
                    ? { id_motivo: id, id_empresa }
                    : { id_motivo: id }
            });
        } catch (error) {
            console.error('Erro ao buscar motivo de parada:', error);
            throw new Error(`Nao foi possivel buscar o motivo de parada: ${error.message}`);
        }
    }

    static async atualizarMotivoParada(id, dados, id_empresa) {
        try {
            id = this.validarId(id, 'ID do motivo');
            id_empresa = this.validarEmpresa(id_empresa);
            const updateData = this.validarDados(dados);

            const motivoExistente = await prisma.motivos_Parada.findFirst({
                where: id_empresa
                    ? { id_motivo: id, id_empresa }
                    : { id_motivo: id }
            });

            if (!motivoExistente) {
                throw new Error('Motivo de parada nao encontrado');
            }

            return await prisma.motivos_Parada.update({
                where: { id_motivo: id },
                data: updateData
            });
        } catch (error) {
            console.error('Erro ao atualizar motivo de parada:', error);
            throw new Error(`Nao foi possivel atualizar o motivo de parada: ${error.message}`);
        }
    }

    static async excluirMotivoParada(id, id_empresa) {
        try {
            id = this.validarId(id, 'ID do motivo');
            id_empresa = this.validarEmpresa(id_empresa);

            if (id_empresa) {
                const result = await prisma.motivos_Parada.deleteMany({
                    where: { id_motivo: id, id_empresa }
                });

                if (result.count === 0) {
                    throw new Error('Motivo de parada nao encontrado ou nao pertence a empresa');
                }

                return { id_motivo: id };
            }

            return await prisma.motivos_Parada.delete({
                where: { id_motivo: id }
            });
        } catch (error) {
            console.error('Erro ao excluir motivo de parada:', error);
            throw new Error(`Nao foi possivel excluir o motivo de parada: ${error.message}`);
        }
    }

    static async buscarMotivosFrequentes(id_empresa, limite = 10, status = ['Parada', 'Manutencao']) {
        try {
            id_empresa = this.validarEmpresa(id_empresa);

            const agrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa,
                    id_motivo_parada: {
                        not: null
                    },
                    status_atual: {
                        in: status
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
                take: Number(limite) || 10
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
                    descricao: motivo?.descricao ?? 'Sem motivo informado',
                    tipo: motivo?.tipo ?? null,
                    qtd: item._count.id_evento,
                    total_eventos: item._count.id_evento,
                    duracao_total_minutos: item._sum.duracao ?? 0
                };
            });
        } catch (error) {
            console.error('Erro ao buscar motivos frequentes:', error);
            throw error;
        }
    }

    static async buscarTopMotivosSetup(id_empresa, limite = 3) {
        try {
            const dados = await this.buscarMotivosFrequentes(id_empresa, Number(limite) || 3, ['Setup']);

            return dados
                .sort((a, b) => b.duracao_total_minutos - a.duracao_total_minutos)
                .slice(0, Number(limite) || 3)
                .map(item => ({
                    ...item,
                    minutos: item.duracao_total_minutos
                }));
        } catch (error) {
            console.error('Erro ao buscar top motivos de setup:', error);
            throw error;
        }
    }
}

export default MotivoParadaModel;
