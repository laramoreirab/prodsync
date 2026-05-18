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

public class MaquinasFragment extends Fragment {

    private RecyclerView rvMaquinas;
    private MaquinaAdapter adapter;
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
        return inflater.inflate(R.layout.fragment_maquinas, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        rvMaquinas = view.findViewById(R.id.rv_maquinas);
        etSearch = view.findViewById(R.id.et_search);
        layoutNoResults = view.findViewById(R.id.layout_no_results);
        TextView tvSetor = view.findViewById(R.id.tv_setor);

        // Ajusta a SearchBar e Visibilidade do Setor conforme o cargo
        if ("gestor".equals(userRole) || "operador".equals(userRole)) {
            etSearch.setHint("Busque por nome ou id...");
            if (tvSetor != null) tvSetor.setVisibility(View.GONE);
        } else {
            etSearch.setHint("Busque por nome, id ou setor...");
            if (tvSetor != null) tvSetor.setVisibility(View.VISIBLE);
        }

        // Dados mockados (simulando backend)
        List<Maquina> lista = new ArrayList<>();
        lista.add(new Maquina("THAK-009", "1092", "SX-900", "Roscas", "parada"));
        lista.add(new Maquina("THAK-009", "1092", "SX-900", "Roscas", "produzindo"));
        lista.add(new Maquina("THAK-009", "1092", "SX-900", "Roscas", "setup"));
        lista.add(new Maquina("THAK-010", "1100", "SX-901", "Engrenagens", "produzindo"));

        adapter = new MaquinaAdapter(lista, userRole, maquina -> {
            // Ao clicar, vai para a tela de detalhes passando o ID e o STATUS real
            MaquinaDetalheFragment fragment = MaquinaDetalheFragment.newInstance(maquina.getId(), maquina.getStatus());
            if (getParentFragmentManager() != null) {
                getParentFragmentManager().beginTransaction()
                        .replace(R.id.fragmentContainer, fragment)
                        .addToBackStack(null)
                        .commit();
            }
        });
        rvMaquinas.setLayoutManager(new LinearLayoutManager(getContext()));
        rvMaquinas.setAdapter(adapter);

        // Lógica de busca funcional com Feedback de "Nenhum Resultado"
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                int countResultados = adapter.filtrar(s.toString());
                
                if (countResultados == 0) {
                    rvMaquinas.setVisibility(View.GONE);
                    layoutNoResults.setVisibility(View.VISIBLE);
                } else {
                    rvMaquinas.setVisibility(View.VISIBLE);
                    layoutNoResults.setVisibility(View.GONE);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }
}