"use client";

/**
 * DetailComponents.jsx
 * ========================
 * Componentes de layout para páginas de DETALHE (páginas específicas de entidades).
 *
 * Uso rápido:
 *   import {
 *     DetailLayout, DetailBackLink, DetailHeader, DetailInfoCard,
 *     DetailInfoField, DetailActions, DetailSectionTitle,
 *     DetailWidgetGrid, DetailListingSection, UserProfileCard,
 *     MachineProfileCard, StatusBadge
 *   } from "@/components/DetailComponents";
 *
 * Componentes disponíveis:
 *   <DetailLayout>           — wrapper de página de detalhe (sem sidebar própria, usa layout pai)
 *   <DetailBackLink>         — link "Voltar para X"
 *   <DetailHeader>           — título da entidade + ações (editar/excluir)
 *   <DetailInfoCard>         — card branco com informações da entidade
 *   <DetailInfoField>        — campo label + valor inline
 *   <DetailActions>          — grupo de botões editar/excluir
 *   <DetailSectionTitle>     — título de seção interna (ex: "Produção", "Dados do Setor")
 *   <DetailWidgetGrid>       — grid para widgets/gráficos nas páginas de detalhe
 *   <DetailListingSection>   — seção de listagem com título + botão cadastrar
 *   <UserProfileCard>        — card de perfil de usuário (foto + dados + ações)
 *   <MachineProfileCard>     — card de perfil de máquina (foto + dados)
 *   <StatusBadge>            — badge de status padronizado
 */

import { motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SPACING } from "@/lib/spacing"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeUpItem, StaggerWrapper } from "@/components/AnimatedComponents";

// ─────────────────────────────────────────────
// VARIANTES LOCAIS
// ─────────────────────────────────────────────

const DV = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  },
};


// ─────────────────────────────────────────────
// DETAIL BACK LINK
// Link animado "← Voltar para X"
// ─────────────────────────────────────────────

/**
 * @param {string} href    — destino do link
 * @param {string} label   — texto do link (ex: "Voltar para Usuários")
 */
