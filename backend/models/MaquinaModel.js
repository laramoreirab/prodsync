import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';

class MaquinaModel {

    //Lista as máquinas de uma empresa com paginação
    static async listarMaquinasPaginadas(id_empresa, paginacao) {
        try {
            // 1. Definimos APENAS as regras dessa busca específica
            const regrasDaBusca = {
                where: {
                    id_empresa: id_empresa,
                    ativo: true
                },
                orderBy: {
                    id_maquina: 'asc' // Mantém a lista organizada
                },
                // Se no futuro quiser incluir o Setor na resposta, é só descomentar a linha abaixo:
                // include: { setor: true, categoria: true }
            };

            const resultadoPaginado = await paginarPrisma(
                prisma.maquinas, // Diz qual tabela ele vai usar
                regrasDaBusca,   // Manda as regras
                paginacao        // Manda a página e o limite
            );

            return resultadoPaginado;
        } catch (error) {
            console.error('Erro ao listar máquinas paginadas no Model:', error);
            throw error;
        }
    }

    // Cria uma nova máquina
    static async criarMaquina(id_empresa, id_setor, id_categoria, nome, serie) {
        try {
            const maquina = await prisma.maquinas.create({
                data: {
                    id_empresa,
                    id_setor,
                    id_categoria,
                    nome,
                    serie
                }
            });
            return maquina;
        } catch (error) {
            console.error('Erro ao criar máquina: ', error);
            throw error;
        }
    }

    // Busca uma máquina específica por ID
    static async buscarMaquinaPorID(id_maquina, id_empresa) {
        try {
            const maquina = await prisma.maquinas.findFirst({
                where: {
                    id_maquina,
                    id_empresa,
                    ativo: true
                }
            });
            return maquina;
        } catch (error) {
            console.error('Erro ao buscar a máquina específica: ', error)
            throw error;
        }
    }

