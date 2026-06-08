"use client";

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const OrdenarDropdown = ({ options = [], label, onSortChange }) => {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-cinza-escuro text-md font-medium dark:text-[#c3c7c8]">{label}</span>}

            <Select onValueChange={onSortChange}>
            <SelectTrigger className="min-w-41.5 h-10 min-h-10 cursor-pointer rounded-md bg-white py-2 px-4 text-sm font-semibold text-[#23304c] shadow-sm hover:bg-white dark:bg-[#f8f8f8] dark:text-[#23304c]">
                    <SelectValue placeholder="Selecione..." />
                </SelectTrigger>

                <SelectContent
                    position="popper"
                    align="start"
                    className=" bg-white text-[#23304c]"
                >
                    {options.map((option) => (
                        <SelectItem
                            key={option.value || option.id}
                            value={option.value || option.id}
                            className="cursor-pointer rounded-sm px-3 py-2 text-sm font-medium text-[#23304c] focus:bg-[#eef4ff] focus:text-[#23304c] data-[state=checked]:bg-[#eef4ff] data-[state=checked]:text-[#23304c]"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default OrdenarDropdown;
