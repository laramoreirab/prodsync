import prisma from '../config/prisma.js';
import { paginarPrisma } from '../utils/paginacaoUtil.js';

class EventoModel {
    static async listarTodos(id_empresa, paginacao) {
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

    static async converterTimestamp(timestamp) {
        const ms = String(timestamp).length === 10
            ? timestamp * 1000   // veio em segundos → converte
            : timestamp          // veio em milissegundos → usa direto

    }

    static async formatarParada(parada) {
        return {
            ...parada,
            inicio: parada.inicio ? {
              exibicao: new Date(parada.inicio).toLocaleString('pt-BR'),
              // ex: "26/03/2024, 14:10"
              iso: new Date(parada.inicio).toISOString()
              // ex: "2024-03-26T14:10:00.000Z" — pro timer do frontend
            } : null,
            fim: parada.fim ? {
              exibicao: new Date(parada.fim).toLocaleString('pt-BR'),
              iso: new Date(parada.fim).toISOString()
            } : null,
          }

    }

    static async registrarEvento(id_empresa, status_maquina, id_maquina, datastamp) {
        const inicio = this.converterTimestamp(datastamp);

        //achar

        const resultado = await prisma.historico_eventos.create({
            data:{
                id_empresa,
                id_maquina,

            }
        })

        return this.formatarParada(resultado)
    }

}

export default EventoModel;