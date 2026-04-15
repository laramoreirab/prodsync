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
            console.error('Erro ao listar eventos:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os eventos!'
            });
        }
        
    }
    static async registrarEvento(req,res){
        try {
        const id_empresa = req.user.id_empresa;
        const { status_maquina, id_maquina, timestamp } = req.body;

        const parada =  await EventoModel.registrarEvento(id_empresa,  status_maquina, id_maquina, timestamp)

        res.status(201).json({
            sucesso: true,
            mensagem: 'Evento registrao com sucesso!'
        })
        } catch (error) {
            console.error('Erro ao registrar evento:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar o evento!'
            });
        }
    }

    static async atualizar(req, res){

    }
}