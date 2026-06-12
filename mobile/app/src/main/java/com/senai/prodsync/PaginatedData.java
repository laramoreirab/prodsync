package com.senai.prodsync;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class PaginatedData<T> {
    // Adicionei mais nomes alternativos para garantir que o GSON encontre a lista
    @SerializedName(value = "maquinas", alternate = {"registros", "itens", "ordens", "data", "rows", "docs", "results"})
    private List<T> list;

    private int total;

    public List<T> getList() {
        return list;
    }

    public int getTotal() {
        return total;
    }
}
