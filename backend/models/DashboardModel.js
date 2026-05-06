import prisma from '../config/prisma.js';

class DashboardModel {

    // Gráfico global de produção ao longo do dia (Agrupado por hora)
    static async buscarProducaoDiaria(id_empresa) {
        try {
            // Pega o início do dia atual
            const inicioDoDia = new Date();
            inicioDoDia.setHours(0, 0, 0, 0);

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa: Number(id_empresa),
                    data_hora_fim: { gte: inicioDoDia }
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
    static async buscarTendenciaRefugo(id_empresa) {
        try {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            seteDiasAtras.setHours(0, 0, 0, 0); // Começa da meia-noite do dia 7

            const apontamentos = await prisma.apontamento.findMany({
                where: {
                    id_empresa: Number(id_empresa),
                    data_hora_fim: { gte: seteDiasAtras }
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
                data,
                refugos: quantidade
            }));
        }
        catch (error) {
            console.error('Erro ao buscar tendência de refugo:', error);
            throw new Error('Erro ao buscar tendência de refugo');
        }
    }

    // Média de paradas por dia e peças por minuto
    static async buscarParadasEPPM(id_empresa) {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const [paradasHoje, producaoHoje] = await Promise.all([
                prisma.historico_Eventos.count({
                    where: {
                        id_empresa: Number(id_empresa),
                        status_atual: 'Parada',
                        inicio: { gte: hoje }
                    }
                }),
                prisma.apontamento.aggregate({
                    where: {
                        id_empresa: Number(id_empresa),
                        data_hora_inicio: { gte: hoje }
                    },
                    _sum: { qtd_boa: true }
                })
            ]);

            const totalPecasHoje = producaoHoje._sum.qtd_boa || 0;

            const agora = new Date();
            const minutosPassados = Math.max(1, (agora.getTime() - hoje.getTime()) / 1000 / 60);

            const pecasPorMinuto = totalPecasHoje / minutosPassados;

            return {
                media_paradas_dia: paradasHoje,
                pecas_por_minuto: Math.round(pecasPorMinuto)
            };
        }
        catch (error) {
            console.error('Erro ao buscar paradas e EPPM:', error);
            throw new Error('Erro ao buscar paradas e EPPM');
        }
    }
}

export default DashboardModel;