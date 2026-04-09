import prisma from '../config/prisma.js';

class UsuarioModel {
    //Listar todos os usuários com paginacção
    static async listarTodos(page = 1, pageSize = 10) {
        try {
            const skip = (page - 1) * pageSize;

            const [usuarios, totalUsuarios] = await Promise.all([
                prisma.usuarios.findMany({
                    skip: skip,
                    take: pageSize,
                    orderBy: {
                        name: 'asc' //ordena a paginação
                    },
                }),
                prisma.usuarios.count(),
            ]);

            const totalPaginas = Math.ceil(totalUsuarios / pageSize);

            return {
                data: usuarios,
                meta: {
                    totalUsuarios,
                    totalPaginas,
                    currentPages: page, pageSize,
                },
            };

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    };

    //buscar usuario por id
    static async buscarPorId(id) {
        try {
            const row = await prisma.usuarios.findUnique({
                where: { id_usuario: id },
            });
            return row || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }

    };
    //buscar por cnpj
    static async buscarPorCnpj(cnpj) {
        try {
            const row = await prisma.usuarios.findUnique({
                where: { cnpj: cnpj }
            });
            return row || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por CNPJ:', error);
            throw error;
        }
    };

    //Registrar nova empresa
    static async criarEmpresa(dados) {
        try {
            const senhaHash = await bcrypt.hash(dados.senha, 10);
            
            const novaEmpresa = await prisma.empresas.create({
                data: {
                    ...dados,
                    senha: senhaHash
                },
            });
            return novaEmpresa.id_empresa;
        } catch (error) {
            console.error('Erro ao registrar empresa', error);
            throw error;
        };
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
                    }
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
            const usuario = await this.buscarPorId(id);
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
            if (usuarioSenha !== null) {
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
            if(senha === senhaConfirmada){
                return true
            }else{
                return false
            };
        } catch (error) {
            console.error('Erro ao comparar as senhas:', error);
            throw error;
        }
    }

    //atualizar dados dos usuários
    static async atualizar(id, dados){
        try {
            if(dados.senha){
            dados.senha = await bcrypt.hash(dados.senha, 10)
        }
        const row = await prisma.usuarios.update({
            where: { id_usuario: id },
            data: { ...dados }
        })
        return row || null
        } catch (error) {
             console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    //Deletar dados dos usuários
    static async deletar(id){
        try {
            const deletarUser = await prisma.usuarios.delete({
                where: { id_usuario : id},
            });
            return deletarUser
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw error;
        }
    }
}
export default UsuarioModel