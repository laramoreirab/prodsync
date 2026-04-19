import React from 'react';

const OrdenarDropdown = ({ options = [], label, onSortChange }) => {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-cinza-escuro text-md font-medium">{label}</span>}

            <select
                defaultValue=""
                onChange={(e) => onSortChange(e.target.value)}
                className="px-2 py-2 border border-[#d7dadb] rounded-md text-cinza-escuro outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-sm"
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