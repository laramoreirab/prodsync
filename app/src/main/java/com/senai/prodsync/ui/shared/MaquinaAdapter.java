package com.senai.prodsync.ui.shared;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;
import com.senai.prodsync.R;
import java.util.ArrayList;
import java.util.List;

public class MaquinaAdapter extends RecyclerView.Adapter<MaquinaAdapter.MaquinaViewHolder> {

    public interface OnMaquinaClickListener {
        void onMaquinaClick(Maquina maquina);
    }

    private List<Maquina> listaOriginal;
    private List<Maquina> listaFiltrada;
    private String userRole;
    private OnMaquinaClickListener listener;

    public MaquinaAdapter(List<Maquina> lista, String userRole, OnMaquinaClickListener listener) {
        this.listaOriginal = lista;
        this.listaFiltrada = new ArrayList<>(lista);
        this.userRole = userRole;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MaquinaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_maquina, parent, false);
        return new MaquinaViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MaquinaViewHolder holder, int position) {
        Maquina maquina = listaFiltrada.get(position);
        holder.tvNome.setText(maquina.getNome());
        holder.tvId.setText("Id: " + maquina.getId());
        holder.tvSerie.setText("Série: " + maquina.getSerie());

        // ... (resto da lógica de status mantida)
        String status = maquina.getStatus().toLowerCase();
        if (status.equals("produzindo")) {
            holder.tvStatus.setText("Produzindo");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_produzindo);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_produzindo));
        } else if (status.equals("setup")) {
            holder.tvStatus.setText("Setup");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_setup);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_setup));
        } else {
            holder.tvStatus.setText("Parada");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_parada);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_parada));
        }

        // Clique no item
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onMaquinaClick(maquina);
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
            for (Maquina m : listaOriginal) {
                boolean matchNomeId = m.getNome().toLowerCase().contains(busca) || 
                                     m.getId().toLowerCase().contains(busca);
                
                if ("adm".equals(userRole)) {
                    // ADM busca por nome, id OU setor
                    if (matchNomeId || m.getSetor().toLowerCase().contains(busca)) {
                        listaFiltrada.add(m);
                    }
                } else {
                    // GESTOR/OPERADOR busca APENAS por nome ou id
                    if (matchNomeId) {
                        listaFiltrada.add(m);
                    }
                }
            }
        }
        notifyDataSetChanged();
        return listaFiltrada.size();
    }

    static class MaquinaViewHolder extends RecyclerView.ViewHolder {
        TextView tvNome, tvId, tvSerie, tvStatus;

        public MaquinaViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNome = itemView.findViewById(R.id.tv_nome_maquina);
            tvId = itemView.findViewById(R.id.tv_id_maquina);
            tvSerie = itemView.findViewById(R.id.tv_serie_maquina);
            tvStatus = itemView.findViewById(R.id.tv_status_badge);
        }
    }
}