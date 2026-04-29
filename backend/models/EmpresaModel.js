import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import { gerarIdUsuario } from '../dev-utils/gerarIdUsuario.js';

class EmpresaModel {
    //Registrar nova empresa
    static async criarEmpresa(dados) {
        try {
            const {
            nome_empresa, cnpj, email, telefone, endereco,
            nome_representante, cpf, senha
        } = dados;

        const hashSenha = await bcrypt.hash(senha, 10);

        // Usando a função que veio do util
        const idCustomizado = gerarIdUsuario('Adm');

        const novaEmpresa = await prisma.empresas.create({
            data: {
                nome_empresa,
                cnpj,
                email,
                telefone,
                endereco,
                nome_representante,
                cpf_representante: cpf,

                usuarios: {
                    create: {
                        id_usuario: idCustomizado,
                        nome: nome_representante,
                        tipo: 'Adm',
                        cpf: cpf,
                        email: email,
                        senha: hashSenha
                    }
                }
            },
            include: {
                usuarios: true
            }
        });

        return novaEmpresa; 
        } catch (error) {
            console.error('Erro ao cadastrar empresa e usuário administrador', error);
            throw error;
        }
       
    }

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