// // src/services/producaoService.js
// // Aqui ficam as funções específicas de produção, que usam o apiFetch genérico do api.js. Elas também fazem a validação dos dados usando os schemas do zod.
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

//   async getPorSetor() {
//     const data = await apiFetch("/producao/por_setor");
//     return ProducaoPorSetorArraySchema.parse(data);
//   },
// };



//Mock para desenvolvimento sem backend
import { apiFetch } from "./api";
import {
  ProducaoPorHoraArraySchema,
  ProducaoPorSetorArraySchema,
} from "@features/producao/schemas/producaoSchema";
import { mockProducaoPorSetor, mockProducaoPorHora } from "./mockData";

const USE_MOCK = true; 
export const producaoService = {
  async getPorHora() {
    if (USE_MOCK) return ProducaoPorHoraArraySchema.parse(mockProducaoPorHora);
    const data = await apiFetch("/producao/por_hora");
    return ProducaoPorHoraArraySchema.parse(data);
  },

  async getPorSetor() {
    if (USE_MOCK) return ProducaoPorSetorArraySchema.parse(mockProducaoPorSetor);
    const data = await apiFetch("/producao/por_setor");
    return ProducaoPorSetorArraySchema.parse(data);
  },
};