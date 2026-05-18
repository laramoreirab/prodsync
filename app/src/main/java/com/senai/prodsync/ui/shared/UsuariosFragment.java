package com.senai.prodsync.ui.shared;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.senai.prodsync.R;
import java.util.ArrayList;
import java.util.List;

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

        // Padronização de Hint e Visibilidade conforme o cargo (idêntico a Maquinas)
        if ("adm".equals(userRole)) {
            etSearch.setHint("Busque por nome, id, função ou setor...");
            if (tvSetor != null) tvSetor.setVisibility(View.VISIBLE);
        } else {
            etSearch.setHint("Busque por nome, id ou função...");
            if (tvSetor != null) tvSetor.setVisibility(View.GONE);
        }

        List<Usuario> lista = new ArrayList<>();
        lista.add(new Usuario("Estevão Ferrreira", "1092", "Gestor", "Roscas", "estevao@prodsync.com", "Manhã", "123.456.789-00", "THAK-001", 0));
        lista.add(new Usuario("José Adamastor Luís da Silva", "1093", "Operador", "Engrenagens", "josezinho@gmail.com", "Noite", "443.651.730-65", "THAK-909816", 0));
        lista.add(new Usuario("Estevão Ferrreira", "1094", "Gestor", "Roscas", "estevao2@prodsync.com", "Tarde", "987.654.321-11", "THAK-002", 0));

        adapter = new UsuarioAdapter(lista, userRole, usuario -> {
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

        // Lógica de busca padronizada com feedback de "Nenhum resultado"
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
}