"use client";

import { useEffect, useState, useRef } from "react";

export function KPIHorizontal({ title, value, type = "number" }) {
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
        <div className="w-full flex flex-row items-center justify-between">

            <div className="flex flex-col items-start pl-3 py-2 flex-1">
                <p className="text-base font-bold text-black tracking-tight leading-snug uppercase">
                    {title}
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 self-start">
                    *Atualizado em tempo real
                </p>
            </div>

            <div className="flex items-center justify-end tabular-nums pr-2">
                <h2 className="text-3xl font-black text-black tracking-tight leading-none md:text-4xl">
                    {formatValue(displayValue)}
                </h2>
            </div>

        </div>
    );
}