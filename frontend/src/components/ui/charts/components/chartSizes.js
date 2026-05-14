export const chartSizes = {
  compact: "h-[180px] w-full sm:h-[220px]",
  default: "h-[220px] w-full sm:h-[260px] md:h-[300px]",
  large: "h-[280px] w-full sm:h-[320px] md:h-[360px]",
  donutCompact: "h-[180px] w-full max-w-[260px] sm:h-[220px]",
  donutDefault: "h-[220px] w-full max-w-[320px] sm:h-[280px]",
};

export function getChartSize(size = "default", fallback) {
  return fallback ?? chartSizes[size] ?? chartSizes.default;
}
