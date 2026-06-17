package com.senai.prodsync;

import androidx.annotation.NonNull;
import com.google.gson.JsonElement;
import com.google.gson.annotations.SerializedName;

public class OrdemProducao {
    @NonNull
    @SerializedName(value = "id_ordem", alternate = {"id", "_id"})
    private String id;
    
    private String numero;
    private String produto;
    @SerializedName(value = "qtd_planejada", alternate = {"quantidade"})
    private int quantidade;
    
    @SerializedName("status_op")
    private String statusOp;
    
    @SerializedName("status")
    private String statusApi;
    
    private String prioridade;
    
    @SerializedName(value = "id_maquina", alternate = {"maquinaId"})
    private String maquinaId;

    @SerializedName("maquina")
    private MaquinaInfo maquinaInfo;
    
    @SerializedName("data_inicio")
    private String dataInicio;

    @SerializedName(value = "data_fim", alternate = {"data_entrega", "dataFinal"})
    private String dataFinal;
    
    @SerializedName("setor")
    private JsonElement setor;

    public String getId() { return id; }
    public String getNumero() { return numero != null ? numero : id; }
    public String getProduto() { return produto; }
    public int getQuantidade() { return quantidade; }
    
    public String getStatus() { 
        if (statusOp != null && !statusOp.isEmpty()) return statusOp;
        if (statusApi != null && !statusApi.isEmpty()) return statusApi;
        return "parada";
    }
    public String getPrioridade() { return prioridade != null ? prioridade : "Normal"; }
    public String getMaquinaId() { return maquinaId; }

    public String getNomeMaquina() {
        return (maquinaInfo != null) ? maquinaInfo.nome : maquinaId;
    }

    public String getNomeOperador() {
        return (maquinaInfo != null && maquinaInfo.operador != null) ? maquinaInfo.operador.nome : "Nenhum";
    }

    public String getFotoMaquinaUrl() {
        if (maquinaInfo != null) {
            String imagem = maquinaInfo.imagem;
            if (imagem != null && !imagem.startsWith("http") && !imagem.isEmpty()) {
                return "https://prodsync-backend.onrender.com/uploads/imagens/" + imagem;
            }
            return imagem;
        }
        return null;
    }

    public String getDataInicio() { return dataInicio; }
    public String getDataFinal() { return dataFinal != null ? dataFinal : "S/D"; }
    
    public String getSetor() { 
        String nome = extractString(setor, "nome_setor", null);
        if (nome == null) nome = extractString(setor, "nome", null);
        
        if (nome == null && maquinaInfo != null) {
            nome = extractString(maquinaInfo.setor, "nome_setor", null);
            if (nome == null) nome = extractString(maquinaInfo.setor, "nome", null);
        }
        
        return (nome != null) ? nome : "Geral";
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

    public static class MaquinaInfo {
        public String nome;
        public String imagem;
        public OperadorInfo operador;
        @SerializedName("setor")
        public JsonElement setor;
    }

    public static class OperadorInfo {
        public String nome;
    }
}
