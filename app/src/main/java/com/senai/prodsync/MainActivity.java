package com.senai.prodsync;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private LinearLayout btnCadastrar;
    private TextView tvCadastro;
    private Button btnLogin;

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

        // Inicializando os componentes
        btnCadastrar = findViewById(R.id.btn_cadastrar);
        tvCadastro = findViewById(R.id.tv_cadastro);
        btnLogin = findViewById(R.id.btn_login);

        // Listener compartilhado para ir para a tela de cadastro
        View.OnClickListener navToCadastro = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, CadastroActivity.class);
                startActivity(intent);
            }
        };

        // Configurando os cliques
        btnCadastrar.setOnClickListener(navToCadastro);
        tvCadastro.setOnClickListener(navToCadastro);

        // Configurando o clique do login (para ir para a Home)
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                // Simulando o envio do cargo (em um app real, isso viria da validação do banco)
                intent.putExtra("USER_ROLE", "adm");
                startActivity(intent);
            }
        });
    }
}