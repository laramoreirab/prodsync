import OrdemProducaoModel from '../models/OrdemProducaoModel.js'

class OrdemProducaoController {
    static async listarTodos(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;

            const resultado = await OrdemProducaoModel.listarTodos(id_empresa, paginacao);

            return res.status(200).json({
                sucesso: true,
                ...resultado
            });
        } catch (error) {
            console.error('Erro ao listar Ordens de Produção', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar as ordens de produção'
            });
        }
    }

    static async criar(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { prioridade, codigo_lote, id_setor, id_maquina, qtd_planejada, produto, data_inicio, data_fim, observacao_op } = req.body

            if (!prioridade || prioridade.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Nível de Prioridade é obrigatório',
                    mensagem: 'Nível de Prioridade é obrigatório!'
                })
            };
            if (!codigo_lote || codigo_lote.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Código do lote é obrigatório',
                    mensagem: 'Código do lote é obrigatório!'
                })
            };
            if (!id_setor || id_setor.trim() == '' || isNaN(id_setor)) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Setor é obrigatório',
                    mensagem: 'Setor é obrigatório!'
                })
            };
            if (!id_maquina || id_maquina.trim() == '' || isNaN(id_maquina)) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Máquina é obrigatório',
                    mensagem: 'Máquina é obrigatório!'
                })
            };
            if (!qtd_planejada || qtd_planejada.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Quantidade Planejada é obrigatório',
                    mensagem: 'Quantidade Planejada é obrigatório!'
                })
            };
            if (!produto || produto.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Tipo de Peça é obrigatório',
                    mensagem: 'Tipo de Peça é obrigatório!'
                })
            };
            if (!data_inicio || data_inicio.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Data/hora de início é obrigatório',
                    mensagem: 'Data/hora de início é obrigatório!'
                })
            };
            if (!data_fim || data_fim.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Data/hora de término é obrigatório',
                    mensagem: 'Data/hora de término é obrigatório!'
                })
            };

            const dadosOP = {
                id_empresa: id_empresa,
                id_maquina: id_maquina,
                id_setor: id_setor,
                codigo_lote: codigo_lote,
                produto: produto,
                data_inicio: data_inicio,
                data_fim: data_fim,
                qtd_planejada: qtd_planejada,
                status_op: 'Aguardando',
                prioridade: prioridade,
                observacao_op: observacao_op
            }

            const registrarOP = await OrdemProducaoModel.criar(dadosOP)

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Ordem de Produção registrada com sucesso!'
            })
        } catch (error) {
            console.error('Erro ao criar Ordem de Produção', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar Ordem de Produção'
            });
        }
    }

    static async atualizar(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { id_ordem, prioridade, codigo_lote, id_setor, id_maquina, qtd_planejada, produto, data_inicio, data_fim, observacao_op } = req.body

            //verificar se ordem de produção existe
            const ordemExistente = await OrdemProducaoModel.buscarOrdem(id_ordem)
            if (!ordemExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Ordem de Produção não encontrada',
                    mensagem: 'Ordem de Produção não encontrada'
                })
            }

            // Preparar dados para atualização
            const dadosUpdateOrdem = {};

            if (prioridade !== undefined) { dadosUpdateOrdem.prioridade = prioridade }
            if (id_maquina !== undefined) { dadosUpdateOrdem.id_maquina = id_maquina }
            if (id_setor !== undefined) { dadosUpdateOrdem.id_setor = id_setor }
            if (qtd_planejada !== undefined) { dadosUpdateOrdem.qtd_planejada = qtd_planejada }
            if (codigo_lote !== undefined) { dadosUpdateOrdem.codigo_lote = codigo_lote }
            if (data_inicio !== undefined) { dadosUpdateOrdem.data_inicio = data_inicio }
            if (data_fim !== undefined) { dadosUpdateOrdem.data_fim = data_fim }
            if (produto !== undefined) { dadosUpdateOrdem.produto = produto }
            if (observacao_op !== undefined) { dadosUpdateOrdem.observacao_op = observacao_op }

            if (
                Object.keys(dadosUpdateOrdem).length === 0
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneça pelo menos um campo para atualizar'
                });
            }

            // Cada atualização só executa se tiver dados
            let updateOrdem = null;

            if (Object.keys(dadosUpdateOrdem).length > 0) {
                updateOrdem = await OrdemProducaoModel.atualizar(id_ordem, id_empresa, dadosUpdateOrdem)
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Ordem de Produção atualizada com sucesso',
                dados: {
                    ...updateOrdem
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar Ordem de Produção', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar Ordem de Produção'
            })
        }

    }

    static async deletar(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { id_ordem, id_maquina } = req.body;
            //verificar se ordem de produção existe
            const ordemExistente = await OrdemProducaoModel.buscarOrdem(id_ordem)
            if (!ordemExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Ordem de Produção não encontrada',
                    mensagem: 'Ordem de Produção não encontrada'
                })
            }
            const resultado = await OrdemProducaoModel.deletar(id_ordem, id_empresa);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Ordem de Produção excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });

        } catch (error) {
            console.error('Erro ao deletar Ordem de Produção', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível deletar Ordem de Produção'
            })
        }
    }

    static async totalOPsAtivas(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalOPsAtivas(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de OPs ativas', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível xibir total de OPs ativas'
            })
        }
    }
    static async totalOPsAtrasadas(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalOPsAtrasadas(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de OPs atrasadas', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível xibir total de OPs atrasadas'
            })
        }
    }
    static async totalPecasBoas(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalPecasBoas(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de Peças Boas produzidas', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível xibir total de Peças Boas produzidas'
            })
        }
    }
    static async totalRefugo(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalRefugo(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de Refugo produzido', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível xibir total de Refugo produzido'
            })
        }
    }
    // -----------------------------------Dashboard da página especifica das OP ------------------------------------------------

    static async progressoOP(req, res) {
        try {
            const { id_ordem } = req.body
            const dados = await OPDashboardModel.progressoOP(
                req.user.id_empresa,
                id_ordem
            )
            if (!dados) return res.status(404).json({ sucesso: false, erro: 'OP não encontrada' })

            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar gráfico Progresso da OP:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // --------------------------------------Dashboard Ordem de Produção----------------------------------------------------------

    static async eficienciaGeral(req, res) {
        try {
            const dados = await OrdemProducaoModelModel.eficienciaGeral(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar gráfico Eficiência Geral Das OPs:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async top3OPsMaiorRefugo(req, res) {
        try {
            const dados = await OrdemProducaoModel.top3OPsMaiorRefugo(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar gráfico Top 3 OPs com Maior Refugo:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async cargaPorSetor(req, res) {
        try {
            const dados = await OrdemProducaoModel.cargaPorSetor(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar gráfico Carga de Trabalho Por Setor:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async statusOPs(req, res) {
        try {
            const dados = await OrdemProducaoModel.statusOPs(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar gráfico Status das OPs', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async opsConcluídasPorDia(req, res) {
        try {
            const dados = await OrdemProducaoModel.opsConcluídasPorDia(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar gráfico OPs Concluídas', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

}

export default OrdemProducaoController;
