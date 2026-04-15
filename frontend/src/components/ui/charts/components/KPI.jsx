export function CardNumero({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
} 

//Demonstrarção de KPI, um componente genérico  que mostra um numero