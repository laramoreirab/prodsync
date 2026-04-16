import prisma from '../config/prisma.js';
import TurnoModel from './TurnoModel.js';
import OrdemProducaoModel from '../models/OrdemProducaoModel.js'
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
        try {
        const inicio = this.converterTimestamp(datastamp);

        // busca o turno ativo pelo horário do início da parada
        const turno = await TurnoModel.obterTurnoAtual(id_empresa, inicio);

        // busca a ordem de produção ativa da máquina
        const ordemProducao = await OrdemProducaoModel.buscarOrdemAtiva(id_maquina);

        if (!turno) console.warn(`Nenhum turno ativo encontrado para o horário ${inicio}`)
        if (!ordemProducao) console.warn(`Nenhuma ordem ativa para a máquina ${id_maquina}`)

        const resultado = await prisma.historico_eventos.create({
            data: {
                id_empresa: id_empresa,
                id_maquina: id_maquina,
                id_ordemProducao: ordemProducao.id_ordem,
                id_turno: turno.id_turno,
                status_atual: status_maquina,
                inicio: inicio
            },
        })
        return this.formatarParada(resultado);

        } catch (error) {
            console.error('Erro registrar evento no banco de dados:', error);
            throw error;
        }
    }

    static async verificaJustificativa(id_empresa, id_evento){
        try {
           const verificacao = await prisma.historico_eventos.findFirst({
            where:{
                id_empresa: id_empresa,
                id_evento: id_evento,
            },
            select:{
                id_motivo_parada: true
            }
        });
        if(verificacao !== null || verificacao !== '' ){
            return true
        }else{
            return false
        }; 
        } catch (error) {
            console.error('Erro verificar justificativa no banco de dados:', error);
            throw error;
        }

        //verificar se o evento não há justificativas registradas
        
    }

    static async justificativa(id_empresa, id_evento, id_motivo_parada,){
        try {
            
        } catch (error) {
            
        }
    }

}

export default EventoModel;