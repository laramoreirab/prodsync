"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const RADIAN = Math.PI / 180;

// ============================================================
// DONUT CHART
// ============================================================

export function DonutChart({
  data,
  config,
  title,
  dataKey,
  nameKey,
  description,
  compact = false,
  valueFormatter,
  cy = "50%",
  showOuterLabels = !compact,
}) {
  if (!data?.length) return null;

  const formatValue = (value) =>
    valueFormatter ? valueFormatter(value) : value;

  const getLabel = (key) =>
    String(config?.[key]?.label ?? key).replace(/:\s*$/, "");

  const singleOuterLabel = showOuterLabels && data.length === 1
    ? (() => {
        const entry = data[0];
        const entryKey = entry[nameKey];

        return {
          color: config?.[entryKey]?.color ?? `var(--color-${entryKey})`,
          text: `${getLabel(entryKey)}: ${formatValue(entry[dataKey])}`,
        };
      })()
    : null;

  const renderOuterLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, payload, value } = props;
    const entryKey = payload?.[nameKey] ?? props?.[nameKey] ?? props?.name;
    const color = config?.[entryKey]?.color ?? `var(--color-${entryKey})`;
    const angle = -midAngle * RADIAN;
    const direction = Math.cos(angle) >= 0 ? 1 : -1;
    const startX = cx + (outerRadius + 2) * Math.cos(angle);
    const startY = cy + (outerRadius + 2) * Math.sin(angle);
    const elbowX = cx + (outerRadius + 16) * Math.cos(angle);
    const elbowY = cy + (outerRadius + 16) * Math.sin(angle);
    const endX = elbowX + direction * 18;
    const textX = endX + direction * 6;
    const textAnchor = direction > 0 ? "start" : "end";

    return (
      <g>
        <path
          d={`M ${startX} ${startY} L ${elbowX} ${elbowY} L ${endX} ${elbowY}`}
          fill="none"
          stroke={color}
          strokeWidth={1}
        />
        <text
          x={textX}
          y={elbowY}
          textAnchor={textAnchor}
          dominantBaseline="central"
          className="fill-current text-[11px] font-medium"
          style={{ fill: color }}
        >
          {`${getLabel(entryKey)}: ${formatValue(value)}`}
        </text>
      </g>
    );
  };

  return (

    <div className="flex flex-col w-full h-full">
      {/* ── Header ── */}
      {(title || description) && (
        <div className="shrink-0 text-left mb-2">
          {title && (
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {title}
            </h3>
          )}
          {title && (
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              Atualizado em tempo real
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      <div className="relative flex-1 min-h-0 w-full">
        <ChartContainer config={config} className="w-full h-full">
          <PieChart margin={{ top: 14, right: 80, bottom: 18, left: 80 }}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const label =
                      config?.[item?.payload?.[nameKey]]?.label ?? name;

                    return (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatValue(value)}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy={cy}
              innerRadius={45}
              outerRadius={70}
              labelLine={false}
              label={showOuterLabels && !singleOuterLabel ? renderOuterLabel : false}
            >
              {data.map((entry) => {
                const entryKey = entry[nameKey];
                const fillColor =
                  config?.[entryKey]?.color ?? `var(--color-${entryKey})`;
                return <Cell key={entryKey} fill={fillColor} />;
              })}
            </Pie>
          </PieChart>
        </ChartContainer>

        {singleOuterLabel && (
          <div className="pointer-events-none absolute left-[calc(50%+54px)] top-[calc(50%-48px)] flex items-center">
            <span
              className="absolute -left-5 top-3 h-px w-7 origin-left rotate-[-48deg]"
              style={{ backgroundColor: singleOuterLabel.color }}
            />
            <span
              className="h-px w-5 shrink-0"
              style={{ backgroundColor: singleOuterLabel.color }}
            />
            <span
              className="whitespace-nowrap text-[11px] font-medium"
              style={{ color: singleOuterLabel.color }}
            >
              {singleOuterLabel.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
