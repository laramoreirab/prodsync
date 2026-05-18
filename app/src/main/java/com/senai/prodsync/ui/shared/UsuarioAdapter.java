package com.senai.prodsync.ui.shared;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.senai.prodsync.R;
import java.util.ArrayList;
import java.util.List;

public class UsuarioAdapter extends RecyclerView.Adapter<UsuarioAdapter.UsuarioViewHolder> {

    public interface OnUsuarioClickListener {
        void onUsuarioClick(Usuario usuario);
    }

    private List<Usuario> listaOriginal;
    private List<Usuario> listaFiltrada;
    private OnUsuarioClickListener listener;
    private String userRole;

    public UsuarioAdapter(List<Usuario> lista, String userRole, OnUsuarioClickListener listener) {
        this.listaOriginal = lista;
        this.listaFiltrada = new ArrayList<>(lista);
        this.userRole = userRole;
        this.listener = listener;
    }

    @NonNull
    @Override
    public UsuarioViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_usuario, parent, false);
        return new UsuarioViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull UsuarioViewHolder holder, int position) {
        Usuario usuario = listaFiltrada.get(position);
        holder.tvNome.setText(usuario.getNome());
        holder.tvId.setText("Id: " + usuario.getId());
        holder.tvFuncao.setText("Função: " + usuario.getFuncao());
        
        if (usuario.getFotoRes() != 0) {
            holder.ivFoto.setImageResource(usuario.getFotoRes());
        } else {
            holder.ivFoto.setImageResource(R.drawable.ic_account);
        }

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onUsuarioClick(usuario);
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
            for (Usuario u : listaOriginal) {
                boolean matchNomeIdFuncao = u.getNome().toLowerCase().contains(busca) ||
                                           u.getId().toLowerCase().contains(busca) ||
                                           u.getFuncao().toLowerCase().contains(busca);

                if ("adm".equals(userRole)) {
                    // ADM busca por nome, id, função OU setor
                    if (matchNomeIdFuncao || u.getSetor().toLowerCase().contains(busca)) {
                        listaFiltrada.add(u);
                    }
                } else {
                    // GESTOR busca APENAS por nome, id ou função (conforme solicitado)
                    if (matchNomeIdFuncao) {
                        listaFiltrada.add(u);
                    }
                }
            }
        }
        notifyDataSetChanged();
        return listaFiltrada.size();
    }

    static class UsuarioViewHolder extends RecyclerView.ViewHolder {
        ImageView ivFoto;
        TextView tvNome, tvId, tvFuncao;

        public UsuarioViewHolder(@NonNull View itemView) {
            super(itemView);
            ivFoto = itemView.findViewById(R.id.iv_usuario);
            tvNome = itemView.findViewById(R.id.tv_nome_usuario);
            tvId = itemView.findViewById(R.id.tv_id_usuario);
            tvFuncao = itemView.findViewById(R.id.tv_funcao_usuario);
        }
    }
}