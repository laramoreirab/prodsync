import  prisma  from '../config/prisma.js';

class EmpresaModel{
    //Registrar nova empresa
        static async criarEmpresa(dados) {
            try {
                const senhaHash = await bcrypt.hash(dados.senha, 10);
                
                const novaEmpresa = await prisma.empresas.create({
                    data: {
                        ...dados,
                        senha: senhaHash
                    },
                });
                return novaEmpresa.id_empresa;
            } catch (error) {
                console.error('Erro ao registrar empresa', error);
                throw error;
            };
        };
        //buscar por cnpj
            static async buscarPorCnpj(cnpj) {
                try {
                    const row = await prisma.empresas.findUnique({
                        where: { cnpj: cnpj }
                    });
                    return row || null;
                } catch (error) {
                    console.error('Erro ao buscar usuário por CNPJ:', error);
                    throw error;
                }
            };
}

export default EmpresaModel