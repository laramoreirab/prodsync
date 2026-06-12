"use client";

import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const RADIAN = Math.PI / 180;

export function CustomPieChart({
  data,
  config,
  title,
  dataKey = "value",
  nameKey = "name",
  children,
  showLegend,
  showOuterLabels = Boolean(showLegend),
}) {
  if (!data?.length) return null;

  const getLabel = (key) =>
    String(config?.[key]?.label ?? key).replace(/:\s*$/, "");

  const singleOuterLabel = showOuterLabels && data.length === 1
    ? (() => {
        const entry = data[0];
        const entryKey = entry[nameKey];

        return {
          color: config?.[entryKey]?.color || entry.fill || "#7d95c6",
          text: `${getLabel(entryKey)}: ${entry[dataKey]}`,
        };
      })()
    : null;

  const formatValue = (value) =>
    typeof value === "number" ? value.toLocaleString("pt-BR") : value;

  const renderOuterLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, payload, value } = props;
    const entryKey = payload?.[nameKey] ?? props?.[nameKey] ?? props?.name;
    const color = config?.[entryKey]?.color || payload?.fill || "#7d95c6";
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
    <div className="relative flex flex-col items-center justify-center w-full">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      
      {/* Relative wrapper holding both the chart and the absolute center text */}
      <div className="relative flex h-[220px] w-full max-w-[460px] items-center justify-center pt-10">
        <ChartContainer config={config} className="h-full w-full">
          <RechartsPieChart margin={{ top: 14, right: 80, bottom: 18, left: 80 }}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const entryKey = item?.payload?.[nameKey] ?? item?.payload?.name ?? name;
                    const color = config?.[entryKey]?.color || item?.payload?.fill || "#7d95c6";

                    return (
                      <div className="flex items-center gap-1.5 text-foreground">
                        <span
                          className="h-2 w-2 rounded-[2px]"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium">
                          {getLabel(entryKey)}: {formatValue(value)}
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
              cy="50%"
              innerRadius={55} 
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
              className="stroke-background"
              labelLine={false}
              label={showOuterLabels && !singleOuterLabel ? renderOuterLabel : false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={config[entry[nameKey]]?.color || entry.fill || "#ccc"} 
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ChartContainer>

        {singleOuterLabel && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 460 220"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M 288 54 L 308 34 L 328 34"
              fill="none"
              stroke={singleOuterLabel.color}
              strokeWidth="1"
            />
            <text
              x="334"
              y="34"
              dominantBaseline="central"
              className="fill-current text-[11px] font-medium"
              style={{ fill: singleOuterLabel.color }}
            >
              {singleOuterLabel.text}
            </text>
          </svg>
        )}

        {children && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
