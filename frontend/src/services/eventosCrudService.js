import { eventosMockService } from "@/mocks/eventosMock";

// trocar para false quando o backend estiver pronto p integração!!
const USE_MOCK = true;

const API_URL = "/api/eventos";

const apiService = {
    //buscar todos os eventos
    getAll: async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar eventos");
        return await response.json();
    },

    //buscar evento por id
    getById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar evento");
        return await response.json();
    },

    //buscar eventos justificados
    getJustificados: async () => {
        const response = await fetch(`${API_URL}/justificadas`);
        if (!response.ok) throw new Error("Erro ao buscar eventos justificados");
        return await response.json();
    },

    //buscar eventos não justificados
    getNaoJustificados: async () => {
        const response = await fetch(`${API_URL}/nao-justificadas`);
        if (!response.ok) throw new Error("Erro ao buscar eventos não justificados");
        return await response.json();
    },

    //registrar evento 
    create: async (dados) => {
        const response = await fetch(`${API_URL}/sistema`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });
        if (!response.ok) throw new Error("Erro ao registrar evento");
        return await response.json();
    },

    //editar/justificar evento
    justificar: async (dados) => {
        const response = await fetch(`${API_URL}/justificar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });
        if (!response.ok) throw new Error("Erro ao justificar evento");
        return await response.json();
    },
};

//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
export const eventosCrudService = USE_MOCK ? eventosMockService : apiService;
//após a conexão com o backend, remover o arquivo maquinasMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const eventosCrudService ={o que ta dentro de apiService aqui dentro}