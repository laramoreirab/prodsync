//como funciona para deixar os parametros dentro do filtrar:
//1. definir uma constante dentro da pagina desejada para configurar os filtros, como uma
//   array fora e antes do "export default function" 
//2. oq colocar dentro dessa constante? definir as infos de cada objeto (bloco de seleção) --> {id: "comoVaiPuxarEssaInfoParaFiltrar",
//   label: "nomeDoParametro", type:"tipoDeSeleção"} 
// obs: se type = checkbox, tem que adicionar mais um par de chaves (options: ["opçao1", "opcao2", "opcao3"]) 
// obs 2: blocos como turnos e setores, vai puxar do back --> essa parte é com eles para enviar essas informações pra gente
//sobre o type de cada bloco de seleção:
// se oq tiver dentro for checkbox, type="checkbox"; se for intervalo de data e horario, type = "date-range"
// se for a duração máxima de tempo: "time-max"; se for um intervalo de valor minimo e maximo, type = "number-range"
//ex na prática:
//   const maquinasFilters = [
//    { id: "status", label: "Status", type: "checkbox", options: ["Parada", "Produzindo", "Setup"] },
//    { id: "data", label: "Data", type: "date-range" },
//    { id: "duracao", label: "Duração", type: "time-max" },
//    { id: "produzido", label: "Produzido", type: "number-range" },
//    { id: "refugo", label: "Refugo", type: "number-range" },
// ];
//para utilizar: criar constante com tudo dentro e dentro do export, puxar o <FilterDropdown filtersConfig={nomeDaConstante} onApply={suaFuncaoDeFiltrar} /> 

"use client";

import { useState } from "react";
import { FadersHorizontalIcon } from "@phosphor-icons/react";
import { Plus, Minus, X } from "lucide-react";

