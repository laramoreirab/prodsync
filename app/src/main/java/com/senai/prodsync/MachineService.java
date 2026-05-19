package com.senai.prodsync;

import java.util.List;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;

public interface MachineService {
    // ESTE É O ENDPOINT DA API RENDER. 
    // Substitua 'sua-api-no-render' pelo seu subdomínio real.
    String BASE_URL = "https://sua-api-no-render.onrender.com/";

    @GET("maquinas") // Altere para o caminho correto da sua API
    Call<List<Machine>> getMaquinas();

    static MachineService getClient() {
        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(MachineService.class);
    }
}
