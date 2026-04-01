// PROJETO TCC - Módulo ESP32 (Lado Dispositivo - Versão Wi-Fi / Plano A)

/*
Seria necessário utilizar um esp32 e um notebook onde ambos estariam conectados
na mesma rede(que planejo ser os dados móveis do celular), porém, também há outra
alternativa usando ngrok - sugerido pelo gemini. 
*/

const wifi = require("Wifi");
const http = require("http");

// Configurações da rede **UTILIZAR DADOS MÓVEIS**
const WIFI_NAME = "NOME_DA_REDE";
const WIFI_PASS = "SENHA_DA_REDE";

// URL do seu Backend (substitua pelo IP local da máquina rodando o Node.js) --> ip do notebook depois de conectar no roteador do celular
const BACKEND_URL = "http://192.168.1.100:3000/api/status";

const BOTOES = [D12, D13, D14]; // Array de Botões
let isLocked = false; // Mutex para evitar múltiplos envios simultâneos

// 1. Conectar ao Wi-Fi
function conectarWifi(callback) {
  console.log("LOG: Conectando ao Wi-Fi...");
  wifi.connect(WIFI_NAME, { password: WIFI_PASS }, function(err) {
    if (err) {
      console.log("ERRO: Falha no Wi-Fi:", err);
      return;
    }
    console.log("LOG: Conectado ao Wi-Fi! IP:", wifi.getIP().ip);
    if (callback) callback();
  });
}

// 2. Função para disparar o evento via HTTP POST
function dispararEvento(id) {
  if (isLocked) return; // Se houver processo em curso, ignora o clique

  isLocked = true; // Trava o sistema para novos cliques

  // Mapeamento automático pelo index do botão
  const STATUS_MAQUINA = ["PRODUZINDO", "SETUP/AJUSTE", "PARADA"];

  // Montando o payload (sem timestamp, conforme versão Serial)
  const payload = JSON.stringify({
    status: STATUS_MAQUINA[id],
    maquina_id: 1
  });

  console.log("LOG: Enviando via Wi-Fi:", payload);

  // Configurações da requisição HTTP
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length
    }
  };

  // Extrai host e path da URL configurada
  const parsedUrl = require("url").parse(BACKEND_URL);
  for (let key in parsedUrl) options[key] = parsedUrl[key];

  // Dispara a requisição
  const req = http.request(options, function(res) {
    res.on('data', function(data) {
      console.log("LOG: Resposta do servidor:", data);
      
      // O servidor respondeu, podemos liberar o Mutex
      isLocked = false; 
      console.log("LOG: Mutex liberado pelo sucesso do HTTP.");
    });
  });

  // Em caso de erro (ex: backend desligado), libera o mutex para não travar a placa para sempre
  req.on('error', function(err) {
    console.log("ERRO: Falha na requisição HTTP:", err.message);
    isLocked = false;
    console.log("LOG: Mutex liberado após erro de rede.");
  });

  req.write(payload);
  req.end();
}

// 3. Configuração dos Botões
function configurarBotoes() {
  BOTOES.forEach((pin, index) => {
    pinMode(pin, "input_pullup");

    setWatch(() => {
      dispararEvento(index);
    }, pin, { repeat: true, edge: "falling", debounce: 50 });
  });

  console.log("LOG: ESP32 iniciado (Modo Wi-Fi) e aguardando cliques.");
}

// Iniciar o sistema: Conecta no Wi-Fi e só depois libera os botões
conectarWifi(function() {
  configurarBotoes();
});