package com.senai.prodsync.ui.shared;

public class Op {
    private String id;
    private String maquina;
    private String prioridade;
    private String dataFinal;
    private String setor;
    private String produto;
    private int quantidade;
    private String status;
    private String operador;
    private String dataInicio;
    private String fotoMaquinaUrl;

    public Op(String id, String maquina, String prioridade, String dataFinal, String setor, String produto, int quantidade, String status, String operador, String dataInicio, String fotoMaquinaUrl) {
        this.id = id;
        this.maquina = maquina;
        this.prioridade = prioridade;
        this.dataFinal = dataFinal;
        this.setor = setor;
        this.produto = produto;
        this.quantidade = quantidade;
        this.status = status;
        this.operador = operador;
        this.dataInicio = dataInicio;
        this.fotoMaquinaUrl = fotoMaquinaUrl;
    }

    public String getId() { return id; }
    public String getMaquina() { return maquina; }
    public String getPrioridade() { return prioridade; }
    public String getDataFinal() { return dataFinal; }
    public String getSetor() { return setor; }
    public String getProduto() { return produto; }
    public int getQuantidade() { return quantidade; }
    public String getStatus() { return status; }
    public String getOperador() { return operador; }
    public String getDataInicio() { return dataInicio; }
    public String getFotoMaquinaUrl() { return fotoMaquinaUrl; }
}
