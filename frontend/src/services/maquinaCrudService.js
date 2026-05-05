import { maquinasMockService } from "@/mocks/maquinasMock";

// trocar para false quando o backend estiver pronto p integração!!
const USE_MOCK = true;

const API_URL = "/api/maquinas";

const apiService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar máquinas");
    return await response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar detalhes da máquina");
    return await response.json();
  },

  create: async (dados) => {
    const options = { method: "POST" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dados);
    }
    const response = await fetch(API_URL, options);
    if (!response.ok) throw new Error("Erro ao cadastrar máquina");
    return await response.json();
  },

  update: async (id, dados) => {
    const options = { method: "PUT" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dados);
    }
    const response = await fetch(`${API_URL}/${id}`, options);
    if (!response.ok) throw new Error("Erro ao atualizar máquina");
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao excluir máquina");
    return true;
  },
};


//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
export const maquinaCrudService = USE_MOCK ? maquinasMockService : apiService;

//após a conexão com o backend, remover o arquivo maquinasMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const maquinaCrudService ={o que ta dentro de apiService aqui dentro}