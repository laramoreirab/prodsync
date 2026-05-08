"use client"

import { use } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";


export default function ProducaoGestorPage({ params }) {
  const { id } = use(params);
  const gestorId = Number(id);

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden"
      style={{
        backgroundImage: "url('/bg_app.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >


      <div className="w-full mt-8 pb-10 px-8 space-y-4">

        <Link className="flex items-center" href="/adm/usuarios">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Usuários </p>
        </Link>

        <section id="infos_op" className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex">
              <Image
                src="/estevao.svg"
                alt="Foto do usuário"
                className="rounded-xl"
                width={250}
                height={250}
              />

              <div className="flex flex-col ml-5">
                <h1 className="text-3xl font-bold text-black">Nome: Estevão Ferreira</h1>
                <div className="flex gap-10">

                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">ID:</p>
                      <p className="text-xl font-medium text-black">00000</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Email:</p>
                      <p className="text-xl font-medium text-black">estevaozinho@gmail.com</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">CPF:</p>
                      <p className="text-xl font-medium text-black">443.651.730-65</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Setor:</p>
                      <p className="text-xl font-medium text-black">Engrenagens</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Função:</p>
                      <p className="text-xl font-medium text-black">Gestor</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Turno:</p>
                      <p className="text-xl font-medium text-black">Noite</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoUsuario />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className=" w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoUsuario />
                </DialogContent>
              </Dialog>
            </div>
          </div>

        </section>

        {/* Gráficos */}
        <h1 className="font-bold text-3xl mt-8">Dados do Setor que Gerencia</h1>
        </div>
        </main>
    );      
}      