import EventoModel from '../models/EventoModel.js';

class EventoController {
    static async listarTodos(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;
            const resultado = await EventoModel.listarTodos(id_empresa, paginacao);

            return res.status(200).json({
                sucesso: true,
                ...resultado
            });
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel listar os eventos'
            });
        }
    }
    //listar as paradas justificadas
    static async listarJustificadas(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;
            const resultado = await EventoModel.listarJustificadas(id_empresa, paginacao);

            return res.status(200).json({ sucesso: true, ...resultado });
        } catch (error) {
            console.error('Erro ao listar eventos justificados:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel listar os eventos justificados'
            });
        }
    }
    //listar as tabelas não justificadas
    static async listarNaoJustificadas(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;
            const resultado = await EventoModel.listarNaoJustificadas(id_empresa, paginacao);

            return res.status(200).json({ sucesso: true, ...resultado });
        } catch (error) {
            console.error('Erro ao listar eventos nao justificados:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel listar os eventos nao justificados'
            });
        }
    }

    static async registrarEventoMaquina(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_maquina = Number(req.body.id_maquina);
            const { status_maquina } = req.body;

            if (!status_maquina || String(status_maquina).trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Status da maquina e obrigatorio'
                });
            }

            if (!Number.isInteger(id_maquina) || id_maquina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID da maquina invalido'
                });
            }

            const evento = await EventoModel.registrarEventoMaquina(
                id_empresa,
                status_maquina,
                id_maquina,
                new Date()
            );

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Evento registrado com sucesso',
                dados: evento
            });
        } catch (error) {
            console.error('Erro ao registrar evento:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel registrar o evento'
            });
        }
    }

    static async registrarEventoSistema(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const {
                status_maquina,
                setor_afetado,
                maquinas,
                inicio,
                fim,
                id_motivo_parada,
                observacao
            } = req.body;

            if (!status_maquina || String(status_maquina).trim() === '') {
                return res.status(400).json({ sucesso: false, erro: 'Status da maquina e obrigatorio' });
            }
            // Valida se enviou pelo menos uma máquina
            if (!Array.isArray(maquinas) || maquinas.length === 0) {
                return res.status(400).json({ sucesso: false, erro: 'Selecione pelo menos uma maquina' });
            }

            if (!inicio || !fim) {
                return res.status(400).json({ sucesso: false, erro: 'Inicio e fim do evento sao obrigatorios' });
            }

            if (!id_motivo_parada) {
                return res.status(400).json({ sucesso: false, erro: 'Motivo de parada e obrigatorio' });
            }

            const dados = await EventoModel.registrarEventoSistema(
                id_empresa,
                status_maquina,
                setor_afetado,
                maquinas,
                inicio,
                fim,
                id_motivo_parada,
                observacao
            );

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Eventos registrados com sucesso para as maquinas selecionadas',
                dados
            });
        } catch (error) {
            console.error('Erro ao registrar evento multiplo:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Falha ao registrar evento multiplo'
            });
        }
    }

    static async justificarEvento(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_evento = Number(req.body.id_evento);
            const id_motivo_parada = Number(req.body.id_motivo_parada);
            const { observacao } = req.body;

            if (!Number.isInteger(id_evento) || id_evento <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID do evento invalido' });
            }

            if (!Number.isInteger(id_motivo_parada) || id_motivo_parada <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'O motivo da parada e obrigatorio para registrar justificativa'
                });
            }

            const possuiJustificativa = await EventoModel.verificaJustificativa(id_empresa, id_evento);
            if (possuiJustificativa) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'O evento ja possui justificativa'
                });
            }

            const dados = await EventoModel.justificar(id_empresa, id_evento, id_motivo_parada, observacao);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Justificativa registrada com sucesso',
                dados
            });
        } catch (error) {
            console.error('Erro ao justificar evento:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel registrar a justificativa do evento'
            });
        }
    }

    static async obterMotivosParadaFrequentes(req, res) {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : 10;
            const dados = await EventoModel.obterMotivosParadaFrequentes(req.user.id_empresa, limite);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter motivos de parada frequentes:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterTopMotivosSetup(req, res) {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : 3;
            const dados = await EventoModel.obterTopMotivosSetup(req.user.id_empresa, limite);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter top motivos de setup:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterPrincipaisMotivosRefugo(req, res) {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : 10;
            const dados = await EventoModel.obterPrincipaisMotivosRefugo(req.user.id_empresa, limite);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter principais motivos de refugo:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterTendenciaRefugo(req, res) {
        try {
            const dias = req.query.dias ? Number(req.query.dias) : 7;
            const dados = await EventoModel.obterTendenciaRefugo(req.user.id_empresa, dias);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter tendencia de refugo:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterParadasJustificadasComparativo(req, res) {
        try {
            const dados = await EventoModel.obterParadasJustificadasComparativo(req.user.id_empresa);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter comparativo de paradas:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterTopMotivosTempo(req, res) {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : 5;
            const dados = await EventoModel.obterTopMotivosTempo(req.user.id_empresa, limite);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter top motivos por tempo:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    // -------------------------------------Dashboards Página histórico de eventos------------------------------------------------------------------------------------------

    static async tempoParadoTempoProduzindoEvento(req, res) {
        try {
            const dados = await EventoModel.tempoParadoTempoProduzindoEvento(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Tempo Total Parado x Tempo total Produzindo geral da fábrica:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async top3MotivosParada(req, res){
        try {
            const dados = await EventoModel.top3MotivosParada(req.user.id_empresa)
            return res.status(200).json({sucesso: true, dados})
        } catch (error) {
            console.error('Erro no gráfico Top 3 Motivos de Parada:', error)
        return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
}
