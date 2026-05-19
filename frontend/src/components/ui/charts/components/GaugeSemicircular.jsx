"use client";

export function GaugeSemicircular({ data, config, title, size = "default" }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0];
  const value = Number(data[0]?.value);
  const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
  const strokeColor = data[0]?.fill || config[dataKey]?.color || "#00357a";

  const sizes = {
    default: {
      container: "h-[180px] w-[180px]",
      svgSize: 180,
      strokeWidth: 20,
      valueText: "text-3xl",
      labelText: "text-sm",
      labelOffset: "-mt-2",
    },
    lg: {
      container: "h-[240px] w-[240px]",
      svgSize: 240,
      strokeWidth: 26,
      valueText: "text-5xl",
      labelText: "text-sm",
      labelOffset: "-mt-4",
    },
  };

  const s = sizes[size] ?? sizes.default;
  const padding = s.strokeWidth / 2 + 2;
  const radius = (s.svgSize - padding * 2) / 2;
  const centerX = s.svgSize / 2;
  const centerY = s.svgSize / 2;
  const leftX = centerX - radius;
  const rightX = centerX + radius;
  const arcPath = `M ${leftX} ${centerY} A ${radius} ${radius} 0 0 1 ${rightX} ${centerY}`;

  return (
    <div className={`flex flex-col items-center justify-center ${s.container}`}>
      <svg
        width={s.svgSize}
        height={s.svgSize / 2 + padding}
        viewBox={`0 0 ${s.svgSize} ${s.svgSize / 2 + padding}`}
        role={title ? "img" : undefined}
        aria-label={title}
        className="overflow-visible"
      >
        <path
          d={arcPath}
          fill="none"
          stroke="#7D95C6"
          strokeWidth={s.strokeWidth}
          strokeLinecap="round"
          pathLength="100"
        />
        <path
          d={arcPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={s.strokeWidth}
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${normalizedValue} 100`}
        />
      </svg>

      <div className={`flex flex-col items-center ${s.labelOffset}`}>
        <span className={`${s.valueText} font-bold leading-none`}>
          {normalizedValue}%
        </span>
        <span className={`${s.labelText} uppercase tracking-wider text-muted-foreground font-medium mt-1`}>
          {config[dataKey]?.label || "Gauge"}
        </span>
      </div>
    </div>
  );
}
