import { z } from "zod";

export const TendenciaRefugoSchema = z.object({
  hora: z.string(),    // "08h", "10h", ...
  pcs:  z.number(),    // peças produzidas
});

export const TendenciaRefugoArraySchema  = z.array(TendenciaRefugoSchema);
