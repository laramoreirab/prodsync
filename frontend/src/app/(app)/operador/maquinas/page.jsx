"use client";

import { MaquinaOEEWidget } from "@/features/operador/MaquinaOEEWidget";

// Mock temporário — virá do service depois
const mockMetas = {
  metaDia:      200,
  metaDiaTotal: 500,
  metaTotal:    1200,
  metaTotalMax: 5000,
};

function MetaCard({ label, atual, total }) {
  return (
    <div className="bg-white border rounded-xl p-6 flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <div className="flex items-end gap-1">
        <span className="text-6xl font-bold text-black">{atual}</span>
        <span className="text-2xl text-gray-400 mb-1">/{total}</span>
      </div>
    </div>
  );
}

export default function MaquinaPage() {
  const { metaDia, metaDiaTotal, metaTotal, metaTotalMax } = mockMetas;

  function handleSetup() {
    // abrir modal de setup
    alert("Registrar Setup");
  }

  function handleParada() {
    // abrir modal de parada
    alert("Registrar Parada");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">

      {/* OEE + Status */}
      <section className="bg-white border rounded-xl p-6">
        <MaquinaOEEWidget />
      </section>

      {/* Metas */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetaCard
          label="Meta do Dia"
          atual={metaDia}
          total={metaDiaTotal}
        />
        <MetaCard
          label="Meta Total"
          atual={metaTotal}
          total={metaTotalMax}
        />
      </section>

      {/* Botões de ação */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleSetup}
          className="w-full py-4 rounded-xl bg-[#ffd51e] text-black text-xl font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Registrar SetUp
        </button>
        <button
          onClick={handleParada}
          className="w-full py-4 rounded-xl bg-[#b30000] text-white text-xl font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Registrar Parada
        </button>
      </section>

    </div>
  );
}