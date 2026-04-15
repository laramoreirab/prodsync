
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
import { apiFetch } from "./api";
import {
  TendenciaRefugoArraySchema,
} from "@features/refugo/schemas/refugoSchema";
import { mockTendenciaRefugo } from "./mockData";

const USE_MOCK = true; 
export const refugoService = {
  async getTendenciaRefugo() {
    if (USE_MOCK) return TendenciaRefugoArraySchema.parse(mockTendenciaRefugo);
    const data = await apiFetch("/refugo/tendencias");
    return TendenciaRefugoArraySchema.parse(data);
  },

};