import prisma from '../config/prisma.js';

class EscalaTrabalhoModel {

    // ==========================================================
    // FUNÇÕES DE CRIAÇÃO
    // ==========================================================

    // Cria uma única entrada na escala (método genérico)
    static async criar(dados) {
        try {
            return await prisma.escalaTrabalho.create({
                data: dados
            });
        } catch (error) {
            console.error('Erro ao criar na escala:', error);
            throw error;
        }
    }

    // Cria a escala de trabalho do operador de forma detalhada
    static async criarEscala(dados) {
        try {
            const escala = await prisma.escalaTrabalho.create({
                data: {
                    id_turno: dados.id_turno,
                    id_operador: dados.id_operador,
                    id_setor: dados.id_setor,
                    id_maquina: dados.id_maquina || null
                }
            });
            return escala;
        } catch (error) {
            console.error('Erro ao criar escala de trabalho:', error);
            throw error;
        }
    }

    // Cria a escala da semana inteira de uma vez usando createMany
    static async criarEscalaSemanal(dadosArray) {
        try {
            // dadosArray deve ser ex: [{ id_operador: 1, dia_semana: 'Segunda', id_turno: 1, id_setor: 2 }, ...]
            return await prisma.escalaTrabalho.createMany({
                data: dadosArray,
                skipDuplicates: true // Ignora se o operador já estiver escalado naquele dia/turno
            });
        } catch (error) {
            console.error('Erro ao criar escala semanal:', error);
            throw error;
        }
    }


    // ==========================================================
    // FUNÇÕES DE VALIDAÇÃO
    // ==========================================================

    // Verifica se há conflito de horário para um operador em um dia da semana específico
    static async verificarConflitoTurno(id_operador, dia_semana, hora_inicio, hora_fim) {
        try {
            // Busca na escala se o operador já tem turno naquele dia
            const conflito = await prisma.escalaTrabalho.findFirst({
                where: {
                    id_operador: id_operador,
                    dia_semana: dia_semana,
                    turno: {
                        // Lógica de sobreposição de horários:
                        // O turno existente começa antes do novo terminar, E termina depois do novo começar
                        hora_inicio: { lt: hora_fim },
                        hora_fim: { gt: hora_inicio }
                    }
                }
            });
            return !!conflito;
        } catch (error) {
            console.error('Erro ao verificar conflito de turno:', error);
            throw error;
        }
    }


    // ==========================================================
    // FUNÇÕES DE CONSULTA (LEITURA)
    // ==========================================================

    // Lista os operadores escalados para um turno específico em um dia da semana
    static async listarOperadoresTurno(id_turno, dia_semana) {
        try {
            const operadores = await prisma.escalaTrabalho.findMany({
                where: {
                    id_turno: id_turno,
                    dia_semana: dia_semana
                },
                include: {
                    operador: {
                        select: {
                            id_usuario: true,
                            nome: true,
                            identificador: true
                        }
                    },
                    maquina: {
                        select: { nome: true }
                    }
                }
            });
            return operadores;
        } catch (error) {
            console.error('Erro ao listar operadores do turno:', error);
            throw error;
        }
    }

    // Mostra toda a escala de um operador específico (útil para o app do funcionário)
    static async buscarPorOperador(id_operador) {
        try {
            return await prisma.escalaTrabalho.findMany({
                where: { id_operador: id_operador },
                include: {
                    turno: true,
                    setor: true,
                    maquina: true
                },
                orderBy: {
                    dia_semana: 'asc'
                }
            });
        } catch (error) {
            console.error('Erro ao buscar escala por operador:', error);
            throw error;
        }
    }

    // Diz exatamente onde o operador deve estar em um dia específico da semana
    static async buscarEscalaDoDia(id_operador, dia_semana) {
        try {
            return await prisma.escalaTrabalho.findMany({
                where: {
                    id_operador: id_operador,
                    dia_semana: dia_semana
                },
                include: {
                    turno: true,
                    setor: true,
                    maquina: true
                }
            });
        } catch (error) {
            console.error('Erro ao buscar escala do dia:', error);
            throw error;
        }
    }

    // Descobre quem está operando uma máquina específica num determinado dia e turno
    static async buscarOperadorDaMaquina(id_maquina, dia_semana, id_turno) {
        try {
            return await prisma.escalaTrabalho.findFirst({
                where: {
                    id_maquina: id_maquina,
                    dia_semana: dia_semana,
                    id_turno: id_turno
                },
                include: {
                    operador: {
                        select: { id_usuario: true, nome: true, identificador: true }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao buscar operador da maquina:', error);
            throw error;
        }
    }


    // ==========================================================
    // FUNÇÕES DE ATUALIZAÇÃO E EXCLUSÃO
    // ==========================================================

    // Atualiza o setor ou máquina de um operador num dia/turno específico
    static async atualizar(id_operador, id_turno, dia_semana, dadosAtualizados) {
        try {
            return await prisma.escalaTrabalho.update({
                where: {
                    id_operador_id_turno_dia_semana: {
                        id_operador: id_operador,
                        id_turno: id_turno,
                        dia_semana: dia_semana
                    }
                },
                data: dadosAtualizados
            });
        } catch (error) {
            console.error('Erro ao atualizar escala:', error);
            throw error;
        }
    }

    // Remove o operador de um turno específico em um dia
    static async deletar(id_operador, id_turno, dia_semana) {
        try {
            return await prisma.escalaTrabalho.delete({
                where: {
                    id_operador_id_turno_dia_semana: {
                        id_operador: id_operador,
                        id_turno: id_turno,
                        dia_semana: dia_semana
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao deletar escala:', error);
            throw error;
        }
    }

    // Limpa a escala inteira de um operador
    static async deletarTodasDeOperador(id_operador) {
        try {
            return await prisma.escalaTrabalho.deleteMany({
                where: { id_operador: id_operador }
            });
        } catch (error) {
            console.error('Erro ao deletar todas as escalas do operador:', error);
            throw error;
        }
    }
}

export default EscalaTrabalhoModel;