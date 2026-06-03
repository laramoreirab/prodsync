import MaquinaModel from '../models/MaquinaModel.js';
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';
import Papa from 'papaparse'

class MaquinaController {
    static obterIdMaquina(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            res.status(400).json({
                sucesso: false,
                erro: 'ID invalido',
                mensagem: 'O ID da maquina deve ser um numero valido'
            });
            return null;
        }

        return parseInt(id);
    }

    static async listarMaquinas(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const paginacao = req.paginacao;
            const resultado = await MaquinaModel.listarMaquinasPaginadas(id_empresa, paginacao, req.query.setorId);

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

    // POST /maquinas/:id/sincronizar-placa - Inicia sessão de pareamento da placa (ESP32)
    static async iniciarSincronizacaoPlaca(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const id_empresa = req.user.id_empresa;
            const id_usuario = req.user.id_usuario;

            const sessao = await MaquinaModel.criarSessaoSincronizacaoPlaca({
                id_empresa,
                id_maquina,
                id_usuario
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Sessão de sincronização iniciada.',
                dados: sessao
            });
        } catch (error) {
            console.error('Erro ao iniciar sincronização da placa:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível iniciar a sincronização da placa'
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
            if (error.code === 'P2002') {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Dados duplicados',
                    mensagem: 'Já existe uma máquina cadastrada com estes dados.'
                });
            }
            if (error.code === 'P2003') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Relacionamento inválido',
                    mensagem: 'Setor ou operador informado não existe.'
                });
            }
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor', mensagem: error.message });
        }
    }

    // POST /maquinas - Criar nova máquina
    static async criarMaquina(req, res) {
        try {
            const { id_setor, categoria, nome, serie, capacidade, status, status_atual = null, data_aquisicao, id_operador } = req.body;
            const id_empresa = req.user.id_empresa;
            const erros = [];

            if (!categoria || categoria.trim().length < 2) erros.push({ campo: 'categoria', mensagem: 'Deve ter pelo menos 2 caracteres' });
            if (!nome || nome.trim().length < 2) erros.push({ campo: 'nome', mensagem: 'Deve ter pelo menos 2 caracteres' });

            if (erros.length > 0) {
                // Se deu erro, remover imagem que o multer salvou
                if (req.file) removerArquivoAntigo(req.file.filename);
                return res.status(400).json({ sucesso: false, erro: 'Dados inválidos', detalhes: erros });
            }

            const imagem = req.file ? `/uploads/imagens/${req.file.filename}` : null;

            const maquina = await MaquinaModel.criarMaquina(
                id_empresa, id_setor, categoria, nome.trim(), serie?.trim(),
                capacidade?.trim(), (status_atual || status)?.trim(), data_aquisicao, id_operador, imagem
            );

            res.status(201).json({ sucesso: true, mensagem: 'Máquina criada com sucesso!', dados: maquina });

        } catch (error) {
            console.error('Erro ao criar máquina:', error);
            if (req.file) removerArquivoAntigo(req.file.filename);
            if (error.code === 'P2002') {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Dados duplicados',
                    mensagem: 'Já existe uma máquina cadastrada com estes dados.'
                });
            }
            if (error.code === 'P2003') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Relacionamento invÃ¡lido',
                    mensagem: 'Setor ou operador informado nÃ£o existe.'
                });
            }
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: error.message
            });
        }
    }

    // PUT /maquinas/:id - Atualizar dados da máquina
    static async atualizarMaquina(req, res) {
        try {
            const { id } = req.params;
            const { nome, serie, id_setor, categoria, capacidade, status, status_atual, data_aquisicao, id_operador } = req.body;
            const id_empresa = req.user.id_empresa;

            if (!id || isNaN(id)) return res.status(400).json({ sucesso: false, erro: 'ID inválido' });

            const maquinaExistente = await MaquinaModel.buscarMaquinaPorID(parseInt(id), id_empresa);
            if (!maquinaExistente) {
                if (req.file) removerArquivoAntigo(req.file.filename);
                return res.status(404).json({ sucesso: false, erro: 'Máquina não encontrada' });
            }

            const dadosUpdate = {
                nome: nome?.trim(),
                serie: serie?.trim(),
                id_setor,
                categoria: categoria?.trim(),
                capacidade: capacidade?.trim(),
                status: (status_atual || status)?.trim(),
                data_aquisicao,
                id_operador
            };

            if (req.file) {
                dadosUpdate.imagem = `/uploads/imagens/${req.file.filename}`;
                // Remover imagem antiga se existir
                if (maquinaExistente.imagem) {
                    removerArquivoAntigo(maquinaExistente.imagem);
                }
            }

            await MaquinaModel.atualizarDados(parseInt(id), id_empresa, dadosUpdate);

            res.status(200).json({ sucesso: true, mensagem: 'Máquina atualizada com sucesso!' });

        } catch (error) {
            console.error('Erro ao atualizar máquina:', error);
            if (req.file) removerArquivoAntigo(req.file.filename);
            if (error.message?.includes('Maquina ja vinculada')) {
                return res.status(400).json({ sucesso: false, erro: error.message });
            }
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
            const statusValidos = ['Produzindo', 'Parada', 'Manutencao', 'Setup', 'Aguardando'];
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
            const statusValidos = ['Produzindo', 'Parada', 'Manutencao', 'Setup', 'Aguardando'];

            if (!status || !statusValidos.includes(status.trim())) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Status inválido',
                    mensagem: `O status fornecido é inválido. Os status aceitos são: ${statusValidos.join(', ')}`
                });
            }

            const maquinas = await MaquinaModel.listarMaquinasPorStatus(id_empresa, status.trim(), req.query.setorId);

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

    static async obterMaquinaOperador(req, res) {
        try {
            const id_operador = req.params.id_operador
            const id_empresa = req.user.id_empresa
            const maquinaId = await MaquinaModel.obterMaquinaOperador(id_empresa, id_operador)
            return res.status(200).json(maquinaId)
        } catch (error) {
            console.error('Erro ao obter máquina pelo ID do operador', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter máquina pelo ID do operador'
            });
        }
    }

    static async cadastroLote(req, res) {
        try {
            function converterData(dataBR) {
                if (!dataBR) return null;
                const [dia, mes, ano] = dataBR.split('/');
                return new Date(ano, Number(mes) - 1, dia);
            }

            if (!req.file) {
                return res.status(400).json({ sucesso: false, erro: 'Arquivo CSV não encontrado.' });
            }

            const fileText = req.file.buffer.toString('utf-8');

            const parsedData = Papa.parse(fileText, {
                header: true,
                skipEmptyLines: true,
            });

            const maquinasCsv = parsedData.data;

            const dadosParaSalvar = maquinasCsv.map((linha) => ({
                id_empresa: Number(linha.id_empresa),
                nome: linha.nome,
                serie: linha.serie,
                id_setor: linha.id_setor ? Number(linha.id_setor) : null,
                ativo: linha.ativo === 'true' || linha.ativo === '1' || linha.ativo === true,
                capacidade: linha.capacidade,
                data_aquisicao: converterData(linha.data_aquisicao),
                status_atual: linha.status_atual,
                id_operador: linha.id_operador ? Number(linha.id_operador) : null,
                categoria: linha.categoria
            }));

            const resultado = await MaquinaModel.cadastrarLote(dadosParaSalvar)

            return res.status(200).json({
                sucesso: true,
                mensagem: `${resultado} máquinas criadas com sucesso!`
            });
        } catch (error) {
            console.error('Erro ao cadastrar lote de máquinas:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno ao processar o arquivo CSV' });
        }
    }

    // ----------------------------------------------dashboard--------------------------------------------------
    //dashboard novo da tela de usuário adm 
    static async taxaCumprimentoMetaPorSetor(req, res) {
        try {
            const dados = await MaquinaModel.taxaCumprimentoMetaPorSetor(req.user.id_empresa, req.query.setorId)
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Cumprimento de Meta de Produção Por Setor', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // GET /maquinas/dashboard/status-geral
    static async obterStatusGeralMaquinas(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const dados = await MaquinaModel.obterStatusGeralMaquinas(id_empresa, req.query.setorId);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter status geral das maquinas:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter o status geral das maquinas'
            });
        }
    }

    static async obterProducaoTotalMaquinas(req, res) {
        try {
            const dias = req.query.dias ? Number(req.query.dias) : 7;
            const dados = await MaquinaModel.obterProducaoTotalMaquinas(req.user.id_empresa, dias, req.query.setorId);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter producao total das maquinas:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter a producao total das maquinas'
            });
        }
    }

    static async obterMediaParadasPorDia(req, res) {
        try {
            const dias = req.query.dias ? Number(req.query.dias) : 7;
            const dados = await MaquinaModel.obterMediaParadasPorDia(req.user.id_empresa, dias, req.query.setorId);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter media de paradas por dia:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter a media de paradas por dia'
            });
        }
    }

    static async obterPecasPorMinuto(req, res) {
        try {
            const dias = req.query.dias ? Number(req.query.dias) : 7;
            const dados = await MaquinaModel.obterPecasPorMinuto(req.user.id_empresa, dias, req.query.setorId);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter pecas por minuto:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter pecas por minuto'
            });
        }
    }

    static async obterResumoOeeMaquina(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const dados = await MaquinaModel.obterResumoOeeMaquina(id_maquina, req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter resumo OEE da maquina:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter o resumo OEE da maquina'
            });
        }
    }

    static async obterEvolucaoOeeMaquina(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const dados = await MaquinaModel.obterEvolucaoOeeMaquina(id_maquina, req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter evolucao OEE da maquina:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter a evolucao OEE da maquina'
            });
        }
    }

    static async obterVelocidadeMaquina(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const dados = await MaquinaModel.obterVelocidadeMaquina(id_maquina, req.user.id_empresa);
            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter velocidade da maquina:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter a velocidade da maquina'
            });
        }
    }

    // GET /maquinas/:id/top-motivos-parada
    static async obterTopMotivosParada(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const id_empresa = req.user.id_empresa;
            const dados = await MaquinaModel.obterTopMotivosParada(id_maquina, id_empresa);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter top motivos de parada:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter os principais motivos de parada'
            });
        }
    }

    // GET /maquinas/:id/refugos
    static async obterRefugosMaquina(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const id_empresa = req.user.id_empresa;
            const dados = await MaquinaModel.obterRefugosMaquina(id_maquina, id_empresa);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter refugos da maquina:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter os refugos da maquina'
            });
        }
    }

    // GET /maquinas/:id/historico-eventos
    static async obterHistoricoEventosTabela(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const limite = parseInt(req.query.limite) || 50;

            if (limite <= 0 || limite > 200) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite invalido',
                    mensagem: 'O limite deve ser um numero entre 1 e 200'
                });
            }

            const id_empresa = req.user.id_empresa;
            const dados = await MaquinaModel.obterHistoricoEventosTabela(id_maquina, id_empresa, limite);

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter historico de eventos da maquina:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter o historico da maquina'
            });
        }
    }

    static async eficienciaMaquina(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const id_operador = req.params.id_operador
            const dados = await MaquinaModel.eficienciaMaquina(id_empresa, id_operador)
            return res.status(200).json({
                sucesso: true,
                dados
            })
        } catch (error) {
            console.error('Erro ao obter eficiendia da máquina na ultima semana:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Nao foi possivel obter eficiendia da máquina na ultima semana'
            });
        }
    }

    // ---------------------------------------------------Tela de Gestor -----------------------------------------------

    static async pecasProduzidas7Dias(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const id_setor = Number(req.params.id_setor)
            const dados = await MaquinaModel.pecasProduzidas7Dias(
                id_setor,
                id_empresa
            )
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro no gráfico Peças Produzidas no últimos 7 Dias:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async statusMaquinas(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const id_setor = req.params.id_setor
            const dados = await MaquinaModel.statusMaquinasSetor(
                id_setor,
                id_empresa
            )
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro statusMaquinas:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    static async producaoMaquinas(req, res) {
        try {
            const id_empresa = req.user.id_empresa
            const id_setor = Number(req.params.id_setor)
            const dados = await MaquinaModel.producaoMaquinasSetor(
                id_setor,
                id_empresa
            )
            return res.status(200).json({ sucesso: true, dados })
        } catch (error) {
            console.error('Erro producaoMaquinas:', error)
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' })
        }
    }

    // POST /maquinas/:id/parar-sincronizacao - Cancela sessão de pareamento da placa
    static async pararSincronizacaoPlaca(req, res) {
        try {
            const id_maquina = MaquinaController.obterIdMaquina(req, res);
            if (!id_maquina) return;

            const id_empresa = req.user.id_empresa;

            await MaquinaModel.cancelarSessaoSincronizacaoPlaca({
                id_empresa,
                id_maquina
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Sincronização cancelada com sucesso.'
            });
        } catch (error) {
            console.error('Erro ao parar sincronização da placa:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível cancelar a sincronização da placa'
            });
        }
    }

}
export default MaquinaController;
