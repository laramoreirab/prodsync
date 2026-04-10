// PC_BRIDGE.js

/* Este arquivo serve como ponte para o cabo USB transmitir informações do ESP32 para o BackEnd */

const { SerialPort } = require('serialport'); /* É a biblioteca que ensina o
Node.js a "abrir a porta USB" e escutar esses bytes. É ela que se conecta na
porta COM3 (no Windows) ou /dev/ttyUSB0 (no Linux). */

const { ReadlineParser } = require('@serialport/parser-readline'); /*
É um "Organizador de Frases". Como o ESP32 envia os dados continuamente,
o Node.js não sabe onde uma mensagem começa ou termina. O ReadlineParser
fica agrupando os caracteres recebidos e, só quando ele detecta uma quebra
de linha (um "Enter" / \n), ele entrega a frase inteira para o seu código ler. */

const axios = require('axios'); /*
É uma das bibliotecas mais famosas do mundo para fazer HTTP POST (ou GET).
Ele pega aquela String JSON que chegou pelo cabo USB e faz a entrega oficial para o seu Backend local (localhost:3000).
*/

// 1. Configurar a porta correta (Ex: COM3 no Windows ou /dev/ttyUSB0 no Linux)
const port = new SerialPort({ path: 'COM7', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const BACKEND_URL = "http://localhost:3000/api/status"; // O backend local **Apenas exemplo**

console.log("Aguardando dados do ESP32...");

parser.on('data', async (line) => {
    const linhaLimpa = line.trim();
    // Verifica se a linha recebida é um dado válido
    if (linhaLimpa.startsWith("DATA:")) {
        const jsonRaw = linhaLimpa.replace("DATA:", "");

        try {
            const payload = JSON.parse(jsonRaw);
            console.log("Recebido do ESP32:", payload);
            // O Backend carimba a hora exata da chegada
            payload.timestamp = Date.now();

            // 2. Faz o HTTP POST para o seu backend local
            console.log("Enviando POST para o backend...");
            const response = await axios.post(BACKEND_URL, payload);

            console.log("Resposta do Backend:", response.status);

            // 3. Avisa o ESP32 que ele pode liberar os botões novamente
            port.write("liberarMutex();\n");

        } catch (err) {
            console.error("Erro ao processar ou enviar dado:", err.message);
            port.write("liberarMutex();\n");
            // // Libera mesmo em caso de erro para não travar o hardware
            // port.write("RELEASE_MUTEX\n");
        }
    } else {
        // Apenas exibe logs comuns vindos do ESP32
        console.log("ESP32_LOG:", line);
    }
});