package com.senai.prodsync;

import androidx.annotation.NonNull;
import com.google.gson.annotations.SerializedName;

public class OrdemProducao {
    @NonNull
    @SerializedName(value = "id_ordem", alternate = {"id", "_id"})
    private String id;
    
    private String numero;
    private String produto;
    private int quantidade;
    private String status;
    private String prioridade;
    
    @SerializedName(value = "id_maquina", alternate = {"maquinaId"})
    private String maquinaId;
    
    @SerializedName(value = "data_entrega", alternate = {"dataFinal"})
    private String dataFinal;
    
    @SerializedName("setor")
    private SetorInfo setorInfo;

    public String getId() { return id; }
    public String getNumero() { return numero != null ? numero : id; }
    public String getProduto() { return produto; }
    public int getQuantidade() { return quantidade; }
    public String getStatus() { return status; }
    public String getPrioridade() { return prioridade != null ? prioridade : "Normal"; }
    public String getMaquinaId() { return maquinaId; }
    public String getDataFinal() { return dataFinal != null ? dataFinal : "S/D"; }
    
    public String getSetor() { 
        return (setorInfo != null) ? setorInfo.nomeSetor : "Geral"; 
    }

    public static class SetorInfo {
        @SerializedName("nome_setor")
        public String nomeSetor;
    }
}
