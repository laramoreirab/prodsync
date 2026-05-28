const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

const SERIAL_PATH = process.env.SERIAL_PATH || 'COM7';
const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

const port = new SerialPort({ path: SERIAL_PATH, baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

async function enviarEvento(jsonRaw) {
    const payload = JSON.parse(jsonRaw);
    payload.timestamp = Date.now();

    console.log('Recebido evento do ESP32:', payload);
    const response = await axios.post(`${API_BASE_URL}/placas/eventos`, payload);
    console.log('Resposta do backend:', response.status);
    port.write('liberarMutex();\n');
}

async function enviarPareamento(jsonRaw) {
    const payload = JSON.parse(jsonRaw);

    console.log('Recebido pareamento do ESP32:', payload);
    const response = await axios.post(`${API_BASE_URL}/placas/pareamento`, payload);
    console.log('Resposta do backend:', response.status, response.data?.dados ?? response.data);
}

console.log(`Aguardando dados do ESP32 em ${SERIAL_PATH}...`);
console.log(`Backend configurado em ${API_BASE_URL}`);

parser.on('data', async (line) => {
    const linhaLimpa = line.trim();

    try {
        if (linhaLimpa.startsWith('DATA:')) {
            await enviarEvento(linhaLimpa.replace('DATA:', ''));
            return;
        }

        if (linhaLimpa.startsWith('PAIRING:')) {
            await enviarPareamento(linhaLimpa.replace('PAIRING:', ''));
            return;
        }

        console.log('ESP32_LOG:', line);
    } catch (err) {
        console.error('Erro ao processar dado do ESP32:', err.response?.data ?? err.message);

        if (linhaLimpa.startsWith('DATA:')) {
            port.write('liberarMutex();\n');
        }
    }
});
