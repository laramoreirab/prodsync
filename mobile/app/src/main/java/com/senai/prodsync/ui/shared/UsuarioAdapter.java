package com.senai.prodsync.ui.shared;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.senai.prodsync.R;
import com.senai.prodsync.Usuario;

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

    public void atualizarLista(List<Usuario> novaLista) {
        this.listaOriginal = novaLista;
        this.listaFiltrada = new ArrayList<>(novaLista);
        notifyDataSetChanged();
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
        
        String funcao = (usuario.getFuncao() != null) ? usuario.getFuncao() : "Não informado";
        holder.tvFuncao.setText("Função: " + funcao);
        
        // Carregamento de imagem com Glide
        if (usuario.getFotoUrl() != null && !usuario.getFotoUrl().isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load(usuario.getFotoUrl())
                    .placeholder(R.drawable.ic_account)
                    .error(R.drawable.ic_account)
                    .circleCrop()
                    .into(holder.ivFoto);
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
                String nome = u.getNome() != null ? u.getNome().toLowerCase() : "";
                String id = u.getId() != null ? u.getId().toLowerCase() : "";
                String funcao = u.getFuncao() != null ? u.getFuncao().toLowerCase() : "";
                String setor = u.getSetor() != null ? u.getSetor().toLowerCase() : "";

                boolean matchNomeIdFuncao = nome.contains(busca) ||
                                           id.contains(busca) ||
                                           funcao.contains(busca);

                if ("adm".equals(userRole)) {
                    if (matchNomeIdFuncao || setor.contains(busca)) {
                        listaFiltrada.add(u);
                    }
                } else {
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
