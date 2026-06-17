import { Router } from 'express';
import { backfillHistory, seedSupportData, simulateCycleParallel, simulateCyclePart } from '../scripts/db-simulator.js';

const router = Router();

function validarSegredo(req, res, next) {
  const segredoConfigurado = process.env.SIMULATOR_TRIGGER_SECRET;
  const segredoRecebido = req.get('x-simulator-secret') ?? req.query.secret;

  if (!segredoConfigurado) {
    return res.status(503).json({
      erro: 'Simulador desabilitado',
      mensagem: 'Configure SIMULATOR_TRIGGER_SECRET para habilitar esta rota.',
    });
  }

  if (segredoRecebido !== segredoConfigurado) {
    return res.status(401).json({
      erro: 'Acesso negado',
      mensagem: 'Segredo do simulador invalido.',
    });
  }

  return next();
}

function obterPartes(req) {
  const valor = Number(req.query.parts ?? req.body?.parts ?? process.env.SIMULATOR_PARALLEL_PARTS ?? 3);
  return Math.min(3, Math.max(1, Number.isFinite(valor) ? valor : 3));
}

function obterParte(req) {
  const valor = req.query.part ?? req.body?.part;
  if (!valor) return null;

  const match = String(valor).match(/^(\d+)\/(\d+)$/);
  if (match) {
    return {
      indice: Number(match[1]),
      partes: Math.min(3, Math.max(1, Number(match[2]))),
    };
  }

  return {
    indice: Number(valor),
    partes: obterPartes(req),
  };
}

async function executarSimulador(req) {
  const parte = obterParte(req);
  if (parte) {
    return simulateCyclePart(parte.indice, parte.partes);
  }

  return simulateCycleParallel(obterPartes(req));
}

router.post('/run', validarSegredo, async (req, res, next) => {
  try {
    const resultado = await executarSimulador(req);
    return res.json({ sucesso: true, resultado });
  } catch (error) {
    return next(error);
  }
});

router.get('/run', validarSegredo, async (req, res, next) => {
  try {
    const resultado = await executarSimulador(req);
    return res.json({ sucesso: true, resultado });
  } catch (error) {
    return next(error);
  }
});

router.post('/seed', validarSegredo, async (req, res, next) => {
  try {
    await seedSupportData();
    return res.json({ sucesso: true });
  } catch (error) {
    return next(error);
  }
});

router.post('/backfill', validarSegredo, async (req, res, next) => {
  try {
    await backfillHistory();
    return res.json({ sucesso: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
