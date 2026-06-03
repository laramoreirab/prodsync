"use client";

/**
 * AnimatedComponents.jsx
 * ========================
 * Sistema de componentes de layout animados para uniformidade entre páginas.
 *
 * Uso rápido:
 *   import { PageLayout, PageHeader, SectionDivider, StaggerWrapper, FadeUpItem } from "@/components/AnimatedComponents";
 *
 * Componentes disponíveis:
 *   <PageLayout>             — wrapper de página com bg padrão
 *   <PageHeader>             — título + botão de ação
 *   <SectionDivider>         — linha divisória com título
 *   <StaggerWrapper>         — container que cascateia children
 *   <FadeUpItem>             — item individual com fade+slide
 *   <AnimatedTitle>          — título com animação de entrada
 *   <KPIGrid>                — grid responsivo para cards de KPI
 *   <ContentGrid>            — grid de 2 ou 3 colunas para gráficos
 *   <SearchBar>              — barra de busca padrão
 *   <ListingHeader>          — cabeçalho da seção de listagem
 *   <FilterRow>              — linha de quantidade + ordenar/filtrar
 *   <EmptyState>             — estado vazio padronizado
 *   <LoadingState>           — spinner de carregamento padronizado
 */

import { motion, useReducedMotion } from "motion/react";
import { SPACING } from "@/lib/spacing";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// VARIANTES DE ANIMAÇÃO (centralizadas)
// ─────────────────────────────────────────────

const VARIANTS = {
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  },

  fadeUp: {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.18,
        duration: 0.55,
      },
    },
  },

  fadeIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  },

  slideLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.45,
      },
    },
  },

  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  },

};

function getViewportMotionProps(shouldReduce, once = true) {
  if (shouldReduce) {
    return { initial: false, animate: "visible" };
  }

  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once },
  };
}

// ─────────────────────────────────────────────
// PAGE LAYOUT
// Wrapper principal com bg padrão da app
// ─────────────────────────────────────────────
/**
 * @param {string}  className   — classes extras
 * @param {boolean} padded      — aplica px-8 padrão (default: true)
 * @param {string}  bg          — override do bg (default: bg_app.svg)
 * @param {boolean} center      — se true, centraliza e deixa o conteúdo com 70% de largura (default: false)
 */
export function PageLayout({
  children,
  className,
  padded = true,
  bg,
  center = false,
}) {
  return (
    <main className={cn("relative min-h-screen flex flex-col bg-transparent dark:bg-zinc-950", className)}>
      {/* Light mode: SVG aparece normalmente */}
      <div
        className="fixed inset-0 -z-10 bg-no-repeat dark:hidden"
        style={{
          backgroundImage: bg ?? "url('/bg_app.svg')",
          backgroundPosition: "right 0 top -6rem",
          backgroundSize: "75% auto",
        }}
      />

      {/* Dark mode: SVG com a cor do fundo (invisível) */}
      <div
        className="fixed inset-0 -z-10 bg-no-repeat hidden dark:block"
        style={{
          backgroundImage: bg ?? "url('/bg_app.svg')",
          backgroundPosition: "right 0 top -6rem",
          backgroundSize: "75% auto",
          filter: "brightness(0) invert(0) opacity(0.07)",
        }}
      />

      <div
        className={cn(
          "flex flex-col flex-1 w-full",
          padded && "px-4 sm:px-6 lg:px-8 pb-12",
          center && "items-center pt-16",
        )}
      >
        <div
          className={cn(
            "w-full min-w-0",
            center &&
              "md:max-w-[70%] mx-auto flex flex-col items-center justify-center",
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
// ─────────────────────────────────────────────
// PAGE HEADER
// Título da página + botão de ação principal
// ─────────────────────────────────────────────

/**
 * @param {string}      title       — texto do título
 * @param {ReactNode}   action      — botão/elemento de ação (opcional)
 * @param {string}      className   — classes extras no container
 * @param {boolean}     underline   — sublinhado estilo padrão (default: true)
 * @param {string}      subtitle    — subtítulo abaixo do título (opcional)
 */
export function PageHeader({
  title,
  action,
  className,
  underline = true,
  subtitle,
}) {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col sm:flex-row sm:items-start justify-between gap-6 sm:gap-4",
        SPACING.pageTop,
        SPACING.afterHeader,
        className,
      )}
    >
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Criamos um wrapper 'w-fit' para que a linha tenha exatamente o tamanho do texto */}
        <div className="relative w-fit pb-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#17233b] dark:text-[#f4f8ff]">
            {title}
          </h1>
          
          {underline && (
            <motion.div
              className="absolute bottom-0 left-0 h-[5px] w-full rounded-full bg-[#315aa8] dark:bg-[#6f9bff]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }} // Faz a animação começar estritamente da esquerda para a direita
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // Ajuste o delay se quiser sincronizar com o fadeUp
            />
          )}
        </div>

        {subtitle && (
          <p className="text-base text-muted-foreground font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 pt-1 w-full sm:w-auto">
        {action}
      </div>
    </motion.div>
  );
}
// ─────────────────────────────────────────────
// SECTION DIVIDER
// Linha horizontal com título — padrão das páginas
// ─────────────────────────────────────────────

/**
 * @param {string}    title     — texto à esquerda da linha
 * @param {ReactNode} action    — elemento de ação à direita (opcional)
 * @param {string}    className — classes extras
 */
export function SectionDivider({ title, action, className }) {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2",
        className,
      )}
    >
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <h2 className="text-3xl sm:text-4xl font-semibold whitespace-normal sm:whitespace-nowrap text-[#17233b] dark:text-[#f4f8ff]">
          {title}
        </h2>
        <hr className="hidden sm:block flex-1 h-0.75 rounded-full bg-[#315aa8]/50 dark:bg-[#243754]" />
      </div>

      {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
    </motion.div>
  );
}
// ─────────────────────────────────────────────
// STAGGER WRAPPER
// Container que aciona animação cascata nos filhos
// ─────────────────────────────────────────────

