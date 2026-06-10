"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      // Impede que o Lenis intercepte o scroll quando o elemento
      // sob o ponteiro já tem scroll próprio (ex: conteúdo de modal)
      prevent: (node) => {
        return (
          node.hasAttribute("data-lenis-prevent") ||
          node.closest("[data-lenis-prevent]") !== null ||
          // Radix Dialog / Sheet montam um [role="dialog"]
          node.closest('[role="dialog"]') !== null ||
          // Radix ScrollArea usa [data-radix-scroll-area-viewport]
          node.closest("[data-radix-scroll-area-viewport]") !== null
        );
      },
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}