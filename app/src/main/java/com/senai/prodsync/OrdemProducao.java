package com.senai.prodsync;

import androidx.annotation.NonNull;
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
    private SetorInfo setorInfo;

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

    public String getDataInicio() { return dataInicio; }
    public String getDataFinal() { return dataFinal != null ? dataFinal : "S/D"; }
    
    public String getSetor() { 
        return (setorInfo != null) ? setorInfo.nomeSetor : "Geral"; 
    }

    public static class SetorInfo {
        @SerializedName("nome_setor")
        public String nomeSetor;
    }

    public static class MaquinaInfo {
        public String nome;
        public OperadorInfo operador;
    }

    public static class OperadorInfo {
        public String nome;
    }
}
