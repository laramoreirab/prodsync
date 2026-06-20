export function EmptyChartState({ title, message = "Nenhum registro disponível.", className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <p className="text-sm font-semibold text-black">{title}</p>
      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
        Atualizado em tempo real
      </p>
      <p className="mt-6 text-xs text-muted-foreground">{message}</p>
    </div>
  );
}