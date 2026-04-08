"use client";

import { useEffect, useState } from "react";

export function barHorizontal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const defeitosData = [
                { setor: "Engrenagens", produzidas: 60, defeito: 40 },
                { setor: "Turbinas", produzidas: 65, defeito: 35 },
                { setor: "Válvulas", produzidas: 70, defeito: 30 },
                { setor: "Compressores", produzidas: 55, defeito: 45 },
              ];

            setData(defeitosData);
        }

        fetchData();
    }, []);

    return data;
}