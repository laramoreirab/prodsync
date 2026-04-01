import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/UsuarioModel'
import { JWT_CONFIG } from '../config/jwt'

class AuthController{

    //POST api/auth/login - Fazer login
    static async login(req, res){
        try{

        }catch (error){

        }
    }

    //POST api/auth/cadastrar - Registar nova empresa no sistema
    static async cadastrar(req, res){
        try{

        }catch (error){

        }
    }

    //GET api/auth/perfil - Obter perfil do usuário logado
    static async obterPerfil(req, res){
        try{

        }catch (error){

        }
    }

    

    //GET api/funcionarios - Listar todos os funcionários (apenas admin)
    static async listarFuncionarios(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    //POST api/funcionarios - Criar novo usuário (apenas dmin)
    static async criarFuncionario(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    //PUT api/funcinarios/:idf
    static async atualizarFuncionario(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    //DELETE api/funcionarios/:idf - Excluir funcionario 
    static async deletarFuncionario(req, res){
        try {
            
        } catch (error) {
            
        }
    }
}

export default AuthController;