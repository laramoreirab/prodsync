"use client";

import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { andonSectionsService } from "@services/andonService";

export function useAndonSections(scope = "factory", idSetor = null) {
  const fetchSections = useCallback(
    () => andonSectionsService.getSections(scope, idSetor),
    [scope, idSetor]
  );

  return useChartData(fetchSections);
}
