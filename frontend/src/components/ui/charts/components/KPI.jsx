"use client";

export function KPI({ title, value }) {
  return (
    <>
      <p className="text-sm font-semibold">{title}</p>
      <div className="flex flex-col items-center justify-center w-full">

        <h2 className="text-5xl font-medium p-8">{value}</h2>
      </div>
      </>

  );
}

// Demonstração de KPI, um componente genérico que mostra um número