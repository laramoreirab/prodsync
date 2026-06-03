import EventoModel from '../models/EventoModel.js';
import MaquinaModel from '../models/MaquinaModel.js';

class PlacaController {
    static normalizarStatus(status) {
        return EventoModel.normalizarStatusMaquina(status) ?? status;

        const valor = String(status ?? '').trim().toUpperCase();
        if (valor === 'PRODUZINDO') return 'Produzindo';
        if (valor === 'SETUP' || valor === 'SETUP/AJUSTE') return 'Setup';
        if (valor === 'PARADA') return 'Parada';
        if (valor === 'MANUTENCAO' || valor === 'MANUTENÇÃO') return 'Manutencao';
        if (valor === 'AGUARDANDO') return 'Aguardando';
        return status;
    }

    static async solicitarPareamento(req, res) {
        try {
            const { id_empresa, board_uid, mac, firmware_version, mqtt_topic } = req.body;

            const resultado = await MaquinaModel.registrarSolicitacaoPareamentoPlaca({
                id_empresa,
                board_uid,
                mac,
                firmware_version,
                mqtt_topic
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: resultado.status === 'Concluida'
                    ? 'Placa sincronizada com a maquina.'
                    : 'Placa aguardando sincronizacao pelo site.',
                dados: resultado
            });
        } catch (error) {
            console.error('Erro ao solicitar pareamento da placa:', error);
            return res.status(400).json({
                sucesso: false,
                erro: 'Pareamento invalido',
                mensagem: error.message
            });
        }
    }

    static async registrarEvento(req, res) {
        try {
            const { board_uid, status, timestamp } = req.body;
            const vinculo = await MaquinaModel.buscarVinculoPlaca(board_uid);

            if (!vinculo) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Placa nao sincronizada',
                    mensagem: 'Sincronize a placa com uma maquina antes de enviar eventos.'
                });
            }

            const statusNormalizado = PlacaController.normalizarStatus(status);
            if (!statusNormalizado || String(statusNormalizado).trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Status obrigatorio',
                    mensagem: 'Informe o status da maquina.'
                });
            }

            await MaquinaModel.registrarContatoPlaca(board_uid);

            const evento = await EventoModel.registrarEventoMaquina(
                vinculo.id_empresa,
                statusNormalizado,
                Number(vinculo.id_maquina),
                timestamp ? new Date(timestamp) : new Date()
            );

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Evento registrado pela placa.',
                dados: evento
            });
        } catch (error) {
            if (error.code === 'EVENTO_PENDENTE') {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Evento pendente',
                    mensagem: error.message
                });
            }

            console.error('Erro ao registrar evento da placa:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel registrar o evento da placa.'
            });
        }
    }
}

export default PlacaController;