    // Atualiza dados cadastrais
    static async atualizarDados(id_maquina, id_empresa, nome, serie) {
        try {
            const atualizarMaquina = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa,
                    ativo: true
                },
                data: {
                    nome,
                    serie
                }
            });
            if (atualizarMaquina.count === 0) {
                throw new Error('Máquina não encontrada ou não pertence à empresa');
            }
            return atualizarMaquina;
        } catch (error) {
            console.error('Erro ao atualizar informações da máquina:', error)
            throw error;
        }
    }

    // Deleta/desativa uma máquina
    static async deletarMaquina(id_maquina, id_empresa) {
        try {
            const deletarMaquina = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa
                },
                data: {
                    ativo: false
                }
            });
            if (deletarMaquina.count === 0) {
                throw new Error('Máquina não encontrada ou não pertence à empresa');
            }
            return deletarMaquina;
        } catch (error) {
            console.error('Erro ao deletar máquina:', error);
            throw error;
        }
    }

    // Atualiza o status da máquina (Ex: string 'Produzindo', 'Parada')
    static async atualizarStatus(id_maquina, id_empresa, status_atual) {
        try {
            const atualizarStatus = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa,
                    ativo: true
                },
                data: {
                    status_atual: status_atual
                }
            });
            if (atualizarStatus.count === 0) {
                throw new Error('Máquina não encontrada ou não pertence à empresa');
            }
            return atualizarStatus;
        } catch (error) {
            console.error('Erro ao atualizar status da máquina:', error);
            throw error;
        }
    }

    // Lista as máquinas por status
    static async listarMaquinasPorStatus(id_empresa, status_atual) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    status_atual: status_atual,
                    ativo: true
                }
            });
            return maquinas;
        } catch (error) {
            console.error('Erro ao listar máquinas por status:', error);
            throw error;
        }
    }

    // Lista todas as máquinas de uma empresa
    static async listarMaquinasPorEmpresa(id_empresa) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    ativo: true
                }
            });
            return maquinas;
        } catch (error) {
            console.error('Erro ao listar todas as máquinas por empresa:', error);
            throw error;
        }
    }

    // Lista as máquinas por setor
    static async listarMaquinasPorSetor(id_empresa, id_setor) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    id_setor: id_setor,
                    ativo: true
                }
            });
            return maquinas;
        } catch (error) {
            console.error('Erro ao listar máquinas por setor:', error);
            throw error;
        }
    }

    // Lista as máquinas por categoria
    static async listarMaquinasPorCategoria(id_empresa, id_categoria) {
        try {
            const maquinas = await prisma.maquinas.findMany({
                where: {
                    id_empresa: id_empresa,
                    id_categoria: id_categoria,
                    ativo: true
                }
            });
            return maquinas;
        } catch (error) {
            console.error('Erro ao listar máquinas por categoria:', error);
            throw error;
        }
    }

    // Faz um "Raio-X" da máquina - informações em tempo real, última ordem de produção, último evento, escala atual e operador
    static async raioXMaquina(id_maquina, id_empresa) {
        try {
            const raioX = await prisma.maquinas.findFirst({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa,
                    ativo: true
                },
                include: {
                    ordens_producao: {
                        orderBy: { id_ordem: 'desc' },
                        take: 1
                    },
                    escala_trabalho: {
                        include: {
                            operador: {
                                select: { nome: true, id_usuario: true }
                            }
                        }
                    },
                    historico_eventos: {
                        orderBy: { inicio: 'desc' },
                        take: 1,
                        include: {
                            motivo_parada: true
                        }
                    }
                }
            });
            return raioX;
        } catch (error) {
            console.error('Erro ao obter informações em tempo real da máquina:', error);
            throw error;
        }
    }

    // -------------------------------------dashboard--------------------------------------------------
    static async taxaCumprimentoMetaPorSetor(id_empresa) {
        try {
            // busca ordens de produção agrupadas por setor com qtd planejada
            const ordens = await prisma.ordemProducao.findMany({
                where: { id_empresa },
                select: {
                    qtd_planejada: true,
                    id_setor: true,
                    setores: { select: { nome_setor: true } }
                }
            })

            // busca apontamentos com qtd produzida por setor
            const apontamentos = await prisma.apontamento.findMany({
                where: { id_empresa },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    maquina: {
                        select: {
                            setor: { select: { id_setor: true, nome_setor: true } }
                        }
                    }
                }
            })

            // agrupa qtd planejada por setor
            const planejadoPorSetor = {}
            for (const ordem of ordens) {
                const setor = ordem.setores?.nome_setor ?? 'Sem setor'
                if (!planejadoPorSetor[setor]) planejadoPorSetor[setor] = 0
                planejadoPorSetor[setor] += ordem.qtd_planejada ?? 0
            }

            // agrupa qtd produzida por setor
            const produzidoPorSetor = {}
            for (const ap of apontamentos) {
                const setor = ap.maquina?.setor?.nome_setor ?? 'Sem setor'
                if (!produzidoPorSetor[setor]) produzidoPorSetor[setor] = 0
                produzidoPorSetor[setor] += (ap.qtd_boa ?? 0) + (ap.qtd_refugo ?? 0)
            }

            // calcula a taxa de cumprimento de cada setor
            const setores = new Set([
                ...Object.keys(planejadoPorSetor),
                ...Object.keys(produzidoPorSetor)
            ])

            return Array.from(setores).map(setor => {
                const planejado = planejadoPorSetor[setor] ?? 0
                const produzido = produzidoPorSetor[setor] ?? 0

                const taxa = planejado > 0
                    ? Math.round((produzido / planejado) * 100)
                    : 0

                return {
                    setor,             // eixo X
                    taxa_cumprimento: taxa  // eixo Y — porcentagem
                }
            }).sort((a, b) => b.taxa_cumprimento - a.taxa_cumprimento)
        } catch (error) {
            console.error('Erro ao retornar a taxa de cumprimento de meta por setor no banco de dados:', error);
            throw error;
        }
    }
}

export default MaquinaModel;