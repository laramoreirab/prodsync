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
  innerRadius = 45,
  outerRadius = 70,
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
          className="fill-black font-medium dark:fill-white"
          style={{ fontSize: "13px" }}
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
              innerRadius={innerRadius}
              outerRadius={outerRadius}
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
          <div className="pointer-events-none absolute left-[calc(50%+42px)] top-[calc(50%-54px)] flex items-center">
            <svg
              className="h-7 w-12 shrink-0 overflow-visible"
              viewBox="0 0 48 28"
              aria-hidden="true"
            >
              <path
                d="M 0 28 L 18 8 L 48 8"
                fill="none"
                stroke={singleOuterLabel.color}
                strokeWidth="1"
              />
            </svg>
            <span
              className="-ml-1 -translate-y-[2px] whitespace-nowrap text-[13px] font-medium leading-none text-black dark:text-white"
            >
              {singleOuterLabel.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
