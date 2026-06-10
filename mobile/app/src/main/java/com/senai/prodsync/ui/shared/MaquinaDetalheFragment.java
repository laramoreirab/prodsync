package com.senai.prodsync.ui.shared;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.Group;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.bumptech.glide.Glide;
import com.senai.prodsync.ApiResponse;
import com.senai.prodsync.DashboardService;
import com.senai.prodsync.OeeResponse;
import com.senai.prodsync.R;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MaquinaDetalheFragment extends Fragment {

    private static final String ARG_MAQUINA_ID = "maquina_id";
    private static final String ARG_STATUS = "maquina_status";
    private static final String ARG_NOME = "maquina_nome";
    private static final String ARG_SERIE = "maquina_serie";
    private static final String ARG_FOTO_URL = "maquina_foto";
    private static final String ARG_DATA_AQUISICAO = "maquina_data";
    private static final String ARG_CAPACIDADE = "maquina_capacidade";
    private static final String ARG_OPERADOR = "maquina_operador";
    private String maquinaId;
    private String status;
    private String nome;
    private String serie;
    private String fotoUrl;
    private String dataAquisicao;
    private String capacidade;
    private String operador;
    
    private View layoutLoading;
    private Group groupConteudo;

    public static MaquinaDetalheFragment newInstance(String maquinaId, String status, String nome, String serie, String fotoUrl, String dataAquisicao, String capacidade, String operador) {
        MaquinaDetalheFragment fragment = new MaquinaDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_MAQUINA_ID, maquinaId);
        args.putString(ARG_STATUS, status);
        args.putString(ARG_NOME, nome);
        args.putString(ARG_SERIE, serie);
        args.putString(ARG_FOTO_URL, fotoUrl);
        args.putString(ARG_DATA_AQUISICAO, dataAquisicao);
        args.putString(ARG_CAPACIDADE, capacidade);
        args.putString(ARG_OPERADOR, operador);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            maquinaId = getArguments().getString(ARG_MAQUINA_ID);
            status = getArguments().getString(ARG_STATUS);
            nome = getArguments().getString(ARG_NOME);
            serie = getArguments().getString(ARG_SERIE);
            fotoUrl = getArguments().getString(ARG_FOTO_URL);
            dataAquisicao = getArguments().getString(ARG_DATA_AQUISICAO);
            capacidade = getArguments().getString(ARG_CAPACIDADE);
            operador = getArguments().getString(ARG_OPERADOR);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_maquina_detalhe, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        TextView tvNome = view.findViewById(R.id.tv_nome_maquina_detalhe);
        TextView tvId = view.findViewById(R.id.tv_id_val);
        TextView tvStatus = view.findViewById(R.id.tv_status_val);
        TextView tvSerie = view.findViewById(R.id.tv_serie_val);
        TextView tvDataAquisicao = view.findViewById(R.id.tv_dataaquisicao_val);
        TextView tvVelocidade = view.findViewById(R.id.tv_velocidade_val);
        TextView tvOperador = view.findViewById(R.id.tv_operador_val);
        android.widget.ImageView ivMaquina = view.findViewById(R.id.iv_maquina_grande);
        
        layoutLoading = view.findViewById(R.id.layout_loading_detalhe);
        groupConteudo = view.findViewById(R.id.group_conteudo_detalhe);

        if (maquinaId != null) {
            tvId.setText(maquinaId);
            tvNome.setText(nome != null ? nome : "Máquina " + maquinaId);
            tvSerie.setText(serie != null ? serie : "N/A");
            tvVelocidade.setText(capacidade != null ? capacidade : "N/A");
            tvOperador.setText(operador != null ? operador : "Nenhum");
            
            if (dataAquisicao != null && !dataAquisicao.isEmpty()) {
                tvDataAquisicao.setText(formatarData(dataAquisicao));
            } else {
                tvDataAquisicao.setText("S/D");
            }
            
            if (fotoUrl != null && !fotoUrl.isEmpty()) {
                Glide.with(this).load(fotoUrl).into(ivMaquina);
            }

            carregarDadosOee(view);
        }

        setupStatusBadge(tvStatus, status);
    }

    private void carregarDadosOee(View view) {
        if (getContext() == null) return;
        
        if (layoutLoading != null) layoutLoading.setVisibility(View.VISIBLE);
        if (groupConteudo != null) groupConteudo.setVisibility(View.GONE);
        
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");

        DashboardService.getClient().getOee(token, maquinaId).enqueue(new Callback<ApiResponse<OeeResponse>>() {
            @Override
            public void onResponse(Call<ApiResponse<OeeResponse>> call, Response<ApiResponse<OeeResponse>> response) {
                if (layoutLoading != null) layoutLoading.setVisibility(View.GONE);
                if (groupConteudo != null) groupConteudo.setVisibility(View.VISIBLE);

                if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                    OeeResponse oee = response.body().getDados();
                    if (oee != null) {
                        setupOeeGauge(view.findViewById(R.id.gauge_disponibilidade), "Disponibilidade", 
                                String.format("%.0f%%", oee.getDisponibilidade() * 100), (int)(oee.getDisponibilidade() * 100));
                        setupOeeGauge(view.findViewById(R.id.gauge_performance), "Performance", 
                                String.format("%.0f%%", oee.getPerformance() * 100), (int)(oee.getPerformance() * 100));
                        setupOeeGauge(view.findViewById(R.id.gauge_qualidade), "Qualidade", 
                                String.format("%.0f%%", oee.getQualidade() * 100), (int)(oee.getQualidade() * 100));
                        
                        TextView tvConsolidado = view.findViewById(R.id.tv_consolidado_val);
                        android.widget.ProgressBar pbConsolidado = view.findViewById(R.id.pb_oee_consolidado);
                        if (tvConsolidado != null) tvConsolidado.setText(String.format("%.1f%%", oee.getOeeTotal() * 100));
                        if (pbConsolidado != null) pbConsolidado.setProgress((int)(oee.getOeeTotal() * 100));
                    }
                } else {
                    Log.e("API_OEE", "Erro ao carregar OEE: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<OeeResponse>> call, Throwable t) {
                if (layoutLoading != null) layoutLoading.setVisibility(View.GONE);
                if (groupConteudo != null) groupConteudo.setVisibility(View.VISIBLE);
                Log.e("API_OEE", "Falha na conexão: " + t.getMessage());
                Toast.makeText(getContext(), "Erro ao carregar dados da API", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupStatusBadge(TextView tvStatus, String status) {
        if (tvStatus == null || status == null) return;
        
        status = status.toLowerCase();
        if (status.contains("produzindo") || status.contains("produção") || status.contains("producao")) {
            tvStatus.setText("Produzindo");
            tvStatus.setBackgroundResource(R.drawable.bg_badge_produzindo);
            tvStatus.setTextColor(ContextCompat.getColor(requireContext(), R.color.txt_produzindo));
        } else if (status.contains("setup") || status.contains("ajuste")) {
            tvStatus.setText("Setup");
            tvStatus.setBackgroundResource(R.drawable.bg_badge_setup);
            tvStatus.setTextColor(ContextCompat.getColor(requireContext(), R.color.txt_setup));
        } else {
            tvStatus.setText("Parada");
            tvStatus.setBackgroundResource(R.drawable.bg_badge_parada);
            tvStatus.setTextColor(ContextCompat.getColor(requireContext(), R.color.txt_parada));
        }
    }

    private void setupOeeGauge(View layout, String label, String value, int progress) {
        TextView tvLabel = layout.findViewById(R.id.tv_gauge_label);
        TextView tvVal = layout.findViewById(R.id.tv_gauge_val);
        android.widget.ProgressBar pb = layout.findViewById(R.id.pb_oee);
        
        if (tvLabel != null) tvLabel.setText(label);
        if (tvVal != null) tvVal.setText(value);
        if (pb != null) pb.setProgress(progress);
    }

    private String formatarData(String dataIso) {
        if (dataIso == null || dataIso.isEmpty() || dataIso.equals("null")) return "S/D";
        try {
            // Esperado: 2006-11-11T00:00:00.000Z ou similar
            String cleanDate = dataIso.contains("T") ? dataIso.split("T")[0] : dataIso;
            String[] parts = cleanDate.split("-");
            if (parts.length == 3) {
                return parts[2] + "/" + parts[1] + "/" + parts[0];
            }
        } catch (Exception e) {
            Log.e("FORMAT_DATE", "Erro ao formatar data: " + dataIso);
        }
        return dataIso;
    }
}