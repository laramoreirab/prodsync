package com.senai.prodsync.ui.shared;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
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
import com.senai.prodsync.Machine;
import com.senai.prodsync.MachineService;
import com.senai.prodsync.PaginatedData;
import com.senai.prodsync.R;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MaquinasFragment extends Fragment {

    private RecyclerView rvMaquinas;
    private MaquinaAdapter adapter;
    private EditText etSearch;
    private View layoutNoResults;
    private String userRole;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getActivity() != null) {
            SharedPreferences prefs = getActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
            userRole = prefs.getString("tipo", "operador");
        }
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

        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String meuSetor = prefs.getString("setor", "Geral");

        if (tvSetor != null) {
            tvSetor.setText("Setor: " + meuSetor);
            tvSetor.setVisibility("adm".equalsIgnoreCase(userRole) ? View.VISIBLE : View.GONE);
        }

        adapter = new MaquinaAdapter(new ArrayList<>(), userRole, maquina -> {
            MaquinaDetalheFragment fragment = MaquinaDetalheFragment.newInstance(maquina.getId(), maquina.getStatus());
            getParentFragmentManager().beginTransaction()
                    .replace(R.id.fragmentContainer, fragment)
                    .addToBackStack(null)
                    .commit();
        });

        rvMaquinas.setLayoutManager(new LinearLayoutManager(getContext()));
        rvMaquinas.setAdapter(adapter);

        carregarMaquinas();

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (adapter != null) adapter.filtrar(s.toString());
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void carregarMaquinas() {
        if (getContext() == null) return;
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");

        MachineService.getClient().getMaquinas(token).enqueue(new Callback<ApiResponse<PaginatedData<Machine>>>() {
            @Override
            public void onResponse(Call<ApiResponse<PaginatedData<Machine>>> call, Response<ApiResponse<PaginatedData<Machine>>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    PaginatedData<Machine> data = response.body().getDados();
                    if (data != null && data.getList() != null) {
                        List<Maquina> listaUI = new ArrayList<>();
                        for (Machine m : data.getList()) {
                            listaUI.add(new Maquina(m.getNome(), m.getId(), m.getSerie(), m.getSetor(), m.getStatus()));
                        }
                        
                        adapter = new MaquinaAdapter(listaUI, userRole, maquina -> {
                            MaquinaDetalheFragment fragment = MaquinaDetalheFragment.newInstance(maquina.getId(), maquina.getStatus());
                            getParentFragmentManager().beginTransaction()
                                    .replace(R.id.fragmentContainer, fragment)
                                    .addToBackStack(null)
                                    .commit();
                        });
                        rvMaquinas.setAdapter(adapter);
                        rvMaquinas.setVisibility(listaUI.isEmpty() ? View.GONE : View.VISIBLE);
                        layoutNoResults.setVisibility(listaUI.isEmpty() ? View.VISIBLE : View.GONE);
                    }
                } else {
                    Log.e("API_ERROR", "Status: " + response.code());
                    if (response.code() == 403) {
                        Toast.makeText(getContext(), "Acesso negado às máquinas (Verifique seu cargo)", Toast.LENGTH_LONG).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<PaginatedData<Machine>>> call, Throwable t) {
                Log.e("API_ERROR", "Falha: " + t.getMessage());
                if (getContext() != null)
                    Toast.makeText(getContext(), "Erro de conexão", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
