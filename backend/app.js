import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { logMiddleware } from './middlewares/logMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js';

import routes from './routes/rotas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,https://prodsync-six.vercel.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(helmet(
    {
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false, // Desativa a CSP temporariamente para testes
    }
));

app.use(cors({
    origin: 'http://localhost:3000', // Permitir todas as origens. Ajuste conforme necessário. Ex.: 'http://meufrontend.com'
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logMiddleware)
app.use('/api', routes); //todas as rotas terao /api na frente pois e padrao RESTful (*lembrar disso)

// Middleware global de tratamento de erros (deve ser o ultimo)
app.use(errorMiddleware);
export default app
