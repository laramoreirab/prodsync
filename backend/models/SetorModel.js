import prisma from '../config/prisma.js';

class SetorModel {

    // Cria um novo setor
    static async criarSetor(dados) {
        try {
            const setor = await prisma.setores.create({
                data: {
                    nome_setor: dados.nome_setor,
                    localizacao: dados.localizacao,
                    id_empresa: dados.id_empresa
                }
            });
            return setor;
        } catch (error) {
            console.error('Erro ao criar setor:', error);
            throw error;
        }
    }

    // Associa máquinas a um setor
    static async associarMaquinas(id_setor, id_empresa, ids_maquinas) {
        try {
            const resultado = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: { in: ids_maquinas },
                    id_empresa: id_empresa
                },
                data: {
                    id_setor: id_setor
                }
            });
            return resultado;
        } catch (error) {
            console.error('Erro ao associar máquinas ao setor:', error);
            throw error;
        }
    }

    // Remove máquinas de um setor
    static async removerMaquinas(id_setor, id_empresa, ids_maquinas) {
        try {
            const resultado = await prisma.maquinas.updateMany({
                where: { id_maquina: { in: ids_maquinas }, id_setor: id_setor, id_empresa: id_empresa },
                data: { id_setor: null }
            });
            return resultado;
        } catch (error) {
            console.error('Erro ao remover máquinas do setor:', error);
            throw error;
        }
    }

    // Lista todos os setores de uma empresa
    static async listarSetoresPorEmpresa(id_empresa) {
        try {
            const setores = await prisma.setores.findMany({
                where: { id_empresa: id_empresa },
                include: {
                    empresa: true,
                    maquinas: {
                        where: { ativo: true },
                        select: { id_maquina: true, nome: true, status_atual: true }
                    },
                    gestores: {
                        include: {
                            gestor: {
                                select: { id_usuario: true, nome: true, email: true }
                            }
                        }
                    }
                }
            });
            return setores;
        } catch (error) {
            console.error('Erro ao listar setores:', error);
            throw error;
        }
    }

    // Obtém um setor específico por ID e empresa
    static async obterSetorPorId(id_setor, id_empresa) {
        try {
            const setor = await prisma.setores.findFirst({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                },
                include: {
                    empresa: true,
                    maquinas: {
                        where: { ativo: true },
                        select: { id_maquina: true, nome: true, status_atual: true }
                    },
                    gestores: {
                        include: {
                            gestor: {
                                select: { id_usuario: true, nome: true, email: true }
                            }
                        }
                    }
                }
            });
            return setor || null;
        } catch (error) {
            console.error('Erro ao obter setor por ID:', error);
            throw error;
        }
    }

    // Atualiza os dados de um setor
    static async atualizarSetor(id_setor, id_empresa, dados) {
        try {
            const setor = await prisma.setores.updateMany({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                },
                data: dados
            });

            if (setor.count === 0) {
                throw new Error('Setor não encontrado ou não pertence à empresa');
            }
            return true;
        } catch (error) {
            console.error('Erro ao atualizar setor:', error);
            throw error;
        }
    }

    // Deleta um setor
    static async deletarSetor(id_setor, id_empresa) {
        try {
            const result = await prisma.setores.deleteMany({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                }
            });
            if (result.count === 0) {
                throw new Error('Setor não encontrado ou não pertence à empresa');
            }
        } catch (error) {
            console.error('Erro ao deletar setor:', error);
            throw error;
        }
    }

    // Associa um gestor a um setor
    static async associarGestor(id_setor, id_gestor, id_empresa) {
        try {
            const setor = await prisma.setores.findFirst({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                }
            });

            if (!setor) {
                throw new Error('Setor não encontrado ou não pertence à empresa');
            }

            const gestor = await prisma.usuarios.findFirst({
                where: {
                    id_usuario: id_gestor,
                    id_empresa: id_empresa,
                    tipo: 'Gestor'
                }
            });

            if (!gestor) {
                throw new Error('Usuário não encontrado, não pertence à empresa ou não é gestor');
            }

            const associacao = await prisma.setor_Gestor.create({
                data: {
                    id_setor: id_setor,
                    id_gestor: id_gestor,
                    id_empresa: id_empresa
                }
            });
            return associacao;
        } catch (error) {
            console.error('Erro ao associar gestor ao setor:', error);
            throw error;
        }
    }

    // Remove a associação de um gestor com um setor
    static async removerGestor(id_setor, id_gestor, id_empresa) {
        try {
            const result = await prisma.setor_Gestor.deleteMany({
                where: {
                    id_setor: id_setor,
                    id_gestor: id_gestor,
                    id_empresa: id_empresa
                }
            });
            if (result.count === 0) {
                throw new Error('Associação não encontrada');
            }
        } catch (error) {
            console.error('Erro ao remover gestor do setor:', error);
            throw error;
        }
    }

    // Lista gestores de um setor
    static async listarGestoresDoSetor(id_setor, id_empresa) {
        try {
            const gestores = await prisma.setor_Gestor.findMany({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                },
                include: {
                    gestor: {
                        select: { id_usuario: true, nome: true, email: true, tipo: true }
                    }
                }
            });
            return gestores;
        } catch (error) {
            console.error('Erro ao listar gestores do setor:', error);
            throw error;
        }
    }

    // Lista setores de um gestor
    static async listarSetoresDoGestor(id_gestor, id_empresa) {
        try {
            const setores = await prisma.setor_Gestor.findMany({
                where: {
                    id_gestor: id_gestor,
                    id_empresa: id_empresa
                },
                include: {
                    setor: {
                        select: { id_setor: true, nome_setor: true }
                    }
                }
            });
            return setores;
        } catch (error) {
            console.error('Erro ao listar setores do gestor:', error);
            throw error;
        }
    }

    // ------------------------ Dashboards ----------------------- //

    static inicioDoDia(data) {
        const inicio = new Date(data);
        inicio.setHours(0, 0, 0, 0);
        return inicio;
    }

    static async obterLimitesDiaIndustrial(id_empresa) {
        const turnos = await prisma.turno.findMany({
            where: { id_empresa }
        });

        if (turnos.length === 0) return { horaInicio: 0, minutoInicio: 0 };

        const converterParaMinutos = (data) => {
            const d = new Date(data);
            return d.getHours() * 60 + d.getMinutes();
        };

        const minutosInicio = Math.min(...turnos.map(t => converterParaMinutos(t.hora_inicio)));

        return {
            horaInicio: Math.floor(minutosInicio / 60),
            minutoInicio: minutosInicio % 60
        };
    }

    static montarFiltroPeriodo(campo, dias) {
        const quantidadeDias = Number(dias);

        if (!Number.isInteger(quantidadeDias) || quantidadeDias <= 0) {
            return {};
        }

        const inicio = this.inicioDoDia(new Date());
        inicio.setDate(inicio.getDate() - (quantidadeDias - 1));

        return {
            [campo]: {
                gte: inicio
            }
        };
    }

    static async obterProducaoPorSetor(id_empresa) {
        try {
            const limites = await this.obterLimitesDiaIndustrial(id_empresa);

            const agora = new Date();
            let inicioBusca = new Date(agora);

            const minutosAgora = (agora.getHours() * 60) + agora.getMinutes();
            const minutosInicioTurno = (limites.horaInicio * 60) + limites.minutoInicio;

            if (minutosAgora < minutosInicioTurno) {
                inicioBusca.setDate(inicioBusca.getDate() - 1);
            }

            inicioBusca.setHours(limites.horaInicio, limites.minutoInicio, 0, 0);
            const fimBusca = new Date(inicioBusca.getTime() + (24 * 60 * 60 * 1000));

            const setoresComProducao = await prisma.setores.findMany({
                where: { id_empresa },
                select: {
                    id_setor: true,
                    nome_setor: true,
                    ordens_producao: {
                        where: { status_op: 'Produzindo' },
                        select: {
                            qtd_planejada: true,
                            apontamentos: {
                                where: {
                                    data_hora_fim: {
                                        gte: inicioBusca,
                                        lt: fimBusca
                                    }
                                },
                                select: { qtd_boa: true }
                            }
                        }
                    }
                }
            });

            const resultado = setoresComProducao.map(setor => {
                let totalPlanejado = 0;
                let totalProduzido = 0;

                setor.ordens_producao.forEach(op => {
                    totalPlanejado += op.qtd_planejada;
                    const produzidoNaOP = op.apontamentos.reduce((sum, ap) => sum + (ap.qtd_boa || 0), 0);
                    totalProduzido += produzidoNaOP;
                });

                let porcentagem = 0;
                if (totalPlanejado > 0) {
                    porcentagem = (totalProduzido / totalPlanejado) * 100;
                }

                return {
                    id_setor: setor.id_setor,
                    setor: setor.nome_setor,
                    porcentagem: Number(Math.min(porcentagem, 100).toFixed(1))
                };
            });

            return resultado.sort((a, b) => b.porcentagem - a.porcentagem);

        } catch (error) {
            console.error('Erro ao calcular produção por setor:', error);
            throw error;
        }
    }

    static async obterQuantidadeMaquinasPorSetor(id_empresa) {
        try {
            const setores = await prisma.setores.findMany({
                where: { id_empresa },
                include: {
                    maquinas: {
                        where: { ativo: true },
                        select: { id_maquina: true }
                    }
                }
            });

            return setores.map(setor => ({
                id_setor: setor.id_setor,
                setor: setor.nome_setor,
                qtd: setor.maquinas.length
            })).sort((a, b) => b.qtd - a.qtd);
        } catch (error) {
            console.error('Erro ao obter quantidade de maquinas por setor:', error);
            throw error;
        }
    }

    static async obterTempoMedioParadaPorSetor(id_empresa, dias = null) {
        try {
            const [paradas, setores] = await Promise.all([
                prisma.historico_Eventos.groupBy({
                    by: ['setor_afetado'],
                    where: {
                        id_empresa,
                        status_atual: {
                            in: ['Parada', 'Manutencao', 'Setup']
                        },
                        duracao: {
                            not: null
                        },
                        ...this.montarFiltroPeriodo('inicio', dias)
                    },
                    _avg: {
                        duracao: true
                    },
                    _sum: {
                        duracao: true
                    },
                    _count: {
                        id_evento: true
                    }
                }),
                prisma.setores.findMany({
                    where: { id_empresa },
                    select: { id_setor: true, nome_setor: true }
                })
            ]);

            const setoresPorId = new Map(setores.map(setor => [setor.id_setor, setor.nome_setor]));

            return paradas.map(parada => ({
                id_setor: parada.setor_afetado,
                setor: setoresPorId.get(parada.setor_afetado) ?? 'Sem setor',
                minutos: Number((parada._avg.duracao ?? 0).toFixed(1)),
                tempo_total_minutos: parada._sum.duracao ?? 0,
                total_eventos: parada._count.id_evento
            })).sort((a, b) => b.minutos - a.minutos);
        } catch (error) {
            console.error('Erro ao obter tempo medio de parada por setor:', error);
            throw error;
        }
    }

    static async obterProducaoDefeitosPorSetor(id_empresa, dias = null) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    ...this.montarFiltroPeriodo('data_hora_fim', dias)
                },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    maquina: {
                        select: {
                            setor: {
                                select: {
                                    id_setor: true,
                                    nome_setor: true
                                }
                            }
                        }
                    }
                }
            });

            const dadosPorSetor = new Map();

            for (const apontamento of apontamentos) {
                const setor = apontamento.maquina?.setor;
                const chave = setor?.id_setor ?? 0;
                const acumulado = dadosPorSetor.get(chave) ?? {
                    id_setor: setor?.id_setor ?? null,
                    setor: setor?.nome_setor ?? 'Sem setor',
                    boas: 0,
                    defeitos: 0
                };

                acumulado.boas += apontamento.qtd_boa ?? 0;
                acumulado.defeitos += apontamento.qtd_refugo ?? 0;
                dadosPorSetor.set(chave, acumulado);
            }

            return Array.from(dadosPorSetor.values()).map(setor => {
                const total = setor.boas + setor.defeitos;
                const produzidas = total > 0 ? Number(((setor.boas / total) * 100).toFixed(1)) : 0;
                const defeito = total > 0 ? Number(((setor.defeitos / total) * 100).toFixed(1)) : 0;

                return {
                    id_setor: setor.id_setor,
                    setor: setor.setor,
                    produzidas,
                    defeito,
                    total_produzido: total,
                    total_refugo: setor.defeitos
                };
            }).sort((a, b) => b.total_refugo - a.total_refugo);
        } catch (error) {
            console.error('Erro ao obter producao de defeitos por setor:', error);
            throw error;
        }
    }

    // Quantidade de operadores escalados por setor

    static async obterQuantidadeOperadoresPorSetor(id_empresa) {
        try {
            // Busca setores da empresa com a contagem de operadores únicos na escala
            const [escalasAgrupadas, setores] = await Promise.all([
                prisma.escalaTrabalho.groupBy({
                    by: ['id_setor'],
                    where: { id_empresa },
                    _count: {
                        id_operador: true
                    }
                }),
                prisma.setores.findMany({
                    where: { id_empresa },
                    select: { id_setor: true, nome_setor: true }
                })
            ]);

            // Mapa id_setor → nome
            const setoresPorId = new Map(setores.map(s => [s.id_setor, s.nome_setor]));

            // Garante que setores sem nenhum operador escalado apareçam com qtd 0
            const resultado = setores.map(setor => {
                const escala = escalasAgrupadas.find(e => e.id_setor === setor.id_setor);
                return {
                    id_setor: setor.id_setor,
                    setor: setor.nome_setor,
                    qtdOperadores: escala?._count.id_operador ?? 0
                };
            });

            return resultado.sort((a, b) => b.qtdOperadores - a.qtdOperadores);
        } catch (error) {
            console.error('Erro ao obter quantidade de operadores por setor:', error);
            throw error;
        }
    }

    static async obterSetorCritico(id_empresa) {
        try {
            const setores = await this.obterOeePorSetor(id_empresa);

            if (setores.length === 0) return null;

            // Ordena crescente e pega o pior
            return setores.sort((a, b) => a.oee - b.oee)[0];
        } catch (error) {
            console.error('Erro ao obter setor critico:', error);
            throw error;
        }
    }

}

export default SetorModel;