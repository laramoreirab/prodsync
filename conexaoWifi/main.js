var wifi = require("Wifi");
var net = require("net");

// --- Configuracoes de Rede ---
var ssid = "Phietro";
var password = "qpjf3874";
var mqtt_server = "broker.hivemq.com";

// --- Definicao dos Pinos ---
var PIN_VERDE = D32;
var PIN_AMARELO = D33;
var PIN_VERMELHO = D25;
var PIN_LED = D27;
var LED_LIGADO = 1;
var LED_DESLIGADO = 0;

// --- Constantes do Sistema ---
var FIRMWARE_VERSION = "wifi-1.1.0";
var BOARD_UID = typeof getSerial === "function" ? "esp32-" + getSerial() : "esp32-prodsync-001";
var mac = null;

var statusAtual = null;
var ultimoStatusRegistrado = null;
var clienteMQTT = null;
var mqttConectado = false;
var mqttBuffer = "";
var mqttPingInterval = null;
var mqttReconectarTimer = null;
var mqttPacoteId = 1;
var setupHoldTimer = null;
var setupLongPressTriggered = false;
var ledPiscanteInterval = null;
var botoesPollInterval = null;
var pareado = false;

var TOPICO_STATUS = "phietro/fabrica/" + BOARD_UID + "/status";
var TOPICO_PAREAMENTO = "phietro/fabrica/pareamento";
var TOPICO_CONTROLE = "phietro/fabrica/" + BOARD_UID + "/controle";
var DEBOUNCE_SEGUNDOS = 0.08;

var botaoVerde = {};
var botaoAmarelo = {};
var botaoVermelho = {};

function obterMac() {
  try {
    var detalhes = wifi.getDetails ? wifi.getDetails() : null;
    return detalhes && detalhes.mac ? detalhes.mac : null;
  } catch (e) {
    console.log("Erro ao obter MAC: " + e);
    return;
  }
}

function publicaJson(topico, dados) {
  if (!clienteMQTT || !mqttConectado) {
    console.log("Aguarde, MQTT ainda nao conectou...");
    return false;
  }

  var payload = JSON.stringify(dados);
  clienteMQTT.write(mqttPublicarPacote(topico, payload));
  console.log("Publicado MQTT:", topico, payload);
  return true;
}

function conectaWifi() {
  console.log("Limpando conexoes antigas...");
  wifi.disconnect();

  setTimeout(function() {
    console.log("Tentando conectar ao Wi-Fi: Phietro...");
    wifi.connect("Phietro", { password: "qpjf3874" }, function(err) {
      if (err) {
        console.log("Erro no Wi-Fi. Tentando em 10s...");
        setTimeout(conectaWifi, 10000);
        return;
      }
      console.log("Wi-Fi conectado. IP:", wifi.getIP().ip);
      mac = obterMac();
      conectaBroker();
    });
  }, 1000);
}

var sFCC = String.fromCharCode;

function mqttString(valor) {
  return sFCC(valor.length >> 8, valor.length & 255) + valor;
}

function mqttTamanhoPacote(tamanho) {
  var resultado = "";
  do {
    var digito = tamanho & 127;
    tamanho = tamanho >> 7;
    if (tamanho > 0) {
      digito = digito | 128;
    }
    resultado += sFCC(digito);
  } while (tamanho > 0);
  return resultado;
}

function mqttPacote(comando, variavel, payload) {
  return sFCC(comando) + mqttTamanhoPacote(variavel.length + payload.length) + variavel + payload;
}

function mqttPacoteConexao() {
  return mqttPacote(
    16,
    mqttString("MQTT") + sFCC(4, 2, 0, 60),
    mqttString(BOARD_UID)
  );
}

function mqttNovoPacoteId() {
  mqttPacoteId++;
  if (mqttPacoteId > 65535) {
    mqttPacoteId = 1;
  }
  return mqttPacoteId;
}

function mqttAssinarPacote(topico) {
  var id = mqttNovoPacoteId();
  return mqttPacote(130, sFCC(id >> 8, id & 255), mqttString(topico) + sFCC(0));
}

function mqttPublicarPacote(topico, mensagem) {
  return mqttPacote(48, mqttString(topico), mensagem);
}

function mqttPingPacote() {
  return sFCC(192, 0);
}

function mqttPubAckPacote(id) {
  return sFCC(64, 2, id >> 8, id & 255);
}

function agendaReconexaoMqtt() {
  if (mqttPingInterval) {
    clearInterval(mqttPingInterval);
    mqttPingInterval = null;
  }

  mqttConectado = false;

  if (mqttReconectarTimer) {
    return;
  }

  console.log("Desconectado do Broker. Tentando reconectar...");
  mqttReconectarTimer = setTimeout(function() {
    mqttReconectarTimer = null;
    conectaBroker();
  }, 5000);
}

