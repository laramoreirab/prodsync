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

    static async justificarEvento(req, res){

        try {
        const id_empresa = req.user;
        const { id_evento, id_motivo_parada } = req.body;

        //verificar se já não há uma justificativa cadastrada no evento
        const verificacao = await EventoModel.verificaJustificativa(id_empresa, id_evento);
        if(verificacao===true){
            res.status(400).json({
                sucesso: false,
                erro: 'O evento já possui justificativa',
                mensagem: 'O evento já possui justificatva de parada!'
            })
        }
        const registrarJustificativa = await EventoModel.justificar(id_empresa, id_evento, id_motivo_parada);
        res.status(201).json({
            sucesso: true,
            mensagem: 'Justificativa registrada com sucesso! A máquina já pode ser religada!'
        }) 
        } catch (error) {
            res.status(500).json({
                 sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar a justificativa do evento!'
            })
           
        }

        
    
    }
}