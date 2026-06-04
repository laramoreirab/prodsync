"use client";

import { Marquee } from "@/components/shadcn-space/animations/marquee";
import { AndonMachineCard } from "./AndonMachineCard";

// Largura estimada de cada card (w-63 = 252px) + gap (1rem = 16px)
const CARD_WIDTH_PX = 268;
// Mínimo de repetições para garantir continuidade em telas largas (ex: 4K)
const MIN_REPEAT = 6;

export function AndonSectionMarquee({ section, reverse = false }) {
  const isStatic = section.maquinas.length <= 6;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const totalCardWidth = section.maquinas.length * CARD_WIDTH_PX;

  // Quantas repetições são necessárias para cobrir pelo menos 2x a tela
  const repeat = Math.max(
    MIN_REPEAT,
    Math.ceil((screenWidth * 2) / totalCardWidth)
  );

  //tentei dexar continuo o carrosel - Lari

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold text-slate-950">{section.titulo}</h2>

      {isStatic ? (
        <div className="flex gap-4 overflow-hidden px-0 py-2">
          {section.maquinas.map((machine) => (
            <AndonMachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      ) : (
      <Marquee
        className="[--duration:32s] [--gap:1rem] px-0 py-2 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,)transparent]"
        pauseOnHover={false}
        repeat={repeat}
        reverse={reverse}>
        {section.maquinas.map((machine) => (
          <AndonMachineCard key={machine.id} machine={machine} />
        ))}
      </Marquee>
      )}
    </section>
  );
}
