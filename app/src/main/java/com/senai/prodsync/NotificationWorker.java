package com.senai.prodsync;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
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
            SharedPreferences prefs = getApplicationContext().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
            String token = "Bearer " + prefs.getString("token", "");

            // 1. Busca dados APENAS da API
            Response<ApiResponse<List<Machine>>> response = MachineService.getClient().getMaquinas(token).execute();

            if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                List<Machine> machines = response.body().getDados();
                if (machines != null) {
                    for (Machine machine : machines) {
                        // Notifica se houver algo crítico (ex: status parado)
                        if ("Vermelho".equalsIgnoreCase(machine.getStatus()) || "parada".equalsIgnoreCase(machine.getStatus())) {
                            showNotification(machine.getNome(), "Máquina necessita de atenção!");
                        }
                    }
                }
            }
            return Result.success();
        } catch (Exception e) {
            return Result.success();
        }
    }

    private void showNotification(String name, String msg) {
        NotificationManager nm = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Alertas ProdSync", NotificationManager.IMPORTANCE_HIGH);
            nm.createNotificationChannel(channel);
        }
        NotificationCompat.Builder b = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.s_logo)
                .setContentTitle("Alerta: " + name)
                .setContentText(msg)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);
        nm.notify(name.hashCode(), b.build());
    }
}
