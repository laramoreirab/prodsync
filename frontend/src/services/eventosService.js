import { apiFetch } from "./api";
import { mockParadasComparadas } from "./mockData";
import { ParadasComparadasArraySchema } from "@/features/eventos/schemas/eventosSchema";

const USE_MOCK = true;

export const eventosService = {
    async getParadasComparadas() {
        if (USE_MOCK) return ParadasComparadasArraySchema.parse(mockParadasComparadas);
        const data = await apiFetch("/eventos/justificativas_comparadas");
        return ParadasComparadasArraySchema.parse(data);
    },
}

