"use client";

import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { andonSectionsService } from "@services/andonService";

export function useAndonSections(scope = "factory") {
  const fetchSections = useCallback(() => andonSectionsService.getSections(scope), [scope]);

  return useChartData(fetchSections);
}
