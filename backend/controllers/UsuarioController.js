import UsuarioModel from '../models/UsuarioModel.js'
import EscalaTrabalhoModel from '../models/EscalaTrabalhoModel.js'
import SetorModel from '../models/SetorModel.js';
import MaquinaModel from '../models/MaquinaModel.js'
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';
import prisma from '../config/prisma.js';
import EmpresaModel from '../models/EmpresaModel.js';
import Papa from 'papaparse'
import { gerarIdUsuario } from '../dev-utils/gerarIdUsuario.js';
import { removerImagemCloudinary, uploadImagemPerfil } from '../services/cloudinaryService.js';

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

            // Busca também os dados de escala (setor, turno, máquina) ou setor do gestor
            const escala = await prisma.escalaTrabalho.findFirst({
                where: { id_operador: id_usuario, id_empresa },
                select: {
                    id_setor: true,
                    id_turno: true,
                    id_maquina: true
                }
            });

            let id_setor = escala?.id_setor ?? null;
            let id_turno = escala?.id_turno ?? null;
            let id_maquina = escala?.id_maquina ?? null;

            if (usuario.tipo === 'Gestor') {
                const gestorSetor = await prisma.setor_Gestor.findFirst({
                    where: { id_gestor: id_usuario, id_empresa },
                    select: { id_setor: true }
                });
                if (gestorSetor) {
                    id_setor = gestorSetor.id_setor;
                    id_turno = null;
                    id_maquina = null;
                }
            }

            return res.status(200).json({
                sucesso: true,
                dados: {
                    ...usuario,
                    funcao: usuario.tipo,
                    id_setor,
                    id_turno,
                    id_maquina
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

    //POST api/usuarios/criar - Criar novo usuário (apenas admin)
    static async buscarConflitoMaquinaTurno(id_empresa, id_turno, id_maquina, id_operadorIgnorado = null) {
        return await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa: Number(id_empresa),
                id_turno: Number(id_turno),
                id_maquina: Number(id_maquina),
                ...(id_operadorIgnorado ? { id_operador: { not: Number(id_operadorIgnorado) } } : {})
            },
            include: {
                operador: {
                    select: {
                        id_usuario: true,
                        nome: true
                    }
                },
                turno: {
                    select: {
                        nome_turno: true
                    }
                },
                maquina: {
                    select: {
                        nome: true
                    }
                }
            }
        });
    }

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

            if (funcao === 'Operador') {
                const conflito = await UsuarioController.buscarConflitoMaquinaTurno(
                    id_empresa,
                    id_turno,
                    id_maquina
                );

                if (conflito) {
                    return res.status(409).json({
                        sucesso: false,
                        erro: 'Maquina indisponivel no turno',
                        mensagem: `A maquina ${conflito.maquina?.nome ?? id_maquina} ja esta sendo gerenciada por ${conflito.operador?.nome ?? 'outro operador'} no turno ${conflito.turno?.nome_turno ?? id_turno}.`
                    });
                }
            }

            //preparar dados do usuario para tabela usuarios
            const idUsuarioNovo = gerarIdUsuario(funcao);
            let imagemPerfilUpload = null;

            if (req.file) {
                imagemPerfilUpload = await uploadImagemPerfil(req.file.buffer, {
                    id_empresa,
                    id_usuario: idUsuarioNovo
                });
            }

            const dadosUsuario = {
                id_usuario: idUsuarioNovo,
                id_empresa: Number(id_empresa),
                nome: nome,
                tipo: funcao,
                cpf: cpf.trim(),
                email: email,
                ...(imagemPerfilUpload ? {
                    imagem_perfil: imagemPerfilUpload.secure_url,
                    imagem_perfil_public_id: imagemPerfilUpload.public_id
                } : {})
            }

            //Registrar usuário na tabela Usuarios
            const usuarioId = await UsuarioModel.criarUsuario(dadosUsuario);
            if (!usuarioId || isNaN(usuarioId)) {
                return res.status(400).json({
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

        const funcaoNormalizada = funcao !== undefined
            ? (String(funcao).trim().toLowerCase() === 'gestor' ? 'Gestor' : 'Operador')
            : undefined;

        const tipoFinal = funcaoNormalizada ?? usuarioExistente.tipo;
        if (tipoFinal === 'Operador') {
            const turnoFinal = id_turno !== undefined && id_turno !== ''
                ? id_turno
                : usuarioExistente.id_turno;
            const maquinaFinal = id_maquina !== undefined && id_maquina !== ''
                ? id_maquina
                : usuarioExistente.id_maquina;

            if (turnoFinal && maquinaFinal) {
                const conflito = await UsuarioController.buscarConflitoMaquinaTurno(
                    id_empresa,
                    turnoFinal,
                    maquinaFinal,
                    id_usuario
                );

                if (conflito) {
                    return res.status(409).json({
                        sucesso: false,
                        erro: 'Maquina indisponivel no turno',
                        mensagem: `A maquina ${conflito.maquina?.nome ?? maquinaFinal} ja esta sendo gerenciada por ${conflito.operador?.nome ?? 'outro operador'} no turno ${conflito.turno?.nome_turno ?? turnoFinal}.`
                    });
                }
            }
        }

        // dados usuario

        const dadosUpdateUsuario = {};

        if (nome !== undefined)
            dadosUpdateUsuario.nome = nome;

        if (cpf !== undefined)
            dadosUpdateUsuario.cpf = cpf;

        if (email !== undefined)
            dadosUpdateUsuario.email = email;

        if (funcaoNormalizada !== undefined)
            dadosUpdateUsuario.tipo = funcaoNormalizada;

        // imagem
        if (req.file) {
            const imagemPerfilUpload = await uploadImagemPerfil(req.file.buffer, {
                id_empresa,
                id_usuario
            });

            dadosUpdateUsuario.imagem_perfil = imagemPerfilUpload.secure_url;
            dadosUpdateUsuario.imagem_perfil_public_id = imagemPerfilUpload.public_id;
        }

        // atualiza usuário
        const usuarioAtualizado =
            await UsuarioModel.atualizar(
                id_usuario,
                id_empresa,
                dadosUpdateUsuario
            );
        // operador
        if (funcaoNormalizada === "Operador") {

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
        // gestor

        if (funcaoNormalizada === "Gestor" && id_setor) {

            await EscalaTrabalhoModel.atualizarSetorGestor(
                id_usuario,
                id_empresa,
                id_setor
            );
        }

        if (req.file && !usuarioExistente.imagem_perfil_public_id && usuarioExistente.imagem_perfil) {
            await removerArquivoAntigo(usuarioExistente.imagem_perfil, 'imagem');
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

            if (usuarioExistente.imagem_perfil_public_id) {
                await removerImagemCloudinary(usuarioExistente.imagem_perfil_public_id);
            } else if (usuarioExistente.imagem_perfil) {
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

            if (!req.file) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Imagem nao enviada',
                    mensagem: 'Envie uma imagem no campo imagem_perfil'
                });
            }

            const imagemPerfilUpload = await uploadImagemPerfil(req.file.buffer, {
                id_empresa,
                id_usuario
            });

            await UsuarioModel.atualizar(id_usuario, id_empresa, {
                imagem_perfil: imagemPerfilUpload.secure_url,
                imagem_perfil_public_id: imagemPerfilUpload.public_id
            });

            if (!usuarioExistente.imagem_perfil_public_id && usuarioExistente.imagem_perfil) {
                await removerArquivoAntigo(usuarioExistente.imagem_perfil, 'imagem');
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Imagem enviada com sucesso',
                dados: {
                    url: imagemPerfilUpload.secure_url,
                    public_id: imagemPerfilUpload.public_id
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
                return res.status(400).json({ sucesso: false, erro: 'ID de usuário inválido' });
            }

            const dados = await UsuarioModel.listarApontamentosUsuario(id_empresa, id_usuario);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar apontamentos do usuário:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    static async listarHistoricoEventosUsuario(req, res) {
        try {
            const id_usuario = Number(req.params.id);
            const id_empresa = req.user.id_empresa;
            const limite = parseInt(req.query.limite) || 50;

            if (!id_usuario || isNaN(id_usuario)) {
                return res.status(400).json({ sucesso: false, erro: 'ID de usuário inválido' });
            }

            if (limite <= 0 || limite > 200) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser um número entre 1 e 200'
                });
            }

            const dados = await UsuarioModel.listarHistoricoEventosUsuario(id_empresa, id_usuario, limite);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar histórico de eventos do usuário:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    static async deletarEmpresa(req, res){
        try {
            const id_empresa = req.user.id_empresa
            const id_usuario = req.user.id_usuario
            const { cnpj, senhaAdmin } = req.body

            const deletar = await EmpresaModel.deletarEmpresa(id_empresa, id_usuario, cnpj, senhaAdmin)

            return res.status(200).json({
                sucesso: true,
                mensagem:"Empresa deletada com sucesso!"
            })

        } catch (error) {
             console.error('Erro ao deletar empresa:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    static async atualizarEmpresa(req, res){
        try {
            const id_empresa = req.user.id_empresa
            const { email, telefone, endereco, cpf_representante} = req.body

            const dadosUpdateEmpresa = {};

        if (telefone !== undefined)
            dadosUpdateEmpresa.telefone = telefone;

        if (endereco !== undefined)
            dadosUpdateEmpresa.endereco = endereco;

        if (email !== undefined)
            dadosUpdateEmpresa.email = email;

        if (cpf_representante !== undefined)
            dadosUpdateEmpresa.cpf_representante = cpf_representante;

        if (Object.keys(dadosUpdateEmpresa).length === 0) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Nenhum dado válido fornecido para atualização." 
            });
        }

        const resposta = await UsuarioModel.atualizarEmpresa(id_empresa, dadosUpdateEmpresa)

        return res.status(200).json({
            sucesso: true,
            mensagem: "Empresa atualizada com sucesso!",
            dados: resposta
        })

        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }
    static async cadastroLote(req, res){
        try {
            if (!req.file) {
                return res.status(400).json({ sucesso: false, erro: 'Arquivo CSV não encontrado.' });
            }

            const fileText = req.file.buffer.toString('utf-8');

            const parsedData = Papa.parse(fileText, {
                header: true,
                skipEmptyLines: true, 
            });

            const usuariosCsv = parsedData.data;

            const dadosParaSalvar = usuariosCsv.map((linha) => ({
                id_empresa: Number(linha.id_empresa),
                nome: linha.nome,
                cpf: String(linha.cpf).replace(/\D/g, ""),
                email: linha.email,
                tipo: linha.tipo,
                senha: '',
                id_setor: linha.id_setor ? Number(linha.id_setor) : null,
                funcao: linha.funcao,
                id_turno: linha.id_turno ? Number(linha.id_turno) : null,
                id_maquina: linha.id_maquina ? Number(linha.id_maquina) : null,
            }));

            const resultado = await UsuarioModel.cadastrarLote(dadosParaSalvar)

            return res.status(200).json({ 
                sucesso: true, 
                mensagem: `${resultado} usuários criados com sucesso!` 
            });
        } catch (error) {
            console.error('Erro ao cadastrar lote de usuários:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno ao processar o arquivo CSV' });
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
            const escala = await MaquinaModel.obterMaquinaOperador(id_empresa, id_usuario)
            const id_maquina = escala?.id_maquina ?? null
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
            const escala = await MaquinaModel.obterMaquinaOperador(id_empresa, id_usuario)
            const id_maquina = escala?.id_maquina ?? null
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
