// src/services/usuarioService.js
import { apiFetch } from "@/lib/api";
import {
  QtdUsuariosPorPerfilArraySchema,
  QtdUsuariosPorSetorArraySchema,
  TopOperadoresArraySchema,
  TempoSessaoPerfilArraySchema,
  RotatividadeArraySchema,
  CumprimentoMetaSetorArraySchema,
  ProducaoMediaSetorArraySchema,
} from "@features/usuarios/schemas/usuarioSchema";
import {
  mockQtdUsuariosPorPerfil,
  mockQtdUsuariosPorSetor,
  mockTopOperadores,
  mockTempoSessaoPerfil,
  mockRotatividade,
  mockCumprimentoMetaSetor,
  mockProducaoMediaSetor,
} from "./mockData";

const USE_MOCK = false;

export const qtdUsuariosPerfilService = {
  async getQtdPorPerfil() {
    if (USE_MOCK) return QtdUsuariosPorPerfilArraySchema.parse(mockQtdUsuariosPorPerfil);
    const data = await apiFetch("/api/usuarios/dashboard/qtdUsuariosPorTipo");
    return QtdUsuariosPorPerfilArraySchema.parse(data.dados);
  },
};

export const qtdUsuariosSetorService = {
  async getQtdPorSetor() {
    if (USE_MOCK) return QtdUsuariosPorSetorArraySchema.parse(mockQtdUsuariosPorSetor);
    const data = await apiFetch("/api/usuarios/dashboard/qtdUsuariosPorSetor");
    return QtdUsuariosPorSetorArraySchema.parse(data.dados);
  },
};

export const topOperadoresService = {
  async getTopOperadores() {
    if (USE_MOCK) return TopOperadoresArraySchema.parse(mockTopOperadores);
    const data = await apiFetch("api/usuarios/dashboard/top5Operadores");
    return TopOperadoresArraySchema.parse(data.dados);
  },
};

export const tempoSessaoService = {
  async getTempoSessao() {
    if (USE_MOCK) return TempoSessaoPerfilArraySchema.parse(mockTempoSessaoPerfil);
    const data = await apiFetch("/api/usuarios/dashboard/tempo-medio-sessao-perfil");
    return TempoSessaoPerfilArraySchema.parse(data.dados);
  },
};

export const rotatividadeService = {
  async getRotatividade() {
    if (USE_MOCK) return RotatividadeArraySchema.parse(mockRotatividade);
    const data = await apiFetch("/api/usuarios/dashboard/rotatividadeUsuarios");
    return RotatividadeArraySchema.parse(data.dados);
  },
};

export const CumprimentoMetaSetorService = {
  async getCumprimentoMetaSetor() {
    if (USE_MOCK) return CumprimentoMetaSetorArraySchema.parse(mockCumprimentoMetaSetor);
    const data = await apiFetch("/api/usuarios/dashboard/metaProducaoPorSetor");
    return CumprimentoMetaSetorArraySchema.parse(data.dados);
  },
};

export const producaoMediaSetorService = {
  async getProducaoMedia() {
    if (USE_MOCK) return ProducaoMediaSetorArraySchema.parse(mockProducaoMediaSetor);
    const data = await apiFetch("/api/usuarios/dashboard/producaoMediaPorSetor");
    return ProducaoMediaSetorArraySchema.parse(data.dados);
  },
};