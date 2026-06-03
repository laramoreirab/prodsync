clearWatch();
clearInterval();

var wifi = require("Wifi");
var mqtt = require("tinyMQTT");

var PIN_VERDE = D32;
var PIN_AMARELO = D33;
var PIN_VERMELHO = D25;
var PIN_LED_PAREAMENTO = D27;

var EMPRESA_ID = 10;
var BOARD_UID = typeof getSerial === "function" ? "esp32-" + getSerial() : "esp32-prodsync-001";
var FIRMWARE_VERSION = "wifi-1.1.0";

var statusAtual = null;
var clienteMQTT = null;
var setupHoldTimer = null;
var setupLongPressTriggered = false;
var emParejamento = false;
var ledPiscandoTimer = null;

var TOPICO_STATUS = "phietro/fabrica/" + BOARD_UID + "/status";
var TOPICO_PAREAMENTO = "phietro/fabrica/pareamento";

function obterMac() {
  try {
    var detalhes = wifi.getDetails ? wifi.getDetails() : null;
    return detalhes && detalhes.mac ? detalhes.mac : null;
  } catch (e) {
    return null;
  }
}

function publicaJson(topico, dados) {
  if (!clienteMQTT) {
    console.log("Aguarde, MQTT ainda nao conectou...");
    return;
  }

  var payload = JSON.stringify(dados);
  clienteMQTT.publish(topico, payload);
  console.log("Publicado MQTT:", topico, payload);
}

function conectaWifi() {
  console.log("Limpando conexoes antigas...");
  wifi.disconnect();

  setTimeout(function() {
    console.log("Tentando conectar ao Wi-Fi: Phietro...");
    wifi.connect("Phietro", { password: "123" }, function(err) {
      if (err) {
        console.log("Erro no Wi-Fi. Tentando em 10s...");
        setTimeout(conectaWifi, 10000);
        return;
      }
      console.log("Wi-Fi conectado. IP:", wifi.getIP().ip);
      conectaBroker();
    });
  }, 1000);
}

function conectaBroker() {
  console.log("Conectando ao broker MQTT...");
  clienteMQTT = mqtt.create("broker.hivemq.com");

  clienteMQTT.on("connected", function() {
    console.log("Conectado ao Broker HiveMQ.");
    // Inscrever no canal de controle para receber comandos de parada
    clienteMQTT.subscribe("phietro/fabrica/" + BOARD_UID + "/controle");
  });

  clienteMQTT.on("disconnected", function() {
    console.log("Desconectado do Broker. Tentando reconectar...");
    setTimeout(conectaBroker, 5000);
  });

  clienteMQTT.on("message", function(topic, msg) {
    try {
      var dados = JSON.parse(msg);
      if (dados.tipo === "PARAR_PAREAMENTO") {
        console.log("Recebido comando para parar emparelhamento");
        pararPareamento();
      }
    } catch (e) {
      console.log("Erro ao processar mensagem MQTT:", e);
    }
  });

  clienteMQTT.connect();
}

function solicitarPareamento() {
  emParejamento = true;
  console.log("Iniciando modo de emparelhamento...");
  
  // Começar a piscar o LED
  piscarLedPareamento();
  
  publicaJson(TOPICO_PAREAMENTO, {
    tipo: "PAIRING_REQUEST",
    id_empresa: EMPRESA_ID,
    board_uid: BOARD_UID,
    mac: obterMac(),
    firmware_version: FIRMWARE_VERSION
  });
}

function pararPareamento() {
  emParejamento = false;
  console.log("Parando modo de emparelhamento...");
  
  // Parar de piscar
  if (ledPiscandoTimer) {
    clearInterval(ledPiscandoTimer);
    ledPiscandoTimer = null;
  }
  digitalWrite(PIN_LED_PAREAMENTO, 0); // Desligar LED
}

function piscarLedPareamento() {
  // Piscar a cada 500ms (250ms on, 250ms off)
  var ledLigado = false;
  
  ledPiscandoTimer = setInterval(function() {
    if (emParejamento) {
      ledLigado = !ledLigado;
      digitalWrite(PIN_LED_PAREAMENTO, ledLigado ? 1 : 0);
    } else {
      clearInterval(ledPiscandoTimer);
      ledPiscandoTimer = null;
    }
  }, 250);
}

function enviaStatus(novoStatus) {
  if (statusAtual === novoStatus) return;
  statusAtual = novoStatus;

  publicaJson(TOPICO_STATUS, {
    board_uid: BOARD_UID,
    status: statusAtual
  });
}

function configuraBotoes() {
  pinMode(PIN_VERDE, "input_pullup");
  pinMode(PIN_AMARELO, "input_pullup");
  pinMode(PIN_VERMELHO, "input_pullup");
  pinMode(PIN_LED_PAREAMENTO, "output");
  digitalWrite(PIN_LED_PAREAMENTO, 0); // Desligar LED inicialmente

  setWatch(function() {
    setTimeout(function() { enviaStatus("Produzindo"); }, 10);
  }, PIN_VERDE, { repeat: true, edge: "falling", debounce: 50 });

  setWatch(function() {
    setupLongPressTriggered = false;
    setupHoldTimer = setTimeout(function() {
      setupLongPressTriggered = true;
      solicitarPareamento();
    }, 3000);
  }, PIN_AMARELO, { repeat: true, edge: "falling", debounce: 50 });

  setWatch(function() {
    if (setupHoldTimer) clearTimeout(setupHoldTimer);
    if (!setupLongPressTriggered) {
      // Se estiver em emparelhamento, para
      if (emParejamento) {
        pararPareamento();
      } else {
        setTimeout(function() { enviaStatus("Setup"); }, 10);
      }
    }
  }, PIN_AMARELO, { repeat: true, edge: "rising", debounce: 50 });

  setWatch(function() {
    setTimeout(function() { enviaStatus("Parada"); }, 10);
  }, PIN_VERMELHO, { repeat: true, edge: "falling", debounce: 50 });
}

console.log("ESP32 iniciado. Board UID:", BOARD_UID);
configuraBotoes();
conectaWifi();
