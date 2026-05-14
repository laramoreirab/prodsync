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

const USE_MOCK = false;

export const qtdUsuariosPerfilService = {
  async getQtdPorPerfil() {
    const data = await apiFetch("/api/usuarios/dashboard/qtdUsuariosPorTipo");
    return QtdUsuariosPorPerfilArraySchema.parse(data.dados);
  },
};

export const qtdUsuariosSetorService = {
  async getQtdPorSetor() {
    const data = await apiFetch("/api/usuarios/dashboard/qtdUsuariosPorSetor");
    return QtdUsuariosPorSetorArraySchema.parse(data.dados);
  },
};

export const topOperadoresService = {
  async getTopOperadores() {
    const data = await apiFetch("/api/usuarios/dashboard/top5Operadores");
    return TopOperadoresArraySchema.parse(data.dados);
  },
};

export const tempoSessaoService = {
  async getTempoSessao() {
    const data = await apiFetch("/api/usuarios/dashboard/tempo-medio-sessao-perfil");
    return TempoSessaoPerfilArraySchema.parse(data.dados);
  },
};

export const rotatividadeService = {
  async getRotatividade() {
    const data = await apiFetch("/api/usuarios/dashboard/rotatividadeUsuarios");
    return RotatividadeArraySchema.parse(data.dados);
  },
};

export const CumprimentoMetaSetorService = {
  async getCumprimentoMetaSetor() {
    const data = await apiFetch("/api/usuarios/dashboard/metaProducaoPorSetor");
    return CumprimentoMetaSetorArraySchema.parse(data.dados);
  },
};

export const producaoMediaSetorService = {
  async getProducaoMedia() {
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
    const url = setorId ? `/api/usuarios/turnos?setorId=${setorId}` : "/api/usuarios/turnos";
    const data = await apiFetch(url);
    return UsuariosPorTurnoArraySchema.parse(data.dados || data);
  },
};

export const usuarioTaxaRefugoService = {
  async getTaxaRefugo(setorId = null) {
    if (USE_MOCK) {
      const data = UsuarioTaxaRefugoArraySchema.parse(mockUsuarioTaxaRefugo);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/api/usuarios/taxa_refugo?setorId=${setorId}` : "/api/usuarios/taxa_refugo";
    const data = await apiFetch(url);
    return UsuarioTaxaRefugoArraySchema.parse(data.dados || data);
  },
};

export const producaoMediaUsuarioSetorService = {
  async getProducaoMedia(setorId = null) {
    if (USE_MOCK) {
      const data = ProducaoMediaUsuarioArraySchema.parse(mockProducaoMediaUsuarioSetor);
      return setorId ? data.filter((item) => String(item.setorId) === String(setorId)) : data;
    }
    const url = setorId ? `/api/usuarios/producao_media_por_usuario?setorId=${setorId}` : "/api/usuarios/producao_media_por_usuario";
    const data = await apiFetch(url);
    return ProducaoMediaUsuarioArraySchema.parse(data.dados || data);
  },
};
