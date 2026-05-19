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

public class OpDetalheFragment extends Fragment {

    private static final String ARG_OP_ID = "op_id";
    private String opId;

    public static OpDetalheFragment newInstance(String opId) {
        OpDetalheFragment fragment = new OpDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_OP_ID, opId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            opId = getArguments().getString(ARG_OP_ID);
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

        if (opId != null) {
            tvTitulo.setText("OP #" + opId);
            // Simulação de dados baseada no ID
            if (opId.contains("A554010")) {
                setupStatusBadge(tvStatus, "produzindo");
            }
        }

        // Configuração dos Gauges OEE
        setupOeeGauge(view.findViewById(R.id.op_gauge_disponibilidade), "Disponibilidade", "85%", 85);
        setupOeeGauge(view.findViewById(R.id.op_gauge_performance), "Performance", "90%", 90);
        setupOeeGauge(view.findViewById(R.id.op_gauge_qualidade), "Qualidade", "90%", 90);
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
        if (layout == null) return;
        TextView tvLabel = layout.findViewById(R.id.tv_gauge_label);
        TextView tvVal = layout.findViewById(R.id.tv_gauge_val);
        android.widget.ProgressBar pb = layout.findViewById(R.id.pb_oee);
        
        if (tvLabel != null) tvLabel.setText(label);
        if (tvVal != null) tvVal.setText(value);
        if (pb != null) pb.setProgress(progress);
    }
}