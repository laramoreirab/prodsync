import prisma from '../config/prisma.js';
import TurnoModel from './TurnoModel.js';

class EscalaTrabalhoModel {
    static minutosDoDia(valor) {
        if (typeof valor === 'string') {
            const [hora, minuto = '0'] = valor.split(':');
            return (Number(hora) * 60) + Number(minuto);
        }

        const data = new Date(valor);
        return (data.getHours() * 60) + data.getMinutes();
    }

    static horariosSobrepostos(inicioA, fimA, inicioB, fimB) {
        const aInicio = this.minutosDoDia(inicioA);
        const aFim = this.minutosDoDia(fimA);
        const bInicio = this.minutosDoDia(inicioB);
        const bFim = this.minutosDoDia(fimB);

        return aInicio < bFim && aFim > bInicio;
    }

    static removerCamposInvalidos(dados) {
        const { dia_semana, operador, turno, setor, maquina, empresa, ...dadosValidos } = dados;
        return dadosValidos;
    }

    static async criar(dados) {
        try {
            return await prisma.escalaTrabalho.create({
                data: this.removerCamposInvalidos(dados)
            });
        } catch (error) {
            console.error('Erro ao criar na escala:', error);
            throw error;
        }
    }

    static async criarEscala(dados) {
        try {
            return await prisma.escalaTrabalho.create({
                data: {
                    id_empresa: Number(dados.id_empresa),
                    id_turno: Number(dados.id_turno),
                    id_operador: Number(dados.id_operador),
                    id_setor: Number(dados.id_setor),
                    id_maquina: dados.id_maquina ? Number(dados.id_maquina) : null
                }
            });
        } catch (error) {
            console.error('Erro ao criar escala de trabalho:', error);
            throw error;
        }
    }

    static async criarEscalaSemanal(dadosArray) {
        try {
            const dados = dadosArray.map(item => ({
                ...this.removerCamposInvalidos(item),
                id_empresa: Number(item.id_empresa),
                id_operador: Number(item.id_operador),
                id_turno: Number(item.id_turno),
                id_setor: Number(item.id_setor),
                id_maquina: item.id_maquina ? Number(item.id_maquina) : null
            }));

            return await prisma.escalaTrabalho.createMany({
                data: dados,
                skipDuplicates: true
            });
        } catch (error) {
            console.error('Erro ao criar escala semanal:', error);
            throw error;
        }
    }

    static async verificarConflitoTurno(id_operador, dia_semana, hora_inicio, hora_fim, id_empresa = null) {
        try {
            const escalas = await prisma.escalaTrabalho.findMany({
                where: {
                    id_operador,
                    ...(id_empresa ? { id_empresa } : {}),
                    turno: {
                        dia_semana
                    }
                },
                include: {
                    turno: true
                }
            });

            return escalas.some(escala => this.horariosSobrepostos(
                escala.turno.hora_inicio,
                escala.turno.hora_fim,
                hora_inicio,
                hora_fim
            ));
        } catch (error) {
            console.error('Erro ao verificar conflito de turno:', error);
            throw error;
        }
    }

    static async listarOperadoresTurno(id_turno, dia_semana = null, id_empresa = null) {
        try {
            return await prisma.escalaTrabalho.findMany({
                where: {
                    id_turno,
                    ...(id_empresa ? { id_empresa } : {}),
                    ...(dia_semana ? { turno: { dia_semana } } : {})
                },
                include: {
                    operador: {
                        select: {
                            id_usuario: true,
                            nome: true,
                            email: true,
                            tipo: true
                        }
                    },
                    setor: {
                        select: {
                            id_setor: true,
                            nome_setor: true
                        }
                    },
                    maquina: {
                        select: {
                            id_maquina: true,
                            nome: true,
                            serie: true,
                            status_atual: true
                        }
                    },
                    turno: true
                }
            });
        } catch (error) {
            console.error('Erro ao listar operadores do turno:', error);
            throw error;
        }
    }

