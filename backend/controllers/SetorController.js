import SetorModel from '../models/SetorModel.js';

class SetorController {

    // Criar um novo setor
    static async criarSetor(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { nome_setor, localizacao } = req.body;

            if (!nome_setor || nome_setor.trim().length < 2) {
                return res.status(400).json({ sucesso: false, erro: 'Nome do setor deve ter pelo menos 2 caracteres.' });
            }

            const dadosSetor = {
                nome_setor: nome_setor.trim(),
                id_empresa,
                localizacao: localizacao ? localizacao.trim() : null
            };

            const setor = await SetorModel.criarSetor(dadosSetor);

            return res.status(201).json({ sucesso: true, dados: setor });

        } catch (error) {
            console.error('Erro ao criar setor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Associar máquinas ao setor
    static async associarMaquinas(req, res) {
        try {
            const id_setor = Number(req.params.id_setor);
            const { ids_maquinas } = req.body; // Espera um array: [1, 2, 5]
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_setor)) return res.status(400).json({ sucesso: false, erro: 'ID de setor inválido' });
            if (!Array.isArray(ids_maquinas) || ids_maquinas.length === 0) {
                return res.status(400).json({ sucesso: false, erro: 'Forneça um array com os IDs das máquinas' });
            }

            await SetorModel.associarMaquinas(id_setor, id_empresa, ids_maquinas);
            res.status(200).json({ sucesso: true, mensagem: 'Máquinas associadas com sucesso' });
        } catch (error) {
            console.error('Erro ao associar máquinas:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Listar setores específicos de um gestor logado
    static async listarMeusSetores(req, res) {
        try {
            const id_gestor = req.user.id_usuario;
            const id_empresa = req.user.id_empresa;

            const setores = await SetorModel.listarSetoresDoGestor(id_gestor, id_empresa);
            res.status(200).json({ sucesso: true, dados: setores });
        } catch (error) {
            console.error('Erro ao listar setores do gestor:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Listar setores da empresa
    static async listarSetores(req, res) {
        try {
            const id_empresa = req.user.id_empresa;

            const setores = await SetorModel.listarSetoresPorEmpresa(id_empresa);
            res.status(200).json({ sucesso: true, dados: setores });
        } catch (error) {
            console.error('Erro ao listar setores:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Obter setor por ID
    static async obterSetorPorId(req, res) {
        try {
            const id_setor = Number(req.params.id_setor);
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_setor)) return res.status(400).json({ sucesso: false, erro: 'ID de setor inválido' });

            const setor = await SetorModel.obterSetorPorId(id_setor, id_empresa);

            if (!setor) {
                return res.status(404).json({ sucesso: false, erro: 'Setor não encontrado' });
            }

            res.status(200).json({ sucesso: true, dados: setor });
        } catch (error) {
            console.error('Erro ao obter setor por ID:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Atualizar setor
    static async atualizarSetor(req, res) {
        try {
            const id_setor = Number(req.params.id_setor);
            const id_empresa = req.user.id_empresa;
            const { nome_setor } = req.body;

            if (isNaN(id_setor)) return res.status(400).json({ sucesso: false, erro: 'ID de setor inválido' });

            if (!nome_setor || nome_setor.trim().length < 2) {
                return res.status(400).json({ sucesso: false, erro: 'Nome do setor deve ter pelo menos 2 caracteres.' });
            }

            await SetorModel.atualizarSetor(id_setor, id_empresa, { nome_setor: nome_setor.trim() });
            res.status(200).json({ sucesso: true, mensagem: 'Setor atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar setor:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ sucesso: false, erro: error.message });
            }
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Deletar setor
    static async deletarSetor(req, res) {
        try {
            const id_setor = Number(req.params.id_setor);
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_setor)) return res.status(400).json({ sucesso: false, erro: 'ID de setor inválido' });

            await SetorModel.deletarSetor(id_setor, id_empresa);
            res.status(200).json({ sucesso: true, mensagem: 'Setor deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar setor:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ sucesso: false, erro: error.message });
            }
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Associar gestor a setor
    static async associarGestor(req, res) {
        try {
            const id_setor = Number(req.params.id_setor);
            const { id_gestor } = req.body;
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_setor)) return res.status(400).json({ sucesso: false, erro: 'ID de setor inválido' });
            if (!id_gestor || isNaN(id_gestor)) return res.status(400).json({ sucesso: false, erro: 'ID de gestor inválido' });

            const associacao = await SetorModel.associarGestor(id_setor, id_gestor, id_empresa);
            res.status(201).json({ sucesso: true, dados: associacao });
        } catch (error) {
            console.error('Erro ao associar gestor:', error);
            if (error.message && (error.message.includes('não encontrado') || error.message.includes('não é gestor'))) {
                return res.status(400).json({ sucesso: false, erro: error.message });
            }
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Remover gestor do setor
    static async removerGestor(req, res) {
        try {
            const id_setor = Number(req.params.id_setor);
            const { id_gestor } = req.body;
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_setor)) return res.status(400).json({ sucesso: false, erro: 'ID de setor inválido' });
            if (!id_gestor || isNaN(id_gestor)) return res.status(400).json({ sucesso: false, erro: 'ID de gestor inválido' });

            await SetorModel.removerGestor(id_setor, id_gestor, id_empresa);
            res.status(200).json({ sucesso: true, mensagem: 'Gestor removido do setor com sucesso' });
        } catch (error) {
            console.error('Erro ao remover gestor:', error);
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ sucesso: false, erro: error.message });
            }
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // Listar gestores do setor
    static async listarGestoresDoSetor(req, res) {
        try {
            const id_setor = Number(req.params.id_setor);
            const id_empresa = req.user.id_empresa;

            if (isNaN(id_setor)) return res.status(400).json({ sucesso: false, erro: 'ID de setor inválido' });

            const gestores = await SetorModel.listarGestoresDoSetor(id_setor, id_empresa);
            res.status(200).json({ sucesso: true, dados: gestores });
        } catch (error) {
            console.error('Erro ao listar gestores:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // ------------------------ Dashboards ----------------------- //

    static async obterProducaoPorSetor(req, res) {
        try {
            const dias = req.query.dias ? Number(req.query.dias) : null;
            const dados = await SetorModel.obterProducaoPorSetor(req.user.id_empresa, dias);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter producao por setor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterQuantidadeMaquinasPorSetor(req, res) {
        try {
            const dados = await SetorModel.obterQuantidadeMaquinasPorSetor(req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter quantidade de maquinas por setor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterTempoMedioParadaPorSetor(req, res) {
        try {
            const dias = req.query.dias ? Number(req.query.dias) : null;
            const dados = await SetorModel.obterTempoMedioParadaPorSetor(req.user.id_empresa, dias);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter tempo medio de parada por setor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    static async obterProducaoDefeitosPorSetor(req, res) {
        try {
            const dias = req.query.dias ? Number(req.query.dias) : null;
            const dados = await SetorModel.obterProducaoDefeitosPorSetor(req.user.id_empresa, dias);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter producao de defeitos por setor:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

}

export default SetorController;
