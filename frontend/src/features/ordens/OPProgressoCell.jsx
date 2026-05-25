"use client";

export function OPProgressoCell({ valor }) {
  const pct = Math.min(100, Math.max(0, Number(valor) || 0));

  return (
    <div className="inline-flex items-center gap-2 mx-auto">
      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-[#00357a] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 tabular-nums w-9 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}
