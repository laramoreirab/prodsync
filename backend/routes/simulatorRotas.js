import { Router } from 'express';
import { backfillHistory, seedSupportData, simulateCycle } from '../scripts/db-simulator.js';

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

router.post('/run', validarSegredo, async (req, res, next) => {
  try {
    const resultado = await simulateCycle();
    return res.json({ sucesso: true, resultado });
  } catch (error) {
    return next(error);
  }
});

router.get('/run', validarSegredo, async (req, res, next) => {
  try {
    const resultado = await simulateCycle();
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
