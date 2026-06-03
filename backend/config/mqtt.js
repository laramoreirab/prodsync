import mqtt from 'mqtt';
import EventoModel from '../models/EventoModel.js';
import MaquinaModel from '../models/MaquinaModel.js';

const clienteMQTT = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
const TOPICOS = ['phietro/fabrica/+/status', 'phietro/fabrica/pareamento'];

function normalizarStatus(status) {
  const valor = String(status ?? '').trim().toUpperCase();
  if (valor === 'PRODUZINDO') return 'Produzindo';
  if (valor === 'SETUP' || valor === 'SETUP/AJUSTE') return 'Setup';
  if (valor === 'PARADA') return 'Parada';
  if (valor === 'MANUTENCAO' || valor === 'MANUTENÇÃO') return 'Manutencao';
  if (valor === 'AGUARDANDO') return 'Aguardando';
  return status;
}

async function processarPareamento(dados, topic) {
  const resultado = await MaquinaModel.registrarSolicitacaoPareamentoPlaca({
    id_empresa: dados.id_empresa,
    board_uid: dados.board_uid,
    mac: dados.mac,
    firmware_version: dados.firmware_version,
    mqtt_topic: topic
  });

  if (resultado.status === 'Concluida') {
    console.log(`[MQTT PAREAMENTO] Placa ${resultado.board_uid} sincronizada com maquina ${resultado.id_maquina}.`);
    // Notificar a placa que o pareamento foi concluído
    clienteMQTT.publish(`phietro/fabrica/${resultado.board_uid}/controle`, JSON.stringify({
      tipo: 'PARAR_PAREAMENTO',
      maquina_id: resultado.id_maquina,
      sucesso: true
    }));
  } else {
    console.log(`[MQTT PAREAMENTO] Placa ${resultado.board_uid} aguardando sincronizacao pelo site.`);
  }
}

clienteMQTT.on('connect', () => {
  console.log('SUCESSO: O Backend conectou ao Broker HiveMQ!');

  clienteMQTT.subscribe(TOPICOS, (err) => {
    if (!err) {
      console.log(`Escutando as placas nos canais: ${TOPICOS.join(', ')}`);
    }
  });
});

clienteMQTT.on('message', async (topic, message) => {
  try {
    const dados = JSON.parse(message.toString());

    if (topic === 'phietro/fabrica/pareamento' || dados.tipo === 'PAIRING_REQUEST') {
      await processarPareamento(dados, topic);
      return;
    }

    let id_empresa = dados.id_empresa;
    let id_maquina = Number(dados.maquina_id);
    const status_maquina = normalizarStatus(dados.status);

    if (dados.board_uid) {
      const vinculo = await MaquinaModel.buscarVinculoPlaca(dados.board_uid);
      if (!vinculo) {
        console.warn(`[MQTT AVISO] Placa ${dados.board_uid} ainda nao sincronizada. Ignorando status.`);
        return;
      }

      await MaquinaModel.registrarContatoPlaca(dados.board_uid);
      id_empresa = vinculo.id_empresa;
      id_maquina = Number(vinculo.id_maquina);
    }

    console.log(`[NOVO STATUS] Maquina: ${id_maquina} | Status: ${status_maquina}`);

    if (!status_maquina || String(status_maquina).trim() === '') {
      console.warn('[MQTT AVISO] Status da maquina e obrigatorio. Ignorando mensagem.');
      return;
    }

    if (!Number.isInteger(id_maquina) || id_maquina <= 0) {
      console.warn('[MQTT AVISO] ID da maquina invalido. Ignorando mensagem.');
      return;
    }

    if (!id_empresa) {
      console.warn('[MQTT AVISO] ID da empresa nao fornecido. Ignorando mensagem.');
      return;
    }

    const evento = await EventoModel.registrarEventoMaquina(
      id_empresa,
      status_maquina,
      id_maquina,
      new Date()
    );

    console.log('[MQTT SUCESSO] Evento registrado no banco via Model:', evento.id_evento ?? evento.id);
  } catch (erro) {
    if (erro.code === 'EVENTO_PENDENTE') {
      console.warn(`[MQTT BLOQUEADO] ${erro.message}`);
      return;
    }
    console.error('Erro ao processar mensagem MQTT:', erro);
  }
});

export default clienteMQTT;
