"use client"

import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { TempoParadoTempoProduzindoOperadorWidget } from "@/features/operador/TempoParadoTempoProduzindoOperadorWidget";
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { PecasPorDiaWidget } from "@/features/operador/PecasPorDiaWidget";
import { ProducaoPorHoraOperadorWidget } from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { EficienciaMaquinaWidget } from "@/features/operador/EficienciaMaquinaWidget";
import { use, useState, useEffect } from "react";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown, EyeIcon, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { usuariosCrudService } from "@/services/usuariosCrudService";
import { apiFetch } from "@/lib/api";

// Layout geral
import { PageLayout, SectionDivider, FadeUpItem, SearchBar, FilterRow, EmptyState } from "@/components/AnimatedComponents";

// Componentes de detalhe
import {
  DetailPageContainer,
  DetailBackLink,
  UserProfileCard,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  SectionHighlight,
  DetailListingSection,
  DetailActions,
} from "@/components/DetailComponents";

const colunasApontamento = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
  { id: 'op', key: 'op', label: 'OP Afetada', className: 'w-30 text-center justify-center pl-5' },
  { id: 'data', key: 'data', label: 'Data (Início - Fim)', className: 'pl-10' },
  {
    id: 'produzido', key: 'produzido', label: 'Produzido', className: 'text-center justify-center',
    icone: (valor) => (
      <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none">
        {valor}
      </Badge>
    ),
  },
  {
    id: 'refugo', key: 'refugo', label: 'Refugo', className: 'text-center justify-center',
    icone: (valor) => (
      <Badge variant="destructive" className="font-semibold text-sm border-none">
        {valor}
      </Badge>
    ),
  },
  { id: 'observacao', key: 'observacao', label: 'Observação' },
];

const dadosOriginais = [
  { id: 1, op: '0098', data: '26/03 (08:00 - 09:00)', produzido: '15', refugo: '2', observacao: 'Troca de ferramenta' },
  { id: 2, op: '1234', data: '06/01 (09:30 - 10:15)', produzido: '10', refugo: '5', observacao: 'Manutenção corretiva' },
  { id: 3, op: '5678', data: '13/09 (10:15 - 10:35)', produzido: '20', refugo: '1', observacao: 'Ajuste de parâmetros' },
  { id: 4, op: '9012', data: '30/09 (11:00 - 12:00)', produzido: '5', refugo: '8', observacao: 'Refugo elevado devido a falta de aquecimento' },
  { id: 5, op: '1223', data: '28/03 (12:00 - 14:00)', produzido: '6', refugo: '8', observacao: 'Retirada de amostras para o laboratório de qualidade' },
  { id: 6, op: '1206', data: '30/07 (17:00 - 18:00)', produzido: '13', refugo: '6', observacao: 'Finalização de OP' },
  { id: 7, op: '8912', data: '20/09 (16:00 - 19:00)', produzido: '20', refugo: '5', observacao: 'Falta de material' },
  { id: 8, op: '0607', data: '20/09 (16:00 - 19:00)', produzido: '20', refugo: '5', observacao: 'Boa qualidade' },
];

