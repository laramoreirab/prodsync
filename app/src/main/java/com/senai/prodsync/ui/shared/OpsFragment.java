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

public class OpsFragment extends Fragment {

    private RecyclerView rvOps;
    private OpAdapter adapter;
    private EditText etSearch;
    private View layoutNoResults;
    private String userRole;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getActivity() != null && getActivity().getIntent() != null) {
            userRole = getActivity().getIntent().getStringExtra("USER_ROLE");
        }
        if (userRole == null) userRole = "operador";
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_ops, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        rvOps = view.findViewById(R.id.rv_ops);
        etSearch = view.findViewById(R.id.et_search);
        layoutNoResults = view.findViewById(R.id.layout_no_results);
        TextView tvSetor = view.findViewById(R.id.tv_setor);

        // Ajusta a SearchBar e Visibilidade do Setor conforme o cargo
        if ("gestor".equals(userRole)) {
            etSearch.setHint("Busque por id, máquina ou prioridade....");
            if (tvSetor != null) tvSetor.setVisibility(View.GONE);
        } else if ("operador".equals(userRole)) {
            etSearch.setHint("Busque por id ou prioridade....");
            if (tvSetor != null) tvSetor.setVisibility(View.GONE);
        } else {
            etSearch.setHint("Busque por nome, id, prioridade ou setor...");
            if (tvSetor != null) tvSetor.setVisibility(View.VISIBLE);
        }

        // Dados mockados
        List<Op> lista = new ArrayList<>();
        lista.add(new Op("444555", "THAK-009", "Crítica", "13/09/2026", "Roscas"));
        lista.add(new Op("444556", "THAK-010", "Alta", "14/09/2026", "Engrenagens"));
        lista.add(new Op("444557", "THAK-009", "Média", "15/09/2026", "Roscas"));

        adapter = new OpAdapter(lista, userRole, op -> {
            // Navegação para detalhes da OP (a ser implementada)
            OpDetalheFragment fragment = OpDetalheFragment.newInstance(op.getId());
            if (getParentFragmentManager() != null) {
                getParentFragmentManager().beginTransaction()
                        .replace(R.id.fragmentContainer, fragment)
                        .addToBackStack(null)
                        .commit();
            }
        });

        rvOps.setLayoutManager(new LinearLayoutManager(getContext()));
        rvOps.setAdapter(adapter);

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                int countResultados = adapter.filtrar(s.toString());
                if (countResultados == 0) {
                    rvOps.setVisibility(View.GONE);
                    layoutNoResults.setVisibility(View.VISIBLE);
                } else {
                    rvOps.setVisibility(View.VISIBLE);
                    layoutNoResults.setVisibility(View.GONE);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }
}