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
import com.senai.prodsync.R;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDetalheFragment extends Fragment {

    private static final String ARG_USER_ID = "user_id";
    private String userId;

    public static UsuarioDetalheFragment newInstance(String userId) {
        UsuarioDetalheFragment fragment = new UsuarioDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_USER_ID, userId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            userId = getArguments().getString(ARG_USER_ID);
        }
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
        ImageView ivMaquinaFoto = view.findViewById(R.id.iv_maquina_foto);

        Usuario usuario = buscarUsuarioPorId(userId);

        if (usuario != null) {
            tvNome.setText("Nome: " + usuario.getNome());
            tvIdVal.setText(usuario.getId());
            tvEmailVal.setText(usuario.getEmail());
            tvSetorVal.setText(usuario.getSetor());
            tvTurnoVal.setText(usuario.getTurno());
            tvFuncaoVal.setText(usuario.getFuncao());
            tvCpfVal.setText(usuario.getCpf());
            tvMaquinaNome.setText(usuario.getMaquinaResponsavel());
            
            if (usuario.getFotoRes() != 0) {
                ivFoto.setImageResource(usuario.getFotoRes());
            } else {
                ivFoto.setImageResource(R.drawable.ic_account);
            }
            
            // Simulação de foto da máquina
            ivMaquinaFoto.setImageResource(R.drawable.ic_ferramenta);
        }
    }

    private Usuario buscarUsuarioPorId(String id) {
        List<Usuario> lista = new ArrayList<>();
        lista.add(new Usuario("Estevão Ferrreira", "1092", "Gestor", "Roscas", "estevao@prodsync.com", "Manhã", "123.456.789-00", "THAK-001", 0));
        lista.add(new Usuario("José Adamastor Luís da Silva", "1093", "Operador", "Engrenagens", "josezinho@gmail.com", "Noite", "443.651.730-65", "THAK-909816", 0));
        lista.add(new Usuario("Estevão Ferrreira", "1094", "Gestor", "Roscas", "estevao2@prodsync.com", "Tarde", "987.654.321-11", "THAK-002", 0));

        for (Usuario u : lista) {
            if (u.getId().equals(id)) {
                return u;
            }
        }
        return null;
    }
}