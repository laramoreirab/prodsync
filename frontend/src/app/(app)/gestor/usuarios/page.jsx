"use client";

import { useState } from "react";
import Link from "next/link";

import { EyeIcon, Pencil, Trash2 } from "lucide-react";

import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { QtdUsuariosPorSetorWidget } from "@/features/usuarios/QtdUsuariosPorSetorWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { CumprimentoMetaSetorWidget } from "@/features/usuarios/CumprimentoMetaSetorWidget";
import { ProducaoMediaSetorWidget } from "@/features/usuarios/ProducaoMediaSetorWidget";

import TableListagens from "@/components/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const setorLabel = { "1": "Roscas", "2": "Brocas" };
const turnoLabel = { "1": "Manhã", "2": "Tarde", "3": "Noite" };

const colunasUsuarios = [
  { id: 'nome', key: 'nome', label: 'Nome', className: 'w-1/5' },
  { id: 'id', key: 'id', label: 'ID', className: 'w-40' },
  {
    id: 'oee_medio',
    key: 'oee_medio',
    label: 'OEE Médio',
    className: 'w-1/9 text-center',
    icone: (valor) => setorLabel[valor] || valor
  },
  { id: 'maquina', key: 'maquina', label: 'Máquina', className: 'pl-15'},
  {
    id: 'id_turno',
    key: 'id_turno',
    label: 'Turno',
    icone: (valor) => turnoLabel[valor] || valor
  },
];

export default function UsuariosGestor() {
  const dadosExibidos = [
    {
      id: "001",
      nome: "Carlos Eduardo Silva",
      oee_medio: "88%",
      maquina: "Injetora HAITIAN 120",
      id_turno: 1
    },
    {
      id: "002",
      nome: "Ana Beatriz Oliveira",
      oee_medio: "92%",
      maquina: "Torno CNC Nardini",
      id_turno: 2
    },
    {
      id: "003",
      nome: "Marcos Paulo Souza",
      oee_medio: "75%",
      maquina: "Prensa Hidráulica 50T",
      id_turno: 3
    },
    {
      id: "004",
      nome: "Ricardo Dos Santos",
      oee_medio: "81%",
      maquina: "Fresadora Universal",
      id_turno: 1
    },
    {
      id: "005",
      nome: "Luciana Maria Costa",
      oee_medio: "95%",
      maquina: "Solda Robotizada Kuka",
      id_turno: 2
    },
    {
      id: "006",
      nome: "Lucas Lima Ferreira",
      oee_medio: "70%",
      maquina: "Corte a Laser Fiber",
      id_turno: 3
    },
    {
      id: "007",
      nome: "Beatriz Arantes",
      oee_medio: "84%",
      maquina: "Dobradeira CNC",
      id_turno: 1
    },
    {
      id: "008",
      nome: "João Pedro Pereira",
      oee_medio: "89%",
      maquina: "Extrusora de Perfil",
      id_turno: 2
    },
    {
      id: "009",
      nome: "Fernando Dias Rosa",
      oee_medio: "77%",
      maquina: "Retífica Plana",
      id_turno: 3
    },
    {
      id: "010",
      nome: "Mariana Gomes",
      oee_medio: "91%",
      maquina: "Torno Automático A25",
      id_turno: 1
    },
    {
      id: "011",
      nome: "Roberto Alves",
      oee_medio: "83%",
      maquina: "Centro de Usinagem VMC",
      id_turno: 2
    },
    {
      id: "012",
      nome: "Sérgio Murilo",
      oee_medio: "98%",
      maquina: "Compressor de Ar Atlas",
      id_turno: 3
    },
    {
      id: "013",
      nome: "Felipe Ramos",
      oee_medio: "65%",
      maquina: "Ponte Rolante 10T",
      id_turno: 1
    },
    {
      id: "014",
      nome: "Patrícia Melo",
      oee_medio: "80%",
      maquina: "Forno de Têmpera",
      id_turno: 2
    },
    {
      id: "015",
      nome: "Gabriel Torres",
      oee_medio: "87%",
      maquina: "Envasadora Automática",
      id_turno: 3
    }
  ];

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="px-8">

        <div className="py-8">
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

        {/* Listagem de operadores */}
        <section>
          <div className="flex items-center py-8 gap-5">
            <h1 className="text-4xl w-[125] font-semibold">Listagem de Operadores</h1>
            <hr className="bg-black flex-1 h-1" />
          </div>

          {/* Tabela */}
          <div className="flex flex-col flex-1 items-center w-full mt-4">
            <TableListagens
              data={dadosExibidos}
              columns={colunasUsuarios}
              acoesDropdown={(user) => (
                <>
                  {/* link*/}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`usuarios/${user.id}`}>
                      <EyeIcon className="mr-2 h-10 w-10" />
                      Ver Detalhes
                    </Link>
                  </DropdownMenuItem>

                  {/* editar */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4 text-primary" />
                        Editar
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none max-h-screen overflow-y-auto">

                    </DialogContent>
                  </Dialog>

                  {/* excluir */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                        Excluir
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>

                    </DialogContent>
                  </Dialog>
                </>
              )}
            />
          </div>
        </section>

      </div>
    </main>
  );
}