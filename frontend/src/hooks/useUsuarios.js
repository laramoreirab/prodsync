import { useState, useEffect, useCallback } from 'react';
import { usuariosCrudService } from '@/services/usuariosCrudService';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // carregar todos os usuários
  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usuariosCrudService.getAll();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // criar
  const cadastrarUsuario = async (dados) => {
    try {
      const novo = await usuariosCrudService.create(dados);
      setUsuarios(prev => [...prev, novo]);
      return novo;
    } catch (err) {
      throw err;
    }
  };

  // editar
  const editarUsuario = async (id, dados) => {
    try {
      const atualizado = await usuariosCrudService.update(id, dados);
      setUsuarios(prev => prev.map(u => u.id === id ? atualizado : u));
      return atualizado;
    } catch (err) {
      throw err;
    }
  };

  // deletar
  const excluirUsuario = async (id) => {
    try {
      await usuariosCrudService.delete(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    error,
    refresh: fetchUsuarios,
    cadastrarUsuario,
    editarUsuario,
    excluirUsuario,
  };
}