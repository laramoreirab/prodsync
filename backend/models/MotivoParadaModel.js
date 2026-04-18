import prisma from '../config/prisma.js';

const TIPOS_VALIDOS = ['Programada', 'Nao_Programada'];

class MotivoParadaModel {

    // Valida se o ID é um número inteiro positivo
    static validarId(id, nome = 'ID') {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(`${nome} inválido`);
        }
    }

    // Valida se o ID da empresa é um número inteiro positivo ou undefined (para casos onde não é obrigatório)
    static validarEmpresa(id_empresa) {
        if (id_empresa !== undefined && (!Number.isInteger(id_empresa) || id_empresa <= 0)) {
            throw new Error('ID de empresa inválido');
        }
    }

    // Valida os dados de entrada para criação ou atualização de motivo de parada
    static validarDados(dados) {
        if (!dados || typeof dados !== 'object') {
            throw new Error('Dados inválidos');
        }

        const updateData = {}; // Cria um objeto vazio

        // Só valida e adiciona a descrição se ela foi enviada
        if (dados.descricao !== undefined) {
            const descricao = String(dados.descricao).trim();
            if (descricao.length < 3) {
                throw new Error('Descrição do motivo deve ter pelo menos 3 caracteres');
            }
            updateData.descricao = descricao;
        }

        // Só valida e adiciona o tipo se ele foi enviado
        if (dados.tipo !== undefined) {
            if (!TIPOS_VALIDOS.includes(dados.tipo)) {
                throw new Error('Tipo de motivo inválido');
            }
            updateData.tipo = dados.tipo;
        }

        // Se o objeto ficou vazio (não enviou nada válido)
        if (Object.keys(updateData).length === 0) {
            throw new Error('Nenhum dado válido fornecido para operação');
        }

        return updateData;
    }

    // Criar um novo motivo de parada
    static async criarMotivoParada(dados, id_empresa) {
        try {
            this.validarEmpresa(id_empresa);
            const validated = this.validarDados(dados);
            const data = {
                ...validated,
                id_empresa: id_empresa ?? dados.id_empresa
            };

            // Garantir que o ID da empresa seja fornecido, seja pelo parâmetro ou pelos dados
            if (!data.id_empresa || !Number.isInteger(data.id_empresa) || data.id_empresa <= 0) {
                throw new Error('ID de empresa obrigatório para criar motivo de parada');
            }

            const motivoParada = await prisma.motivos_Parada.create({
                data
            });
            return motivoParada;
        } catch (error) {
            console.error('Erro ao criar motivo de parada:', error);
            throw new Error(`Não foi possível criar o motivo de parada: ${error.message}`);
        }
    }

    // Buscar todos os motivos de parada
    static async buscarTodosMotivosParada(id_empresa) {
        try {
            this.validarEmpresa(id_empresa);

            const where = id_empresa ? { id_empresa } : undefined;
            const motivosParada = await prisma.motivos_Parada.findMany({ where });
            return motivosParada;
        } catch (error) {
            console.error('Erro ao buscar motivos de parada:', error);
            throw new Error(`Não foi possível buscar os motivos de parada: ${error.message}`);
        }
    }

    // Buscar um motivo de parada por ID
    static async buscarMotivoParadaPorId(id, id_empresa) {
        try {
            this.validarId(id, 'ID do motivo');
            this.validarEmpresa(id_empresa);

            const where = id_empresa
                ? { id_motivo: id, id_empresa }
                : { id_motivo: id };

            const motivoParada = await prisma.motivos_Parada.findFirst({
                where
            });

            return motivoParada;
        } catch (error) {
            console.error('Erro ao buscar motivo de parada:', error);
            throw new Error(`Não foi possível buscar o motivo de parada: ${error.message}`);
        }
    }

    // Atualizar um motivo de parada
    static async atualizarMotivoParada(id, dados, id_empresa) {
        try {
            this.validarId(id, 'ID do motivo');
            this.validarEmpresa(id_empresa);
            const updateData = this.validarDados(dados);

            const motivoExistente = await prisma.motivos_Parada.findFirst({
                where: id_empresa
                    ? { id_motivo: id, id_empresa }
                    : { id_motivo: id }
            });

            // Verifica se o motivo de parada existe antes de tentar atualizar
            if (!motivoExistente) {
                throw new Error('Motivo de parada não encontrado');
            }

            const motivoParada = await prisma.motivos_Parada.update({
                where: { id_motivo: id },
                data: updateData
            });
            return motivoParada;
        } catch (error) {
            console.error('Erro ao atualizar motivo de parada:', error);
            throw new Error(`Não foi possível atualizar o motivo de parada: ${error.message}`);
        }
    }

    // Excluir um motivo de parada
    static async excluirMotivoParada(id, id_empresa) {
        try {
            this.validarId(id, 'ID do motivo');
            this.validarEmpresa(id_empresa);

            // Se o ID da empresa for fornecido, tenta excluir apenas o motivo de parada que pertence a essa empresa
            if (id_empresa) {
                const result = await prisma.motivos_Parada.deleteMany({
                    where: { id_motivo: id, id_empresa }
                });

                // Se nenhum registro foi deletado, significa que o motivo de parada não existe ou não pertence à empresa
                if (result.count === 0) {
                    throw new Error('Motivo de parada não encontrado ou não pertence à empresa');
                }
                return { id_motivo: id };
            }

            const motivoParada = await prisma.motivos_Parada.delete({
                where: { id_motivo: id }
            });
            return motivoParada;
        } catch (error) {
            console.error('Erro ao excluir motivo de parada:', error);
            throw new Error(`Não foi possível excluir o motivo de parada: ${error.message}`);
        }
    }
}
export default MotivoParadaModel;