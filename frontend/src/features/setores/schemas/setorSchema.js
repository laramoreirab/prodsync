import { z } from "zod";

export const SetorSchema = z.object({
  id: z.number(),
  setor: z.string(),
  gestor: z.string(),
  oeeMedio: z.number().min(0).max(100),
  qtdMaquinas: z.number(),
  qtdOperadores: z.number(),
});

export const SetorArraySchema = z.array(SetorSchema);