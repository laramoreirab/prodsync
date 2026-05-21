package com.senai.prodsync.ui.shared;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.fragment.app.Fragment;
import androidx.work.WorkManager;

import com.bumptech.glide.Glide;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.materialswitch.MaterialSwitch;
import com.senai.prodsync.ApiResponse;
import com.senai.prodsync.MainActivity;
import com.senai.prodsync.R;
import com.senai.prodsync.UserService;
import com.senai.prodsync.Usuario;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PerfilFragment extends Fragment {

    private MaterialSwitch switchTema;
    private MaterialCardView btnSair;
    private SharedPreferences sharedPreferences;
    private TextView tvNome, tvId, tvEmail, tvCpf;
    private ImageView ivFoto;
    private View layoutEmail, layoutCpf;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_perfil, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Mapeamento dos campos
        ivFoto = view.findViewById(R.id.iv_foto_perfil);
        tvNome = view.findViewById(R.id.tv_accountname_val);
        tvId = view.findViewById(R.id.tv_accountid_val);
        tvEmail = view.findViewById(R.id.tv_accountemail_val);
        tvCpf = view.findViewById(R.id.tv_accountcpf_val);
        
        layoutEmail = view.findViewById(R.id.layout_email);
        layoutCpf = view.findViewById(R.id.layout_cpf);
        
        switchTema = view.findViewById(R.id.switch_tema);
        btnSair = view.findViewById(R.id.btn_sair);

        carregarDadosUsuario();
        sincronizarDadosComServidor();

        // Configuração do Tema
        sharedPreferences = requireActivity().getSharedPreferences("ThemePrefs", Context.MODE_PRIVATE);
        
        // 1. Verifica o estado ATUAL real do aplicativo para alinhar o Switch
        int nightModeFlags = getResources().getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK;
        boolean isCurrentlyDarkMode = nightModeFlags == android.content.res.Configuration.UI_MODE_NIGHT_YES;
        
        switchTema.setChecked(isCurrentlyDarkMode);

        // 2. Define o listener APÓS configurar o estado inicial
        switchTema.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                saveThemeState(true);
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                saveThemeState(false);
            }
        });

        btnSair.setOnClickListener(v -> {
            new AlertDialog.Builder(requireContext())
                    .setTitle("Sair do ProdSync")
                    .setMessage("Tem certeza que deseja encerrar sua sessão?")
                    .setPositiveButton("Sim, Sair", (dialog, which) -> {
                        // 1. Cancela monitoramento em segundo plano
                        WorkManager.getInstance(requireContext()).cancelAllWork();

                        // 2. Limpa os dados de autenticação
                        requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE).edit().clear().apply();

                        // 3. Volta para a tela de Login e limpa a pilha de telas
                        Intent intent = new Intent(getActivity(), MainActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                        requireActivity().finish();
                    })
                    .setNegativeButton("Cancelar", null)
                    .show();
        });
    }

    private void carregarDadosUsuario() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        
        String nome = prefs.getString("nome", "Usuário");
        int id = prefs.getInt("id_usuario", 0);
        String email = prefs.getString("email", "");
        String cpf = prefs.getString("cpf", "");
        String fotoUrl = prefs.getString("foto", null);
        
        // Atribuindo aos campos
        tvNome.setText(nome);
        tvId.setText(String.valueOf(id));
        
        if (email != null && !email.isEmpty() && !email.equalsIgnoreCase("Não informado")) {
            tvEmail.setText(email);
            layoutEmail.setVisibility(View.VISIBLE);
        } else {
            layoutEmail.setVisibility(View.GONE);
        }

        if (cpf != null && !cpf.isEmpty() && !cpf.equalsIgnoreCase("Não informado")) {
            tvCpf.setText(cpf);
            layoutCpf.setVisibility(View.VISIBLE);
        } else {
            layoutCpf.setVisibility(View.GONE);
        }

        if (fotoUrl != null && !fotoUrl.isEmpty()) {
            Glide.with(this)
                    .load(fotoUrl)
                    .placeholder(R.drawable.ic_account)
                    .error(R.drawable.ic_account)
                    .circleCrop()
                    .into(ivFoto);
        }
    }

    private void sincronizarDadosComServidor() {
        if (getContext() == null) return;
        
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");
        int currentId = prefs.getInt("id_usuario", -1);

        if (currentId == -1) return;

        // Buscamos a listagem de usuários do endpoint base
        UserService.getClient().getUsuariosBase(token).enqueue(new Callback<ApiResponse<List<Usuario>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Usuario>>> call, Response<ApiResponse<List<Usuario>>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Usuario> usuarios = response.body().getDados();
                    if (usuarios != null) {
                        for (Usuario u : usuarios) {
                            if (u.getId() != null && u.getId().equals(String.valueOf(currentId))) {
                                atualizarUI(u, prefs);
                                return;
                            }
                        }
                    }
                }
                buscarPorId(token, currentId, prefs);
            }

            @Override
            public void onFailure(Call<ApiResponse<List<Usuario>>> call, Throwable t) {
                buscarPorId(token, currentId, prefs);
            }
        });
    }

    private void buscarPorId(String token, int userId, SharedPreferences prefs) {
        UserService.getClient().getUsuarioPorId(token, userId).enqueue(new Callback<ApiResponse<Usuario>>() {
            @Override
            public void onResponse(Call<ApiResponse<Usuario>> call, Response<ApiResponse<Usuario>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                    Usuario user = response.body().getDados();
                    if (user != null) {
                        atualizarUI(user, prefs);
                    }
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<Usuario>> call, Throwable t) {}
        });
    }

    private void atualizarUI(Usuario u, SharedPreferences prefs) {
        if (u == null) return;
        
        String email = u.getEmail();
        String cpf = u.getCpf();

        if (email != null && !email.isEmpty() && !email.equalsIgnoreCase("Não informado")) {
            tvEmail.setText(email);
            layoutEmail.setVisibility(View.VISIBLE);
        } else {
            layoutEmail.setVisibility(View.GONE);
        }

        if (cpf != null && !cpf.isEmpty() && !cpf.equalsIgnoreCase("Não informado")) {
            tvCpf.setText(cpf);
            layoutCpf.setVisibility(View.VISIBLE);
        } else {
            layoutCpf.setVisibility(View.GONE);
        }

        if (u.getFotoUrl() != null && !u.getFotoUrl().isEmpty()) {
            Glide.with(PerfilFragment.this)
                    .load(u.getFotoUrl())
                    .placeholder(R.drawable.ic_account)
                    .circleCrop()
                    .into(ivFoto);
        }

        // Salva para offline
        prefs.edit()
                .putString("email", u.getEmail())
                .putString("cpf", u.getCpf())
                .putString("foto", u.getFotoUrl())
                .apply();
    }

    private void saveThemeState(boolean isDarkMode) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putBoolean("isDarkMode", isDarkMode);
        editor.apply();
    }
}