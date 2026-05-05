import prisma from '../config/prisma.js';

class ApontamentoModel{

     static async converterTimestamp(timestamp) {
        const ms = String(timestamp).length === 10
            ? timestamp * 1000   // veio em segundos → converte
            : timestamp          // veio em milissegundos → usa direto
        return new Date(ms)
        //  ex: 1711461000 → 2024-03-26T14:10:00.000Z
    }

    static async criar(dados){
        try {
          const inicio = await this.converterTimestamp(dados.data_hora_inicio)
        const fim = await this.converterTimestamp(dados.data_hora_fim)

        const resultado = await prisma.apontamento.create({
            data :{
                ...dados,
                data_hora_inicio: inicio,
                data_hora_fim: fim
            }
        })  
        return resultado
        } catch (error) {
             console.error('Erro registrar apontamento no banco de dados:', error);
            throw error;
        }
    }

    static async buscarApontamentoId(id_empresa,id_apontamento,id_operador){
        try {
            const resultado = await prisma.apontamento.findFirst({
                where: {
                    id_empresa: id_empresa,
                    id_operador: id_operador,
                    id_apontamento: id_apontamento,
                }
            })
            return resultado
        } catch (error) {
            console.error('Erro buscar apontamento por ID no banco de dados:', error);
            throw error;
        }
    }

    static async atualizar(id_apontamento, id_empresa, dados){
        try {
            const resultado = await prisma.apontamento.updateMany({
                where: {
                    id_apontamento: id_apontamento,
                    id_empresa: id_empresa
                },
                data:{
                    ...dados
                }
            })

            if (resultado.count === 0) {
                throw new Error('Apontamento nao encontrado ou nao pertence a empresa');
            }

            return await prisma.apontamento.findFirst({
                where: {
                    id_apontamento,
                    id_empresa
                }
            });
            
        } catch (error) {
            console.error('Erro atualizar apontamento no banco de dados:', error);
            throw error;
        }
    }

    static async deletar(id_empresa,id_operador,id_apontamento){
        try {
            const deletarApontamento = await prisma.apontamento.deleteMany({
                where:{
                     id_apontamento:id_apontamento,
                    id_empresa:id_empresa,
                    id_operador: id_operador
                }
            })

            return deletarApontamento
        } catch (error) {
            console.error('Erro deletar apontamento no banco de dados:', error);
            throw error;
        }
    }

}

export default ApontamentoModel
