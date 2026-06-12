import { useState } from 'react';
import { Trash2, TriangleAlert, Loader2 } from "lucide-react";
import {
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { opCrudService } from '@/services/opCrudService';

export default function FormExclusaoOp({ opId, opIds = [], idMaquina, onExclusaoSucesso }) {
    const [carregando, setSincronizando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSincronizando(true);

        try {
            const ids = opId ? [opId] : opIds.filter(Boolean);
            if (ids.length === 0) {
                toast.error("Selecione pelo menos uma OP.");
                return;
            }

            await Promise.all(ids.map((id) => opCrudService.delete(id, idMaquina)));
            toast.success(ids.length === 1 ? "Ordem de produção excluída com sucesso!" : "Ordens de produção excluídas com sucesso!");
            if (onExclusaoSucesso) onExclusaoSucesso();
        } catch (error) {
            console.error("Erro ao excluir OP:", error);
            toast.error("Erro ao excluir ordem de produção.");
        } finally {
            setSincronizando(false);
        }
    };

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="text-vermelho-vivido flex text-center justify-center px-4 py-2 rounded-md">
                    <Trash2 strokeWidth={2.5} className="mr-2" size={30} />
                    <DialogTitle className="text-3xl font-semibold">
                        Excluir OP
                    </DialogTitle>
                </div>
            </div>
            <Separator className="my-2" />
            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <div className='w-full flex flex-col items-center justify-center gap-3'>
                    <TriangleAlert className='text-[#00357a] w-30 h-30' />
                    <h2 className='font-bold text-2xl text-center'>
                        Voce tem certeza que deseja <br />excluir {opId ? "esta OP" : "as OPs selecionadas"}?
                    </h2>
                    <p className='text-center font-medium text-[#7c7c81]'>
                        As informacoes serao excluidas <b>PERMANENTEMENTE</b> <br /> e nao poderao ser restauradas apos exclui-las!
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <button
                            type="button"
                            disabled={carregando}
                            className='cursor-pointer shadow-md border border-gray-200 py-3 px-4 rounded-lg outline-none text-base font-bold text-[#7c7c81] hover:bg-gray-50 disabled:opacity-50'
                        >
                            Cancelar
                        </button>
                    </DialogClose>
                    <button
                        type="submit"
                        disabled={carregando}
                        className='cursor-pointer shadow-md py-3 px-5 bg-(--trash) font-bold text-white rounded-lg outline-none text-base hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2'
                    >
                        {carregando && <Loader2 className="w-4 h-4 animate-spin" />}
                        Excluir
                    </button>
                </div>
            </form>
        </>
    );
}
