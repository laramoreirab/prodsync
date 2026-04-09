import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/UsuarioModel.js'
import { JWT_CONFIG } from '../config/jwt.js'

class UsuarioController {

    //GET api/usuarios - Listar todos os funcionários (apenas admin)
    static async listarUsuarios(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                });
            }
            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser um número maior que zero'
                });
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }

            const skip = (pagina - 1) * limite;

            const resultado = await UsuarioModel.listarTodos(limite, skip)

            res.status(200).json({
                sucesso: true,
                dados: resultado.data, // Acessa o array dentro da chave 'data'
                paginacao: {
                    totalUsuarios: resultado.meta.totalUsuarios,
                    totalPaginas: resultado.meta.totalPaginas,
                    currentPage: resultado.meta.currentPages,
                    pageSize: resultado.meta.pageSize
                }
            });

        } catch (error) {
             console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os produtos'
            });
        }
        }

    //GET api/usuarios/:id - busca de usuário por id 
    static async buscarPorId(req, res){
        try {
            const { id } = req.params;
            // Validação básica do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            const usuario = await UsuarioModel.buscarPorId(id);

            if(!usuario){
                res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',

                })
            };
            res.status(200).json({
                sucesso: true,
                dados: usuario
            });

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o usuário'
            });
        }
    }

    //POST api/usuarios - Criar novo usuário (apenas dmin)
    static async criarUsuario(req, res) {
        try {
            const { nome, cpf, email, setor, funcao, turno, maquina } = req.body;
            
        } catch (error) {

        }
    }

    //PUT api/usuarios/:idf
    static async atualizarUsuario(req, res) {
        try {

        } catch (error) {

        }
    }

    //DELETE api/usuarios/:idf - Excluir funcionario 
    static async deletarUsuario(req, res) {
        try {

        } catch (error) {

        }
    }
}

export default UsuarioController