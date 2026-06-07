import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';
import bcrypt from 'bcrypt'
import { gerarIdUsuario } from '../dev-utils/gerarIdUsuario.js';
import MaquinaModel from './MaquinaModel.js';

class UsuarioModel {
    //Listar todos os usuários com paginacção
    static async listarTodos(id_empresa, paginacao, setorId = null) {
        try {
            const regrasDaBusca = {
                where: {
                    id_empresa,
                    tipo: { in: ['Gestor', 'Operador'] },
                    ...(setorId ? {
                        OR: [
                            { escalas: { some: { id_setor: Number(setorId) } } },
                            { setores_geridos: { some: { id_setor: Number(setorId) } } }
                        ]
                    } : {}) // exclui Adm da listagem
                },
                select: {
                    id_usuario: true,
                    nome: true,
                    tipo: true,
                    cpf: true,
                    email: true,
                    imagem_perfil: true,
                    escalas: {
                        select: {
                            id_turno: true,
                            id_setor: true,
                            id_maquina: true,
                            turno: { select: { nome_turno: true } },
                            setor: { select: { nome_setor: true } },
                            maquina: { select: { nome: true, serie: true } }
                        },
                        take: 1
                    },
                    setores_geridos: {
                        select: {
                            id_setor: true,
                            setor: { select: { nome_setor: true } }
                        },
                        take: 1
                    }
                },
                orderBy: { id_usuario: 'asc' }
            }

            const resultadoPaginado = await paginarPrisma(
                prisma.usuarios,
                regrasDaBusca,
                paginacao
            )

            return {
                ...resultadoPaginado,
                dados: resultadoPaginado.dados.map(u => ({
                    id: u.id_usuario,
                    id_usuario: u.id_usuario,
                    nome: u.nome,
                    email: u.email,
                    cpf: u.cpf,
                    funcao: u.tipo,
                    id_setor: u.escalas[0]?.id_setor ?? u.setores_geridos[0]?.id_setor ?? null,
                    id_turno: u.escalas[0]?.id_turno ?? null,
                    id_maquina: u.escalas[0]?.id_maquina ?? null,
                    setor: u.escalas[0]?.setor?.nome_setor ?? u.setores_geridos[0]?.setor?.nome_setor ?? 'Sem setor',
                    turno: u.escalas[0]?.turno?.nome_turno ?? 'Sem turno',
                    maquina: u.escalas[0]?.maquina?.serie ?? u.escalas[0]?.maquina?.nome ?? 'Sem maquina',
                    imagem_perfil: u.imagem_perfil
                }))
            }

        } catch (error) {
            console.error('Erro ao listar usuários:', error)
            throw error
        }
    }

    static async listarSemAdms(id_empresa) {
        try {
            const resposta = await prisma.usuarios.findMany({
                where: {
                    id_empresa: id_empresa,
                    tipo: {
                        not: 'Adm'
                    }
                },
                select: {
                    id_usuario: true,
                    nome: true,
                    tipo: true,
                }
            })
            return resposta
        } catch (error) {
            console.error('Erro ao listar usuários sem administradores no banco:', error);
            throw error;
        }
    }

    static async listarOperadoresPorSetor(id_empresa, id_setor) {
        try {
            const operadores = await prisma.escalaTrabalho.findMany({
                where: {
                    id_empresa: id_empresa,
                    id_setor: Number(id_setor)
                },

                select: {
                    id_operador: true,

                    operador: {
                        select: {
                            nome: true
                        }
                    }
                }
            });
            const lista = operadores.map(item => ({
                id_operador: item.id_operador,
                nome: item.operador.nome
            }));
            return lista
        } catch (error) {
            console.error('Erro ao listar operadores:', error);
            throw error;
        }
    }

