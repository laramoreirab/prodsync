
// import { apiFetch } from "./api";
// import {
//   ProducaoPorHoraArraySchema,
//   ProducaoPorSetorArraySchema,
// } from "@features/producao/schemas/producaoSchema";

// export const producaoService = {
//   async getPorHora() {
//     const data = await apiFetch("/producao/por_hora");
//     return ProducaoPorHoraArraySchema.parse(data); 
//   },

// };


//Mock para desenvolvimento sem backend
import { apiFetch } from "@/lib/api.js";
import {
  TendenciaRefugoArraySchema,
} from "@features/refugo/schemas/refugoSchema";
import { mockTendenciaRefugo } from "./mockData";

const USE_MOCK = false; 
export const refugoService = {
  async getTendenciaRefugo() {
    if (USE_MOCK) return TendenciaRefugoArraySchema.parse(mockTendenciaRefugo);
    const data = await apiFetch("/api/dashboard/tendencia-refugo");
    return TendenciaRefugoArraySchema.parse(data.dados);
  },

};