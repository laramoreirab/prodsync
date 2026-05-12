"use client";

import { useEffect, useState } from "react";
import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { TurnosOperadoresWidget } from "@/features/usuarios/TurnosOperadoresWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { ProducaoMediaUsuarioSetorWidget } from "@/features/usuarios/ProducaoMediaUsuarioSetorWidget";
import { UsuarioTaxaRefugoWidget } from "@/features/usuarios/UsuarioTaxaRefugoWidget";

export default function UsuariosGestor() {
  const [setorId, setSetorId] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_setor) setSetorId(payload.id_setor);
    } catch {
      // token ausente ou malformado
    }
  }, []);

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col p-8 gap-6">
      <header>
        <h1 className="inline-block underline decoration-secondary-foreground underline-offset-[12px] decoration-4 text-4xl font-semibold">
          Usuários
        </h1>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
          <QtdUsuariosWidget />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
          <TurnosOperadoresWidget setorId={setorId} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
          <TopOperadoresWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center">
          <TempoSessaoWidget setorId={setorId} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <RotatividadeWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <ProducaoMediaUsuarioSetorWidget setorId={setorId} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <UsuarioTaxaRefugoWidget setorId={setorId} />
        </div>
      </section>
    </main>
  );
}