export function DetailBackLink({ href, label }) {
  return (
    <motion.div
      variants={DV.slideLeft}
      initial="hidden"
      animate="visible"
    >
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors font-semibold text-base group"
      >
        <ChevronUp
          className="w-5 h-5 -rotate-90 group-hover:-translate-x-0.5 transition-transform"
        />
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// DETAIL HEADER
// Título da entidade + slot para ações
// ─────────────────────────────────────────────

/**
 * @param {string}    title       — texto do título (ex: "Setor: Engrenagens")
 * @param {ReactNode} actions     — botões de editar/excluir (opcional)
 * @param {string}    className
 */
export function DetailHeader({ title, actions, className }) {
  return (
    <motion.div
      variants={DV.fadeUp}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6", className)}
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black leading-tight">{title}</h1>
      {actions && <div className="flex items-center gap-2 flex-wrap flex-shrink-0">{actions}</div>}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// DETAIL ACTIONS
// Grupo de botões de ação (editar, excluir)
// Wrapper semântico — coloque os Dialogs dentro
// ─────────────────────────────────────────────

/**
 * @param {string}  className
 * children: os botões (Dialog + Triggers)
 */
export function DetailActions({ children, className }) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAIL INFO CARD
// Card branco com borda para informações da entidade
// ─────────────────────────────────────────────

/**
 * @param {string}  className
 * @param {string}  layout    — "row" (horizontal) | "col" (vertical)
 */
export function DetailInfoCard({ children, className, layout = "row" }) {
  return (
    <FadeUpItem>
      <div
        className={cn(
          "bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-7 transition-all duration-300 hover:shadow-md",
          layout === "row" ? "flex flex-col sm:flex-row items-start gap-6" : "flex flex-col gap-4",
          className
        )}
      >
        {children}
      </div>
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// DETAIL INFO FIELD
// Par label + valor (ex: "Setor: Engrenagens")
// ─────────────────────────────────────────────

/**
 * @param {string}    label     — ex: "Setor"
 * @param {ReactNode} value     — texto ou elemento
 * @param {string}    className
 */
export function DetailInfoField({ label, value, className }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2", className)}>
      <span className="text-sm sm:text-base font-semibold text-gray-700">{label}:</span>
      <span className="text-sm sm:text-base font-medium text-black break-words">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAIL INFO COLUMN
// Coluna de DetailInfoFields (agrupa campos)
// ─────────────────────────────────────────────

/**
 * @param {string}  className
 */
export function DetailInfoColumn({ children, className }) {
  return (
    <div className={cn("flex flex-col gap-4 mt-1", className)}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAIL SECTION TITLE
// Título de seção interna (ex: "Produção", "Dados do Setor")
// ─────────────────────────────────────────────

/**
 * @param {string}    title     — texto
 * @param {string}    size      — "lg" | "xl" | "2xl" | "3xl"
 * @param {string}    className
 */
export function DetailSectionTitle({ title, size = "3xl", className }) {
  const sizeClass = {
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  }[size] ?? "text-3xl";

  return (
    <motion.h2
      variants={DV.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("font-bold ", SPACING.sectionGap, sizeClass, className)}
    >
      {title}
    </motion.h2>
  );
}

// ─────────────────────────────────────────────
// DETAIL WIDGET GRID
// Grid responsivo para widgets/gráficos nas páginas de detalhe
// ─────────────────────────────────────────────

/**
 * @param {number|string}   cols      — 1 | 2 | 3 | "1-2" | "2-1" | "1-2-full"
 *   "1-2"  = col-span-1 + col-span-2 (3 colunas no total)
 *   "2-1"  = col-span-2 + col-span-1 (3 colunas no total)
 * @param {string}          className
 */
export function DetailWidgetGrid({ children, cols = 2, className }) {
  const colMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    "1-2": "grid-cols-1 md:grid-cols-3",
    "2-1": "grid-cols-1 md:grid-cols-3",
  };

  return (
    <StaggerWrapper
      className={cn("grid gap-4 sm:gap-6", colMap[cols] ?? colMap[2], className)}
    >
      {children}
    </StaggerWrapper>
  );
}

// ─────────────────────────────────────────────
// DETAIL WIDGET CARD
// Card branco de gráfico/widget para páginas de detalhe
// ─────────────────────────────────────────────

/**
 * @param {string}  colSpan   — ex: "md:col-span-2"
 * @param {boolean} centered
 * @param {string}  className
 */
export function DetailWidgetCard({ children, colSpan, centered, className }) {
  return (
    <FadeUpItem
      className={cn(
        "group bg-white/95 backdrop-blur border border-gray-200/80 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300/90",
        centered && "flex flex-col items-center justify-center",
        colSpan,
        className
      )}
    >
      {children}
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// DETAIL LISTING SECTION
// Seção de listagem completa com título + botão + busca slot
// ─────────────────────────────────────────────

/**
 * @param {string}    id          — id HTML da section
 * @param {string}    title       — título da listagem
 * @param {ReactNode} action      — botão de cadastrar (opcional)
 * @param {ReactNode} search      — componente de busca
 * @param {ReactNode} filterRow   — linha de filtros/ordenação
 * @param {string}    className
 */
export function DetailListingSection({ id, title, action, search, filterRow, children, className }) {
  return (
    <motion.section
      id={id}
      variants={DV.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("flex flex-col gap-4 sm:gap-5", className)}
    >
      {/* Cabeçalho: título + botão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">{title}</h2>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Busca */}
      {search && <div className="mt-3 sm:mt-4 rounded-xl">{search}</div>}

      {/* Linha de filtros */}
      {filterRow && <div>{filterRow}</div>}

      {/* Conteúdo (tabela ou empty state) */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-2 sm:p-3">{children}</div>
    </motion.section>
  );
}

export function ListingTabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs sm:text-sm font-semibold leading-none transition-all duration-200 border",
                isActive
                  ? "bg-[#00357a]/10 text-[#00357a] border-[#00357a]/25"
                  : "bg-white text-slate-600 border-slate-300/80 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// USER PROFILE CARD
// Card de perfil completo do usuário com foto + dados + ações
// Substitui a section #infos_user repetida nas páginas
// ─────────────────────────────────────────────

/**
 * @param {string}    imageSrc      — caminho da imagem
 * @param {string}    imageAlt      — alt da imagem
 * @param {string}    name          — nome completo
 * @param {Array}     fieldsLeft    — [{label, value}] coluna esquerda
 * @param {Array}     fieldsRight   — [{label, value}] coluna direita
 * @param {ReactNode} actions       — botões de editar/excluir
 * @param {string}    className
 */
export function UserProfileCard({
  imageSrc,
  imageAlt = "Foto do usuário",
  name,
  fieldsLeft = [],
  fieldsRight = [],
  actions,
  className,
}) {
  return (
    <FadeUpItem>
      <div
        className={cn(
          "flex flex-col xl:flex-row justify-between items-start gap-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8",
          className
        )}
      >
        {/* Esquerda: foto + dados */}
        <div className="flex flex-col sm:flex-row gap-5 flex-1 min-w-0">
          {/* Foto */}
          <div className="flex-shrink-0">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="rounded-xl w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] object-cover"
              onError={(e) => { e.currentTarget.src = "/jose.svg"; }}
            />
          </div>

          {/* Dados */}
          <div className="flex flex-col gap-3 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black leading-snug">{name}</h1>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
              {/* Coluna esquerda */}
              {fieldsLeft.length > 0 && (
                <div className="flex flex-col gap-3">
                  {fieldsLeft.map((f, i) => (
                    <DetailInfoField key={i} label={f.label} value={f.value} />
                  ))}
                </div>
              )}

              {/* Coluna direita */}
              {fieldsRight.length > 0 && (
                <div className="flex flex-col gap-3">
                  {fieldsRight.map((f, i) => (
                    <DetailInfoField key={i} label={f.label} value={f.value} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Direita: ações */}
        {actions && (
          <div className="flex gap-2 flex-shrink-0 self-start">{actions}</div>
        )}
      </div>
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// MACHINE PROFILE CARD
// Card de perfil da máquina com imagem + dados
// ─────────────────────────────────────────────

/**
 * @param {string}    machineName   — nome/modelo
 * @param {string}    imageSrc      — caminho da imagem
 * @param {Array}     fieldsLeft    — [{label, value}]
 * @param {Array}     fieldsRight   — [{label, value}]
 * @param {ReactNode} actions       — editar/excluir
 * @param {ReactNode} headerSlot    — slot acima do conteúdo (ex: badge de status especial)
 * @param {string}    className
 */
export function MachineProfileCard({
  machineName,
  imageSrc = "/demo_maq.png",
  fieldsLeft = [],
  fieldsRight = [],
  actions,
  headerSlot,
  className,
}) {
  return (
    <FadeUpItem>
      <div 
        className={cn(
          "bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
          className
        )}
      >
        {/* Cabeçalho Unificado */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {machineName}
            </h1>
            {/* O slot de cabeçalho (ex: Badge de Status) agora fica elegante ao lado do título */}
            {headerSlot && <div className="flex items-center">{headerSlot}</div>}
          </div>
          
          {actions && (
            <div className="flex items-center gap-2 self-end sm:self-auto raw-actions">
              {actions}
            </div>
          )}
        </div>

        {/* Corpo do Card */}
        <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-start">
          
          {/* Container da Imagem Modernizado */}
          <div className="w-full md:w-44 h-44 md:h-44 flex-shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center relative group">
            <img
              src={imageSrc}
              alt={machineName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/demo_maq.png";
              }}
            />
          </div>

          {/* Área de Dados em Grid Responsivo */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-2 md:mt-0">
            {fieldsLeft.length > 0 && (
              <div className="flex flex-col gap-3.5">
                {fieldsLeft.map((f, i) => (
                  <DetailInfoField key={`left-${i}`} label={f.label} value={f.value} />
                ))}
              </div>
            )}
            
            {fieldsRight.length > 0 && (
              <div className="flex flex-col gap-3.5">
                {fieldsRight.map((f, i) => (
                  <DetailInfoField key={`right-${i}`} label={f.label} value={f.value} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// STATUS BADGE
// Badge de status reutilizável (sem import do shadcn)
// ─────────────────────────────────────────────

const STATUS_STYLES = {
  Produzindo: "bg-green-500/15 text-green-700",
  Setup: "bg-yellow-100 text-yellow-700",
  Parada: "bg-red-100 text-red-700",
  "Aguardando Início": "bg-gray-100 text-gray-600",
  Concluída: "bg-blue-100 text-blue-700",
};

/**
 * @param {string}  status    — valor do status
 * @param {string}  className — classes extras
 */
export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-0.5 rounded-lg text-sm font-semibold",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────
// SECTION HIGHLIGHT
// Card branco de ue (ex: OEE Principal)
// com borda dupla superior
// ─────────────────────────────────────────────

/**
 * @param {string}  className
 */
export function SectionHighlight({ children, className }) {
  return (
    <FadeUpItem>
      <div className={cn("bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm", className)}>
        {children}
      </div>
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// DETAIL PAGE CONTAINER
// Container interno das páginas de detalhe
// (substitui o div.w-full.mt-8.pb-10.px-8.space-y-4 manual)
// ─────────────────────────────────────────────

/**
 * @param {string}  className   — classes extras
 */
// Mantenha só o DetailPageContainer e delete DetailLayout
// ou faça DetailLayout ser um alias:

export function DetailPageContainer({ children, className }) {
  return (
    <div className={cn(
      "w-full",
      SPACING.pageTop,
      SPACING.pageX,
      SPACING.pageBottom,
      SPACING.sectionGap,
      className
    )}>
      {children}
    </div>
  )
}

// alias para retrocompatibilidade
export { DetailPageContainer as DetailLayout }