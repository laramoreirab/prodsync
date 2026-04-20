import { apiFetch } from './api';

export const usuarioService = {

  // cadastro de 1 usuario
  async cadastrarIndividual(formData) {
    return await apiFetch('/usuarios', {
      method: 'POST',
      body: formData, 
    });
  },

  // upload do csv
  async cadastrarEmLote(formDataLote) {
    return await apiFetch('/usuarios/lote', {
      method: 'POST',
      body: formDataLote, 
    });
  },

  async editar(id, payload) {
    return await apiFetch(`/usuarios/${id}`, {
      method: 'PUT', 
      body: payload, 
    });
  },

  async excluir(id) {
    return await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
  }
};