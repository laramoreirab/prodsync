import prisma from '../config/prisma.js';
import OEEModel from '../models/OEEModel.js';
import EscalaTrabalhoModel from '../models/EscalaTrabalhoModel.js';
import MaquinaModel from '../models/MaquinaModel.js';

class AndonController {
    /**
     * GET /api/andon/status_maquinas?scope=factory|sector&id_setor=<id>
     * Retorna contagem de máquinas por status (emProducao, emSetup, emParada)
     * Formato esperado pelo schema: { emProducao, emSetup, emParada }
     */
    static async getStatusMaquinas(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { scope, id_setor } = req.query;

            const whereClause = { id_empresa };
            if (scope === 'sector' && id_setor) {
                whereClause.setores = {
                    some: { id_setor: parseInt(id_setor) }
                };
            }

            const maquinas = await prisma.maquinas.findMany({
                where: whereClause,
                select: { status_atual: true }
            });

            const contagem = {
                emProducao: 0,
                emSetup: 0,
                emParada: 0
            };

            for (const maquina of maquinas) {
                if (maquina.status_atual === 'Produzindo') {
                    contagem.emProducao++;
                } else if (maquina.status_atual === 'Setup') {
                    contagem.emSetup++;
                } else if (
                    maquina.status_atual === 'Parada' ||
                    maquina.status_atual === 'Manutencao' ||
                    maquina.status_atual === 'Aguardando'
                ) {
                    contagem.emParada++;
                }
            }

            return res.status(200).json(contagem);
        } catch (error) {
            console.error('Erro ao buscar status das máquinas (Andon):', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    /**
     * GET /api/andon/ranking_produtividade?scope=factory|sector&id_setor=<id>
     * Retorna ranking de produtividade por setor (OEE médio)
     * Formato: [{ setor: string, produtividade: number }]
     */
    static async getRankingProdutividade(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { scope, id_setor } = req.query;

            let setores;

            if (scope === 'sector' && id_setor) {
                // Retorna apenas o setor solicitado
                const setor = await prisma.setores.findFirst({
                    where: { id_setor: parseInt(id_setor), id_empresa }
                });
                setores = setor ? [setor] : [];
            } else {
                // Retorna todos os setores da empresa
                setores = await prisma.setores.findMany({
                    where: { id_empresa }
                });
            }

            const ranking = await Promise.all(
                setores.map(async setor => {
                    const oee = await OEEModel.calcularOEESetor(setor.id_setor, id_empresa);
                    return {
                        setor: setor.nome_setor,
                        produtividade: oee.oee ?? 0
                    };
                })
            );

            // Ordena por produtividade decrescente
            ranking.sort((a, b) => b.produtividade - a.produtividade);

            return res.status(200).json(ranking);
        } catch (error) {
            console.error('Erro ao buscar ranking de produtividade (Andon):', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    /**
     * GET /api/andon/secoes?scope=factory|sector&id_setor=<id>
     * Retorna as seções (setores) com os cards de máquinas
     * Formato: [{ id, titulo, maquinas: [{ id, codigo, status, operador, detalheLabel, detalheValor, metaTurno, metaDia, oee, tempoStatus }] }]
     */
    static async getSecoes(req, res) {
        try {
            const id_empresa = req.user.id_empresa;
            const { scope, id_setor } = req.query;

            const whereSetor = { id_empresa };
            if (scope === 'sector' && id_setor) {
                whereSetor.id_setor = parseInt(id_setor);
            }

            const setores = await prisma.setores.findMany({
                where: whereSetor,
                include: {
                    maquinas: {
                        where: { id_empresa },
                        select: {
                            id_maquina: true,
                            nome: true,
                            serie: true,
                            status_atual: true,
                            id_empresa: true
                        }
                    }
                }
            });

            const agora = new Date();

            const secoes = await Promise.all(
                setores
                    .filter(setor => setor.maquinas.length > 0)
                    .map(async setor => {
                        const maquinasCards = await Promise.all(
                            setor.maquinas.map(async maquina => {
                                // Busca operador atual da máquina
                                const escalaInfo = await EscalaTrabalhoModel.buscarOperadorAtualDaMaquina(
                                    maquina.id_maquina,
                                    id_empresa,
                                    agora
                                );

                                // Busca OEE da máquina
                                const oee = await OEEModel.obterOeeMaquina(
                                    maquina.id_maquina,
                                    id_empresa
                                );

                                // Busca último evento ativo da máquina
                                const ultimoEvento = await prisma.historico_Eventos.findFirst({
                                    where: {
                                        id_maquina: maquina.id_maquina,
                                        id_empresa,
                                        termino: null // evento em andamento
                                    },
                                    include: {
                                        motivo_parada: { select: { descricao: true } }
                                    },
                                    orderBy: { inicio: 'desc' }
                                });

                                // Busca ordem de produção ativa
                                const ordemAtiva = await prisma.ordemProducao.findFirst({
                                    where: {
                                        id_maquina: maquina.id_maquina,
                                        id_empresa,
                                        status_op: 'Em_Andamento'
                                    },
                                    select: {
                                        id_ordem: true,
                                        qtd_planejada: true,
                                        apontamentos: {
                                            select: { qtd_boa: true, qtd_refugo: true }
                                        }
                                    }
                                });

                                // Calcula peças produzidas na ordem ativa
                                const pecasProduzidas = ordemAtiva
                                    ? ordemAtiva.apontamentos.reduce((acc, a) => acc + (a.qtd_boa ?? 0), 0)
                                    : 0;
                                const metaTurno = ordemAtiva
                                    ? `${pecasProduzidas}/${ordemAtiva.qtd_planejada} peças`
                                    : 'Sem OP ativa';

                                // Normaliza o status para o formato do schema
                                const statusMap = {
                                    Produzindo: 'emProducao',
                                    Setup: 'emSetup',
                                    Parada: 'emParada',
                                    Manutencao: 'emParada',
                                    Aguardando: 'emParada'
                                };
                                const status = statusMap[maquina.status_atual] ?? 'emParada';

                                // Calcula tempo no status atual (baseado no último evento)
                                let tempoStatus = '';
                                if (ultimoEvento) {
                                    const diffMs = agora - new Date(ultimoEvento.inicio);
                                    const diffMin = Math.floor(diffMs / 60000);
                                    const horas = Math.floor(diffMin / 60);
                                    const minutos = diffMin % 60;
                                    const statusLabel = status === 'emProducao'
                                        ? 'Em produção há'
                                        : status === 'emSetup'
                                            ? 'Em setup há'
                                            : 'Parada há';
                                    tempoStatus = horas > 0
                                        ? `${statusLabel} ${horas}h ${minutos}m`
                                        : `${statusLabel} ${minutos}m`;
                                } else {
                                    tempoStatus = status === 'emProducao' ? 'Em produção' : 'Status desconhecido';
                                }

                                // Detalhe do card (motivo de parada ou velocidade)
                                let detalheLabel = 'Velocidade';
                                let detalheValor = '-';
                                if (status !== 'emProducao' && ultimoEvento?.motivo_parada) {
                                    detalheLabel = 'Motivo';
                                    detalheValor = ultimoEvento.motivo_parada.descricao;
                                } else if (status !== 'emProducao' && ultimoEvento) {
                                    detalheLabel = 'Motivo';
                                    detalheValor = 'Sem justificativa';
                                }

                                return {
                                    id: String(maquina.id_maquina),
                                    codigo: maquina.serie ?? maquina.nome,
                                    status,
                                    operador: escalaInfo?.operador ?? 'Sem operador',
                                    detalheLabel,
                                    detalheValor,
                                    metaTurno,
                                    metaDia: metaTurno, // fallback igual ao turno por ora
                                    oee: oee?.oee ?? 0,
                                    tempoStatus
                                };
                            })
                        );

                        return {
                            id: String(setor.id_setor),
                            titulo: setor.nome_setor,
                            maquinas: maquinasCards
                        };
                    })
            );

            // Filtra seções sem máquinas (segurança extra)
            const secoesFiltradas = secoes.filter(s => s.maquinas.length > 0);

            return res.status(200).json(secoesFiltradas);
        } catch (error) {
            console.error('Erro ao buscar seções do Andon:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
  
  //--------------------------------------Parte de operador ------------------------------------
  
  static obterScope(req) {
        return req.query.scope === 'sector' ? 'sector' : 'factory';
    }

    static async obterStatusMaquinas(req, res) {
        try {
            const dados = await MaquinaModel.obterAndonStatus(
                req.user.id_empresa,
                AndonController.obterScope(req),
                req.user.id_usuario
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter status do Andon:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    static async obterRankingProdutividade(req, res) {
        try {
            const dados = await MaquinaModel.obterAndonRanking(
                req.user.id_empresa,
                AndonController.obterScope(req),
                req.user.id_usuario
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter ranking do Andon:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    static async obterSecoes(req, res) {
        try {
            const dados = await MaquinaModel.obterAndonSecoes(
                req.user.id_empresa,
                AndonController.obterScope(req),
                req.user.id_usuario
            );

            return res.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao obter secoes do Andon:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }
}

export default AndonController;
