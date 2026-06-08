import { apiFetch } from "@/lib/api.js";
import { TendenciaRefugoArraySchema } from "@features/refugo/schemas/refugoSchema";

export const refugoService = {
  async getTendenciaRefugo(setorId = null) {
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/dashboard/tendencia-refugo${query}`);
    return TendenciaRefugoArraySchema.parse(data.dados);
  },
};
