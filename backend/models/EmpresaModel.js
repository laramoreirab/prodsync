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

    static async deletarEmpresa(id_empresa, id_usuario, cnpj, senhaAdmin){
        try {
            const senhaUsuario = await prisma.usuarios.findUnique({
                where:{
                    id_usuario: id_usuario
                },
                select:{
                    senha: true
                }
            })

            const compararSenhas = await bcrypt.compare(senhaAdmin, senhaUsuario.senha)
            if(!compararSenhas){
                console.warn("A senha de administrador informada está incorreta, não é possível deletar a conta!")
                return 
            }

            const resultado = await prisma.empresas.delete({
                where:{
                    id_empresa: id_empresa,
                    cnpj: cnpj
                }
            })
            return resultado
            
        } catch (error) {
            console.error('Erro ao deletar empresa:', error);
            throw error;
        }
    }
}

export default EmpresaModel