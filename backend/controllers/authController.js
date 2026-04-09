import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/UsuarioModel'
import { JWT_CONFIG } from '../config/jwt'

class AuthController {

    //POST api/auth/login - Fazer login
    static async login(req, res) {
        try {
            const { id, senha } = req.body;

            if (!id || id.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Identificador é obrigatório',
                    mensagem: 'O identificador é obrigatório para realizar o login!'
                })
            };

            if (!senha || senha.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Senha é obrigatório',
                    mensagem: 'A senha é obrigatória para realizar o login!'
                })
            };

            //verificar se o usuário existe no banco de dados
            const usuario = await UsuarioModel.verificarCredenciais(id.trim(), senha.trim());
            if (!usuario) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Credenciais inválidas',
                    mensagem: 'Identificador ou senha incorretos!'
                })
            };

            //gerar token
            const token = jwt.sign({
                id_empresa: usuario.id_empresa,
                id_usuario: usuario.id_usuario,
                tipo: usuario.tipo
            },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );

            res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso!',
                dados: {
                    token,
                    id_empresa: usuario.id_empresa,
                    nome: usuario.nome,
                    id_usuario: usuario.id_usuario,
                    tipo: usuario.tipo
                }
            });

        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível processar o login'
            });
        }
    }

    //POST api/auth/cadastrar - Registar nova empresa no sistema
    static async cadastrar(req, res) {
        try {
            const { nome_empresa, cnpj, telefone, email, endereco, nome_representante, cpf, senha } = req.body;

            //validações básicas
            if (!nome_empresa || nome_empresa.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Nome da empresa é obrigatório',
                    mensagem: 'O nome da empresa é obrigatório!'
                })
            };
            if (!cnpj || cnpj.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'CNPJ é obrigatório',
                    mensagem: 'O CNPJ da empresa é obrigatório!'
                })
            };
            if (!email || email.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Email da empresa é obrigatório',
                    mensagem: 'O email da empresa é obrigatório!'
                })
            };
            if (!telefone || telefone.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Telefone da empresa é obrigatório',
                    mensagem: 'O telefone da empresa é obrigatório!'
                })
            };
            if (!endereco || endereco.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Endereço é obrigatório',
                    mensagem: 'O endereço da empresa é obrigatório!'
                })
            };
            if (!nome_representante || nome_representante.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Nome do representante é obrigatório',
                    mensagem: 'O nome do representante é obrigatório!'
                })
            };
            if (!cpf || cpf.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'CPF do representante é obrigatório',
                    mensagem: 'O CPF do representante é obrigatório!'
                })
            };
            if (!senha || senha.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Senha é obrigatório',
                    mensagem: ' A senha é obrigatória para realizar cadastro!'
                })
            };

            //validações de formato
            if (nome_empresa.length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome da empresa muito curto',
                    mensagem: 'O nome da empresa deve ter pelo menos 2 caracteres'
                });
            };

            if (nome_empresa.length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome da empresa muito longo',
                    mensagem: 'O nome da empresa deve ter no máximo 255 caracteres'
                });
            };
            if (nome_representante.length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome do representante muito curto',
                    mensagem: 'O nome do representante deve ter pelo menos 2 caracteres'
                });
            };

            if (nome_representante.length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome do representante muito longo',
                    mensagem: 'O nome do representante deve ter no máximo 255 caracteres'
                });
            };
            if (telefone.length < 11) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'telefone inválido',
                    mensagem: 'Telefone da empresa inválido'
                });
            };
            if (cnpj.length < 14) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CNPJ inválido',
                    mensagem: 'CNPJ da empresa inválido'
                });
            };
            if (cpf.length < 11) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CPF inválido',
                    mensagem: 'CPF do representante inválido'
                });
            };
            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha muito curta',
                    mensagem: 'A senha deve ter pelo menos 6 caracteres'
                });
            };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }

            //verificar se o cnpj da empresa já esta cadastrado no sistema 
            const empresaexistente = await UsuarioModel.buscarPorCnpj(cnpj);
            if (empresaexistente) {
                res.status(409).json({
                    sucesso: false,
                    erro: 'Empresa já cadastrada',
                    mensagem: 'Empresa já cadastrada no sistema!'
                })
            };

            //Preparar dados da empresa para adicionar na tabela Empresa
            const dadosEmpresa = {
                nome_empresa: nome_empresa,
                cnpj: cnpj.trim(),
                email: email.trim().toLowercase(),
                telefone: telefone.trim(),
                endereco: endereco,
                nome_representante: nome_representante,
                cpf: cpf.trim(),
                senha: senha.trim()
            }

            //cadastrar a empresa no banco 
            const empresaId = await UsuarioModel.criarEmpresa(dadosEmpresa);

            //Preparar dados do representante para adicionar na tabela Usuario como adm
            const dadosUsuario = {
                id_empresa: empresaId,
                nome: nome_representante,
                tipo: 'Adm',
                cpf: cpf,
                email: email.trim().toLowercase(),
                senha: senha.trim()
            }

            //cadastrando o representante como ADM no banco na tabela Usuarios
            const registroAdm = await UsuarioModel.criarUsuario(dadosUsuario)

            res.status(201).json({
                sucesso: true,
                mensagem: 'Empresa cadastrada com sucesso',
                dados: {
                    id_empresa: empresaId,
                    nome_empresa: nome_empresa,
                    cnpj: cnpj.trim(),
                    tipo: 'Adm'
                }
            })

        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar o usuário'
            });
        }
    }

    //GET api/auth/perfil - Obter perfil do usuário logado
    static async obterPerfil(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: 'Usuário não foi encontrado'
                });
            }
            // Remover senha dos dados retornados
            const { senha, ...usuarioSemSenha } = usuario;

            res.status(200).json({
                sucesso: true,
                dados: usuarioSemSenha
            });

        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o perfil'
            });
        }
    }

    //POST api/auth/primeiroAcesso - verificar pelo id do usuário se esse é seu primeiro acesso e se ja possui senha
    static async primeiroAcesso(req, res) {
        try {
            const { id } = req.body;

            if(!id || id.trim() === ''){
                res.status(400).json({
                sucesso: false,
                erro: 'Identificador obrigatório',
                mensagem: 'Identificador é obrigatório'
                })
            };

            if(id<2){
                res.status(400).json({
                    sucesso: false,
                    erro: 'Identificador inválido',
                    mensagem: 'Identificador inválido'
                })
            }

            const usuario = await UsuarioModel.buscarPorId(id)
            if(!usuario){
                res.status(400).json({
                    sucesso: false,
                    erro: 'Identificador não encontrado',
                    mensagem: 'Identificador não encontrado'
                })
            }
            //verificar se o id ainda não possui senha cadastrada
            const verificacaoSenha = await UsuarioModel.verificaSenhaUsuario(id);
            if(verificacao === true){
                res.status(400).json({
                    sucesso: false,
                    erro:'Senha já criada para o identificador',
                    mensagem:'Senha já criada para o identificado'
                })
            };

            res.status(201).json({
                sucesso: true,
                mensagem: 'Identificador encontrado!'
            });   

        } catch (error) {
            console.error('Erro ao verificar identificador:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível verificar identificador'
            });
        }
    }

    //POST api/auth/registroSenha/:id - registrar a senha de primeiro acesso do usuário
    static async registroSenha(req, res) {
        try {
            const { id } = req.params;
            const { senha, senhaConfirmada } = req.body;

            if(!senha || senha.trim() === ''){
                res.status(400).json({
                sucesso: false,
                erro: 'Senha obrigatória',
                mensagem: 'Senha é obrigatória'
                })
            };
            
            if(!senhaConfirmada || senhaConfirmada.trim() === ''){
                res.status(400).json({
                sucesso: false,
                erro: 'Senha confirmada obrigatória',
                mensagem: 'Senha confirmada é obrigatória'
                })
            };

            const comparacao = await UsuarioModel.comparacaoDeSenhas(senha, senhaConfirmada);

            if(comparacao === false){
                res.status(400).json({
                    sucesso: false,
                    erro: 'Senhas não confirmadas',
                    mensagem: 'Senhas não confirmadas, digite senhas iguais!'
                })
            };

            //registrar senha do usuário no banco
            const registrarSenha = await UsuarioModel.atualizar(id, senha)
            if(!registrarSenha){
                res.status(400).json({
                    sucesso: false,
                    erro: 'Senha não registrada',
                    mensagem: 'Senha não registrada!'
                })
            };

            res.status(201).json({
                sucesso: true,
                mensagem: 'Senha cadastrada com sucesso!'
            });


        } catch (error) {
            console.error('Erro ao registrar senha', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar senha'
            });
        }
    }
}

export default AuthController;