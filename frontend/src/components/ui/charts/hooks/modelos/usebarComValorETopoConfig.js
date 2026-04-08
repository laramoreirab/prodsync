"use client";

import { useEffect, useState } from "react";

export function barHorizontal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {

            const producaoMediaData = [
                { setor: "Engrenagens", media: 56 },
                { setor: "Turbinas", media: 48 },
                { setor: "Válvulas", media: 35 },
                { setor: "Compressores", media: 29 },
              ];

            setData(producaoMediaData);
        }

        fetchData();
    }, []);

    return data;
}