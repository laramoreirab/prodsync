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
      {label ? (
        <span className="text-sm sm:text-base font-semibold text-gray-700">{label}:</span>
      ) : null}
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
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Busca */}
      {search && <div className="mt-3 sm:mt-4 rounded-xl">{search}</div>}

      {/* Linha de filtros */}
      {filterRow && <div>{filterRow}</div>}

      {/* Conteúdo (tabela ou empty state) */}
      <div className="rounded-2xl bg-transparent pt-2 sm:pt-3">{children}</div>
    </motion.section>
  );
}

export function ListingTabs({ tabs, activeTab, onChange, className }) {
  return (<>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                // base — espelha TabsTrigger da referencia_1
                "relative inline-flex rounded-full h-full items-center justify-center mr-2 border border-transparent px-3.5 py-0.5 text-md font-medium whitespace-nowrap transition-all cursor-pointer",
                "text-muted-foreground hover:text-gray-600 hover:bg-gray-200 data-[state=active]:bg-blue-900 data-[state=active]:text-foreground",
                "disabled:pointer-events-none disabled:opacity-50",
                // ativo — espelha data-active do TabsTrigger
                isActive
                  ? "bg-blue-900 text-white hover:bg-blue-900 hover:text-white shadow-sm dark:border-input dark:bg-input/30 dark:text-slate-300"
                  : "bg-transparent"
              )}
            >
              {tab.label}
            </button>
          );
        })}
        </>

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
export function EntityProfileCard({
  name,
  imageSrc,
  imageAlt = "Foto do usuário",
  fieldsLeft = [],
  fieldsRight = [],
  actions,
  headerSlot,
  imageShape = "circle",
  imageFallback = "/jose.svg",
  className,
}) {
  const isSquare = imageShape === "square";

  return (
    <FadeUpItem>
      <div
        className={cn(
          "bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-[#1e294b] rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
          className
        )}
      >
        {/* Cabeçalho Unificado */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#1e294b] bg-slate-50/50 dark:bg-[#0f172a]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#f8fafc] sm:text-2xl truncate">
              {name}
            </h1>
            {headerSlot && <div className="flex items-center flex-shrink-0">{headerSlot}</div>}
          </div>

          {actions && (
            <div className="flex items-center gap-2 self-end sm:self-auto raw-actions flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Corpo do Card */}
        <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
          
          {/* Avatar / Imagem da Entidade */}
          <div
            className={cn(
              "flex-shrink-0 border-4 border-slate-50 dark:border-[#1e294b] shadow-inner overflow-hidden relative group bg-slate-100 dark:bg-[#0f172a]",
              isSquare
                ? "w-40 h-40 sm:w-48 sm:h-48 lg:w-35 lg:h-35 rounded-2xl"
                : "w-28 h-28 sm:w-32 sm:h-32 rounded-full"
            )}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = imageFallback;
              }}
            />
          </div>

          {/* Grid de Informações */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 md:mt-2 text-3xl">
            {fieldsLeft.length > 0 && (
              <div className="flex flex-col gap-3.5">
                {fieldsLeft.map((f, i) => (
                  <DetailInfoField key={`user-left-${i}`} label={f.label} value={f.value} />
                ))}
              </div>
            )}

            {fieldsRight.length > 0 && (
              <div className="flex flex-col gap-3.5">
                {fieldsRight.map((f, i) => (
                  <DetailInfoField key={`user-right-${i}`} label={f.label} value={f.value} />
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
// SECTION HIGHLIGHT
// Card branco de ue (ex: OEE Principal)
// com borda dupla superior
// ─────────────────────────────────────────────

/**
 * @param {string}  className
 */
export function UserProfileCard({
  imageAlt = "Foto do usuario",
  imageFallback = "/jose.svg",
  ...props
}) {
  return (
    <EntityProfileCard
      imageAlt={imageAlt}
      imageFallback={imageFallback}
      imageShape="circle"
      {...props}
    />
  );
}
export function StatusBadge({ status, className }) {
  const normalizedStatus = status || "-";
  const statusClass = {
    Produzindo: "bg-green-500/15 text-green-600 border-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30",
    Setup: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
    Parada: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30",
  }[normalizedStatus] || "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold",
        statusClass,
        className
      )}
    >
      {normalizedStatus}
    </span>
  );
}

export function MachineProfileCard({
  machineName,
  imageSrc = "/demo_maq.png",
  imageAlt = "Maquina",
  imageFallback = "/demo_maq.png",
  fieldsLeft = [],
  fieldsRight = [],
  status,
  actions,
  headerSlot,
  className,
}) {
  const enrichedFieldsRight = [
    ...fieldsRight,
    ...(status ? [{ label: "Status", value: <StatusBadge status={status} /> }] : []),
  ];

  return (
    <EntityProfileCard
      name={machineName}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      imageFallback={imageFallback}
      imageShape="square"
      fieldsLeft={fieldsLeft}
      fieldsRight={enrichedFieldsRight}
      actions={actions}
      headerSlot={headerSlot ?? null}
      className={className}
    />
  );
}

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
