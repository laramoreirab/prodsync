import EscalaTrabalhoModel from '../models/EscalaTrabalhoModel.js';

class EscalaTrabalhoController {

    //Cria uma nova escala para um operador
    static async criar(req, res) {
        try {
            const escala = await EscalaTrabalhoModel.criarEscala({
                ...req.body,
                id_empresa: req.user?.id_empresa ?? req.body.id_empresa
            });

            res.status(201).json({ sucesso: true, dados: escala });
        } catch (error) {
            res.status(400).json({ sucesso: false, erro: 'Erro ao criar escala de trabalho', detalhe: error.message });
        }
    }

    //Cria a escala da semana inteira de uma vez (envio em lote/array)
    static async criarEscalaSemanal(req, res) {
        try {
            const id_empresa = req.user?.id_empresa;
            const dados = req.body.map(item => ({
                ...item,
                id_empresa: id_empresa ?? item.id_empresa
            }));

            const resultado = await EscalaTrabalhoModel.criarEscalaSemanal(dados);
            res.status(201).json({ sucesso: true, mensagem: 'Escala semanal criada com sucesso', inseridos: resultado.count });
        } catch (error) {
            res.status(400).json({ sucesso: false, erro: 'Erro ao criar escala semanal', detalhe: error.message });
        }
    }

    //Lista toda a escala de um operador específico
    static async buscarPorOperador(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const escalas = await EscalaTrabalhoModel.buscarPorOperador(id_operador, req.user?.id_empresa);
            
            if (!escalas || escalas.length === 0) {
                return res.status(404).json({ erro: 'Nenhuma escala encontrada para este operador' });
            }
            res.status(200).json({ sucesso: true, dados: escalas });
        } catch (error) {
            res.status(500).json({ sucesso: false, erro: 'Erro ao buscar escala do operador', detalhe: error.message });
        }
    }

    //Busca a escala de um operador em um dia específico
    static async buscarEscalaDoDia(req, res) {
        try {
            const id_operador = Number(req.query.id_operador);
            const dia_semana = req.query.dia_semana;

            const escala = await EscalaTrabalhoModel.buscarEscalaDoDia(id_operador, dia_semana, req.user?.id_empresa);
            
            if (!escala || escala.length === 0) {
                return res.status(404).json({ erro: 'Escala não encontrada para este dia' });
            }
            res.status(200).json({ sucesso: true, dados: escala });
        } catch (error) {
            res.status(500).json({ sucesso: false, erro: 'Erro ao buscar escala do dia', detalhe: error.message });
        }
    }

    static async buscarOperadorAtualDaMaquina(req, res) {
        try {
            const id_maquina = Number(req.params.id_maquina ?? req.query.id_maquina);

            if (!Number.isInteger(id_maquina) || id_maquina <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'ID da maquina invalido' });
            }

            const dados = await EscalaTrabalhoModel.buscarOperadorAtualDaMaquina(
                id_maquina,
                req.user.id_empresa
            );

            if (!dados) {
                return res.status(404).json({ sucesso: false, erro: 'Operador atual nao encontrado para esta maquina' });
            }

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar operador atual', detalhe: error.message });
        }
    }

    //Atualiza o setor/máquina de uma escala existente
    static async atualizar(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const id_turno = Number(req.params.id_turno);

            const escalaAtualizada = await EscalaTrabalhoModel.atualizar(id_operador, id_turno, req.body);
            res.status(200).json({ sucesso: true, dados: escalaAtualizada });
        } catch (error) {
            res.status(400).json({ sucesso: false, erro: 'Erro ao atualizar escala', detalhe: error.message });
        }
    }

    //Deleta uma escala específica
    static async deletar(req, res) {
        try {
            const id_operador = Number(req.params.id_operador);
            const id_turno = Number(req.params.id_turno);

            await EscalaTrabalhoModel.deletar(id_operador, id_turno);
            res.status(200).json({ sucesso: true, mensagem: 'Escala deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ sucesso: false, erro: 'Erro ao deletar escala', detalhe: error.message });
        }
    }
}

export default EscalaTrabalhoController;
