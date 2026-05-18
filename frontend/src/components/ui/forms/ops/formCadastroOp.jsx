import { useState } from 'react';
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ChevronDown, Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { opCrudService } from '@/services/opCrudService';
import { useSetores } from '@/hooks/useSetores';
import { useMaquinas } from '@/hooks/useMaquinas';

export default function FormCadastroOp({ onCadastroSucesso }) {

    // estados dos campos do form
    const [prioridade, setPrioridade] = useState('Crítica');     // backend: prioridade
    const [codigoLote, setCodigoLote] = useState('');            // backend: codigo_lote
    const [idSetor, setIdSetor] = useState('');                  // número — backend: id_setor
    const [idMaquina, setIdMaquina] = useState('');              // número — backend: id_maquina
    const [qtdPlanejada, setQtdPlanejada] = useState('');        // backend: qtd_planejada
    const [produto, setProduto] = useState('');  
    
    // backend: produto
    const [inicioData, setInicioData] = useState('');            // backend: data_inicio
    const [inicioHora, setInicioHora] = useState('');
    const [fimData, setFimData] = useState('');                  // backend: data_fim
    const [fimHora, setFimHora] = useState('');
    const [observacaoOp, setObservacaoOp] = useState('');        // backend: observacao_op

    const { setores } = useSetores();
    const { maquinas } = useMaquinas();

    const maquinasFiltradas = idSetor
        ? maquinas.filter((maquina) => String(maquina.id_setor) === String(idSetor))
        : maquinas;

    const handleSetorChange = (value) => {
        setIdSetor(value);
        setIdMaquina('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Monta o payload conforme o controller
        const payload = {
            prioridade,                                                                          // backend: prioridade
            codigo_lote: codigoLote,                                                             // backend: codigo_lote
            id_setor: Number(idSetor),                                                           // número — backend: id_setor
            id_maquina: Number(idMaquina),                                                       // número — backend: id_maquina
            qtd_planejada: qtdPlanejada,                                                         // backend: qtd_planejada
            produto,                                                                             // backend: produto
            data_inicio: inicioData && inicioHora ? `${inicioData}T${inicioHora}:00.000Z` : null, // backend: data_inicio
            data_fim: fimData && fimHora ? `${fimData}T${fimHora}:00.000Z` : null,               // backend: data_fim
            observacao_op: observacaoOp,                                                         // backend: observacao_op
        };

        try {
            await opCrudService.create(payload);
            toast.success("Ordem de Produção criada com sucesso!");
            // limpar formulário
            setPrioridade('Crítica');
            setCodigoLote('');
            setIdSetor('');
            setIdMaquina('');
            setQtdPlanejada('');
            setProduto('');
            setInicioData('');
            setInicioHora('');
            setFimData('');
            setFimHora('');
            setObservacaoOp('');
            if (onCadastroSucesso) onCadastroSucesso();
        } catch (error) {
            console.error("Erro ao criar OP:", error);
            toast.error("Erro ao criar Ordem de Produção.");
        }
    };

    return (
        <>
            <div className="flex items-center">
                <div className="title_modal flex items-center">
                    <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                        <Plus className="mr-2 text-3xl text-white" />
                        <DialogTitle className="text-3xl text-white">
                            Criar OP
                        </DialogTitle>
                    </div>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6 font-sans">

                {/* 1. infos gerais */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">1. Informações Gerais da OP</h3>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2">
                            <label className="block text-lg text-gray-700 font-medium mb-1">Código do Lote</label>
                            <input
                                type="text"
                                value={codigoLote}
                                onChange={(e) => setCodigoLote(e.target.value)}
                                className="border text-lg border-gray-100 shadow-md rounded-lg p-2 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label className="block text-lg text-gray-700 font-medium mb-1">Prioridade</label>
                            <div className="relative">
                                <select
                                    value={prioridade}
                                    onChange={(e) => setPrioridade(e.target.value)}
                                    className="w-full border text-lg shadow-md border-gray-100 rounded-lg p-2 appearance-none text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
                                >
                                    <option value="Crítica">Crítica</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Média">Média</option>
                                    <option value="Baixa">Baixa</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. roteiro de prod — id_setor e id_maquina */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">2. Roteiro de Produção</h3>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2">
                            <label className="block text-lg text-gray-700 font-medium mb-1">Setor</label>
                            <div className="relative">
                                <select
                                    value={idSetor}
                                    onChange={(e) => handleSetorChange(e.target.value)}
                                    className="w-full border text-lg shadow-md border-gray-100 rounded-lg p-2 appearance-none text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
                                >
                                    <option value="">Selecione...</option>
                                    {setores.map((setor) => (
                                        <option key={setor.id} value={setor.id}>
                                            {setor.nome_setor ?? setor.setor ?? setor.nome ?? `Setor ${setor.id}`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col w-1/2">
                            <label className="block text-lg text-gray-700 font-medium mb-1">Máquina</label>
                            <div className="relative">
                                <select
                                    value={idMaquina}
                                    onChange={(e) => setIdMaquina(e.target.value)}
                                    className="w-full border text-lg shadow-md border-gray-100 rounded-lg p-2 appearance-none text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
                                >
                                    <option value="">Selecione...</option>
                                    {maquinasFiltradas.map((maquina) => (
                                        <option key={maquina.id_maquina} value={maquina.id_maquina}>
                                            {maquina.nome ?? maquina.nome_maquina ?? `Máquina ${maquina.id_maquina}`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. metas e cronograma */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">3. Metas e Cronograma</h3>
                    <div className="flex gap-4 mb-2">
                        <div className="flex flex-col w-1/2">
                            <label className="block text-lg text-gray-700 font-medium mb-1">Quantidade Planejada</label>
                            <input
                                type="number"
                                value={qtdPlanejada}
                                onChange={(e) => setQtdPlanejada(e.target.value)}
                                className="border text-lg shadow-md border-gray-100 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label className="block text-lg text-gray-700 font-medium mb-1">Peça a ser produzida</label>
                            <input
                                type="text"
                                value={produto}
                                onChange={(e) => setProduto(e.target.value)}
                                className="border shadow-md text-lg border-gray-100 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* data_inicio */}
                        <div className="flex flex-col w-full">
                            <label className="block text-lg text-gray-700 font-medium mb-1 mt-2">Data Inicial</label>
                            <div className="flex gap-4">
                                <div className="relative w-[48%]">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />
                                    <input
                                        type="date"
                                        value={inicioData}
                                        onChange={(e) => setInicioData(e.target.value)}
                                        className="w-full border text-lg shadow-md border-gray-100 rounded-lg pl-9 p-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-400 font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                                <div className="relative w-[48%]">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />
                                    <input
                                        type="time"
                                        value={inicioHora}
                                        onChange={(e) => setInicioHora(e.target.value)}
                                        className="w-full border text-lg shadow-md border-gray-100 rounded-lg pl-9 p-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-400 font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* data_fim */}
                        <div className="flex flex-col w-full">
                            <label className="block text-lg text-gray-700 font-medium mb-1">Data Final</label>
                            <div className="flex gap-4">
                                <div className="relative w-[48%]">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />
                                    <input
                                        type="date"
                                        value={fimData}
                                        onChange={(e) => setFimData(e.target.value)}
                                        className="w-full text-lg border shadow-md border-gray-100 rounded-lg pl-9 p-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-400 font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                                <div className="relative w-[48%]">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />
                                    <input
                                        type="time"
                                        value={fimHora}
                                        onChange={(e) => setFimHora(e.target.value)}
                                        className="w-full border shadow-md text-lg border-gray-100 rounded-lg pl-9 p-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-400 font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. instruções — observacao_op */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">4. Instruções</h3>
                    <div className="flex flex-col">
                        <label className="block text-lg text-gray-700 font-medium mb-1">Observação (Opcional):</label>
                        <textarea
                            rows={3}
                            value={observacaoOp}
                            onChange={(e) => setObservacaoOp(e.target.value)}
                            placeholder="Refugo máximo tolerado: 2% da produção total."
                            className="border shadow-md border-gray-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder:text-gray-300 resize-none text-lg font-medium"
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg"
                    >
                        Criar
                    </button>
                </div>
            </form>
        </>
    );
}