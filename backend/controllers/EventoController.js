import EventoModel from "../models/EventoModel";


class EventoController{
    //GET api/eventos - Listar todos os eventos das máquinas (apenas admin)
    static async listarTodos(req, res){
        try {
        
            const id_empresa = req.user.id_empresa
            const paginacao = req.paginacao;

          const resultado = await EventoModel.listarTodos(id_empresa, paginacao);  
          res.status(200).json({
                sucesso: true,
                ...resultado
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
    static async criarEvento(req,res){
        
    }
}