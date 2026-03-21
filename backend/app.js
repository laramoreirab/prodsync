import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logMiddleware } from './middlewares/logMiddleware.js'

import routes from './routes/rotas.js'; //todas as rotas estão sendo servidas do arquivo rotas.js 

const app = express();

app.use(helmet({}));
app.use(cors({}));
app.use(express.json());

app.use('/api', routes); //todas as rotas terão /api na frente pois é padrão RESTful (*lembrar disso)

dotenv.config()
app.use(logMiddleware)

export default app