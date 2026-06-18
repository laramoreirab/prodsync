// middlewares/paginacaoMiddleware.js

export const paginacaoMiddleware = (req, res, next) => {
    // Pega os valores da URL ou usa os padrões (página 1, limite de 10)
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    
    // Busca o limite máximo no .env. Se não existir, usa 100 como segurança padrão.
    const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;

    // 1ª Validação: Números negativos ou zero
    if (pagina <= 0 || limite <= 0) {
        return res.status(400).json({
            sucesso: false,
            erro: 'Parâmetros inválidos',
            mensagem: 'Página e limite devem ser maiores que zero'
        });
    }

    // 2ª Validação: Limite máximo estourado
    if (limite > limiteMaximo) {
        return res.status(400).json({
            sucesso: false,
            erro: 'Limite inválido',
            mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
        });
    }

    // Injeta os valores validados dentro do objeto req
    req.paginacao = { pagina, limite };

    // Manda a requisição seguir em frente para o Controller
    next();
};