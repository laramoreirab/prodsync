package com.senai.prodsync;

import android.os.Bundle;
import android.widget.Button;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

public class CadastroActivity extends AppCompatActivity {

    TextInputLayout tilNome, tilCNPJ, tilTelefone, tilEndereco, tilEmail, tilRepresentante, tilCPF, tilSenha;

    TextInputEditText etNome, etCNPJ, etTelefone, etEndereco, etEmail, etRepresentante, etCPF, etSenha;

    Button btnCadastrar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_cadastro);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        tilNome = findViewById(R.id.til_nome);
        tilCNPJ = findViewById(R.id.til_cnpj);
        tilTelefone = findViewById(R.id.til_telefone);
        tilEndereco = findViewById(R.id.til_endereco);
        tilRepresentante = findViewById(R.id.til_nome_representante);
        tilCPF = findViewById(R.id.til_cpf);
        tilEmail = findViewById(R.id.til_email);
        tilSenha = findViewById(R.id.til_senha);

        etNome = findViewById(R.id.et_nome);
        etCNPJ = findViewById(R.id.et_cnpj);
        etTelefone = findViewById(R.id.et_telefone);
        etCPF = findViewById(R.id.et_cpf);
        etEmail = findViewById(R.id.et_email);
        etSenha = findViewById(R.id.et_senha);

        btnCadastrar = findViewById(R.id.btn_cadastrar);

    }


}