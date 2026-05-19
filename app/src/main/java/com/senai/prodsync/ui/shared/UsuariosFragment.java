package com.senai.prodsync.ui.shared;

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

import com.senai.prodsync.AppDatabase;
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
        if (getActivity() != null && getActivity().getIntent() != null) {
            userRole = getActivity().getIntent().getStringExtra("USER_ROLE");
        }
        if (userRole == null) userRole = "gestor";
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

        if ("adm".equals(userRole)) {
            etSearch.setHint("Busque por nome, id, função ou setor...");
            if (tvSetor != null) tvSetor.setVisibility(View.VISIBLE);
        } else {
            etSearch.setHint("Busque por nome, id ou função...");
            if (tvSetor != null) tvSetor.setVisibility(View.GONE);
        }

        adapter = new UsuarioAdapter(new ArrayList<>(), userRole, usuario -> {
            UsuarioDetalheFragment fragment = UsuarioDetalheFragment.newInstance(usuario.getId());
            if (getParentFragmentManager() != null) {
                getParentFragmentManager().beginTransaction()
                        .replace(R.id.fragmentContainer, fragment)
                        .addToBackStack(null)
                        .commit();
            }
        });

        rvUsuarios.setLayoutManager(new LinearLayoutManager(getContext()));
        rvUsuarios.setAdapter(adapter);

        // Busca inicial do Banco Local e Sincronização com API
        carregarUsuariosLocal();
        sincronizarComApi();

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                int countResultados = adapter.filtrar(s.toString());
                if (countResultados == 0) {
                    rvUsuarios.setVisibility(View.GONE);
                    if (layoutNoResults != null) layoutNoResults.setVisibility(View.VISIBLE);
                } else {
                    rvUsuarios.setVisibility(View.VISIBLE);
                    if (layoutNoResults != null) layoutNoResults.setVisibility(View.GONE);
                }
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void carregarUsuariosLocal() {
        new Thread(() -> {
            List<Usuario> usuarios = AppDatabase.getInstance(getContext()).userDao().getAll();
            if (getActivity() != null) {
                getActivity().runOnUiThread(() -> adapter.atualizarLista(usuarios));
            }
        }).start();
    }

    private void sincronizarComApi() {
        UserService.getClient().getUsuarios().enqueue(new Callback<List<Usuario>>() {
            @Override
            public void onResponse(Call<List<Usuario>> call, Response<List<Usuario>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    new Thread(() -> {
                        AppDatabase.getInstance(getContext()).userDao().insertAll(response.body());
                        carregarUsuariosLocal();
                    }).start();
                }
            }

            @Override
            public void onFailure(Call<List<Usuario>> call, Throwable t) {
                if (getContext() != null) {
                    Toast.makeText(getContext(), "Erro ao sincronizar usuários", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}
