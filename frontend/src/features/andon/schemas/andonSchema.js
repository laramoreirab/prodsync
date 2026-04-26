import { z } from "zod";
 
export const AndonStatusMaquinasSchema = z.object({
  emProducao: z.number(),
  emSetup:    z.number(),
  emParada:   z.number(),
});
 
export const AndonRankingSchema = z.object({
  setor:         z.string(), // nome da máquina (ex: "THAK-9879")
  produtividade: z.number(),
});
 
export const AndonRankingArraySchema = z.array(AndonRankingSchema);
 