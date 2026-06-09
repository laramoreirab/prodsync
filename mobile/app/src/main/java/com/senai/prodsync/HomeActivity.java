package com.senai.prodsync;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.MenuItem;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.senai.prodsync.ui.shared.UsuariosFragment;
import com.senai.prodsync.ui.shared.MaquinasFragment;
import com.senai.prodsync.ui.shared.OpsFragment;
import com.senai.prodsync.ui.shared.PerfilFragment;

import java.util.concurrent.TimeUnit;

public class HomeActivity extends AppCompatActivity {
    private DrawerLayout drawerLayout;
    private NavigationView navigationView;
    private BottomNavigationView bottomNav;
    private static final int NOTIFICATION_PERMISSION_CODE = 101;

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
        String userRole = getIntent().getStringExtra("USER_ROLE");
        if (userRole == null) userRole = "gestor";

        setupMenus(userRole);
        
        // Fragmento inicial - Apenas se for a primeira criação da Activity
        if (savedInstanceState == null) {
            replaceFragment(new MaquinasFragment());
        }

        // 1. Pedir permissão de notificação (Android 13+)
        checkNotificationPermission();

        // 2. Iniciar monitoramento automático e imediato
        startImmediateCheck();
        startPeriodicCheck();
    }

    private void checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_CODE);
            }
        }
    }

    private void startImmediateCheck() {
        OneTimeWorkRequest immediateRequest = new OneTimeWorkRequest.Builder(NotificationWorker.class)
                .setConstraints(new Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build())
                .build();
        WorkManager.getInstance(this).enqueue(immediateRequest);
    }

    private void startPeriodicCheck() {
        Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build();

        PeriodicWorkRequest periodicWorkRequest = new PeriodicWorkRequest.Builder(
                NotificationWorker.class, 15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .build();

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
                "MachineStatusCheck",
                ExistingPeriodicWorkPolicy.UPDATE, // UPDATE mantém a tarefa ativa com as novas configurações
                periodicWorkRequest
        );
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
            replaceFragment(new MaquinasFragment());
            return true;
        } else if (itemId == R.id.nav_ops) {
            replaceFragment(new OpsFragment());
            return true;
        } else if (itemId == R.id.nav_usuarios) {
            replaceFragment(new UsuariosFragment());
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
        fragmentTransaction.setCustomAnimations(R.anim.fade_in, R.anim.fade_out, R.anim.fade_in, R.anim.fade_out);
        fragmentTransaction.replace(R.id.fragmentContainer, fragment);
        fragmentTransaction.commit();
    }
}
