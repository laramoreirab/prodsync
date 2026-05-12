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
  async getTopOperadores(setorId = null) {
    if (USE_MOCK) {
      const data = TopOperadoresArraySchema.parse(mockTopOperadores);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/usuarios/top_operadores?setorId=${setorId}` : "/usuarios/top_operadores";
    const data = await apiFetch(url);
    return TopOperadoresArraySchema.parse(data);
  },
};

export const tempoSessaoService = {
  async getTempoSessao(setorId = null) {
    if (USE_MOCK) {
      const data = TempoSessaoPerfilArraySchema.parse(mockTempoSessaoPerfil);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/usuarios/tempo_sessao?setorId=${setorId}` : "/usuarios/tempo_sessao";
    const data = await apiFetch(url);
    return TempoSessaoPerfilArraySchema.parse(data);
  },
};

export const rotatividadeService = {
  async getRotatividade(setorId = null) {
    if (USE_MOCK) {
      const data = RotatividadeArraySchema.parse(mockRotatividade);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/usuarios/rotatividade?setorId=${setorId}` : "/usuarios/rotatividade";
    const data = await apiFetch(url);
    return RotatividadeArraySchema.parse(data);
  },
};

export const CumprimentoMetaSetorService = {
  async getCumprimentoMetaSetor() {
    if (USE_MOCK) return CumprimentoMetaSetorArraySchema.parse(mockCumprimentoMetaSetor);
    const data = await apiFetch("/usuarios/cumprimento_meta_por_setor");
    return CumprimentoMetaSetorArraySchema.parse(data);
  },
};

export const producaoMediaSetorService = {
  async getProducaoMedia() {
    if (USE_MOCK) return ProducaoMediaSetorArraySchema.parse(mockProducaoMediaSetor);
    const data = await apiFetch("/usuarios/producao_media_por_setor");
    return ProducaoMediaSetorArraySchema.parse(data);
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