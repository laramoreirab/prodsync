import { useState, useEffect } from 'react';
import { Loader2, Pencil,ChevronDown} from "lucide-react";
import {
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function FormJustificativaEvento() {

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Pencil className="mr-2 text-4xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Justificar Evento
                    </DialogTitle>
                </div>
            </div>

            <Separator className="my-2" />
            
            <form className="px-2 pb-8 pt-4 flex flex-col gap-6">
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold text-black'>Informações do Evento</h1>

                    <div className="flex flex-col w-full gap-2 mt-2 mb-6 cursor-not-allowed">
                        <div className="flex items-center">
                            <p className="text-xl font-semibold text-black mr-2">Evento:</p>
                            {/* precisa cria uma verificação por valor */}
                            <p className="rounded-xl px-3 text-[#b30000] font-semibold bg-red-100">Parada</p>
                        </div>
                        <div className="flex items-center">
                            <p className="text-xl font-semibold text-black mr-2">Data:</p>
                            <p className="text-xl font-medium text-[#7c7c81]"> 24/10/25 (14:30 - 16:30)</p>
                        </div>
                        <div className="flex items-center">
                            <p className="text-xl font-semibold text-black mr-2">Duração:</p>
                            <p className="text-xl font-medium text-[#7c7c81]">2h</p>
                        </div>
                    </div>

                    <h1 className='text-2xl font-bold text-black'>Justificativa</h1>

                    <div className="space-y-3">
                        <div>
                            <span className="block text-xl font-semibold mb-1 mt-2">Motivo Principal:</span>
                            <div className="relative">
                                <select
                                    className="w-full border shadow-sm border-gray-200 rounded-md p-2.5 pr-10 text-xl outline-none bg-white appearance-none font-medium"
                                    placeholder="Selecione o motivo..."
                                >
                                    <option value="" >Selecione o motivo</option>
                                    <option value="" >Queda de Energia</option>
                                    <option value="" >Limpeza</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <span className="block text-xl font-semibold mb-1 mt-2">Observação:</span>
                            <textarea
                                placeholder="Escreva uma observação adicional..."
                                rows="3"
                                className="w-full border shadow-sm border-gray-200 font-medium rounded-md p-2.5 text-xl outline-none placeholder-gray-300 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-[#002866] text-xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg">
                            Justificar
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}