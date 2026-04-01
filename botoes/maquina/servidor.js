// SERVIDOR PARA TESTES

// Importa o Express (A nossa "Agência dos Correios")
const express = require('express');
const app = express();

// Avisa ao servidor que ele vai receber dados no formato JSON
app.use(express.json());

// A Porta em que o servidor vai rodar (localhost:3000)
const PORTA = 3000;

/**
 * CRIANDO O ENDPOINT
 * Lembrando do caminho '/api/status' que foi colocado na Ponte. É aqui que ele é usado.
 */
app.post('/api/status', (req, res) => {
  // 'req.body' é o conteúdo (payload) que chegou no HTTP POST
  const dadosRecebidos = req.body;

  console.log("====================================");
  console.log("CHEGOU UMA REQUISIÇÃO NO BACKEND!");
  console.log(`Botão Pressionado: ${dadosRecebidos.button_id}`);
  console.log(`Status: ${dadosRecebidos.status}`);
  console.log(`Horário do clique: ${new Date(dadosRecebidos.timestamp).toLocaleString()}`);
  console.log("====================================\n");

  // O servidor responde com o código 200 (que significa "OK / Sucesso")
  // Isso avisa a Ponte que deu tudo certo, e a Ponte destrava o ESP32.
  res.status(200).send({ mensagem: "Dado recebido pelo servidor central!" });
});

// Liga o servidor e deixa ele escutando
app.listen(PORTA, () => {
  console.log(`Servidor do TCC rodando em http://localhost:${PORTA}`);
});