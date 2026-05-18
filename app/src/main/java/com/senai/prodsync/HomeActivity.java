package com.senai.prodsync;

import android.os.Bundle;
import android.view.MenuItem;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.senai.prodsync.ui.shared.UsuariosFragment; // Corrigido para a pasta Shared
import com.senai.prodsync.ui.shared.MaquinaDetalheFragment;
import com.senai.prodsync.ui.shared.MaquinasFragment;
import com.senai.prodsync.ui.shared.OpsFragment;
import com.senai.prodsync.ui.shared.PerfilFragment;

public class HomeActivity extends AppCompatActivity {
    private DrawerLayout drawerLayout;
    private NavigationView navigationView;
    private BottomNavigationView bottomNav;
    private String userRole;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_home);
        
        drawerLayout = findViewById(R.id.main);
        navigationView = findViewById(R.id.navigation_view);
        bottomNav = findViewById(R.id.bottomNav);
        MaterialToolbar toolbar = findViewById(R.id.toolbar);

        // Configurar a Toolbar para abrir o Drawer
        toolbar.setNavigationOnClickListener(v -> drawerLayout.openDrawer(GravityCompat.START));

        // Recebe o cargo do usuário
        userRole = getIntent().getStringExtra("USER_ROLE");
        if (userRole == null) userRole = "gestor";

        setupMenus(userRole);
        
        // Fragmento inicial
        if ("operador".equals(userRole)) {
            replaceFragment(new MaquinaDetalheFragment());
        } else {
            replaceFragment(new MaquinasFragment());
        }
    }

    private void setupMenus(String role) {
        bottomNav.getMenu().clear();
        navigationView.getMenu().clear();

        if ("adm".equals(role) || "gestor".equals(role)) {
            bottomNav.inflateMenu(R.menu.menu_bottom_adm);
            navigationView.inflateMenu(R.menu.menu_drawer_adm);
        } else {
            bottomNav.inflateMenu(R.menu.menu_bottom_operador);
            navigationView.inflateMenu(R.menu.menu_drawer_operador);
        }

        bottomNav.setOnItemSelectedListener(this::onNavigationItemSelected);
        
        navigationView.setNavigationItemSelectedListener(item -> {
            boolean handled = onNavigationItemSelected(item);
            if (handled) drawerLayout.closeDrawers();
            return handled;
        });
    }

    private boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();
        if (itemId == R.id.nav_maquinas) {
            if ("operador".equals(userRole)) {
                replaceFragment(new MaquinaDetalheFragment());
            } else {
                replaceFragment(new MaquinasFragment());
            }
            return true;
        } else if (itemId == R.id.nav_ops) {
            replaceFragment(new OpsFragment());
            return true;
        } else if (itemId == R.id.nav_usuarios) {
            replaceFragment(new UsuariosFragment()); // Agora chamará a versão com a lista!
            return true;
        } else if (itemId == R.id.nav_perfil) {
            replaceFragment(new PerfilFragment());
            return true;
        }
        return false;
    }

    private void replaceFragment(Fragment fragment) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.fragmentContainer, fragment);
        fragmentTransaction.commit();
    }
}