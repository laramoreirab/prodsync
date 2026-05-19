package com.senai.prodsync;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "maquinas")
public class Machine {
    @PrimaryKey
    @NonNull
    private String id;
    private String nome;
    private String status; // "Vermelho", "Verde", etc.
    
    @SerializedName("tempo_parada_minutos")
    private int tempoParadaMinutos;

    public Machine() {}

    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTempoParadaMinutos() { return tempoParadaMinutos; }
    public void setTempoParadaMinutos(int tempoParadaMinutos) { this.tempoParadaMinutos = tempoParadaMinutos; }
}
