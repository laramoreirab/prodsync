import { useState, useEffect } from 'react';
import { Loader2, ReceiptText } from "lucide-react";
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/separator";
import { toast } from "sonner";
import { eventosCrudService } from '@/services/eventosCrudService';

const OPCOES_MAQUINA = [
    { label: "Injetora 1", value: 1 },
    { label: "Injetora 2", value: 2 },
    { label: "Torno CNC", value: 3 },
];

const OPCOES_MOTIVO = [
    { label: "Falta de Energia", value: 1 },
    { label: "Manutenção Preventiva", value: 2 },
    { label: "Manutenção Corretiva", value: 3 },
    { label: "Falta de Material", value: 4 },
    { label: "Outros", value: 5 },
];


export default function DetalhesEvento({ eventoId }) {
    // const [loading, setLoading] = useState(true);

    const [tipoEvento, setTipoEvento] = useState('');
    const [setoresSelecionados, setSetoresSelecionados] = useState([]);
    const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]);
    const [opsSelecionadas, setOpsSelecionadas] = useState([]);
    const [idMotivoPrincipal, setIdMotivoPrincipal] = useState('');
    const [observacao, setObservacao] = useState('');
    const [inicioData, setInicioData] = useState('');
    const [inicioHora, setInicioHora] = useState('');
    const [fimData, setFimData] = useState('');
    const [fimHora, setFimHora] = useState('');

    // — mesmo useEffect do formEdicao —
    useEffect(() => {
        const buscarDados = async () => {
            try {
                const dados = await eventosCrudService.getById(eventoId);
                setTipoEvento(dados.status_maquina || '');
                setSetoresSelecionados(dados.setor_afetado ? [dados.setor_afetado] : []);
                setMaquinasSelecionadas(dados.maquinas || []);
                setIdMotivoPrincipal(dados.id_motivo_parada || '');
                setObservacao(dados.observacao || '');
                if (dados.inicio) {
                    setInicioData(dados.inicio.split('T')[0]);
                    setInicioHora(dados.inicio.split('T')[1]?.slice(0, 5) || '');
                }
                if (dados.fim) {
                    setFimData(dados.fim.split('T')[0]);
                    setFimHora(dados.fim.split('T')[1]?.slice(0, 5) || '');
                }
            } catch (error) {
                toast.error("Erro ao carregar dados do evento.");
            }
        };

        if (eventoId) buscarDados();
    }, [eventoId]);

    // helpers de exibição
    const nomeMotivo = OPCOES_MOTIVO.find(m => m.value === Number(idMotivoPrincipal))?.label;
    const nomesMaquinas = maquinasSelecionadas
        .map(id => OPCOES_MAQUINA.find(o => o.value === id)?.label)
        .filter(Boolean);

    return (
        <>
            <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <ReceiptText className="mr-2 text-4xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Detalhes do Evento
                    </DialogTitle>
                </div>
            </div>

            <Separator className="my-2" />

            <div className="px-2 pb-8 pt-4 flex flex-col gap-6">
                {/* Informações do Evento */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-black">Detalhes do Evento</h1>

                    {/* Tipo */}
                    <div className="flex flex-col w-full gap-2 mt-2 mb-6 cursor-not-allowed">
                         <div className="flex items-center">
                            <p className="text-xl font-semibold text-black mr-2">Evento:</p>
                            
                        <Badge 
                        variant={tipoEvento === 'Parada' ? 'parada' : tipoEvento === 'Setup' ? 'setup' : 'outline'} 
                        className="px-4 py-1.5 text-xl"
                        >
                        </Badge>                        
                        </div>
                    </div>

                    {/* Setor */}
                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-medium text-gray-500">Setor Afetado</span>
                        {setoresSelecionados.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {setoresSelecionados.map(s => (
                                    <span key={s} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md text-[15px]">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-400 italic text-xl">Não informado</span>
                        )}
                    </div>

                    {/* Máquinas */}
                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-medium text-gray-500">Máquina(s) Afetada(s)</span>
                        {nomesMaquinas.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {nomesMaquinas.map(nome => (
                                    <span key={nome} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md text-[15px]">
                                        {nome}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-400 italic text-xl">Não informado</span>
                        )}
                    </div>

                    {/* OPs */}
                    {opsSelecionadas.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <span className="text-lg font-medium text-gray-500">OP(s) Afetada(s)</span>
                            <div className="flex flex-wrap gap-2">
                                {opsSelecionadas.map(op => (
                                    <span key={op} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md text-[15px]">
                                        {op}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Período */}
                    <div className="flex flex-col gap-2">
                        <span className="text-lg font-medium text-gray-500">Período do Evento</span>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-base text-gray-400">Início</span>
                                <span className="text-xl text-gray-800">
                                    {inicioData && inicioHora
                                        ? `${inicioData} às ${inicioHora}`
                                        : <span className="text-gray-400 italic">Não informado</span>
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-base text-gray-400">Fim</span>
                                <span className="text-xl text-gray-800">
                                    {fimData && fimHora
                                        ? `${fimData} às ${fimHora}`
                                        : <span className="text-gray-400 italic">Não informado</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Justificativa */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold text-black">Justificativa</h2>

                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-medium text-gray-500">Motivo Principal</span>
                        <span className="text-xl text-gray-800">
                            {nomeMotivo || <span className="text-gray-400 italic">Não justificado</span>}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-medium text-gray-500">Observação</span>
                        {observacao ? (
                            <p className="text-xl text-gray-800 bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-wrap">
                                {observacao}
                            </p>
                        ) : (
                            <span className="text-gray-400 italic text-xl">Sem observação</span>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}