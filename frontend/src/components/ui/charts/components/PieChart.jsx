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
  outerLabelLayout = "radial",
  startAngle = 90,
  endAngle = -270,
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

  const positiveData = data.filter((entry) => Number(entry[dataKey]) > 0);

  const outerLabelItems = showOuterLabels
    ? positiveData
        .map((entry, index) => {
          const entryKey = entry[nameKey];
          const side = index % 2 === 0 ? "left" : "right";
          const value = Number(entry[dataKey]);

          return {
            key: `${entryKey}-${index}`,
            color: config?.[entryKey]?.color || entry.fill || "#7d95c6",
            side,
            text: `${getLabel(entryKey)}: ${formatValue(value)}`,
          };
        })
    : [];

  const sideOuterLabelItems = outerLabelLayout === "sides" && data.length > 1
    ? outerLabelItems.map((item, index, items) => {
        const sameSideIndex = items
          .slice(0, index)
          .filter((previous) => previous.side === item.side).length;
        const sameSideTotal = items.filter((next) => next.side === item.side).length;
        const offset = (sameSideIndex - (sameSideTotal - 1) / 2) * 36;

        return { ...item, offset };
      })
    : [];

  const fixedElbowLabelItems = outerLabelLayout === "fixed-elbows" && data.length > 1
    ? (() => {
        const producao = outerLabelItems.find((item) => /produ/i.test(item.text));
        const finalizadas = outerLabelItems.find((item) => /finaliz|conclu/i.test(item.text));
        const primeiro = producao ?? outerLabelItems[0];
        const segundo = finalizadas ?? outerLabelItems.find((item) => item.key !== primeiro?.key);

        return [
          primeiro ? { ...primeiro, position: "top-left" } : null,
          segundo ? { ...segundo, position: "bottom-right" } : null,
        ].filter(Boolean);
      })()
    : [];

  const renderOuterLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, payload, value, viewBox } = props;
    if (!value) return null;

    const entryKey = payload?.[nameKey] ?? props?.[nameKey] ?? props?.name;
    const color = config?.[entryKey]?.color || payload?.fill || "#7d95c6";
    const width = viewBox?.width ?? 320;
    const height = viewBox?.height ?? 220;
    const angle = -midAngle * RADIAN;
    const direction = Math.cos(angle) >= 0 ? 1 : -1;
    const startX = cx + (outerRadius + 2) * Math.cos(angle);
    const startY = cy + (outerRadius + 2) * Math.sin(angle);
    const verticalDirection = Math.abs(Math.sin(angle)) < 0.08
      ? (direction > 0 ? 1 : -1)
      : Math.sign(Math.sin(angle));
    const baseElbowX = startX + direction * 18;
    const elbowYWithBend = startY + verticalDirection * 16;
    const elbowY = Math.min(
      Math.max(elbowYWithBend, 18),
      height - 18
    );
    const computedEndX = Math.min(
      Math.max(baseElbowX + direction * 18, 18),
      width - 18
    );
    const computedTextX = direction > 0
      ? Math.min(computedEndX + 6, width - 12)
      : Math.max(computedEndX - 6, 12);
    const textAnchor = direction > 0 ? "start" : "end";
    const labelName = getLabel(entryKey);
    const isSetupRightLabel = labelName.toLowerCase() === "setup" && direction > 0;
    const setupTextX = 360;
    const setupEndX = setupTextX - 6;
    const elbowX = isSetupRightLabel ? setupEndX - 24 : baseElbowX;
    const endX = isSetupRightLabel ? setupEndX : computedEndX;
    const textX = isSetupRightLabel ? setupTextX : computedTextX;
    const labelText = `${labelName}: ${formatValue(value)}`;

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
          {labelText}
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
          <RechartsPieChart
            className="overflow-visible"
            margin={{ top: 14, right: 80, bottom: 18, left: 80 }}
          >
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
              startAngle={startAngle}
              endAngle={endAngle}
              strokeWidth={0}
              className="stroke-background"
              labelLine={false}
              label={showOuterLabels && !singleOuterLabel && outerLabelLayout === "radial" ? renderOuterLabel : false}
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

        {fixedElbowLabelItems.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 460 220"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {fixedElbowLabelItems.map((item) => {
              const isTopLeft = item.position === "top-left";

              return (
                <g key={item.key}>
                  <path
                    d={isTopLeft
                      ? "M 146 48 L 174 48 L 188 72"
                      : "M 286 150 L 306 178 L 336 178"}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="1"
                  />
                  <text
                    x={isTopLeft ? 140 : 342}
                    y={isTopLeft ? 48 : 178}
                    textAnchor={isTopLeft ? "end" : "start"}
                    dominantBaseline="central"
                    className="fill-black font-medium dark:fill-white"
                    style={{ fontSize: "13px" }}
                  >
                    {item.text}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {sideOuterLabelItems.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-10 bottom-0">
            {sideOuterLabelItems.map((item) => {
              const isLeft = item.side === "left";

              return (
                <div
                  key={item.key}
                  className="absolute flex w-max items-center"
                  style={{
                    top: `calc(50% + ${item.offset}px)`,
                    ...(isLeft
                      ? { right: "calc(50% + 78px)" }
                      : { left: "calc(50% + 78px)" }),
                    transform: "translateY(-50%)",
                  }}
                >
                  {isLeft && (
                    <span
                      className="whitespace-nowrap text-right text-[13px] font-medium leading-none text-black dark:text-white"
                    >
                      {item.text}
                    </span>
                  )}
                  <svg
                    className={isLeft ? "ml-2 h-4 w-8 shrink-0" : "mr-2 h-4 w-8 shrink-0"}
                    viewBox="0 0 32 16"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 0 8 L 32 8"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="1"
                    />
                  </svg>
                  {!isLeft && (
                    <span
                      className="whitespace-nowrap text-left text-[13px] font-medium leading-none text-black dark:text-white"
                    >
                      {item.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {singleOuterLabel && (
          <div className="pointer-events-none absolute left-[calc(50%+48px)] top-[calc(50%-62px)] flex items-center">
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

        {children && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
