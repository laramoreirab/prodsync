import { z } from "zod";

export const MaquinaStatusSchema = z.object({
  name:  z.string(),  // "Ativa", "Parada", "Manutenção"
  value: z.number(),  // percentual ou quantidade
});

export const MaquinaStatusArraySchema = z.array(MaquinaStatusSchema);