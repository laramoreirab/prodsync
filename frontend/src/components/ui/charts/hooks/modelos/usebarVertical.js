"use client";

import { useEffect, useState } from "react";

export function barHorizontal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const motivosParadaData = [
                { motivo: "Manutenção", ocorr: 45 },
                { motivo: "Falta Material", ocorr: 32 },
                { motivo: "Limpeza", ocorr: 28 },
            ]

            setData( motivosParadaData);
        }

        fetchData();
    }, []);

    return data;
}