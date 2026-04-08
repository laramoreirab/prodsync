"use client";

import { useEffect, useState } from "react";

export function barHorizontal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const rotatividadeData = [
                { mes: "Abr", novos: 18, desligados: 15 },
                { mes: "Mai", novos: 20, desligados: 13 },
                { mes: "Jun", novos: 17, desligados: 16 },
                { mes: "Jul", novos: 22, desligados: 14 },
                { mes: "Ago", novos: 19, desligados: 17 },
                { mes: "Set", novos: 25, desligados: 15 },
              ];

            setData(rotatividadeData);
        }

        fetchData();
    }, []);

    return data;
}