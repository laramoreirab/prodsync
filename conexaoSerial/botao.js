// PROJETO TCC - Módulo ESP32 (Lado Dispositivo - Versão Serial / Plano B)

// Limpa todos os watches e intervalos anteriores para evitar o erro "Unable to set watch"
clearWatch();
clearInterval();

const BOTOES = [D25, D26, D27]; // Array de Botões, posteriorente utilizado no "BOTOES.forEach"
let isLocked = false; // Mutex do código, serve para garantir que o pressionamento de múltiplos botões não seja reconhecido, apenas um funciona
let alarmeSeguranca; // Variável para guardar o nosso timer

// Envia o payload via Serial e aguarda confirmação

function dispararEvento(id) {
    if (isLocked) return; // Se houver processo em curso, ignora

    isLocked = true;

    // --- NOVA TRAVA DE SEGURANÇA (TIMEOUT DE 5 SEGUNDOS) ---
    alarmeSeguranca = setTimeout(() => {
        if (isLocked) {
            isLocked = false;
            print("LOG: ⚠️ TIMEOUT! O PC nao respondeu. Mutex liberado por segurança.");
        }
    }, 5000); // 5000 milissegundos = 5 segundos
    // -------------------------------------------------------

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

function liberarMutex() {
    isLocked = false;
    
    // Desarma o alarme se ele existir
    if (alarmeSeguranca) {
        clearTimeout(alarmeSeguranca);
    }
    
    print("LOG: ✅ Mutex liberado pelo PC (Via Comando).");
}

// /* Escuta a Serial: Quando o PC terminar o POST,
//    ele deve enviar "OK" para liberar o próximo clique. */
// Serial.on('data', function (data) {
//     if (data.includes("RELEASE_MUTEX")) {
//         isLocked = false;

//         if (alarmeSeguranca) {
//             clearTimeout(alarmeSeguranca);
//         }

//         print("LOG: Mutex liberado pelo PC.");
//     }
// });

print("LOG: ESP32 iniciado e aguardando cliques.");