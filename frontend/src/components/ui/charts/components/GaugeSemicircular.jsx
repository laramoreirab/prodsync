"use client";

export function GaugeSemicircular({ data, config, title, size = "default" }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0];
  const value = Number(data[0]?.value);
  const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
  const strokeColor = data[0]?.fill || config[dataKey]?.color || "#00357a";

  const sizes = {
    sm: {
      container: "h-[85px] w-[95px]",
      svgSize: 60,
      strokeWidth: 6,
      valueText: "text-sm font-semibold",
      labelText: "text-[10px]",
      labelOffset: "-mt-4",
    },
    default: {
      container: "h-[120px] w-[130px]",
      svgSize: 100,
      strokeWidth: 10,
      valueText: "text-xl font-bold",
      labelText: "text-xs",
      labelOffset: "-mt-7",
    },
    lg: {
      container: "h-[150px] w-[160px]",
      svgSize: 130,
      strokeWidth: 12,
      valueText: "text-3xl font-bold",
      labelText: "text-sm",
      labelOffset: "-mt-9",
    },
xlg: {
    container: "h-[190px] w-[200px]",
    svgSize: 190,
    strokeWidth: 18,
    valueText: "text-5xl font-extrabold",
    labelText: "text-base",
    labelOffset: "-mt-12",
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

      {/* Container de texto centralizado com margem negativa ajustada para subir o texto */}
      <div className={`flex flex-col items-center w-full text-center ${s.labelOffset}`}>
        {/* Alterado para text-black e tamanho maior */}
        <span className={`${s.valueText} font-bold tracking-tight text-black leading-none`}>
          {normalizedValue}%
        </span>
        {/* Alterado para text-black e tamanho maior */}
        <span className={`${s.labelText} uppercase tracking-wider text-black font-semibold mt-1`}>
          {config[dataKey]?.label || "Gauge"}
        </span>
      </div>
    </div>
  );
}