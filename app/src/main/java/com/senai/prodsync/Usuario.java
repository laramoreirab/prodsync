package com.senai.prodsync;

public class Usuario {
    private String nome;
    private String id;
    private String funcao;
    private String setor;
    private int fotoRes; // Simulando recurso de imagem

    public Usuario(String nome, String id, String funcao, String setor, int fotoRes) {
        this.nome = nome;
        this.id = id;
        this.funcao = funcao;
        this.setor = setor;
        this.fotoRes = fotoRes;
    }

    public String getNome() { return nome; }
    public String getId() { return id; }
    public String getFuncao() { return funcao; }
    public String getSetor() { return setor; }
    public int getFotoRes() { return fotoRes; }
}