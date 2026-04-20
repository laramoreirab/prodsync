// utils/paginacaoUtil.js

import  prisma  from '../config/prisma.js'; // Ajuste o caminho se necessário

/**
 * Função genérica para paginar qualquer tabela do Prisma
 * @param {Object} modeloPrisma - A tabela do Prisma (ex: prisma.maquinas)
 * @param {Object} argsDaBusca - Objeto contendo o 'where', 'include', 'orderBy' (opcionais)
 * @param {Object} paginacao - Objeto que vem do req.paginacao { pagina, limite }
 */

export const paginarPrisma = async (modeloPrisma, argsDaBusca = {}, paginacao) => {
    try {
        const { pagina, limite } = paginacao;
        const pular = (pagina - 1) * limite;

        // Fazemos as duas consultas simultaneamente
        const [dados, totalItens] = await prisma.$transaction([
            modeloPrisma.findMany({
                ...argsDaBusca, // Injeta as regras de busca (filtros, ordenação, etc)
                skip: pular,
                take: limite,
            }),
            modeloPrisma.count({
                where: argsDaBusca.where || {} // Conta usando os mesmos filtros
            })
        ]);

        const totalPaginas = Math.ceil(totalItens / limite);

        // Retorna no formato padronizado que o Controller espera
        return {
            dados,
            meta: {
                totalItens,
                itensPorPagina: limite,
                totalPaginas,
                paginaAtual: pagina
            }
        };
    } catch (error) {
        console.error('Erro no utilitário de paginação:', error);
        throw error;
    }
};