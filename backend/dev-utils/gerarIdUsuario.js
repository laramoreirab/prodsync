export const gerarIdUsuario = (tipo) => {
    let prefixo = "";
    let sufixoMax = 0;
    let tamanhoSufixo = 0;

    if (tipo === 'Adm') {
        prefixo = "100";
        sufixoMax = 100000; // 5 dígitos (00000 a 99999)
        tamanhoSufixo = 5;
    } else if (tipo === 'Gestor') {
        prefixo = "90";
        sufixoMax = 1000000; // 6 dígitos (000000 a 999999)
        tamanhoSufixo = 6;
    } else {
        // OPERADORES: Garante que NUNCA comece com 9 ou 1.
        // Força o primeiro dígito a ser entre 2 e 8.
        const primeiroDigito = Math.floor(2 + Math.random() * 7); // Gera de 2 a 8
        const restoSufixo = Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(7, '0'); // 7 dígitos aleatórios
        
        return parseInt(primeiroDigito.toString() + restoSufixo);
    }

    const sufixo = Math.floor(Math.random() * sufixoMax)
        .toString()
        .padStart(tamanhoSufixo, '0');

    return parseInt(prefixo + sufixo);
};