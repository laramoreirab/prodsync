package com.senai.prodsync.ui.shared;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.senai.prodsync.ApiResponse;
import com.senai.prodsync.R;
import com.senai.prodsync.UserService;
import com.senai.prodsync.Usuario;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UsuariosFragment extends Fragment {

    private RecyclerView rvUsuarios;
    private UsuarioAdapter adapter;
    private EditText etSearch;
    private View layoutNoResults;
    private View layoutLoading;
    private String userRole;
    private boolean isLoading = false;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getActivity() != null) {
            SharedPreferences prefs = getActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
            userRole = prefs.getString("tipo", "gestor");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_usuarios, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        rvUsuarios = view.findViewById(R.id.rv_usuarios);
        etSearch = view.findViewById(R.id.et_search);
        TextView tvSetor = view.findViewById(R.id.tv_setor);
        layoutNoResults = view.findViewById(R.id.layout_no_results);
        layoutLoading = view.findViewById(R.id.layout_loading);

        if (tvSetor != null) tvSetor.setVisibility("adm".equals(userRole) ? View.VISIBLE : View.GONE);

        adapter = new UsuarioAdapter(new ArrayList<>(), userRole, usuario -> {
            UsuarioDetalheFragment fragment = UsuarioDetalheFragment.newInstance(usuario);
            if (getParentFragmentManager() != null) {
                getParentFragmentManager().beginTransaction()
                        .setCustomAnimations(R.anim.fade_in, R.anim.fade_out, R.anim.fade_in, R.anim.fade_out)
                        .replace(R.id.fragmentContainer, fragment)
                        .addToBackStack(null)
                        .commit();
            }
        });

        rvUsuarios.setLayoutManager(new LinearLayoutManager(getContext()));
        rvUsuarios.setAdapter(adapter);

        sincronizarComApi();

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (adapter != null && !isLoading) {
                    int countResults = adapter.filtrar(s.toString());
                    atualizarVisibilidade(countResults == 0);
                }
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void sincronizarComApi() {
        if (getContext() == null) return;
        
        showLoading(true);
        SharedPreferences prefs = getContext().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");

        UserService.getClient().getUsuariosBase(token).enqueue(new Callback<ApiResponse<List<Usuario>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Usuario>>> call, Response<ApiResponse<List<Usuario>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                    showLoading(false);
                    List<Usuario> dados = response.body().getDados();
                    adapter.atualizarLista(dados);
                    atualizarVisibilidade(dados == null || dados.isEmpty());
                } else {
                    tentarFallback(token);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<Usuario>>> call, Throwable t) {
                tentarFallback(token);
            }
        });
    }

    private void tentarFallback(String token) {
        UserService.getClient().getUsuarios(token).enqueue(new Callback<ApiResponse<List<Usuario>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Usuario>>> call, Response<ApiResponse<List<Usuario>>> response) {
                showLoading(false);
                if (response.isSuccessful() && response.body() != null) {
                    List<Usuario> dados = response.body().getDados();
                    adapter.atualizarLista(dados);
                    atualizarVisibilidade(dados == null || dados.isEmpty());
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<Usuario>>> call, Throwable t) {
                showLoading(false);
                if (getContext() != null)
                    Toast.makeText(getContext(), "Erro ao carregar usuários", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showLoading(boolean loading) {
        this.isLoading = loading;
        if (layoutLoading != null) {
            layoutLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        }
        if (loading) {
            rvUsuarios.setVisibility(View.GONE);
            layoutNoResults.setVisibility(View.GONE);
        }
    }

    private void atualizarVisibilidade(boolean vazio) {
        if (isLoading) {
            if (layoutNoResults != null) layoutNoResults.setVisibility(View.GONE);
            return;
        }
        if (rvUsuarios != null) rvUsuarios.setVisibility(vazio ? View.GONE : View.VISIBLE);
        if (layoutNoResults != null) layoutNoResults.setVisibility(vazio ? View.VISIBLE : View.GONE);
    }
}
