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
import { EyeIcon, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";

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
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  useEffect(() => {
    setDadosApontamentoState(dadosOriginais);
  }, []);

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
      a.op.toLowerCase().includes(termo) ||
      String(a.id).includes(termo)
    );
  });

  return (
   <PageLayout> 
      <DetailPageContainer>

        {/* Voltar */}
        <DetailBackLink href="/adm/usuarios" label="Voltar para Usuários" />

        {/* Card de perfil do usuário */}
        <UserProfileCard
          imageSrc="/jose.svg"
          name="José Adamastor Alves da Silva Souza"
          fieldsLeft={[
            { label: "ID", value: "00000" },
            { label: "Email", value: "josezinho@gmail.com" },
            { label: "CPF", value: "443.651.730-65" },
          ]}
          fieldsRight={[
            { label: "Setor", value: "Engrenagens" },
            { label: "Função", value: "Operador" },
            { label: "Turno", value: "Noite" },
          ]}
          actions={
            <DetailActions>
              <Dialog>
                <DialogTrigger className="text-[var(--pencil)] cursor-pointer">
                  <Pencil size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoUsuario />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="text-[var(--trash)] cursor-pointer">
                  <Trash2 size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoUsuario />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        {/* Máquina responsável */}
        <DetailSectionTitle title="Responsável por:" className="mt-4"/>
        <Link href="/adm/maquinas/1">
          <UserProfileCard
            imageSrc="/demo_maq.png"
            imageAlt="Demo Maquina"
            name="THAK-12345"
            fieldsLeft={[
              { label: "ID", value: "00000" },
              { label: "Série", value: "SX-900" },
            ]}
            fieldsRight={[
              { label: "Data de Aquisição", value: "01/01/2023" },
              { label: "Velocidade Média", value: "40 peças/h" },
            ]}
            actions={
              <span className="rounded-xl px-3 py-1 text-[var(--trash)] font-semibold bg-red-100 text-sm">Parada</span>
            }
          />
        </Link>

        {/* Seção de Produção */}
        <DetailSectionTitle title="Produção" className="mt-4 pt-6"/>

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
          title="Histórico de Apontamentos Feitos pelo Usuário"
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