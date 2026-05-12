/**
 * Variantes de animação padronizadas para o Framer Motion.
 * Centralizar aqui permite ajustar a velocidade e o estilo de todo o site de uma vez.
 */

// 1. Container para efeito de cascata (Stagger)
export const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Tempo entre a entrada de cada item
        delayChildren: 0.1,    // Espera antes de começar a primeira animação
      },
    },
  };
  
  // 2. Fade Up (Subir suavemente - Ideal para Cards e Seções)
  export const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  
  // 3. Fade In Simple (Apenas aparecer - Ideal para textos e divisores)
  export const FADE_IN = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };
  
  // 4. Efeitos de Interação (Hover e Tap - Ideal para Buttons e Cards clicáveis)
  export const CLICK_INTERACTION = {
    whileHover: { scale: 1.01, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  };
  
  // 5. Entrada Lateral (Ideal para Sidebars ou modais)
  export const SLIDE_IN = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };