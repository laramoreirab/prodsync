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
    private String userRole;

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

        if (tvSetor != null) tvSetor.setVisibility("adm".equals(userRole) ? View.VISIBLE : View.GONE);

        adapter = new UsuarioAdapter(new ArrayList<>(), userRole, usuario -> {
            // Chamada corrigida passando Nome, Função e Foto para o Detalhe
            UsuarioDetalheFragment fragment = UsuarioDetalheFragment.newInstance(
                    usuario.getNome(),
                    usuario.getFuncao(),
                    usuario.getFotoUrl()
            );
            
            if (getParentFragmentManager() != null) {
                getParentFragmentManager().beginTransaction()
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
                adapter.filtrar(s.toString());
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void sincronizarComApi() {
        if (getContext() == null) return;
        
        SharedPreferences prefs = getContext().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");

        UserService.getClient().getUsuarios(token).enqueue(new Callback<ApiResponse<List<Usuario>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Usuario>>> call, Response<ApiResponse<List<Usuario>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                    adapter.atualizarLista(response.body().getDados());
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<Usuario>>> call, Throwable t) {
                if (getContext() != null)
                    Toast.makeText(getContext(), "Erro ao carregar usuários", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
