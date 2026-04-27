import UsuarioModel from '../models/UsuarioModel.js'
import EscalaTrabalhoModel from '../models/EscalaTrabalhoModel.js'
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';

class UsuarioController {

    //GET api/usuarios - Listar todos os funcionários (apenas admin)
    static async listarUsuarios(req, res) {
        try {

            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;

            const resultado = await UsuarioModel.listarTodos(id_empresa, paginacao);

            return res.status(200).json({
                sucesso: true,
                ...resultado
            });

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuário'
            });
        }
    }

    //GET api/usuarios - busca de usuário por id 
    static async buscarPorId(req, res) {
        try {
            const id_usuario = req.user.id_usuario;
            const id_empresa = req.user.id_empresa;
            // Validação básica do ID
            if (!id_usuario || isNaN(id_usuario)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID de usuário inválido',
                    mensagem: 'O ID do usuário deve ser um número válido'
                });
            }

            const usuario = await UsuarioModel.buscarPorId(id_usuario, id_empresa);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',

                })
            };
            return res.status(200).json({
                sucesso: true,
                dados: usuario
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

    //POST api/usuarios - Criar novo usuário (apenas dmin)
    static async criarUsuario(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { nome, cpf, email, id_setor, funcao, id_turno, id_maquina } = req.body;

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
                res.status(400).json({
                    sucesso: false,
                    erro: 'Setor é obrigatório',
                    mensagem: 'O setor é obrigatório!'
                })
            };

            //validação do turno
            if (!id_turno) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Turno é obrigatório',
                    mensagem: 'O turno é obrigatório!'
                })
            };
            //validação funcao
            if (!funcao || funcao.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Turno é obrigatório',
                    mensagem: 'O turno é obrigatório!'
                })
            };
            //validação maquina
            if (!id_maquina) {
                res.status(400).json({
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
    static async atualizarUsuario(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { id_usuario, nome, cpf, email, id_setor, funcao, id_turno, id_maquina } = req.body;

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

            // Preparar dados para atualização
            const dadosUpdateUsuario = {};
            const dadosUpdateEscala = {};

            if (nome !== undefined) { dadosUpdateUsuario.nome = nome }
            if (email !== undefined) { dadosUpdateUsuario.email = email }
            if (funcao !== undefined) { dadosUpdateUsuario.tipo = funcao }
            if (cpf !== undefined) { dadosUpdateUsuario.cpf = cpf }

            // Adicionar nova imagem se foi enviada
            if (req.file) {
                // Remover imagem antiga se existir
                if (usuarioExistente.imagem_perfil) {
                    await removerArquivoAntigo(usuarioExistente.imagem_perfil, 'imagem');
                }
                dadosUpdateUsuario.imagem_perfil = req.file.filename;
            }

            if (id_setor !== undefined) {
                dadosUpdateEscala.id_setor = id_setor;
            }
            if (id_turno !== undefined) {
                dadosUpdateEscala.id_turno = id_turno;
            }
            if (id_maquina !== undefined) {
                dadosUpdateEscala.id_maquina = id_maquina;
            }


            if (
                Object.keys(dadosUpdateUsuario).length === 0 &&
                Object.keys(dadosUpdateEscala).length === 0
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneça pelo menos um campo para atualizar'
                });
            }

            // Cada atualização só executa se tiver dados
            let updateUsuario = null;
            let updateEscala = null;

            if (Object.keys(dadosUpdateUsuario).length > 0) {
                updateUsuario = await UsuarioModel.atualizar(id_usuario, id_empresa, dadosUpdateUsuario)
            }
            if (Object.keys(dadosUpdateEscala).length > 0) {
                updateEscala = await EscalaTrabalhoModel.atualizar(id_usuario, id_empresa, dadosUpdateEscala)
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuario atualizado com sucesso',
                dados: {
                    ...updateUsuario,
                    ...updateEscala
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o usuário!'
            });
        }
    }

    //DELETE api/usuarios - Excluir funcionario 
    static async deletarUsuario(req, res) {
        try {
            const { id_usuario } = req.body
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

    // --------------------------------------------dashboards---------------------------------------------------

    static async qtdDeUsuariosTipo(req, res) {
        try {

        } catch (error) {

        }
    }
    static async tempoMedioSessaoTipo(req, res) {
        try {

        } catch (error) {

        }
    }
    static async qtdUsuariosPorSetor(req, res) {
        try {

        } catch (error) {

        }
    }
    static async top5Operadores(req, res) {
        try {

        } catch (error) {

        }
    }
    static async producaoMediaPorDiaSetor(req, res) {
        try {

        } catch (error) {

        }
    }
    static async rotatividade(req, res){
        try {
            
        } catch (error) {
            
        }
    }

}
export default UsuarioController