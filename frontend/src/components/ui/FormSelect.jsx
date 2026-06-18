"use client";

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Componente de Select customizado para uso em formulários,
 * com estilização similar ao OrdenarDropdown.
 *
 * @param {Object} props
 * @param {Array} props.options - Array de objetos { value, label } ou { id, nome } etc.
 * @param {string} props.label - Rótulo do campo
 * @param {string} props.value - Valor selecionado
 * @param {function} props.onValueChange - Função chamada ao mudar o valor
 * @param {string} props.placeholder - Texto de placeholder
 * @param {string} props.className - Classes CSS para o container
 * @param {string} props.triggerClassName - Classes CSS para o botão do select
 * @param {boolean} props.disabled - Se o campo está desabilitado
 */
const FormSelect = ({
    options = [],
    label,
    value,
    onValueChange,
    placeholder = "Selecione...",
    className,
    triggerClassName,
    disabled = false,
    ...props
}) => {
    return (
        <div className={cn("flex flex-col gap-1 w-full", className)}>
            {label && (
                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">
                    {label}
                </label>
            )}

            <Select
                value={value ? String(value) : undefined}
                onValueChange={onValueChange}
                disabled={disabled}
                {...props}
            >
                <SelectTrigger className={cn(
                    "w-full h-10 min-h-10 cursor-pointer rounded-md bg-white border border-gray-200 py-2 px-4 text-sm font-semibold text-[#23304c] shadow-sm hover:bg-white dark:bg-[#f8f8f8] dark:text-[#23304c] outline-none focus:ring-0",
                    triggerClassName
                )}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent
                    position="popper"
                    align="start"
                    className="bg-white text-[#23304c] border border-gray-200"
                >
                    {options.map((option) => {
                        const val = option.value ?? option.id ?? option.id_setor ?? option.id_operador;
                        const labelText = option.label ?? option.nome ?? option.nome_setor;

                        return (
                            <SelectItem
                                key={val}
                                value={String(val)}
                                className="cursor-pointer rounded-sm px-3 py-2 text-sm font-medium text-[#23304c] focus:bg-[#eef4ff] focus:text-[#23304c] data-[state=checked]:bg-[#eef4ff] data-[state=checked]:text-[#23304c]"
                            >
                                {labelText}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FormSelect;
