package com.senai.prodsync;

import com.google.gson.annotations.SerializedName;

public class Machine {
    @SerializedName(value = "id_maquina", alternate = {"id", "_id"})
    private String id;
    
    @SerializedName(value = "nome_maquina", alternate = {"nome", "name", "maquina"})
    private String nome;
    
    private String status;
    private String serie;
    
    @SerializedName("setor")
    private SetorInfo setorInfo;

    public String getId() { return id != null ? id : "0"; }
    public String getNome() { return nome != null ? nome : "Máquina"; }
    public String getStatus() { return status != null ? status : "parada"; }
    public String getSerie() { return (serie != null) ? serie : "S/N"; }
    
    public String getSetor() { 
        if (setorInfo != null) {
            return (setorInfo.nomeSetor != null) ? setorInfo.nomeSetor : setorInfo.nome;
        }
        return "Geral";
    }

    public static class SetorInfo {
        @SerializedName(value = "nome_setor", alternate = {"nome", "setor"})
        public String nomeSetor;
        public String nome; // Fallback para nomes simples
    }
}
