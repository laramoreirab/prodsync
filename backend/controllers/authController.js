import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/UsuarioModel.js'
import EmpresaModel from '../models/EmpresaModel.js';
import { JWT_CONFIG } from '../config/jwt.js'

class AuthController {

    //POST api/auth/login - Fazer login
    static async login(req, res) {
        try {
            const { id, senha } = req.body;

            if (!id || id.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Identificador é obrigatório',
                    mensagem: 'O identificador é obrigatório para realizar o login!'
                })
            };

            if (!senha || senha.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha é obrigatório',
                    mensagem: 'A senha é obrigatória para realizar o login!'
                })
            };

            //verificar se o usuário existe no banco de dados
            const usuario = await UsuarioModel.verificarCredenciais(id.trim(), senha.trim());
            if (!usuario) {
                return res.status(400).json({
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

            return res.status(200).json({
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
            return res.status(500).json({
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
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome da empresa é obrigatório',
                    mensagem: 'O nome da empresa é obrigatório!'
                })
            };
            if (!cnpj || cnpj.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CNPJ é obrigatório',
                    mensagem: 'O CNPJ da empresa é obrigatório!'
                })
            };
            if (!email || email.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email da empresa é obrigatório',
                    mensagem: 'O email da empresa é obrigatório!'
                })
            };
            if (!telefone || telefone.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Telefone da empresa é obrigatório',
                    mensagem: 'O telefone da empresa é obrigatório!'
                })
            };
            if (!endereco || endereco.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Endereço é obrigatório',
                    mensagem: 'O endereço da empresa é obrigatório!'
                })
            };
            if (!nome_representante || nome_representante.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome do representante é obrigatório',
                    mensagem: 'O nome do representante é obrigatório!'
                })
            };
            if (!cpf || cpf.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CPF do representante é obrigatório',
                    mensagem: 'O CPF do representante é obrigatório!'
                })
            };
            if (!senha || senha.trim() == '') {
                return res.status(400).json({
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
            const empresaexistente = await EmpresaModel.buscarPorCnpj(cnpj);
            if (empresaexistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Empresa já cadastrada',
                    mensagem: 'Empresa já cadastrada no sistema!'
                })
            };

            //Preparar dados da empresa para adicionar na tabela Empresa
            const dadosEmpresa = {
                nome_empresa: nome_empresa,
                cnpj: cnpj.trim(),
                email: email.trim().toLowerCase(),
                telefone: telefone.trim(),
                endereco: endereco,
                nome_representante: nome_representante,
                cpf: cpf.trim(),
                senha: senha.trim()
            }

            // 1. Cadastrar a empresa E o representante como ADM juntos no banco 
            // Obs: A função agora retorna a empresa e um array com os usuários criados nela
            const novaEmpresa = await EmpresaModel.criarEmpresa(dadosEmpresa);

            // 2. Pegamos o usuário ADM que o Prisma acabou de criar e devolveu junto com a empresa
            const registroAdm = novaEmpresa.usuarios[0];

            //gerar token
            const token = jwt.sign({
                id_empresa: novaEmpresa.id_empresa,
                id_usuario: registroAdm.id_usuario,
                tipo: registroAdm.tipo
            },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );

            // 3. Retornamos o sucesso para o frontend
            return res.status(201).json({
                sucesso: true,
                mensagem: 'Empresa e administrador criados com sucesso!',
                dados: {
                    token,
                    id_empresa: novaEmpresa.id_empresa,
                    id_usuario: registroAdm.id_usuario,
                    nome_empresa: novaEmpresa.nome_empresa,
                    cnpj: novaEmpresa.cnpj,
                    tipo: registroAdm.tipo
                }
            })

        } catch (error) {
            console.error('Erro ao registrar empresa e usuário:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar empresa ou usuário'
            });
        }
    }

    //GET api/auth/perfil - Obter perfil do usuário logado
    static async obterPerfil(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.user.id_usuario);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: 'Usuário não foi encontrado'
                });
            }
            // Remover senha dos dados retornados
            const { senha, ...usuarioSemSenha } = usuario;

            return res.status(200).json({
                sucesso: true,
                dados: usuarioSemSenha
            });

        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            return res.status(500).json({
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

            if (!id || id.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Identificador obrigatório',
                    mensagem: 'Identificador é obrigatório'
                })
            };

            if (id < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Identificador inválido',
                    mensagem: 'Identificador inválido'
                })
            }

            const usuario = await UsuarioModel.buscarPorId(id)
            if (!usuario) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Identificador não encontrado',
                    mensagem: 'Identificador não encontrado'
                })
            }
            //gerar token
            const token = jwt.sign({
                id_empresa: usuario.id_empresa,
                id_usuario: usuario.id_usuario,
                tipo: usuario.tipo
            },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );

            //verificar se o id ainda não possui senha cadastrada
            const verificacaoSenha = await UsuarioModel.verificaSenhaUsuario(id);
            if (verificacao === true) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha já criada para o identificador',
                    mensagem: 'Senha já criada para o identificado'
                })
            };

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Identificador encontrado!',
                dados: {
                    token,
                    id_empresa: usuario.id_empresa,
                    nome: usuario.nome,
                    id_usuario: usuario.id_usuario,
                    tipo: usuario.tipo
                }
            });   

        } catch (error) {
            console.error('Erro ao verificar identificador:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível verificar identificador'
            });
        }
    }

    //POST api/auth/registroSenha- registrar a senha de primeiro acesso do usuário
    static async registroSenha(req, res) {
        try {
            const { id } = req.user.id_usuario;
            const { senha, senhaConfirmada } = req.body;

            if (!senha || senha.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha obrigatória',
                    mensagem: 'Senha é obrigatória'
                })
            };

            if (!senhaConfirmada || senhaConfirmada.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha confirmada obrigatória',
                    mensagem: 'Senha confirmada é obrigatória'
                })
            };

            const comparacao = await UsuarioModel.comparacaoDeSenhas(senha, senhaConfirmada);

            if (comparacao === false) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senhas não confirmadas',
                    mensagem: 'Senhas não confirmadas, digite senhas iguais!'
                })
            };

            //registrar senha do usuário no banco
            const registrarSenha = await UsuarioModel.atualizar(id, senha)
            if (!registrarSenha) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha não registrada',
                    mensagem: 'Senha não registrada!'
                })
            };

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Senha cadastrada com sucesso!'
            });


        } catch (error) {
            console.error('Erro ao registrar senha', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar senha'
            });
        }
    }
}

export default AuthController;