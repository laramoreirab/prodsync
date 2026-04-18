import { apiFetch } from "./api";
import { SetorArraySchema } from "@features/setores/schemas/setorSchema";
import { mockSetores } from "./mockData";

const USE_MOCK = true;

export const setorService = {
  async getSetores() {
    if (USE_MOCK) return SetorArraySchema.parse(mockSetores);
    const data = await apiFetch("/setores");
    return SetorArraySchema.parse(data);
  },
};