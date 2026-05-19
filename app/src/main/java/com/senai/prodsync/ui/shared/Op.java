package com.senai.prodsync.ui.shared;

public class Op {
    private String id;
    private String maquina;
    private String prioridade;
    private String dataFinal;
    private String setor;

    public Op(String id, String maquina, String prioridade, String dataFinal, String setor) {
        this.id = id;
        this.maquina = maquina;
        this.prioridade = prioridade;
        this.dataFinal = dataFinal;
        this.setor = setor;
    }

    public String getId() { return id; }
    public String getMaquina() { return maquina; }
    public String getPrioridade() { return prioridade; }
    public String getDataFinal() { return dataFinal; }
    public String getSetor() { return setor; }
}