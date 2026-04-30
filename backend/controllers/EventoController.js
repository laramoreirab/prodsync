import EventoModel from "../models/EventoModel";

class EventoController{
    //GET api/eventos - Listar todos os eventos das máquinas (apenas admin)
    static async listarTodos(req, res){
        try {
        
            const id_empresa = req.user.id_empresa
            const paginacao = req.paginacao;

          const resultado = await EventoModel.listarTodos(id_empresa, paginacao);  
          return res.status(200).json({
                sucesso: true,
                ...resultado
            });
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os eventos!'
            });
        }
        
    }

    //listar as paradas justificadas
    static async listarJustificadas(req, res){
        try {
             const id_empresa = req.user.id_empresa;
             const paginacao = req.paginacao;
             const resultado = await EventoModel.listarJustificadas(id_empresa, paginacao);
             return res.status(200).json({ sucesso: true, ...resultado });
        } catch (error) {
             return res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro', 
                mensagem: 'Erro ao listar' });
        }
    }
    //listar as tabelas não justificadas
    static async listarNaoJustificadas(req, res){
       try {
             const id_empresa = req.user.id_empresa;
             const paginacao = req.paginacao;
             const resultado = await EventoModel.listarNaoJustificadas(id_empresa, paginacao);
             return res.status(200).json({ sucesso: true, ...resultado });
        } catch (error) {
             return res.status(500).json({ sucesso: false, erro: 'Erro', mensagem: 'Erro ao listar' });
        }
    }

    static async registrarEventoMaquina(req,res){
        try {
        const id_empresa = req.user.id_empresa;
        const { status_maquina, id_maquina} = req.body;

        const timestamp = new Date().getTime();

        if (!status_maquina || status_maquina.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Status da máquina é obrigatório',
                    mensagem: 'O evento não pode ser registrado! Status da máquina é obrigatório!'
                })
            }
        if (!id_maquina || id_maquina.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID da máquina é obrigatório',
                    mensagem: 'O evento não pode ser registrado! ID da máquina é obrigatório!'
                })
            }
        if (!timestamp || timestamp.trim() == '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Não foi possível obter a Data/hora do evento',
                    mensagem: 'O evento não pode ser registrado! Data/hora do evento não !'
                })
            }

        const parada =  await EventoModel.registrarEventoMaquina(id_empresa,  status_maquina, id_maquina, timestamp)

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Evento registrado com sucesso!'
        })
        } catch (error) {
            console.error('Erro ao registrar evento:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar o evento!'
            });
        }
    }

     static async registrarEventoSistema(req, res){
         try {
            const id_empresa = req.user.id_empresa;
            // Modificado: Recebe um array 'maquinas' (IDs das máquinas selecionadas)
            const { status_maquina, setor_afetado, maquinas, inicio, fim, id_motivo_parada, observacao } = req.body;

            if (!status_maquina || status_maquina.trim() == '') {
                return res.status(400).json({ sucesso: false, erro: 'Status da máquina é obrigatório', mensagem: 'Status da máquina é obrigatório!' });
            }
            // Valida se enviou pelo menos uma máquina
            if (!maquinas || !Array.isArray(maquinas) || maquinas.length === 0) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Máquinas obrigatórias', 
                    mensagem: 'Selecione pelo menos uma máquina!' });
            }
            if (!inicio) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Início do evento é obrigatório', 
                    mensagem: 'Data e hora do início do evento é obrigatório!' });
            }
            if (!fim) {
                return res.status(400).json({
                     sucesso: false, 
                     erro: 'Fim do evento é obrigatório', 
                     mensagem: 'Data e hora do fim do evento é obrigatório!' });
            }
            if (!id_motivo_parada) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Motivo de Parada é obrigatório',
                     mensagem: 'Motivo de Parada é obrigatório!' });
            }

            const registrarEvento = await EventoModel.registrarEventoSistema(id_empresa, status_maquina, setor_afetado, maquinas, inicio, fim, id_motivo_parada, observacao);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Eventos registrados com sucesso para as máquinas selecionadas!',
                dados: registrarEvento
            });
        } catch (error) {
             console.error(error);
             return res.status(500).json({ sucesso: false,
                 erro: 'Erro interno', 
                 mensagem: 'Falha ao registrar evento múltiplo' });
        }
    }


    static async justificarEvento(req, res){

        try {
        const id_empresa = req.user.id_empresa;
        const { id_evento, id_motivo_parada, observacao } = req.body;

        if(!id_motivo_parada){
            return res.status(400).json({
                sucesso: false,
                erro: 'O Motivo da Parada é obrigatório para registrar justificativa',
                mensagem: 'O Motivo da Parada é obrigatório para registrar justificativa'
            })
        }

        //verificar se já não há uma justificativa cadastrada no evento
        const verificacao = await EventoModel.verificaJustificativa(id_empresa, id_evento);
        if(verificacao===true){
            res.status(400).json({
                sucesso: false,
                erro: 'O evento já possui justificativa',
                mensagem: 'O evento já possui justificatva de parada!'
            })
        }
        const registrarJustificativa = await EventoModel.justificar(id_empresa, id_evento, id_motivo_parada,observacao);
        if(!registrarJustificativa){
            return res.status(400).json({
                sucesso: false,
                erro: 'Não foi possível registrar justificativa do evento',
                mensagem: 'Não foi possível registrar justificativa do evento!'
            })
        }
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

    static async obterEventoId(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    // -------------------------------------Dashboards Página histórico de eventos------------------------------------------------------------------------------------------

    static async tempoParadoTempoProduzindoEvento(req, res){
        try {
            const dados = await EventoModel.tempoParadoTempoProduzindoEvento(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Tempo Total Parado x Tempo total Produzindo geral da fábrica:', error)
        return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
    static async top3MotivosParada(req, res){
        try {
            const dados = await EventoModel.top3MotivosParada(req.user.id_empresa)
            return res.status(200).json({sucesso: true, dados})
        } catch (error) {
            console.error('Erro no gráfico Top 3 Motivos de Parada:', error)
        return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }


}