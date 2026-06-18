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
  ProducaoMediaUsuarioArraySchema,
  UsuariosPorTurnoArraySchema,
  UsuarioTaxaRefugoArraySchema,
} from "@features/usuarios/schemas/usuarioSchema";
import {
  mockQtdUsuariosPorPerfil,
  mockQtdUsuariosPorSetor,
  mockTopOperadores,
  mockTempoSessaoPerfil,
  mockRotatividade,
  mockCumprimentoMetaSetor,
  mockProducaoMediaSetor,
  mockUsuariosPorTurno,
  mockProducaoMediaUsuarioSetor,
  mockUsuarioTaxaRefugo,
} from "./mockData";

const filterBySetorId = (items, setorId) => {
  if (setorId == null || setorId === "") return items;
  return items.filter(
    (item) => item.setorId == null || Number(item.setorId) === Number(setorId)
  );
};

const labelOrFallback = (value, fallback) => {
  const label = String(value ?? "").trim();
  return label || fallback;
};

const USE_MOCK = false;

export const qtdUsuariosPerfilService = {
  async getQtdPorPerfil(setorId = null) {
    if (USE_MOCK) return QtdUsuariosPorPerfilArraySchema.parse(mockQtdUsuariosPorPerfil);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/usuarios/dashboard/qtdUsuariosPorTipo${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      name: labelOrFallback(item.name, "Sem perfil"),
    }));
    return QtdUsuariosPorPerfilArraySchema.parse(normalized);
  },
};

export const qtdUsuariosSetorService = {
  async getQtdPorSetor() {
    if (USE_MOCK) return QtdUsuariosPorSetorArraySchema.parse(mockQtdUsuariosPorSetor);
    const data = await apiFetch("/api/usuarios/dashboard/qtdUsuariosPorSetor");
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      setor: labelOrFallback(item.setor, "Sem setor"),
    }));
    return QtdUsuariosPorSetorArraySchema.parse(normalized);
  },
};

export const topOperadoresService = {
  async getTopOperadores(setorId) {
    if (USE_MOCK) return TopOperadoresArraySchema.parse(mockTopOperadores);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/usuarios/dashboard/top5Operadores${query}`);
    const normalized = (data.dados || []).map((item) => ({
      operador: labelOrFallback(item.operador ?? item.nome, "Sem nome"),
      media: item.media ?? item.pecas_boas ?? item.qtd ?? 0,
      setorId: item.setorId ?? (setorId ? Number(setorId) : undefined),
    }));
    return TopOperadoresArraySchema.parse(filterBySetorId(normalized, setorId));
  },
};

export const tempoSessaoService = {
  async getTempoSessao(setorId) {
    if (USE_MOCK) return TempoSessaoPerfilArraySchema.parse(mockTempoSessaoPerfil);
    const query = setorId ? `?setorId=${setorId}` : "";
    const data = await apiFetch(`/api/usuarios/dashboard/tempo-medio-sessao-perfil${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      perfil: labelOrFallback(item.perfil, "Sem perfil"),
    }));
    return TempoSessaoPerfilArraySchema.parse(filterBySetorId(normalized, setorId));
  },
};

export const rotatividadeService = {
  async getRotatividade(setorId) {
    if (USE_MOCK) return RotatividadeArraySchema.parse(mockRotatividade);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/usuarios/dashboard/rotatividadeUsuarios${query}`);
    return RotatividadeArraySchema.parse(filterBySetorId(data.dados || [], setorId));
  },
};

export const CumprimentoMetaSetorService = {
  async getCumprimentoMetaSetor() {
    if (USE_MOCK) return CumprimentoMetaSetorArraySchema.parse(mockCumprimentoMetaSetor);
    const data = await apiFetch("/api/usuarios/dashboard/metaProducaoPorSetor");
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      setor: labelOrFallback(item.setor, "Sem setor"),
    }));
    return CumprimentoMetaSetorArraySchema.parse(normalized);
  },
};

export const producaoMediaSetorService = {
  async getProducaoMedia() {
    if (USE_MOCK) return ProducaoMediaSetorArraySchema.parse(mockProducaoMediaSetor);
    const data = await apiFetch("/api/usuarios/dashboard/producaoMediaPorSetor");
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      setor: labelOrFallback(item.setor, "Sem setor"),
    }));
    return ProducaoMediaSetorArraySchema.parse(normalized);
  },
};

export const turnosOperadoresService = {
  async getTurnos(setorId) {
    if (USE_MOCK) {
      return UsuariosPorTurnoArraySchema.parse(filterBySetorId(mockUsuariosPorTurno, setorId));
    }
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/usuarios/turnos${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      turno: labelOrFallback(item.turno, "Sem turno"),
    }));
    return UsuariosPorTurnoArraySchema.parse(filterBySetorId(normalized, setorId));
  },
};

export const producaoMediaUsuarioSetorService = {
  async getProducaoMedia(setorId) {
    if (USE_MOCK) {
      return ProducaoMediaUsuarioArraySchema.parse(
        filterBySetorId(mockProducaoMediaUsuarioSetor, setorId)
      );
    }
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/usuarios/producao_media_por_usuario${query}`);
    const normalized = (data.dados || []).map((item) => ({
      usuario: labelOrFallback(item.usuario ?? item.nome, "Sem nome"),
      media: item.media ?? item.qtd ?? 0,
      setorId: item.setorId ?? (setorId ? Number(setorId) : undefined),
    }));
    return ProducaoMediaUsuarioArraySchema.parse(filterBySetorId(normalized, setorId));
  },
};

export const usuarioTaxaRefugoService = {
  async getTaxaRefugo(setorId) {
    if (USE_MOCK) {
      return UsuarioTaxaRefugoArraySchema.parse(filterBySetorId(mockUsuarioTaxaRefugo, setorId));
    }
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/usuarios/taxa_refugo${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      operador: labelOrFallback(item.operador, "Sem nome"),
    }));
    return UsuarioTaxaRefugoArraySchema.parse(filterBySetorId(normalized, setorId));
  },
};
