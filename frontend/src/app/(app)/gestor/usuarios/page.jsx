"use client";

import { QtdUsuariosWidget }          from "@/features/usuarios/QtdUsuariosWidget";
import { QtdUsuariosPorSetorWidget }  from "@/features/usuarios/QtdUsuariosPorSetorWidget";
import { TopOperadoresWidget }        from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget }          from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget }         from "@/features/usuarios/RotatividadeWidget";
import { CumprimentoMetaSetorWidget } from "@/features/usuarios/CumprimentoMetaSetorWidget";
import { ProducaoMediaSetorWidget }   from "@/features/usuarios/ProducaoMediaSetorWidget";

export default function UsuariosGestor() {
  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <section className="p-8">
        <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
          Usuários
        </h1>
      </section>

      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-4">
            <QtdUsuariosWidget />
          </div>
          <div className="border rounded-xl p-4">
            <QtdUsuariosPorSetorWidget />
          </div>
          <div className="border rounded-xl p-4">
            <TopOperadoresWidget />
          </div>
        </div>
      </section>

      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6">
            <TempoSessaoWidget />
          </div>
          <div className="border rounded-xl p-4">
            <RotatividadeWidget />
          </div>
        </div>
      </section>

      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-4">
            <CumprimentoMetaSetorWidget />
          </div>
          <div className="border rounded-xl p-4">
            <ProducaoMediaSetorWidget />
          </div>
        </div>
      </section>
    </main>
  );
}