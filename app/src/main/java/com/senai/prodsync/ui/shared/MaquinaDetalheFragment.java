package com.senai.prodsync.ui.shared;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import com.senai.prodsync.R;

public class MaquinaDetalheFragment extends Fragment {

    private static final String ARG_MAQUINA_ID = "maquina_id";
    private static final String ARG_STATUS = "maquina_status";
    private String maquinaId;
    private String status;

    public static MaquinaDetalheFragment newInstance(String maquinaId, String status) {
        MaquinaDetalheFragment fragment = new MaquinaDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_MAQUINA_ID, maquinaId);
        args.putString(ARG_STATUS, status);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            maquinaId = getArguments().getString(ARG_MAQUINA_ID);
            status = getArguments().getString(ARG_STATUS);
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
        
        // Simulação de preenchimento dos gauges OEE
        setupOeeGauge(view.findViewById(R.id.gauge_disponibilidade), "Disponibilidade", "85%", 85);
        setupOeeGauge(view.findViewById(R.id.gauge_performance), "Performance", "90%", 90);
        setupOeeGauge(view.findViewById(R.id.gauge_qualidade), "Qualidade", "90%", 90);

        if (maquinaId != null) {
            tvId.setText(maquinaId);
            // Em um app real, buscaríamos os dados completos da máquina pelo ID aqui
            if (maquinaId.equals("1092")) {
                tvNome.setText("THAK-009");
            }
        }

        // Usa o status real que veio do clique!
        setupStatusBadge(tvStatus, status);
    }

    private void setupStatusBadge(TextView tvStatus, String status) {
        if (tvStatus == null || status == null) return;
        
        status = status.toLowerCase();
        if (status.equals("produzindo")) {
            tvStatus.setText("Produzindo");
            tvStatus.setBackgroundResource(R.drawable.bg_badge_produzindo);
            tvStatus.setTextColor(ContextCompat.getColor(requireContext(), R.color.txt_produzindo));
        } else if (status.equals("setup")) {
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
}