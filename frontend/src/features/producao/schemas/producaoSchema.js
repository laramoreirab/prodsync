// src/features/producao/schemas/producaoSchema.js
import { z } from "zod";

//ver se as informações estão no formato correto

export const ProducaoPorHoraSchema = z.object({
  hora: z.string(),    // "08h", "10h", ...
  pcs:  z.number(),    // peças produzidas
});

export const ProducaoPorSetorSchema = z.object({
  setor: z.string(),   // "Engrenagens", "Turbinas", ...
  qtd:   z.number(),
});

export const ProducaoPorHoraArraySchema  = z.array(ProducaoPorHoraSchema);
export const ProducaoPorSetorArraySchema = z.array(ProducaoPorSetorSchema);