/**
 * @param {string}  className   — classes do container
 * @param {number}  delay       — delay inicial (default: 0.05)
 * @param {number}  stagger     — tempo entre cada filho (default: 0.08)
 * @param {boolean} once        — anima só uma vez ao entrar na tela
 */
export function StaggerWrapper({
  children,
  className,
  delay = 0.05,
  stagger = 0.08,
  once = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      {...getViewportMotionProps(shouldReduceMotion, once)}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FADE UP ITEM
// Item individual com animação fade + slide up
// ─────────────────────────────────────────────

/**
 * @param {string}  className   — classes do elemento
 * @param {string}  variant     — "fadeUp" | "fadeIn" | "slideLeft" | "scaleIn"
 * @param {boolean} once        — anima só uma vez
 */
export function FadeUpItem({
  children,
  className,
  variant = "fadeUp",
  once = true,
  ...rest
}) {
  const usedVariant = VARIANTS[variant] ?? VARIANTS.fadeUp;
  const shouldReduceMotion = useReducedMotion();
  

  return (
    <motion.div
      className={className}
      variants={usedVariant}
      whileHover={!shouldReduceMotion ? { y: -2 } : undefined}
      transition={{ duration: 0.22, ease: "easeOut" }}
      {...getViewportMotionProps(shouldReduceMotion, once)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// ANIMATED TITLE
// Título com animação de slide lateral
// ─────────────────────────────────────────────

export function AnimatedTitle({ children, className, as: Tag = "h1" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={VARIANTS.slideLeft}
      {...getViewportMotionProps(shouldReduceMotion, true)}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// KPI GRID
// Grid responsivo para cards de KPI/métricas
// ─────────────────────────────────────────────

/**
 * @param {number}  cols      — colunas no desktop: 2 | 3 | 4 | 5 | 6
 * @param {string}  className — classes extras
 */
export function KPIGrid({ children, cols = 4, className }) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <StaggerWrapper
      className={cn("grid gap-4 sm:gap-5 lg:gap-6", colClasses[cols] ?? colClasses[4], className)}
    >
      {children}
    </StaggerWrapper>
  );
}

// ─────────────────────────────────────────────
// CONTENT GRID
// Grid de 2 ou 3 colunas para gráficos/widgets
// ─────────────────────────────────────────────

/**
 * @param {number}  cols      — 2 | 3
 * @param {string}  className
 */
export function ContentGrid({ children, cols = 2, className }) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
  };

  return (
    <StaggerWrapper
      className={cn("grid gap-4 sm:gap-6 lg:gap-8", colClasses[cols] ?? colClasses[2], className)}
    >
      {children}
    </StaggerWrapper>
  );
}

// ─────────────────────────────────────────────
// ASYMMETRIC CONTENT GRID
// Grid de 2 colunas: um retângulo grande e um fino
// ─────────────────────────────────────────────

/**
 * @param {string}  side
 * @param {string}  className
 */
export function AsymmetricGrid({ children, side = "left", className }) {
  const layoutClasses =
    side === "left"
      ? "[&>*:nth-child(1)]:md:col-span-2 [&>*:nth-child(2)]:md:col-span-1"
      : "[&>*:nth-child(1)]:md:col-span-1 [&>*:nth-child(2)]:md:col-span-2";

  return (
    <StaggerWrapper
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6",
        layoutClasses,
        className,
      )}
    >
      {children}
    </StaggerWrapper>
  );
}

// ─────────────────────────────────────────────
// WIDGET CARD
// Card branco padrão para gráficos e KPIs
// ─────────────────────────────────────────────

/**
 * @param {string}  className     — classes extras
 * @param {string}  colSpan       — ex: "md:col-span-2"
 * @param {boolean} centered      — centra o conteúdo verticalmente
 */
export function WidgetCard({ children, className, colSpan, centered }) {
  return (
    <FadeUpItem
      className={cn(
        "group bg-white/95 backdrop-blur border border-gray-200/80 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300/90 dark:bg-[#0b1324] dark:border-[#1d2d49] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)] dark:hover:border-[#2f4770]",
        centered && "flex flex-col items-center justify-center",
        colSpan,
        className,
      )}
    >
      {children}
    </FadeUpItem>
  );
}

export function WidgetCard2({ children, className, colSpan, centered }) {
  return (
    <FadeUpItem
      className={cn(
        "group flex flex-col bg-white/95 backdrop-blur border border-gray-200/80 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300/90 dark:bg-[#0b1324] dark:border-[#1d2d49] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)] dark:hover:border-[#2f4770]",
        
        centered && "items-center justify-center",
        colSpan,
        className,
      )}
    >
      {children}
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// SEARCH BAR
// Barra de busca padronizada
// ─────────────────────────────────────────────

/**
 * @param {string}    value         — valor do input
 * @param {Function}  onChange      — handler de mudança
 * @param {string}    placeholder   — placeholder do input
 * @param {string}    className     — classes extras
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}) {
  return (
    <FadeUpItem
      className={cn(
        "flex items-center w-full p-1.5 justify-between rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-[#243754] dark:bg-[#07101f] dark:shadow-[0_12px_34px_rgba(0,0,0,0.24)]",
        className,
      )}
    >
      <input
        type="search"
        className="p-2.5 w-full outline-none bg-transparent font-medium text-md rounded-lg text-[#17233b] placeholder:text-gray-400 dark:text-[#f4f8ff] dark:placeholder:text-[#71809b]"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span className="m-2 text-muted-foreground">
        <Search className="w-4 h-4" />
      </span>
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// LISTING HEADER
// Cabeçalho de seção de listagem com título,
// linha hr e botão de ação
// ─────────────────────────────────────────────

export { SectionDivider as ListingHeader };

// ─────────────────────────────────────────────
// FILTER ROW
// Linha "X itens encontrados" + ordenar/filtrar
// ─────────────────────────────────────────────
/**
 * @param {number}    count     — quantidade de itens
 * @param {string}    label     — ex: "setores" | "usuários"
 * @param {ReactNode} actions   — componentes de ordenar/filtrar
 * @param {string}    className
 */
export function FilterRow({ count, label = "resultados", actions, className }) {
  return (
    <FadeUpItem
      className={cn(
        // Mudança principal: flex-col no mobile, flex-row no desktop
        "relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3",
        className,
      )}
    >
      <p className="text-sm text-gray-600 dark:text-[#aebbd1]">
        {count} {label} encontrado{count !== 1 ? "s" : ""}
      </p>

      {actions && (
        // Garante que os botões fiquem alinhados e não quebrem linha entre si
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {actions}
        </div>
      )}
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// Estado vazio padronizado
// ─────────────────────────────────────────────

/**
 * @param {string}    title     — título da mensagem
 * @param {string}    message   — mensagem secundária
 * @param {ReactNode} icon      — ícone (default: Search)
 */
export function EmptyState({
  title = "Nenhum resultado encontrado",
  message,
  icon,
  className,
}) {
  const Icon = icon ?? Search;
  return (
    <FadeUpItem
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-gray-500 w-full dark:text-[#aebbd1]",
        className,
      )}
    >
      <Icon className="w-12 h-12 mb-4 text-gray-300 dark:text-[#3a5278]" />
      <h2 className="text-xl font-semibold">{title}</h2>
      {message && (
        <p className="text-sm text-gray-400 mt-1 text-center dark:text-[#71809b]">{message}</p>
      )}
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// LOADING STATE
// Spinner de carregamento padronizado
// ─────────────────────────────────────────────

/**
 * @param {string} message — texto abaixo do spinner
 */
export function LoadingState({ message = "Carregando...", className }) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-12 h-12 animate-spin text-[#00357a] dark:text-[#6f9bff]" />
        <p className="text-lg text-gray-600 font-medium dark:text-[#aebbd1]">{message}</p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE SECTION
// Seção semântica com animação de entrada
// ─────────────────────────────────────────────

/**
 * @param {string}  id        — id HTML da section
 * @param {string}  className — classes extras
 */
export function PageSection({ children, id, className }) {
  return (
    <motion.section
      id={id}
      variants={VARIANTS.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─────────────────────────────────────────────
// KPI CARD DECORATED
// Card otimizado para KPIs horizontais (mais compacto e com barra azul imponente)
// ─────────────────────────────────────────────

/**
 * @param {string}  className   — classes extras para ajuste de layout
 * @param {string}  colSpan     — controle de colunas no grid (ex: "md:col-span-2")
 */
export function KPICardDecorated({ children, className, colSpan }) {
  return (
    <FadeUpItem
      className={cn(
        "bg-white/95 border border-gray-200/80 border-l-4 border-l-[#00357a] rounded-2xl p-4 sm:p-5 shadow-sm min-h-23 flex items-center justify-between transition-all duration-300 hover:shadow-md dark:bg-[#0b1324] dark:border-[#1d2d49] dark:border-l-[#6f9bff]",
        colSpan,
        className,
      )}
    >
      {children}
    </FadeUpItem>
  );
}

// ─────────────────────────────────────────────
// EXPORTED VARIANTS (para uso externo)
// ─────────────────────────────────────────────

export { VARIANTS as animationVariants };
