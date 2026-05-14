"use client";

import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { andonStatusService } from "@services/andonService";

export function useAndonStatus(scope = "factory", idSetor = null) {
  const fetchStatus = useCallback(
    () => andonStatusService.getStatus(scope, idSetor),
    [scope, idSetor]
  );

  return useChartData(fetchStatus);
}