function processaMensagemMqtt(topico, mensagem) {
  console.log("Mensagem recebida em " + topico + ": " + mensagem);

  if (topico === TOPICO_CONTROLE) {
    var resposta = null;
    try {
      resposta = JSON.parse(mensagem);
    } catch (e) {
      console.log("Mensagem de controle invalida:", mensagem);
      return;
    }

    if (
      resposta.status === "success" ||
      resposta.status === "pareado" ||
      resposta.tipo === "PAREAMENTO_CONCLUIDO"
    ) {
      pareado = true;
      pararPiscarLed();
      console.log("LOG: Placa pareada com sucesso! LED parado.");
    } else if (resposta.tipo === "PARAR_PAREAMENTO") {
      pareado = false;
      pararPiscarLed();
      console.log("LOG: Pareamento cancelado. LED parado.");
    } else if (resposta.tipo === "STATUS_REGISTRADO") {
      if (resposta.status) {
        ultimoStatusRegistrado = resposta.status;
        console.log("Status confirmado pelo backend: " + ultimoStatusRegistrado);
      }
    } else if (resposta.tipo === "STATUS_REJEITADO") {
      console.log(
        "Backend rejeitou o status " +
        (resposta.status || "") +
        ": " +
        (resposta.mensagem || "sem detalhes")
      );
    }
  }
}

function mqttLerTamanho(dados) {
  var multiplicador = 1;
  var valor = 0;
  var indice = 1;
  var digito = 0;

  do {
    if (indice >= dados.length) {
      return null;
    }
    digito = dados.charCodeAt(indice);
    valor += (digito & 127) * multiplicador;
    multiplicador *= 128;
    indice++;
  } while ((digito & 128) !== 0);

  return {
    valor: valor,
    bytes: indice - 1
  };
}

function mqttProcessaPacote(comando, dados) {
  var tipo = comando >> 4;

  if (tipo === 2) {
    if (dados.charCodeAt(1) === 0) {
      mqttConectado = true;
      console.log("Conectado ao Broker HiveMQ.");
      clienteMQTT.write(mqttAssinarPacote(TOPICO_CONTROLE));
      console.log("Escutando controle:", TOPICO_CONTROLE);

      if (mqttPingInterval) {
        clearInterval(mqttPingInterval);
      }
      mqttPingInterval = setInterval(function() {
        if (clienteMQTT && mqttConectado) {
          clienteMQTT.write(mqttPingPacote());
        }
      }, 45000);
    } else {
      console.log("Broker recusou MQTT. Codigo:", dados.charCodeAt(1));
      agendaReconexaoMqtt();
    }
    return;
  }

  if (tipo === 3) {
    var qos = (comando & 6) >> 1;
    var tamanhoTopico = (dados.charCodeAt(0) << 8) | dados.charCodeAt(1);
    var topico = dados.substr(2, tamanhoTopico);
    var inicioMensagem = 2 + tamanhoTopico;
    var idPacote = 0;

    if (qos > 0) {
      idPacote = (dados.charCodeAt(inicioMensagem) << 8) | dados.charCodeAt(inicioMensagem + 1);
      inicioMensagem += 2;
      clienteMQTT.write(mqttPubAckPacote(idPacote));
    }

    processaMensagemMqtt(topico, dados.substr(inicioMensagem));
    return;
  }

  if (tipo === 9) {
    console.log("Inscricao MQTT confirmada.");
  }
}

function mqttRecebeDados(dados) {
  mqttBuffer += dados;

  while (mqttBuffer.length > 1) {
    var tamanho = mqttLerTamanho(mqttBuffer);
    if (!tamanho) {
      return;
    }

    var total = 1 + tamanho.bytes + tamanho.valor;
    if (mqttBuffer.length < total) {
      return;
    }

    var comando = mqttBuffer.charCodeAt(0);
    var payload = mqttBuffer.substr(1 + tamanho.bytes, tamanho.valor);
    mqttBuffer = mqttBuffer.substr(total);
    mqttProcessaPacote(comando, payload);
  }
}

function conectaBroker() {
  console.log("Conectando ao broker MQTT...");
  mqttConectado = false;
  mqttBuffer = "";

  if (mqttPingInterval) {
    clearInterval(mqttPingInterval);
    mqttPingInterval = null;
  }

  try {
    if (clienteMQTT) {
      clienteMQTT.end();
    }
  } catch (e) {
  }

  try {
    clienteMQTT = net.connect({ host: "broker.hivemq.com", port: 1883 }, function() {
      console.log("TCP MQTT conectado. Enviando CONNECT...");
      clienteMQTT.write(mqttPacoteConexao());
    });

    clienteMQTT.on("data", mqttRecebeDados);
    clienteMQTT.on("end", agendaReconexaoMqtt);
    clienteMQTT.on("error", function(erro) {
      console.log("Erro MQTT:", erro);
      agendaReconexaoMqtt();
    });
  } catch (e) {
    console.log("Erro ao iniciar MQTT:", e);
    agendaReconexaoMqtt();
  }
}

