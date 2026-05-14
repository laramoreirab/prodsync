export function DataEvento({ inicio, fim }) {
  if (!inicio) 
    return <span className="text-muted-foreground">-</span>;

  const dataInicio = new Date(inicio);
  const dia = dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const horaInicio = dataInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const horaFim = fim
    ? new Date(fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : "Ativo";

  return (
    <span className="whitespace-nowrap">
      {dia} ({horaInicio} - {horaFim})
    </span>
  );
}