"use client";

import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { andonStatusService } from "@services/andonService";

export function useAndonStatus(scope = "factory") {
  const fetchStatus = useCallback(() => andonStatusService.getStatus(scope), [scope]);

  return useChartData(fetchStatus);
}
