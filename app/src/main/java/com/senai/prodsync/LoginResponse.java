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

        public String getToken() { return token; }
        public String getNome() { return nome; }
        public String getTipo() { return tipo; }
        
        public String getSetor() { 
            return (setorInfo != null) ? setorInfo.nomeSetor : "Geral"; 
        }
        
        public int getIdUsuario() { return idUsuario; }
        public Integer getIdSetor() { return idSetor; }
        public int getIdEmpresa() { return idEmpresa; }

        // Classe interna para mapear o objeto setor do backend
        public static class SetorInfo {
            @SerializedName("nome_setor")
            public String nomeSetor;
        }
    }
}