export default function ProducaoOperadorPage({ params }) {
  const { id } = use(params);
  const operadorId = Number(id);
  const [usuario, setUsuario] = useState(null);
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  useEffect(() => {
    setDadosApontamentoState(dadosOriginais);
  }, []);

  useEffect(() => {
    async function carregarUsuario() {
      const [usuarioDados, apontamentosResp] = await Promise.all([
        usuariosCrudService.getById(operadorId),
        apiFetch(`/api/usuarios/${operadorId}/apontamentos`, { method: "GET" }),
      ]);

      setUsuario(usuarioDados);
      setDadosApontamentoState(apontamentosResp.dados || []);
    }

    carregarUsuario().catch((error) => console.error("Erro ao carregar usuário:", error));
  }, [operadorId]);

  const opcoesOrdenacaoApontamento = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'OP Afetada Crescente', value: 'opAfetada_asc' },
    { label: 'OP Afetada Decrescente', value: 'opAfetada_desc' },
    { label: 'Produzido Crescente', value: 'produzido_asc' },
    { label: 'Produzido Decrescente', value: 'produzido_desc' },
    { label: 'Refugo Crescente', value: 'refugo_asc' },
    { label: 'Refugo Decrescente', value: 'refugo_desc' },
  ];

  const handleSortApontamento = (criterio) => {
    const copia = [...dadosApontamentoState];
    copia.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'opAfetada_asc') return Number(a.op) - Number(b.op);
      if (criterio === 'opAfetada_desc') return Number(b.op) - Number(a.op);
      if (criterio === 'produzido_asc') return Number(a.produzido) - Number(b.produzido);
      if (criterio === 'produzido_desc') return Number(b.produzido) - Number(a.produzido);
      if (criterio === 'refugo_asc') return Number(a.refugo) - Number(b.refugo);
      if (criterio === 'refugo_desc') return Number(b.refugo) - Number(a.refugo);
      return 0;
    });
    setDadosApontamentoState(copia);
  };

  const apontamentoFilter = [
    { id: "data", label: "Data", type: "date-range" },
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" },
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOriginais];

    if (filtrosSelecionados.produzido) {
      if (filtrosSelecionados.produzido.min != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.produzido) >= filtrosSelecionados.produzido.min
        );
      }

      if (filtrosSelecionados.produzido.max != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.produzido) <= filtrosSelecionados.produzido.max
        );
      }
    }

    if (filtrosSelecionados.refugo) {
      if (filtrosSelecionados.refugo.min != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.refugo) >= filtrosSelecionados.refugo.min
        );
      }

      if (filtrosSelecionados.refugo.max != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.refugo) <= filtrosSelecionados.refugo.max
        );
      }
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  //filtra os dados atuais de APONTAMENTOS (filtrados e ordenados) pelo termo de busca
  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();

    return (
      String(a.op).toLowerCase().includes(termo) ||
      String(a.id).includes(termo)
    );
  });

  return (
    <PageLayout>
      <DetailPageContainer>

        <Link className="flex items-center" href="/adm/usuarios">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Usuários </p>
        </Link>

        <section id="infos_user" className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex">
              <Image
                src={usuario?.imagem_perfil ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/imagens/${usuario.imagem_perfil}` : "/userdefault.svg"}
                alt="Demo Maquina"
                className="rounded-xl"
                width={250}
                height={250}
              />

              <div className="flex flex-col ml-5">
                <h1 className="text-3xl font-bold text-black">Nome: {usuario?.nome || "-"}</h1>
                <div className="flex gap-10">

                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">ID:</p>
                      <p className="text-xl font-medium text-black">{usuario?.id_usuario || operadorId}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Email:</p>
                      <p className="text-xl font-medium text-black">{usuario?.email || "-"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">CPF:</p>
                      <p className="text-xl font-medium text-black">{usuario?.cpf || "-"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Setor:</p>
                      <p className="text-xl font-medium text-black">{usuario?.setor?.nome_setor || "-"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Função:</p>
                      <p className="text-xl font-medium text-black">{usuario?.tipo || usuario?.funcao || "-"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Turno:</p>
                      <p className="text-xl font-medium text-black">{usuario?.turno?.nome_turno || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoUsuario usuarioId={operadorId} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className=" w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoUsuario usuarioId={operadorId} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

        </section>

        <section id="maquina_responsavel" className="mt-5">
          <h1 className="font-bold text-3xl">Responsável por:</h1>
          <Link href={usuario?.maquina?.id_maquina ? `/adm/maquinas/${usuario.maquina.id_maquina}` : "#"} >
            <div className="bg-white w-full shadow-md border rounded-lg flex justify-between items-start p-8 mt-6">
              <div className="flex">
                <Image src="/demo_maq.png" alt="Demo Maquina" className="rounded-lg" width={200} height={150} />
                <div className="ml-8 flex flex-col gap-2">
                  <h1 className="text-3xl font-bold text-[#212e4b] uppercase">{usuario?.maquina?.nome || "-"}</h1>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-black mr-2">ID:</p>
                    <p className="text-xl font-medium text-black">{usuario?.maquina?.id_maquina || "-"}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-black mr-2">Série:</p>
                    <p className="text-xl font-medium text-black">{usuario?.maquina?.serie || "-"}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-black mr-2">Data de Aquisição:</p>
                    <p className="text-xl font-medium text-black">{usuario?.maquina?.data_aquisicao ? new Date(usuario.maquina.data_aquisicao).toLocaleDateString("pt-BR") : "-"}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-black mr-2">Velocidade Média:</p>
                    <p className="text-xl font-medium text-black">40 peças/h</p>
                  </div>
                </div>
              </div>

              <p className="rounded-xl px-3 text-[#b30000] font-semibold bg-red-100">{usuario?.maquina?.status_atual || "-"}</p>
            </div>
          </Link>
        </section>

        {/* Seção de Produção */}
        <DetailSectionTitle title="Produção" />

        <SectionHighlight>
          <OEEOperadorWidget operadorId={operadorId} />
        </SectionHighlight>

        <DetailWidgetGrid cols={3}>
          <DetailWidgetCard>
            <PecasPorDiaWidget operadorId={operadorId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <ProducaoPorHoraOperadorWidget operadorId={operadorId} />
          </DetailWidgetCard>
          <DetailWidgetCard centered>
            <MetaProducaoWidget operadorId={operadorId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        <DetailWidgetGrid cols={2}>
          <DetailWidgetCard>
            <TempoParadoTempoProduzindoOperadorWidget operadorId={operadorId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <EficienciaMaquinaWidget operadorId={operadorId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        {/* Listagem de Apontamentos */}
        <DetailListingSection
          id="listagem_apontamentos"
          title="Apontamentos"
          search={
            <SearchBar
              value={buscaApontamento}
              onChange={(e) => setBuscaApontamento(e.target.value)}
              placeholder="Busque por OP ou id..."
            />
          }
          filterRow={
            <FilterRow
              count={dadosApontamentosFiltrados.length}
              label="apontamentos"
              actions={
                <>
                  <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacaoApontamento} onSortChange={handleSortApontamento} />
                  <FilterDropdown filtersConfig={apontamentoFilter} onApply={aplicarFiltrosApontamento} />
                </>
              }
            />
          }
        >
          {dadosApontamentosFiltrados.length > 0 ? (
            <TableListagens
              data={dadosApontamentosFiltrados}
              columns={colunasApontamento}
              acoesDropdown={(usuario) => (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/adm/ordensDeProducao/${usuario.op}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver OP relacionada
                  </Link>
                </DropdownMenuItem>
              )}
            />
          ) : (
            <EmptyState
              title="Nenhum apontamento encontrado"
              message={`Não encontramos resultados para "${buscaApontamento}".`}
            />
          )}
        </DetailListingSection>

      </DetailPageContainer>
    </PageLayout>
  );
}
