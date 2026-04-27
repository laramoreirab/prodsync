import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logMiddleware } from './middlewares/logMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js';

import routes from './routes/rotas.js'; //todas as rotas estão sendo servidas do arquivo rotas.js 

const app = express();

app.use(helmet(
    {
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false, // Desativa a CSP temporariamente para testes
    }
));
app.use(cors({
    origin: 'http://localhost:3000', // Permitir todas as origens. Ajuste conforme necessário. Ex.: 'http://meufrontend.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    preflightContinue: false, // Não passar para o próximo middleware
    optionsSuccessStatus: 200 // Responder com 200 para requisições OPTIONS
}));
app.use(express.json());

app.use('/api', routes); //todas as rotas terão /api na frente pois é padrão RESTful (*lembrar disso)

dotenv.config()
app.use(logMiddleware)

// Middleware global de tratamento de erros (deve ser o último)
app.use(errorMiddleware);
export default app