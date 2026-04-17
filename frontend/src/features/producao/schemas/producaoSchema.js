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

export const OEESchema = z.object({
  disponibilidade: z.number().min(0).max(100),
  performance:     z.number().min(0).max(100),
  qualidade:       z.number().min(0).max(100),
  oee:             z.number().min(0).max(100),
});

export const PecasPorMinutoSchema = z.object({
  titulo: z.string(),
  valor: z.coerce.string(), //30, 12 etc
})

export const ProducaoPorTurnoLotesSchema = z.object({
  titulo: z.string(),
  valor: z.string(), 
})

export const ProducaoPorHoraArraySchema  = z.array(ProducaoPorHoraSchema);
export const ProducaoPorSetorArraySchema = z.array(ProducaoPorSetorSchema);
export const OEESchemaArraySchema = z.array(OEESchema);