import TurnoModel from '../models/TurnoModel.js';

class TurnoController {

    // Cria um novo turno
    static async criarTurno(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { nome_turno, hora_inicio, hora_fim, dia_semana } = req.body;

            if (!nome_turno || !hora_inicio || !hora_fim || !dia_semana) {
                return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios.' });
            }

            if (isNaN(new Date(hora_inicio).getTime()) || isNaN(new Date(hora_fim).getTime())) {
                return res.status(400).json({ sucesso: false, erro: 'Formato de hora inválido.' });
            }

            const dadosTurno = {
                nome_turno,
                hora_inicio: new Date(hora_inicio),
                hora_fim: new Date(hora_fim),
                dia_semana,
                id_empresa
            };

            const turno = await TurnoModel.criarTurno(dadosTurno);

            return res.status(201).json({ sucesso: true, dados: turno });

        } catch (error) {
            console.error('Erro ao criar turno:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Cria a escala de trabalho do operador
    static async criarEscala(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const dadosEscala = { ...req.body, id_empresa };

            const escala = await TurnoModel.criarEscala(dadosEscala);
            res.status(201).json({ sucesso: true, dados: escala });
        } catch (error) {
            console.error('Erro ao criar escala:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Obtém todos os turnos de uma empresa
    static async obterTurnosPorEmpresa(req, res) {
        try {
            // Seguro: pega o ID direto do token de login
            const id_empresa = req.user.id_empresa;

            const turnos = await TurnoModel.obterTurnosPorEmpresa(id_empresa);
            res.status(200).json({ sucesso: true, dados: turnos });
        } catch (error) {
            console.error('Erro ao obter turnos:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Obtém um turno específico por ID
    static async obterTurnoPorId(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_turno)) return res.status(400).json({ sucesso: false, erro: 'ID de turno inválido' });

            const turno = await TurnoModel.obterTurnoPorId(id_turno, id_empresa);

            if (!turno) {
                return res.status(404).json({ sucesso: false, erro: 'Turno não encontrado' });
            }

            res.status(200).json({ sucesso: true, dados: turno });
        } catch (error) {
            console.error('Erro ao obter turno por ID:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Atualiza os dados de um turno específico
    static async atualizarTurno(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_turno)) return res.status(400).json({ sucesso: false, erro: 'ID de turno inválido' });

            await TurnoModel.atualizarTurno(id_turno, id_empresa, req.body);
            res.status(200).json({ sucesso: true, mensagem: 'Turno atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar turno:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ sucesso: false, erro: error.message });
            }
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Deleta um turno específico por ID
    static async deletarTurno(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_turno)) return res.status(400).json({ sucesso: false, erro: 'ID de turno inválido' });

            await TurnoModel.deletarTurno(id_turno, id_empresa);
            res.status(200).json({ sucesso: true, mensagem: 'Turno deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar turno:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Obtém o turno atual com base na hora atual e ID da empresa
    static async obterTurnoAtual(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { hora_atual, dia_semana } = req.query;

            if (!hora_atual) return res.status(400).json({ sucesso: false, erro: 'A hora atual é obrigatória' });
            if (!dia_semana) return res.status(400).json({ sucesso: false, erro: 'O dia da semana é obrigatório' });

            const turnoAtual = await TurnoModel.obterTurnoAtual(id_empresa, hora_atual, dia_semana);

            if (!turnoAtual) {
                return res.status(404).json({ sucesso: false, erro: 'Nenhum turno em andamento neste horário e dia' });
            }

            res.status(200).json({ sucesso: true, dados: turnoAtual });
        } catch (error) {
            console.error('Erro ao obter turno atual:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Lista os operadores escalados para um turno específico em um dia da semana
    static async listarOperadoresTurno(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const dia_semana = req.query.dia_semana;
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_turno)) return res.status(400).json({ sucesso: false, erro: 'ID de turno inválido' });
            if (!dia_semana) return res.status(400).json({ sucesso: false, erro: 'Dia da semana é obrigatório' });

            const operadores = await TurnoModel.listarOperadoresTurno(id_turno, dia_semana, id_empresa);
            res.status(200).json({ sucesso: true, dados: operadores });
        } catch (error) {
            console.error('Erro ao listar operadores:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Verifica se há conflito de horário para um operador em um dia da semana específico
    static async verificarConflitoTurno(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const { dia_semana, hora_inicio, hora_fim } = req.query;

            if (isNaN(id_operador)) return res.status(400).json({ sucesso: false, erro: 'ID de operador inválido' });
            if (!dia_semana || !hora_inicio || !hora_fim) {
                return res.status(400).json({ sucesso: false, erro: 'Parâmetros de tempo incompletos' });
            }

            const conflito = await TurnoModel.verificarConflitoTurno(
                id_operador,
                dia_semana,
                hora_inicio,
                hora_fim
            );

            res.status(200).json({ sucesso: true, dados: { conflito } });
        } catch (error) {
            console.error('Erro ao verificar conflito:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    
    // ------------- Dashboards -------------- //

    // GET api/turnos/kpis/:idTurno
    static async obterKpisTurno(req, res) {
        try {
            const { idTurno } = req.params;

            if (!idTurno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do turno é obrigatório',
                    mensagem: 'Forneça o ID do turno para buscar os indicadores.'
                });
            }

            // Executa as duas buscas no banco ao mesmo tempo (mais rápido)
            const [totalLotes, totalMaquinasAtivas] = await Promise.all([
                TurnoModel.buscarProducaoTurnoLotes(idTurno),
                TurnoModel.buscarMaquinasAtivasTurno(idTurno)
            ]);

            // Devolve um objeto simples com os valores absolutos para os cards
            return res.status(200).json({
                sucesso: true,
                dados: {
                    producaoLotes: Number(totalLotes),
                    maquinasAtivas: Number(totalMaquinasAtivas)
                }
            });

        } catch (error) {
            console.error('Erro ao obter KPIs do turno:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível carregar os dados do turno.'
            });
        }
    }

    // Gráfico 1: GET api/turnos/:idTurno/producao-timeline
    static async obterProducaoTimeline(req, res) {
        try {
            const { idTurno } = req.params;

            if (!idTurno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do turno é obrigatório'
                });
            }

            const timeline = await TurnoModel.obterProducaoTimeline(idTurno);

            return res.status(200).json({
                sucesso: true,
                dados: timeline
            });
        } catch (error) {
            console.error('Erro ao obter timeline de produção:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar dados de produção'
            });
        }
    }

    // Gráfico 2: GET api/turnos/comparativo/producao
    static async obterComparativoTurnos(req, res) {
        try {
            const id_empresa = req.user.id_empresa;

            const comparativo = await TurnoModel.obterComparativoTurnos(id_empresa);

            return res.status(200).json({
                sucesso: true,
                dados: comparativo
            });
        } catch (error) {
            console.error('Erro ao obter comparativo de turnos:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar comparativo de turnos'
            });
        }
    }

    // Gráfico 3: GET api/turnos/:idTurno/distribuicao-maquinas
    static async obterDistribuicaoMaquinas(req, res) {
        try {
            const { idTurno } = req.params;

            if (!idTurno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do turno é obrigatório'
                });
            }

            const distribuicao = await TurnoModel.obterDistribuicaoMaquinas(idTurno);

            return res.status(200).json({
                sucesso: true,
                dados: distribuicao
            });
        } catch (error) {
            console.error('Erro ao obter distribuição de máquinas:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar distribuição de máquinas'
            });
        }
    }

    // Gráfico 4: GET api/turnos/:idTurno/tempo-parado
    static async obterTempoParado(req, res) {
        try {
            const { idTurno } = req.params;

            if (!idTurno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do turno é obrigatório'
                });
            }

            const tempoParado = await TurnoModel.obterTempoParado(idTurno);

            return res.status(200).json({
                sucesso: true,
                dados: tempoParado
            });
        } catch (error) {
            console.error('Erro ao obter tempo parado:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar dados de tempo parado'
            });
        }
    }

    // Gráfico 5: GET api/turnos/:idTurno/ocupacao-operadores
    static async obterOcupacaoOperadores(req, res) {
        try {
            const { idTurno } = req.params;

            if (!idTurno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do turno é obrigatório'
                });
            }

            const ocupacao = await TurnoModel.obterOcupacaoOperadores(idTurno);

            return res.status(200).json({
                sucesso: true,
                dados: ocupacao
            });
        } catch (error) {
            console.error('Erro ao obter ocupação de operadores:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar dados de ocupação'
            });
        }
    }

    // Gráfico 6: GET api/turnos/:idTurno/distribuicao-paradas
    static async obterDistribuicaoParadas(req, res) {
        try {
            const { idTurno } = req.params;

            if (!idTurno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do turno é obrigatório'
                });
            }

            const distribuicao = await TurnoModel.obterDistribuicaoParadas(idTurno);

            return res.status(200).json({
                sucesso: true,
                dados: distribuicao
            });
        } catch (error) {
            console.error('Erro ao obter distribuição de paradas:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar distribuição de paradas'
            });
        }
    }

    // Gráfico 7: GET api/turnos/:idTurno/resumo
    static async obterResumoTurno(req, res) {
        try {
            const { idTurno } = req.params;

            if (!idTurno) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do turno é obrigatório'
                });
            }

            const resumo = await TurnoModel.obterResumoTurno(idTurno);

            return res.status(200).json({
                sucesso: true,
                dados: resumo
            });
        } catch (error) {
            console.error('Erro ao obter resumo do turno:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar resumo do turno'
            });
        }
    }

}

export default TurnoController;