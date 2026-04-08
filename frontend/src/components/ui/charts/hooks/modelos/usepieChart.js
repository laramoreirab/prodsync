"use client";

import { useEffect, useState } from "react";

export function barHorizontal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const statusMaquinasData = [
                { name: "Produzindo", value: 75 },
                { name: "Paradas", value: 10 },
                { name: "Setup", value: 15 },
              ];
              

            setData(statusMaquinasData);
        }

        fetchData();
    }, []);

    return data;
}