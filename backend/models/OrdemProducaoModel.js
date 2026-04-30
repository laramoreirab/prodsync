import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';

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
                prisma.ordemProducao,
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

            const resultado = await prisma.ordemProducao.create({
                data: {
                    ...dados,
                    data_inicio: inicio,
                    data_fim: fim,
                    observacao_op: dados.observacao_op || ''
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
            const resultado = await prisma.ordemProducao.findFirst({
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
            const ordem = await prisma.ordemProducao.findFirst({
                where:{
                    id_maquina: id_maquina,
                    status_op: 'Andamento'
                },
                select:{
                    id_ordem:true
                }
            })
            return ordem?.id_ordem ?? null
        } catch (error) {
             console.error('Erro ao buscar Ordem de Produção ativa:', error);
            throw error;
        } 
    }
    static async atualizar(id_ordem, id_empresa, dados) {
        try {
            const resultado = await prisma.ordemProducao.updateMany({
                where:{
                    id_ordem: id_ordem,
                    id_empresa: id_empresa
                },
                data:{
                    ...dados
                }
            })

            if (resultado.count === 0) {
                throw new Error('Ordem de producao nao encontrada ou nao pertence a empresa');
            }

            return await prisma.ordemProducao.findFirst({
                where: {
                    id_ordem,
                    id_empresa
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar Ordem de Produção:', error);
            throw error;
        }
    }
    static async deletar(id_ordem, id_empresa) {
        try {
            const deletar = await prisma.ordemProducao.deleteMany({
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
