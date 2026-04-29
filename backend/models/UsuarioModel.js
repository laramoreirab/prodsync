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
                    id_usuario: id
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
            const ids = resultado.map(r => r.id_operador)
            const usuarios = await prisma.usuarios.findMany({
                where: { id_usuario: { in: ids } },
                select: { id_usuario: true, nome: true }
            })

            const nomeUsuario = Object.fromEntries(
                usuarios.map(u => [u.id_usuario, u.nome])
            )

            return resultado.map(r => ({
                nome: nomeUsuario[r.id_operador] ?? 'Desconhecido',
                total: (r._sum.qtd_boa ?? 0) + (r._sum.qtd_refugo ?? 0)
            }))

        } catch (error) {
            console.error('Erro ao classificar top 5 operadores com mais peças produzidas no banco de dados:', error);
            throw error;
        }
    }
    static async producaoMediaPorDiaSetor(id_empresa) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: { id_empresa },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    data_hora_inicio: true,
                    maquina: {
                        select: {
                            setor: { select: { nome_setor: true } }
                        }
                    }
                }
            })

            const producaoPorSetorDia = {}

            for (const ap of apontamentos) {
                const nomeSetor = ap.maquina?.setor?.nome_setor ?? 'Sem setor'
                const dia = ap.data_hora_inicio.toISOString().split('T')[0]
                const total = (ap.qtd_boa ?? 0) + (ap.qtd_refugo ?? 0)

                if (!producaoPorSetorDia[nomeSetor]) producaoPorSetorDia[nomeSetor] = {}
                if (!producaoPorSetorDia[nomeSetor][dia]) producaoPorSetorDia[nomeSetor][dia] = 0

                producaoPorSetorDia[nomeSetor][dia] += total
            }

            return Object.entries(producaoPorSetorDia).map(([setor, dias]) => {
                const valores = Object.values(dias)
                const mediaDiaria = Math.round(
                    valores.reduce((a, b) => a + b, 0) / valores.length
                )
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

    static async metaProducao() {
        try {
            const ordensDaMaquina =  await prisma.ordemProducao.findMany(
                
            )
        } catch (error) {

        }
    }

    static async paradasJustificadasENaoJustificadasUsuario(){
        try {
            
        } catch (error) {
            
        }
    }


}
export default UsuarioModel
