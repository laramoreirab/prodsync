package com.senai.prodsync.ui.shared;

public class Usuario {
    private String nome;
    private String id;
    private String funcao;
    private String setor;
    private String email;
    private String turno;
    private String cpf;
    private String maquinaResponsavel; // Nome/ID da máquina
    private String fotoUrl;

    public Usuario(String nome, String id, String funcao, String setor, String email, String turno, String cpf, String maquinaResponsavel, String fotoUrl) {
        this.nome = nome;
        this.id = id;
        this.funcao = funcao;
        this.setor = setor;
        this.email = email;
        this.turno = turno;
        this.cpf = cpf;
        this.maquinaResponsavel = maquinaResponsavel;
        this.fotoUrl = fotoUrl;
    }

    public String getNome() { return nome; }
    public String getId() { return id; }
    public String getFuncao() { return funcao; }
    public String getSetor() { return setor; }
    public String getEmail() { return email; }
    public String getTurno() { return turno; }
    public String getCpf() { return cpf; }
    public String getMaquinaResponsavel() { return maquinaResponsavel; }
    public String getFotoUrl() { return fotoUrl; }
}
