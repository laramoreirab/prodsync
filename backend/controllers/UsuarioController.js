import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/UsuarioModel.js'
import TurnoModel from '../models/TurnoModel.js'
import EscalaTrabalhoModel from '../models/EscalaTrabalhoModel.js'
import SetorModel from '../models/SetorModel.js'
import MaquinaModel from '../models/MaquinaModel.js'
import { JWT_CONFIG } from '../config/jwt.js'
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';

class UsuarioController {

    //GET api/usuarios - Listar todos os funcionários (apenas admin)
    static async listarUsuarios(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                });
            }
            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser um número maior que zero'
                });
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }

            const resultado = await UsuarioModel.listarTodos(pagina, limite);

            res.status(200).json({
                sucesso: true,
                dados: resultado.data, // Acessa o array dentro da chave 'data'
                paginacao: {
                    totalUsuarios: resultado.meta.totalUsuarios,
                    totalPaginas: resultado.meta.totalPaginas,
                    currentPage: resultado.meta.currentPages,
                    pageSize: resultado.meta.pageSize
                }
            });

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os produtos'
            });
        }
    }

    //GET api/usuarios/:id - busca de usuário por id 
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            // Validação básica do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            const usuario = await UsuarioModel.buscarPorId(id);

            if (!usuario) {
                res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',

                })
            };
            res.status(200).json({
                sucesso: true,
                dados: usuario
            });

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o usuário'
            });
        }
    }

    //POST api/usuarios - Criar novo usuário (apenas dmin)
    static async criarUsuario(req, res) {
        try {
            const { nome, cpf, email, setor, funcao, turno, maquina } = req.body;

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
                res.status(400).json({
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
            if (!setor || setor.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Setor é obrigatório',
                    mensagem: 'O setor é obrigatório!'
                })
            };

            //validação do turno
            if (!turno || turno.trim() == '') {
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
            if (!maquina || maquina.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Turno é obrigatório',
                    mensagem: 'O turno é obrigatório!'
                })
            };

            //preparar dados do usuario para tabela usuarios
            const dadosUsuario = {
                nome: nome,
                tipo: funcao,
                cpf: cpf.trim(),
                email: email
            }

            // Adicionar imagem se foi enviada
            if (req.file) {
                dadosUsuario.imagem = req.file.filename;
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
            //buscar turno, maquina e setor ID 
            const turnoId = await TurnoModel.buscarIdTurno(turno)
            const setorId = await SetorModel.buscarIdSetor(setor)
            const maquinaId = await TurnoModel.buscarIdMaquina(maquina)
            //prepara dados de maquina,turno e operados para adicionar na tabela turno
            const dadosTurno = {
                id_maquina: maquinaId,
                id_usuario: usuarioId,
                id_turno: turnoId
            }
            //Registrar na tabela turno 
            const registrarTurno = await TurnoModel.criar(dadosTurno)
            if (!registrarTurno) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Não foi possível registrar turno',
                    mensagem: 'Não foi possível registrar turno!'
                })
            }
            //preparar dados de escala de trabalho para tabela escalaTrabalho
            const dadosEscala = {
                id_operador: usuarioId,
                id_turno: turnoId,
                id_setor: setorId
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
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o usuário'
            });
        }
    }

    //PUT api/usuarios/:idf
    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, cpf, email, setor, funcao, turno, maquina } = req.body;

            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            //verificar se usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Preparar dados para atualização
            const dadosUpdateUsuario = {};
            const dadosUpdateEscala = {};
            const dadosUpdateTurno = {};

            if (nome !== undefined) { dadosUpdateUsuario.nome = nome }
            if (email !== undefined) { dadosUpdateUsuario.email = email }
            if (funcao !== undefined) { dadosUpdateUsuario.tipo = funcao }
            if (cpf !== undefined) { dadosUpdateUsuario.cpf = cpf }

            // Adicionar nova imagem se foi enviada
            if (req.file) {
                // Remover imagem antiga se existir
                if (usuarioExistente.imagem) {
                    await removerArquivoAntigo(usuarioExistente.imagem, 'imagem');
                }
                dadosUpdateUsuario.imagem = req.file.filename;
            }

            if (setor !== undefined) {
            const setorId = await SetorModel.buscarIdSetor(setor)
            dadosUpdateEscala.id_setor = setorId;
        }
        if (turno !== undefined) {
            const turnoId = await TurnoModel.buscarIdTurno(turno)
            dadosUpdateEscala.id_turno = turnoId;
            dadosUpdateTurno.id_turno = turnoId; // ← resolve o turnoId duplicado também
        }
        if (maquina !== undefined) {
            const maquinaId = await MaquinaModel.buscarIdMaquina(maquina)
            dadosUpdateTurno.id_maquina = maquinaId;
        }

        // UMA única verificação geral no lugar das três individuais
        if (
            Object.keys(dadosUpdateUsuario).length === 0 &&
            Object.keys(dadosUpdateEscala).length === 0 &&
            Object.keys(dadosUpdateTurno).length === 0
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
        let updateTurno = null;

        if (Object.keys(dadosUpdateUsuario).length > 0) {
            updateUsuario = await UsuarioModel.atualizar(id, dadosUpdateUsuario)
        }
        if (Object.keys(dadosUpdateEscala).length > 0) {
            updateEscala = await EscalaTrabalhoModel.atualizar(id, dadosUpdateEscala)
        }
        if (Object.keys(dadosUpdateTurno).length > 0) {
            updateTurno = await TurnoModel.atualizar(id, dadosUpdateTurno)
        }

            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuario atualizado com sucesso',
                dados: {
                    ...updateUsuario,
                    ...updateEscala,
                    ...updateTurno

                }
            });

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o usuário!'
            });
        }
    }

    //DELETE api/usuarios/:idf - Excluir funcionario 
    static async deletarUsuario(req, res) {
        try {
            const { id } = req.params;

            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            //verificar se usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Remover imagem do produto se existir
            if (usuarioExistente.imagem) {
                await removerArquivoAntigo(usuarioExistente.imagem, 'imagem');
            }

            const resultado = await UsuarioModel.deletar(id);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });

        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível usuário o produto'
            });
        }
    }

    // POST /usuario/upload - Upload de imagem para usuarios
    static async uploadImagem(req, res) {
        try {
            const { id } = req.body;

            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            //verificar se usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Remover imagem antiga se existir
            if (usuarioExistente.imagem) {
                await removerArquivoAntigo(usuarioExistente.imagem, 'imagem');
            }

            // Atualizar produto com a nova imagem
            await UsuarioModel.atualizar(id, { imagem: req.file.filename });

            res.status(200).json({
                sucesso: true,
                mensagem: 'Imagem enviada com sucesso',
                dados: {
                    nomeArquivo: req.file.filename,
                    caminho: `/uploads/imagens/${req.file.filename}`
                }
            });
        } catch (error) {
            console.error('Erro ao fazer upload de imagem:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível fazer upload da imagem'
            });
        }
    }
}

export default UsuarioController