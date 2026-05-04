import { z } from "zod";

export const AndonStatusMaquinasSchema = z.object({
  emProducao: z.number(),
  emSetup: z.number(),
  emParada: z.number(),
});

export const AndonRankingSchema = z.object({
  setor: z.string(),
  produtividade: z.number(),
});

export const AndonRankingArraySchema = z.array(AndonRankingSchema);

export const AndonMachineCardSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  status: z.enum(["emProducao", "emSetup", "emParada"]),
  operador: z.string(),
  detalheLabel: z.string(),
  detalheValor: z.string(),
  metaTurno: z.string(),
  metaDia: z.string(),
  oee: z.number(),
  tempoStatus: z.string(),
});

export const AndonSectionSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  maquinas: z.array(AndonMachineCardSchema).min(1),
});

export const AndonSectionArraySchema = z.array(AndonSectionSchema);
