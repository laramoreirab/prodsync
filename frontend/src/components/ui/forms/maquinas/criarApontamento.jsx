import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, Plus, Calendar } from "lucide-react";
import {
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function FormCriarApontamento() {

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-4xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Criar Apontamento
                    </DialogTitle>
                </div>
            </div>
            <Separator className="my-2" />

            <form className="space-y-6 p-4">
                <div className="w-full">
                    <label className="block text-lg font-semibold mb-1">
                        Ordem de Produção
                    </label>
                    <div className="relative">
                        <select className="w-full h-11 border outline-none border-neutral-200 shadow-sm rounded-lg bg-white p-2.5 text-lg appearance-none pr-10 text-gray-300 font-medium">
                            <option value="" disabled selected>Selecione a Ordem</option>
                            <option value="1" className="text-black">Ordem #001</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Início da Produção
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full h-11 shadow-sm outline-none border border-neutral-200 rounded-lg bg-white p-2.5 text-lg pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden text-gray-300 font-medium"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Final da Produção
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full h-11 shadow-sm outline-none border border-neutral-200 rounded-lg bg-white p-2.5 text-lg pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden text-gray-300 font-medium"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Peças Produzidas
                        </label>
                        <input type="number" placeholder="Digite o total de peças" className="w-full h-11 shadow-sm outline-none border placeholder:font-medium placeholder-gray-300 border-neutral-200 rounded-lg bg-white p-2.5 text-lg" />
                    </div>
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Peças de Refugo
                        </label>
                        <input type="number" placeholder="Digite a quantidade de refugo" className="w-full h-11 border shadow-sm placeholder:font-medium  placeholder-gray-300 outline-none border-neutral-200 rounded-lg bg-white p-2.5 text-lg " />
                    </div>
                </div>

                <div className="w-full mb-4">
                    <label className="block text-lg font-semibold mb-1">
                        Observação
                    </label>
                    <textarea
                        placeholder="Escreva uma observação adicional..."
                        rows="3"
                        className="w-full border shadow-sm border-gray-200 font-medium rounded-md p-2.5 text-lg outline-none placeholder-gray-300 resize-none"
                    />
                </div>

                <div className="flex justify-center mt-8">
                    <button type="submit" className="bg-[#002866] text-xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg">
                        Criar
                    </button>
                </div>
            </form>
        </>
    )
};