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
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_maquina: { in: ids_maquinas },
                    id_empresa,
                    id_operador: { not: null }
                },
                select: { id_maquina: true, id_operador: true }
            });

            await Promise.all(maquinas.map(maquina =>
                prisma.escalaTrabalho.updateMany({
                    where: {
                        id_empresa,
                        id_operador: maquina.id_operador
                    },
                    data: {
                        id_setor,
                        id_maquina: maquina.id_maquina
                    }
                })
            ));
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
                gestores: {
                    include: {
                        gestor: {
                            select: { id_usuario: true, nome: true, email: true }
                        }
                    }
                },
                // O Prisma faz a contagem rápida direto no banco
                _count: {
                    select: {
                        maquinas: true,
                        escalas: true // Quantidade de operadores vinculados pela escala
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
            await prisma.maquinas.updateMany({
                where: { id_setor, id_empresa },
                data: { id_setor: null }
            });

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

    // Associa operadores a um setor atualizando suas escalas de trabalho
    static async associarOperadores(id_setor, ids_operadores, id_empresa) {
        try {
            const setor = await prisma.setores.findFirst({
                where: { id_setor, id_empresa }
            });

            if (!setor) {
                throw new Error('Setor não encontrado ou não pertence à empresa');
            }

            // Atualiza o id_setor em todas as escalas de trabalho dos operadores selecionados
            const resultado = await prisma.escalaTrabalho.updateMany({
                where: {
                    id_operador: { in: ids_operadores },
                    id_empresa: id_empresa
                },
                data: {
                    id_setor: id_setor
                }
            });

            return resultado;
        } catch (error) {
            console.error('Erro ao associar operadores ao setor:', error);
            throw error;
        }
    }

    // Remove a associação de um operador com um setor deletando sua escala correspondente
    static async removerOperador(id_setor, id_operador, id_empresa) {
        try {
            // Como id_setor é obrigatório na EscalaTrabalho, remover o operador do setor implica em remover sua escala de trabalho vinculada a este setor.
            return await prisma.escalaTrabalho.deleteMany({
                where: {
                    id_setor,
                    id_operador,
                    id_empresa
                }
            });
        } catch (error) {
            console.error('Erro ao remover operador do setor:', error);
            throw error;
        }
    }

    // Lista operadores de um setor via EscalaTrabalho
    static async listarOperadoresDoSetor(id_setor, id_empresa) {
        try {
            const escalas = await prisma.escalaTrabalho.findMany({
                where: {
                    id_setor,
                    id_empresa
                },
                include: {
                    operador: {
                        select: { id_usuario: true, nome: true, email: true, tipo: true }
                    }
                }
            });

            // Retornar apenas os operadores únicos
            const operadoresUnicos = [];
            const idsVistos = new Set();

            for (const escala of escalas) {
                if (!idsVistos.has(escala.id_operador)) {
                    operadoresUnicos.push(escala.operador);
                    idsVistos.add(escala.id_operador);
                }
            }

            return operadoresUnicos;
        } catch (error) {
            console.error('Erro ao listar operadores do setor:', error);
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

            const [setores, apontamentos] = await Promise.all([
                prisma.setores.findMany({
                    where: { id_empresa },
                    select: {
                        id_setor: true,
                        nome_setor: true
                    }
                }),
                prisma.apontamento.findMany({
                    where: {
                        id_empresa,
                        data_hora_fim: {
                            gte: inicioBusca,
                            lt: fimBusca
                        }
                    },
                    select: {
                        qtd_boa: true,
                        maquina: {
                            select: {
                                id_setor: true
                            }
                        }
                    }
                })
            ]);

            const producaoPorSetor = new Map(
                setores.map(setor => [
                    setor.id_setor,
                    {
                        setor: setor.nome_setor,
                        qtd: 0
                    }
                ])
            );

            for (const apontamento of apontamentos) {
                const id_setor = apontamento.maquina?.id_setor;
                if (!id_setor || !producaoPorSetor.has(id_setor)) continue;

                const setor = producaoPorSetor.get(id_setor);
                setor.qtd += apontamento.qtd_boa ?? 0;
            }

            const resultado = Array.from(producaoPorSetor.values());

            return resultado

        } catch (error) {
            console.error('Erro ao calcular produção por setor:', error);
            throw error;
        }
    }

    static async obterQuantidadeMaquinasPorSetor(id_empresa, setorId = null) {
        try {
            const setores = await prisma.setores.findMany({
                where: {
                    id_empresa,
                    ...(setorId ? { id_setor: Number(setorId) } : {})
                },
                include: {
                    maquinas: {
                        where: { ativo: true },
                        select: { id_maquina: true }
                    }
                }
            });

            return setores.map(setor => ({
                id_setor: setor.id_setor,
                id: setor.id_setor,
                setor: setor.nome_setor,
                quantidade: setor.maquinas.length,
                qtd: setor.maquinas.length
            })).sort((a, b) => b.qtd - a.qtd);
        } catch (error) {
            console.error('Erro ao obter quantidade de maquinas por setor:', error);
            throw error;
        }
    }

    static async obterTempoMedioParadaPorSetor(id_empresa, dias = null, setorId = null) {
        try {
            const [paradas, setores] = await Promise.all([
                prisma.historico_Eventos.groupBy({
                    by: ['setor_afetado'],
                    where: {
                        id_empresa,
                        status_atual: {
                            in: ['Parada', 'Manutencao', 'Setup']
                        },
                        ...(setorId ? { setor_afetado: Number(setorId) } : {}),
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
                // id_setor: parada.setor_afetado,
                id_setor: parada.setor_afetado,
                setorId: parada.setor_afetado,
                setor: setoresPorId.get(parada.setor_afetado) ?? 'Sem setor',
                maquina: setoresPorId.get(parada.setor_afetado) ?? 'Sem setor',
                minutos: Number((parada._avg.duracao ?? 0).toFixed(1)),
                // tempo_total_minutos: parada._sum.duracao ?? 0,
                // total_eventos: parada._count.id_evento
            })).sort((a, b) => b.minutos - a.minutos);
        } catch (error) {
            console.error('Erro ao obter tempo medio de parada por setor:', error);
            throw error;
        }
    }

    static async obterProducaoDefeitosPorSetor(id_empresa, dias = null, setorId = null) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}),
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
                    // id_setor: setor.id_setor,
                    id_setor: setor.id_setor,
                    setorId: setor.id_setor,
                    setor: setor.setor,
                    maquina: setor.setor,
                    produzidas,
                    defeito,
                    // total_produzido: total,
                    // total_refugo: setor.defeitos
                };
            }).sort((a, b) => b.total_refugo - a.total_refugo);
        } catch (error) {
            console.error('Erro ao obter producao de defeitos por setor:', error);
            throw error;
        }
    }

    // Quantidade de operadores escalados por setor

    static async obterMediaOperadoresPorSetor(id_empresa) {
        try {
            const [totalOperadoresEscalados, totalSetores] = await Promise.all([
                // 1. Conta o total de registros na tabela de escalas para a empresa
                prisma.escalaTrabalho.count({
                    where: { id_empresa }
                }),
                // 2. Conta quantos setores a empresa possui no total
                prisma.setores.count({
                    where: { id_empresa }
                })
            ]);

            // Evita divisão por zero caso a empresa não tenha setores cadastrados
            if (totalSetores === 0) return 0;

            // Calcula a média
            const media = totalOperadoresEscalados / totalSetores;

            // Retorna apenas o número (formatado com 1 casa decimal, por exemplo)
            return {
                titulo: "Número de operadores por setor (média)",
                subtitulo: "Atualizado em tempo real",
                valor: Number(media.toFixed(1))
            }
        } catch (error) {
            console.error('Erro ao calcular média de operadores por setor:', error);
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

    static async totalDeSetores(id_empresa) {
        try {
            const resposta = await prisma.setores.count({
                where: {
                    id_empresa: id_empresa
                }
            })
            return {
                titulo: "Número Total de Setores",
                subtitulo: "Atualizado em tempo real",
                valor: String(resposta)
            }

        } catch (error) {
            console.error('Erro ao obter total de setores:', error);
            throw error;
        }
    }

    // ---------------------------------------Pagina de Gestor -----------------------------------------------
     static async motivosParadaSetor(id_setor, id_empresa) {
    const resultado = await prisma.historico_Eventos.groupBy({
      by:    ['id_motivo_parada'],
      where: {
        id_empresa,
        setor_afetado:  Number(id_setor),
        id_motivo_parada: { not: null },
        status_atual:    { in: ['Parada', 'Setup'] }
      },
      _count:  { id_evento: true },
      orderBy: { _count: { id_evento: 'desc' } },
      take:    5
    })

    const ids     = resultado.map(r => r.id_motivo_parada)
    const motivos = await prisma.motivos_Parada.findMany({
      where:  { id_motivo: { in: ids } },
      select: { id_motivo: true, descricao: true }
    })

    const nomeMotivo = Object.fromEntries(
      motivos.map(m => [m.id_motivo, m.descricao])
    )

    return resultado.map(r => ({
      motivo: nomeMotivo[r.id_motivo_parada] ?? 'Sem motivo',
      qtd:    r._count.id_evento
    }))
  }

  static async top5OperadoresSetor(id_setor, id_empresa) {
    const resultado = await prisma.apontamento.groupBy({
      by:    ['id_operador'],
      where: {
        id_empresa,
        maquina: { id_setor }
      },
      _sum:    { qtd_boa: true, qtd_refugo: true },
      orderBy: { _sum: { qtd_boa: 'desc' } },
      take:    5
    })

    const ids      = resultado.map(r => r.id_operador)
    const usuarios = await prisma.usuarios.findMany({
      where:  { id_usuario: { in: ids } },
      select: { id_usuario: true, nome: true }
    })

    const nomeUsuario = Object.fromEntries(
      usuarios.map(u => [u.id_usuario, u.nome])
    )

    return resultado.map(r => ({
      operador:  nomeUsuario[r.id_operador] ?? 'Desconhecido',
      qtd: (r._sum.qtd_boa ?? 0) + (r._sum.qtd_refugo ?? 0)
    }))
  }

}

export default SetorModel;
