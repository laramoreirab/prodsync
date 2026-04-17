import { z } from "zod";

export const MaquinaStatusSchema = z.object({
  name:  z.string(),  // "Ativa", "Parada", "Manutenção"
  value: z.number(),  // percentual ou quantidade
});

export const MaquinaAtivaPorTurnoSchema = z.object({
  titulo: z.string(),
  valor: z.string(), //1h, 45 min, etc
})

export const MaquinaStatusArraySchema = z.array(MaquinaStatusSchema);
