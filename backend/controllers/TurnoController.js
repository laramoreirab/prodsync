import TurnoModel from '../models/TurnoModel.js';

class TurnoController {

    // Cria um novo turno
    static async criarTurno(req, res) {
        try {
            const id_empresa = req.user.id_empresa;

            const dadosTurno = { ...req.body, id_empresa };

            const turno = await TurnoModel.criarTurno(dadosTurno);
            res.status(201).json({ sucesso: true, dados: turno });
        } catch (error) {
            console.error('Erro ao criar turno:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
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
            const hora_atual = req.query.hora_atual;

            if (!hora_atual) return res.status(400).json({ sucesso: false, erro: 'A hora atual é obrigatória' });

            const turnoAtual = await TurnoModel.obterTurnoAtual(id_empresa, hora_atual);

            if (!turnoAtual) {
                return res.status(404).json({ sucesso: false, erro: 'Nenhum turno em andamento neste horário' });
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
}

export default TurnoController;