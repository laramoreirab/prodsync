package com.senai.prodsync;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import java.util.List;
import retrofit2.Response;

public class NotificationWorker extends Worker {
    private static final String CHANNEL_ID = "machine_status_channel";

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        try {
            // 1. Busca dados da API Render
            Response<List<Machine>> response = MachineService.getClient().getMaquinas().execute();

            if (response.isSuccessful() && response.body() != null) {
                List<Machine> machines = response.body();

                // 2. SALVA NO ROOM (Persistência local)
                AppDatabase db = AppDatabase.getInstance(getApplicationContext());
                db.machineDao().insertAll(machines);

                // 3. VERIFICA CONDIÇÃO
                boolean notified = false;
                for (Machine machine : machines) {
                    if ("Vermelho".equalsIgnoreCase(machine.getStatus()) && machine.getTempoParadaMinutos() >= 2) {
                        showNotification(machine.getNome(), "Máquina parada há " + machine.getTempoParadaMinutos() + " minutos!");
                        notified = true;
                    }
                }
                
                // Se a API funcionou mas nenhuma máquina atendeu ao critério, avisa no teste
                if (!notified) {
                    showNotification("API OK", "Sincronizado, mas nenhuma máquina está em 'Vermelho' por > 2 min.");
                }

            } else {
                // MODO TESTE: Se a API responder erro (ex: 404 ou 500)
                showNotification("TESTE (ERRO API)", "A API respondeu com erro, mas o sistema de notificações está OK!");
            }
            return Result.success();

        } catch (Exception e) {
            // MODO TESTE: Se falhar a conexão (Ex: URL "sua-api-no-render" não existe)
            showNotification("Teste de Notificação", "A máquina 'Injetora 01' está parada há 5 minutos!");
            return Result.success();
        }
    }

    private void showNotification(String name, String msg) {
        NotificationManager nm = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Alertas de Máquina", NotificationManager.IMPORTANCE_HIGH);
            nm.createNotificationChannel(channel);
        }
        NotificationCompat.Builder b = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.s_logo) // Aparecerá como silhueta branca na barra de status
                .setContentTitle("Alerta: " + name)
                .setContentText(msg)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);
        nm.notify(name.hashCode(), b.build());
    }
}
