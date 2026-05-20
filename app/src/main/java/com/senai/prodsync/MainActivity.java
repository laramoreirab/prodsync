package com.senai.prodsync;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        btnCadastrar = findViewById(R.id.btn_cadastrar);
        tvCadastro = findViewById(R.id.tv_cadastro);
        btnLogin = findViewById(R.id.btn_login);
        etId = findViewById(R.id.et_id);
        etSenha = findViewById(R.id.et_senha);

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
            btnLogin.setText("Conectando...");

            LoginRequest loginRequest = new LoginRequest(id, senha);

            AuthService.getClient().login(loginRequest).enqueue(new Callback<LoginResponse>() {
                @Override
                public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                    btnLogin.setEnabled(true);
                    btnLogin.setText("Entrar");

                    if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                        LoginResponse.Dados dados = response.body().getDados();
                        
                        getSharedPreferences("AUTH", MODE_PRIVATE).edit()
                                .putString("token", dados.getToken())
                                .putString("nome", dados.getNome())
                                .putString("tipo", dados.getTipo())
                                .putString("setor", dados.getSetor())
                                .putInt("id_usuario", dados.getIdUsuario())
                                .putInt("id_setor", dados.getIdSetor() != null ? dados.getIdSetor() : -1)
                                .putInt("id_empresa", dados.getIdEmpresa())
                                .apply();

                        Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                        intent.putExtra("USER_ROLE", dados.getTipo().toLowerCase());
                        startActivity(intent);
                        finish();
                    } else {
                        String msg = "ID ou Senha incorretos";
                        if (response.body() != null && response.body().getMensagem() != null) {
                            msg = response.body().getMensagem();
                        }
                        Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<LoginResponse> call, Throwable t) {
                    btnLogin.setEnabled(true);
                    btnLogin.setText("Entrar");
                    
                    String erroMsg = t.getMessage();
                    if (t instanceof SocketTimeoutException) {
                        erroMsg = "Servidor demorou a responder (Render subindo...)";
                    } else if (t instanceof UnknownHostException) {
                        erroMsg = "Erro de DNS/Internet. Tente o 4G.";
                    }
                    
                    Toast.makeText(MainActivity.this, "Erro: " + erroMsg, Toast.LENGTH_LONG).show();
                }
            });
        });
    }
}
