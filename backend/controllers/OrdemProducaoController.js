import OrdemProducaoModel from '../models/OrdemProducaoModel.js'

const prioridadeMap = {
    'Crítica': 'Critica',
    'Critica': 'Critica',
    'Média': 'Media',
    'Media': 'Media',
    'Alta': 'Alta',
    'Baixa': 'Baixa'
}

class OrdemProducaoController {
    static async listarTodos(req, res) {
        try {
            const resultado = await OrdemProducaoModel.listarTodos(req.user.id_empresa, req.paginacao, req.query.setorId)
            return res.status(200).json({ sucesso: true, ...resultado })
        } catch (error) {
            console.error('Erro ao listar Ordens de Producao', error)
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel listar as ordens de producao'
            })
        }
    }

    static async buscarPorId(req, res) {
        try {
            const id_ordem = Number(req.params.id_ordem)
            if (!Number.isInteger(id_ordem) || id_ordem <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID da ordem inválido' })
            }

            const dados = await OrdemProducaoModel.buscarOrdem(id_ordem, req.user.id_empresa)
            if (!dados) {
                return res.status(404).json({ sucesso: false, erro: 'Ordem de Produção não encontrada' })
            }

            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao buscar Ordem de Produção', error)
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar a Ordem de Produção'
            })
        }
    }

    static async listarHistoricoEventos(req, res) {
        try {
            const id_ordem = Number(req.params.id_ordem);
            const id_empresa = req.user.id_empresa;
            const limite = parseInt(req.query.limite) || 50;

            if (!Number.isInteger(id_ordem) || id_ordem <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID da ordem inválido' });
            }

            const dados = await OrdemProducaoModel.listarEventosOrdem(id_ordem, id_empresa, limite);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar eventos da OP:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async listarApontamentos(req, res) {
        try {
            const id_ordem = Number(req.params.id_ordem);
            const id_empresa = req.user.id_empresa;
            const limite = parseInt(req.query.limite) || 50;

            if (!Number.isInteger(id_ordem) || id_ordem <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID da ordem inválido' });
            }

            const dados = await OrdemProducaoModel.listarApontamentosOrdem(id_ordem, id_empresa, limite);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao listar apontamentos da OP:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static validarPayload(body, parcial = false) {
        const erros = []
        const dados = {}

        const textoObrigatorio = (campo, nome) => {
            if (body[campo] === undefined && parcial) return
            if (!body[campo] || String(body[campo]).trim() === '') {
                erros.push(`${nome} e obrigatorio`)
                return
            }
            dados[campo] = String(body[campo]).trim()
        }

        textoObrigatorio('prioridade', 'Nivel de prioridade')
        textoObrigatorio('codigo_lote', 'Codigo do lote')
        textoObrigatorio('produto', 'Produto')

        if (dados.prioridade) {
            dados.prioridade = prioridadeMap[dados.prioridade] ?? dados.prioridade
        }

        if (body.id_setor !== undefined || !parcial) {
            const id_setor = Number(body.id_setor)
            if (!Number.isInteger(id_setor) || id_setor <= 0) erros.push('Setor e obrigatorio')
            else dados.id_setor = id_setor
        }

        if (body.id_maquina !== undefined || !parcial) {
            const id_maquina = Number(body.id_maquina)
            if (!Number.isInteger(id_maquina) || id_maquina <= 0) erros.push('Maquina e obrigatoria')
            else dados.id_maquina = id_maquina
        }

        if (body.qtd_planejada !== undefined || !parcial) {
            const qtd_planejada = Number(body.qtd_planejada)
            if (!Number.isFinite(qtd_planejada) || qtd_planejada <= 0) erros.push('Quantidade planejada e obrigatoria')
            else dados.qtd_planejada = qtd_planejada
        }

        if (body.data_inicio !== undefined || !parcial) {
            if (!body.data_inicio) erros.push('Data/hora de inicio e obrigatoria')
            else dados.data_inicio = body.data_inicio
        }

        if (body.data_fim !== undefined || !parcial) {
            if (!body.data_fim) erros.push('Data/hora de termino e obrigatoria')
            else dados.data_fim = body.data_fim
        }

        if (body.observacao_op !== undefined) dados.observacao_op = body.observacao_op ?? ''

        return { erros, dados }
    }

    static async criar(req, res) {
        try {
            const { erros, dados } = OrdemProducaoController.validarPayload(req.body)
            if (erros.length > 0) {
                return res.status(400).json({ sucesso: false, erro: 'Dados invalidos', detalhes: erros })
            }

            const ordem = await OrdemProducaoModel.criar({
                ...dados,
                id_empresa: req.user.id_empresa,
                status_op: 'Em_Andamento',
                observacao_op: dados.observacao_op || ''
            })

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Ordem de Producao registrada com sucesso',
                dados: ordem
            })
        } catch (error) {
            console.error('Erro ao criar Ordem de Producao', error)
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel criar Ordem de Producao'
            })
        }
    }

    static async atualizar(req, res) {
        try {
            const id_ordem = Number(req.params.id_ordem)
            if (!Number.isInteger(id_ordem) || id_ordem <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID da ordem invalido' })
            }

            const ordemExistente = await OrdemProducaoModel.buscarOrdem(id_ordem, req.user.id_empresa)
            if (!ordemExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Ordem de Producao nao encontrada',
                    mensagem: 'Ordem de Producao nao encontrada'
                })
            }

            const { erros, dados } = OrdemProducaoController.validarPayload(req.body, true)
            if (erros.length > 0) {
                return res.status(400).json({ sucesso: false, erro: 'Dados invalidos', detalhes: erros })
            }

            if (Object.keys(dados).length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneca pelo menos um campo para atualizar'
                })
            }

            const updateOrdem = await OrdemProducaoModel.atualizar(id_ordem, req.user.id_empresa, dados)

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Ordem de Producao atualizada com sucesso',
                dados: updateOrdem
            })
        } catch (error) {
            console.error('Erro ao atualizar Ordem de Producao', error)
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel atualizar Ordem de Producao'
            })
        }
    }

    static async deletar(req, res) {
        try {
            const id_ordem = Number(req.params.id_ordem)
            if (!Number.isInteger(id_ordem) || id_ordem <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID da ordem invalido' })
            }

            const ordemExistente = await OrdemProducaoModel.buscarOrdem(id_ordem, req.user.id_empresa)
            if (!ordemExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Ordem de Producao nao encontrada',
                    mensagem: 'Ordem de Producao nao encontrada'
                })
            }

            const resultado = await OrdemProducaoModel.deletar(id_ordem, req.user.id_empresa)

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Ordem de Producao excluida com sucesso',
                dados: { linhasAfetadas: resultado.count || 1 }
            })
        } catch (error) {
            console.error('Erro ao deletar Ordem de Producao', error)
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel deletar Ordem de Producao'
            })
        }
    }

    static async totalOPsAtivas(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalOPsAtivas(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de OPs ativas', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' })
        }
    }

    static async totalOPsAtrasadas(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalOPsAtrasadas(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de OPs atrasadas', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' })
        }
    }

    static async totalPecasBoas(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalPecasBoas(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de Pecas Boas produzidas', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' })
        }
    }

    static async totalRefugo(req, res) {
        try {
            const resultado = await OrdemProducaoModel.totalRefugo(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, resultado })
        } catch (error) {
            console.error('Erro ao exibir total de Refugo produzido', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' })
        }
    }

    static async progressoOP(req, res) {
        try {
            const id_ordem = Number(req.params.id_ordem)
            const dados = await OrdemProducaoModel.progressoOP(req.user.id_empresa, id_ordem)
            if (!dados) return res.status(404).json({ sucesso: false, erro: 'OP nao encontrada' })
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar grafico Progresso da OP:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async eficienciaGeral(req, res) {
        try {
            const dados = await OrdemProducaoModel.eficienciaGeral(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar grafico Eficiencia Geral Das OPs:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async top3OPsMaiorRefugo(req, res) {
        try {
            const dados = await OrdemProducaoModel.top3OPsMaiorRefugo(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar grafico Top 3 OPs com Maior Refugo:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async cargaPorSetor(req, res) {
        try {
            const dados = await OrdemProducaoModel.cargaPorSetor(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar grafico Carga de Trabalho Por Setor:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async statusOPs(req, res) {
        try {
            const dados = await OrdemProducaoModel.statusOPs(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar grafico Status das OPs', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async opsConcluidasPorDia(req, res) {
        try {
            const dados = await OrdemProducaoModel.opsConcluidasPorDia(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro ao retornar grafico OPs Concluidas', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
}

export default OrdemProducaoController