    //buscar usuario por id
    static async buscarPorId(id, id_empresa) {
        try {
            const row = await prisma.usuarios.findFirst({
                where: {
                    id_usuario: parseInt(id),
                    ...(id_empresa ? { id_empresa: parseInt(id_empresa) } : {})
                },
                include: {
                    escalas: {
                        include: {
                            setor: { select: { id_setor: true, nome_setor: true } },
                            turno: true,
                            maquina: true
                        }
                    },
                    setores_geridos: {
                        include: {
                            setor: { select: { id_setor: true, nome_setor: true, localizacao: true } }
                        }
                    }
                }
            });
            if (!row) return null;

            const escala = row.escalas?.[0];
            const setorGerido = row.setores_geridos?.[0];
            return {
                ...row,
                funcao: row.tipo,
                id_setor: escala?.id_setor ?? setorGerido?.id_setor ?? null,
                setor: escala?.setor ?? setorGerido?.setor ?? null,
                id_turno: escala?.id_turno ?? null,
                turno: escala?.turno ?? null,
                id_maquina: escala?.id_maquina ?? null,
                maquina: escala?.maquina ?? null
            };
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
                        ...dados,
                        id_usuario: dados.id_usuario ?? gerarIdUsuario(dados.tipo),
                        senha: ""
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
        const idUsuario = Number(id);
        if (!Number.isInteger(idUsuario)) {
            return null;
        }

        try {
            const usuario = await prisma.usuarios.findUnique({
                where: {
                    id_usuario: idUsuario
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

    static async obterPerfil(id_usuario, id_empresa, tipo) {
        try {
            if (tipo === 'Adm') {
                const resultado = await prisma.empresas.findFirst({
                    where: {
                        id_empresa: Number(id_empresa),
                    },
                    include: {
                        usuarios: {
                            where: {
                                id_usuario: Number(id_usuario) 
                            },
                            select: {
                                id_usuario: true,
                                imagem_perfil: true
                            }

                        }
                    }
                });

                return resultado
            }
            if (tipo === 'Gestor' || tipo === 'Operador') {
                return await this.buscarPorId(id_usuario, id_empresa);
            }
        } catch (error) {
            console.error('Erro ao obter perfil do usuário:', error);
            throw error;
        }
    }

    //verificar se o id ainda não possui senha cadastrada
    static async verificaSenhaUsuario(id) {
        try {
            const usuarioSenha = await prisma.usuarios.findUnique({
                where: { id_usuario: Number(id) },
                select: { senha: true }
            });

            return !!(usuarioSenha?.senha && usuarioSenha.senha.trim() !== "");
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
                    id_usuario: Number(id),
                    id_empresa: Number(id_empresa)
                },
                data: { ...dados }
            })
            if (row.count === 0) return null

            return await prisma.usuarios.findFirst({
                where: {
                    id_usuario: Number(id),
                    id_empresa: Number(id_empresa)
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
                    id_usuario: Number(id),
                    id_empresa: Number(id_empresa)
                },
            });
            return deletarUser
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw error;
        }
    }

    static async trocarSenha(id_usuario,id_empresa, senhaAtual, novaSenha) {
        try{
            const senhaAtualBanco = await prisma.usuarios.findUnique({
                where:{
                    id_usuario: id_usuario
                },
                select:{
                    senha: true
                }
            })

            const verificarSenhas = await bcrypt.compare(senhaAtual, senhaAtualBanco.senha);
            if (!verificarSenhas) {
                return null
            }

            const senhaHash = await bcrypt.hash(novaSenha, 10);

            const resultado = await prisma.usuarios.update({
                where : {
                    id_empresa: id_empresa,
                    id_usuario: id_usuario
                },
                data:{
                    senha: senhaHash
                }
            })
            return resultado
        }catch(error){
            console.error('Erro ao trocar senha do usuário:', error);
            throw error;
        }
    }

    static async atualizarEmpresa(id_empresa, dadosEmpresa){
        try {
            const resposta = await prisma.empresas.update({
                where:{
                    id_empresa: Number(id_empresa)
                },
                data:{
                    ...dadosEmpresa
                }
            })

            return resposta
            
        } catch (error) {
            console.error('Erro atualizar dados da empresa', error);
            throw error;
        }
    }

    static async cadastrarLote(dados){
        try {
            const resultado = await prisma.usuarios.createMany({
                data: dados,
                skipDuplicates: true, // Impede que a query quebre caso um CPF já exista
            });
            return resultado.count
        } catch (error) {
            console.error('Erro cadastrar lote csv de usuários no banco de dados', error);
            throw error;
        }
    }

    // -------------------------------------------------Dashboards-------------------------------------------------

    static filtroSetorUsuario(setorId) {
        return setorId ? {
            OR: [
                { escalas: { some: { id_setor: Number(setorId) } } },
                { setores_geridos: { some: { id_setor: Number(setorId) } } }
            ]
        } : {};
    }

    static async qtdPorTipo(id_empresa, setorId = null) {
        try {
            const resultado = await prisma.usuarios.groupBy({
                by: ['tipo'],
                where: { id_empresa, ...this.filtroSetorUsuario(setorId) },
                _count: { tipo: true }
            })

            return resultado.map(r => ({
                name: r.tipo,
                value: r._count.tipo
            }))
        } catch (error) {
            console.error('Erro ao contar e agrupar usuários por tipo no banco de dados:', error);
            throw error;
        }
    }

    static async tempoMedioSessaoPorTipo(id_empresa, setorId = null) {
        try {
            const limiteInatividadeMinutos = 30;

            const usuarios = await prisma.usuarios.findMany({
                where: { id_empresa, ...this.filtroSetorUsuario(setorId) },
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

                // Divide sessoes por intervalos de inatividade entre logs.
                let inicioSessao = null;
                let ultimoLog = null;

                const registrarSessao = () => {
                    if (!inicioSessao || !ultimoLog) return;

                    const minutos = Math.round((ultimoLog - inicioSessao) / 1000 / 60);
                    if (minutos > 0) sessoesPorTipo[usuario.tipo].push(minutos);
                };

                for (const log of usuario.logs) {
                    const horarioLog = new Date(log.criado_em);

                    if (!inicioSessao) {
                        inicioSessao = horarioLog;
                        ultimoLog = horarioLog;
                        continue;
                    }

                    const intervaloMinutos = (horarioLog - ultimoLog) / 1000 / 60;

                    if (intervaloMinutos > limiteInatividadeMinutos) {
                        registrarSessao();
                        inicioSessao = horarioLog;
                    }

                    ultimoLog = horarioLog;
                }

                registrarSessao();
            }

            return Object.entries(sessoesPorTipo).map(([tipo, sessoes]) => {
                const media = sessoes.length > 0
                    ? Math.round(sessoes.reduce((a, b) => a + b, 0) / sessoes.length)
                    : 0
                const horas = Math.floor(media / 60).toString().padStart(2, '0')
                const minutos = (media % 60).toString().padStart(2, '0')

                return {
                    perfil: tipo,
                    minutos: media,
                    label: `${horas}:${minutos} h`,
                    setorId: setorId ? Number(setorId) : undefined
                }
            })
        } catch (error) {
            console.error('Erro ao contar tempo médio de sessão por perfil no banco de dados:', error);
            throw error;
        }
    }

    static async qtdPorSetor(id_empresa) {
        try {
            const qtdOperadores = await prisma.escalaTrabalho.groupBy({
                by: ['id_setor'],
                where: { id_empresa },
                _count: { id_operador: true }
            })

            const qtdGestores = await prisma.setor_Gestor.groupBy({
                by: ['id_setor'],
                where: { id_empresa },
                _count: { id_gestor: true }
            })

            // 1. Buscamos os setores primeiro para ter a lista real de setores e seus nomes
            const setores = await prisma.setores.findMany({
                where: { id_empresa },
                select: { id_setor: true, nome_setor: true }
            })

            // 2. Criamos mapas para busca rápida (O(1)) dos contadores
            const mapOperadores = Object.fromEntries(qtdOperadores.map(o => [o.id_setor, o._count.id_operador]))
            const mapGestores = Object.fromEntries(qtdGestores.map(g => [g.id_setor, g._count.id_gestor]))

            // 3. Montamos o resultado final baseando-se nos setores reais da empresa
            const resultado = setores.map(setor => {
                const totalOperadores = mapOperadores[setor.id_setor] || 0;
                const totalGestores = mapGestores[setor.id_setor] || 0;

                return {
                    setor: setor.nome_setor,
                    qtd: totalGestores + totalOperadores
                }
            })

            return resultado.sort((a, b) => b.qtd - a.qtd)

        } catch (error) {
            console.error('Erro ao contar quantidade de usuários por setor no banco de dados:', error);
            throw error;
        }
    }

    static async top5Operadores(id_empresa, setorId = null) {
        try {
            const resultado = await prisma.apontamento.groupBy({
                by: ['id_operador'],
                where: { id_empresa, ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}) },
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

    static async producaoMediaPorDiaSetor(id_empresa, setorId = null) {
        try {
            const setores = await prisma.setores.findMany({
                where: {
                    id_empresa: Number(id_empresa), // Proteção de tipo para o Prisma
                    ...(setorId ? { id_setor: Number(setorId) } : {})
                },
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
            });

            const resultado = setores.map(s => {
                const nomeSetor = s.nome_setor;
                const apontamentos = s.maquinas.flatMap(m => m.apontamentos);

                const porDia = {};
                apontamentos.forEach(ap => {
                    // Extrai apenas a data (YYYY-MM-DD)
                    const dia = ap.data_hora_inicio.toISOString().split('T')[0];
                    porDia[dia] = (porDia[dia] || 0) + ap.qtd_boa;
                });

                const valores = Object.values(porDia);
                const mediaDiaria = valores.length > 0
                    ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
                    : 0;

                return {
                    setor: nomeSetor,
                    media: mediaDiaria
                };
            });

            // Ordena do setor com maior média para o menor
            return resultado.sort((a, b) => b.media - a.media);

        } catch (error) {
            console.error('Erro ao calcular produção média por setor:', error);
            throw error;
        }
    }

    static async rotatividade(id_empresa, setorId = null) {
        try {
            // busca ids dos usuários da empresa para filtrar os logs
            const usuarios = await prisma.usuarios.findMany({
                where: { id_empresa, ...this.filtroSetorUsuario(setorId) },
                select: { id_usuario: true }
            })
            const ids = usuarios.map(u => u.id_usuario)

            const [logsNovos, logsDesligados] = await Promise.all([
                // log de criação — POST /api/usuarios com status 201
                prisma.logs.findMany({
                    where: {
                        usuario_id: { in: ids },
                        metodo: 'POST',
                        rota: '/api/usuarios/',
                        status_code: 201
                    },
                    select: { criado_em: true }
                }),
                // log de deleção — DELETE /api/usuarios com status 200
                prisma.logs.findMany({
                    where: {
                        usuario_id: { in: ids },
                        metodo: 'DELETE',
                        rota: '/api/usuarios/',
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
    static async metaProducaoPorSetor(id_empresa, setorId = null) {
        try {
            // 1. Buscamos todos os apontamentos da empresa, trazendo o setor da máquina
            const apontamentos = await prisma.apontamento.findMany({
                where: { id_empresa, ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {}) },
                select: {
                    qtd_boa: true,
                    ordem_producao: {
                        select: {
                            qtd_planejada: true
                        }
                    },
                    maquina: {
                        select: {
                            setor: {
                                select: {
                                    nome_setor: true
                                }
                            }
                        }
                    }
                }
            });

            // 2. Agrupamos os dados por setor usando um Map
            const consolidadoPorSetor = new Map();

            for (const ap of apontamentos) {
                const nomeSetor = ap.maquina?.setor?.nome_setor ?? "Sem Setor";

                const dadosAtuais = consolidadoPorSetor.get(nomeSetor) ?? {
                    produzido: 0,
                    planejado: 0
                };

                dadosAtuais.produzido += ap.qtd_boa ?? 0;
                // Somamos o planejado da ordem vinculada a este apontamento
                dadosAtuais.planejado += ap.ordem_producao?.qtd_planejada ?? 0;

                consolidadoPorSetor.set(nomeSetor, dadosAtuais);
            }

            // 3. Transformamos o Map no formato final ({ setor, media })
            return Array.from(consolidadoPorSetor.entries()).map(([setor, dados]) => {
                const porcentagemAtingida = dados.planejado > 0
                    ? Number(((dados.produzido / dados.planejado) * 100).toFixed(1))
                    : 0;

                return {
                    setor: String(setor),
                    media: porcentagemAtingida
                };
            });

        } catch (error) {
            console.error('Erro ao calcular meta de produção por setor:', error);
            throw error;
        }
    }

    // ------------------------------------------------------Dashboard da página específica de usuário-------------------------------------------------------------

    static async turnosOperadores(id_empresa, setorId = null) {
        const where = {
            id_empresa: Number(id_empresa),
            ...(setorId ? { id_setor: Number(setorId) } : {})
        };

        const resultado = await prisma.escalaTrabalho.groupBy({
            by: ['id_turno', 'id_setor'],
            where,
            _count: { id_operador: true }
        });

        const turnos = await prisma.turno.findMany({
            where: { id_empresa: Number(id_empresa) },
            select: { id_turno: true, nome_turno: true }
        });
        const nomes = Object.fromEntries(turnos.map(t => [t.id_turno, t.nome_turno]));

        return resultado.map(item => ({
            turno: nomes[item.id_turno] ?? `Turno ${item.id_turno}`,
            value: item._count.id_operador,
            setorId: item.id_setor
        }));
    }

    static async taxaRefugo(id_empresa, setorId = null) {
        const resultado = await prisma.apontamento.groupBy({
            by: ['id_operador'],
            where: {
                id_empresa: Number(id_empresa),
                ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {})
            },
            _sum: { qtd_boa: true, qtd_refugo: true },
            orderBy: { _sum: { qtd_refugo: 'desc' } },
            take: 8
        });

        const ids = resultado.map(r => r.id_operador);
        const usuarios = await prisma.usuarios.findMany({
            where: { id_empresa: Number(id_empresa), id_usuario: { in: ids } },
            select: { id_usuario: true, nome: true }
        });
        const nomes = Object.fromEntries(usuarios.map(u => [u.id_usuario, u.nome]));

        return resultado.map(item => {
            const boas = item._sum.qtd_boa ?? 0;
            const refugo = item._sum.qtd_refugo ?? 0;
            const total = boas + refugo;

            return {
                operador: nomes[item.id_operador] ?? `Usuario ${item.id_operador}`,
                taxa: total > 0 ? Number(((refugo / total) * 100).toFixed(1)) : 0,
                setorId: setorId ? Number(setorId) : undefined
            };
        });
    }

    static async producaoMediaPorUsuario(id_empresa, setorId = null) {
        const apontamentos = await prisma.apontamento.findMany({
            where: {
                id_empresa: Number(id_empresa),
                ...(setorId ? { maquina: { id_setor: Number(setorId) } } : {})
            },
            select: {
                id_operador: true,
                qtd_boa: true,
                data_hora_inicio: true,
                operador: { select: { nome: true } },
                maquina: { select: { id_setor: true } }
            }
        });

        const porUsuario = new Map();
        for (const ap of apontamentos) {
            const dia = ap.data_hora_inicio.toISOString().slice(0, 10);
            const atual = porUsuario.get(ap.id_operador) ?? {
                usuario: ap.operador?.nome ?? `Usuario ${ap.id_operador}`,
                total: 0,
                dias: new Set(),
                setorId: ap.maquina?.id_setor
            };
            atual.total += ap.qtd_boa ?? 0;
            atual.dias.add(dia);
            porUsuario.set(ap.id_operador, atual);
        }

        return Array.from(porUsuario.values())
            .map(item => ({
                usuario: item.usuario,
                media: item.dias.size > 0 ? Math.round(item.total / item.dias.size) : 0,
                setorId: item.setorId
            }))
            .sort((a, b) => b.media - a.media)
            .slice(0, 8);
    }

    static async metaProducao(id_empresa, id_usuario, id_maquina) {
        try {
            const maquinaId = Number(id_maquina) || await this.obterMaquinaAtualOperador(id_empresa, id_usuario)
            if (!maquinaId) return { completo: 0, restante: 100 }

            const ultimaOrdem = await prisma.apontamento.findFirst({
                where: {
                    id_empresa,
                    id_operador: Number(id_usuario),
                    id_maquina: maquinaId,
                },
                orderBy: {
                    data_hora_fim: "desc"
                },
                select: {
                    id_ordemProducao: true
                }
            })

            if (!ultimaOrdem) return { completo: 0, restante: 100 }

            const totais = await prisma.apontamento.aggregate({
                where: {
                    id_empresa,
                    id_operador: Number(id_usuario),
                    id_maquina: maquinaId,
                    id_ordemProducao: ultimaOrdem.id_ordemProducao
                },
                _sum: { qtd_boa: true }
            })

            const metaTotal = await prisma.ordemProducao.findFirst({
                where: {
                    id_ordem: ultimaOrdem.id_ordemProducao,
                    id_empresa: id_empresa
                },
                select: {
                    qtd_planejada: true
                }
            })

            const planejado = metaTotal?.qtd_planejada ?? 0
            const produzido = totais._sum.qtd_boa ?? 0
            const completo = planejado > 0 ? Math.min(100, Number(((produzido / planejado) * 100).toFixed(1))) : 0

            return { completo, restante: Number((100 - completo).toFixed(1)) }

        } catch (error) {
            console.error('Erro ao retornar meta de produção alcançada no banco de dados:', error);
            throw error;
        }
    }

    static async tempoParadoTempoProduzindoUsuario(id_empresa, id_usuario, id_maquina) {
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

            const maquinaId = Number(id_maquina) || await this.obterMaquinaAtualOperador(id_empresa, id_usuario)
            if (!maquinaId) return []

            const { inicio, fim } = semanaAtual()
            const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']


            // busca apontamentos da semana — tempo produzido
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    id_maquina: maquinaId,
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
                    id_maquina: maquinaId,
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

                const dia = diasSemana[new Date(ap.data_hora_inicio).getDay()]
                const minutos = (new Date(ap.data_hora_fim) - new Date(ap.data_hora_inicio)) / 1000 / 60

                if (!agrupado[dia]) agrupado[dia] = { dia, produzindo: 0, parada: 0 }
                agrupado[dia].produzindo += Math.round(minutos)
            }

            for (const parada of paradas) {
                const dia = diasSemana[new Date(parada.inicio).getDay()]

                if (!agrupado[dia]) agrupado[dia] = { dia, produzindo: 0, parada: 0 }
                agrupado[dia].parada += parada.duracao
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

    static async obterMaquinaAtualOperador(id_empresa, id_usuario) {
        const escala = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa: Number(id_empresa),
                id_operador: Number(id_usuario),
                id_maquina: { not: null }
            },
            select: { id_maquina: true }
        });

        return escala?.id_maquina ?? null;
    }

    static async listarApontamentosUsuario(id_empresa, id_usuario) {
        const apontamentos = await prisma.apontamento.findMany({
            where: {
                id_empresa: Number(id_empresa),
                id_operador: Number(id_usuario)
            },
            orderBy: { data_hora_inicio: 'desc' },
            include: {
                ordem_producao: { select: { id_ordem: true, codigo_lote: true } }
            }
        });

        return apontamentos.map(ap => ({
            id: ap.id_apontamento,
            op: ap.ordem_producao?.codigo_lote || String(ap.id_ordemProducao),
            id_ordem: ap.ordem_producao?.id_ordem ?? ap.id_ordemProducao,
            inicio: ap.data_hora_inicio,
            fim: ap.data_hora_fim,
            data: `${ap.data_hora_inicio.toLocaleDateString('pt-BR')} (${ap.data_hora_inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${ap.data_hora_fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})`,
            produzido: String(ap.qtd_boa ?? 0),
            refugo: String(ap.qtd_refugo ?? 0),
            observacao: ap.observacao || '-'
        }));
    }

    static async listarHistoricoEventosUsuario(id_empresa, id_usuario, limite = 50) {
        const id_maquina = await this.obterMaquinaAtualOperador(id_empresa, id_usuario);
        if (!id_maquina) return [];

        const historico = await MaquinaModel.obterHistoricoEventosTabela(
            id_maquina,
            Number(id_empresa),
            limite
        );

        return historico.filter((item) => item.tipo !== 'Producao');
    }

    static criarMapaSemana() {
        const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        const hoje = new Date();
        const mapa = new Map();

        for (let i = 6; i >= 0; i--) {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() - i);
            data.setHours(0, 0, 0, 0);
            mapa.set(data.toISOString().slice(0, 10), { dia: dias[data.getDay()], qtd: 0 });
        }

        return mapa;
    }

    static async pecasPorDiaOperador(id_empresa, id_usuario) {
        const mapa = this.criarMapaSemana();
        const inicio = new Date([...mapa.keys()][0] + 'T00:00:00');

        const apontamentos = await prisma.apontamento.findMany({
            where: {
                id_empresa: Number(id_empresa),
                id_operador: Number(id_usuario),
                data_hora_inicio: { gte: inicio }
            },
            select: { data_hora_inicio: true, qtd_boa: true, qtd_refugo: true }
        });

        for (const ap of apontamentos) {
            const chave = ap.data_hora_inicio.toISOString().slice(0, 10);
            const item = mapa.get(chave);
            if (item) item.qtd += (ap.qtd_boa ?? 0) + (ap.qtd_refugo ?? 0);
        }

        return [...mapa.values()];
    }

    static async producaoPorHoraOperador(id_empresa, id_usuario) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const apontamentos = await prisma.apontamento.findMany({
            where: {
                id_empresa: Number(id_empresa),
                id_operador: Number(id_usuario),
                data_hora_inicio: { gte: hoje }
            },
            select: { data_hora_inicio: true, qtd_boa: true, qtd_refugo: true }
        });

        const horas = new Map(Array.from({ length: 24 }, (_, hora) => [`${String(hora).padStart(2, '0')}:00`, { hora: `${String(hora).padStart(2, '0')}:00`, qtd: 0 }]));

        for (const ap of apontamentos) {
            const chave = `${String(ap.data_hora_inicio.getHours()).padStart(2, '0')}:00`;
            const item = horas.get(chave);
            if (item) item.qtd += (ap.qtd_boa ?? 0) + (ap.qtd_refugo ?? 0);
        }

        return [...horas.values()].filter(item => item.qtd > 0);
    }

    static async produtividadeDiaOperador(id_empresa, id_usuario) {
        const meta = await this.metaProducao(id_empresa, id_usuario);
        return { produzido: meta.completo, meta: meta.restante };
    }

    static async qualidadeOperador(id_empresa, id_usuario) {
        const totais = await prisma.apontamento.aggregate({
            where: {
                id_empresa: Number(id_empresa),
                id_operador: Number(id_usuario)
            },
            _sum: { qtd_boa: true, qtd_refugo: true }
        });

        const boas = totais._sum.qtd_boa ?? 0;
        const refugo = totais._sum.qtd_refugo ?? 0;
        const total = boas + refugo;

        return {
            pecasBoas: total > 0 ? Number(((boas / total) * 100).toFixed(1)) : 0,
            refugo: total > 0 ? Number(((refugo / total) * 100).toFixed(1)) : 0
        };
    }

    static async velocimetroOperador(id_empresa, id_usuario) {
        const maquinaId = await this.obterMaquinaAtualOperador(id_empresa, id_usuario);
        if (!maquinaId) return { atual: 0, ideal: 0 };

        const ultimo = await prisma.apontamento.findFirst({
            where: { id_empresa: Number(id_empresa), id_operador: Number(id_usuario), id_maquina: maquinaId },
            orderBy: { data_hora_fim: 'desc' }
        });

        if (!ultimo) return { atual: 0, ideal: 0 };

        const minutos = (new Date(ultimo.data_hora_fim) - new Date(ultimo.data_hora_inicio)) / 1000 / 60;
        const atual = minutos > 0 ? Number((((ultimo.qtd_boa ?? 0) + (ultimo.qtd_refugo ?? 0)) / minutos).toFixed(1)) : 0;

        return { atual, ideal: Math.max(atual, 1) };
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
                select: {
                    id_maquina: true,
                    maquina: {
                        select: { nome: true, status_atual: true }
                    }
                }
            });

            if (!escala?.id_maquina) return null;

            const OEEModel = (await import('./OEEModel.js')).default;
            const oee = await OEEModel.obterOeeMaquina(escala.id_maquina, id_empresa);

            return {
                ...oee,
                nome_maquina: escala.maquina?.nome ?? 'Máquina',
                status: escala.maquina?.status_atual === 'Produzindo' ? 'Produzindo' : 'Parada'
            };
        } catch (error) {
            console.error('Erro ao buscar detalhes do OEE da máquina do operador:', error);
            throw error;
        }
    }
}

export default UsuarioModel;
