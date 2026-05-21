package com.senai.prodsync;

import com.google.gson.annotations.SerializedName;

public class LoginResponse {
    private boolean sucesso;
    private String mensagem;
    private Dados dados;

    public boolean isSucesso() { return sucesso; }
    public String getMensagem() { return mensagem; }
    public Dados getDados() { return dados; }

    public static class Dados {
        private String token;
        private String nome;
        private String tipo;
        
        @SerializedName("setor")
        private SetorInfo setorInfo;
        
        @SerializedName("id_usuario")
        private int idUsuario;
        
        @SerializedName("id_setor")
        private Integer idSetor;
        
        @SerializedName("id_empresa")
        private int idEmpresa;

        private String email;
        private String turno;
        private String cpf;
        
        @SerializedName("foto")
        private String fotoUrl;

        public String getToken() { return token; }
        public String getNome() { return nome; }
        public String getTipo() { return tipo; }
        
        public String getSetor() { 
            return (setorInfo != null) ? setorInfo.nomeSetor : "Geral"; 
        }
        
        public int getIdUsuario() { return idUsuario; }
        public Integer getIdSetor() { return idSetor; }
        public int getIdEmpresa() { return idEmpresa; }

        public String getEmail() { return email; }
        public String getTurno() { return turno; }
        public String getCpf() { return cpf; }
        public String getFotoUrl() { return fotoUrl; }

        // Classe interna para mapear o objeto setor do backend
        public static class SetorInfo {
            @SerializedName("nome_setor")
            public String nomeSetor;
        }
    }
}
