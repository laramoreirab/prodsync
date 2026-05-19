package com.senai.prodsync;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "usuarios")
public class Usuario {
    @PrimaryKey
    @NonNull
    private String id;
    private String nome;
    private String funcao;
    private String setor;
    private String email;
    private String turno;
    private String cpf;
    private String maquinaResponsavel;
    private int fotoRes;

    public Usuario(@NonNull String id, String nome, String funcao, String setor, String email, String turno, String cpf, String maquinaResponsavel, int fotoRes) {
        this.id = id;
        this.nome = nome;
        this.funcao = funcao;
        this.setor = setor;
        this.email = email;
        this.turno = turno;
        this.cpf = cpf;
        this.maquinaResponsavel = maquinaResponsavel;
        this.fotoRes = fotoRes;
    }

    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getFuncao() { return funcao; }
    public void setFuncao(String funcao) { this.funcao = funcao; }

    public String getSetor() { return setor; }
    public void setSetor(String setor) { this.setor = setor; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTurno() { return turno; }
    public void setTurno(String turno) { this.turno = turno; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getMaquinaResponsavel() { return maquinaResponsavel; }
    public void setMaquinaResponsavel(String maquinaResponsavel) { this.maquinaResponsavel = maquinaResponsavel; }

    public int getFotoRes() { return fotoRes; }
    public void setFotoRes(int fotoRes) { this.fotoRes = fotoRes; }
}
