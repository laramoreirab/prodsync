import { Clock4 } from "lucide-react";

export function DataUltimaParada({ ultimaParada }) {
    const horaUltimaParada = ultimaParada
        ? new Date(ultimaParada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : "Ativo";

    return (
        <span className="flex items-center gap-1.5 whitespace-nowrap tabular-nums">
            <Clock4 className="h-4 w-4 text-muted-foreground shrink-0" />
            {horaUltimaParada}
        </span>
    );
}