// src/services/usuarioService.js
import { apiFetch } from "./api";
import {
  QtdUsuariosPorPerfilArraySchema,
  QtdUsuariosPorSetorArraySchema,
  TopOperadoresArraySchema,
  TempoSessaoPerfilArraySchema,
  RotatividadeArraySchema,
  SobrecargaSetorArraySchema,
  ProducaoMediaSetorArraySchema,
} from "@features/usuarios/schemas/usuarioSchema";
import {
  mockQtdUsuariosPorPerfil,
  mockQtdUsuariosPorSetor,
  mockTopOperadores,
  mockTempoSessaoPerfil,
  mockRotatividade,
  mockSobrecargaSetor,
  mockProducaoMediaSetor,
} from "./mockData";

const USE_MOCK = true;

export const qtdUsuariosPerfilService = {
  async getQtdPorPerfil() {
    if (USE_MOCK) return QtdUsuariosPorPerfilArraySchema.parse(mockQtdUsuariosPorPerfil);
    const data = await apiFetch("/usuarios/quantidade_por_perfil");
    return QtdUsuariosPorPerfilArraySchema.parse(data);
  },
};

export const qtdUsuariosSetorService = {
  async getQtdPorSetor() {
    if (USE_MOCK) return QtdUsuariosPorSetorArraySchema.parse(mockQtdUsuariosPorSetor);
    const data = await apiFetch("/usuarios/quantidade_por_setor");
    return QtdUsuariosPorSetorArraySchema.parse(data);
  },
};

export const topOperadoresService = {
  async getTopOperadores() {
    if (USE_MOCK) return TopOperadoresArraySchema.parse(mockTopOperadores);
    const data = await apiFetch("/usuarios/top_operadores");
    return TopOperadoresArraySchema.parse(data);
  },
};

export const tempoSessaoService = {
  async getTempoSessao() {
    if (USE_MOCK) return TempoSessaoPerfilArraySchema.parse(mockTempoSessaoPerfil);
    const data = await apiFetch("/usuarios/tempo_sessao");
    return TempoSessaoPerfilArraySchema.parse(data);
  },
};

export const rotatividadeService = {
  async getRotatividade() {
    if (USE_MOCK) return RotatividadeArraySchema.parse(mockRotatividade);
    const data = await apiFetch("/usuarios/rotatividade");
    return RotatividadeArraySchema.parse(data);
  },
};

export const sobrecargaSetorService = {
  async getSobrecarga() {
    if (USE_MOCK) return SobrecargaSetorArraySchema.parse(mockSobrecargaSetor);
    const data = await apiFetch("/usuarios/sobrecarga_por_setor");
    return SobrecargaSetorArraySchema.parse(data);
  },
};

export const producaoMediaSetorService = {
  async getProducaoMedia() {
    if (USE_MOCK) return ProducaoMediaSetorArraySchema.parse(mockProducaoMediaSetor);
    const data = await apiFetch("/usuarios/producao_media_por_setor");
    return ProducaoMediaSetorArraySchema.parse(data);
  },
};