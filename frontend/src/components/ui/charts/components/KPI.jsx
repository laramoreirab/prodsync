"use client";

import { useEffect, useState, useRef } from "react";

export function KPI({ title, value, type = "number" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    const start = prevValueRef.current;
    const duration = 800;
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = progress * (2 - progress);
      const currentValue = start + (target - start) * ease;
      
      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = target;
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value]);

  const formatValue = (val) => {
    if (type === "currency") {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val);
    }
    if (type === "percent") {
      return `${val}%`;
    }
    return new Intl.NumberFormat("pt-BR").format(val);
  };

  return (
    <div className="w-full h-full flex flex-col select-none p-1">
      
      <div className="flex flex-col items-start flex-shrink-0">
        <p className="text-sm font-semibold text-black leading-snug">{title}</p>
      </div>

      {/* 
       - `min-h-[64px]`: Garante uma distância mínima aceitável caso o card esteja na altura padrão (default).
      */}
      <div className="flex flex-1 items-center justify-center min-h-[64px] mt-2">
        <h2 className="text-5xl font-bold text-black tracking-tight leading-none md:text-6xl tabular-nums">
          {formatValue(displayValue)}
        </h2>
      </div>

    </div>
  );
}