import prisma from '../config/prisma.js';
import { paginarPrisma } from '../utils/paginacaoUtil.js';

class EventoModel{
    static async listarTodos(id_empresa, paginacao){
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                },
                orderBy: {
                    id_evento: 'asc' // Mantém a lista organizada
                },
            }

            const resultadoPaginado = await paginarPrisma(
                prisma.historico_eventos,
                regrasDaBusca,
                paginacao
            );

            return resultadoPaginado;
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            throw error;
        }
    }
}

export default EventoModel;