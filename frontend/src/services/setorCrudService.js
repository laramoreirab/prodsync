import { setorMockService } from "@/mocks/setoresMock";

// trocar para false quando o backend estiver pronto p integração!!
const USE_MOCK = true;

const API_URL = "/api/setores";

const apiService = {
  //buscar todas as OPs
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar setores");
    return await response.json();
  },

  //buscar setor por id
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar setor");
    return await response.json();
  },

  //criar novo setor
  create: async (dados) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao criar setor");
    return await response.json();
  },

  //atualizar setor
  update: async (id, dados) => {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_ordem: id, ...dados }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar setor");
    return await response.json();
  },

  //deletar setor
  delete: async (id, id_maquina) => {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_ordem: id, id_maquina }),
    });
    if (!response.ok) throw new Error("Erro ao excluir setor");
    return true;
  },
};

//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
export const setorCrudService = USE_MOCK ? setorMockService : apiService;
//após a conexão com o backend, remover o arquivo setorMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const setorCrudService ={o que ta dentro de apiService aqui dentro}