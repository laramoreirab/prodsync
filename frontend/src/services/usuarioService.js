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
  async getTopOperadores(setorId) {
    if (USE_MOCK) return TopOperadoresArraySchema.parse(mockTopOperadores);
    const data = await apiFetch("/api/usuarios/dashboard/top5Operadores");
    const normalized = (data.dados || []).map((item) => ({
      operador: item.operador ?? item.nome ?? "Sem nome",
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
    return TempoSessaoPerfilArraySchema.parse(filterBySetorId(data.dados || [], setorId));
  },
};

export const rotatividadeService = {
  async getRotatividade(setorId) {
    if (USE_MOCK) return RotatividadeArraySchema.parse(mockRotatividade);
    const data = await apiFetch("/api/usuarios/dashboard/rotatividadeUsuarios");
    return RotatividadeArraySchema.parse(filterBySetorId(data.dados || [], setorId));
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
    const data = await apiFetch("/api/usuarios/turnos");
    return UsuariosPorTurnoArraySchema.parse(filterBySetorId(data.dados || [], setorId));
  },
};

export const producaoMediaUsuarioSetorService = {
  async getProducaoMedia(setorId) {
    if (USE_MOCK) {
      return ProducaoMediaUsuarioArraySchema.parse(
        filterBySetorId(mockProducaoMediaUsuarioSetor, setorId)
      );
    }
    const data = await apiFetch("/api/usuarios/producao_media_por_usuario");
    const normalized = (data.dados || []).map((item) => ({
      usuario: item.usuario ?? item.nome ?? "Sem nome",
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
    const data = await apiFetch("/api/usuarios/taxa_refugo");
    return UsuarioTaxaRefugoArraySchema.parse(filterBySetorId(data.dados || [], setorId));
  },
};
