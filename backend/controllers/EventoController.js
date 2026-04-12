import EventoModel from "../models/EventoModel";


class EventoController{
    //GET api/eventos - Listar todos os funcionários (apenas admin)
    static async listarTodos(req, res){

        try {
          const { pagina, limite} = req.paginacao
          const resultado = await EventoModel.listarTodos(pagina, limite);  
          res.status(200).json({
                sucesso: true,
                dados: resultado.data, // Acessa o array dentro da chave 'data'
                paginacao: {
                    totalEventos: resultado.meta.totalEventos,
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

    static async criarEvento(req,res){
    }
}