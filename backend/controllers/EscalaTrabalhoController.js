import EscalaTrabalhoModel from '../models/EscalaTrabalhoModel.js';

class EscalaTrabalhoController {

    //Cria uma nova escala para um operador
    static async criar(req, res) {
        try {
            // O req.body deve conter id_operador, id_turno, dia_semana, id_setor e id_maquina
            const escala = await EscalaTrabalhoModel.criarEscala(req.body);
            res.status(201).json(escala);
        } catch (error) {
            res.status(400).json({ erro: 'Erro ao criar escala de trabalho', detalhe: error.message });
        }
    }

    //Cria a escala da semana inteira de uma vez (envio em lote/array)
    static async criarEscalaSemanal(req, res) {
        try {
            // req.body deve ser um array de objetos com a escala da semana
            const resultado = await EscalaTrabalhoModel.criarEscalaSemanal(req.body);
            res.status(201).json({ mensagem: 'Escala semanal criada com sucesso', inseridos: resultado.count });
        } catch (error) {
            res.status(400).json({ erro: 'Erro ao criar escala semanal', detalhe: error.message });
        }
    }

    //Lista toda a escala de um operador específico
    static async buscarPorOperador(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const escalas = await EscalaTrabalhoModel.buscarPorOperador(id_operador);
            
            if (!escalas || escalas.length === 0) {
                return res.status(404).json({ erro: 'Nenhuma escala encontrada para este operador' });
            }
            res.status(200).json(escalas);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao buscar escala do operador', detalhe: error.message });
        }
    }

    //Busca a escala de um operador em um dia específico
    static async buscarEscalaDoDia(req, res) {
        try {
            const id_operador = Number(req.query.id_operador);
            const dia_semana = req.query.dia_semana;

            const escala = await EscalaTrabalhoModel.buscarEscalaDoDia(id_operador, dia_semana);
            
            if (!escala || escala.length === 0) {
                return res.status(404).json({ erro: 'Escala não encontrada para este dia' });
            }
            res.status(200).json(escala);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao buscar escala do dia', detalhe: error.message });
        }
    }

    //Atualiza o setor/máquina de uma escala existente
    static async atualizar(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const id_turno = Number(req.params.id_turno);
            const dia_semana = req.params.dia_semana;

            const escalaAtualizada = await EscalaTrabalhoModel.atualizar(id_operador, id_turno, dia_semana, req.body);
            res.status(200).json(escalaAtualizada);
        } catch (error) {
            res.status(400).json({ erro: 'Erro ao atualizar escala', detalhe: error.message });
        }
    }

    //Deleta uma escala específica
    static async deletar(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const id_turno = Number(req.params.id_turno);
            const dia_semana = req.params.dia_semana;

            await EscalaTrabalhoModel.deletar(id_operador, id_turno, dia_semana);
            res.status(200).json({ mensagem: 'Escala deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao deletar escala', detalhe: error.message });
        }
    }
}

export default EscalaTrabalhoController;