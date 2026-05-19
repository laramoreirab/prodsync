package com.senai.prodsync;

import java.util.List;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;

public interface UserService {
    // Substitua pela URL da sua API no Render
    String BASE_URL = "https://sua-api-no-render.onrender.com/";

    @GET("usuarios") // Rota para buscar usuários
    Call<List<Usuario>> getUsuarios();

    static UserService getClient() {
        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(UserService.class);
    }
}
