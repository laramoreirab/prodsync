"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorOEEPanelService } from "@services/setorService";

export function useSetorOEEPanel(setorId) {
  return useChartData(setorOEEPanelService.getOEEPanel, setorId);
}
