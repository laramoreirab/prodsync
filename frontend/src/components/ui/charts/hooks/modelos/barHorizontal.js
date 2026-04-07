"use client";

import { useEffect, useState } from "react";

export function barHorizontal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const fakeData = [
                { setor: "Engrenagens", qtd: 85 },
                { setor: "Turbinas", qtd: 65 },
                { setor: "Válvulas", qtd: 50 },
                { setor: "Compressores", qtd: 35 },
            ];

            setData(fakeData);
        }

        fetchData();
    }, []);

    return data;
}