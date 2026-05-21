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
  async getTurnos(setorId) {
    if (USE_MOCK) {
      return UsuariosPorTurnoArraySchema.parse(filterBySetorId(mockUsuariosPorTurno, setorId));
    }
    try {
      const data = await apiFetch("/api/usuarios/dashboard/turnosOperadores");
      return UsuariosPorTurnoArraySchema.parse(filterBySetorId(data.dados || [], setorId));
    } catch {
      return UsuariosPorTurnoArraySchema.parse(filterBySetorId(mockUsuariosPorTurno, setorId));
    }
  },
};

export const producaoMediaUsuarioSetorService = {
  async getProducaoMedia(setorId) {
    if (USE_MOCK) {
      return ProducaoMediaUsuarioArraySchema.parse(
        filterBySetorId(mockProducaoMediaUsuarioSetor, setorId)
      );
    }
    try {
      const data = await apiFetch("/api/usuarios/dashboard/producaoMediaUsuarioSetor");
      return ProducaoMediaUsuarioArraySchema.parse(filterBySetorId(data.dados || [], setorId));
    } catch {
      return ProducaoMediaUsuarioArraySchema.parse(
        filterBySetorId(mockProducaoMediaUsuarioSetor, setorId)
      );
    }
  },
};

export const usuarioTaxaRefugoService = {
  async getTaxaRefugo(setorId) {
    if (USE_MOCK) {
      return UsuarioTaxaRefugoArraySchema.parse(filterBySetorId(mockUsuarioTaxaRefugo, setorId));
    }
    try {
      const data = await apiFetch("/api/usuarios/dashboard/taxaRefugoOperadores");
      return UsuarioTaxaRefugoArraySchema.parse(filterBySetorId(data.dados || [], setorId));
    } catch {
      return UsuarioTaxaRefugoArraySchema.parse(filterBySetorId(mockUsuarioTaxaRefugo, setorId));
    }
  },
};