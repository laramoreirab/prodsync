import prisma from '../config/prisma.js';

class DashboardModel {

    // Gráfico global de produção ao longo do dia (Agrupado por hora)
    static async buscarProducaoDiaria(id_empresa, setorId = null) {
        try {
            const idSetor = setorId ? Number(setorId) : null;
            // Pega o início do dia atual
            const inicioDoDia = new Date();
            inicioDoDia.setHours(0, 0, 0, 0);

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa: Number(id_empresa),
                    data_hora_fim: { gte: inicioDoDia },
                    ...(idSetor ? { maquina: { id_setor: idSetor } } : {})
                },
                select: {
                    data_hora_fim: true,
                    qtd_boa: true
                },
                orderBy: { data_hora_fim: 'asc' }
            });

            // Agrupa as quantidades por hora (ex: '07h', '08h')
            const producaoPorHora = {};
            apontamentos.forEach(ap => {
                // Formata para ter sempre dois dígitos (ex: "09h" em vez de "9h")
                const horaLocal = ap.data_hora_fim.getHours();
                const horaFormatada = String(horaLocal).padStart(2, '0') + 'h';

                if (!producaoPorHora[horaFormatada]) {
                    producaoPorHora[horaFormatada] = 0;
                }
                producaoPorHora[horaFormatada] += ap.qtd_boa || 0;
            });

            return Object.entries(producaoPorHora).map(([hora, pcs]) => ({
                hora,
                pcs
            }));
        }
        catch (error) {
            console.error('Erro ao buscar produção diária:', error);
            throw new Error('Erro ao buscar produção diária');
        }
    }

    // Gráfico de tendência de refugo (Últimos 7 dias)
    static async buscarTendenciaRefugo(id_empresa, setorId = null) {
        try {
            const idSetor = setorId ? Number(setorId) : null;
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            seteDiasAtras.setHours(0, 0, 0, 0); // Começa da meia-noite do dia 7

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa: Number(id_empresa),
                    data_hora_fim: { gte: seteDiasAtras },
                    ...(idSetor ? { maquina: { id_setor: idSetor } } : {})
                },
                select: {
                    data_hora_fim: true,
                    qtd_refugo: true
                },
                orderBy: { data_hora_fim: 'asc' }
            });

            const tendencia = {};
            apontamentos.forEach(ap => {
                // Evita que toISOString pule para o dia seguinte
                const d = ap.data_hora_fim;
                const dia = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                if (!tendencia[dia]) {
                    tendencia[dia] = 0;
                }
                tendencia[dia] += ap.qtd_refugo || 0;
            });

            return Object.entries(tendencia).map(([data, quantidade]) => ({
                dia: data,
                qtd: quantidade
            }));
        }
        catch (error) {
            console.error('Erro ao buscar tendência de refugo:', error);
            throw new Error('Erro ao buscar tendência de refugo');
        }
    }

    // Média de paradas por dia
    static async mediaParadasPorDia(id_empresa, setorId = null) {
        try {
            const idSetor = setorId ? Number(setorId) : null;
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const amanha = new Date(hoje);
            amanha.setDate(amanha.getDate() + 1);

            const dadosParadas = await prisma.historico_Eventos.aggregate({
                where: {
                    id_empresa: Number(id_empresa),
                    ...(idSetor ? { setor_afetado: idSetor } : {}),

                    id_motivo_parada: {
                        not: null
                    },
                    OR: [
                        {
                            inicio: {
                                gte: hoje,
                                lt: amanha
                            }
                        },
                        {
                            termino: {
                                gte: hoje,
                                lt: amanha
                            }
                        }
                    ]
                },

                _sum: {
                    duracao: true
                },

                _count: {
                    id_evento: true
                }
            });

            const totalDuracao = dadosParadas._sum.duracao || 0;

            const quantidadeParadas =
                dadosParadas._count.id_evento || 1;

            const mediaDuracao =
                totalDuracao / quantidadeParadas;

            return {
                titulo: 'Média de Paradas por Dia',
                valor: `${(mediaDuracao / 60).toFixed(1)}h`
            };

        } catch (error) {
            console.error('Erro ao buscar média de paradas:', error);
            throw new Error('Erro ao buscar média de paradas');
        }
    }

    // Top 3 motivos de parada mais frequentes na fábrica
    static async top3MotivosParadaGeral(id_empresa, setorId = null) {
        try {
            const idSetor = setorId ? Number(setorId) : null;
            // 1. Agrupa os eventos pelo ID do motivo e conta as ocorrências
            const motivosAgrupados = await prisma.historico_Eventos.groupBy({
                by: ['id_motivo_parada'],
                where: {
                    id_empresa,
                    ...(idSetor ? { setor_afetado: idSetor } : {}),
                    id_motivo_parada: { not: null }, // Garante que apenas eventos com motivo entrem
                    status_atual: { in: ['Parada', 'Setup'] } // Foca nos estados de interesse
                },
                _count: {
                    id_motivo_parada: true
                },
                orderBy: {
                    _count: {
                        id_motivo_parada: 'desc' // Ordena pelos mais frequentes
                    }
                },
                take: 3 // Pega apenas os 3 primeiros
            });

            if (motivosAgrupados.length === 0) {
                return Array(3).fill({
                    motivo: "Sem dados",
                    qtd: 0
                });
            }

            // 2. Busca as descrições dos motivos encontrados
            const idsMotivos = motivosAgrupados.map(m => m.id_motivo_parada);
            const motivosInfo = await prisma.motivos_Parada.findMany({
                where: {
                    id_empresa,
                    id_motivo: { in: idsMotivos }
                },
                select: {
                    id_motivo: true,
                    descricao: true
                }
            });

            // 3. Cria um mapa para busca rápida da descrição pelo ID
            const motivosMap = new Map(motivosInfo.map(m => [m.id_motivo, m.descricao]));

            // 4. Formata o retorno final
            return motivosAgrupados.map(item => ({
                motivo: motivosMap.get(item.id_motivo_parada) ?? 'Sem motivo informado',
                qtd: item._count.id_motivo_parada
            }));
        } catch (error) {
            console.error('Erro ao obter top 3 motivos de parada geral:', error);
            throw error;
        }
    }
}

export default DashboardModel;
