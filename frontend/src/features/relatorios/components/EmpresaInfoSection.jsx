"use client";

import { RelatorioSection } from "./RelatorioSection";
import { formatarTelefone } from "../utils/formatters";

function formatarCnpj(cnpj) {
  if (!cnpj) return "—";
  const v = String(cnpj).replace(/\D/g, "");
  if (v.length !== 14) return cnpj;
  return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(data);
}

function Campo({ label, valor }) {
  return (
    <div className="relatorio-campo">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-[#23304c]">{valor || "—"}</dd>
    </div>
  );
}

export function EmpresaInfoSection({ ativo, empresa, setorNome, variant }) {
  const titulo = variant === "gestor" ? "Empresa e setor" : "Informações da empresa";
  const isEmpresa = Boolean(empresa?.nome_empresa);
  const tituloPrincipal =
    isEmpresa ? empresa.nome_empresa : empresa?.nome || "Relatório ProdSync";

  return (
    <RelatorioSection id="empresa-info" ativo={ativo} titulo={titulo}>
      <div className="relatorio-capa rounded-2xl border border-[#00357a]/15 bg-gradient-to-br from-[#f8faff] to-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-[#23304c]">{tituloPrincipal}</h2>
            {variant === "gestor" && setorNome ? (
              <p className="mt-1 text-base font-medium text-[#00357a]">Setor: {setorNome}</p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm text-muted-foreground">Gerado em {formatarData(new Date())}</p>
        </div>

        {isEmpresa ? (
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Campo label="CNPJ" valor={formatarCnpj(empresa?.cnpj)} />
            <Campo label="E-mail" valor={empresa?.email} />
            <Campo label="Telefone" valor={formatarTelefone(empresa?.telefone)} />
            <Campo label="Endereço" valor={empresa?.endereco} />
            <Campo label="Representante" valor={empresa?.nome_representante} />
            <Campo
              label="Cadastro"
              valor={
                empresa?.data_cadastro
                  ? new Intl.DateTimeFormat("pt-BR").format(new Date(empresa.data_cadastro))
                  : "—"
              }
            />
          </dl>
        ) : (
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Campo label="Responsável" valor={empresa?.nome} />
            <Campo label="E-mail" valor={empresa?.email} />
            <Campo label="Perfil" valor={empresa?.tipo ?? empresa?.funcao} />
            {setorNome ? <Campo label="Setor" valor={setorNome} /> : null}
          </dl>
        )}
      </div>
    </RelatorioSection>
  );
}