    static async buscarPorOperador(id_operador, id_empresa = null) {
        try {
            const escalas = await prisma.escalaTrabalho.findMany({
                where: {
                    id_operador,
                    ...(id_empresa ? { id_empresa } : {})
                },
                include: {
                    turno: true,
                    setor: true,
                    maquina: true
                }
            });

            return escalas.sort((a, b) => {
                const diaA = a.turno?.dia_semana ?? '';
                const diaB = b.turno?.dia_semana ?? '';
                if (diaA !== diaB) return diaA.localeCompare(diaB);
                return this.minutosDoDia(a.turno?.hora_inicio) - this.minutosDoDia(b.turno?.hora_inicio);
            });
        } catch (error) {
            console.error('Erro ao buscar escala por operador:', error);
            throw error;
        }
    }

    static async buscarEscalaDoDia(id_operador, dia_semana, id_empresa = null) {
        try {
            return await prisma.escalaTrabalho.findMany({
                where: {
                    id_operador,
                    ...(id_empresa ? { id_empresa } : {}),
                    turno: {
                        dia_semana
                    }
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

    static async buscarOperadorDaMaquina(id_maquina, dia_semana, id_turno, id_empresa = null) {
        try {
            return await prisma.escalaTrabalho.findFirst({
                where: {
                    id_maquina,
                    id_turno,
                    ...(id_empresa ? { id_empresa } : {}),
                    turno: {
                        dia_semana
                    }
                },
                include: {
                    operador: {
                        select: {
                            id_usuario: true,
                            nome: true,
                            email: true,
                            tipo: true
                        }
                    },
                    turno: true,
                    setor: true,
                    maquina: true
                }
            });
        } catch (error) {
            console.error('Erro ao buscar operador da maquina:', error);
            throw error;
        }
    }

    static async buscarOperadorAtualDaMaquina(id_maquina, id_empresa, dataReferencia = new Date()) {
        try {
            const turno = await TurnoModel.obterTurnoAtual(id_empresa, dataReferencia);
            if (!turno) return null;

            const escala = await prisma.escalaTrabalho.findFirst({
                where: {
                    id_empresa,
                    id_maquina,
                    id_turno: turno.id_turno
                },
                include: {
                    operador: {
                        select: {
                            id_usuario: true,
                            nome: true,
                            email: true,
                            tipo: true
                        }
                    },
                    turno: true,
                    setor: true,
                    maquina: true
                }
            });

            if (!escala) return null;

            return {
                id_operador: escala.operador.id_usuario,
                operador: escala.operador.nome,
                operador_dados: escala.operador,
                turno: escala.turno,
                setor: escala.setor,
                maquina: escala.maquina
            };
        } catch (error) {
            console.error('Erro ao buscar operador atual da maquina:', error);
            throw error;
        }
    }

    static async atualizar(id_operador, id_turno, diaSemanaOuDados, dadosAtualizados = null) {
        try {
            const dados = this.removerCamposInvalidos(dadosAtualizados ?? diaSemanaOuDados);

            return await prisma.escalaTrabalho.update({
                where: {
                    id_operador_id_turno: {
                        id_operador,
                        id_turno
                    }
                },
                data: dados
            });
        } catch (error) {
            console.error('Erro ao atualizar escala:', error);
            throw error;
        }
    }

    static async deletar(id_operador, id_turno) {
        try {
            return await prisma.escalaTrabalho.delete({
                where: {
                    id_operador_id_turno: {
                        id_operador,
                        id_turno
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao deletar escala:', error);
            throw error;
        }
    }

    static async deletarTodasDeOperador(id_operador, id_empresa = null) {
        try {
            return await prisma.escalaTrabalho.deleteMany({
                where: {
                    id_operador,
                    ...(id_empresa ? { id_empresa } : {})
                }
            });
        } catch (error) {
            console.error('Erro ao deletar todas as escalas do operador:', error);
            throw error;
        }
    }
}

export default EscalaTrabalhoModel;
