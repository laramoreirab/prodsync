import { z } from "zod";

export const TendenciaRefugoSchema = z.object({ dia: z.string(), qtd: z.number() });

export const TendenciaRefugoArraySchema = z.array(TendenciaRefugoSchema);
