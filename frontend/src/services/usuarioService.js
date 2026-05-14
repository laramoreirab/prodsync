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