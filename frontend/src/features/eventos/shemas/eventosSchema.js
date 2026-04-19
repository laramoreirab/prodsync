import { z } from "zod";

export const ParadasComparadasSchema = z.object({
  name:  z.string(),  // "Justificada", "Não Justificada"
  value: z.number(),  // percentual ou quantidade
});

export const ParadasComparadasArraySchema = z.array(ParadasComparadasSchema);
