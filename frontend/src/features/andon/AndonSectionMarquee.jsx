"use client";

import { Marquee } from "@/components/shadcn-space/animations/marquee";
import { AndonMachineCard } from "./AndonMachineCard";

export function AndonSectionMarquee({ section, reverse = false }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-950">{section.titulo}</h2>

      <Marquee
        className="[--duration:32s] [--gap:1rem] px-0 py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        pauseOnHover={false}
        repeat={3}
        reverse={reverse}>
        {section.maquinas.map((machine) => (
          <AndonMachineCard key={machine.id} machine={machine} />
        ))}
      </Marquee>
    </section>
  );
}
