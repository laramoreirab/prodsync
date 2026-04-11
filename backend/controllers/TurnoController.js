const TurnoModel = require('../models/TurnoModel');

class TurnoController {
    // Cria um novo turno
    static async criarTurno(req, res) {
        try {
            // O req.body já vem com os tipos corretos se o JSON enviado pelo front estiver certinho
            const turno = await TurnoModel.criarTurno(req.body);
            res.status(201).json(turno);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar turno' });
        }
    }

    // Cria a escala de trabalho do operador
    static async criarEscala(req, res) {
        try {
            const escala = await TurnoModel.criarEscala(req.body);
            res.status(201).json(escala);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar escala de trabalho' });
        }
    }

    // Obtém todos os turnos de uma empresa
    static async obterTurnosPorEmpresa(req, res) {
        try {
            // Conversão para Number para o Prisma não reclamar
            const id_empresa = Number(req.params.id_empresa);
            const turnos = await TurnoModel.obterTurnosPorEmpresa(id_empresa);
            res.status(200).json(turnos);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter turnos por empresa' });
        }
    }

    // Obtém um turno específico por ID e ID da empresa
    static async obterTurnoPorId(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const id_empresa = Number(req.params.id_empresa);

            const turno = await TurnoModel.obterTurnoPorId(id_turno, id_empresa);

            if (turno) {
                res.status(200).json(turno);
            } else {
                res.status(404).json({ error: 'Turno não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter turno por ID' });
        }
    }

    // Atualiza os dados de um turno específico
    static async atualizarTurno(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const id_empresa = Number(req.params.id_empresa);
            await TurnoModel.atualizarTurno(id_turno, id_empresa, req.body);

            res.status(200).json({ message: 'Turno atualizado com sucesso' });
        } catch (error) {
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro ao atualizar turno' });
        }
    }

    // Deleta um turno específico por ID e ID da empresa
    static async deletarTurno(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const id_empresa = Number(req.params.id_empresa);

            await TurnoModel.deletarTurno(id_turno, id_empresa);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar turno' });
        }
    }

    // Obtém o turno atual com base na hora atual e ID da empresa
    static async obterTurnoAtual(req, res) {
        try {
            const id_empresa = Number(req.params.id_empresa);
            const hora_atual = req.query.hora_atual;

            const turnoAtual = await TurnoModel.obterTurnoAtual(id_empresa, hora_atual);

            if (turnoAtual) {
                res.status(200).json(turnoAtual);
            } else {
                res.status(404).json({ error: 'Nenhum turno atual encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter turno atual' });
        }
    }

    // Lista os operadores escalados para um turno específico em um dia da semana
    static async listarOperadoresTurno(req, res) {
        try {
            const id_turno = Number(req.params.id_turno);
            const dia_semana = req.query.dia_semana;

            const operadores = await TurnoModel.listarOperadoresTurno(id_turno, dia_semana);
            res.status(200).json(operadores);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar operadores do turno' });
        }
    }

    // Verifica se há conflito de horário para um operador em um dia da semana específico
    static async verificarConflitoTurno(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const dia_semana = req.query.dia_semana;
            const hora_inicio = req.query.hora_inicio;
            const hora_fim = req.query.hora_fim;

            const conflito = await TurnoModel.verificarConflitoTurno(
                id_operador,
                dia_semana,
                hora_inicio,
                hora_fim
            );
            res.status(200).json({ conflito });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao verificar conflito de turno' });
        }
    }
}

module.exports = TurnoController;