package com.senai.prodsync.ui.shared;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.bumptech.glide.Glide;
import com.senai.prodsync.R;
import com.senai.prodsync.Usuario;

public class UsuarioDetalheFragment extends Fragment {

    // Nota: Como removemos o banco local, passaremos os dados básicos via Bundle
    // Ou você pode implementar um UserService.getById futuramente.
    private static final String ARG_USER_NOME = "user_nome";
    private static final String ARG_USER_FUNCAO = "user_funcao";
    private static final String ARG_USER_FOTO = "user_foto";

    public static UsuarioDetalheFragment newInstance(String nome, String funcao, String fotoUrl) {
        UsuarioDetalheFragment fragment = new UsuarioDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_USER_NOME, nome);
        args.putString(ARG_USER_FUNCAO, funcao);
        args.putString(ARG_USER_FOTO, fotoUrl);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_usuario_detalhe, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView tvNome = view.findViewById(R.id.tv_nome_usuario_detalhe);
        ImageView ivFoto = view.findViewById(R.id.iv_usuario_foto);
        TextView tvFuncaoVal = view.findViewById(R.id.tv_funcao_val);

        if (getArguments() != null) {
            String nome = getArguments().getString(ARG_USER_NOME);
            String funcao = getArguments().getString(ARG_USER_FUNCAO);
            String fotoUrl = getArguments().getString(ARG_USER_FOTO);

            tvNome.setText(nome);
            tvFuncaoVal.setText(funcao);

            if (fotoUrl != null && !fotoUrl.isEmpty()) {
                Glide.with(this).load(fotoUrl).placeholder(R.drawable.ic_account).circleCrop().into(ivFoto);
            }
        }
    }
}
