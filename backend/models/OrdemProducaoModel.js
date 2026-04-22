import prisma from '../config/prisma.js';
import { paginarPrisma } from '../utils/paginacaoUtil.js';

class OrdemProducaoModel {

    static async listarTodos(id_empresa, paginacao) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                },
                orderBy: {
                    id_ordem: 'asc' // Mantém a lista organizada
                },
            }

            const resultadoPaginado = await paginarPrisma(
                prisma.ordemproducao,
                regrasDaBusca,
                paginacao
            );

            return resultadoPaginado;
        } catch (error) {
            console.error('Erro ao listar Ordens de Produção:', error);
            throw error;
        }
    }

    static async criar(dados) {
        try {
            const inicio = await this.converterTimestamp(dados.data_inicio)
            const fim = await this.converterTimestamp(dados.data_fim)

            const resultado = await prisma.ordemproducao.create({
                data: {
                    ...dados,
                    data_inicio: inicio,
                    data_fim: fim,
                    observacao_op: dados.observacao_op || null
                }
            })
            return resultado
        } catch (error) {
            console.error('Erro ao criar Ordem de Produção:', error);
            throw error;
        }
    }
    static async converterTimestamp(timestamp) {
        const ms = String(timestamp).length === 10
            ? timestamp * 1000   // veio em segundos → converte
            : timestamp          // veio em milissegundos → usa direto
        return new Date(ms)
        //  ex: 1711461000 → 2024-03-26T14:10:00.000Z
    }
    static async buscarOrdem(id_ordem) {
        try {
            const resultado = await prisma.ordemproducao.findFirst({
                where:{
                    id_ordem: id_ordem
                }
            })
            return resultado
        } catch (error) {
             console.error('Erro ao buscar Ordem de Produção:', error);
            throw error;
        }
    }
    static async buscarOrdemAtiva(id_maquina) {
        //retorna o ID da ordem de prodção pelo ID da máquina
        try {
            const ordemId = await prisma.ordemproducao.findFirst({
                where:{
                    id_maquina: id_maquina,
                    status_op: 'Produzindo'
                },
                select:{
                    id_ordem:true
                }
            })
            return ordemId
        } catch (error) {
             console.error('Erro ao buscar Ordem de Produção ativa:', error);
            throw error;
        } 
    }
    static async atualizar(id_ordem, id_empresa, dados) {
        try {
            const resultado = prisma.ordemproducao.update({
                where:{
                    id_ordem: id_ordem,
                    id_empresa: id_empresa
                },
                data:{
                    ...dados
                }
            })

            return resultado
        } catch (error) {
            console.error('Erro ao atualizar Ordem de Produção:', error);
            throw error;
        }
    }
    static async deletar(id_ordem, id_empresa) {
        try {
            const deletar = await prisma.ordemproducao.delete({
                where: {
                    id_empresa: id_empresa,
                    id_ordem: id_ordem
                }
            })
            return deletar
        } catch (error) {
            console.error('Erro deletar Ordem de Produção no banco de dados:', error);
            throw error;
        }
    }
}

export default OrdemProducaoModel;