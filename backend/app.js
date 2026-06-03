import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { logMiddleware } from './middlewares/logMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config()

import routes from './routes/rotas.js'; //todas as rotas estão sendo servidas do arquivo rotas.js 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(helmet(
    {
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false, // Desativa a CSP temporariamente para testes
    }
));

app.use(cors({
    origin: '*', // Permitir temporariamente para debug
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logMiddleware)
app.use('/api', routes); //todas as rotas terão /api na frente pois é padrão RESTful (*lembrar disso)

// Middleware global de tratamento de erros (deve ser o último)
app.use(errorMiddleware);
export default app
