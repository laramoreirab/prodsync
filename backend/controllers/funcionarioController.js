import jwt from 'jsonwebtoken'
import FuncionarioModel from '../models/FuncionarioModel'
import { JWT_CONFIG } from '../config/jwt'

class FuncionarioController{

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

export default FuncionarioController