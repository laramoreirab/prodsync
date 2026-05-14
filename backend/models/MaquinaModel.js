import prisma from '../config/prisma.js';
import { paginarPrisma } from '../dev-utils/paginacaoUtil.js';
import OEEModel from './OEEModel.js';

class MaquinaModel {
    static calcularDuracaoMinutos(inicio, fim) {
        if (!inicio || !fim) return 0;

        const duracao = (new Date(fim) - new Date(inicio)) / 1000 / 60;
        return Number.isFinite(duracao) && duracao > 0 ? duracao : 0;
    }

    static inicioDoDia(data) {
        const inicio = new Date(data);
        inicio.setHours(0, 0, 0, 0);
        return inicio;
    }

    static fimDoDia(data) {
        const fim = new Date(data);
        fim.setHours(23, 59, 59, 999);
        return fim;
    }

    static criarMapaUltimosDias(quantidadeDias = 7) {
        const dias = [];
        const hoje = this.inicioDoDia(new Date());

        for (let i = quantidadeDias - 1; i >= 0; i--) {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() - i);
            dias.push(data.toISOString().slice(0, 10));
        }

        return dias;
    }

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
    static async criarMaquina(id_empresa, id_setor, categoria, nome, serie, capacidade, status, data_aquisicao, id_operador, imagem) {
        try {
            const maquina = await prisma.maquinas.create({
                data: {
                    id_empresa: id_empresa,
                    id_setor: id_setor ? parseInt(id_setor) : null,
                    categoria: categoria,
                    nome: nome,
                    serie: serie,
                    capacidade: capacidade,
                    status: status,
                    status_atual: undefined,
                    data_aquisicao: data_aquisicao ? new Date(data_aquisicao) : null,
                    id_operador: id_operador ? parseInt(id_operador) : null,
                    imagem: imagem
                }
            });
            return maquina;
        } catch (error) {
            console.error('Erro ao criar máquina:', error);
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
    static async atualizarDados(id_maquina, id_empresa, dados) {
        try {
            const dataUpdate = {
                nome: dados.nome,
                serie: dados.serie,
                id_setor: dados.id_setor ? parseInt(dados.id_setor) : undefined,
                id_categoria: dados.id_categoria ? parseInt(dados.id_categoria) : undefined,
                capacidade: dados.capacidade,
                status: dados.status,
                status_atual: dados.status || undefined,
                data_aquisicao: dados.data_aquisicao ? new Date(dados.data_aquisicao) : undefined,
                id_operador: dados.id_operador ? parseInt(dados.id_operador) : undefined,
            };

            if (dados.imagem) {
                dataUpdate.imagem = dados.imagem;
            }

            const atualizarMaquina = await prisma.maquinas.updateMany({
                where: {
                    id_maquina: id_maquina,
                    id_empresa: id_empresa,
                    ativo: true
                },
                data: dataUpdate
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

    static async obterMaquinaOperador(id_empresa, id_operador){
        try {
            const resposta = await prisma.escalaTrabalho.findFirst({
                where:{
                    id_empresa: id_empresa,
                    id_operador: Number(id_operador)
                },
                select:{
                    id_maquina: true
                }
            })
            return resposta
            
        } catch (error) {
            console.error('Erro ao obter máquina pelo ID do operador no banco', error);
            throw error;
        }
    }

    static async eficienciaMaquina(id_empresa, id_operador) {
        const escala = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa: Number(id_empresa),
                id_operador: Number(id_operador),
                id_maquina: { not: null }
            },
            select: { id_maquina: true }
        });

        if (!escala?.id_maquina) return [];

        const dias = this.criarMapaUltimosDias(7);
        return Promise.all(dias.map(async (dia, index) => {
            const inicio = this.inicioDoDia(new Date(`${dia}T00:00:00`));
            const fim = this.fimDoDia(inicio);
            const oee = await OEEModel.obterOeeMaquina(escala.id_maquina, Number(id_empresa), inicio, fim);

            return {
                dia: `Dia ${index + 1}`,
                eficiencia: oee.oee
            };
        }));
    }

    static mapearStatusAndon(status) {
        if (status === 'Produzindo') return 'emProducao';
        if (status === 'Setup') return 'emSetup';
        return 'emParada';
    }

    static formatarTempoDesde(data) {
        if (!data) return 'Sem evento recente';

        const minutos = Math.max(0, Math.round((new Date() - new Date(data)) / 1000 / 60));
        const horas = Math.floor(minutos / 60);
        const resto = minutos % 60;

        if (horas <= 0) return `${resto} min no status`;
        if (resto === 0) return `${horas}h no status`;
        return `${horas}h ${resto}min no status`;
    }

    static async obterSetorOperador(id_empresa, id_operador) {
        const escala = await prisma.escalaTrabalho.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador)
            },
            select: {
                id_setor: true,
                id_maquina: true
            }
        });

        if (escala?.id_setor) return escala.id_setor;

        if (escala?.id_maquina) {
            const maquinaEscala = await prisma.maquinas.findFirst({
                where: { id_empresa, id_maquina: escala.id_maquina, ativo: true },
                select: { id_setor: true }
            });
            if (maquinaEscala?.id_setor) return maquinaEscala.id_setor;
        }

        const maquina = await prisma.maquinas.findFirst({
            where: {
                id_empresa,
                id_operador: Number(id_operador),
                ativo: true
            },
            select: { id_setor: true }
        });

        return maquina?.id_setor ?? null;
    }

    static async montarFiltroAndon(id_empresa, scope, id_operador) {
        const filtro = { id_empresa, ativo: true };

        if (scope === 'sector') {
            const id_setor = await this.obterSetorOperador(id_empresa, id_operador);
            if (!id_setor) return { ...filtro, id_maquina: -1 };
            filtro.id_setor = id_setor;
        }

        return filtro;
    }

    static async obterAndonStatus(id_empresa, scope = 'factory', id_operador = null) {
        const where = await this.montarFiltroAndon(id_empresa, scope, id_operador);
        const agrupados = await prisma.maquinas.groupBy({
            by: ['status_atual'],
            where,
            _count: { status_atual: true }
        });

        return agrupados.reduce((acc, item) => {
            acc[this.mapearStatusAndon(item.status_atual)] += item._count.status_atual;
            return acc;
        }, {
            emProducao: 0,
            emSetup: 0,
            emParada: 0
        });
    }

    static calcularProdutividade(qtdPlanejada, qtdProduzida) {
        if (!qtdPlanejada || qtdPlanejada <= 0) return 0;
        return Math.min(100, Math.round((qtdProduzida / qtdPlanejada) * 100));
    }

    static async obterAndonRanking(id_empresa, scope = 'factory', id_operador = null) {
        const where = await this.montarFiltroAndon(id_empresa, scope, id_operador);
        const maquinas = await prisma.maquinas.findMany({
            where,
            select: {
                id_maquina: true,
                nome: true,
                serie: true,
                setor: {
                    select: {
                        id_setor: true,
                        nome_setor: true
                    }
                },
                ordens_producao: {
                    select: { qtd_planejada: true }
                },
                apontamentos: {
                    select: {
                        qtd_boa: true,
                        qtd_refugo: true
                    }
                }
            }
        });

        const agrupado = new Map();

        for (const maquina of maquinas) {
            const chave = scope === 'sector'
                ? String(maquina.id_maquina)
                : String(maquina.setor?.id_setor ?? 'sem-setor');
            const nome = scope === 'sector'
                ? (maquina.serie ?? maquina.nome)
                : (maquina.setor?.nome_setor ?? 'Sem setor');
            const atual = agrupado.get(chave) ?? { setor: nome, planejado: 0, produzido: 0 };

            atual.planejado += maquina.ordens_producao.reduce((acc, ordem) => acc + (ordem.qtd_planejada ?? 0), 0);
            atual.produzido += maquina.apontamentos.reduce(
                (acc, apontamento) => acc + (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0),
                0
            );

            agrupado.set(chave, atual);
        }

        return Array.from(agrupado.values())
            .map(item => ({
                setor: item.setor,
                produtividade: this.calcularProdutividade(item.planejado, item.produzido)
            }))
            .sort((a, b) => b.produtividade - a.produtividade)
            .slice(0, 8);
    }

    static async montarCardAndon(maquina, id_empresa) {
        const ordemAtual = maquina.ordens_producao?.[0];
        const ultimoEvento = maquina.historico_eventos?.[0];
        const oee = await OEEModel.obterOeeMaquina(maquina.id_maquina, id_empresa);
        const produzido = maquina.apontamentos.reduce(
            (acc, apontamento) => acc + (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0),
            0
        );

        return {
            id: String(maquina.id_maquina),
            codigo: maquina.serie ?? maquina.nome,
            status: this.mapearStatusAndon(maquina.status_atual),
            operador: maquina.operador?.nome ?? 'Sem operador',
            detalheLabel: ordemAtual?.produto ? 'Produto' : 'OP',
            detalheValor: ordemAtual?.produto ?? ordemAtual?.codigo_lote ?? 'Sem OP ativa',
            metaTurno: `${produzido}/${ordemAtual?.qtd_planejada ?? 0}`,
            metaDia: `${produzido}/${ordemAtual?.qtd_planejada ?? 0}`,
            oee: oee.oee ?? 0,
            tempoStatus: this.formatarTempoDesde(ultimoEvento?.inicio ?? maquina.data_ativacao)
        };
    }

    static async obterAndonSecoes(id_empresa, scope = 'factory', id_operador = null) {
        const where = await this.montarFiltroAndon(id_empresa, scope, id_operador);
        const maquinas = await prisma.maquinas.findMany({
            where,
            include: {
                setor: {
                    select: {
                        id_setor: true,
                        nome_setor: true
                    }
                },
                operador: {
                    select: {
                        nome: true
                    }
                },
                ordens_producao: {
                    orderBy: { data_inicio: 'desc' },
                    take: 1,
                    select: {
                        codigo_lote: true,
                        produto: true,
                        qtd_planejada: true
                    }
                },
                apontamentos: {
                    select: {
                        qtd_boa: true,
                        qtd_refugo: true
                    }
                },
                historico_eventos: {
                    orderBy: { inicio: 'desc' },
                    take: 1,
                    select: {
                        inicio: true
                    }
                }
            },
            orderBy: [
                { id_setor: 'asc' },
                { nome: 'asc' }
            ]
        });

        const secoes = new Map();

        for (const maquina of maquinas) {
            const idSecao = String(maquina.setor?.id_setor ?? 'sem-setor');
            const secao = secoes.get(idSecao) ?? {
                id: idSecao,
                titulo: maquina.setor?.nome_setor ?? 'Sem setor',
                maquinas: []
            };

            secao.maquinas.push(await this.montarCardAndon(maquina, id_empresa));
            secoes.set(idSecao, secao);
        }

        return Array.from(secoes.values()).filter(secao => secao.maquinas.length > 0);
    }

    // -------------------------------------dashboard--------------------------------------------------
    static async taxaCumprimentoMetaPorSetor(id_empresa) {
        try {
            // busca ordens de produção agrupadas por setor com qtd planejada
            const ordens = await prisma.ordemProducao.findMany({
                where: { id_empresa },
                select: {
                    qtd_planejada: true,
                    id_setor: true
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
            const setoresIds = [...new Set(ordens.map(ordem => ordem.id_setor).filter(Boolean))]
            const setoresInfo = await prisma.setores.findMany({
                where: {
                    id_empresa,
                    id_setor: {
                        in: setoresIds
                    }
                },
                select: {
                    id_setor: true,
                    nome_setor: true
                }
            })
            const setoresPorId = new Map(setoresInfo.map(setor => [setor.id_setor, setor.nome_setor]))

            for (const ordem of ordens) {
                const setor = setoresPorId.get(ordem.id_setor) ?? 'Sem setor'
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

    static async obterStatusGeralMaquinas(id_empresa) {
        try {
            const statusAgrupados = await prisma.maquinas.groupBy({
                by: ['status_atual'],
                where: {
                    id_empresa,
                    ativo: true
                },
                _count: {
                    status_atual: true
                },
                orderBy: {
                    _count: {
                        status_atual: 'desc'
                    }
                }
            });

            return statusAgrupados.map(status => ({
                name: status.status_atual,
                value: status._count.status_atual,
                status: status.status_atual,
                total: status._count.status_atual
            }));
        } catch (error) {
            console.error('Erro ao obter status geral das maquinas:', error);
            throw error;
        }
    }

    static async obterProducaoTotalMaquinas(id_empresa, dias) {
        try {
            const quantidadeDias = Number(dias) || 7;
            const chavesDias = this.criarMapaUltimosDias(quantidadeDias);
            const dataInicio = this.inicioDoDia(new Date(`${chavesDias[0]}T00:00:00`));

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    data_hora_fim: {
                        gte: dataInicio
                    }
                },
                select: {
                    data_hora_fim: true,
                    qtd_boa: true,
                    qtd_refugo: true
                },
                orderBy: {
                    data_hora_fim: 'asc'
                }
            });

            const producaoPorDia = new Map(chavesDias.map(dia => [
                dia,
                {
                    data: dia,
                    total: 0,
                }
            ]));

            for (const apontamento of apontamentos) {
                const dia = apontamento.data_hora_fim.toISOString().slice(0, 10);
                const acumulado = producaoPorDia.get(dia);

                if (acumulado) {
                    acumulado.produzidas += apontamento.qtd_boa ?? 0;
                    acumulado.refugo += apontamento.qtd_refugo ?? 0;
                    acumulado.total += (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0);
                }
            }

            return Array.from(producaoPorDia.values());
        } catch (error) {
            console.error('Erro ao obter producao total das maquinas:', error);
            throw error;
        }
    }

    static async obterMediaParadasPorDia(id_empresa, dias = 7) {
        try {
            const quantidadeDias = Number(dias) || 7;
            const chavesDias = this.criarMapaUltimosDias(quantidadeDias);
            const dataInicio = this.inicioDoDia(new Date(`${chavesDias[0]}T00:00:00`));

            const totalParadas = await prisma.historico_Eventos.count({
                where: {
                    id_empresa,
                    status_atual: {
                        in: ['Parada', 'Manutencao']
                    },
                    inicio: {
                        gte: dataInicio
                    }
                }
            });

            const media = quantidadeDias > 0 ? Number((totalParadas / quantidadeDias).toFixed(1)) : 0;

            return {
                titulo: 'Media de Paradas por Dia',
                valor: String(media),
                media,
                total_paradas: totalParadas,
                periodo_dias: quantidadeDias
            };
        } catch (error) {
            console.error('Erro ao obter media de paradas por dia:', error);
            throw error;
        }
    }

    static async obterPecasPorMinuto(id_empresa, dias = 7) {
        try {
            const quantidadeDias = Number(dias) || 7;
            const chavesDias = this.criarMapaUltimosDias(quantidadeDias);
            const dataInicio = this.inicioDoDia(new Date(`${chavesDias[0]}T00:00:00`));

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa,
                    data_hora_fim: {
                        gte: dataInicio
                    }
                },
                select: {
                    qtd_boa: true,
                    qtd_refugo: true,
                    data_hora_inicio: true,
                    data_hora_fim: true
                }
            });

            const totais = apontamentos.reduce((acc, apontamento) => {
                acc.pecas += (apontamento.qtd_boa ?? 0) + (apontamento.qtd_refugo ?? 0);
                acc.minutos += this.calcularDuracaoMinutos(
                    apontamento.data_hora_inicio,
                    apontamento.data_hora_fim
                );
                return acc;
            }, { pecas: 0, minutos: 0 });

            const pecasPorMinuto = totais.minutos > 0
                ? Number((totais.pecas / totais.minutos).toFixed(2))
                : 0;

            return {
                titulo: 'Pecas por Minuto',
                valor: String(pecasPorMinuto)
                // pecas_por_minuto: pecasPorMinuto,
                // total_pecas: totais.pecas,
                // tempo_producao_minutos: Number(totais.minutos.toFixed(1))
            };
        } catch (error) {
            console.error('Erro ao obter pecas por minuto:', error);
            throw error;
        }
    }

    static async obterResumoOeeMaquina(id_maquina, id_empresa) {
        try {
            return await OEEModel.obterOeeMaquina(id_maquina, id_empresa);
        } catch (error) {
            console.error('Erro ao obter resumo OEE da maquina:', error);
            throw error;
        }
    }

    static async obterEvolucaoOeeMaquina(id_maquina, id_empresa) {
        try {
            return await OEEModel.obterEvolucaoOeeMaquina(id_maquina, id_empresa);
        } catch (error) {
            console.error('Erro ao obter evolucao OEE da maquina:', error);
            throw error;
        }
    }

    static async obterVelocidadeMaquina(id_maquina, id_empresa) {
        try {
            const [apontamentoAtual, ordemAtual] = await Promise.all([
                prisma.apontamento.findFirst({
                    where: {
                        id_maquina,
                        id_empresa
                    },
                    orderBy: {
                        data_hora_fim: 'desc'
                    }
                }),
                prisma.ordemProducao.findFirst({
                    where: {
                        id_maquina,
                        id_empresa,
                        status_op: {
                            in: ['Em_Andamento', 'Setup', 'Parada', 'Finalizada']
                        }
                    },
                    orderBy: {
                        data_inicio: 'desc'
                    }
                })
            ]);

            const tempoAtualMinutos = this.calcularDuracaoMinutos(
                apontamentoAtual?.data_hora_inicio,
                apontamentoAtual?.data_hora_fim
            );
            const pecasAtuais = (apontamentoAtual?.qtd_boa ?? 0) + (apontamentoAtual?.qtd_refugo ?? 0);
            const velocidadeAtual = tempoAtualMinutos > 0
                ? Number((pecasAtuais / tempoAtualMinutos).toFixed(2))
                : 0;

            const tempoPadraoMinutos = this.calcularDuracaoMinutos(
                ordemAtual?.data_inicio,
                ordemAtual?.data_fim
            );
            const velocidadePadrao = tempoPadraoMinutos > 0
                ? Number(((ordemAtual?.qtd_planejada ?? 0) / tempoPadraoMinutos).toFixed(2))
                : 0;

            return {
                velocidade_atual: velocidadeAtual,
                velocidade_padrao: velocidadePadrao,
                unidade: 'pecas/minuto',
                percentual: velocidadePadrao > 0
                    ? Number(((velocidadeAtual / velocidadePadrao) * 100).toFixed(1))
                    : 0,
                referencia_apontamento: apontamentoAtual?.id_apontamento ?? null,
                referencia_ordem: ordemAtual?.id_ordem ?? null
            };
        } catch (error) {
            console.error('Erro ao obter velocidade da maquina:', error);
            throw error;
        }
    }

    static async obterTopMotivosParada(id_maquina, id_empresa) {
        try {
            const motivosAgrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_maquina,
                    id_empresa,
                    id_motivo_parada: {
                        not: null
                    },
                    status_atual: {
                        in: ['Parada', 'Setup']
                    }
                },
                _count: {
                    id_motivo_parada: true
                },
                _sum: {
                    duracao: true
                },
                orderBy: {
                    _count: {
                        id_motivo_parada: 'desc'
                    }
                },
                take: 3
            });

            const idsMotivos = motivosAgrupados.map(motivo => motivo.id_motivo_parada);
            const motivos = await prisma.motivos_Parada.findMany({
                where: {
                    id_empresa,
                    id_motivo: {
                        in: idsMotivos
                    }
                },
                select: {
                    id_motivo: true,
                    descricao: true,
                    tipo: true
                }
            });

            const motivosPorId = new Map(motivos.map(motivo => [motivo.id_motivo, motivo]));

            return motivosAgrupados.map(motivo => {
                const dadosMotivo = motivosPorId.get(motivo.id_motivo_parada);

                return {
                    id_motivo: motivo.id_motivo_parada,
                    descricao: dadosMotivo?.descricao ?? 'Sem motivo informado',
                    tipo: dadosMotivo?.tipo ?? null,
                    total_eventos: motivo._count.id_motivo_parada,
                    duracao_total_minutos: motivo._sum.duracao ?? 0
                };
            });
        } catch (error) {
            console.error('Erro ao obter top motivos de parada:', error);
            throw error;
        }
    }

    static async obterRefugosMaquina(id_maquina, id_empresa) {
        try {
            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_maquina,
                    id_empresa,
                    qtd_refugo: {
                        gt: 0
                    }
                },
                select: {
                    qtd_refugo: true,
                    data_hora_fim: true,
                    id_ordemProducao: true,
                    ordem_producao: {
                        select: {
                            codigo_lote: true,
                            produto: true
                        }
                    }
                },
                orderBy: {
                    data_hora_fim: 'asc'
                }
            });

            const refugosPorDia = new Map();
            const refugosPorOrdem = new Map();

            for (const apontamento of apontamentos) {
                const dia = apontamento.data_hora_fim.toISOString().slice(0, 10);
                const refugo = apontamento.qtd_refugo ?? 0;

                refugosPorDia.set(dia, (refugosPorDia.get(dia) ?? 0) + refugo);

                const chaveOrdem = apontamento.id_ordemProducao;
                const ordem = refugosPorOrdem.get(chaveOrdem) ?? {
                    id_ordem: chaveOrdem,
                    codigo_lote: apontamento.ordem_producao?.codigo_lote ?? null,
                    produto: apontamento.ordem_producao?.produto ?? null,
                    qtd_refugo: 0
                };

                ordem.qtd_refugo += refugo;
                refugosPorOrdem.set(chaveOrdem, ordem);
            }

            return {
                por_dia: Array.from(refugosPorDia.entries()).map(([data, qtd_refugo]) => ({
                    data,
                    qtd_refugo
                })),
                por_ordem: Array.from(refugosPorOrdem.values()).sort((a, b) => b.qtd_refugo - a.qtd_refugo)
            };
        } catch (error) {
            console.error('Erro ao obter refugos da maquina:', error);
            throw error;
        }
    }

    static async obterHistoricoEventosTabela(id_maquina, id_empresa, limite = 50) {
        try {
            const [eventos, apontamentos] = await Promise.all([
                prisma.historico_Eventos.findMany({
                    where: {
                        id_maquina,
                        id_empresa
                    },
                    include: {
                        motivo_parada: {
                            select: {
                                id_motivo: true,
                                descricao: true,
                                tipo: true
                            }
                        },
                        ordem_producao: {
                            select: {
                                id_ordem: true,
                                codigo_lote: true,
                                produto: true
                            }
                        }
                    },
                    orderBy: {
                        inicio: 'desc'
                    },
                    take: limite
                }),
                prisma.apontamento.findMany({
                    where: {
                        id_maquina,
                        id_empresa
                    },
                    include: {
                        operador: {
                            select: {
                                id_usuario: true,
                                nome: true
                            }
                        },
                        ordem_producao: {
                            select: {
                                id_ordem: true,
                                codigo_lote: true,
                                produto: true
                            }
                        }
                    },
                    orderBy: {
                        data_hora_fim: 'desc'
                    },
                    take: limite
                })
            ]);

            const historicoEventos = eventos.map(evento => ({
                id: evento.id_evento,
                id_evento: evento.id_evento,
                tipo: evento.status_atual,
                data: evento.inicio,
                inicio: evento.inicio,
                fim: evento.termino,
                duracao_minutos: evento.duracao ?? this.calcularDuracaoMinutos(evento.inicio, evento.termino),
                motivo: evento.motivo_parada?.descricao ?? null,
                produzido: 0,
                refugo: 0,
                operador: null,
                ordem_producao: evento.ordem_producao
            }));

            const historicoApontamentos = apontamentos.map(apontamento => ({
                id: apontamento.id_apontamento,
                id_apontamento: apontamento.id_apontamento,
                tipo: 'Producao',
                data: apontamento.data_hora_inicio,
                inicio: apontamento.data_hora_inicio,
                fim: apontamento.data_hora_fim,
                duracao_minutos: this.calcularDuracaoMinutos(
                    apontamento.data_hora_inicio,
                    apontamento.data_hora_fim
                ),
                motivo: apontamento.observacao ?? null,
                produzido: apontamento.qtd_boa ?? 0,
                refugo: apontamento.qtd_refugo ?? 0,
                operador: apontamento.operador ?? null,
                ordem_producao: apontamento.ordem_producao
            }));

            return [...historicoEventos, ...historicoApontamentos]
                .sort((a, b) => new Date(b.inicio) - new Date(a.inicio))
                .slice(0, limite);
        } catch (error) {
            console.error('Erro ao obter historico de eventos da maquina:', error);
            throw error;
        }
    }

    // ----------------------------------------------------Tela de Gestor -----------------------------------------------------------
    static ultimosSeteDias() {
    const dias = []
    for (let i = 6; i >= 0; i--) {
      const data = new Date()
      data.setDate(data.getDate() - i)
      data.setHours(0, 0, 0, 0)
      dias.push(data.toISOString().split('T')[0])
    }
    return dias
  }
    static async pecasProduzidas7Dias(id_setor, id_empresa) {
    const dias = this.ultimosSeteDias()
    const inicio = new Date(dias[0])

    const apontamentos = await prisma.apontamento.findMany({
      where: {
        id_empresa,
        data_hora_inicio: { gte: inicio },
        maquina: { id_setor }
      },
      select: {
        qtd_boa:          true,
        qtd_refugo:       true,
        data_hora_inicio: true
      }
    })

    // agrupa por dia
    const agrupado = Object.fromEntries(
      dias.map((d, i) => [d, { dia: `Dia ${i + 1}`, qtd: 0 }])
    )

    for (const ap of apontamentos) {
      const chave = ap.data_hora_inicio.toISOString().split('T')[0]
      if (agrupado[chave]) {
        agrupado[chave].qtd += (ap.qtd_boa ?? 0) + (ap.qtd_refugo ?? 0)
      }
    }

    return Object.values(agrupado)
  }

   static async statusMaquinasSetor(id_setor, id_empresa) {
    const resultado = await prisma.maquinas.groupBy({
      by:    ['status_atual'],
      where: { id_empresa, id_setor, ativo: true },
      _count: { status_atual: true }
    })

    const nomeStatus = {
      Produzindo: 'Produzindo',
      Parada:     'Parada',
      Setup:      'Setup',
      Aguardando: 'Aguardando'
    }

    return resultado.map(r => ({
      name:  nomeStatus[r.status_atual] ?? r.status_atual,
      value: r._count.status_atual
    }))
  }
static async producaoMaquinasSetor(id_setor, id_empresa) {
    const resultado = await prisma.apontamento.groupBy({
      by:    ['id_maquina'],
      where: {
        id_empresa,
        maquina: { id_setor }
      },
      _sum:    { qtd_boa: true, qtd_refugo: true },
      orderBy: { _sum: { qtd_boa: 'desc' } }
    })

    const ids      = resultado.map(r => r.id_maquina)
    const maquinas = await prisma.maquinas.findMany({
      where:  { id_maquina: { in: ids } },
      select: { id_maquina: true, nome: true, serie: true }
    })

    const nomeMaquina = Object.fromEntries(
      maquinas.map(m => [m.id_maquina, m.serie ?? m.nome])
    )

    return resultado.map(r => ({
      maquina: nomeMaquina[r.id_maquina] ?? `Máquina ${r.id_maquina}`,
      qtd:   (r._sum.qtd_boa ?? 0) + (r._sum.qtd_refugo ?? 0)
    }))
  }

}

export default MaquinaModel;
