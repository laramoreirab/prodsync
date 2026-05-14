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
  UsuariosPorTurnoArraySchema,
  UsuarioTaxaRefugoArraySchema,
  ProducaoMediaUsuarioArraySchema,
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
  mockUsuarioTaxaRefugo,
  mockProducaoMediaUsuarioSetor,
} from "./mockData";

const USE_MOCK = true;

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
    const data = await apiFetch("/api/usuarios/dashboard/top5Operadores");
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

export const turnosOperadoresService = {
  async getTurnos(setorId = null) {
    if (USE_MOCK) {
      const data = UsuariosPorTurnoArraySchema.parse(mockUsuariosPorTurno);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/usuarios/turnos?setorId=${setorId}` : "/usuarios/turnos";
    const data = await apiFetch(url);
    return UsuariosPorTurnoArraySchema.parse(data);
  },
};

export const usuarioTaxaRefugoService = {
  async getTaxaRefugo(setorId = null) {
    if (USE_MOCK) {
      const data = UsuarioTaxaRefugoArraySchema.parse(mockUsuarioTaxaRefugo);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/usuarios/taxa_refugo?setorId=${setorId}` : "/usuarios/taxa_refugo";
    const data = await apiFetch(url);
    return UsuarioTaxaRefugoArraySchema.parse(data);
  },
};

export const producaoMediaUsuarioSetorService = {
  async getProducaoMedia(setorId = null) {
    if (USE_MOCK) {
      const data = ProducaoMediaUsuarioArraySchema.parse(mockProducaoMediaUsuarioSetor);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/usuarios/producao_media_por_usuario?setorId=${setorId}` : "/usuarios/producao_media_por_usuario";
    const data = await apiFetch(url);
    return ProducaoMediaUsuarioArraySchema.parse(data);
  },
};