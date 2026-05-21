import app from './app.js';
import 'dotenv/config';
import './config/mqtt.js';

const PORT = process.env.PORT || 3001;


app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`)
});