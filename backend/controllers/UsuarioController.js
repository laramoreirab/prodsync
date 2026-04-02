import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/UsuarioModel.js'
import { JWT_CONFIG } from '../config/jwt.js'

class UsuarioController{

 //GET api/usuarios - Listar todos os funcionários (apenas admin)
 static async listarUsuarios(req, res){
    try {
        
    } catch (error) {
        
    }
}

//POST api/usuarios - Criar novo usuário (apenas dmin)
static async criarUsuario(req, res){
    try {
        
    } catch (error) {
        
    }
}

//PUT api/usuarios/:idf
static async atualizarUsuario(req, res){
    try {
        
    } catch (error) {
        
    }
}

//DELETE api/usuarios/:idf - Excluir funcionario 
static async deletarUsuario(req, res){
    try {
        
    } catch (error) {
        
    }
}
}

export default UsuarioController