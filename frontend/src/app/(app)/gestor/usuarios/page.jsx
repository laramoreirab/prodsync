"use client";

import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { QtdUsuariosPorSetorWidget } from "@/features/usuarios/QtdUsuariosPorSetorWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { CumprimentoMetaSetorWidget } from "@/features/usuarios/CumprimentoMetaSetorWidget";
import { ProducaoMediaSetorWidget } from "@/features/usuarios/ProducaoMediaSetorWidget";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function UsuariosGestor() {
  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="p-8">
        <div className="flex justify-between items-center">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
            Usuários
          </h1>
          <Dialog>
            <DialogTrigger>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Plus className="mr-2" />
                Cadastrar
              </DialogTrigger>
            </DialogTrigger>

            <DialogContent>

            </DialogContent>
          </Dialog>
        </div>

      </div>

      <section>
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

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6">
            <TempoSessaoWidget />
          </div>
          <div className="border rounded-xl p-4">
            <RotatividadeWidget />
          </div>
        </div>
      </section>

      <section>
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