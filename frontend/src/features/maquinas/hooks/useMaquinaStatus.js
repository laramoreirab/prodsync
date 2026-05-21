"use client";
import { useChartData } from "@/hooks/useChartData";
import { apiFetch } from "@/lib/api";

async function getMaquinaStatus(setorId) {
  const query = setorId ? `?setorId=${setorId}` : "";
  const response = await apiFetch(`/api/maquinas/dashboard/status-geral${query}`);
  return (response.dados || []).map((item) => ({
    name: String(item.name || item.status || "desconhecido").toLowerCase(),
    value: Number(item.value ?? item.total) || 0,
  }));
}

export function useMaquinaStatus(setorId) {
  return useChartData(getMaquinaStatus, setorId);
}
