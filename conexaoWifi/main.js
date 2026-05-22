var wifi = require("Wifi");
var mqtt = require("tinyMQTT"); 

var PIN_VERDE = D32;    
var PIN_AMARELO = D33;  
var PIN_VERMELHO = D25; 

var EMPRESA_ID = 10;
var MAQUINA_ID = 20;
var statusAtual = null; 
var clienteMQTT = null;

// Este é o canal (Tópico) exclusivo da sua máquina
var TOPICO = "phietro/fabrica/maquina1/status";

function conectaWifi() {
  console.log("Limpando conexões antigas...");
  wifi.disconnect(); // Garante que o rádio do ESP32 comece do zero

  // Aguarda 1 segundo para o chip limpar a memória antes de tentar reconectar
  setTimeout(function() {
    console.log("Tentando conectar ao Wi-Fi: Phietro...");
    wifi.connect("Phietro", { password: "123" }, function(err) {
      if (err) {
        console.log("Erro no Wi-Fi. Tentando em 10s...");
        setTimeout(conectaWifi, 10000);
        return;
      }
      console.log("✅ Wi-Fi Conectado! IP:", wifi.getIP().ip);
      conectaBroker(); 
    });
  }, 1000);
}

function conectaBroker() {
  console.log("Conectando ao broker MQTT...");
  
  // Conecta na porta padrão 1883 sem criptografia (zero travamentos de RAM)
  clienteMQTT = mqtt.create("broker.hivemq.com");
  
  clienteMQTT.on("connected", function() {
    console.log("Conectado ao Broker HiveMQ com sucesso!");
  });

  clienteMQTT.on("disconnected", function() {
    console.log("Desconectado do Broker. Tentando reconectar...");
    setTimeout(conectaBroker, 5000);
  });

  clienteMQTT.connect();
}

function enviaStatus(novoStatus) {
  if (!clienteMQTT) {
    console.log("Aguarde, MQTT ainda não conectou...");
    return;
  }
  
  if (statusAtual === novoStatus) return; 
  statusAtual = novoStatus;
  
  var dados = JSON.stringify({
    id_empresa: EMPRESA_ID,
    maquina_id: MAQUINA_ID,
    status: statusAtual
  });

  // Publica a mensagem no canal de forma instantânea
  clienteMQTT.publish(TOPICO, dados);
  console.log("Publicado no canal MQTT:", dados);
}

function configuraBotoes() {
  pinMode(PIN_VERDE, "input_pullup");
  pinMode(PIN_AMARELO, "input_pullup");
  pinMode(PIN_VERMELHO, "input_pullup");

  setWatch(function() { 
    setTimeout(function() { enviaStatus("PRODUZINDO"); }, 10); 
  }, PIN_VERDE, { repeat: true, edge: "falling", debounce: 50 });

  setWatch(function() { 
    setTimeout(function() { enviaStatus("SETUP"); }, 10); 
  }, PIN_AMARELO, { repeat: true, edge: "falling", debounce: 50 });

  setWatch(function() { 
    setTimeout(function() { enviaStatus("PARADA"); }, 10); 
  }, PIN_VERMELHO, { repeat: true, edge: "falling", debounce: 50 });
}

configuraBotoes();
conectaWifi();