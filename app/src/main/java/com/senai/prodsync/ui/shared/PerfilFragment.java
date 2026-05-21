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
import android.widget.Toast;

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
        
        switchTema = view.findViewById(R.id.switch_tema);
        btnSair = view.findViewById(R.id.btn_sair);

        // Primeiro carrega o que tem no cache (SharedPreferences)
        carregarDadosLocais();
        
        // Depois busca os dados atualizados no servidor
        sincronizarDadosComServidor();

        // Configuração do Tema
        sharedPreferences = requireActivity().getSharedPreferences("ThemePrefs", Context.MODE_PRIVATE);
        int nightModeFlags = getResources().getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK;
        boolean isCurrentlyDarkMode = nightModeFlags == android.content.res.Configuration.UI_MODE_NIGHT_YES;
        switchTema.setChecked(isCurrentlyDarkMode);

        switchTema.setOnCheckedChangeListener((buttonView, isChecked) -> {
            AppCompatDelegate.setDefaultNightMode(isChecked ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);
            sharedPreferences.edit().putBoolean("isDarkMode", isChecked).apply();
        });

        btnSair.setOnClickListener(v -> {
            new AlertDialog.Builder(requireContext())
                    .setTitle("Sair do ProdSync")
                    .setMessage("Tem certeza que deseja encerrar sua sessão?")
                    .setPositiveButton("Sim, Sair", (dialog, which) -> logout())
                    .setNegativeButton("Cancelar", null)
                    .show();
        });
    }

    private void carregarDadosLocais() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        
        tvNome.setText(prefs.getString("nome", "Usuário"));
        tvId.setText(String.valueOf(prefs.getInt("id_usuario", 0)));
        
        String email = prefs.getString("email", "Não informado");
        String cpf = prefs.getString("cpf", "Não informado");
        tvEmail.setText(email.isEmpty() ? "Não informado" : email);
        tvCpf.setText(cpf.isEmpty() ? "Não informado" : cpf);

        String fotoUrl = prefs.getString("foto", null);
        if (fotoUrl != null && !fotoUrl.isEmpty()) {
            Glide.with(this).load(fotoUrl).placeholder(R.drawable.ic_account).circleCrop().into(ivFoto);
        }
    }

    private void sincronizarDadosComServidor() {
        if (getContext() == null) return;
        
        SharedPreferences prefs = requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
        String token = "Bearer " + prefs.getString("token", "");
        int currentId = prefs.getInt("id_usuario", -1);

        if (currentId == -1) return;

        // Chamada direta para buscar o usuário logado pelo ID (mais confiável e completo)
        UserService.getClient().getUsuarioPorId(token, currentId).enqueue(new Callback<ApiResponse<Usuario>>() {
            @Override
            public void onResponse(Call<ApiResponse<Usuario>> call, Response<ApiResponse<Usuario>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getDados() != null) {
                    atualizarUI(response.body().getDados(), prefs);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<Usuario>> call, Throwable t) {
                // Se falhar a busca por ID, tenta a listagem como fallback
                tentarSincronizarPelaLista(token, currentId, prefs);
            }
        });
    }

    private void tentarSincronizarPelaLista(String token, int currentId, SharedPreferences prefs) {
        UserService.getClient().getUsuariosBase(token).enqueue(new Callback<ApiResponse<List<Usuario>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<Usuario>>> call, Response<ApiResponse<List<Usuario>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getDados() != null) {
                    for (Usuario u : response.body().getDados()) {
                        if (u.getId().equals(String.valueOf(currentId))) {
                            atualizarUI(u, prefs);
                            break;
                        }
                    }
                }
            }
            @Override
            public void onFailure(Call<ApiResponse<List<Usuario>>> call, Throwable t) {}
        });
    }

    private void atualizarUI(Usuario u, SharedPreferences prefs) {
        if (getActivity() == null) return;

        tvNome.setText(u.getNome());
        tvEmail.setText(u.getEmail());
        tvCpf.setText(u.getCpf());

        if (u.getFotoUrl() != null && !u.getFotoUrl().isEmpty()) {
            Glide.with(this)
                    .load(u.getFotoUrl())
                    .placeholder(R.drawable.ic_account)
                    .circleCrop()
                    .into(ivFoto);
        }

        // Salva os dados atualizados para a próxima vez
        prefs.edit()
                .putString("nome", u.getNome())
                .putString("email", u.getEmail())
                .putString("cpf", u.getCpf())
                .putString("foto", u.getFotoUrl())
                .apply();
    }

    private void logout() {
        WorkManager.getInstance(requireContext()).cancelAllWork();
        requireActivity().getSharedPreferences("AUTH", Context.MODE_PRIVATE).edit().clear().apply();
        Intent intent = new Intent(getActivity(), MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        requireActivity().finish();
    }
}
