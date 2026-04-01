// SERVIDOR PARA TESTES

// backend.js (Rode com: node backend.js)
const express = require('express');
const app = express();
const porta = 3000;

// Middleware essencial para o Express entender JSON no corpo do POST
app.use(express.json());

// Rota que vai receber o POST do ESP32
app.post('/api/status', (req, res) => {
    const dados = req.body;
    
    console.log("=== NOVO STATUS RECEBIDO ===");
    console.log(`Máquina ID: ${dados.maquina_id}`);
    console.log(`Status: ${dados.status}`);
    console.log(`Horário: ${dados.timestamp}`);
    console.log("============================");

    // Responde ao ESP32 que deu tudo certo (Evita que o ESP32 fique travado esperando resposta)
    res.status(200).send("Status registrado com sucesso!");
});

app.listen(porta, '0.0.0.0', () => {
    console.log(`Servidor rodando e escutando na porta ${porta}`);
});