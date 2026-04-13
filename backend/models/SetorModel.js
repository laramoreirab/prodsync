import prisma from '../config/prisma.js';

class SetorModel {

    // Cria um novo setor
    static async criarSetor(dados) {
        try {
            const setor = await prisma.setores.create({
                data: {
                    nome_setor: dados.nome_setor,
                    id_empresa: dados.id_empresa
                }
            });
            return setor;
        } catch (error) {
            console.error('Erro ao criar setor:', error);
            throw error;
        }
    }

    // Lista todos os setores de uma empresa
    static async listarSetoresPorEmpresa(id_empresa) {
        try {
            const setores = await prisma.setores.findMany({
                where: { id_empresa: id_empresa },
                include: {
                    empresa: true,
                    maquinas: {
                        where: { ativo: true },
                        select: { id_maquina: true, nome: true, status_atual: true }
                    },
                    gestores: {
                        include: {
                            gestor: {
                                select: { id_usuario: true, nome: true, email: true }
                            }
                        }
                    }
                }
            });
            return setores;
        } catch (error) {
            console.error('Erro ao listar setores:', error);
            throw error;
        }
    }

    // Obtém um setor específico por ID e empresa
    static async obterSetorPorId(id_setor, id_empresa) {
        try {
            const setor = await prisma.setores.findFirst({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                },
                include: {
                    empresa: true,
                    maquinas: {
                        where: { ativo: true },
                        select: { id_maquina: true, nome: true, status_atual: true }
                    },
                    gestores: {
                        include: {
                            gestor: {
                                select: { id_usuario: true, nome: true, email: true }
                            }
                        }
                    }
                }
            });
            return setor || null;
        } catch (error) {
            console.error('Erro ao obter setor por ID:', error);
            throw error;
        }
    }

    // Atualiza os dados de um setor
    static async atualizarSetor(id_setor, id_empresa, dados) {
        try {
            const setor = await prisma.setores.updateMany({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                },
                data: dados
            });

            if (setor.count === 0) {
                throw new Error('Setor não encontrado ou não pertence à empresa');
            }
            return true;
        } catch (error) {
            console.error('Erro ao atualizar setor:', error);
            throw error;
        }
    }

    // Deleta um setor
    static async deletarSetor(id_setor, id_empresa) {
        try {
            const result = await prisma.setores.deleteMany({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                }
            });
            if (result.count === 0) {
                throw new Error('Setor não encontrado ou não pertence à empresa');
            }
        } catch (error) {
            console.error('Erro ao deletar setor:', error);
            throw error;
        }
    }

    // Associa um gestor a um setor
    static async associarGestor(id_setor, id_gestor, id_empresa) {
        try {
            const associacao = await prisma.setor_Gestor.create({
                data: {
                    id_setor: id_setor,
                    id_gestor: id_gestor,
                    id_empresa: id_empresa
                }
            });
            return associacao;
        } catch (error) {
            console.error('Erro ao associar gestor ao setor:', error);
            throw error;
        }
    }

    // Remove a associação de um gestor com um setor
    static async removerGestor(id_setor, id_gestor, id_empresa) {
        try {
            const result = await prisma.setor_Gestor.deleteMany({
                where: {
                    id_setor: id_setor,
                    id_gestor: id_gestor,
                    id_empresa: id_empresa
                }
            });
            if (result.count === 0) {
                throw new Error('Associação não encontrada');
            }
        } catch (error) {
            console.error('Erro ao remover gestor do setor:', error);
            throw error;
        }
    }

    // Lista gestores de um setor
    static async listarGestoresDoSetor(id_setor, id_empresa) {
        try {
            const gestores = await prisma.setor_Gestor.findMany({
                where: {
                    id_setor: id_setor,
                    id_empresa: id_empresa
                },
                include: {
                    gestor: {
                        select: { id_usuario: true, nome: true, email: true, tipo_usuario: true }
                    }
                }
            });
            return gestores;
        } catch (error) {
            console.error('Erro ao listar gestores do setor:', error);
            throw error;
        }
    }

    // Lista setores de um gestor
    static async listarSetoresDoGestor(id_gestor, id_empresa) {
        try {
            const setores = await prisma.setor_Gestor.findMany({
                where: {
                    id_gestor: id_gestor,
                    id_empresa: id_empresa
                },
                include: {
                    setor: {
                        select: { id_setor: true, nome_setor: true }
                    }
                }
            });
            return setores;
        } catch (error) {
            console.error('Erro ao listar setores do gestor:', error);
            throw error;
        }
    }

}

export default SetorModel;