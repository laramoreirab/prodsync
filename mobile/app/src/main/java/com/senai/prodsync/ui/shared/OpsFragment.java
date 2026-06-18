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
import com.senai.prodsync.OPService;
import com.senai.prodsync.OrdemProducao;
import com.senai.prodsync.R;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OpsFragment extends Fragment {

    private RecyclerView rvOps;
    private OpAdapter adapter;
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
            userRole = prefs.getString("tipo", "operador");
        }
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
        layoutLoading = view.findViewById(R.id.layout_loading);
        TextView tvSetor = view.findViewById(R.id.tv_setor);

        if (tvSetor != null) {
            SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
            tvSetor.setText("Setor: " + prefs.getString("setor", "Geral"));
            tvSetor.setVisibility("adm".equals(userRole) ? View.VISIBLE : View.GONE);
        }

        adapter = new OpAdapter(new ArrayList<>(), userRole, op -> {
            OpDetalheFragment fragment = OpDetalheFragment.newInstance(
                    op.getId(), op.getMaquina(), op.getPrioridade(), op.getSetor(), op.getProduto(), op.getQuantidade(), op.getStatus(), op.getOperador(), op.getDataInicio(), op.getDataFinal(), op.getFotoMaquinaUrl());
            getParentFragmentManager().beginTransaction()
                    .setCustomAnimations(R.anim.fade_in, R.anim.fade_out, R.anim.fade_in, R.anim.fade_out)
                    .replace(R.id.fragmentContainer, fragment)
                    .addToBackStack(null)
                    .commit();
        });

        rvOps.setLayoutManager(new LinearLayoutManager(getContext()));
        rvOps.setAdapter(adapter);

        carregarOps();

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

    private void carregarOps() {
        if (getContext() == null) return;
        
        showLoading(true);
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");

        OPService.getClient().getOrdens(token).enqueue(new Callback<ApiResponse<List<OrdemProducao>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<OrdemProducao>>> call, Response<ApiResponse<List<OrdemProducao>>> response) {
                showLoading(false);
                if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                    List<OrdemProducao> ordens = response.body().getDados();
                    List<Op> listaUI = new ArrayList<>();
                    if (ordens != null) {
                        for (OrdemProducao item : ordens) {
                            listaUI.add(new Op(
                                    item.getId(),
                                    item.getMaquina() != null ? item.getMaquina().getNome() : (item.getNomeMaquina() != null ? item.getNomeMaquina() : "Máquina N/A"),
                                    item.getPrioridade() != null ? item.getPrioridade() : "Normal",
                                    item.getDataFinal() != null ? item.getDataFinal() : "S/D",
                                    item.getSetor() != null ? item.getSetor() : "Geral",
                                    item.getProduto() != null ? item.getProduto() : "Produto N/A",
                                    item.getQuantidade(),
                                    item.getStatus(),
                                    item.getNomeOperador(),
                                    item.getDataInicio(),
                                    item.getMaquina() != null ? item.getMaquina().getFotoUrl() : null
                            ));
                        }
                    }
                    adapter.atualizarLista(listaUI);
                    atualizarVisibilidade(listaUI.isEmpty());
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<OrdemProducao>>> call, Throwable t) {
                showLoading(false);
                if (getContext() != null)
                    Toast.makeText(getContext(), "Erro ao carregar OPs", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showLoading(boolean loading) {
        this.isLoading = loading;
        if (layoutLoading != null) {
            layoutLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        }
        if (loading) {
            rvOps.setVisibility(View.GONE);
            layoutNoResults.setVisibility(View.GONE);
        }
    }

    private void atualizarVisibilidade(boolean vazio) {
        if (isLoading) {
            if (layoutNoResults != null) layoutNoResults.setVisibility(View.GONE);
            return;
        }
        if (rvOps != null) rvOps.setVisibility(vazio ? View.GONE : View.VISIBLE);
        if (layoutNoResults != null) layoutNoResults.setVisibility(vazio ? View.VISIBLE : View.GONE);
    }
}
