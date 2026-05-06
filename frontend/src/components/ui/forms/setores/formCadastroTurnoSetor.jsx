import { useState, useRef, useEffect } from 'react';
import { DialogTitle } from "@/components/ui/dialog";
import { Plus, ChevronDown, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

const DIAS_DA_SEMANA = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export default function FormCadastroTurnoSetor() {
    //estados que controla a abertura do dropdown e os dias selecionados
    const [isOpen, setIsOpen] = useState(false);
    const [diasSelecionados, setDiasSelecionados] = useState([]);

    //referência para detectar cliques fora do componente e fechar o menu
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //função para adicionar ou remover um dia da lista
    const toggleDia = (dia) => {
        setDiasSelecionados((prev) =>
            prev.includes(dia)
                ? prev.filter((d) => d !== dia)
                : [...prev, dia]
        );
    };

    //função para o botão de 'X' na tag
    const removerDia = (dia) => {
        setDiasSelecionados((prev) => prev.filter((d) => d !== dia));
    };

    return (
        <>
            <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">Criar Turno</DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />

            <form className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="nome" className="text-xl font-medium text-[#545454]">Nome</label>
                    <input type="text" id="nome" name="nome" className="w-full border border-[#e0e0e0] rounded-md px-3 py-2.5 text-xl text-[#333] outline-none transition-colors duration-200 focus:border-[#a0a0a0]" required />
                </div>

                {/*dias de operação */}
                <div className="flex flex-col gap-1.5" ref={dropdownRef}>
                    <label className="text-xl font-medium text-[#545454]">Dias de Operação</label>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full bg-white border border-[#e0e0e0] rounded-md px-3 py-2.5 text-xl text-[#545454] outline-none flex justify-between items-center transition-colors duration-200 focus:border-[#a0a0a0]"
                        >
                            <span>Selecione...</span>
                            <ChevronDown className="w-5 h-5 text-[#d0d0d0]" />
                        </button>

                        {/*dropdown com checkboxes */}
                        {isOpen && (
                            <div className="w-full mt-1 bg-white border border-[#e0e0e0] rounded-md max-h-48 overflow-y-auto py-1">
                                {DIAS_DA_SEMANA.map((dia) => (
                                    <label key={dia} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xl text-[#333]">
                                        <input
                                            type="checkbox"
                                            value={dia}
                                            checked={diasSelecionados.includes(dia)}
                                            onChange={() => toggleDia(dia)}
                                            className="w-4 h-4 accent-blue-900 text-blue-900 rounded border-gray-300 focus:ring-blue-900"
                                        />
                                        {dia}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/*container de tags */}
                    {diasSelecionados.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {diasSelecionados.map((dia) => (
                                <div key={dia} className="bg-[#f2f2f2] text-[#333] px-3 py-1.5 rounded-md text-[14px] flex items-center gap-2 font-medium">
                                    {dia}
                                    <button
                                        type="button"
                                        onClick={() => removerDia(dia)}
                                        className="text-[#888] hover:text-[#333] transition-colors focus:outline-none"
                                        aria-label={`Remover ${dia}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label htmlFor="inicio" className="text-xl font-medium text-[#545454]">Horário de Início</label>
                        <div className="relative flex items-center">
                            <input type="time" id="inicio" name="horario_inicio" className="w-full border border-[#e0e0e0] rounded-md py-2.5 pr-3 pl-2 text-xl font-medium outline-none transition-colors duration-200 focus:border-[#a0a0a0] placeholder-[#c4c4c4]" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <label htmlFor="fim" className="text-xl font-medium text-[#545454]">Horário de Fim</label>
                        <div className="relative flex items-center">
                            <input type="time" id="fim" name="horario_fim" className="w-full border border-[#e0e0e0] rounded-md py-2.5 pr-3 pl-2 text-xl font-medium outline-none transition-colors duration-200 focus:border-[#a0a0a0] placeholder-[#c4c4c4]" required />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-[#002866] text-2xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg ">
                        Criar
                    </button>
                </div>

            </form>
        </>
    );
}