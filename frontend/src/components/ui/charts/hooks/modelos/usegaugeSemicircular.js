"use client";

import { useEffect, useState } from "react";

export function gaugeSemicircular () {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const fakeData = [
                { name: "fundo", value: 100, fill: "hsl(var(--muted))" },
                { name: "valor", value: valor, fill: color },
            ];

            setData(fakeData);
        }

        fetchData();
    }, []);

    return data;
}