"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Search, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { obterPerfil } from "@/services/authService";
import { maquinaCrudService } from "@/services/maquinaCrudService";
import { FadeUpItem, PageHeader } from "@/components/AnimatedComponents";

const statusConfig = {
  Produzindo: "bg-green-500/15 text-green-600",
  Setup: "bg-amber-100 text-amber-900",
  Parada: "bg-red-100 text-red-700",
};

const resolverImagemMaquina = (imagem) => {
  if (!imagem) return "/demo_maq.png";
  if (imagem.startsWith("http")) return imagem;

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;

  const nomeArquivo = imagem.replaceAll("\\", "/").split("/").pop();
  return `${apiUrl}/uploads/imagens/${nomeArquivo}`;
};

export default function MaquinasOperadorPage() {
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const perfil = await obterPerfil();
        const idOperador = perfil?.id_usuario ?? perfil?.id;
        if (!idOperador) {
          setErro("Perfil do operador não encontrado");
          return;
        }

        const respMaquina = await apiFetch(`/api/maquinas/obter-maquina-operador/${idOperador}`);
        const idMaquina = respMaquina?.id_maquina ?? respMaquina?.dados?.id_maquina;

        if (!idMaquina) {
          setErro("Nenhuma máquina vinculada ao seu perfil");
          return;
        }

        const detalhe = await maquinaCrudService.getById(idMaquina);
        setMaquina(detalhe?.dados || detalhe);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar máquina");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
      </main>
    );
  }

  if (erro || !maquina) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed flex flex-col items-center justify-center p-8">
        <Search className="w-12 h-12 mb-4 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-600">{erro || "Máquina não encontrada"}</h2>
      </main>
    );
  }

  const status = maquina.status_atual || maquina.status || "-";
  const statusClass = statusConfig[status] || "bg-gray-100 text-gray-700";

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-6">
        <PageHeader title="Minha Máquina" className="mt-0 mb-0" />

        <FadeUpItem>
        <Link
          href={`/operador/maquinas/${maquina.id_maquina}`}
          className="block bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-6">
            <Image
              src={resolverImagemMaquina(maquina.imagem)}
              alt={maquina.nome}
              width={120}
              height={120}
              className="rounded-xl object-cover"
            />
            <div className="flex flex-col gap-3 flex-1">
              <h2 className="text-2xl font-bold text-[#212e4b]">{maquina.nome}</h2>
              <p className="text-lg text-gray-600">ID: {String(maquina.id_maquina).padStart(5, "0")}</p>
              <p className="text-lg text-gray-600">Série: {maquina.serie || "-"}</p>
              <Badge variant="outline" className={`w-fit rounded-xl px-3 font-semibold border-none ${statusClass}`}>
                {status}
              </Badge>
            </div>
            <ChevronDown className="w-8 h-8 text-gray-400 transform -rotate-90" />
          </div>
        </Link>
        </FadeUpItem>
      </div>
    </main>
  );
}
