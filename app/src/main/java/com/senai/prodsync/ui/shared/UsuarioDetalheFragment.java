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
    private static final String ARG_USER_ID = "user_id";
    private static final String ARG_USER_NOME = "user_nome";
    private static final String ARG_USER_FUNCAO = "user_funcao";
    private static final String ARG_USER_FOTO = "user_foto";
    private static final String ARG_USER_EMAIL = "user_email";
    private static final String ARG_USER_SETOR = "user_setor";
    private static final String ARG_USER_TURNO = "user_turno";
    private static final String ARG_USER_CPF = "user_cpf";
    private static final String ARG_USER_MAQUINA = "user_maquina";

    public static UsuarioDetalheFragment newInstance(Usuario u) {
        UsuarioDetalheFragment fragment = new UsuarioDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_USER_ID, u.getId());
        args.putString(ARG_USER_NOME, u.getNome());
        args.putString(ARG_USER_FUNCAO, u.getFuncao());
        args.putString(ARG_USER_FOTO, u.getFotoUrl());
        args.putString(ARG_USER_EMAIL, u.getEmail());
        args.putString(ARG_USER_SETOR, u.getSetor());
        args.putString(ARG_USER_TURNO, u.getTurno());
        args.putString(ARG_USER_CPF, u.getCpf());
        args.putString(ARG_USER_MAQUINA, u.getMaquinaResponsavel() != null ? u.getMaquinaResponsavel() : "Nenhuma");
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
        TextView tvIdVal = view.findViewById(R.id.tv_id_val);
        TextView tvEmailVal = view.findViewById(R.id.tv_email_val);
        TextView tvSetorVal = view.findViewById(R.id.tv_setor_val);
        TextView tvTurnoVal = view.findViewById(R.id.tv_turno_val);
        TextView tvFuncaoVal = view.findViewById(R.id.tv_funcao_val);
        TextView tvCpfVal = view.findViewById(R.id.tv_cpf_val);
        TextView tvMaquinaNome = view.findViewById(R.id.tv_maquina_nome);

        if (getArguments() != null) {
            String nome = getArguments().getString(ARG_USER_NOME);
            String funcao = getArguments().getString(ARG_USER_FUNCAO);
            String fotoUrl = getArguments().getString(ARG_USER_FOTO);
            String id = getArguments().getString(ARG_USER_ID);
            String email = getArguments().getString(ARG_USER_EMAIL);
            String setor = getArguments().getString(ARG_USER_SETOR);
            String turno = getArguments().getString(ARG_USER_TURNO);
            String cpf = getArguments().getString(ARG_USER_CPF);
            String maquina = getArguments().getString(ARG_USER_MAQUINA);

            tvNome.setText(nome);
            tvFuncaoVal.setText(funcao != null ? funcao : "Não informado");
            tvIdVal.setText(id != null ? id : "S/I");
            tvEmailVal.setText(email != null ? email : "Não informado");
            tvSetorVal.setText(setor != null ? setor : "Geral");
            tvTurnoVal.setText(turno != null ? turno : "N/A");
            tvCpfVal.setText(cpf != null ? cpf : "N/A");
            tvMaquinaNome.setText(maquina);

            if (fotoUrl != null && !fotoUrl.isEmpty()) {
                Glide.with(this).load(fotoUrl).placeholder(R.drawable.ic_account).circleCrop().into(ivFoto);
            }
        }
    }
}
