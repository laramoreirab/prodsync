import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt'

class UsuarioModel {
    //Listar todos os usuários com paginacção
    static async listarTodos(pagina = 1, limite = 10) {
        try {
            const skip = (pagina - 1) * limite;

            const [usuarios, totalUsuarios] = await Promise.all([
                prisma.usuarios.findMany({
                    skip: skip,
                    take: limite,
                    orderBy: { nome: 'asc' }
                }),
                prisma.usuarios.count(),
            ]);

            const totalPaginas = Math.ceil(totalUsuarios / limite);

            return {
                data: usuarios,
                meta: {
                    totalUsuarios,
                    totalPaginas,
                    currentPages: pagina,
                    pageSize: limite,
                },
            };

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    };

    //buscar usuario por id
    static async buscarPorId(id, id_empresa) {
        try {
            const row = await prisma.usuarios.findFirt({
                where:{ 
                    id_usuario: parseInt(id), 
                    id_empresa: parseInt(id_empresa)}
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
                return novoUsuario || null;
            } catch (error) {
                console.error('Erro ao registrar novo usuário', error);
                throw error;
            }
        }
    }


    //verificar credenciais do login 
    static async verificarCredenciais(id, senha) {
        try {
            const usuario = await prisma.usuario.findUnique({
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
            const row = await prisma.usuarios.update({
                where: { id_usuario: id ,
                    id_empresa: id_empresa
                },
                data: { ...dados }
            })
            return row || null
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    //Deletar dados dos usuários
    static async deletar(id, id_empresa) {
        try {
            const deletarUser = await prisma.usuarios.delete({
                where: { id_usuario: id,
                    id_empresa: id_empresa
                 },
            });
            return deletarUser
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw error;
        }
    }
}
export default UsuarioModel