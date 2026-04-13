import prisma from '../config/prisma.js';

class TurnoModel {

    //Cria os turnos da empresa
    static async criarTurno(dados) {
        try {
            const turno = await prisma.turno.create({
                data: {
                    nome_turno: dados.nome_turno,
                    hora_inicio: dados.hora_inicio,
                    hora_fim: dados.hora_fim,
                    dia_semana: dados.dia_semana,
                    id_empresa: dados.id_empresa
                }
            });
            return turno;
        } catch (error) {
            console.error('Erro ao criar turno:', error);
            throw error;
        }
    }

    //Obtém todos os turnos de uma empresa
    static async obterTurnosPorEmpresa(id_empresa) {
        return await prisma.turno.findMany({
            where: { id_empresa: id_empresa }
        });
    }

    //Obtém um turno específico por ID e ID da empresa
    static async obterTurnoPorId(id_turno, id_empresa) {
        try {
            const turno = await prisma.turno.findFirst({
                where: {
                    id_turno: id_turno,
                    id_empresa: id_empresa
                }
            });
            return turno || null;
        } catch (error) {
            console.error('Erro ao obter turno por ID:', error);
            throw error;
        }
    }

    //Atualiza os dados de um turno específico
    static async atualizarTurno(id_turno, id_empresa, dados) {
        try {
            const turno = await prisma.turno.updateMany({
                where: {
                    id_turno,
                    id_empresa
                },
                data: dados
            });

            if (turno.count === 0) {
                throw new Error('Turno não encontrado ou não pertence à empresa');
            } return true;

        } catch (error) {
            console.error('Erro ao atualizar turno:', error);
            throw error;
        }
    }

    //Deleta um turno específico por ID e ID da empresa
    static async deletarTurno(id_turno, id_empresa) {
        try {
            const result = await prisma.turno.deleteMany({
                where: {
                    id_turno,
                    id_empresa: id_empresa
                }
            });
            if (result.count === 0) {
                throw new Error('Turno não encontrado ou não pertence à empresa');
            }
        } catch (error) {
            console.error('Erro ao deletar turno:', error);
            throw error;
        }
    }

    //Obtém o turno atual com base na hora atual e ID da empresa
    static async obterTurnoAtual(id_empresa, hora_atual, dia_semana) {
        try {
            const turnoAtual = await prisma.turno.findFirst({
                where: {
                    id_empresa: id_empresa,
                    dia_semana: dia_semana,
                    hora_inicio: {
                        lte: hora_atual
                    },
                    hora_fim: {
                        gte: hora_atual
                    }
                }
            });
            return turnoAtual || null;
        } catch (error) {
            console.error('Erro ao obter turno atual:', error);
            throw error;
        }
    }

}

export default TurnoModel;