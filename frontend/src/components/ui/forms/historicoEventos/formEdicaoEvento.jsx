import { useState, useEffect, useCallback } from 'react';
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, CheckCircle2, ChevronDown, X, Calendar, Clock, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { eventosCrudService } from '@/services/eventosCrudService'; // Importar o serviço
import { useSetores } from '@/hooks/useSetores';
import { useMaquinas } from '@/hooks/useMaquinas';
import { useOps } from '@/hooks/useOps';

export default function FormEdicaoEvento({ eventoId, onEdicaoSucesso }) {
    const [tipoEvento, setTipoEvento] = useState('Parada'); // status_maquina — backend: status_maquina

    const { setores } = useSetores();
    const { maquinas } = useMaquinas();
    const { ops } = useOps();

    const [setoresSelecionados, setSetoresSelecionados] = useState([]); // setor_afetado — backend: setor_afetado
    const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]); // maquinas (array de ids) — backend: maquinas
    const [opsSelecionadas, setOpsSelecionadas] = useState([]);
    const [idMotivoPrincipal, setIdMotivoPrincipal] = useState(""); // id_motivo_parada — backend: id_motivo_parada
    const [observacao, setObservacao] = useState(""); // observacao — backend: observacao
    const [opcoesMotivo, setOpcoesMotivo] = useState([]);

    const fetchMotivos = useCallback(async () => {
        try {
            const motivos = await eventosCrudService.getMotivos();
            setOpcoesMotivo(motivos.map(m => ({ label: m.descricao, value: m.id_motivo })));
        } catch (error) {
            console.error('Erro ao carregar motivos:', error);
        }
    }, []);
    // período do evento
    const [inicioData, setInicioData] = useState(""); // inicio — backend: inicio
    const [inicioHora, setInicioHora] = useState("");
    const [fimData, setFimData] = useState("");       // fim — backend: fim
    const [fimHora, setFimHora] = useState("");

    const [menusAbertos, setMenusAbertos] = useState({ setor: false, maquina: false, op: false });

    const toggleMenu = (menu) => {
        setMenusAbertos(prev => ({
            setor: menu === 'setor' ? !prev.setor : false,
            maquina: menu === 'maquina' ? !prev.maquina : false,
            op: menu === 'op' ? !prev.op : false,
        }));
    };

    const handleToggleSetor = (item) => {
        setSetoresSelecionados(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const handleToggleMaquina = (value) => {
        setMaquinasSelecionadas(prev =>
            prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
        );
    };

    const handleToggleOp = (item) => {
        setOpsSelecionadas(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    //justificar evento existente — campos: id_evento, id_motivo_parada, observacao
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            status_maquina: tipoEvento,
            setor_afetado: setoresSelecionados[0] ?? null,
            maquinas: maquinasSelecionadas,
            inicio: inicioData && inicioHora ? `${inicioData}T${inicioHora}:00.000` : null,
            fim: fimData && fimHora ? `${fimData}T${fimHora}:00.000` : null,
            id_motivo_parada: idMotivoPrincipal ? Number(idMotivoPrincipal) : null,
            observacao,
        };

        try {
            await eventosCrudService.update(eventoId, payload);
            toast.success("Evento atualizado com sucesso!");
            if (onEdicaoSucesso) onEdicaoSucesso();
        } catch (error) {
            console.error("Erro ao atualizar evento:", error);
            toast.error("Erro ao atualizar evento.");
        }
    };

    useEffect(() => {
        const buscarDados = async () => {
            try {
                        const dados = await eventosCrudService.getById(eventoId);
                setTipoEvento(dados.status_maquina || 'Parada');
                setSetoresSelecionados(dados.setor_afetado ? [dados.setor_afetado] : []);
                setMaquinasSelecionadas(dados.maquinas || []);
                setOpsSelecionadas(dados.ops_afetadas || []);
                setIdMotivoPrincipal(dados.id_motivo_parada || "");
                setObservacao(dados.observacao || "");
                if (dados.inicio) {
                    setInicioData(dados.inicio.split('T')[0]);
                    setInicioHora(dados.inicio.split('T')[1]?.slice(0, 5));
                }
                if (dados.fim) {
                    setFimData(dados.fim.split('T')[0]);
                    setFimHora(dados.fim.split('T')[1]?.slice(0, 5));
                }

                await fetchMotivos();
            } catch (error) {
                toast.error("Erro ao carregar dados do evento.");
            }
        };

        if (eventoId) buscarDados();
    }, [eventoId, fetchMotivos]);

    return (
        <>
            <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Pencil className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">Editar Evento</DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6">

                {/* tipo — status_maquina */}
                <div>
                    <label className="text-2xl font-semibold text-black">1. Tipo de Evento</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setTipoEvento('Parada')}
                            className={`flex items-center gap-2 px-4 mt-2 py-2 rounded-md text-xl font-medium transition-colors ${tipoEvento === 'Parada'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'
                                }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Parada
                        </button>

                        <button
                            type="button"
                            onClick={() => setTipoEvento('Setup')}
                            className={`flex items-center gap-2 px-4 mt-2 py-2 rounded-md text-xl font-medium transition-colors ${tipoEvento === 'Setup'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'
                                }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Setup
                        </button>
                    </div>
                </div>

                {/* setor — setor_afetado */}
                <div className="flex flex-col">
                    <label className="text-2xl font-semibold text-black">2. Setor Afetado</label>
                    <button
                        type="button"
                        onClick={() => toggleMenu('setor')}
                        className="w-full flex justify-between shadow-md items-center mt-2 border border-gray-200 rounded-md p-2 text-xl text-gray-400 bg-white"
                    >
                        <span>Selecione</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menusAbertos.setor ? 'rotate-180' : ''}`} />
                    </button>

                    {/* dropdown */}
                    {menusAbertos.setor && (
                        <div className="w-full mt-1 bg-gray-50/50 border border-gray-200 rounded-md p-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {setores.map((setor) => {
                                const setorId = Number(setor.id ?? setor.id_setor);
                                const setorLabel = setor.nome_setor || setor.nome || `Setor ${setorId}`;
                                return (
                                    <label key={setorId} className="flex items-center gap-2 text-xl text-gray-700 cursor-pointer hover:bg-gray-100 p-1.5 rounded">
                                        <input
                                            type="checkbox"
                                            checked={setoresSelecionados.includes(setorId)}
                                            onChange={() => handleToggleSetor(setorId)}
                                            className="rounded w-4 h-4 accent-blue-900"
                                        />
                                        {setorLabel}
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {/* tags */}
                    <div className="flex flex-wrap gap-2 mt-2 empty:mt-0">
                        {setoresSelecionados.map(id => {
                            const setor = setores.find((setor) => Number(setor.id ?? setor.id_setor) === id);
                            const label = setor?.nome_setor || setor?.nome || `Setor ${id}`;
                            return (
                                <span key={id} className="bg-[#F2F2F2] text-[#333333] mt-1.5 font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                    {label}
                                    <button type="button" onClick={() => handleToggleSetor(id)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* maquinas */}
                <div className="flex flex-col">
                    <label className="text-2xl font-semibold text-black">3. Máquina Afetada</label>
                    <button
                        type="button"
                        onClick={() => toggleMenu('maquina')}
                        className="w-full flex justify-between shadow-md items-center border mt-2 border-gray-200 rounded-md p-2 text-xl text-gray-400 bg-white"
                    >
                        <span>Selecione</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menusAbertos.maquina ? 'rotate-180' : ''}`} />
                    </button>

                    {/* dropdown */}
                    {menusAbertos.maquina && (
                        <div className="w-full mt-1 bg-gray-50/50 border border-gray-200 rounded-md p-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {maquinas.map((maquina) => {
                                const maquinaId = Number(maquina.id_maquina ?? maquina.id ?? maquina.id_maquina);
                                const maquinaLabel = maquina.nome || maquina.serie || maquina.codigo || `Máquina ${maquinaId}`;
                                return (
                                    <label key={maquinaId} className="flex items-center gap-2 text-xl text-gray-700 cursor-pointer hover:bg-gray-100 p-1.5 rounded">
                                        <input
                                            type="checkbox"
                                            checked={maquinasSelecionadas.includes(maquinaId)}
                                            onChange={() => handleToggleMaquina(maquinaId)}
                                            className="rounded accent-blue-900 w-4 h-4"
                                        />
                                        {maquinaLabel}
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {/* tags */}
                    <div className="flex flex-wrap gap-2 mt-2 empty:mt-0">
                        {maquinasSelecionadas.map(id => {
                            const maquina = maquinas.find((m) => Number(m.id_maquina ?? m.id) === id);
                            const label = maquina?.nome || maquina?.serie || maquina?.codigo || `Máquina ${id}`;
                            return (
                                <span key={id} className="bg-[#F2F2F2] text-[#333333] mt-1.5 font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                    {label}
                                    <button type="button" onClick={() => handleToggleMaquina(id)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* op afetada */}
                <div className="flex flex-col">
                    <label className="text-2xl font-semibold text-black">4. OP Afetada</label>
                    <button
                        type="button"
                        onClick={() => toggleMenu('op')}
                        className="w-full flex justify-between shadow-md items-center mt-2 border border-gray-200 rounded-md p-2 text-xl text-gray-400 bg-white"
                    >
                        <span>Selecione</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menusAbertos.op ? 'rotate-180' : ''}`} />
                    </button>

                    {/* dropdown */}
                    {menusAbertos.op && (
                        <div className="w-full mt-1 bg-gray-50/50 border border-gray-200 rounded-md p-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {ops.map((op) => (
                                <label key={op.id} className="flex items-center gap-2 text-xl text-gray-700 cursor-pointer hover:bg-gray-100 p-1.5 rounded">
                                    <input
                                        type="checkbox"
                                        checked={opsSelecionadas.includes(op.id)}
                                        onChange={() => handleToggleOp(op.id)}
                                        className="rounded accent-blue-900 w-4 h-4"
                                    />
                                    {op.nome || op.codigo || `OP ${op.id}`}
                                </label>
                            ))}
                        </div>
                    )}

                    {/* tags */}
                    <div className="flex flex-wrap gap-2 mt-2 empty:mt-0">
                        {opsSelecionadas.map(id => {
                            const op = ops.find((item) => item.id === id);
                            const label = op?.nome || op?.codigo || `OP ${id}`;
                            return (
                                <span key={id} className="bg-[#F2F2F2] text-[#333333] mt-1.5 font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                    {label}
                                    <button type="button" onClick={() => handleToggleOp(id)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* período — inicio e fim */}
                <div>
                    <label className="text-2xl font-semibold text-black">5. Período do Evento</label>

                    <div className="space-y-4">
                        {/* início */}
                        <div>
                            <span className="block text-xl text-gray-700 font-medium mb-1 mt-2">Início</span>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative flex shadow-md items-center border border-gray-200 rounded-md px-3 py-2 bg-white">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <input
                                        type="date"
                                        value={inicioData}
                                        onChange={(e) => setInicioData(e.target.value)}
                                        className="w-full text-xl text-gray-600 outline-none bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                                <div className="relative flex shadow-md items-center border border-gray-200 rounded-md px-3 py-2 bg-white">
                                    <Clock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <input
                                        type="time"
                                        value={inicioHora}
                                        onChange={(e) => setInicioHora(e.target.value)}
                                        className="w-full text-xl text-gray-600 outline-none bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* fim */}
                        <div>
                            <span className="block text-xl text-gray-700 font-medium mb-1 mt-2">Fim</span>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative shadow-md flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <input
                                        type="date"
                                        value={fimData}
                                        onChange={(e) => setFimData(e.target.value)}
                                        className="w-full text-xl text-gray-600 outline-none bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                                <div className="relative shadow-md flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white">
                                    <Clock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <input
                                        type="time"
                                        value={fimHora}
                                        onChange={(e) => setFimHora(e.target.value)}
                                        className="w-full text-xl text-gray-600 outline-none bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* justificativa — id_motivo_parada e observacao */}
                <div>
                    <label className="text-2xl font-semibold text-black">6. Justificativa</label>

                    <div className="space-y-3">
                        <div>
                            <span className="block text-xl text-gray-700 font-medium mb-1 mt-2">Motivo Principal:</span>
                            <div className="relative">
                                <select
                                    value={idMotivoPrincipal}
                                    onChange={(e) => setIdMotivoPrincipal(e.target.value)}
                                    className="w-full border shadow-md border-gray-200 rounded-md p-2.5 pr-10 text-xl outline-none bg-white appearance-none text-gray-600"
                                >
                                    <option value="" disabled>Selecione o motivo</option>
                                    {opcoesMotivo.map((motivo) => (
                                        // id_motivo_parada — número — backend: id_motivo_parada
                                        <option key={motivo.value} value={motivo.value}>{motivo.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <span className="block text-xl text-gray-700 font-medium mb-1 mt-2">Observação (Opcional):</span>
                            <textarea
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                placeholder="Escreva uma observação adicional..."
                                rows="3"
                                className="w-full border shadow-md border-gray-200 rounded-md p-2.5 text-xl outline-none placeholder-gray-300 resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-[#002866] text-xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg">
                        Editar
                    </button>
                </div>
            </form>
        </>
    );
}
