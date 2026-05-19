package com.senai.prodsync.ui.shared;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.senai.prodsync.R;
import java.util.ArrayList;
import java.util.List;

public class OpAdapter extends RecyclerView.Adapter<OpAdapter.OpViewHolder> {

    public interface OnOpClickListener {
        void onOpClick(Op op);
    }

    private List<Op> listaOriginal;
    private List<Op> listaFiltrada;
    private String userRole;
    private OnOpClickListener listener;

    public OpAdapter(List<Op> lista, String userRole, OnOpClickListener listener) {
        this.listaOriginal = lista;
        this.listaFiltrada = new ArrayList<>(lista);
        this.userRole = userRole;
        this.listener = listener;
    }

    @NonNull
    @Override
    public OpViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_op, parent, false);
        return new OpViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull OpViewHolder holder, int position) {
        Op op = listaFiltrada.get(position);
        holder.tvId.setText("OP #" + op.getId());
        holder.tvMaquina.setText("Máquina: " + op.getMaquina());
        holder.tvPrioridade.setText("Prioridade: " + op.getPrioridade());
        holder.tvDataFinal.setText("Data Final: " + op.getDataFinal());

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onOpClick(op);
            }
        });
    }

    @Override
    public int getItemCount() {
        return listaFiltrada.size();
    }

    public int filtrar(String texto) {
        listaFiltrada.clear();
        if (texto.isEmpty()) {
            listaFiltrada.addAll(listaOriginal);
        } else {
            String busca = texto.toLowerCase().trim();
            for (Op op : listaOriginal) {
                boolean matchId = op.getId().toLowerCase().contains(busca);
                boolean matchPrioridade = op.getPrioridade().toLowerCase().contains(busca);
                boolean matchMaquina = op.getMaquina().toLowerCase().contains(busca);
                boolean matchSetor = op.getSetor().toLowerCase().contains(busca);

                if ("adm".equals(userRole)) {
                    if (matchId || matchPrioridade || matchMaquina || matchSetor) {
                        listaFiltrada.add(op);
                    }
                } else if ("gestor".equals(userRole)) {
                    if (matchId || matchPrioridade || matchMaquina) {
                        listaFiltrada.add(op);
                    }
                } else { // operador
                    if (matchId || matchPrioridade) {
                        listaFiltrada.add(op);
                    }
                }
            }
        }
        notifyDataSetChanged();
        return listaFiltrada.size();
    }

    static class OpViewHolder extends RecyclerView.ViewHolder {
        TextView tvId, tvMaquina, tvPrioridade, tvDataFinal;

        public OpViewHolder(@NonNull View itemView) {
            super(itemView);
            tvId = itemView.findViewById(R.id.tv_id_op);
            tvMaquina = itemView.findViewById(R.id.tv_maquina_op);
            tvPrioridade = itemView.findViewById(R.id.tv_prioridade_op);
            tvDataFinal = itemView.findViewById(R.id.tv_data_final_op);
        }
    }
}