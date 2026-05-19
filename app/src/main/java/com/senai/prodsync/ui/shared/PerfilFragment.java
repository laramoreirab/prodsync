package com.senai.prodsync.ui.shared;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.fragment.app.Fragment;

import com.google.android.material.card.MaterialCardView;
import com.google.android.material.materialswitch.MaterialSwitch;
import com.senai.prodsync.MainActivity;
import com.senai.prodsync.R;

public class PerfilFragment extends Fragment {

    private MaterialSwitch switchTema;
    private MaterialCardView btnSair;
    private SharedPreferences sharedPreferences;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_perfil, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        switchTema = view.findViewById(R.id.switch_tema);
        btnSair = view.findViewById(R.id.btn_sair);

        sharedPreferences = requireActivity().getSharedPreferences("ThemePrefs", Context.MODE_PRIVATE);
        boolean isDarkMode = sharedPreferences.getBoolean("isDarkMode", false);
        switchTema.setChecked(isDarkMode);

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
            Intent intent = new Intent(getActivity(), MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });
    }

    private void saveThemeState(boolean isDarkMode) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putBoolean("isDarkMode", isDarkMode);
        editor.apply();
    }
}