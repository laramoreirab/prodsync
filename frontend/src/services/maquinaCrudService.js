// import { maquinasMockService } from "@/mocks/maquinasMock";
import { apiFetch } from "@/lib/api";

// trocar para false quando o backend estiver pronto p integração!!
const USE_MOCK = false;

const API_URL = "/api/maquinas";

// const apiService = {

  export const maquinaCrudService = {
  getAll: async () => {
    const options = { method: "GET" };
    return await apiFetch(`${API_URL}/`);
  },

  getById: async (id) => {
    const options = { method: "GET" };
    return await apiFetch(`${API_URL}/${id}`,options);
  },

  create: async (dados) => {
    const options = { method: "POST" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dados);
    }
    // if (dados instanceof FormData && dados.has("status")) {
    //   dados.set("status_atual", dados.get("status"));
    // }
    return await apiFetch(`${API_URL}/criarMaquina`, options);
  },

  update: async (id, dados) => {
    const options = { method: "PUT" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dados);
    }
    return await apiFetch(`${API_URL}/${id}`, options);
  },

  delete: async (id) => {
    return await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};


//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
// export const maquinaCrudService = USE_MOCK ? maquinasMockService : apiService;

//após a conexão com o backend, remover o arquivo maquinasMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
