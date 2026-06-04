import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function FormCriarMotivo({ onCriadoSucesso }) {
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState("Programada");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitMotivo = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // pro form pai nn ser enviado junto

        if (!descricao.trim()) {
            toast.error("Informe uma descrição válida.");
            return;
        }

        setIsSubmitting(true);

        try {
            await apiFetch(`/api/eventos/motivos-parada`, {
                method: "POST",
                body: JSON.stringify({ descricao: descricao.trim(), tipo }),
            });

            toast.success("Motivo criado com sucesso!");
            setDescricao("");
            setTipo("Programada");
            //função do pai para atualizar a lista de motivos
            if (onCriadoSucesso) {
                onCriadoSucesso();
            }

        } catch (error) {
            toast.error(error.message || "Erro ao conectar com o servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                    <Plus strokeWidth={2} size={30} className="mr-2" />
                    <DialogTitle className="text-3xl font-semibold">
                        Criar Motivo de Evento
                    </DialogTitle>
                </div>
            </div>

            <Separator className="my-4 bg-gray-300" />

            <form onSubmit={handleSubmitMotivo} className="px-2 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold text-black dark:text-white">Descrição</label>
                    <input
                        required
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full outline-none shadow-md border border-gray-200 rounded-md p-3 text-xl text-gray-700 bg-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold text-black dark:text-white">Tipo</label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="w-full outline-none shadow-md border border-gray-200 rounded-md p-3 text-xl text-gray-700 bg-white"
                    >
                        <option value="Programada">Programada</option>
                        <option value="Nao_Programada">Não Programada</option>
                    </select>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#002866] hover:bg-[#001d4a] text-lg text-white font-semibold py-3 px-12 rounded-lg disabled:opacity-60 transition-all flex items-center justify-center min-w-37.5"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Criar"}
                    </button>
                </div>
            </form>
        </div>
    );
}