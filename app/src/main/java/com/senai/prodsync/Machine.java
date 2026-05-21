package com.senai.prodsync;

import com.google.gson.annotations.SerializedName;

public class Machine {
    @SerializedName(value = "id_maquina", alternate = {"id", "_id"})
    private String id;
    
    @SerializedName(value = "nome_maquina", alternate = {"nome", "name", "maquina"})
    private String nome;
    
    @SerializedName("status_atual")
    private String statusAtual;

    @SerializedName("status")
    private String statusApi;

    @SerializedName("id_operador")
    private Integer idOperador;

    @SerializedName("operador")
    private OperadorInfo operador;

    private String serie;
    
    @SerializedName("capacidade")
    private String capacidade;

    @SerializedName("data_aquisicao")
    private String dataAquisicao;

    @SerializedName("foto")
    private String fotoUrl;
    
    @SerializedName("setor")
    private SetorInfo setorInfo;

    public String getId() { return id != null ? id : "0"; }
    public String getNome() { return nome != null ? nome : "Máquina"; }
    
    public String getStatus() { 
        if (statusAtual != null && !statusAtual.isEmpty()) return statusAtual;
        if (statusApi != null && !statusApi.isEmpty()) return statusApi;
        return "parada"; 
    }
    public Integer getIdOperador() { return idOperador; }

    public String getNomeOperador() {
        return (operador != null && operador.nome != null) ? operador.nome : "Nenhum";
    }

    public String getSerie() { return (serie != null) ? serie : "S/N"; }
    public String getCapacidade() { return capacidade != null ? capacidade : "N/A"; }
    public String getDataAquisicao() { return dataAquisicao; }
    public String getFotoUrl() { return fotoUrl; }
    
    public String getSetor() { 
        if (setorInfo != null) {
            return (setorInfo.nomeSetor != null) ? setorInfo.nomeSetor : setorInfo.nome;
        }
        return "Geral";
    }

    public static class SetorInfo {
        @SerializedName(value = "nome_setor", alternate = {"setor"})
        public String nomeSetor;

        @SerializedName("nome")
        public String nome;
    }

    public static class OperadorInfo {
        @SerializedName("nome")
        public String nome;
    }
}
