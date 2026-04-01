// PROJETO TCC - Módulo ESP32 (Lado Dispositivo - Versão Serial / Plano B)

const BOTOES = [D12, D13, D14]; // Array de Botões, posteriorente utilizado no "BOTOES.forEach"
let isLocked = false; // Mutex do código, serve para garantir que o pressionamento de múltiplos botões não seja reconhecido, apenas um funciona

// Envia o payload via Serial e aguarda confirmação

function dispararEvento(id) {
    if (isLocked) return; // Se houver processo em curso, ignora

    isLocked = true;

    // 1. Criando uma lista (Array) onde a posição reflete o ID do botão
    // ID 0 = PRODUZINDO, ID 1 = SETUP/AJUSTE, ID 2 = PARADA
    const STATUS_MAQUINA = ["PRODUZINDO", "SETUP/AJUSTE", "PARADA"];

    // 2. Montando o payload de uma vez só (usando const, pois não vamos reatribuir)
    const payload = {
        status: STATUS_MAQUINA[id], // Ele pega o texto automático baseado no ID!
        maquina_id: 1,
        /* timestamp: Date.now() Retirei o timestamp pois o ESP32 precisa se conectar a internet para
        saber a hora, por isso, a data está sendo adicionada no próprio BackEnd */
    };

    /* Usamos um prefixo 'DATA:' para o PC saber que isso é um dado, não um log
       'DATA:' é posteriormente retirado da informação para que apenas o JSON seja enviado ao BackEnd */
    print("DATA:" + JSON.stringify(payload));
}

// Configuração dos Botões
BOTOES.forEach((pin, index) => {
    pinMode(pin, "input_pullup");

    setWatch(() => {
        dispararEvento(index);
    }, pin, { repeat: true, edge: "falling", debounce: 50 });
});

/* Escuta a Serial: Quando o PC terminar o POST,
   ele deve enviar "OK" para liberar o próximo clique. */
USB.on('data', function (data) {
    if (data.includes("RELEASE_MUTEX")) {
        isLocked = false;
        print("LOG: Mutex liberado pelo PC.");
    }
});

print("LOG: ESP32 iniciado e aguardando cliques.");