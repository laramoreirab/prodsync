import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';
import bcrypt from 'bcrypt'

class UsuarioModel {
    //Listar todos os usuários com paginacção
    static async listarTodos(id_empresa, paginacao) {
        try {

            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa
                },
                include: {
                    operador: true, // Traz os dados do operador
                    turno: {
                        select: {
                            nome_turno: true, // Traz apenas o nome do turno
                        },
                    },
                    setor: {
                        select: {
                            nome_setor: true, // Traz apenas o nome do setor
                        },
                    },
                },
                orderBy: {
                    id_operador: 'asc'
                },
            }

            const resultadoPaginado = await paginarPrisma(
                prisma.escalaTrabalho,
                regrasDaBusca,
                paginacao
            );

            return resultadoPaginado;

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    };

    //buscar usuario por id
    static async buscarPorId(id, id_empresa) {
        try {
            const row = await prisma.usuarios.findFirst({
                where: {
                    id_usuario: parseInt(id),
                    id_empresa: parseInt(id_empresa)
                }
            });
            return row || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }

    };

    //Registrar usuarios na tabela usuários
    static async criarUsuario(dados) {
        if (dados.tipo === 'Adm') {
            try {
                const senhaHash = await bcrypt.hash(dados.senha, 10);

                const novoUsuario = await prisma.usuarios.create({
                    data: {
                        ...dados,
                        senha: senhaHash
                    }
                });
                return novoUsuario || null;

            } catch (error) {
                console.error('Erro ao registrar administrador da empresa', error);
                throw error;
            }
        } else {
            try {
                const novoUsuario = await prisma.usuarios.create({
                    data: {
                        ...dados
                    },
                    select: { id_usuario: true } //vai retornar o Id do novo usuário
                });
                return novoUsuario.id_usuario || null;
            } catch (error) {
                console.error('Erro ao registrar novo usuário', error);
                throw error;
            }
        }
    }


    //verificar credenciais do login 
    static async verificarCredenciais(id, senha) {
        try {
            const usuario = await prisma.usuarios.findUnique({
                where: {
                    id_usuario: Number(id)
                }
            });
            if (!usuario) {
                return null
            };
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return null
            }
            // Retornar usuário sem a senha
            const { senha: _, ...usuarioSemSenha } = usuario;
            return usuarioSemSenha;
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            throw error;
        }
    }

    //verificar se o id ainda não possui senha cadastrada
    static async verificaSenhaUsuario(id) {
        try {
            const usuarioSenha = await prisma.usuarios.findUnique({
                where: { id_usuario: id },
                select: { senha: true }
            });
            if (usuarioSenha && usuarioSenha.senha !== null) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error('Erro ao verificar se o ID possui senha cadastrada:', error);
            throw error;
        }
    };

    //Verificar se as senhas cadastradas no primeiro acesso estão iguais
    static async comparacaoDeSenhas(senha, senhaConfirmada) {
        try {
            if (senha === senhaConfirmada) {
                return true
            } else {
                return false
            };
        } catch (error) {
            console.error('Erro ao comparar as senhas:', error);
            throw error;
        }
    }

    //atualizar dados dos usuários
    static async atualizar(id, id_empresa, dados) {
        try {
            if (dados.senha) {
                dados.senha = await bcrypt.hash(dados.senha, 10)
            }
            const row = await prisma.usuarios.updateMany({
                where: {
                    id_usuario: id,
                    id_empresa: id_empresa
                },
                data: { ...dados }
            })
            if (row.count === 0) return null

            return await prisma.usuarios.findFirst({
                where: {
                    id_usuario: id,
                    id_empresa: id_empresa
                }
            })
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    //Deletar dados dos usuários
    static async deletar(id, id_empresa) {
        try {
            const deletarUser = await prisma.usuarios.deleteMany({
                where: {
                    id_usuario: id,
                    id_empresa: id_empresa
                },
            });
            return deletarUser
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw error;
        }
    }

    // -------------------------------------------------Dashboards-------------------------------------------------

    static async qtdPorTipo(id_empresa) {
        try {
            const resultado = await prisma.usuarios.groupBy({
                by: ['tipo'],
                where: { id_empresa },
                _count: { tipo: true }
            })

            return resultado.map(r => ({
                tipo: r.tipo,
                quantidade: r._count.tipo
            }))
        } catch (error) {
            console.error('Erro ao contar e agrupar usuários por tipo no banco de dados:', error);
            throw error;
        }
    }

    static async tempoMedioSessaoPorTipo(id_empresa) {
        try {
            const usuarios = await prisma.usuarios.findMany({
                where: { id_empresa },
                select: {
                    tipo: true,
                    logs: {
                        select: { criado_em: true },
                        orderBy: { criado_em: 'asc' }
                    }
                }
            })

            const sessoesPorTipo = {}

            for (const usuario of usuarios) {
                if (!sessoesPorTipo[usuario.tipo]) {
                    sessoesPorTipo[usuario.tipo] = []
                }

                // agrupa logs por dia e calcula duração de cada sessão
                const logsPorDia = {}
                for (const log of usuario.logs) {
                    const dia = log.criado_em.toISOString().split('T')[0]
                    if (!logsPorDia[dia]) logsPorDia[dia] = []
                    logsPorDia[dia].push(new Date(log.criado_em))
                }

                for (const logs of Object.values(logsPorDia)) {
                    const primeiro = new Date(Math.min(...logs))
                    const ultimo = new Date(Math.max(...logs))
                    const minutos = (ultimo - primeiro) / 1000 / 60
                    if (minutos > 0) sessoesPorTipo[usuario.tipo].push(minutos)
                }
            }

            return Object.entries(sessoesPorTipo).map(([tipo, sessoes]) => {
                const media = sessoes.length > 0
                    ? Math.round(sessoes.reduce((a, b) => a + b, 0) / sessoes.length)
                    : 0
                const horas = Math.floor(media / 60).toString().padStart(2, '0')
                const minutos = (media % 60).toString().padStart(2, '0')

                return {
                    tipo,
                    tempo_medio_minutos: media,
                    tempo_formatado: `${horas}:${minutos} h`
                }
            })
        } catch (error) {
            console.error('Erro ao contar tempo médio de sessão por perfil no banco de dados:', error);
            throw error;
        }
    }

    static async qtdPorSetor(id_empresa) {
        try {

            const resultado = await prisma.escalaTrabalho.groupBy({
                by: ['id_setor'],
                where: { id_empresa },
                _count: { id_operador: true }
            })

            const setores = await prisma.setores.findMany({
                where: { id_empresa },
                select: { id_setor: true, nome_setor: true }
            })

            const nomeSetor = Object.fromEntries(
                setores.map(s => [s.id_setor, s.nome_setor])
            )

            return resultado
                .map(r => ({
                    setor: nomeSetor[r.id_setor] ?? 'Sem setor',
                    quantidade: r._count.id_operador
                }))
                .sort((a, b) => b.quantidade - a.quantidade)
        } catch (error) {
            console.error('Erro ao contar quantidade de usuários por setor no banco de dados:', error);
            throw error;
        }
    }

    static async top5Operadores(id_empresa) {
        try {
            const resultado = await prisma.apontamento.groupBy({
                by: ['id_operador'],
                where: { id_empresa },
                _sum: { qtd_boa: true, qtd_refugo: true },
                orderBy: { _sum: { qtd_boa: 'desc' } },
                take: 5
            })

            const usuarios = await prisma.usuarios.findMany({
                where: { id_usuario: { in: resultado.map(r => r.id_operador) } },
                select: { id_usuario: true, nome: true }
            })

            const nomeUsuario = Object.fromEntries(
                usuarios.map(u => [u.id_usuario, u.nome])
            )

            return resultado.map(r => ({
                nome: nomeUsuario[r.id_operador] ?? 'Desconhecido',
                pecas_boas: r._sum.qtd_boa ?? 0,
                refugo: r._sum.qtd_refugo ?? 0
            }))
        } catch (error) {
            console.error('Erro ao retornar top 5 operadores no banco de dados:', error);
            throw error;
        }
    }

    static async producaoMediaPorDiaSetor(id_empresa) {
        try {
            const setores = await prisma.setores.findMany({
                where: { id_empresa },
                select: {
                    id_setor: true,
                    nome_setor: true,
                    maquinas: {
                        select: {
                            apontamentos: {
                                select: {
                                    data_hora_inicio: true,
                                    qtd_boa: true
                                }
                            }
                        }
                    }
                }
            })

            return setores.map(s => {
                const setor = s.nome_setor
                const apontamentos = s.maquinas.flatMap(m => m.apontamentos)

                const porDia = {}
                apontamentos.forEach(ap => {
                    const dia = ap.data_hora_inicio.toISOString().split('T')[0]
                    porDia[dia] = (porDia[dia] || 0) + ap.qtd_boa
                })

                const valores = Object.values(porDia)
                const mediaDiaria = valores.length > 0
                    ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
                    : 0

                return { setor, media_diaria: mediaDiaria }
            }).sort((a, b) => b.media_diaria - a.media_diaria)
        } catch (error) {
            console.error('Erro ao contar a produção média de usuários por dia por setor no banco de dados:', error);
            throw error;
        }
    }

    static async rotatividade(id_empresa) {
        try {
            // busca ids dos usuários da empresa para filtrar os logs
            const usuarios = await prisma.usuarios.findMany({
                where: { id_empresa },
                select: { id_usuario: true }
            })
            const ids = usuarios.map(u => u.id_usuario)

            const [logsNovos, logsDesligados] = await Promise.all([
                // log de criação — POST /api/usuarios com status 201
                prisma.logs.findMany({
                    where: {
                        usuario_id: { in: ids },
                        metodo: 'POST',
                        rota: '/api/usuarios',
                        status_code: 201
                    },
                    select: { criado_em: true }
                }),
                // log de deleção — DELETE /api/usuarios com status 200
                prisma.logs.findMany({
                    where: {
                        usuario_id: { in: ids },
                        metodo: 'DELETE',
                        rota: '/api/usuarios',
                        status_code: 200
                    },
                    select: { criado_em: true }
                })
            ])

            const nomeMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            const meses = {}

            for (const log of logsNovos) {
                const mes = nomeMes[log.criado_em.getMonth()]
                if (!meses[mes]) meses[mes] = { mes, novos: 0, desligados: 0 }
                meses[mes].novos++
            }
            for (const log of logsDesligados) {
                const mes = nomeMes[log.criado_em.getMonth()]
                if (!meses[mes]) meses[mes] = { mes, novos: 0, desligados: 0 }
                meses[mes].desligados++
            }

            return Object.values(meses)
        } catch (error) {
            console.error('Erro ao retornar rotatividade de usuários por mês no banco de dados:', error);
            throw error;
        }
    }

    // ------------------------------------------------------Dashboard da página específica de usuário-------------------------------------------------------------
    static async metaProducao(id_empresa, id_usuario, id_maquina) {
        try {
            const ultimaOrdem = await prisma.apontamento.findFirst({
                where: {
                    id_operador: id_usuario,
                    id_maquina: id_maquina,
                },
                orderBy: {
                    id_ordemProducao: "desc"
                }
            })
            if (!ultimaOrdem) return 0;

            const metaTotal = await prisma.ordemProducao.findFirst({
                where: {
                    id_ordem: ultimaOrdem.id_ordemProducao,
                    id_empresa: id_empresa
                },
                select: {
                    qtd_planejada: true
                }
            })
            if (!metaTotal || !metaTotal.qtd_planejada) return 0;

            const metaProducao = (ultimaOrdem.qtd_boa / metaTotal.qtd_planejada) * 100
            return metaProducao
        } catch (error) {
            console.error('Erro ao retornar meta de produção alcançada no banco de dados:', error);
            throw error;
        }
    }

    static async tempoParadoTempoProduzindoUsuario(id_empresa, id_maquina) {
        try {
            function semanaAtual() {
                const hoje = new Date()
                const diaSemana = hoje.getDay()
                const diasParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1
                const inicio = new Date(hoje)
                inicio.setDate(hoje.getDate() - diasParaSegunda)
                inicio.setHours(0, 0, 0, 0)
                const fim = new Date(inicio)
                fim.setDate(inicio.getDate() + 6)
                fim.setHours(23, 59, 59, 999)
                return { inicio, fim }
            }
            const { inicio, fim } = semanaAtual()
            const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

            // busca apontamentos da semana — tempo produzido
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    id_maquina: id_maquina,
                    data_hora_inicio: { gte: inicio, lte: fim }
                },
                select: {
                    data_hora_inicio: true,
                    data_hora_fim: true
                }
            })

            // busca paradas da semana — tempo parado
            const paradas = await prisma.historico_Eventos.findMany({
                where: {
                    id_empresa,
                    id_maquina: id_maquina,
                    status_atual: { in: ['Parada', 'Manutencao', 'Setup'] },
                    inicio: { gte: inicio, lte: fim },
                    duracao: { not: null }
                },
                select: {
                    inicio: true,
                    duracao: true  // já em minutos
                }
            })

            // agrupa por dia
            const agrupado = {}

            for (const ap of apontamentos) {
                if (!ap.data_hora_fim) continue  // ← pula se ainda não terminou
              
                const dia     = diasSemana[new Date(ap.data_hora_inicio).getDay()]
                const minutos = (new Date(ap.data_hora_fim) - new Date(ap.data_hora_inicio)) / 1000 / 60
              
                if (!agrupado[dia]) agrupado[dia] = { dia, tempo_produzido: 0, tempo_parado: 0 }
                agrupado[dia].tempo_produzido += Math.round(minutos)
              }

            for (const parada of paradas) {
                const dia = diasSemana[new Date(parada.inicio).getDay()]

                if (!agrupado[dia]) agrupado[dia] = { dia, tempo_produzido: 0, tempo_parado: 0 }
                agrupado[dia].tempo_parado += parada.duracao
            }

            // ordena de Seg a Dom e retorna só dias que tiveram dados
            const ordem = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
            return ordem
                .filter(dia => agrupado[dia])
                .map(dia => agrupado[dia])

        } catch (error) {
            console.error('Erro ao retornar Tempo Total Parado x Tempo Total Produzindo da máquina do usuário no banco de dados:', error);
            throw error;
        }
    }

    static async producaoPorHoraOperador(id_empresa, id_usuario) {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    id_operador: id_usuario,
                    data_hora_inicio: { gte: hoje, lt: amanha }
                },
                select: {
                    data_hora_inicio: true,
                    qtd_boa: true
                }
            });

            const porHora = Array.from({ length: 24 }, (_, i) => ({ hora: `${i}h`, pecas: 0 }));
            apontamentos.forEach(ap => {
                const hora = new Date(ap.data_hora_inicio).getHours();
                porHora[hora].pecas += ap.qtd_boa;
            });

            return porHora;
        } catch (error) {
            console.error('Erro ao buscar produção por hora do operador:', error);
            throw error;
        }
    }

    static async produtividadeDiaOperador(id_empresa, id_usuario) {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    id_operador: id_usuario,
                    data_hora_inicio: { gte: hoje, lt: amanha }
                },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true
                }
            });

            const total = apontamentos.reduce((acc, ap) => acc + ap.qtd_boa + ap.qtd_refugo, 0);
            const bons = apontamentos.reduce((acc, ap) => acc + ap.qtd_boa, 0);
            const produtividade = total > 0 ? Math.round((bons / total) * 100) : 0;

            return { produtividade };
        } catch (error) {
            console.error('Erro ao buscar produtividade do dia do operador:', error);
            throw error;
        }
    }

    static async qualidadeOperador(id_empresa, id_usuario) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: { id_empresa, id_operador: id_usuario },
                select: { qtd_boa: true, qtd_refugo: true }
            });

            const bons = apontamentos.reduce((acc, ap) => acc + ap.qtd_boa, 0);
            const refugos = apontamentos.reduce((acc, ap) => acc + ap.qtd_refugo, 0);
            const total = bons + refugos;

            return {
                qualidade: total > 0 ? Math.round((bons / total) * 100) : 0,
                bons,
                refugos
            };
        } catch (error) {
            console.error('Erro ao buscar qualidade do operador:', error);
            throw error;
        }
    }

    static async velocimetroOperador(id_empresa, id_usuario) {
        try {
            const ultimaOP = await prisma.apontamento.findFirst({
                where: { id_empresa, id_operador: id_usuario },
                orderBy: { data_hora_inicio: 'desc' },
                include: { maquina: true }
            });

            if (!ultimaOP || !ultimaOP.maquina) return { velocidade: 0 };

            // Simulação de velocidade baseada na capacidade da máquina
            const velocidade = Math.floor(Math.random() * (ultimaOP.maquina.capacidade || 100));
            return { velocidade };
        } catch (error) {
            console.error('Erro ao buscar velocímetro do operador:', error);
            throw error;
        }
    }

    static async pecasPorDiaOperador(id_empresa, id_usuario) {
        try {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    id_operador: id_usuario,
                    data_hora_inicio: { gte: seteDiasAtras }
                },
                select: {
                    data_hora_inicio: true,
                    qtd_boa: true
                }
            });

            const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
            const agrupado = {};

            apontamentos.forEach(ap => {
                const dia = diasSemana[new Date(ap.data_hora_inicio).getDay()];
                agrupado[dia] = (agrupado[dia] || 0) + ap.qtd_boa;
            });

            return Object.entries(agrupado).map(([dia, pecas]) => ({ dia, pecas }));
        } catch (error) {
            console.error('Erro ao buscar peças por dia do operador:', error);
            throw error;
        }
    }

    static async oeeOperador(id_empresa, id_usuario) {
        try {
            const escala = await prisma.escalaTrabalho.findFirst({
                where: { id_operador: id_usuario, id_empresa },
                select: { id_maquina: true }
            });

            if (!escala || !escala.id_maquina) return { oee: 0, disponibilidade: 0, performance: 0, qualidade: 0 };

            const OEEModel = (await import('./OEEModel.js')).default;
            return await OEEModel.obterOeeMaquina(escala.id_maquina, id_empresa);
        } catch (error) {
            console.error('Erro ao buscar OEE do operador:', error);
            throw error;
        }
    }

    static async oeeMaquinaOperador(id_empresa, id_usuario) {
        try {
            const escala = await prisma.escalaTrabalho.findFirst({
                where: { id_operador: id_usuario, id_empresa },
                select: { id_maquina: true }
            });

            if (!escala || !escala.id_maquina) return [];

            const OEEModel = (await import('./OEEModel.js')).default;
            const oee = await OEEModel.obterOeeMaquina(escala.id_maquina, id_empresa);
            
            return [{
                oee: oee.oee || 0,
                disponibilidade: oee.disponibilidade || 0,
                performance: oee.performance || 0,
                qualidade: oee.qualidade || 0
            }];
        } catch (error) {
            console.error('Erro ao buscar OEE da máquina do operador:', error);
            throw error;
        }
    }

    static async oeeMaquinaDetalhesOperador(id_empresa, id_usuario) {
        try {
            const escala = await prisma.escalaTrabalho.findFirst({
                where: { id_operador: id_usuario, id_empresa },
                select: { id_maquina: true }
            });

            if (!escala || !escala.id_maquina) return null;

            const OEEModel = (await import('./OEEModel.js')).default;
            return await OEEModel.obterOeeMaquina(escala.id_maquina, id_empresa);
        } catch (error) {
            console.error('Erro ao buscar detalhes do OEE da máquina do operador:', error);
            throw error;
        }
    }
}

export default UsuarioModel;