"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ============================================================
//  BAR COM LINHA DE REFERÊNCIA E DEGRADÊ
// ============================================================

const clampPercentage = (value) => Math.min(100, Math.max(0, value));

export function BarComLimiteDegrade({
  data,
  config,
  title,
  initialMinimum = 60,
  minimumStorageKey = "prodsync:charts:bar-com-limite-degrade:minimum",
}) {
  const chartRef = useRef(null);
  const [minimum, setMinimum] = useState(initialMinimum);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringLine, setIsHoveringLine] = useState(false);
  const [hasLoadedMinimum, setHasLoadedMinimum] = useState(false);

  const dataKey = Object.keys(config)[0];
  const getChartPosition = useCallback((event) => {
    const root = chartRef.current;
    const surface = root?.querySelector(".recharts-surface");
    const gridLines = Array.from(
      root?.querySelectorAll(".recharts-cartesian-grid-horizontal line") ?? [],
    );
    const yPoints = gridLines
      .map((line) => Number(line.getAttribute("y1")))
      .filter(Number.isFinite);

    if (!surface || yPoints.length < 2) return null;

    const rect = surface.getBoundingClientRect();
    const viewBox = surface.viewBox?.baseVal;
    const scaleY = viewBox?.height ? viewBox.height / rect.height : 1;
    const svgY = (event.clientY - rect.top) * scaleY + (viewBox?.y ?? 0);
    const top = Math.min(...yPoints);
    const bottom = Math.max(...yPoints);

    return { svgY, top, bottom };
  }, []);

  const minimumToY = useCallback((value, { top, bottom }) => {
    return top + ((100 - value) / 100) * (bottom - top);
  }, []);

  const updateMinimumFromPointer = useCallback((event) => {
    const position = getChartPosition(event);
    if (!position) return;

    const { svgY, top, bottom } = position;
    const rawValue = 100 - ((svgY - top) / (bottom - top)) * 100;
    setMinimum(Math.round(clampPercentage(rawValue)));
  }, [getChartPosition]);

  const handlePointerDown = useCallback((event) => {
    const position = getChartPosition(event);
    if (!position) return;

    const lineY = minimumToY(minimum, position);
    const hitSlop = 12;

    if (Math.abs(position.svgY - lineY) > hitSlop) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
    updateMinimumFromPointer(event);
  }, [getChartPosition, minimum, minimumToY, updateMinimumFromPointer]);

  const handlePointerMove = useCallback((event) => {
    if (isDragging) {
      updateMinimumFromPointer(event);
      return;
    }

    const position = getChartPosition(event);
    if (!position) {
      setIsHoveringLine(false);
      return;
    }

    const lineY = minimumToY(minimum, position);
    setIsHoveringLine(Math.abs(position.svgY - lineY) <= 12);
  }, [getChartPosition, isDragging, minimum, minimumToY, updateMinimumFromPointer]);

  const handlePointerUp = useCallback((event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!isDragging) setIsHoveringLine(false);
  }, [isDragging]);

  useEffect(() => {
    const savedMinimum = window.localStorage.getItem(minimumStorageKey);
    const parsedMinimum = Number(savedMinimum);

    if (Number.isFinite(parsedMinimum)) {
      setMinimum(Math.round(clampPercentage(parsedMinimum)));
    }

    setHasLoadedMinimum(true);
  }, [minimumStorageKey]);

  useEffect(() => {
    if (!hasLoadedMinimum) return;
    window.localStorage.setItem(minimumStorageKey, String(minimum));
  }, [hasLoadedMinimum, minimum, minimumStorageKey]);

  if (!data?.length) return null;

  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      <div
        ref={chartRef}
        className={
          isDragging
            ? "cursor-row-resize select-none"
            : isHoveringLine
              ? "cursor-pointer"
              : undefined
        }
        title="Arraste a linha para ajustar o mínimo"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <ChartContainer config={config} className="h-[220px] w-full pt-10">
          <BarChart data={data} margin={{ top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="setor"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              radius={[4, 4, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`var(--color-${dataKey})`}
                  fillOpacity={1 - index * 0.1}
                />
              ))}
            </Bar>
            <ReferenceLine
              y={minimum}
              stroke="red"
              strokeDasharray="4 4"
              label={{
                value: `Mínimo: ${minimum}%`,
                position: "insideTopRight",
                fontSize: 11,
                fill: "red",
              }}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
