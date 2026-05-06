import { setorMockService } from "@/mocks/setorMock";

// trocar para false quando o backend estiver pronto p integração!!
const USE_MOCK = true;

const API_URL = "/api/setores";

const apiService = {
  // buscar todos os setores
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar setores");
    return await response.json();
  },

  // buscar setor por ID — id vai na URL
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar setor");
    return await response.json();
  },

  // criar setor
  // campos: nome_setor, localizacao
  create: async (dados) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao criar setor");
    return await response.json();
  },

  // atualizar setor — id vai na URL
  // campos: nome_setor
  update: async (id, dados) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao atualizar setor");
    return await response.json();
  },

  // Deletar setor — id vai na URL
  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir setor");
    return true;
  },

  // associar máquinas ao setor — ids_maquinas (array), id do setor na URL
  associarMaquinas: async (id_setor, ids_maquinas) => {
    const response = await fetch(`${API_URL}/${id_setor}/maquinas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids_maquinas }),
    });
    if (!response.ok) throw new Error("Erro ao associar máquinas");
    return await response.json();
  },

  // associar gestor ao setor — id_gestor no body, id do setor na URL
  associarGestor: async (id_setor, id_gestor) => {
    const response = await fetch(`${API_URL}/${id_setor}/gestores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_gestor }),
    });
    if (!response.ok) throw new Error("Erro ao associar gestor");
    return await response.json();
  },
};

//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
export const setorCrudService = USE_MOCK ? setorMockService : apiService;
//após a conexão com o backend, remover o arquivo setorMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const setorCrudService ={o que ta dentro de apiService aqui dentro}