"use client";

export function KPIRetangulo({ title, value }) {
  return (
    <div className="w-full h-full flex items-center justify-between gap-2">
      {/* Lado Esquerdo: Textos */}
      <div className="flex flex-col justify-center min-w-0">
        <p className="text-xs md:text-sm font-bold text-black leading-tight uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-none">
          *Atualizado em tempo real
        </p>
      </div>

      {/* Lado Direito: Valor */}
      <div className="flex items-center justify-end">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground tracking-tighter">
          {value}
        </h2>
      </div>
    </div>
  );
}