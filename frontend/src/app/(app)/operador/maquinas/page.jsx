// frontend/src/app/(app)/operador/maquinas/page.jsx
"use client";

import { useState, useEffect } from "react";
import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { OEEMaquinaWidget } from "@/features/operador/OEEMaquinaWidget";

export default function MaquinaPage() {
  const [operadorId, setOperadorId] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_usuario) setOperadorId(payload.id_usuario);
    } catch {
      // token ausente ou malformado
    }
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">
      {/* OEE + Status */}
      <section className="bg-white border rounded-xl p-6">
        <OEEMaquinaWidget operadorId={operadorId} />
      </section>

      {/* Metas */}
      <section className="bg-white border rounded-xl p-6">
        <MetaProducaoWidget operadorId={operadorId} />
      </section>
    </div>
  );
}