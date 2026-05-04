"use client";

import { useState } from "react";
import { FadersHorizontalIcon } from "@phosphor-icons/react";
import { Minus, Plus, X } from "lucide-react";

export default function FilterDropdown({ filtersConfig, onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckbox = (filterId, option) => {
    setFilterValues((prev) => {
      const currentValues = prev[filterId] || [];

      if (currentValues.includes(option)) {
        return { ...prev, [filterId]: currentValues.filter((item) => item !== option) };
      }

      return { ...prev, [filterId]: [...currentValues, option] };
    });
  };

  const handleInputChange = (filterId, field, value) => {
    setFilterValues((prev) => {
      const currentValues = prev[filterId] || {};
      const newValues = { ...currentValues, [field]: value };

      if (!value) delete newValues[field];

      return { ...prev, [filterId]: newValues };
    });
  };

  const clearFilterGroup = (filterId) => {
    setFilterValues((prev) => {
      const newObj = { ...prev };
      delete newObj[filterId];
      return newObj;
    });
  };

  const generateTags = () => {
    const tags = [];

    Object.entries(filterValues).forEach(([filterId, value]) => {
      const config = filtersConfig.find((filter) => filter.id === filterId);
      if (!config) return;

      if (config.type === "checkbox" && Array.isArray(value)) {
        value.forEach((opt) => {
          tags.push({
            key: `${filterId}-${opt}`,
            label: opt,
            onRemove: () => handleCheckbox(filterId, opt),
          });
        });
      }

      if (config.type === "date-range" && value) {
        if (value.start) {
          tags.push({
            key: `${filterId}-start`,
            label: `${config.label}: Início ${value.start.replace("T", " ")}`,
            onRemove: () => handleInputChange(filterId, "start", ""),
          });
        }

        if (value.end) {
          tags.push({
            key: `${filterId}-end`,
            label: `${config.label}: Fim ${value.end.replace("T", " ")}`,
            onRemove: () => handleInputChange(filterId, "end", ""),
          });
        }
      }

      if (config.type === "number-range" && value) {
        if (value.min && value.max) {
          tags.push({
            key: `${filterId}-range`,
            label: `${config.label}: ${value.min} - ${value.max}`,
            onRemove: () => clearFilterGroup(filterId),
          });
        } else if (value.min) {
          tags.push({
            key: `${filterId}-min`,
            label: `${config.label} Min: ${value.min}`,
            onRemove: () => clearFilterGroup(filterId),
          });
        } else if (value.max) {
          tags.push({
            key: `${filterId}-max`,
            label: `${config.label} Max: ${value.max}`,
            onRemove: () => clearFilterGroup(filterId),
          });
        }
      }

      if (config.type === "time-max" && value?.max) {
        tags.push({
          key: `${filterId}-max`,
          label: `${config.label} até ${value.max}`,
          onRemove: () => clearFilterGroup(filterId),
        });
      }
    });

    return tags;
  };

  const handleApplyClick = () => {
    onApply?.(filterValues);
    setIsOpen(false);
  };

  const activeTags = generateTags();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-[#00357a] px-4 py-2 text-base font-semibold text-[#f8f8f8] shadow-sm transition-colors hover:bg-[#002866] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d95c6] dark:bg-[#a9b9dc] dark:text-[#0b1020] dark:hover:bg-[#c1cbe2]"
      >
        <FadersHorizontalIcon size={22} />
        Filtrar
      </button>

      {isOpen && (
        <div className="contrast-menu absolute right-0 top-12 z-50 w-80 rounded-lg border border-[#7d95c6] bg-[#f8f8f8] p-4 text-[#23304c] shadow-2xl">
          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
            {filtersConfig.map((filter) => (
              <div key={filter.id} className="rounded-md border border-[#c3c7c8] bg-white shadow-sm">
                <div
                  className="flex cursor-pointer items-center justify-between rounded-md p-3 transition-colors hover:bg-[#f8f8f8]"
                  onClick={() => toggleSection(filter.id)}
                >
                  <span className="font-semibold text-[#23304c]">{filter.label}</span>
                  {openSections[filter.id] ? (
                    <Minus size={18} className="text-[#636f87]" />
                  ) : (
                    <Plus size={18} className="text-[#636f87]" />
                  )}
                </div>

                {openSections[filter.id] && (
                  <div className="flex flex-col gap-3 px-3 pb-3">
                    {filter.type === "checkbox" &&
                      filter.options.map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(filterValues[filter.id] || []).includes(opt)}
                            onChange={() => handleCheckbox(filter.id, opt)}
                            className="size-4 cursor-pointer rounded border-[#c3c7c8] accent-[#00357a]"
                          />
                          <span className="text-sm text-[#23304c]">{opt}</span>
                        </label>
                      ))}

                    {filter.type === "date-range" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[#636f87]">Desde</label>
                          <input
                            type="datetime-local"
                            value={filterValues[filter.id]?.start || ""}
                            onChange={(event) => handleInputChange(filter.id, "start", event.target.value)}
                            className="rounded border border-[#c3c7c8] p-1 text-sm text-[#23304c] outline-none focus:border-[#00357a]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-[#636f87]">Até</label>
                          <input
                            type="datetime-local"
                            value={filterValues[filter.id]?.end || ""}
                            onChange={(event) => handleInputChange(filter.id, "end", event.target.value)}
                            className="rounded border border-[#c3c7c8] p-1 text-sm text-[#23304c] outline-none focus:border-[#00357a]"
                          />
                        </div>
                      </>
                    )}

                    {filter.type === "number-range" && (
                      <div className="flex gap-2">
                        <div className="flex w-full flex-col gap-1">
                          <label className="text-xs text-[#636f87]">Mínimo</label>
                          <input
                            type="number"
                            value={filterValues[filter.id]?.min || ""}
                            onChange={(event) => handleInputChange(filter.id, "min", event.target.value)}
                            className="w-full rounded border border-[#c3c7c8] p-1 text-sm text-[#23304c] outline-none focus:border-[#00357a]"
                          />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                          <label className="text-xs text-[#636f87]">Máximo</label>
                          <input
                            type="number"
                            value={filterValues[filter.id]?.max || ""}
                            onChange={(event) => handleInputChange(filter.id, "max", event.target.value)}
                            className="w-full rounded border border-[#c3c7c8] p-1 text-sm text-[#23304c] outline-none focus:border-[#00357a]"
                          />
                        </div>
                      </div>
                    )}

                    {filter.type === "time-max" && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-[#636f87]">Até</label>
                        <input
                          type="time"
                          value={filterValues[filter.id]?.max || ""}
                          onChange={(event) => handleInputChange(filter.id, "max", event.target.value)}
                          className="rounded border border-[#c3c7c8] p-1 text-sm text-[#23304c] outline-none focus:border-[#00357a]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#c3c7c8] pt-3">
              {activeTags.map((tag) => (
                <span key={tag.key} className="flex items-center gap-1 rounded-md bg-[#e2e2e2] px-2 py-1 text-xs font-medium text-[#23304c]">
                  {tag.label}
                  <X size={12} className="cursor-pointer hover:text-red-600" onClick={tag.onRemove} />
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleApplyClick}
            className="mt-4 min-h-10 w-full rounded-md bg-[#00357a] py-2 font-semibold text-[#f8f8f8] transition-colors hover:bg-[#002866] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d95c6] dark:bg-[#a9b9dc] dark:text-[#0b1020] dark:hover:bg-[#c1cbe2]"
          >
            Aplicar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
