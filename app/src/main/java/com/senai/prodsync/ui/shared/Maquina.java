package com.senai.prodsync.ui.shared;

public class Maquina {
    private String nome;
    private String id;
    private String serie;
    private String setor;
    private String status; // "produzindo", "setup", "parada"
    private String fotoUrl;
    private String dataAquisicao;
    private String capacidade;
    private String operador;

    public Maquina(String nome, String id, String serie, String setor, String status, String fotoUrl, String dataAquisicao, String capacidade, String operador) {
        this.nome = nome;
        this.id = id;
        this.serie = serie;
        this.setor = setor;
        this.status = status;
        this.fotoUrl = fotoUrl;
        this.dataAquisicao = dataAquisicao;
        this.capacidade = capacidade;
        this.operador = operador;
    }

    public String getNome() { return nome; }
    public String getId() { return id; }
    public String getSerie() { return serie; }
    public String getSetor() { return setor; }
    public String getStatus() { return status; }
    public String getFotoUrl() { return fotoUrl; }
    public String getDataAquisicao() { return dataAquisicao; }
    public String getCapacidade() { return capacidade; }
    public String getOperador() { return operador; }
}
