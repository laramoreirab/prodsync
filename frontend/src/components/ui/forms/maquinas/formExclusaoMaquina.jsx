"use client";

import { useRef, useState } from 'react';
import { Trash2, TriangleAlert, Loader2 } from "lucide-react";
import {
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function FormExclusaoMaquina({ maquinaId, onExcluir, onExclusaoSucesso }) {
    const [carregando, setCarregando] = useState(false);
    const [excluido, setExcluido] = useState(false);
    const closeRef = useRef(null);
    const idCongelado = useState(() => maquinaId)[0];

    const fecharModal = () => {
        closeRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (carregando || excluido || idCongelado == null) return;

        setCarregando(true);

        try {
            await onExcluir(idCongelado);
            setExcluido(true);
            toast.success("Máquina excluída com sucesso!");
            onExclusaoSucesso?.();
            fecharModal();
        } catch (error) {
            console.error("Erro ao excluir máquina:", error);
            toast.error(error?.message || "Erro ao excluir a máquina.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="text-vermelho-vivido flex text-center justify-center px-4 py-2 rounded-md">
                    <Trash2 strokeWidth={2.5} className="mr-2" size={30} />
                    <DialogTitle className="text-3xl font-semibold">
                        Excluir Máquina
                    </DialogTitle>
                </div>
            </div>
            <Separator className="my-2" />
            <DialogClose asChild>
                <button ref={closeRef} type="button" className="hidden" aria-hidden="true" tabIndex={-1} />
            </DialogClose>

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <div className='w-full flex flex-col items-center justify-center gap-3'>
                    <TriangleAlert className='text-[#00357a] w-30 h-30' />
                    <h2 className='font-bold text-2xl text-center '>
                        Você tem certeza que deseja <br />excluir esta máquina?
                    </h2>
                    <p className='text-center font-medium text-[#7c7c81]'>
                        As informações serão excluídas <b>PERMANENTEMENTE</b> <br /> e não poderão ser restauradas após excluí-las!
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <button
                            type="button"
                            disabled={carregando}
                            className='border py-3 px-4 rounded-lg outline-none text-base font-bold text-[#7c7c81] hover:bg-gray-50 disabled:opacity-50'
                        >
                            Cancelar
                        </button>
                    </DialogClose>
                    <button
                        type="submit"
                        disabled={carregando || excluido}
                        className='py-3 px-5 bg-[var(--trash)] font-bold text-white rounded-lg outline-none text-base hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2'
                    >
                        {carregando && <Loader2 className="w-4 h-4 animate-spin" />}
                        Excluir
                    </button>
                </div>
            </form>
        </>
    )
}
