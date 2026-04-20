// src/services/setorService.js
import { apiFetch } from './api';

export const setorService = {
  
  criarSetor: async (dadosSetor) => {
    try {
      return await apiFetch('/setores', {
        method: 'POST',
        body: JSON.stringify(dadosSetor)
      });
    } catch (error) {
      console.error("Erro ao criar setor:", error);
      throw error; 
    }
  },

  obterSetorPorId: async (id) => {
    try {
      return await apiFetch(`/setores/${id}`);
    } catch (error) {
      console.error(`Erro ao buscar o setor ${id}:`, error);
      throw error;
    }
  },

  editarSetor: async (id, dadosAtualizados) => {
    try {
      return await apiFetch(`/setores/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dadosAtualizados)
      });
    } catch (error) {
      console.error(`Erro ao editar o setor ${id}:`, error);
      throw error;
    }
  },

  excluirSetor: async (id) => {
    try {
      return await apiFetch(`/setores/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Erro ao excluir o setor ${id}:`, error);
      throw error;
    }
  }
};