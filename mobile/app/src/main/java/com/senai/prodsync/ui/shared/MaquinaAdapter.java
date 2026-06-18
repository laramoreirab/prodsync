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
import com.bumptech.glide.load.resource.bitmap.CenterCrop;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
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
        this.listaOriginal = new ArrayList<>(lista);
        this.listaFiltrada = new ArrayList<>(lista);
        this.userRole = userRole;
        this.listener = listener;
    }

    public void atualizarLista(List<Maquina> novaLista) {
        this.listaOriginal = new ArrayList<>(novaLista);
        this.listaFiltrada = new ArrayList<>(novaLista);
        notifyDataSetChanged();
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

        int radius = 24; // Valor padrão em pixels para deixar as bordas redondas

        if (maquina.getFotoUrl() != null && !maquina.getFotoUrl().isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load(maquina.getFotoUrl())
                    .transform(new CenterCrop(), new RoundedCorners(radius))
                    .placeholder(R.drawable.ic_ferramenta)
                    .error(R.drawable.ic_ferramenta)
                    .into(holder.ivMaquina);
        } else {
            holder.ivMaquina.setImageResource(R.drawable.ic_ferramenta);
        }

        String status = maquina.getStatus().toLowerCase();
        if (status.contains("produzindo") || status.contains("produção") || status.contains("producao")) {
            holder.tvStatus.setText("Produzindo");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_produzindo);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_produzindo));
        } else if (status.contains("setup") || status.contains("ajuste")) {
            holder.tvStatus.setText("Setup");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_setup);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_setup));
        } else {
            holder.tvStatus.setText("Parada");
            holder.tvStatus.setBackgroundResource(R.drawable.bg_badge_parada);
            holder.tvStatus.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.txt_parada));
        }

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
                String nome = m.getNome() != null ? m.getNome().toLowerCase() : "";
                String id = m.getId() != null ? m.getId().toLowerCase() : "";
                String setor = m.getSetor() != null ? m.getSetor().toLowerCase() : "";

                boolean matchNomeId = nome.contains(busca) || id.contains(busca);
                
                if ("adm".equals(userRole)) {
                    if (matchNomeId || setor.contains(busca)) {
                        listaFiltrada.add(m);
                    }
                } else {
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
        ImageView ivMaquina;

        public MaquinaViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNome = itemView.findViewById(R.id.tv_nome_maquina);
            tvId = itemView.findViewById(R.id.tv_id_maquina);
            tvSerie = itemView.findViewById(R.id.tv_serie_maquina);
            tvStatus = itemView.findViewById(R.id.tv_status_badge);
            ivMaquina = itemView.findViewById(R.id.iv_maquina);
        }
    }
}
