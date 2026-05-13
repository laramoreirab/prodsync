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
import { ChevronDown } from "lucide-react";
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
// DETAIL LAYOUT
// Wrapper de página de detalhe. Não inclui a
// sidebar — esta já vem do layout pai (adm/layout).
// ─────────────────────────────────────────────

/**
 * @param {string}    className   — classes extras
 * @param {string}    paddingX    — padding horizontal (default: "px-4 sm:px-6 lg:px-8")
 */
export function DetailLayout({ children, className, paddingX = "px-4 sm:px-6 lg:px-8" }) {
  return (
    <div className={cn("w-full pb-12 space-y-6", paddingX, className)}>
      {children}
    </div>
  );
}

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
        <ChevronDown
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
      className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">{title}</h1>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
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
    <div className={cn("flex items-center gap-2", className)}>
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
          "bg-white border border-gray-200 rounded-2xl shadow-sm p-6",
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
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-base sm:text-lg font-semibold text-black">{label}:</span>
      <span className="text-base sm:text-lg font-medium text-black">{value}</span>
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
      className={cn("font-bold", sizeClass, className)}
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
      className={cn("grid gap-4", colMap[cols] ?? colMap[2], className)}
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
        "bg-white border border-gray-100 rounded-xl p-4 shadow-sm",
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
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Cabeçalho: título + botão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
        <h2 className="text-3xl sm:text-4xl font-semibold">{title}</h2>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Busca */}
      {search && <div>{search}</div>}

      {/* Linha de filtros */}
      {filterRow && <div>{filterRow}</div>}

      {/* Conteúdo (tabela ou empty state) */}
      <div>{children}</div>
    </motion.section>
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
          "flex flex-col sm:flex-row justify-between items-start gap-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6",
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
            <h1 className="text-xl sm:text-2xl font-bold text-black leading-snug">{name}</h1>

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
      <div className={cn("flex flex-col gap-4", className)}>
        {/* Cabeçalho: nome + ações */}
        <div className="flex items-center justify-between">
          <div className="bg-white px-5 pb-3 rounded-tl-3xl rounded-tr-3xl border border-t-gray-300 border-l-gray-300 border-r-gray-300 border-b-8 border-b-[#00357a] inline-block">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase text-[#212e4b] px-4 py-3">
              {machineName}
            </h1>
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>

        {/* Corpo: foto + dados */}
        <div className="flex flex-col sm:flex-row gap-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          {/* Foto */}
          <div className="flex-shrink-0 bg-gray-50 rounded-xl p-4 flex items-center justify-center">
            <img
              src={imageSrc}
              alt={machineName}
              className="rounded-xl w-[140px] h-[140px] object-cover"
              onError={(e) => { e.currentTarget.src = "/demo_maq.png"; }}
            />
          </div>

          {/* Dados */}
          <div className="flex flex-col sm:flex-row gap-8 flex-1">
            {fieldsLeft.length > 0 && (
              <div className="flex flex-col gap-4">
                {fieldsLeft.map((f, i) => (
                  <DetailInfoField key={i} label={f.label} value={f.value} />
                ))}
              </div>
            )}
            {fieldsRight.length > 0 && (
              <div className="flex flex-col gap-4">
                {fieldsRight.map((f, i) => (
                  <DetailInfoField key={i} label={f.label} value={f.value} />
                ))}
              </div>
            )}
          </div>
        </div>

        {headerSlot && <div>{headerSlot}</div>}
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
// Card branco de destaque (ex: OEE Principal)
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
export function DetailPageContainer({ children, className }) {
  return (
    <div className={cn("w-full mt-6 pb-12 px-4 sm:px-6 lg:px-8 space-y-6", className)}>
      {children}
    </div>
  );
}