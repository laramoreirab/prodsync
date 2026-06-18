import { useEffect, useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { eventosCrudService } from "@/services/eventosCrudService";

const formatarDataHora = (valor) => {
  if (!valor) return null;

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return null;

  return {
    data: data.toLocaleDateString("pt-BR"),
    hora: data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const montarLista = (...valores) => {
  const itens = valores
    .flat()
    .filter((valor) => valor !== null && valor !== undefined && valor !== "");

  return itens.length > 0 ? itens : ["Nenhuma OP afetada"];
};

export default function DetalhesEvento({ eventoId }) {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(Boolean(eventoId));

  useEffect(() => {
    let ativo = true;

    async function buscarDados() {
      if (!eventoId) {
        setEvento(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const dados = await eventosCrudService.getById(eventoId);
        if (ativo) setEvento(dados);
      } catch (error) {
        toast.error("Erro ao carregar dados do evento.");
        if (ativo) setEvento(null);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    buscarDados();

    return () => {
      ativo = false;
    };
  }, [eventoId]);

  const tipoEvento = evento?.status_maquina || evento?.tipo || evento?.status || "Não especificado";
  const inicio = formatarDataHora(evento?.inicio);
  const fim = formatarDataHora(evento?.fim);
  const opsSelecionadas = montarLista(
    evento?.op_afetada,
    evento?.codigo_lote,
    evento?.ordem_producao?.codigo_lote,
    evento?.id_ordemProducao ? `OP #${evento.id_ordemProducao}` : null
  );
  const motivo = evento?.motivo || "não justificado";
  const observacao = evento?.observacao || "Sem observação";

  return (
    <>
      <div className="flex items-center">
        <div className="text-secondary flex items-center px-4 py-2 rounded-md">
          <ReceiptText strokeWidth={2.5} size={35} className="mr-2" />
          <DialogTitle className="text-3xl font-semibold">
            Detalhes do Evento
          </DialogTitle>
        </div>
      </div>

      <Separator className="my-2" />

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
        </div>
      ) : !evento ? (
        <div className="px-2 py-8 text-xl font-medium text-[#333333]">
          Evento nao encontrado.
        </div>
      ) : (
        <div className="flex flex-col cursor-text">
          <div className="flex flex-col w-full gap-4 px-2 pb-8 pt-4 cursor-text">
            <div className="flex items-center">
              <p className="text-xl font-semibold text-black mr-1">Evento:</p>
              <Badge
                variant={
                  tipoEvento === "Parada"
                    ? "parada"
                    : tipoEvento === "Setup"
                      ? "setup"
                      : "outline"
                }
                className="px-3 text-lg"
              >
                {tipoEvento}
              </Badge>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xl font-semibold text-black">
                OP(s) Afetada(s):
              </span>
              <ul className="flex flex-col">
                {opsSelecionadas.map((op, index) => (
                  <li key={`${op}-${index}`} className="text-[#333333] font-medium text-xl">
                    {op}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xl font-semibold text-black">
                Data Inicio:
              </span>
              <span className="text-xl text-[#333333]">
                {inicio ? `${inicio.data} as ${inicio.hora}` : "-"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xl font-semibold text-black">Data Fim:</span>
              <span className="text-xl text-[#333333]">
                {fim ? `${fim.data} as ${fim.hora}` : "Ativo"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xl font-semibold text-black">Motivo:</span>
              <span className="text-xl font-medium text-[#333333]">
                {motivo}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-black">
                Observacao:
              </span>
              <p className="text-[#333333] font-medium text-xl">
                {observacao}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
