package com.senai.prodsync;

import com.google.gson.JsonElement;
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
        private JsonElement setor;
        
        @SerializedName("id_usuario")
        private int idUsuario;
        
        @SerializedName("id_setor")
        private Integer idSetor;
        
        @SerializedName("id_empresa")
        private int idEmpresa;

        private String email;
        
        @SerializedName("turno")
        private JsonElement turno;
        
        private String cpf;
        
        @SerializedName(value = "foto", alternate = {"imagem_perfil"})
        private String fotoUrl;

        public String getToken() { return token; }
        public String getNome() { return nome; }
        public String getTipo() { return tipo; }
        
        public String getSetor() { 
            return extractString(setor, "nome_setor", "Geral");
        }
        
        public int getIdUsuario() { return idUsuario; }
        public Integer getIdSetor() { return idSetor; }
        public int getIdEmpresa() { return idEmpresa; }

        public String getEmail() { return email; }
        public String getTurno() { 
            return extractString(turno, "nome_turno", "Não informado");
        }
        public String getCpf() { return cpf; }
        public String getFotoUrl() { 
            if (fotoUrl != null && !fotoUrl.startsWith("http") && !fotoUrl.isEmpty()) {
                return "https://prodsync-backend.onrender.com/uploads/imagens/" + fotoUrl;
            }
            return fotoUrl; 
        }

        private String extractString(JsonElement element, String fieldName, String defaultValue) {
            if (element == null || element.isJsonNull()) return defaultValue;
            if (element.isJsonPrimitive()) return element.getAsString();
            if (element.isJsonObject()) {
                JsonElement field = element.getAsJsonObject().get(fieldName);
                if (field != null && !field.isJsonNull()) {
                    return field.getAsString();
                }
            }
            return defaultValue;
        }
    }
}
