// import { setorMockService } from "@/mocks/setorMock";
import { apiFetch } from "@/lib/api";

// trocar para false quando o backend estiver pronto p integração!!
const USE_MOCK = false;

const API_URL = "/api/setores";

// const apiService = {

export const setorCrudService ={
  // buscar todos os setores
  getAll: async () => {
    const options = { method: "GET" };
    return await apiFetch(`${API_URL}/empresa`, options);
  },

  // buscar setor por ID — id vai na URL
  getById: async (id) => {
     const options = { method: "GET" };
    return await apiFetch(`${API_URL}/${id}`, options);
  },

  // criar setor
  // campos: nome_setor, localizacao
  create: async (dados) => {
    return await apiFetch(`${API_URL}/criarSetor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },

  // atualizar setor — id vai na URL
  // campos: nome_setor
  update: async (id, dados) => {
    return await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },

  // deletar setor — id vai na URL
  delete: async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir setor");
    return true;
  },

  // associar máquinas ao setor — ids_maquinas (array), id do setor na URL
  associarMaquinas: async (id_setor, ids_maquinas) => {
    return await apiFetch(`${API_URL}/${id_setor}/maquinas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids_maquinas }),
    });
  },

  // associar gestor ao setor — id_gestor no body, id do setor na URL
  associarGestor: async (id_setor, id_gestor) => {
    return await apiFetch(`${API_URL}/${id_setor}/gestores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_gestor }),
    });
  },

  // associar operador ao setor
  associarOperadores: async (id_setor, ids_operadores) => {
    return await apiFetch(`${API_URL}/${id_setor}/operadores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids_operadores }),
    });
  },
};

//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
// export const setorCrudService = USE_MOCK ? setorMockService : apiService;
//após a conexão com o backend, remover o arquivo setorMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const setorCrudService ={o que ta dentro de apiService aqui dentro}