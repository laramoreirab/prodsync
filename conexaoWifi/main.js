var wifi = require("Wifi");
var MQTT = require("tinyMQTT");

// --- Configuracoes de Rede ---
var ssid = "Wokwi-GUEST";
var password = "";
var mqtt_server = "broker.hivemq.com";

// --- Definicao dos Pinos ---
var PIN_VERDE = D32;
var PIN_AMARELO = D33;
var PIN_VERMELHO = D25;
var PIN_LED_PAREAMENTO = D27;

// --- Constantes do Sistema ---
var EMPRESA_ID = 10;
var FIRMWARE_VERSION = "wifi-1.1.0";
var BOARD_UID = "";

// --- Topicos MQTT ---
var TOPICO_STATUS = "";
var TOPICO_PAREAMENTO = "phietro/fabrica/pareamento";
var TOPICO_CONTROLE = "";

// --- Estado ---
var ultimoStatusRegistrado = "";
var emParejamento = false;
var ledLigado = false;
var blinkTimer;
var mqtt;
var mqttConnected = false;
var mqttConnecting = false;
var mqttReconnectTimer;
var wifiConnecting = false;
var wifiReady = false;

// --- Botao amarelo ---
var amareloIsPressed = false;
var setupLongPressTriggered = false;
var amareloLongPressTimer;

// --- Watch handlers ---
var watchIds = [];
var DEBOUNCE_DELAY = 50;

function makeClientId() {
  return BOARD_UID + "-" + Math.random().toString(16).substr(2, 8);
}

function getMac() {
  var ip = wifi.getIP();
  return ip && ip.mac ? ip.mac : "00:00:00:00:00:00";
}

function initBoardUidAndTopics() {
  if (BOARD_UID) return;

  var mac = getMac();
  BOARD_UID = "esp32-" + mac.toLowerCase().replace(/:/g, "");

  TOPICO_STATUS = "phietro/fabrica/" + BOARD_UID + "/status";
  TOPICO_CONTROLE = "phietro/fabrica/" + BOARD_UID + "/controle";

  console.log("ESP32 iniciado. Board UID: " + BOARD_UID);
}

function isWiFiConnected() {
  var status = wifi.getStatus();
  return status && status.station === "connected";
}

function setupWiFi() {
  if (wifiConnecting || isWiFiConnected()) return;

  wifiConnecting = true;
  console.log("Tentando conectar ao Wi-Fi: " + ssid);

  wifi.connect(ssid, password ? { password: password } : {}, function(err) {
    wifiConnecting = false;

    if (err) {
      console.log("Falha ao conectar Wi-Fi: " + err);
      setTimeout(setupWiFi, 5000);
      return;
    }

    onWiFiReady();
  });

  setTimeout(function() {
    if (!isWiFiConnected()) {
      wifiConnecting = false;
      console.log("Falha ao conectar. Tentando novamente no proximo ciclo.");
      setTimeout(setupWiFi, 5000);
    }
  }, 10000);
}

function onWiFiReady() {
  var ip = wifi.getIP();

  if (!wifiReady) {
    console.log("Wi-Fi conectado.");
    console.log("IP: " + (ip && ip.ip ? ip.ip : "desconhecido"));
  }

  wifiReady = true;
  initBoardUidAndTopics();
  connectMqtt();
}

function scheduleMqttReconnect() {
  if (mqttReconnectTimer) return;

  mqttReconnectTimer = setTimeout(function() {
    mqttReconnectTimer = undefined;
    connectMqtt();
  }, 5000);
}

function connectMqtt() {
  if (!BOARD_UID || !isWiFiConnected() || mqttConnected || mqttConnecting) return;

  mqttConnecting = true;
  console.log("Conectando ao broker MQTT...");

  mqtt = MQTT.create(mqtt_server, {
    client_id: makeClientId(),
    port: 1883,
    clean_session: true,
    keep_alive: 60
  });

  mqtt.on("connected", function() {
    mqttConnecting = false;
    mqttConnected = true;

    console.log("Conectado ao Broker HiveMQ.");
    mqtt.subscribe(TOPICO_CONTROLE);

    if (emParejamento) {
      console.log("Reenviando pedido de pareamento apos reconexao MQTT...");
      publicarPedidoPareamento();
    }
  });

  mqtt.on("publish", function(pub) {
    callback(pub.topic, pub.message);
  });

  mqtt.on("disconnected", function() {
    mqttConnecting = false;
    mqttConnected = false;
    console.log("MQTT desconectado. Tentando reconectar em 5 segundos...");
    scheduleMqttReconnect();
  });

  mqtt.on("error", function(err) {
    mqttConnecting = false;
    mqttConnected = false;
    console.log("Erro MQTT: " + err);
    scheduleMqttReconnect();
  });

  mqtt.connect();
}

