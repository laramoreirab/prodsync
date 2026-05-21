const mqtt = require('mqtt');

// Conexão via WebSockets seguros para não travar na escola e rodar direto no Render
const clienteMQTT = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
const TOPICO = 'phietro/fabrica/maquina1/status';

clienteMQTT.on('connect', () => {
  console.log('✅ SUCESSO: O Backend conectou ao Broker HiveMQ!');
  
  clienteMQTT.subscribe(TOPICO, (err) => {
    if (!err) {
      console.log(`🎧 Escutando a placa no canal: ${TOPICO}`);
    }
  });
});

clienteMQTT.on('message', async (topic, message) => {
  try {
    const dados = JSON.parse(message.toString());
    console.log(`[NOVO STATUS] Máquina: ${dados.maquina_id} | Status: ${dados.status}`);
    
    // COMO INTEGRAR COM O SEU PRISMA:
    // Você pode importar seu cliente do Prisma aqui para salvar diretamente:
    // await prisma.logProducao.create({ data: { maquinaId: dados.maquina_id, status: dados.status } });

  } catch (erro) {
    console.error('Erro ao processar mensagem MQTT:', erro);
  }
});

module.exports = clienteMQTT;