function solicitarPareamento() {
  mac = obterMac() || mac;

  return publicaJson(TOPICO_PAREAMENTO, {
    tipo: "PAIRING_REQUEST",
    board_uid: BOARD_UID,
    mac: mac ? mac.toUpperCase() : "",
    firmware_version: FIRMWARE_VERSION
  });
}

function enviaStatus(novoStatus) {
  if (statusAtual === novoStatus) return;
  statusAtual = novoStatus;

  publicaJson(TOPICO_STATUS, {
    board_uid: BOARD_UID,
    status: statusAtual
  });
}

function piscarLed() {
  if (ledPiscanteInterval) {
    clearInterval(ledPiscanteInterval);
  }
  
  var estado = false;
  digitalWrite(PIN_LED, LED_LIGADO);
  ledPiscanteInterval = setInterval(function() {
    digitalWrite(PIN_LED, estado ? LED_LIGADO : LED_DESLIGADO);
    estado = !estado;
  }, 500);
  
  console.log("LOG: LED iniciado piscando na porta D27");
}

function pararPiscarLed() {
  if (ledPiscanteInterval) {
    clearInterval(ledPiscanteInterval);
    ledPiscanteInterval = null;
    console.log("LOG: LED parou de piscar");
  }
  digitalWrite(PIN_LED, LED_DESLIGADO);
}

function preparaBotao(botao, pin) {
  var leitura = digitalRead(pin);
  botao.pin = pin;
  botao.leitura = leitura;
  botao.estavel = leitura;
  botao.ultimaMudanca = getTime();
}

function atualizaBotao(botao, aoPressionar, aoSoltar) {
  var leitura = digitalRead(botao.pin);
  var agora = getTime();

  if (leitura !== botao.leitura) {
    botao.leitura = leitura;
    botao.ultimaMudanca = agora;
    return;
  }

  if (leitura === botao.estavel || agora - botao.ultimaMudanca < DEBOUNCE_SEGUNDOS) {
    return;
  }

  var anterior = botao.estavel;
  botao.estavel = leitura;

  if (anterior === 1 && leitura === 0) {
    aoPressionar();
  } else if (anterior === 0 && leitura === 1 && aoSoltar) {
    aoSoltar();
  }
}

function aoVerdePressionado() {
  setTimeout(function() { enviaStatus("Produzindo"); }, 10);
}

function aoAmareloPressionado() {
  setupLongPressTriggered = false;
  if (setupHoldTimer) {
    clearTimeout(setupHoldTimer);
  }

  setupHoldTimer = setTimeout(function() {
    setupHoldTimer = null;
    setupLongPressTriggered = true;
    if (solicitarPareamento()) {
      piscarLed();
    }
  }, 3000);
}

function aoAmareloSolto() {
  if (setupHoldTimer) {
    clearTimeout(setupHoldTimer);
    setupHoldTimer = null;
  }

  if (!setupLongPressTriggered) {
    setTimeout(function() { enviaStatus("Setup"); }, 10);
  }
}

function aoVermelhoPressionado() {
  setTimeout(function() { enviaStatus("Parada"); }, 10);
}

function verificaBotoes() {
  atualizaBotao(botaoVerde, aoVerdePressionado, null);
  atualizaBotao(botaoAmarelo, aoAmareloPressionado, aoAmareloSolto);
  atualizaBotao(botaoVermelho, aoVermelhoPressionado, null);
}

function configuraBotoes() {
  pinMode(PIN_VERDE, "input_pullup");
  pinMode(PIN_AMARELO, "input_pullup");
  pinMode(PIN_VERMELHO, "input_pullup");
  pinMode(PIN_LED, "output");
  digitalWrite(PIN_LED, LED_DESLIGADO);

  preparaBotao(botaoVerde, PIN_VERDE);
  preparaBotao(botaoAmarelo, PIN_AMARELO);
  preparaBotao(botaoVermelho, PIN_VERMELHO);

  if (botoesPollInterval) {
    clearInterval(botoesPollInterval);
  }

  botoesPollInterval = setInterval(verificaBotoes, 50);
  console.log("LOG: Botoes configurados por polling");
}

console.log("ESP32 iniciado. Board UID:", BOARD_UID);
configuraBotoes();
conectaWifi();
