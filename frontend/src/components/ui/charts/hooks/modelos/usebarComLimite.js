"use client";

import { useEffect, useState } from "react";

export function barComLimite() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const sobrecargaData = [
                { setor: "Engrenagens", carga: 85 },
                { setor: "Turbinas", carga: 67 },
                { setor: "Válvulas", carga: 50 },
                { setor: "Compressores", carga: 42 },
            ];
            setData(sobrecargaData);
        }

        fetchData();
    }, []);

    return data;
}