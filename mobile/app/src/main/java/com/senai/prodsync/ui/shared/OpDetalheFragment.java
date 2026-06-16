package com.senai.prodsync.ui.shared;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

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

public class OpDetalheFragment extends Fragment {

    private static final String ARG_OP_ID = "op_id";
    private static final String ARG_MAQUINA_ID = "maquina_id";
    private static final String ARG_PRIORIDADE = "prioridade";
    private static final String ARG_SETOR = "setor";
    private static final String ARG_PRODUTO = "produto";
    private static final String ARG_QUANTIDADE = "quantidade";
    private static final String ARG_STATUS = "status";
    private static final String ARG_OPERADOR = "operador";
    private static final String ARG_DATA_INICIO = "data_inicio";
    private static final String ARG_DATA_FINAL = "data_final";
    private static final String ARG_FOTO_MAQUINA = "foto_maquina";

    private String opId;
    private String maquinaId;
    private String prioridade;
    private String setor;
    private String produto;
    private int quantidade;
    private String status;
    private String operador;
    private String dataInicio;
    private String dataFinal;
    private String fotoMaquinaUrl;

    private View layoutLoading;
    private Group groupConteudo;

    public static OpDetalheFragment newInstance(String opId, String maquinaId, String prioridade, String setor, String produto, int quantidade, String status, String operador, String dataInicio, String dataFinal, String fotoMaquinaUrl) {
        OpDetalheFragment fragment = new OpDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_OP_ID, opId);
        args.putString(ARG_MAQUINA_ID, maquinaId);
        args.putString(ARG_PRIORIDADE, prioridade);
        args.putString(ARG_SETOR, setor);
        args.putString(ARG_PRODUTO, produto);
        args.putInt(ARG_QUANTIDADE, quantidade);
        args.putString(ARG_STATUS, status);
        args.putString(ARG_OPERADOR, operador);
        args.putString(ARG_DATA_INICIO, dataInicio);
        args.putString(ARG_DATA_FINAL, dataFinal);
        args.putString(ARG_FOTO_MAQUINA, fotoMaquinaUrl);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            opId = getArguments().getString(ARG_OP_ID);
            maquinaId = getArguments().getString(ARG_MAQUINA_ID);
            prioridade = getArguments().getString(ARG_PRIORIDADE);
            setor = getArguments().getString(ARG_SETOR);
            produto = getArguments().getString(ARG_PRODUTO);
            quantidade = getArguments().getInt(ARG_QUANTIDADE);
            status = getArguments().getString(ARG_STATUS);
            operador = getArguments().getString(ARG_OPERADOR);
            dataInicio = getArguments().getString(ARG_DATA_INICIO);
            dataFinal = getArguments().getString(ARG_DATA_FINAL);
            fotoMaquinaUrl = getArguments().getString(ARG_FOTO_MAQUINA);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_op_detalhe, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView tvTitulo = view.findViewById(R.id.tv_titulo_op_detalhe);
        TextView tvStatus = view.findViewById(R.id.tv_status_op_val);
        TextView tvMaquina = view.findViewById(R.id.tv_nome_maquina_op);
        ImageView ivMaquina = view.findViewById(R.id.iv_maquina_op);
        TextView tvSetor = view.findViewById(R.id.tv_setor_op);
        TextView tvPrioridade = view.findViewById(R.id.tv_prioridade_op_val);
        TextView tvMeta = view.findViewById(R.id.tv_meta_op);
        TextView tvOperador = view.findViewById(R.id.tv_operador_op_val);
        TextView tvDataInicio = view.findViewById(R.id.tv_data_inicio_op);
        TextView tvPrazoFinal = view.findViewById(R.id.tv_prazo_final_op);

        layoutLoading = view.findViewById(R.id.layout_loading_op);
        groupConteudo = view.findViewById(R.id.group_conteudo_op);

        if (opId != null) {
            tvTitulo.setText("OP #" + opId);
            tvMaquina.setText(maquinaId != null ? maquinaId : "N/A");
            tvSetor.setText(setor != null ? setor : "Geral");
            tvPrioridade.setText(prioridade != null ? prioridade : "Normal");
            tvMeta.setText("Meta: " + quantidade + " peças");
            tvOperador.setText(operador != null ? operador : "Nenhum");
            
            if (fotoMaquinaUrl != null && !fotoMaquinaUrl.isEmpty()) {
                Glide.with(this)
                        .load(fotoMaquinaUrl)
                        .placeholder(R.drawable.ic_ferramenta)
                        .error(R.drawable.ic_ferramenta)
                        .centerInside()
                        .into(ivMaquina);
            }

            if (dataInicio != null && !dataInicio.isEmpty()) {
                tvDataInicio.setText(formatarData(dataInicio));
            } else {
                tvDataInicio.setText("S/D");
            }

            if (dataFinal != null && !dataFinal.isEmpty()) {
                 tvPrazoFinal.setText(formatarData(dataFinal));
            } else {
                 tvPrazoFinal.setText("S/D");
            }
            
            setupStatusBadge(tvStatus, status);
        }

