package com.senai.prodsync.ui.shared;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.Group;
import androidx.fragment.app.Fragment;

import com.bumptech.glide.Glide;
import com.senai.prodsync.ApiResponse;
import com.senai.prodsync.R;
import com.senai.prodsync.UserService;
import com.senai.prodsync.Usuario;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UsuarioDetalheFragment extends Fragment {

    private static final String ARG_USER_ID = "user_id";

    private TextView tvNome, tvIdVal, tvEmailVal, tvSetorVal, tvTurnoVal, tvFuncaoVal, tvCpfVal, tvMaquinaNome;
    private ImageView ivFoto;
    private View layoutLoading;
    private Group groupConteudo;

    public static UsuarioDetalheFragment newInstance(Usuario u) {
        UsuarioDetalheFragment fragment = new UsuarioDetalheFragment();
        Bundle args = new Bundle();
        args.putString(ARG_USER_ID, u.getId());
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

        tvNome = view.findViewById(R.id.tv_nome_usuario_detalhe);
        ivFoto = view.findViewById(R.id.iv_usuario_foto);
        tvIdVal = view.findViewById(R.id.tv_id_val);
        tvEmailVal = view.findViewById(R.id.tv_email_val);
        tvSetorVal = view.findViewById(R.id.tv_setor_val);
        tvTurnoVal = view.findViewById(R.id.tv_turno_val);
        tvFuncaoVal = view.findViewById(R.id.tv_funcao_val);
        tvCpfVal = view.findViewById(R.id.tv_cpf_val);
        tvMaquinaNome = view.findViewById(R.id.tv_maquina_nome);
        layoutLoading = view.findViewById(R.id.layout_loading_usuario);
        groupConteudo = view.findViewById(R.id.group_conteudo_usuario);

        if (getArguments() != null) {
            String userId = getArguments().getString(ARG_USER_ID);
            if (userId != null) {
                carregarDadosDoUsuario(userId);
            }
        }
    }

    private void carregarDadosDoUsuario(String userId) {
        if (getContext() == null) return;

        if (layoutLoading != null) layoutLoading.setVisibility(View.VISIBLE);
        if (groupConteudo != null) groupConteudo.setVisibility(View.GONE);

        SharedPreferences prefs = getContext().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");

        try {
            int idInt = Integer.parseInt(userId);
            UserService.getClient().getUsuarioPorId(token, idInt).enqueue(new Callback<ApiResponse<Usuario>>() {
                @Override
                public void onResponse(Call<ApiResponse<Usuario>> call, Response<ApiResponse<Usuario>> response) {
                    if (layoutLoading != null) layoutLoading.setVisibility(View.GONE);
                    if (groupConteudo != null) groupConteudo.setVisibility(View.VISIBLE);

                    if (response.isSuccessful() && response.body() != null && response.body().getDados() != null) {
                        preencherCampos(response.body().getDados());
                    } else {
                        Toast.makeText(getContext(), "Erro ao carregar detalhes", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ApiResponse<Usuario>> call, Throwable t) {
                    if (layoutLoading != null) layoutLoading.setVisibility(View.GONE);
                    if (groupConteudo != null) groupConteudo.setVisibility(View.VISIBLE);
                    if (getContext() != null)
                        Toast.makeText(getContext(), "Erro de conexão", Toast.LENGTH_SHORT).show();
                }
            });
        } catch (NumberFormatException e) {
            if (layoutLoading != null) layoutLoading.setVisibility(View.GONE);
            if (groupConteudo != null) groupConteudo.setVisibility(View.VISIBLE);
            Toast.makeText(getContext(), "ID inválido", Toast.LENGTH_SHORT).show();
        }
    }

    private void preencherCampos(Usuario u) {
        tvNome.setText(u.getNome());
        tvIdVal.setText(u.getId());
        tvEmailVal.setText(u.getEmail().isEmpty() ? "Não informado" : u.getEmail());
        tvSetorVal.setText(u.getSetor());
        tvTurnoVal.setText(u.getTurno());
        tvFuncaoVal.setText(u.getFuncao());
        tvCpfVal.setText(u.getCpf().isEmpty() ? "Não informado" : u.getCpf());
        tvMaquinaNome.setText(u.getMaquinaResponsavel());

        if (u.getFotoUrl() != null && !u.getFotoUrl().isEmpty()) {
            Glide.with(this)
                    .load(u.getFotoUrl())
                    .placeholder(R.drawable.ic_account)
                    .error(R.drawable.ic_account)
                    .circleCrop()
                    .into(ivFoto);
        }
    }
}
