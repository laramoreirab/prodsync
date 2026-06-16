import mqtt from 'mqtt';
import EventoModel from '../models/EventoModel.js';
import MaquinaModel from '../models/MaquinaModel.js';

const clienteMQTT = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
const TOPICO_STATUS_FILTRO = 'phietro/fabrica/+/status';
const TOPICO_PAREAMENTO = 'phietro/fabrica/pareamento';
const MQTT_SHARED_GROUP = process.env.MQTT_SHARED_GROUP || 'prodsync-backend';
const USAR_SHARED_SUBSCRIPTION = process.env.MQTT_SHARED_SUBSCRIPTIONS !== 'false';
const montarTopicoAssinatura = (topico) => (
  USAR_SHARED_SUBSCRIPTION ? `$share/${MQTT_SHARED_GROUP}/${topico}` : topico
);
const TOPICOS = [
  montarTopicoAssinatura(TOPICO_STATUS_FILTRO),
  montarTopicoAssinatura(TOPICO_PAREAMENTO)
];

function topicoControlePlaca(board_uid) {
  return `phietro/fabrica/${board_uid}/controle`;
}

function publicarControlePlaca(board_uid, payload) {
  if (!board_uid) return;

  const topico = topicoControlePlaca(board_uid);
  const mensagem = JSON.stringify(payload);

  clienteMQTT.publish(topico, mensagem, { qos: 1 }, (err) => {
    if (err) {
      console.error(`[MQTT CONTROLE] Falha ao publicar em ${topico}:`, err);
      return;
    }

    console.log(`[MQTT CONTROLE] Publicado em ${topico}: ${mensagem}`);
  });
}

function normalizarStatus(status) {
  return EventoModel.normalizarStatusMaquina(status) ?? status;
}

function publicarStatusRegistrado(dados, status, id_empresa, id_maquina, evento) {
  if (!dados?.board_uid) return;

  publicarControlePlaca(dados.board_uid, {
    tipo: 'STATUS_REGISTRADO',
    status,
    id_empresa,
    id_maquina,
    id_evento: evento?.id_evento ?? evento?.id ?? null
  });
}

function publicarStatusRejeitado(dados, status, mensagem) {
  if (!dados?.board_uid) return;

  publicarControlePlaca(dados.board_uid, {
    tipo: 'STATUS_REJEITADO',
    status: status ?? dados.status ?? null,
    mensagem
  });
}

async function processarPareamento(dados, topic) {
  const resultado = await MaquinaModel.registrarSolicitacaoPareamentoPlaca({
    board_uid: dados.board_uid,
    mac: dados.mac,
    firmware_version: dados.firmware_version,
    mqtt_topic: topic
  });

  if (resultado.status === 'Concluida') {
    console.log(`[MQTT PAREAMENTO] Placa ${resultado.board_uid} sincronizada com maquina ${resultado.id_maquina}.`);
  } else {
    console.log(`[MQTT PAREAMENTO] Placa ${resultado.board_uid} aguardando sincronizacao pelo site.`);
  }
}

MaquinaModel.eventosPlaca.on('pareamentoConcluido', (resultado) => {
  publicarControlePlaca(resultado.board_uid, {
    tipo: 'PAREAMENTO_CONCLUIDO',
    id_empresa: resultado.id_empresa,
    id_maquina: resultado.id_maquina,
    board_uid: resultado.board_uid
  });
});

MaquinaModel.eventosPlaca.on('pareamentoCancelado', (resultado) => {
  publicarControlePlaca(resultado.board_uid, {
    tipo: 'PARAR_PAREAMENTO',
    id_empresa: resultado.id_empresa,
    id_maquina: resultado.id_maquina,
    board_uid: resultado.board_uid
  });
});

clienteMQTT.on('connect', () => {
  console.log('SUCESSO: O Backend conectou ao Broker HiveMQ!');

  clienteMQTT.subscribe(TOPICOS, (err) => {
    if (!err) {
      console.log(`Escutando as placas nos canais: ${TOPICOS.join(', ')}`);
    }
  });
});

clienteMQTT.on('message', async (topic, message) => {
  let dados = null;

  try {
    dados = JSON.parse(message.toString());

    if (topic === TOPICO_PAREAMENTO || dados.tipo === 'PAIRING_REQUEST') {
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
        publicarStatusRejeitado(dados, status_maquina, 'Placa ainda nao sincronizada.');
        return;
      }

      await MaquinaModel.registrarContatoPlaca(dados.board_uid);
      id_empresa = vinculo.id_empresa;
      id_maquina = Number(vinculo.id_maquina);
    }

    console.log(`[NOVO STATUS] Maquina: ${id_maquina} | Status: ${status_maquina}`);

    if (!status_maquina || String(status_maquina).trim() === '') {
      console.warn('[MQTT AVISO] Status da maquina e obrigatorio. Ignorando mensagem.');
      publicarStatusRejeitado(dados, status_maquina, 'Status da maquina e obrigatorio.');
      return;
    }

    if (!Number.isInteger(id_maquina) || id_maquina <= 0) {
      console.warn('[MQTT AVISO] ID da maquina invalido. Ignorando mensagem.');
      publicarStatusRejeitado(dados, status_maquina, 'ID da maquina invalido.');
      return;
    }

    if (!id_empresa) {
      console.warn('[MQTT AVISO] ID da empresa nao fornecido. Ignorando mensagem.');
      publicarStatusRejeitado(dados, status_maquina, 'ID da empresa nao fornecido.');
      return;
    }

    const evento = await EventoModel.registrarEventoMaquina(
      id_empresa,
      status_maquina,
      id_maquina,
      new Date()
    );

    console.log('[MQTT SUCESSO] Evento registrado no banco via Model:', evento.id_evento ?? evento.id);
    publicarStatusRegistrado(dados, status_maquina, id_empresa, id_maquina, evento);
  } catch (erro) {
    const statusRejeitado = dados?.status ? normalizarStatus(dados.status) : null;
    publicarStatusRejeitado(dados, statusRejeitado, erro.message);

    if (erro.code === 'EVENTO_PENDENTE') {
      console.warn(`[MQTT BLOQUEADO] ${erro.message}`);
      return;
    }
    console.error('Erro ao processar mensagem MQTT:', erro);
  }
});

export default clienteMQTT;
