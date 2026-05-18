"use client";

import { useEffect, useState } from "react";

export function KPI({ title, value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    let start = 0;
    const duration = 1000; // 1 segundo
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Efeito de desaceleração (easeOutQuad)
      const ease = progress * (2 - progress);
      
      setDisplayValue(Math.floor(ease * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="w-full h-full min-h-[128px] flex flex-col">
      <div className="flex flex-col items-start">
        <p className="text-sm font-semibold text-black leading-snug">{title}</p>
        <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      </div>

      <div className="flex flex-1 items-center justify-between gap-6 py-6">
        <div className="h-1.5 w-12 rounded-full bg-[var(--azul-cobalto)] md:w-16" />
        <h2 className="text-4xl font-semibold text-black tracking-tight leading-none md:text-5xl">
          {displayValue}
        </h2>
      </div>
    </div>
  );
}
