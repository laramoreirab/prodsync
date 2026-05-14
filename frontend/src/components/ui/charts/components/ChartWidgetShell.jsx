"use client";

export function ChartState({ type = "empty", children }) {
  const tone = type === "error" ? "text-red-500" : "text-muted-foreground";

  return (
    <div className={`flex min-h-[120px] w-full items-center justify-center text-xs font-medium ${tone}`}>
      {children}
    </div>
  );
}

export function ChartWidgetShell({
  title,
  description = "*Atualizado em tempo real",
  loading,
  error,
  empty,
  children,
  className = "",
  bodyClassName = "mt-2",
}) {
  if (loading) return <ChartState>Carregando...</ChartState>;
  if (error) return <ChartState type="error">Erro ao carregar dados.</ChartState>;
  if (empty) return <ChartState>Nenhum registro disponível.</ChartState>;

  return (
    <div className={`flex h-full min-h-0 w-full flex-col ${className}`}>
      {(title || description) && (
        <header className="min-w-0">
          {title && (
            <p className="text-sm font-semibold leading-tight text-black">
              {title}
            </p>
          )}
          {description && (
            <p className="mt-1 text-xs font-semibold leading-tight text-gray-400">
              {description}
            </p>
          )}
        </header>
      )}

      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
