import UsuarioModel from '../models/UsuarioModel.js'
import EscalaTrabalhoModel from '../models/EscalaTrabalhoModel.js'
import SetorModel from '../models/SetorModel.js';
import MaquinaModel from '../models/MaquinaModel.js'
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';
import prisma from '../config/prisma.js';

class UsuarioController {

    //GET api/usuarios - Listar todos os funcionários (apenas admin)
    static async listarUsuarios(req, res) {
        try {

            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;

            const resultado = await UsuarioModel.listarTodos(id_empresa, paginacao, req.query.setorId);

            // Normaliza o retorno: a query é sobre escalaTrabalho (inclui operador, turno, setor)
            // O frontend espera: { id, nome, funcao, id_setor, id_turno, id_maquina, email, cpf, imagem_perfil }
            return res.status(200).json({
                sucesso: true,
                dados: resultado.dados || [],
                meta: resultado.meta
            });

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuários'
            });
        }
    }

    static async listarSemAdms(req, res){
        try {
            const id_empresa = req.user.id_empresa
            const dados = await UsuarioModel.listarSemAdms(id_empresa)
            return res.status(200).json({
                sucesso: true,
                dados: dados
            })
        } catch (error) {
             console.error('Erro ao listar usuários sem administradores:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuário sem administradores'
            });
        }
    }

    static async listarOperadoresporSetor(req,res){
        try {
            const id_empresa = req.user.id_empresa
            const id_setor = req.params.id_setor
            const dados = await UsuarioModel.listarOperadoresPorSetor(id_empresa, id_setor)
            return res.status(200).json({dados})
        } catch (error) {
              console.error('Erro ao listar operadores:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os operadores'
            });
        }
    }

    //GET api/usuarios/:id - busca de usuário por id (via params ou token)
    static async buscarPorId(req, res) {
        try {
            // Aceita id via params (rota /:id) ou fallback para o usuário logado
            const id_usuario = req.params.id ? parseInt(req.params.id) : req.user.id_usuario;
            const id_empresa = req.user.id_empresa;
            // Validação básica do ID
            if (!id_usuario || isNaN(id_usuario)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID de usuário inválido',
                    mensagem: 'O ID do usuário deve ser um número válido'
                });
            }

            // Busca dados básicos do usuário
            const usuario = await UsuarioModel.buscarPorId(id_usuario, id_empresa);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                })
            };

            // Busca também os dados de escala (setor, turno, máquina)
            const escala = await prisma.escalaTrabalho.findFirst({
                where: { id_operador: id_usuario, id_empresa },
                select: {
                    id_setor: true,
                    id_turno: true,
                    id_maquina: true
                }
            });

            return res.status(200).json({
                sucesso: true,
                dados: {
                    ...usuario,
                    funcao: usuario.tipo,
                    id_setor: escala?.id_setor ?? null,
                    id_turno: escala?.id_turno ?? null,
                    id_maquina: escala?.id_maquina ?? null
                }
            });

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o usuário'
            });
        }
    }

    //POST api/usuarios/criar - Criar novo usuário (apenas dmin)
    static async criarUsuario(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { nome, cpf, email, id_setor, id_turno, id_maquina } = req.body;
            const funcao = req.user.tipo === 'Gestor'
                ? 'Operador'
                : (String(req.body.funcao || '').trim().toLowerCase() === 'gestor' ? 'Gestor' : 'Operador');

            const erros = [];
            // Validar nome
            if (!nome || nome.trim() === '') {
                erros.push({
                    campo: 'nome',
                    mensagem: 'Nome é obrigatório'
                });
            } else {
                if (nome.trim().length < 3) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome deve ter pelo menos 3 caracteres'
                    });
                }

                if (nome.trim().length > 255) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome deve ter no máximo 255 caracteres'
                    });
                }
            }
            // Validar cpf
            if (!cpf || cpf.trim() === '') {
                erros.push({
                    campo: 'CPF',
                    mensagem: 'CPF é obrigatório'
                });
            }
            if (cpf.trim().length < 11) {
                erros.push({
                    campo: 'CPF',
                    mensagem: 'O CPF deve ter pelo menos 11 caracteres'
                });
            }

            //validar email 
            if (!email || email.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email da empresa é obrigatório',
                    mensagem: 'O email da empresa é obrigatório!'
                })
            };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            };

            //validação do setor
            if (!id_setor) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Setor é obrigatório',
                    mensagem: 'O setor é obrigatório!'
                })
            };

            //validação do turno
            if (funcao !== 'Gestor' && !id_turno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Turno é obrigatório',
                    mensagem: 'O turno é obrigatório!'
                })
            };
            //validação funcao
            if (!funcao || funcao.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Turno é obrigatório',
                    mensagem: 'O turno é obrigatório!'
                })
            };
            //validação maquina
            if (funcao === 'Operador' && !id_maquina) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Turno é obrigatório',
                    mensagem: 'O turno é obrigatório!'
                })
            };

            //preparar dados do usuario para tabela usuarios
            const dadosUsuario = {
                id_empresa: Number(id_empresa),
                nome: nome,
                tipo: funcao,
                cpf: cpf.trim(),
                email: email
            }

            // Adicionar imagem se foi enviada
            if (req.file) {
                dadosUsuario.imagem_perfil = req.file.filename;
            }

            //Registrar usuário na tabela Usuarios
            const usuarioId = await UsuarioModel.criarUsuario(dadosUsuario);
            if (!usuarioId || isNaN(usuarioId)) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Id do usuário não retornado',
                    mensagem: 'Id do usuário não retornado!'
                })
            }

            if (funcao === 'Gestor') {
                await SetorModel.associarGestor(Number(id_setor), usuarioId, Number(id_empresa));
            } else {
            //preparar dados de escala de trabalho para tabela escalaTrabalho
            const dadosEscala = {
                id_empresa: Number(id_empresa),
                id_operador: usuarioId,
                id_turno: Number(id_turno),
                id_setor: Number(id_setor),
                id_maquina: Number(id_maquina),
            }
            const registrarEscala = await EscalaTrabalhoModel.criar(dadosEscala)
            if (!registrarEscala) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Não foi possível registrar escala',
                    mensagem: 'Não foi possível registrar escala!'
                })
            }
            }

            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário criado com sucesso!',
            })
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o usuário'
            });
        }
    }

    //PUT api/usuarios
   // PUT /api/usuarios/:id
