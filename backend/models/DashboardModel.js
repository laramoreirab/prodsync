import prisma from '../config/prisma.js';

class DashboardModel {

    // Grafico global de producao acumulada do dia
    static async buscarProducaoDiaria(id_empresa, setorId = null) {
        try {
            const idSetor = setorId ? Number(setorId) : null;
            // Pega o inicio do dia atual
            const agora = new Date();
            const horaAtual = agora.getHours();
            const inicioDoDia = new Date(agora);
            inicioDoDia.setHours(0, 0, 0, 0);

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa: Number(id_empresa),
                    data_hora_fim: {
                        gte: inicioDoDia,
                        lte: agora
                    },
                    ...(idSetor ? { maquina: { id_setor: idSetor } } : {})
                },
                select: {
                    data_hora_fim: true,
                    qtd_boa: true
                },
                orderBy: { data_hora_fim: 'asc' }
            });

            // Agrupa por hora e transforma em total acumulado do dia
            if (apontamentos.length === 0) {
                return [];
            }

            const producaoPorHora = Array.from({ length: horaAtual + 1 }, () => 0);
            apontamentos.forEach(ap => {
                const horaLocal = ap.data_hora_fim.getHours();
                if (horaLocal < 0 || horaLocal > horaAtual) {
                    return;
                }

                producaoPorHora[horaLocal] += ap.qtd_boa || 0;
            });

            let producaoAcumulada = 0;
            return producaoPorHora.map((pcsHora, hora) => {
                producaoAcumulada += pcsHora;

                return {
                    hora: String(hora).padStart(2, '0') + 'h',
                    pcs: producaoAcumulada
                };
            });
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
    static async mediaParadasPorDia(id_empresa, setorId = null, dias = 7) {
        try {
            const idSetor = setorId ? Number(setorId) : null;
            const quantidadeDias = Number(dias) > 0 ? Number(dias) : 7;
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const amanha = new Date(hoje);
            amanha.setDate(amanha.getDate() + 1);

            const inicioPeriodo = new Date(hoje);
            inicioPeriodo.setDate(hoje.getDate() - (quantidadeDias - 1));

            const totalParadas = await prisma.historico_Eventos.count({
                where: {
                    id_empresa: Number(id_empresa),
                    ...(idSetor ? { setor_afetado: idSetor } : {}),
                    status_atual: { in: ['Parada', 'Manutencao'] },
                    inicio: {
                        gte: inicioPeriodo,
                        lt: amanha
                    }
                }
            });

            const mediaParadas = totalParadas / quantidadeDias;

            return {
                titulo: 'Média de Paradas por Dia',
                valor: String(Math.round(mediaParadas))
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
