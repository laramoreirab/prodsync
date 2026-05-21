package com.senai.prodsync;

import java.util.List;
import java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Header;

public interface UserService {
    String BASE_URL = "https://prodsync-backend.onrender.com/api/";

    @GET("usuarios/listarSemAdms")
    Call<ApiResponse<List<Usuario>>> getUsuarios(@Header("Authorization") String token);

    @GET("usuarios/listar")
    Call<ApiResponse<List<Usuario>>> getUsuariosCompleto(@Header("Authorization") String token);

    @GET("usuarios")
    Call<ApiResponse<List<Usuario>>> getUsuariosBase(@Header("Authorization") String token);

    @GET("usuarios/{id}")
    Call<ApiResponse<Usuario>> getUsuarioPorId(@Header("Authorization") String token, @retrofit2.http.Path("id") int id);

    static UserService getClient() {
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(logging)
                .connectTimeout(90, TimeUnit.SECONDS)
                .readTimeout(90, TimeUnit.SECONDS)
                .writeTimeout(90, TimeUnit.SECONDS)
                .build();

        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(UserService.class);
    }
}