// recebendo a propriedade onApply
export default function FilterDropdown({ filtersConfig, onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  
  //objeto que guarda os valores por ID do filtro
  const [filterValues, setFilterValues] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  //atualiza checkboxes
  const handleCheckbox = (filterId, option) => {
    setFilterValues((prev) => {
      const currentValues = prev[filterId] || [];
      if (currentValues.includes(option)) {
        return { ...prev, [filterId]: currentValues.filter((item) => item !== option) };
      }
      return { ...prev, [filterId]: [...currentValues, option] };
    });
  };

  //atualiza inputs de range(min/max, comeco/fim)
  const handleInputChange = (filterId, field, value) => {
    setFilterValues((prev) => {
      const currentValues = prev[filterId] || {};
      const newValues = { ...currentValues, [field]: value };
      
      // se limpou o input, removemos a chave
      if (!value) delete newValues[field]; 
      
      return { ...prev, [filterId]: newValues };
    });
  };

  //remove filtro inteiro (quando o X das tags de range é apertado)
  const clearFilterGroup = (filterId) => {
    setFilterValues((prev) => {
      const newObj = { ...prev };
      delete newObj[filterId];
      return newObj;
    });
  };

  //função que lê o estado e gera a lista visual das tags
  const generateTags = () => {
    let tags = [];

    Object.entries(filterValues).forEach(([filterId, value]) => {
      const config = filtersConfig.find((f) => f.id === filterId);
      if (!config) return;

      //tags para checkbox
      if (config.type === "checkbox" && Array.isArray(value)) {
        value.forEach((opt) => {
          tags.push({
            key: `${filterId}-${opt}`,
            label: opt,
            onRemove: () => handleCheckbox(filterId, opt),
          });
        });
      }

      //tags para datas(desde/até)
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

      //tags para range de números
      if (config.type === "number-range" && value) {
        if (value.min && value.max) {
          tags.push({
            key: `${filterId}-range`,
            label: `${config.label}: ${value.min} - ${value.max}`,
            onRemove: () => clearFilterGroup(filterId),
          });
        } else if (value.min) {
          tags.push({ key: `${filterId}-min`, label: `${config.label} Min: ${value.min}`, onRemove: () => clearFilterGroup(filterId) });
        } else if (value.max) {
          tags.push({ key: `${filterId}-max`, label: `${config.label} Max: ${value.max}`, onRemove: () => clearFilterGroup(filterId) });
        }
      }

      //tags para tempo único(até) --> duracão
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

  //função que envia os dados para a página
  const handleApplyClick = () => {
    if (onApply) {
      onApply(filterValues);
    }
    setIsOpen(false);
  };

  const activeTags = generateTags();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-secondary-foreground px-3 py-1.5 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer hover:opacity-90 transition-opacity"
      >
        <FadersHorizontalIcon className="mr-2" size={24} />
        Filtrar
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-100 shadow-2xl rounded-lg p-4 border border-gray-200 z-50">
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
            
            {/* renderizador dinamico dos blocos */}
            {filtersConfig.map((filter) => (
              <div key={filter.id} className="bg-white border border-gray-200 rounded-md shadow-sm">
                
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
                  onClick={() => toggleSection(filter.id)}
                >
                  <span className="font-semibold text-gray-800">{filter.label}</span>
                  {openSections[filter.id] ? <Minus size={18} className="text-gray-600" /> : <Plus size={18} className="text-gray-600" />}
                </div>

                {openSections[filter.id] && (
                  <div className="px-3 pb-3 flex flex-col gap-3">
                    
                    {/*caso 1: checkbox */}
                    {filter.type === "checkbox" && filter.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(filterValues[filter.id] || []).includes(opt)}
                          onChange={() => handleCheckbox(filter.id, opt)}
                          className="w-4 h-4 rounded border-gray-300 text-secondary-foreground cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}

                    {/* caso 2: date range */}
                    {filter.type === "date-range" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-500">Desde</label>
                          <input 
                            type="datetime-local" 
                            value={filterValues[filter.id]?.start || ""}
                            onChange={(e) => handleInputChange(filter.id, "start", e.target.value)}
                            className="text-sm border border-gray-200 rounded p-1 outline-none focus:border-secondary-foreground" 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-500">Até</label>
                          <input 
                            type="datetime-local" 
                            value={filterValues[filter.id]?.end || ""}
                            onChange={(e) => handleInputChange(filter.id, "end", e.target.value)}
                            className="text-sm border border-gray-200 rounded p-1 outline-none focus:border-secondary-foreground" 
                          />
                        </div>
                      </>
                    )}

                    {/* caso 3: number range */}
                    {filter.type === "number-range" && (
                      <div className="flex gap-2">
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-xs text-gray-500">Mínimo</label>
                          <input 
                            type="number"
                            value={filterValues[filter.id]?.min || ""}
                            onChange={(e) => handleInputChange(filter.id, "min", e.target.value)}
                            className="text-sm border border-gray-200 rounded p-1 outline-none w-full" 
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-xs text-gray-500">Máximo</label>
                          <input 
                            type="number"
                            value={filterValues[filter.id]?.max || ""}
                            onChange={(e) => handleInputChange(filter.id, "max", e.target.value)}
                            className="text-sm border border-gray-200 rounded p-1 outline-none w-full" 
                          />
                        </div>
                      </div>
                    )}

                    {/* caso 4: time max (duracao) */}
                    {filter.type === "time-max" && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Até</label>
                        <input 
                          type="time"
                          value={filterValues[filter.id]?.max || ""}
                          onChange={(e) => handleInputChange(filter.id, "max", e.target.value)}
                          className="text-sm border border-gray-200 rounded p-1 outline-none" 
                        />
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>

          {/*área das tags */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-300">
              {activeTags.map((tag) => (
                <span key={tag.key} className="flex items-center gap-1 bg-[#e2e2e2] text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
                  {tag.label} <X size={12} className="cursor-pointer hover:text-red-500" onClick={tag.onRemove} />
                </span>
              ))}
            </div>
          )}

          {/*disparando a função handleApplyClick */}
          <button 
            onClick={handleApplyClick}
            className="w-full mt-4 bg-secondary-foreground text-white py-2 rounded-md font-semibold hover:opacity-90 transition-opacity"
          >
            Aplicar Filtros
          </button>
        </div>
      )}
    </div>
  );
}