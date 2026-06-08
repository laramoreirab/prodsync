package com.senai.prodsync;

import com.google.gson.annotations.SerializedName;

public class OeeResponse {
    private double disponibilidade;
    private double performance;
    private double qualidade;
    
    @SerializedName("oee_total")
    private double oeeTotal;

    public double getDisponibilidade() { return disponibilidade; }
    public void setDisponibilidade(double disponibilidade) { this.disponibilidade = disponibilidade; }

    public double getPerformance() { return performance; }
    public void setPerformance(double performance) { this.performance = performance; }

    public double getQualidade() { return qualidade; }
    public void setQualidade(double qualidade) { this.qualidade = qualidade; }

    public double getOeeTotal() { return oeeTotal; }
    public void setOeeTotal(double oeeTotal) { this.oeeTotal = oeeTotal; }
}
