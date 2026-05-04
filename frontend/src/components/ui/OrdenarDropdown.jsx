import React from 'react';

const OrdenarDropdown = ({ options = [], label, onSortChange }) => {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-cinza-escuro text-md font-medium dark:text-[#c3c7c8]">{label}</span>}

            <select
                defaultValue=""
                onChange={(e) => onSortChange(e.target.value)}
                className="cursor-pointer rounded-md border border-[#c3c7c8] bg-[#f8f8f8] px-2 py-2.5 text-sm text-[#23304c] outline-none transition-all focus:border-[#00357a] focus:ring-2 focus:ring-[#7d95c6]/30 dark:bg-[#f8f8f8] dark:text-[#23304c]"
            >
                <option value="" disabled>
                    Selecione...
                </option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default OrdenarDropdown;
