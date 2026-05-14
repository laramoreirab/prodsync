package com.senai.prodsync;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCopatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        // Configuração dos Insets (Mantendo o que você já tinha)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // 1. Referenciar os componentes do XML
        LinearLayout btnCadastrar = findViewById(R.id.btn_cadastrar);
        TextView tvCadastroLink = findViewById(R.id.tv_cadastro);

        // 2. Definir a URL do seu site
        String urlSite = "https://canva.com";

        btnCadastrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                abrirSite(urlSite);
            }
        });

        // 4. Configurar o clique para o texto "Não tem uma conta? Cadastre-se"
        tvCadastroLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                abrirSite(urlSite);
            }
        });
    }

    // Método auxiliar para evitar repetição de código
    private void abrirSite(String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(url));
        startActivity(intent);
    }
}