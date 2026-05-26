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
    private View layoutLoading;
    private String userRole;
    private View searchContainer, tvTitulo, tvSetor;
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
        return inflater.inflate(R.layout.fragment_maquinas, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        rvMaquinas = view.findViewById(R.id.rv_maquinas);
        etSearch = view.findViewById(R.id.et_search);
        layoutNoResults = view.findViewById(R.id.layout_no_results);
        layoutLoading = view.findViewById(R.id.layout_loading);
        tvSetor = view.findViewById(R.id.tv_setor);
        searchContainer = view.findViewById(R.id.search_container);
        tvTitulo = view.findViewById(R.id.tv_titulo);

        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String meuSetor = prefs.getString("setor", "Geral");

        if (tvSetor != null) {
            ((TextView)tvSetor).setText("Setor: " + meuSetor);
            tvSetor.setVisibility("adm".equalsIgnoreCase(userRole) ? View.VISIBLE : View.GONE);
        }

        if ("operador".equalsIgnoreCase(userRole)) {
            if (searchContainer != null) searchContainer.setVisibility(View.GONE);
            if (tvTitulo != null) tvTitulo.setVisibility(View.GONE);
            if (tvSetor != null) tvSetor.setVisibility(View.GONE);
            rvMaquinas.setVisibility(View.GONE);
        }

        adapter = new MaquinaAdapter(new ArrayList<>(), userRole, maquina -> abrirDetalhe(maquina, true));
        rvMaquinas.setLayoutManager(new LinearLayoutManager(getContext()));
        rvMaquinas.setAdapter(adapter);

        carregarMaquinas();

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (adapter != null && !isLoading) {
                    int resultsCount = adapter.filtrar(s.toString());
                    atualizarVisibilidade(resultsCount == 0);
                }
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void carregarMaquinas() {
        if (getContext() == null) return;
        
        showLoading(true);
        
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");
        int currentUserId = prefs.getInt("id_usuario", -1);

        MachineService.getClient().getMaquinas(token).enqueue(new Callback<ApiResponse<List<Machine>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Machine>>> call, Response<ApiResponse<List<Machine>>> response) {
                showLoading(false);
                if (response.isSuccessful() && response.body() != null) {
                    List<Machine> machines = response.body().getDados();
                    if (machines != null) {
                        if ("operador".equalsIgnoreCase(userRole)) {
                            for (Machine m : machines) {
                                if (m.getIdOperador() != null && m.getIdOperador() == currentUserId) {
                                    abrirDetalhe(new Maquina(m.getNome(), m.getId(), m.getSerie(), m.getSetor(), m.getStatus(), m.getFotoUrl(), m.getDataAquisicao(), m.getCapacidade(), m.getNomeOperador()), false);
                                    return;
                                }
                            }
                            if (machines.size() == 1) {
                                Machine m = machines.get(0);
                                abrirDetalhe(new Maquina(m.getNome(), m.getId(), m.getSerie(), m.getSetor(), m.getStatus(), m.getFotoUrl(), m.getDataAquisicao(), m.getCapacidade(), m.getNomeOperador()), false);
                                return;
                            }
                            rvMaquinas.setVisibility(View.VISIBLE);
                            if (tvTitulo != null) tvTitulo.setVisibility(View.VISIBLE);
                        }

                        List<Maquina> listaUI = new ArrayList<>();
                        for (Machine m : machines) {
                            listaUI.add(new Maquina(m.getNome(), m.getId(), m.getSerie(), m.getSetor(), m.getStatus(), m.getFotoUrl(), m.getDataAquisicao(), m.getCapacidade(), m.getNomeOperador()));
                        }
                        adapter.atualizarLista(listaUI);
                        atualizarVisibilidade(listaUI.isEmpty());
                    }
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<Machine>>> call, Throwable t) {
                showLoading(false);
                if (getContext() != null)
                    Toast.makeText(getContext(), "Erro de conexão", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showLoading(boolean loading) {
        this.isLoading = loading;
        if (layoutLoading != null) {
            layoutLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        }
        if (loading) {
            rvMaquinas.setVisibility(View.GONE);
            layoutNoResults.setVisibility(View.GONE);
        }
    }

    private void atualizarVisibilidade(boolean vazio) {
        if (isLoading) {
            layoutNoResults.setVisibility(View.GONE);
            return;
        }
        rvMaquinas.setVisibility(vazio ? View.GONE : View.VISIBLE);
        layoutNoResults.setVisibility(vazio ? View.VISIBLE : View.GONE);
    }

    private void abrirDetalhe(Maquina maquina, boolean addToBackStack) {
        MaquinaDetalheFragment fragment = MaquinaDetalheFragment.newInstance(
                maquina.getId(), maquina.getStatus(), maquina.getNome(), maquina.getSerie(), maquina.getFotoUrl(), maquina.getDataAquisicao(), maquina.getCapacidade(), maquina.getOperador());
        
        androidx.fragment.app.FragmentTransaction transaction = getParentFragmentManager().beginTransaction()
                .setCustomAnimations(R.anim.fade_in, R.anim.fade_out, R.anim.fade_in, R.anim.fade_out)
                .replace(R.id.fragmentContainer, fragment);
        
        if (addToBackStack) {
            transaction.addToBackStack(null);
        }
        transaction.commit();
    }
}
