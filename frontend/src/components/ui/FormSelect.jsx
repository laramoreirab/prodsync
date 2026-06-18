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
 * Componente de Select customizado para uso em formulários.
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
    valueKey, // Prop opcional para forçar uma chave de valor
    labelKey, // Prop opcional para forçar uma chave de rótulo
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
                value={(value !== undefined && value !== null) ? String(value) : undefined}
                onValueChange={onValueChange}
                disabled={disabled}
                {...props}
            >
                <SelectTrigger className={cn(
                    "w-full h-10 min-h-10 cursor-pointer rounded-md bg-white border border-neutral-200! py-3 px-4 text-sm font-semibold text-[#23304c] shadow-md hover:bg-white dark:bg-[#f8f8f8] dark:text-[#23304c] outline-none focus:ring-0",
                    triggerClassName
                )}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent
                    position="popper"
                    align="start"
                    className="bg-white text-[#23304c] p-2 border border-gray-700"
                >
                    {options.map((option, index) => {
                        const isObject = typeof option === 'object' && option !== null;

                        const val = isObject
                            ? ((valueKey && option[valueKey] !== undefined) ? option[valueKey] : (
                                (props.id && option[props.id] !== undefined) ? option[props.id] : (
                                    option.value ??
                                    option.id_usuario ??
                                    option.id_turno ??
                                    option.id_maquina ??
                                    option.id_ordem ??
                                    option.id_ordemProducao ??
                                    option.id_motivo_parada ??
                                    option.id_motivo ??
                                    option.id ??
                                    option.id_setor ??
                                    option.id_operador
                                )
                            ))
                            : option;

                        const labelText = isObject
                            ? ((labelKey && option[labelKey] !== undefined) ? option[labelKey] : (
                                option.label ??
                                option.nome_turno ??
                                option.nome_setor ??
                                option.nome_maquina ??
                                option.nome ??
                                option.descricao ??
                                option.codigo_lote ??
                                option.setor ??
                                `Opção ${val}`
                            ))
                            : option;

                        const finalValue = (val !== undefined && val !== null && val !== "") ? String(val) : `opt-${index}`;
                        const itemKey = `fs-item-${finalValue}-${index}`;

                        return (
                            <SelectItem
                                key={itemKey}
                                value={finalValue}
                                className="cursor-pointer rounded-sm px-3 py-2 text-sm font-medium text-black focus:bg-[#eef4ff] data-[state=checked]:bg-[#eef4ff] data-[state=checked]:text-[#23304c]"
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
