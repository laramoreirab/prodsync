import MaquinaModel from '../models/MaquinaModel.js';

class MaquinaController {

    static async listarMaquinas(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;
            const resultado = await MaquinaModel.listarMaquinasPaginadas(id_empresa, paginacao);

            return res.status(200).json({
                sucesso: true,
                ...resultado
            });

        } catch (error) {
            console.error('Erro no MaquinaController:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor ao listar máquinas.'
            });
        }
    }

    // GET /maquinas/:id - Buscar máquina por ID
    static async buscarMaquinaPorId(req, res) {
        try {
            const { id } = req.params;
            const id_empresa = req.user.id_empresa;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Ordem dos parâmetros ajustada conforme o Model atualizado
            const maquina = await MaquinaModel.buscarMaquinaPorID(parseInt(id), id_empresa);

            if (!maquina) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Máquina não encontrada',
                    mensagem: `Máquina com ID ${id} não foi encontrada ou foi inativada.`
                });
            }

            res.status(200).json({ sucesso: true, dados: maquina });

        } catch (error) {
            console.error('Erro ao buscar máquina:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // POST /maquinas - Criar nova máquina
    static async criarMaquina(req, res) {
        try {
            const { id_setor, id_categoria, nome, serie } = req.body;
            const id_empresa = req.user.id_empresa;
            const erros = [];

            // Validações originais mantidas...
            if (!id_setor || isNaN(id_setor)) erros.push({ campo: 'id_setor', mensagem: 'Inválido' });
            if (!id_categoria || isNaN(id_categoria)) erros.push({ campo: 'id_categoria', mensagem: 'Inválido' });
            if (!nome || nome.trim().length < 2) erros.push({ campo: 'nome', mensagem: 'Deve ter pelo menos 2 caracteres' });

            if (erros.length > 0) {
                return res.status(400).json({ sucesso: false, erro: 'Dados inválidos', detalhes: erros });
            }

            // Parâmetros ajustados para bater com o Model
            const maquina = await MaquinaModel.criarMaquina(
                id_empresa, parseInt(id_setor), parseInt(id_categoria), nome.trim(), serie?.trim()
            );

            res.status(201).json({ sucesso: true, mensagem: 'Máquina criada com sucesso!', dados: maquina });

        } catch (error) {
            console.error('Erro ao criar máquina:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // PUT /maquinas/:id - Atualizar dados da máquina
    static async atualizarMaquina(req, res) {
        try {
            const { id } = req.params;
            const { nome, serie } = req.body;
            const id_empresa = req.user.id_empresa;

            if (!id || isNaN(id)) return res.status(400).json({ sucesso: false, erro: 'ID inválido' });

            const maquinaExistente = await MaquinaModel.buscarMaquinaPorID(parseInt(id), id_empresa);
            if (!maquinaExistente) return res.status(404).json({ sucesso: false, erro: 'Máquina não encontrada' });

            if (!nome && !serie) return res.status(400).json({ sucesso: false, erro: 'Nenhum dado para atualizar' });

            await MaquinaModel.atualizarDados(parseInt(id), id_empresa, nome?.trim(), serie?.trim());

            res.status(200).json({ sucesso: true, mensagem: 'Máquina atualizada com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar máquina:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // DELETE /maquinas/:id - Deletar máquina (soft delete)
    static async deletarMaquina(req, res) {
        try {
            const { id } = req.params;
            const id_empresa = req.user.id_empresa;

            if (!id || isNaN(id)) return res.status(400).json({ sucesso: false, erro: 'ID inválido' });

            const maquinaExistente = await MaquinaModel.buscarMaquinaPorID(parseInt(id), id_empresa);
            if (!maquinaExistente) return res.status(404).json({ sucesso: false, erro: 'Máquina não encontrada' });

            await MaquinaModel.deletarMaquina(parseInt(id), id_empresa);

            res.status(200).json({ sucesso: true, mensagem: 'Máquina desativada com sucesso!' });

        } catch (error) {
            console.error('Erro ao deletar máquina:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // PUT /maquinas/:id/status - Atualizar status da máquina
    static async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status_atual } = req.body;
            const id_empresa = req.user.id_empresa;

            if (!id || isNaN(id)) return res.status(400).json({ sucesso: false, erro: 'ID inválido' });

            // NOVO: Validação do Enum do Prisma
            const statusValidos = ['Produzindo', 'Parada', 'Manutencao', 'Setup'];
            if (!statusValidos.includes(status_atual)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Status inválido',
                    mensagem: `Os status aceitos são: ${statusValidos.join(', ')}`
                });
            }

            const maquinaExistente = await MaquinaModel.buscarMaquinaPorID(parseInt(id), id_empresa);
            if (!maquinaExistente) return res.status(404).json({ sucesso: false, erro: 'Máquina não encontrada' });

            await MaquinaModel.atualizarStatus(parseInt(id), id_empresa, status_atual);

            res.status(200).json({ sucesso: true, mensagem: 'Status da máquina atualizado!' });

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // GET /maquinas/status/:status - Listar máquinas por status
    static async listarMaquinasPorStatus(req, res) {
        try {
            const { status } = req.params;
            const id_empresa = req.user.id_empresa;

            // ADICIONADO: Validação do Enum para evitar erro 500 do Prisma
            const statusValidos = ['Produzindo', 'Parada', 'Manutencao', 'Setup'];

            if (!status || !statusValidos.includes(status.trim())) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Status inválido',
                    mensagem: `O status fornecido é inválido. Os status aceitos são: ${statusValidos.join(', ')}`
                });
            }

            const maquinas = await MaquinaModel.listarMaquinasPorStatus(id_empresa, status.trim());

            res.status(200).json({
                sucesso: true,
                dados: maquinas
            });

        } catch (error) {
            console.error('Erro ao listar máquinas por status:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar as máquinas'
            });
        }
    }

    // GET /maquinas/setor/:id_setor - Listar máquinas por setor
    static async listarMaquinasPorSetor(req, res) {
        try {
            const { id_setor } = req.params;
            const id_empresa = req.user.id_empresa;

            if (!id_setor || isNaN(id_setor)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do setor inválido',
                    mensagem: 'O ID do setor deve ser um número válido'
                });
            }

            const maquinas = await MaquinaModel.listarMaquinasPorSetor(id_empresa, parseInt(id_setor));

            res.status(200).json({
                sucesso: true,
                dados: maquinas
            });

        } catch (error) {
            console.error('Erro ao listar máquinas por setor:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar as máquinas'
            });
        }
    }

    // ----------------------------------------------dashboard--------------------------------------------------
    //dashboard novo da tela de usuário adm 
     static async taxaCumprimentoMetaPorSetor(req, res) {
        try {
            const dados = await UsuarioModel.taxaCumprimentoMetaPorSetor(req.user.id_empresa)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Cumprimento de Meta de Produção Por Setor', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }
}

export default MaquinaController;