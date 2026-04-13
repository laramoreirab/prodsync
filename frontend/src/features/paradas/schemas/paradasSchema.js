// src/features/producao/schemas/producaoSchema.js
import { z } from "zod";

//ver se as informações estão no formato correto

export const MotivosFrequentesSchema = z.object({
  motivo: z.string(),    // "Manutenção", "Falha mecânica" ...
  qtd:  z.number(),    // peças produzidas
});

export const MotivosFrequentesArraySchema  = z.array(MotivosFrequentesSchema);