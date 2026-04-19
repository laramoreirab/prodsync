import ApontamentoModel from '../models/ApontamentoModel'

class ApontamentoController {
    //possível listagem de apontamentos no perfil do operario
    static async criarApontamento(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_operador = req.user.id_usuario;
            const { id_ordemProducao, id_maquina, id_turno, qtd_boa, qtd_refugo, incio, fim, observacao } = req.body;

            //validações básicas
            if (!id_ordemProducao || id_ordemProducao === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Ordem de produção é obrigatória',
                    mensagem: 'Ordem de produção é obrigatório!'
                })
            };
            if (!id_maquina || id_maquina === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Máquina é obrigatório',
                    mensagem: 'Máquina é obrigatório!'
                })
            };
            if (!id_turno || id_turno === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Turno é obrigatório',
                    mensagem: 'Turno é obrigatório!'
                })
            };
            if (!qtd_boa || qtd_boa === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Quantidade boa produzida é obrigatória',
                    mensagem: 'Quantidade boa produzida é obrigatória!'
                })
            };
            if (!qtd_refugo || qtd_refugo === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Quantidade de refugo é obrigatória',
                    mensagem: 'Quantidade de refugo é obrigatório!'
                })
            };
            if (!incio || incio === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Data/hora de início é obrigatória',
                    mensagem: 'Data/hora de início é obrigatória!'
                })
            };
            if (!fim || fim === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Data/hora de término é obrigatória',
                    mensagem: 'Data/hora de término é obrigatória!'
                })
            };

            const dadosApontamento = {
                id_empresa: id_empresa,
                id_ordemProducao: id_ordemProducao,
                id_maquina: id_empresa,
                id_operador: id_operador,
                id_turno: id_turno,
                qtd_boa: qtd_boa,
                qtd_refugo: qtd_refugo,
                data_hora_inicio: incio,
                data_hora_fim: fim,
                observacao: observacao || null
            }

            const registroApontamento = await ApontamentoModel.criar(dadosApontamento);
            if (!registroApontamento) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Não foi possível registrar apontamento, registro não retornado',
                    mensagem: 'Não foi possível registrar apontamento, registro não retornado!'
                })
            }
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Apontamento registrado com sucesso!'
            })
        } catch (error) {
            console.error('Erro ao registrar apontamento', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar apontamento'
            })
        }
    }

    static async atualizarApontamento(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_operador = req.user.id_usuario;
            const { id_apontamento, id_ordemProducao, id_maquina, id_turno, qtd_boa, qtd_refugo, incio, fim, observacao } = req.body;

            //verificar se apontamento existe
            const apontamentoExistente = await ApontamentoModel.buscarApontamentoId(id_empresa, id_apontamento, id_operador)
            if (!apontamentoExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Apontamento não encontrado',
                    mensagem: 'Apontamento não encontrado'
                })
            }

            // Preparar dados para atualização
            const dadosUpdateApontamento = {};

            if (id_ordemProducao !== undefined) { dadosUpdateApontamento.id_ordemProducao = id_ordemProducao }
            if (id_maquina !== undefined) { dadosUpdateApontamento.id_maquina = id_maquina }
            if (id_turno !== undefined) { dadosUpdateApontamento.id_turno = id_turno }
            if (qtd_boa !== undefined) { dadosUpdateApontamento.qtd_boa = qtd_boa }
            if (qtd_refugo !== undefined) { dadosUpdateApontamento.qtd_refugo = qtd_refugo }
            if (incio !== undefined) { dadosUpdateApontamento.data_hora_incio = incio }
            if (fim !== undefined) { dadosUpdateApontamento.data_hora_fim = fim }
            if (observacao !== undefined) { dadosUpdateApontamento.observacao = observacao }

            if (
            Object.keys(dadosUpdateApontamento).length === 0
        ) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Nenhum dado para atualizar',
                mensagem: 'Forneça pelo menos um campo para atualizar'
            });
        }

        // Cada atualização só executa se tiver dados
        let updateApontamento = null;

        if (Object.keys(dadosUpdateApontamento).length > 0) {
            updateApontamento = await ApontamentoModel.atualizar(id_apontamento, id_empresa, dadosUpdateApontamento)
        }

        return res.status(200).json({
                sucesso: true,
                mensagem: 'Apontamento atualizado com sucesso',
                dados: {
                    ...updateApontamento
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar apontamento', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar apontamento'
            })
        }
    }

    static async deletarApontamento(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_operario = req.user.id_usuario;
            const id_apontamento = req.body;

            //verificar se apontamento existe
            const apontamentoExistente = await ApontamentoModel.buscarApontamentoId(id_empresa, id_apontamento, id_operario)
            if (!apontamentoExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Apontamento não encontrado',
                    mensagem: 'Apontamento não encontrado'
                })
            }

            const resultado = await ApontamentoModel.deletar(id_empresa, id_operario, id_apontamento);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Apontamento excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });

        } catch (error) {
            console.error('Erro ao deletar apontamento', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível deletar apontamento'
            })
        }
    }
}

export default ApontamentoController