        if (maquinaId != null && !maquinaId.equals("N/A")) {
            carregarDadosOee(view);
        } else {
            setupOeeGauge(view.findViewById(R.id.op_gauge_disponibilidade), "Disponibilidade", "0%", 0);
            setupOeeGauge(view.findViewById(R.id.op_gauge_performance), "Performance", "0%", 0);
            setupOeeGauge(view.findViewById(R.id.op_gauge_qualidade), "Qualidade", "0%", 0);
        }
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
                        setupOeeGauge(view.findViewById(R.id.op_gauge_disponibilidade), "Disponibilidade",
                                String.format("%.0f%%", oee.getDisponibilidade() * 100), (int)(oee.getDisponibilidade() * 100));
                        setupOeeGauge(view.findViewById(R.id.op_gauge_performance), "Performance",
                                String.format("%.0f%%", oee.getPerformance() * 100), (int)(oee.getPerformance() * 100));
                        setupOeeGauge(view.findViewById(R.id.op_gauge_qualidade), "Qualidade",
                                String.format("%.0f%%", oee.getQualidade() * 100), (int)(oee.getQualidade() * 100));
                        
                        TextView tvConsolidado = view.findViewById(R.id.tv_op_consolidado_val);
                        android.widget.ProgressBar pbConsolidado = view.findViewById(R.id.pb_op_oee_consolidado);
                        if (tvConsolidado != null) tvConsolidado.setText(String.format("%.1f%%", oee.getOeeTotal() * 100));
                        if (pbConsolidado != null) pbConsolidado.setProgress((int)(oee.getOeeTotal() * 100));
                    }
                } else {
                    Log.e("API_OEE", "Erro ao carregar OEE da OP: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<OeeResponse>> call, Throwable t) {
                if (layoutLoading != null) layoutLoading.setVisibility(View.GONE);
                if (groupConteudo != null) groupConteudo.setVisibility(View.VISIBLE);
                Log.e("API_OEE", "Falha na conexão OEE OP: " + t.getMessage());
            }
        });
    }

    private void setupStatusBadge(TextView tvStatus, String status) {
        if (tvStatus == null || status == null) return;
        status = status.toLowerCase();
        if (status.contains("andamento") || status.contains("produzindo") || status.contains("producao")) {
            tvStatus.setText("Produzindo");
            tvStatus.setBackgroundResource(R.drawable.bg_badge_produzindo);
            tvStatus.setTextColor(ContextCompat.getColor(requireContext(), R.color.txt_produzindo));
        } else if (status.contains("concluida") || status.contains("finalizada") || status.contains("concluída")) {
            tvStatus.setText("Finalizada");
            tvStatus.setBackgroundResource(R.drawable.bg_badge_setup);
            tvStatus.setTextColor(ContextCompat.getColor(requireContext(), R.color.txt_setup));
        } else {
            tvStatus.setText("Parada");
            tvStatus.setBackgroundResource(R.drawable.bg_badge_parada);
            tvStatus.setTextColor(ContextCompat.getColor(requireContext(), R.color.txt_parada));
        }
    }

    private void setupOeeGauge(View layout, String label, String value, int progress) {
        if (layout == null) return;
        TextView tvLabel = layout.findViewById(R.id.tv_gauge_label);
        TextView tvVal = layout.findViewById(R.id.tv_gauge_val);
        android.widget.ProgressBar pb = layout.findViewById(R.id.pb_oee);
        
        if (tvLabel != null) tvLabel.setText(label);
        if (tvVal != null) tvVal.setText(value);
        if (pb != null) pb.setProgress(progress);
    }

    private String formatarData(String dataIso) {
        if (dataIso == null || dataIso.isEmpty()) return "S/D";
        try {
            String datePart = dataIso.substring(0, 10); // yyyy-MM-dd
            String timePart = dataIso.substring(11, 16); // HH:mm

            String[] p = datePart.split("-");
            if (p.length == 3) {
                return p[2] + "/" + p[1] + "/" + p[0] + " às " + timePart;
            }
        } catch (Exception e) {
            Log.e("FORMAT_DATE_OP", "Erro ao formatar data OP: " + dataIso);
        }
        return dataIso;
    }
}