function callback(topic, message) {
  console.log("Mensagem recebida no topico [" + topic + "]: " + message);

  var doc;
  try {
    doc = JSON.parse(message);
  } catch (e) {
    console.log("Erro ao processar mensagem JSON: " + e);
    return;
  }

  var tipo = doc.tipo;

  if (tipo === "PARAR_PAREAMENTO") {
    console.log("Recebido comando para parar emparelhamento");
    pararPareamento();
  } else if (tipo === "PAREAMENTO_CONCLUIDO") {
    console.log("Pareamento concluido com a maquina " + (doc.id_maquina || 0));
    pararPareamento();
  } else if (tipo === "STATUS_REGISTRADO") {
    if (doc.status) {
      ultimoStatusRegistrado = doc.status;
      console.log("Status confirmado pelo backend: " + ultimoStatusRegistrado);
    }
  } else if (tipo === "STATUS_REJEITADO") {
    console.log(
      "Backend rejeitou o status " +
      (doc.status || "") +
      ": " +
      (doc.mensagem || "sem detalhes")
    );
  }
}

function publicaJson(topico, doc) {
  if (!mqttConnected || !mqtt) {
    console.log("Aguarde, MQTT ainda nao conectou...");
    return;
  }

  var payload = JSON.stringify(doc);
  mqtt.publish(topico, payload);

  console.log("Publicado MQTT: " + topico + " -> " + payload);
}

function enviaStatus(novoStatus) {
  if (ultimoStatusRegistrado === novoStatus) {
    console.log(
      "Status " +
      novoStatus +
      " ja foi confirmado pelo backend. Publicacao ignorada."
    );
    return;
  }

  publicaJson(TOPICO_STATUS, {
    board_uid: BOARD_UID,
    status: novoStatus
  });
}

function iniciarBlinkPareamento() {
  if (blinkTimer) return;

  ledLigado = false;
  blinkTimer = setInterval(function() {
    ledLigado = !ledLigado;
    digitalWrite(PIN_LED_PAREAMENTO, ledLigado ? 1 : 0);
  }, 250);
}

function pararBlinkPareamento() {
  if (blinkTimer) {
    clearInterval(blinkTimer);
    blinkTimer = undefined;
  }

  ledLigado = false;
  digitalWrite(PIN_LED_PAREAMENTO, 0);
}

function solicitarPareamento() {
  emParejamento = true;
  console.log("Iniciando modo de emparelhamento...");
  iniciarBlinkPareamento();
  publicarPedidoPareamento();
}

function publicarPedidoPareamento() {
  var mac = getMac();

  publicaJson(TOPICO_PAREAMENTO, {
    tipo: "PAIRING_REQUEST",
    id_empresa: EMPRESA_ID,
    board_uid: BOARD_UID,
    mac: mac.toUpperCase(),
    firmware_version: FIRMWARE_VERSION
  });
}

function pararPareamento() {
  emParejamento = false;
  console.log("Parando modo de emparelhamento...");
  pararBlinkPareamento();
}

function setupPins() {
  for (var i = 0; i < watchIds.length; i++) clearWatch(watchIds[i]);
  watchIds = [];

  pinMode(PIN_VERDE, "input_pullup");
  pinMode(PIN_AMARELO, "input_pullup");
  pinMode(PIN_VERMELHO, "input_pullup");
  pinMode(PIN_LED_PAREAMENTO, "output");

  digitalWrite(PIN_LED_PAREAMENTO, 0);

  watchIds.push(setWatch(function() {
    enviaStatus("Produzindo");
  }, PIN_VERDE, {
    repeat: true,
    edge: "falling",
    debounce: DEBOUNCE_DELAY
  }));

  watchIds.push(setWatch(function() {
    enviaStatus("Parada");
  }, PIN_VERMELHO, {
    repeat: true,
    edge: "falling",
    debounce: DEBOUNCE_DELAY
  }));

  watchIds.push(setWatch(function() {
    var pressed = !digitalRead(PIN_AMARELO);

    if (pressed && !amareloIsPressed) {
      amareloIsPressed = true;
      setupLongPressTriggered = false;

      amareloLongPressTimer = setTimeout(function() {
        if (amareloIsPressed && !setupLongPressTriggered) {
          setupLongPressTriggered = true;
          solicitarPareamento();
        }
      }, 3000);
    }

    if (!pressed && amareloIsPressed) {
      amareloIsPressed = false;

      if (amareloLongPressTimer) {
        clearTimeout(amareloLongPressTimer);
        amareloLongPressTimer = undefined;
      }

      if (!setupLongPressTriggered) {
        if (emParejamento) pararPareamento();
        else enviaStatus("Setup");
      }
    }
  }, PIN_AMARELO, {
    repeat: true,
    edge: "both",
    debounce: DEBOUNCE_DELAY
  }));
}

wifi.on("connected", function() {
  onWiFiReady();
});

wifi.on("disconnected", function(details) {
  wifiReady = false;
  mqttConnected = false;

  console.log("Wi-Fi desconectado: " + JSON.stringify(details || {}));
  setTimeout(setupWiFi, 5000);
});

function onInit() {
  setupPins();
  setupWiFi();
}

onInit();