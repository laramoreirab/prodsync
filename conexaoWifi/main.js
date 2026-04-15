var wifi = require("Wifi");
var http = require("http");

// Configuração de Pinos (Ajuste conforme sua montagem)
var PIN_VERDE = D32;    // PRODUZINDO
var PIN_AMARELO = D33;  // SETUP
var PIN_VERMELHO = D25; // PARADA

// Configuração da Máquina
var MAQUINA_ID = 1;
var statusAtual = null; // Começa nulo para forçar o primeiro envio

// --- 1. Gestão de Conexão Wi-Fi ---
function conectaWifi() {
  console.log("Conectando ao Wi-Fi...");
  wifi.connect("NOME_DA_SUA_REDE", { password: "SENHA_DA_REDE" }, function(err) {
    if (err) {
      console.log("Erro no Wi-Fi. Tentando novamente em 10s...");
      setTimeout(conectaWifi, 10000);
      return;
    }
    console.log("Conectado! IP: " + wifi.getIP().ip);
    
    // Opcional: Piscar um LED na placa para avisar que está online
  });
}

// --- 2. Função de Envio HTTP POST ---
function enviaStatus(novoStatus) {
  // Evita spam na rede se apertarem o mesmo botão várias vezes
  if (statusAtual === novoStatus) return; 
  
  statusAtual = novoStatus;
  console.log("Mudança de Status: " + statusAtual);

  var dados = JSON.stringify({
    maquina_id: MAQUINA_ID,
    status: statusAtual
    // O backend Next.js vai gerar o timestamp ao receber isso!
  });

  var options = {
    host: 'ip-do-seu-backend-ou-dominio.com',
    port: 3000, // Porta do Next.js local (ou 80/443 em prod)
    path: '/api/apontamento', // Rota que você vai criar no Next.js
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Content-Length": dados.length
    }
  };

  var req = http.request(options, function(res) {
    res.on('data', function(data) {
      console.log("Resposta do Servidor: " + data);
    });
  });

  req.on('error', function(err) {
    console.log("Erro no Envio: ", err);
    statusAtual = null; // Reseta o status para permitir tentar enviar de novo
  });

  req.end(dados);
}

// --- 3. Configuração dos Botões (Interrupções com Debounce) ---
function configuraBotoes() {
  // Configura os pinos com pull-up interno (nível alto por padrão)
  pinMode(PIN_VERDE, "input_pullup");
  pinMode(PIN_AMARELO, "input_pullup");
  pinMode(PIN_VERMELHO, "input_pullup");

  // setWatch detecta a borda de descida (quando o botão liga no GND)
  // O debounce de 50ms resolve o "repique" mecânico do botão
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