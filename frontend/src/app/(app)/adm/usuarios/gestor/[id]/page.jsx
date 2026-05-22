"use client"

import { use } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";

import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";
import { SetorProducaoMaquinaWidget } from "@/features/setores/SetorProducaoMaquinaWidget";
import { use, useEffect, useState } from "react";
import { usuariosCrudService } from "@/services/usuariosCrudService";
import Link from "next/link";
import { ChevronDown, Loader2 } from "lucide-react";

export default function GestorDetalhePage({ params }) {
  const { id } = use(params);
  const gestorId = Number(id);
  const [gestor, setGestor] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const setorId = gestor?.id_setor;

  useEffect(() => {
    setCarregando(true);
    usuariosCrudService
      .getById(gestorId)
      .then(setGestor)
      .catch((error) => console.error("Erro ao carregar gestor:", error))
      .finally(() => setCarregando(false));
  }, [gestorId]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900 mb-4" />
        <p className="text-lg text-gray-600 font-medium">Carregando gestor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">
        <Link className="flex items-center" href="/adm/usuarios">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Usuários</p>
        </Link>

        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-black">{gestor?.nome || `Gestor #${gestorId}`}</h1>
          <div className="flex flex-wrap gap-8 text-lg text-black">
            <p><span className="font-semibold">ID:</span> {gestor?.id_usuario || gestorId}</p>
            <p><span className="font-semibold">Email:</span> {gestor?.email || "-"}</p>
            <p><span className="font-semibold">Setor:</span> {gestor?.setor?.nome_setor || "-"}</p>
          </div>
          {setorId && (
            <Link href={`/adm/setores/${setorId}`} className="text-blue-900 font-medium hover:underline w-fit">
              Ver setor gerenciado
            </Link>
          )}
        </section>

        <h1 className="font-bold text-3xl mt-4">Indicadores do setor</h1>

        <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
          <OEEOperadorWidget operadorId={gestorId} />
        </section>

        {setorId ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <SetorProducaoSemanalWidget setorId={setorId} />
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <SetorTopOperadoresWidget setorId={setorId} />
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <SetorMaquinaStatusWidget setorId={setorId} />
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <SetorProducaoMaquinaWidget setorId={setorId} />
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <SetorMotivosParadaWidget setorId={setorId} />
              </div>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <SetorOEEEvolucaoWidget setorId={setorId} />
              </div>
            </section>
          </>
        ) : (
          <p className="text-gray-600">Este gestor ainda não está vinculado a um setor.</p>
        )}
      </div>
    </main>
  );
}
