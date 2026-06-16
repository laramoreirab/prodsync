package com.senai.prodsync.ui.shared;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
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

    public void atualizarLista(List<Op> novaLista) {
        this.listaOriginal = new ArrayList<>(novaLista);
        this.listaFiltrada = new ArrayList<>(novaLista);
        notifyDataSetChanged();
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
        holder.tvDataFinal.setText("Data Final: " + formatarData(op.getDataFinal()));

        // Carrega a imagem da máquina relacionada à OP
        if (op.getFotoMaquinaUrl() != null && !op.getFotoMaquinaUrl().isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load(op.getFotoMaquinaUrl())
                    .placeholder(R.drawable.ic_ferramenta)
                    .error(R.drawable.ic_ferramenta)
                    .centerCrop()
                    .into(holder.ivMaquina);
        } else {
            holder.ivMaquina.setImageResource(R.drawable.ic_ferramenta);
        }

        // Configuração do Badge de Status para OP
        String status = (op.getStatus() != null) ? op.getStatus().toLowerCase() : "";
        if (status.contains("andamento") || status.contains("produzindo") || status.contains("producao")) {
            holder.tvStatus.setText("Produzindo");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_produzindo);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_produzindo));
        } else if (status.contains("concluida") || status.contains("finalizada")) {
            holder.tvStatus.setText("Finalizada");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_setup); // Usando cor de setup para finalizada
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_setup));
        } else {
            holder.tvStatus.setText("Parada");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_parada);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_parada));
        }

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
                String id = op.getId() != null ? op.getId().toLowerCase() : "";
                String prioridade = op.getPrioridade() != null ? op.getPrioridade().toLowerCase() : "";
                String maquina = op.getMaquina() != null ? op.getMaquina().toLowerCase() : "";
                String setor = op.getSetor() != null ? op.getSetor().toLowerCase() : "";

                boolean matchId = id.contains(busca);
                boolean matchPrioridade = prioridade.contains(busca);
                boolean matchMaquina = maquina.contains(busca);
                boolean matchSetor = setor.contains(busca);

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
        TextView tvId, tvMaquina, tvPrioridade, tvDataFinal, tvStatus;
        ImageView ivMaquina;

        public OpViewHolder(@NonNull View itemView) {
            super(itemView);
            tvId = itemView.findViewById(R.id.tv_id_op);
            tvMaquina = itemView.findViewById(R.id.tv_maquina_op);
            tvPrioridade = itemView.findViewById(R.id.tv_prioridade_op);
            tvDataFinal = itemView.findViewById(R.id.tv_data_final_op);
            tvStatus = itemView.findViewById(R.id.tv_status_op_badge);
            ivMaquina = itemView.findViewById(R.id.iv_op_maquina);
        }
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
            return dataIso.replace("T", " ").replace("Z", "");
        }
        return dataIso;
    }
}
