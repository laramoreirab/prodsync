"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Factory,
  MapPinned,
  PlayCircle,
  Route,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { ListBulletsIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const passos = [
  {
    titulo: "1. Dados da empresa",
    menu: "Minha conta > Configurações",
    href: "/adm/configuracoes",
    icon: Settings,
    objetivo: "Confirme os dados da empresa antes de liberar o ambiente para operação.",
    configurar: "Nome, e-mail da empresa, aparência e políticas básicas da conta.",
    motivo: "Essas informações aparecem em relatórios, usuários e rotinas administrativas.",
  },
  {
    titulo: "2. Setores e turnos",
    menu: "Setores",
    href: "/adm/setores",
    icon: MapPinned,
    objetivo: "Crie a estrutura produtiva antes de cadastrar máquinas e gestores.",
    configurar: "Setores da fábrica, turnos de trabalho e gestores responsáveis.",
    motivo: "Máquinas, operadores, filtros de dashboard e permissões de gestor dependem do setor.",
  },
  {
    titulo: "3. Usuários",
    menu: "Usuários",
    href: "/adm/usuarios",
    icon: Users,
    objetivo: "Cadastre quem vai operar, gerir e administrar o ambiente.",
    configurar: "Administradores, gestores e operadores com seus vínculos corretos.",
    motivo: "Operadores recebem solicitações de justificativa e gestores enxergam apenas seus setores.",
  },
  {
    titulo: "4. Máquinas",
    menu: "Máquinas",
    href: "/adm/maquinas",
    icon: Wrench,
    objetivo: "Cadastre as máquinas depois que setores e usuários já existem.",
    configurar: "Setor, operador responsável, metas, capacidade e dados técnicos.",
    motivo: "Eventos, produção, OEE, Andon e notificações dependem da máquina estar vinculada corretamente.",
  },
  {
    titulo: "5. Motivos e Histórico de Eventos",
    menu: "Histórico de Eventos",
    href: "/adm/historicoEventos",
    icon: ClipboardList,
    objetivo: "Prepare os motivos de parada/setup e valide os primeiros eventos.",
    configurar: "Motivos de parada, eventos manuais e justificativas pendentes.",
    motivo: "Paradas e setups exigem justificativa para manter indicadores e relatórios confiáveis.",
  },
  {
    titulo: "6. Ordens de Produção",
    menu: "Ordem de Produção",
    href: "/adm/ordensDeProducao",
    icon: ListBulletsIcon,
    objetivo: "Cadastre as OPs quando o chão de fábrica já estiver estruturado.",
    configurar: "Lotes, metas, máquinas, operadores e acompanhamento da produção.",
    motivo: "As OPs usam máquinas e operadores existentes para consolidar produção e refugos.",
  },
  {
    titulo: "7. Andon e acompanhamento",
    menu: "Andon",
    href: "/adm/andon",
    icon: Factory,
    objetivo: "Use por último para monitorar o ambiente já configurado.",
    configurar: "Painéis de acompanhamento, status das máquinas e indicadores em tempo real.",
    motivo: "O Andon fica útil depois que máquinas, operadores, eventos e OPs estão alimentando dados.",
  },
];

const STORAGE_KEY = "prodsync:production-setup-tour";

export function ProductionSetupTour() {
  const [aberto, setAberto] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);
  const [maiorPassoAlcancado, setMaiorPassoAlcancado] = useState(0);
  const [guiaConcluido, setGuiaConcluido] = useState(false);
  const [storageCarregado, setStorageCarregado] = useState(false);
  const passo = passos[passoAtual];
  const Icon = passo.icon;
  const progresso = guiaConcluido
    ? 100
    : Math.round(((maiorPassoAlcancado + 1) / passos.length) * 100);

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(STORAGE_KEY);
      if (!salvo) {
        setStorageCarregado(true);
        return;
      }

      const dados = JSON.parse(salvo);
      const passoSalvo = Math.min(Math.max(Number(dados.passoAtual) || 0, 0), passos.length - 1);
      const maiorSalvo = Math.min(Math.max(Number(dados.maiorPassoAlcancado) || passoSalvo, 0), passos.length - 1);

      setPassoAtual(passoSalvo);
      setMaiorPassoAlcancado(Math.max(passoSalvo, maiorSalvo));
      setGuiaConcluido(Boolean(dados.guiaConcluido));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setStorageCarregado(true);
    }
  }, []);

  useEffect(() => {
    if (!storageCarregado) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        passoAtual,
        maiorPassoAlcancado,
        guiaConcluido,
      })
    );
  }, [passoAtual, maiorPassoAlcancado, guiaConcluido, storageCarregado]);

  const selecionarPasso = (index) => {
    setPassoAtual(index);
    setMaiorPassoAlcancado((valor) => Math.max(valor, index));
  };

  const abrir = () => {
    setAberto(true);
  };

  const anterior = () => setPassoAtual((valor) => Math.max(0, valor - 1));
  const proximo = () => selecionarPasso(Math.min(passos.length - 1, passoAtual + 1));

  const concluir = () => {
    setPassoAtual(passos.length - 1);
    setMaiorPassoAlcancado(passos.length - 1);
    setGuiaConcluido(true);
    setAberto(false);
  };

  const reiniciar = () => {
    setPassoAtual(0);
    setMaiorPassoAlcancado(0);
    setGuiaConcluido(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="cursor-pointer mx-3 mt-1 flex h-10 items-center gap-2 overflow-hidden rounded-lg border border-white/15 bg-white/10 px-3 text-left text-white text-sm transition-all duration-300 hover:bg-white/18 group-data-[state=collapsed]/sidebar:mx-1 group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:group-hover/sidebar:mx-3 group-data-[state=collapsed]/sidebar:group-hover/sidebar:h-10 group-data-[state=collapsed]/sidebar:group-hover/sidebar:w-auto group-data-[state=collapsed]/sidebar:group-hover/sidebar:justify-start group-data-[state=collapsed]/sidebar:group-hover/sidebar:px-3"
      >
        <Route className="size-[1.1rem] shrink-0" />
        <span className="truncate font-semibold group-data-[state=collapsed]/sidebar:hidden group-data-[state=collapsed]/sidebar:group-hover/sidebar:inline">
          Guia de implantação
        </span>
      </button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogTitle className="sr-only">Guia de implantação do ambiente de produção</DialogTitle>

          <div className="space-y-5 p-2">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PlayCircle className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Ambiente de produção
                </p>
                <h2 className="text-2xl font-bold text-[#23304c]">
                  Configure nesta ordem
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Siga as dependências do sistema para evitar cadastros sem vínculo e indicadores incompletos.
                </p>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>

            {guiaConcluido ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-green-600" />
                  <div>
                    <h3 className="text-xl font-bold text-[#23304c]">Guia de implantação concluído</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Todas as etapas foram percorridas. Para refazer o fluxo desde o início, reinicie o guia.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={reiniciar}>Reiniciar guia</Button>
                </div>
              </div>
            ) : (
              <>
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {passos.map((item, index) => {
                  const ItemIcon = item.icon;
                  const ativo = index === passoAtual;
                  const concluido = index <= maiorPassoAlcancado;

                  return (
                    <button
                      key={item.titulo}
                      type="button"
                      onClick={() => selecionarPasso(index)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        ativo
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {concluido ? (
                        <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                      ) : (
                        <ItemIcon className="size-4 shrink-0" />
                      )}
                      <span className="truncate font-semibold">{item.titulo}</span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#eef4ff] text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Menu: {passo.menu}
                    </p>
                    <h3 className="text-xl font-bold text-[#23304c]">{passo.titulo}</h3>
                  </div>
                </div>

                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-[#23304c]">Objetivo</p>
                    <p>{passo.objetivo}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#23304c]">Configure primeiro</p>
                    <p>{passo.configurar}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#23304c]">Regra de negócio</p>
                    <p>{passo.motivo}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <Button asChild className="w-full">
                    <Link href={passo.href} onClick={() => setAberto(false)}>
                      Abrir {passo.menu}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <Button variant="outline" onClick={anterior} disabled={passoAtual === 0}>
                <ArrowLeft className="size-4" />
                Anterior
              </Button>
              <p className="text-xs font-medium text-muted-foreground">
                Passo {passoAtual + 1} de {passos.length}
              </p>
              {passoAtual === passos.length - 1 ? (
                <Button onClick={concluir}>Concluir</Button>
              ) : (
                <Button onClick={proximo}>
                  Próximo
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
