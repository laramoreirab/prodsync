import { apiFetch } from "@/lib/api.js";
import { TendenciaRefugoArraySchema } from "@features/refugo/schemas/refugoSchema";

export const refugoService = {
  async getTendenciaRefugo() {
    const data = await apiFetch("/api/dashboard/tendencia-refugo");
    return TendenciaRefugoArraySchema.parse(data.dados);
  },
};