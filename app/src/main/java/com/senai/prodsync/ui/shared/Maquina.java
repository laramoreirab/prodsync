package com.senai.prodsync.ui.shared;

public class Maquina {
    private String nome;
    private String id;
    private String serie;
    private String setor;
    private String status; // "produzindo", "setup", "parada"

    public Maquina(String nome, String id, String serie, String setor, String status) {
        this.nome = nome;
        this.id = id;
        this.serie = serie;
        this.setor = setor;
        this.status = status;
    }

    public String getNome() { return nome; }
    public String getId() { return id; }
    public String getSerie() { return serie; }
    public String getSetor() { return setor; }
    public String getStatus() { return status; }
}