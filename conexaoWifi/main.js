var wifi = require("Wifi");
var http = require("http"); // 1. Voltamos para o HTTP normal!

// Configuração de Pinos
var PIN_VERDE = D32;    // PRODUZINDO
var PIN_AMARELO = D33;  // SETUP
var PIN_VERMELHO = D25; // PARADA

// Configuração da Máquina
var MAQUINA_ID = 1;
var statusAtual = null; 

// --- 1. Gestão de Conexão Wi-Fi ---
function conectaWifi() {
  console.log("Conectando ao Wi-Fi...");
  wifi.connect("Phietro", { password: "jchr3942" }, function(err) {
    if (err) {
      console.log("Erro no Wi-Fi. Tentando novamente em 10s...");
      setTimeout(conectaWifi, 10000);
      return;
    }
    console.log("Conectado! IP: " + wifi.getIP().ip);
  });
}

// --- 2. Função de Envio HTTP POST ---
function enviaStatus(novoStatus) {
  if (statusAtual === novoStatus) return; 
  
  statusAtual = novoStatus;
  console.log("Mudança de Status: " + statusAtual);

  var dados = JSON.stringify({
    maquina_id: MAQUINA_ID,
    status: statusAtual
  });

  var options = {
    host: 'webhook.site', 
    port: 80, // 2. AQUI ESTÁ O SEGREDO! Porta 80 é o padrão da internet para HTTP
    path: '/5955e794-6d9a-47af-befb-ec1520a8f06f', 
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Content-Length": dados.length
    }
  };

  // 3. Voltamos para http.request
  var req = http.request(options, function(res) {
    res.on('data', function(data) {
      console.log("Resposta do Servidor: " + data);
    });
  });

  req.on('error', function(err) {
    console.log("Erro no Envio: ", err);
    statusAtual = null; 
  });

  req.end(dados);
}

// --- 3. Configuração dos Botões ---
function configuraBotoes() {
  pinMode(PIN_VERDE, "input_pullup");
  pinMode(PIN_AMARELO, "input_pullup");
  pinMode(PIN_VERMELHO, "input_pullup");

  setWatch(function() { 
    enviaStatus("PRODUZINDO"); 
  }, PIN_VERDE, { repeat: true, edge: "falling", debounce: 50 });

  setWatch(function() { 
    enviaStatus("SETUP"); 
  }, PIN_AMARELO, { repeat: true, edge: "falling", debounce: 50 });

  setWatch(function() { 
    enviaStatus("PARADA"); 
  }, PIN_VERMELHO, { repeat: true, edge: "falling", debounce: 50 });
}

// --- Inicialização ---
configuraBotoes();
conectaWifi();