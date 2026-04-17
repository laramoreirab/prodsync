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
    static async registrarEventoMaquina(req,res){
        try {
        const id_empresa = req.user.id_empresa;
        const { status_maquina, id_maquina, timestamp } = req.body;

        if (!status_maquina || status_maquina.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Status da máquina é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Status da máquina é obrigatório!'
                })
            }
        if (!id_maquina || id_maquina.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'ID da máquina é obrigatório',
                    mensagem: 'O evento não pode ser registrado! ID da máquina é obrigatório!'
                })
            }
        if (!timestamp || timestamp.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Data/hora do evento é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Data/hora da máquina é obrigatório!'
                })
            }

        const parada =  await EventoModel.registrarEventoMaquina(id_empresa,  status_maquina, id_maquina, timestamp)

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

     static async registrarEventoSistema(req, res){
         const id_empresa = req.user.id_empresa;
         const { status_maquina, setor_afetado, id_maquina, inicio, fim, id_motivo_parada, observacao } = req.body

        if (!status_maquina || status_maquina.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Status da máquina é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Status da máquina é obrigatório!'
                })
            }
        if (!id_maquina || id_maquina.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'ID da máquina é obrigatório',
                    mensagem: 'O evento não pode ser registrado! ID da máquina é obrigatório!'
                })
            }
        if (!inicio || inicio.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Início do evento é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Data e hora do início do evento é obrigatório!'
                })
            }
        if (!fim || fim.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Fim do evento é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Data e hora do fim do evento é obrigatório!'
                })
            }
        if (!id_motivo_parada || id_motivo_parada.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Motivo de Parada é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Motivo de Parada é obrigatório!'
                })
            }
        if (!setor_afetado || setor_afetado.trim() == '') {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Setor Afetado é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Setor Afetado pelo evento é obrigatório!'
                })
            }

            const registrarEvento = await EventoModel.registrarEventoSistema(id_empresa, status_maquina, setor_afetado, id_maquina, inicio, fim, id_motivo_parada, observacao )

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

    //obter evento por id 
}