package com.senai.prodsync;

import androidx.annotation.NonNull;
import com.google.gson.annotations.SerializedName;

public class Usuario {
    @NonNull
    @SerializedName("id_usuario")
    private String id;
    
    private String nome;
    
    @SerializedName(value = "tipo", alternate = {"cargo", "funcao", "role", "tipo_usuario", "nivel", "cargo_usuario", "tipo_acesso"})
    private String funcao;
    
    @SerializedName("setor")
    private SetorInfo setorInfo;
    
    @SerializedName(value = "email", alternate = {"email_usuario", "contato"})
    private String email;

    private String turno;

    @SerializedName(value = "cpf", alternate = {"cpf_usuario", "documento"})
    private String cpf;
    
    @SerializedName("maquina_responsavel")
    private String maquinaResponsavel;
    
    @SerializedName("foto")
    private String fotoUrl;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getFuncao() { return funcao; }
    public void setFuncao(String funcao) { this.funcao = funcao; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTurno() { return turno; }
    public void setTurno(String turno) { this.turno = turno; }
    
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

    public String getMaquinaResponsavel() { return maquinaResponsavel; }
    public void setMaquinaResponsavel(String maquinaResponsavel) { this.maquinaResponsavel = maquinaResponsavel; }

    public String getSetor() { 
        return (setorInfo != null) ? setorInfo.nomeSetor : "Geral"; 
    }

    public static class SetorInfo {
        @SerializedName("nome_setor")
        public String nomeSetor;
    }
}
