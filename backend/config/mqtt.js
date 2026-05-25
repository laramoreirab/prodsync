import mqtt from 'mqtt';
import EventoModel from '../models/EventoModel.js';

// Conexão via WebSockets seguros para não travar na escola e rodar direto no Render
const clienteMQTT = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
const TOPICO = 'phietro/fabrica/maquina1/status';

clienteMQTT.on('connect', () => {
  console.log('SUCESSO: O Backend conectou ao Broker HiveMQ!');
  
  clienteMQTT.subscribe(TOPICO, (err) => {
    if (!err) {
      console.log(`Escutando a placa no canal: ${TOPICO}`);
    }
  });
});

clienteMQTT.on('message', async (topic, message) => {
  try {
    const dados = JSON.parse(message.toString());
    console.log(dados)
    console.log(`[NOVO STATUS] Máquina: ${dados.maquina_id} | Status: ${dados.status}`);
    const id_empresa = dados.id_empresa; //precisa enviar junto com os dados da máquina para identificar a qual empresa pertence
    const id_maquina = Number(dados.maquina_id);
    const status_maquina = dados.status; 

    if (!status_maquina || String(status_maquina).trim() === '') {
        console.warn('[MQTT AVISO] Status da máquina é obrigatório. Ignorando mensagem.');
        return; 
    }

    if (!Number.isInteger(id_maquina) || id_maquina <= 0) {
        console.warn('[MQTT AVISO] ID da máquina inválido. Ignorando mensagem.');
        return; 
    }

    if (!id_empresa) {
        console.warn('[MQTT AVISO] ID da empresa não fornecido. Ignorando mensagem.');
        return;
    }

    const evento = await EventoModel.registrarEventoMaquina(
        id_empresa,
        status_maquina,
        id_maquina,
        new Date()
    );

    console.log('[MQTT SUCESSO] Evento registrado no banco via Model:', evento.id);

  } catch (erro) {
    console.error('Erro ao processar mensagem MQTT:', erro);
  }
});

export default clienteMQTT;