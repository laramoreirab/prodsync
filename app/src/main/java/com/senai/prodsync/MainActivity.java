package com.senai.prodsync;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.android.material.textfield.TextInputEditText;

import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {

    private LinearLayout btnCadastrar;
    private TextView tvCadastro;
    private Button btnLogin;
    private TextInputEditText etId, etSenha;
    private ScrollView scrollView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences themePrefs = getSharedPreferences("ThemePrefs", MODE_PRIVATE);
        boolean isDarkMode = themePrefs.getBoolean("isDarkMode", false);
        AppCompatDelegate.setDefaultNightMode(isDarkMode ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);

        super.onCreate(savedInstanceState);

        //Caso o usuário já tenha feito Login alguma vez, e as informações (ex: token)
        //já estiverem salvas, o login é automático e já será redirecionado para o home e não
        //para a main activity, ou seja, não será necessário realizar o login toda vez
        //que entrar no aplicativo...
        SharedPreferences authPrefs = getSharedPreferences("AUTH", MODE_PRIVATE);
        String token = authPrefs.getString("token", null);
        if (token != null) {
            String tipo = authPrefs.getString("tipo", "operador");
            Intent intent = new Intent(MainActivity.this, HomeActivity.class);
            intent.putExtra("USER_ROLE", tipo.toLowerCase());
            startActivity(intent);
            finish();
            return;
        }

        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        scrollView = findViewById(R.id.scroll_view_main);

        // AJUSTE: Listener para garantir que o layout responda corretamente ao teclado (IME)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
            
            // Aplica o padding considerando as barras do sistema e o teclado
            // Isso empurra o conteúdo para cima quando o teclado aparece
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, Math.max(systemBars.bottom, ime.bottom));
            return insets;
        });

        btnCadastrar = findViewById(R.id.btn_cadastrar);
        tvCadastro = findViewById(R.id.tv_cadastro);
        btnLogin = findViewById(R.id.btn_login);
        etId = findViewById(R.id.et_id);
        etSenha = findViewById(R.id.et_senha);

        // Faz com que o ScrollView role até o final quando os campos ganham foco
        View.OnFocusChangeListener focusListener = (v, hasFocus) -> {
            if (hasFocus) {
                scrollView.postDelayed(() -> {
                    scrollView.smoothScrollTo(0, scrollView.getBottom());
                }, 300);
            }
        };
        etId.setOnFocusChangeListener(focusListener);
        etSenha.setOnFocusChangeListener(focusListener);

        View.OnClickListener navToCadastro = v -> {
            Intent intent = new Intent(MainActivity.this, CadastroActivity.class);
            startActivity(intent);
        };

        btnCadastrar.setOnClickListener(navToCadastro);
        tvCadastro.setOnClickListener(navToCadastro);

        btnLogin.setOnClickListener(v -> {
            String id = etId.getText().toString().trim();
            String senha = etSenha.getText().toString().trim();

            if (id.isEmpty() || senha.isEmpty()) {
                Toast.makeText(MainActivity.this, "Preencha todos os campos", Toast.LENGTH_SHORT).show();
                return;
            }

            btnLogin.setEnabled(false);
            btnLogin.setText("Entrando...");

            LoginRequest loginRequest = new LoginRequest(id, senha);
            AuthService.getClient().login(loginRequest).enqueue(new Callback<LoginResponse>() {
                @Override
                public void onResponse(@NonNull Call<LoginResponse> call, @NonNull Response<LoginResponse> response) {
                    btnLogin.setEnabled(true);
                    btnLogin.setText("Entrar");

                    if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                        LoginResponse.Dados dados = response.body().getDados();
                        getSharedPreferences("AUTH", MODE_PRIVATE).edit()
                                .putString("token", dados.getToken())
                                .putString("nome", dados.getNome())
                                .putString("tipo", dados.getTipo())
                                .putInt("id_usuario", dados.getIdUsuario())
                                .apply();

                        Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                        intent.putExtra("USER_ROLE", (dados.getTipo() != null) ? dados.getTipo().toLowerCase() : "operador");
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(MainActivity.this, "ID ou Senha incorretos", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(@NonNull Call<LoginResponse> call, @NonNull Throwable t) {
                    btnLogin.setEnabled(true);
                    btnLogin.setText("Entrar");
                    Toast.makeText(MainActivity.this, "Erro de conexão", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}