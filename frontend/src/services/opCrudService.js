import { opMockService } from "@/mocks/opMock";

// trocar para false quando o backend estiver pronto p integração!!
const USE_MOCK = true;

const API_URL = "/api/ordens-producao";

const apiService = {
  //buscar todas as OPs
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar ordens de produção");
    return await response.json();
  },

  //buscar op por id
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar ordem de produção");
    return await response.json();
  },

  //criar nova OP
  create: async (dados) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao criar ordem de produção");
    return await response.json();
  },

  //atualizar OP
  update: async (id, dados) => {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_ordem: id, ...dados }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar ordem de produção");
    return await response.json();
  },

  //deletar OP
  delete: async (id, id_maquina) => {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_ordem: id, id_maquina }),
    });
    if (!response.ok) throw new Error("Erro ao excluir ordem de produção");
    return true;
  },
};

//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
export const opCrudService = USE_MOCK ? opMockService : apiService;
//após a conexão com o backend, remover o arquivo opMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const opCrudService ={o que ta dentro de apiService aqui dentro}