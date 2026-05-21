import EventoModel from '../models/EventoModel.js';
import prisma from '../config/prisma.js';

class EventoController {
    static async listarTodos(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;
            const resultado = req.user.tipo === 'Operador'
                ? await EventoModel.listarPorOperador(id_empresa, req.user.id_usuario, paginacao)
                : await EventoModel.listarTodos(id_empresa, paginacao, req.query.setorId);

            // Normaliza para o formato esperado pelo frontend
            const dadosNormalizados = (resultado.dados || []).map(evento => ({
                id: evento.id_evento,
                id_evento: evento.id_evento,
                maquina: evento.maquina?.nome ?? '',
                id_maquina: evento.id_maquina,
                tipo: evento.status_atual === 'Setup' ? 'Setup' : 'Parada',
                status_maquina: evento.status_atual,
                setor_afetado: evento.setor_afetado,
                inicio: evento.inicio ? new Date(evento.inicio).toISOString() : null,
                fim: evento.termino ? new Date(evento.termino).toISOString() : null,
                duracao: evento.duracao ? `${Math.floor(evento.duracao / 60)}:${String(evento.duracao % 60).padStart(2, '0')}` : null,
                id_motivo_parada: evento.id_motivo_parada,
                motivo: evento.motivo_parada?.descricao ?? null,
                observacao: evento.observacao,
                justificada: !!evento.id_motivo_parada,
                inicio_formatado: evento.inicio ? new Date(evento.inicio).toLocaleString('pt-BR') : null,
            }));

            return res.status(200).json({
                sucesso: true,
                dados: dadosNormalizados,
                meta: resultado.meta
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
            const resultado = await EventoModel.listarJustificadas(id_empresa, paginacao, req.query.setorId);

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
            const resultado = await EventoModel.listarNaoJustificadas(id_empresa, paginacao, req.query.setorId);

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
            const status_maquina = req.body.status

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

    static async atualizarEvento(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_evento = Number(req.params.id);

            if (!Number.isInteger(id_evento) || id_evento <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID do evento invalido' });
            }

            const dados = await EventoModel.atualizarEventoSistema(id_empresa, id_evento, req.body);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Evento atualizado com sucesso',
                dados
            });
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel atualizar o evento'
            });
        }
    }

    static async justificarEvento(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_evento = Number(req.params.id ?? req.body.id_evento);
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

    static async obterEventoPendente(req, res) {
        try {
            const dados = await EventoModel.obterEventoPendente(
                req.user.id_empresa,
                req.user.tipo === 'Operador' ? req.user.id_usuario : null
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter evento pendente:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter evento pendente'
            });
        }
    }

    static async obterMotivosParadaFrequentes(req, res) {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : 10;
            const dados = await EventoModel.obterMotivosParadaFrequentes(req.user.id_empresa, limite, req.query.setorId);

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
            const dados = await EventoModel.obterParadasJustificadasComparativo(req.user.id_empresa, req.query.setorId);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter comparativo de paradas:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterTopMotivosTempo(req, res) {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : 5;
            const dados = await EventoModel.obterTopMotivosTempo(req.user.id_empresa, limite, req.query.setorId);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter top motivos por tempo:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    // -------------------------------------Dashboards Página histórico de eventos------------------------------------------------------------------------------------------

    static async tempoParadoTempoProduzindoEvento(req, res) {
        try {
            const dados = await EventoModel.tempoParadoTempoProduzindoEvento(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Tempo Total Parado x Tempo total Produzindo geral da fábrica:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async top3MotivosParada(req, res){
        try {
            const dados = await EventoModel.top3MotivosParada(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({sucesso: true, dados})
        } catch (error) {
            console.error('Erro no gráfico Top 3 Motivos de Parada:', error)
        return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // GET /api/eventos/:id — buscar evento por id
    static async buscarPorId(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_evento = parseInt(req.params.id);

            if (!id_evento || isNaN(id_evento)) {
                return res.status(400).json({ sucesso: false, erro: 'ID do evento inválido' });
            }

            const evento = await prisma.historico_Eventos.findFirst({
                where: { id_evento, id_empresa },
                include: {
                    maquina: { select: { id_maquina: true, nome: true, serie: true } },
                    motivo_parada: { select: { id_motivo: true, descricao: true, tipo: true } },
                    turno: { select: { id_turno: true, nome_turno: true } }
                }
            });

            if (!evento) {
                return res.status(404).json({ sucesso: false, erro: 'Evento não encontrado' });
            }

            // Normaliza para o formato esperado pelo frontend
            const dadosNormalizados = {
                id: evento.id_evento,
                id_evento: evento.id_evento,
                maquina: evento.maquina?.nome ?? '',
                id_maquina: evento.id_maquina,
                tipo: evento.status_atual === 'Setup' ? 'Setup' : 'Parada',
                status_maquina: evento.status_atual,
                setor_afetado: evento.setor_afetado,
                maquinas: [evento.id_maquina],
                inicio: evento.inicio ? evento.inicio.toISOString() : null,
                fim: evento.termino ? evento.termino.toISOString() : null,
                duracao: evento.duracao ? `${Math.floor(evento.duracao / 60)}:${String(evento.duracao % 60).padStart(2, '0')}` : null,
                id_motivo_parada: evento.id_motivo_parada,
                motivo: evento.motivo_parada?.descricao ?? null,
                observacao: evento.observacao,
                justificada: !!evento.id_motivo_parada,
                inicio_formatado: evento.inicio ? new Date(evento.inicio).toLocaleString('pt-BR') : null,
            };

            return res.status(200).json({ sucesso: true, dados: dadosNormalizados });
        } catch (error) {
            console.error('Erro ao buscar evento por id:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // GET /api/eventos/motivos-parada — listar motivos de parada da empresa
    static async listarMotivosParada(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const motivos = await prisma.motivos_Parada.findMany({
                where: { id_empresa },
                select: { id_motivo: true, descricao: true, tipo: true },
                orderBy: { descricao: 'asc' }
            });
            return res.status(200).json({ sucesso: true, dados: motivos });
        } catch (error) {
            console.error('Erro ao listar motivos de parada:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // GET /api/eventos/pendente — buscar evento pendente de justificativa para o operador logado
    static async buscarEventoPendente(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const id_usuario = req.user.id_usuario;

            // Busca a máquina do operador via escala de trabalho
            const escala = await prisma.escalaTrabalho.findFirst({
                where: { id_operador: id_usuario, id_empresa },
                select: { id_maquina: true }
            });

            if (!escala?.id_maquina) {
                return res.status(200).json({ sucesso: true, dados: null });
            }

            // Busca o evento mais recente sem justificativa para a máquina do operador
            const evento = await prisma.historico_Eventos.findFirst({
                where: {
                    id_empresa,
                    id_maquina: escala.id_maquina,
                    id_motivo_parada: null,
                    status_atual: { in: ['Parada', 'Manutencao', 'Setup'] }
                },
                include: {
                    maquina: { select: { id_maquina: true, nome: true } }
                },
                orderBy: { inicio: 'desc' }
            });

            if (!evento) {
                return res.status(200).json({ sucesso: true, dados: null });
            }

            const duracao = evento.duracao
                ? `${Math.floor(evento.duracao / 60)}h ${evento.duracao % 60}m`
                : 'Em andamento';

            return res.status(200).json({
                sucesso: true,
                dados: {
                    id_evento: evento.id_evento,
                    status_atual: evento.status_atual,
                    maquina: evento.maquina,
                    inicio_formatado: new Date(evento.inicio).toLocaleString('pt-BR'),
                    duracao
                }
            });
        } catch (error) {
            console.error('Erro ao buscar evento pendente:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
}

export default EventoController;
