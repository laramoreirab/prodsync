"use client";

export function KPI({ title, value }) {
  return (
     <div className="w-full h-full aspect-square min-h-[180px] flex flex-col">

      <div className="flex flex-col items-start justify-start">
        <p className="text-sm font-semibold text-black leading-tight">
          {title}
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          *Atualizado em tempo real
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-5xl font-medium text-black tracking-tight">
          {value}
        </h2>
      </div>
      
    </div>
  );
}