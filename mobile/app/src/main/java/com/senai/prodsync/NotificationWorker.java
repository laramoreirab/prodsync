package com.senai.prodsync;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import java.util.List;
import retrofit2.Response;

public class NotificationWorker extends Worker {
    private static final String CHANNEL_ID = "machine_status_channel";
    private static final String TAG = "NotificationWorker";

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.d(TAG, "Iniciando verificação de status das máquinas...");
        try {
            SharedPreferences prefs = getApplicationContext().getSharedPreferences("AUTH", Context.MODE_PRIVATE);
            String token = prefs.getString("token", "");
            
            if (token.isEmpty()) {
                Log.w(TAG, "Token não encontrado. Worker encerrado.");
                return Result.failure();
            }
            
            String bearerToken = "Bearer " + token;

            // Busca as máquinas da API real (Render)
            Response<ApiResponse<List<Machine>>> response = MachineService.getClient().getMaquinas(bearerToken).execute();

            if (response.isSuccessful() && response.body() != null && response.body().isSucesso()) {
                List<Machine> machines = response.body().getDados();
                Log.d(TAG, "API retornou " + (machines != null ? machines.size() : 0) + " máquinas.");
                if (machines != null) {
                    for (Machine machine : machines) {
                        String status = machine.getStatus();
                        int machineIdHash = machine.getId().hashCode();
                        
                        // 1. Notifica Paradas Críticas (Vermelho)
                        if ("Vermelho".equalsIgnoreCase(status) || "parada".equalsIgnoreCase(status) || "parado".equalsIgnoreCase(status)) {
                            showNotification("⚠️ ALERTA: " + machine.getNome(), 
                                    "Máquina PARADA. Requer atenção imediata.", 
                                    machineIdHash);
                        } 
                        // 2. Notifica Processo de Setup (Amarelo)
                        else if ("Amarelo".equalsIgnoreCase(status) || "setup".equalsIgnoreCase(status) || "em_setup".equalsIgnoreCase(status)) {
                            showNotification("⚙️ SETUP: " + machine.getNome(), 
                                    "Máquina em processo de ajuste técnico (Setup).", 
                                    machineIdHash + 1000);
                        }
                    }
                }
                return Result.success();
            } else {
                Log.e(TAG, "Erro na resposta da API: " + response.code());
                return Result.retry(); // Tenta novamente se for erro de servidor/rede
            }
        } catch (Exception e) {
            Log.e(TAG, "Falha crítica ao processar notificações", e);
            return Result.retry(); 
        }
    }

    private void showNotification(String title, String msg, int notificationId) {
        NotificationManager nm = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Alertas ProdSync", NotificationManager.IMPORTANCE_HIGH);
            channel.enableVibration(true);
            nm.createNotificationChannel(channel);
        }

        // Intent para abrir o app ao clicar na notificação
        Intent intent = new Intent(getApplicationContext(), HomeActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, intent, 
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        
        NotificationCompat.Builder b = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.s_logo)
                .setContentTitle(title)
                .setContentText(msg)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        nm.notify(notificationId, b.build());
    }
}
