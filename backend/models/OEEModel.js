import prisma from '../config/prisma.js';

// Disponibilidade = (tempo_disponivel - tempo_parado) / tempo_disponivel
// Performance     = (qtd_boa + qtd_refugo) / qtd_planejada
// Qualidade       = qtd_boa / (qtd_boa + qtd_refugo)
// OEE             = Disponibilidade × Performance × Qualidade × 100

class OEEModel {
    static async calcularOEE(tempo_disponivel, tempo_parado, qtd_planejada, qtd_boa, qtd_refugo) {
        const tempo_produzindo = tempo_disponivel - tempo_parado

        const disponibilidade = tempo_disponivel > 0 ? tempo_produzindo / tempo_disponivel : 0

        const performance = qtd_planejada > 0 ? (qtd_boa + qtd_refugo) / qtd_planejada : 0

        const qualidade = (qtd_boa + qtd_refugo) > 0 ? qtd_boa / (qtd_boa + qtd_refugo) : 0

        const oee = disponibilidade * performance * qualidade

        return {
            disponibilidade: Math.round(disponibilidade * 100),
            performance: Math.round(performance * 100),
            qualidade: Math.round(qualidade * 100),
            oee: Math.round(oee * 100)
        }

    }
    static async buscaTempoDisponivel(id_empresa) {
        const turnos = await prisma.turno.findMany({
            where: { id_empresa: id_empresa }
        })

        return turnos.reduce((acc, t) => { //reduce percorre o array de turnos e "reduz" todos esses objetos a um único valor numérico (a soma total).
            const inicio = new Date(t.hora_inicio)
            const fim = new Date(t.hora_fim)
            return acc + (fim - inicio) / 1000 / 60 // em minutos
        }, 0)
    }

    static async geralFabrica(id_empresa) {
        const [apontamentos, ordens, paradas, tempo_disponivel] = await Promise.all([ //dispara todas as consultas ao banco de dados ao mesmo tempo.
            prisma.apontamento.aggregate({
                where: { id_empresa: id_empresa },
                _sum: { qtd_boa: true, qtd_refugo: true }
            }),
            prisma.ordemproducao.aggregate({
                where: { id_empresa: id_empresa },
                _sum: { qtd_planejada: true }
            }),
            prisma.historico_eventos.aggregate({
                where: { id_empresa: id_empresa, duracao: { not: null } },
                _sum: { duracao: true }
            }),
            buscarTempoDisponivel(id_empresa)
        ])
        return calcularOEE({
            tempo_disponivel,
            tempo_parado: paradas._sum.duracao ?? 0,
            qtd_planejada: ordens._sum.qtd_planejada ?? 0,
            qtd_boa: apontamentos._sum.qtd_boa ?? 0,
            qtd_refugo: apontamentos._sum.qtd_refugo ?? 0
        })
    }

    static async individualMaquina(id_maquina, id_empresa) {
        const [apontamentos, ordens, paradas, tempo_disponivel] = await Promise.all([
            prisma.apontamento.aggregate({
                where: { id_maquina: id_maquina, id_empresa: id_empresa },
                _sum: { qtd_boa: true, qtd_refugo: true }
            }),
            prisma.ordemproducao.aggregate({
                where: { id_maquina: id_maquina, id_empresa: id_empresa },
                _sum: { qtd_planejada: true }
            }),
            prisma.historico_eventos.aggregate({
                where: { id_maquina: id_maquina, id_empresa: id_empresa, duracao: { not: null } },
                _sum: { duracao: true }
            }),
            buscarTempoDisponivel(id_empresa)
        ])

        return calcularOEE({
            tempo_disponivel,
            tempo_parado: paradas._sum.duracao ?? 0,
            qtd_planejada: ordens._sum.qtd_planejada ?? 0,
            qtd_boa: apontamentos._sum.qtd_boa ?? 0,
            qtd_refugo: apontamentos._sum.qtd_refugo ?? 0
        })
    }

    static async calcularOEESetor(id_setor, id_empresa) {
        const [apontamentos, ordens, paradas, tempo_disponivel] = await Promise.all([
            prisma.apontamento.aggregate({
                where: {
                    id_empresa: id_empresa,
                    maquina: { id_setor: id_setor }   // join via relação
                },
                _sum: { qtd_boa: true, qtd_refugo: true }
            }),
            prisma.ordemProducao.aggregate({
                where: { id_empresa: id_empresa, id_setor: id_setor },
                _sum: { qtd_planejada: true }
            }),
            prisma.historico_Eventos.aggregate({
                where: {
                    id_empresa: id_empresa,
                    setor_afetado: id_setor,
                    duracao: { not: null }
                },
                _sum: { duracao: true }
            }),
            buscarTempoDisponivel(id_empresa)
        ])

        return calcularOEE({
            tempo_disponivel,
            tempo_parado: paradas._sum.duracao ?? 0,
            qtd_planejada: ordens._sum.qtd_planejada ?? 0,
            qtd_boa: apontamentos._sum.qtd_boa ?? 0,
            qtd_refugo: apontamentos._sum.qtd_refugo ?? 0
        })
    }
    static async mediaPorSetor(id_empresa) {
        const setores = await prisma.setores.findMany({
            where: { id_empresa: id_empresa }
        })

        const resultados = await Promise.all(
            setores.map(async (setor) => {
                const oee = await calcularOEESetor(setor.id_setor, id_empresa)

                return {
                    setor: setor.nome_setor,  // eixo X
                    oee: oee.oee            //  eixo Y
                }
            })
        )

        return resultados
    }

    static async setorCritico(id_empresa) {
        const setores = await medioPorSetor(id_empresa) // reutiliza o cálculo acima

        // ordena por OEE crescente e pega o primeiro (pior)
        const critico = setores.sort((a, b) => a.oee - b.oee)[0]

        return critico ?? null
    }
    static async individualSetor(id_setor, id_empresa) {
        const setor = await prisma.setores.findUnique({
            where: { id_setor: id_setor }
        })

        const oee = await calcularOEESetor(id_setor, id_empresa)

        return {
            id_setor: setor.id_setor,
            nome_setor: setor.nome_setor,
            ...oee
        }
    }
    static async maquinaPorOP(id_maquina, id_ordem, id_empresa) {
        const [apontamentos, ordem, paradas, tempoDisponivel] = await Promise.all([
            prisma.apontamento.aggregate({
                where: {
                    id_maquina: id_maquina,
                    id_ordemProducao: id_ordem,
                    id_empresa: id_empresa
                },
                _sum: { qtd_boa: true, qtd_refugo: true }
            }),
            prisma.ordemproducao.findUnique({
                where: { id_ordem: id_ordem }
            }),
            prisma.historico_eventos.aggregate({
                where: {
                    id_maquina: id_maquina,
                    id_ordemProducao: id_ordem,
                    id_empresa: id_empresa,
                    duracao: { not: null }
                },
                _sum: { duracao: true }
            }),
            buscarTempoDisponivel(id_empresa)
        ])

        return {
            id_maquina: id_maquina,
            id_ordem: id_ordem,
            produto: ordem.produto,
            ...calcularOEE({
                tempo_disponivel,
                tempo_parado: paradas._sum.duracao ?? 0,
                qtd_planejada: ordem.qtd_planejada ?? 0,
                qtd_boa: apontamentos._sum.qtd_boa ?? 0,
                qtd_refugo: apontamentos._sum.qtd_refugo ?? 0
            })
        }
    }
}

export default OEEModel