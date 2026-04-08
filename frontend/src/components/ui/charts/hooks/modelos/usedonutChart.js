"use client";

import { useEffect, useState } from "react";

export function barHorizontal() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // aqui depois entra a API real
        async function fetchData() {
            const usuariosData = [
                { perfil: "Operadores", qtd: 91.7 },
                { perfil: "Gestores", qtd: 8.3 },
              ];
              
              
            setData(usuariosData);
        }

        fetchData();
    }, []);

    return data;
}