static async atualizarUsuario(req, res) {
    try {
        const id_empresa = req.user.id_empresa;
        const id_usuario = req.params.id;

        const {
            nome,
            cpf,
            email,
            id_setor,
            funcao,
            id_turno,
            id_maquina
        } = req.body;

        // validação
        if (!id_usuario || isNaN(id_usuario)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID inválido'
            });
        }

        // verifica usuário
        const usuarioExistente = await UsuarioModel.buscarPorId(
            id_usuario,
            id_empresa
        );

        if (!usuarioExistente) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado'
            });
        }

        // -------------------------
        // dados usuario
        // -------------------------

        const dadosUpdateUsuario = {};

        if (nome !== undefined)
            dadosUpdateUsuario.nome = nome;

        if (cpf !== undefined)
            dadosUpdateUsuario.cpf = cpf;

        if (email !== undefined)
            dadosUpdateUsuario.email = email;

        if (funcao !== undefined)
            dadosUpdateUsuario.tipo = funcao;

        // imagem
        if (req.file) {

            if (usuarioExistente.imagem_perfil) {
                await removerArquivoAntigo(
                    usuarioExistente.imagem_perfil,
                    'imagem'
                );
            }

            dadosUpdateUsuario.imagem_perfil = req.file.filename;
        }

        // atualiza usuário
        const usuarioAtualizado =
            await UsuarioModel.atualizar(
                id_usuario,
                id_empresa,
                dadosUpdateUsuario
            );

        // -------------------------
        // operador
        // -------------------------

        if (funcao === "Operador") {

            const dadosEscala = {};

            if (id_setor !== undefined && id_setor !== '') {
                dadosEscala.id_setor = id_setor;
            }

            if (id_turno !== undefined && id_turno !== '') {
                dadosEscala.id_turno = id_turno;
            }

            if (id_maquina !== undefined && id_maquina !== '') {
                dadosEscala.id_maquina = id_maquina;
            }

            await EscalaTrabalhoModel.atualizar(
                id_usuario,
                id_empresa,
                dadosEscala
            );
        }

        // -------------------------
        // gestor
        // -------------------------

        if (funcao === "Gestor" && id_setor) {

            await EscalaTrabalhoModel.atualizarSetorGestor(
                id_usuario,
                id_empresa,
                id_setor
            );
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Usuário atualizado com sucesso',
            dados: usuarioAtualizado
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar usuário'
        });
    }
}

    //DELETE api/usuarios/:id/deletar - Excluir funcionario 
    static async deletarUsuario(req, res) {
        try {
            const id_usuario = req.params.id
            const id_empresa = req.user.id_empresa;

            // Validação do ID
            if (!id_usuario || isNaN(id_usuario)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            //verificar se usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id_usuario, id_empresa);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id_usuario} não foi encontrado`
                });
            }

            // Remover imagem do produto se existir
            if (usuarioExistente.imagem_perfil) {
                await removerArquivoAntigo(usuarioExistente.imagem_perfil, 'imagem');
            }

            const resultado = await UsuarioModel.deletar(id_usuario, id_empresa);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });

        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível usuário o produto'
            });
        }
    }

    // POST /usuario/upload - Upload de imagem para usuarios
    static async uploadImagem(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { id_usuario } = req.body;

            // Validação do ID
            if (!id_usuario || isNaN(id_usuario)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            //verificar se usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id_usuario, id_empresa);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id_usuario} não foi encontrado`
                });
            }

            // Remover imagem antiga se existir
            if (usuarioExistente.imagem_perfil) {
                await removerArquivoAntigo(usuarioExistente.imagem_perfil, 'imagem');
            }

            // Atualizar produto com a nova imagem
            await UsuarioModel.atualizar(id, { imagem_perfil: req.file.filename });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Imagem enviada com sucesso',
                dados: {
                    nomeArquivo: req.file.filename,
                    caminho: `/uploads/imagens/${req.file.filename}`
                }
            });
        } catch (error) {
            console.error('Erro ao fazer upload de imagem:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível fazer upload da imagem'
            });
        }
    }

    static async listarApontamentosUsuario(req, res) {
        try {
            const id_usuario = Number(req.params.id);
            const id_empresa = req.user.id_empresa;

            if (!id_usuario || isNaN(id_usuario)) {
                return res.status(400).json({ sucesso: false, erro: 'ID de usuÃ¡rio invÃ¡lido' });
            }

            const dados = await UsuarioModel.listarApontamentosUsuario(id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar apontamentos do usuÃ¡rio:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    // --------------------------------------------dashboards-----------------------------------------------------------------------------------------

    static async qtdDeUsuariosTipo(req, res) {
        try {
            const dados = await UsuarioModel.qtdPorTipo(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({
                sucesso: true,
                dados
            })
        } catch (error) {
            console.error('Erro no gráfico Quantidade de Usuários por tipo:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async tempoMedioSessaoTipo(req, res) {
        try {
            const dados = await UsuarioModel.tempoMedioSessaoPorTipo(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Tempo Médio de Sessão por Perfil:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async qtdUsuariosPorSetor(req, res) {
        try {
            const dados = await UsuarioModel.qtdPorSetor(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Quantidade de Usuários por Setor:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async top5Operadores(req, res) {
        try {
            const dados = await UsuarioModel.top5Operadores(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Top 5 Operadores Com Mais Peças Produzidas:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async producaoMediaPorDiaSetor(req, res) {
        try {
            const dados = await UsuarioModel.producaoMediaPorDiaSetor(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Produção Média de Usuário Por Dia Por Setor:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async rotatividade(req, res) {
        try {
            const dados = await UsuarioModel.rotatividade(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Rotatividade De Usuários:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async metaProducaoPorSetor(req, res){
        try {
             const dados = await UsuarioModel.metaProducaoPorSetor(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
               console.error('Erro no gráfico Meta de Produção por Setor:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // ------------------------------------Dashboard da página específica de usuário----------------------------------------------------------------

    static async turnosOperadores(req, res) {
        try {
            const dados = await UsuarioModel.turnosOperadores(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no grafico Operadores por turno:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async taxaRefugo(req, res) {
        try {
            const dados = await UsuarioModel.taxaRefugo(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no grafico Taxa de refugo por usuario:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async producaoMediaPorUsuario(req, res) {
        try {
            const dados = await UsuarioModel.producaoMediaPorUsuario(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no grafico Producao media por usuario:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async metaProducao(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.body.id_usuario || req.user.id_usuario;
            const id_empresa = req.user.id_empresa
            const id_maquina = await MaquinaModel.obterMaquinaOperador(id_empresa, id_usuario)
            const dados = await UsuarioModel.metaProducao(id_empresa, id_usuario, id_maquina)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Meta de Produção', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async tempoParadoTempoProduzindoUsuario(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) ;
            const id_empresa = req.user.id_empresa
            const id_maquina = await MaquinaModel.obterMaquinaOperador(id_empresa, id_usuario)
            const dados = await UsuarioModel.tempoParadoTempoProduzindoUsuario(id_empresa, id_usuario, id_maquina)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Tempo Total Parado x Tempo total Produzindo da máquina do operador', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // --------------- Operador --------------------- //
    static async getProducaoPorHora(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) ;
            const dados = await UsuarioModel.producaoPorHoraOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar produção por hora' });
        }
    }

    static async getProdutividadeDia(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.user.id_usuario;
            const dados = await UsuarioModel.produtividadeDiaOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar produtividade do dia' });
        }
    }

    static async getQualidade(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.user.id_usuario;
            const dados = await UsuarioModel.qualidadeOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar qualidade' });
        }
    }

    static async getVelocimetro(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.user.id_usuario;
            const dados = await UsuarioModel.velocimetroOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar velocímetro' });
        }
    }

    static async getPecasPorDia(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.user.id_usuario;
            const dados = await UsuarioModel.pecasPorDiaOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar peças por dia' });
        }
    }

    static async getOEE(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.user.id_usuario;
            const dados = await UsuarioModel.oeeOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar OEE do operador' });
        }
    }

    static async getOEEMaquina(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.user.id_usuario;
            const dados = await UsuarioModel.oeeMaquinaOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar OEE da máquina' });
        }
    }

    static async getOEEMaquinaDetalhes(req, res) {
        try {
            const id_usuario = parseInt(req.params.id) || req.user.id_usuario;
            const dados = await UsuarioModel.oeeMaquinaDetalhesOperador(req.user.id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar detalhes do OEE da máquina' });
        }
    }

}
export default UsuarioController
