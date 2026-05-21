package com.senai.prodsync;

import com.google.gson.JsonElement;
import com.google.gson.annotations.SerializedName;

public class Usuario {
    @SerializedName(value = "id_usuario", alternate = {"id"})
    private String id;
    
    private String nome;
    
    @SerializedName(value = "funcao", alternate = {"tipo", "cargo"})
    private String funcao;
    
    @SerializedName("setor")
    private JsonElement setor; 
    
    @SerializedName("turno")
    private JsonElement turno;

    @SerializedName(value = "maquina", alternate = {"maquina_responsavel", "serie_maquina", "id_maquina"})
    private JsonElement maquina;
    
    @SerializedName(value = "email", alternate = {"email_usuario"})
    private String email;

    @SerializedName(value = "cpf", alternate = {"cpf_usuario"})
    private String cpf;
    
    @SerializedName(value = "imagem_perfil", alternate = {"foto", "foto_url"})
    private String fotoUrl;

    public String getId() { return id != null ? id : "0"; }
    
    public String getNome() { return nome != null ? nome : "Sem nome"; }
    
    public String getFuncao() { return funcao != null ? funcao : "Não informado"; }
    
    public String getEmail() { return (email != null && !email.isEmpty()) ? email : "Não informado"; }
    
    public String getCpf() { return (cpf != null && !cpf.isEmpty()) ? cpf : "Não informado"; }
    
    public String getFotoUrl() { 
        if (fotoUrl != null && !fotoUrl.startsWith("http") && !fotoUrl.isEmpty()) {
            return "https://prodsync-backend.onrender.com/uploads/imagens/" + fotoUrl;
        }
        return fotoUrl; 
    }

    public String getSetor() { 
        return extractString(setor, "nome_setor", "Geral");
    }

    public String getTurno() { 
        return extractString(turno, "nome_turno", "Não informado");
    }

    public String getMaquinaResponsavel() { 
        String res = extractString(maquina, "nome", null);
        if (res == null || res.equals("Nenhuma")) {
            res = extractString(maquina, "serie", "Nenhuma");
        }
        return res;
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
