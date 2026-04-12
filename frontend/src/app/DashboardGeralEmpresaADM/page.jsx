// src/app/DashboardGeralEmpresaADM/page.jsx
import { ProducaoSetorWidget } from "@features/producao/ProducaoSetorWidget";

export default function DashboardPage() {
  return (
    <main className="p-8 grid grid-cols-2 gap-6">
      <ProducaoSetorWidget />
    </main>
  );
}