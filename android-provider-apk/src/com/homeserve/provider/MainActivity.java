package com.homeserve.provider;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {

    static class JobItem {
        String id, code, customerName, phone, address, items, date, slot, status;
        int total;

        JobItem(String id, String code, String customerName, String phone, String address,
                String items, String date, String slot, int total, String status) {
            this.id = id;
            this.code = code;
            this.customerName = customerName;
            this.phone = phone;
            this.address = address;
            this.items = items;
            this.date = date;
            this.slot = slot;
            this.total = total;
            this.status = status;
        }
    }

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final String serverUrl = "https://homeserve-pro.aklove4047.workers.dev";

    private String partnerId = null;
    private String partnerName = "Partner";
    private String partnerSpecialty = "";
    private boolean isAvailable = true;
    private final List<JobItem> jobs = new ArrayList<>();

    private LinearLayout contentContainer;
    private TextView subtitleTv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        buildShell();
        render();
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    private GradientDrawable roundedBg(int fillColor, int radiusDp, int strokeColor) {
        GradientDrawable gd = new GradientDrawable();
        gd.setColor(fillColor);
        gd.setCornerRadius(dp(radiusDp));
        if (strokeColor != 0) gd.setStroke(dp(1), strokeColor);
        return gd;
    }

    private void buildShell() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#F4F7FC"));

        LinearLayout topBar = new LinearLayout(this);
        topBar.setOrientation(LinearLayout.HORIZONTAL);
        topBar.setBackgroundColor(Color.parseColor("#0F172A"));
        topBar.setPadding(dp(16), dp(14), dp(16), dp(14));
        topBar.setGravity(Gravity.CENTER_VERTICAL);

        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

        TextView title = new TextView(this);
        title.setText("eDemand Partner");
        title.setTextColor(Color.WHITE);
        title.setTextSize(19);
        title.setTypeface(null, Typeface.BOLD);

        subtitleTv = new TextView(this);
        subtitleTv.setText("Provider & Technician App");
        subtitleTv.setTextColor(Color.parseColor("#94A3B8"));
        subtitleTv.setTextSize(12);

        col.addView(title);
        col.addView(subtitleTv);

        Button refreshBtn = new Button(this);
        refreshBtn.setText("Sync");
        refreshBtn.setAllCaps(false);
        refreshBtn.setTextColor(Color.WHITE);
        refreshBtn.setBackground(roundedBg(Color.parseColor("#0277FA"), 8, 0));
        refreshBtn.setOnClickListener(v -> {
            if (partnerId != null) loadJobs();
        });

        topBar.addView(col);
        topBar.addView(refreshBtn);
        root.addView(topBar);

        contentContainer = new LinearLayout(this);
        contentContainer.setOrientation(LinearLayout.VERTICAL);
        contentContainer.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f
        ));
        root.addView(contentContainer);
        setContentView(root);
    }

    private void render() {
        contentContainer.removeAllViews();
        if (partnerId == null) renderLogin();
        else renderDashboard();
    }

    private void renderLogin() {
        ScrollView scroll = new ScrollView(this);
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(20), dp(28), dp(20), dp(24));

        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackground(roundedBg(Color.WHITE, 16, Color.parseColor("#E2E8F0")));
        card.setPadding(dp(18), dp(20), dp(18), dp(20));

        TextView h = new TextView(this);
        h.setText("Partner Sign In");
        h.setTextSize(20);
        h.setTypeface(null, Typeface.BOLD);
        h.setTextColor(Color.parseColor("#0F172A"));

        TextView sub = new TextView(this);
        sub.setText("Login with your registered phone or try a demo partner account.");
        sub.setTextColor(Color.parseColor("#64748B"));
        sub.setPadding(0, dp(4), 0, dp(14));

        EditText phoneEt = new EditText(this);
        phoneEt.setHint("+91 98765 43210");
        phoneEt.setText("+91 98765 43210");
        phoneEt.setBackground(roundedBg(Color.WHITE, 10, Color.parseColor("#CBD5E1")));
        phoneEt.setPadding(dp(12), dp(10), dp(12), dp(10));

        Button loginBtn = new Button(this);
        loginBtn.setText("Sign In as Partner");
        loginBtn.setAllCaps(false);
        loginBtn.setTextColor(Color.WHITE);
        loginBtn.setBackground(roundedBg(Color.parseColor("#0277FA"), 10, 0));
        LinearLayout.LayoutParams bLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(46)
        );
        bLp.setMargins(0, dp(12), 0, dp(12));
        loginBtn.setLayoutParams(bLp);
        loginBtn.setOnClickListener(v -> doPartnerLogin(phoneEt.getText().toString().trim()));

        TextView demoLbl = new TextView(this);
        demoLbl.setText("1-Click Demo Partner Accounts:");
        demoLbl.setTextSize(12);
        demoLbl.setTypeface(null, Typeface.BOLD);
        demoLbl.setTextColor(Color.parseColor("#64748B"));
        demoLbl.setPadding(0, dp(6), 0, dp(6));

        card.addView(h);
        card.addView(sub);
        card.addView(phoneEt);
        card.addView(loginBtn);
        card.addView(demoLbl);

        String[][] demos = {
            {"tech-1", "Rajesh Sharma (AC & Appliances)"},
            {"tech-2", "Vikram Patel (Mobile & Laptop)"},
            {"tech-3", "Aman Verma (TV & Electrician)"}
        };
        for (String[] d : demos) {
            Button db = new Button(this);
            db.setText(d[1]);
            db.setAllCaps(false);
            db.setBackground(roundedBg(Color.parseColor("#F8FAFC"), 10, Color.parseColor("#CBD5E1")));
            LinearLayout.LayoutParams dLp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            );
            dLp.setMargins(0, 0, 0, dp(8));
            db.setLayoutParams(dLp);
            db.setOnClickListener(v -> doPartnerLogin(d[0]));
            card.addView(db);
        }

        col.addView(card);
        scroll.addView(col);
        contentContainer.addView(scroll);
    }

    private void renderDashboard() {
        subtitleTv.setText(partnerName + " • " + partnerSpecialty);

        ScrollView scroll = new ScrollView(this);
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(14), dp(14), dp(14), dp(24));

        // Status & Logout Bar
        LinearLayout topRow = new LinearLayout(this);
        topRow.setOrientation(LinearLayout.HORIZONTAL);
        topRow.setPadding(0, 0, 0, dp(12));

        Button availBtn = new Button(this);
        availBtn.setText(isAvailable ? "Online (Available)" : "Offline (Busy)");
        availBtn.setAllCaps(false);
        availBtn.setTextColor(Color.WHITE);
        availBtn.setBackground(roundedBg(Color.parseColor(isAvailable ? "#10B981" : "#EF4444"), 10, 0));
        availBtn.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));
        availBtn.setOnClickListener(v -> toggleAvailability());

        Button logoutBtn = new Button(this);
        logoutBtn.setText("Logout");
        logoutBtn.setAllCaps(false);
        logoutBtn.setBackground(roundedBg(Color.WHITE, 10, Color.parseColor("#CBD5E1")));
        LinearLayout.LayoutParams lLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        lLp.setMargins(dp(8), 0, 0, 0);
        logoutBtn.setLayoutParams(lLp);
        logoutBtn.setOnClickListener(v -> {
            partnerId = null;
            subtitleTv.setText("Provider & Technician App");
            render();
        });

        topRow.addView(availBtn);
        topRow.addView(logoutBtn);
        col.addView(topRow);

        // Earnings Summary
        int earnings = 0;
        for (JobItem j : jobs) {
            if ("completed".equals(j.status)) earnings += j.total;
        }
        LinearLayout kpi = new LinearLayout(this);
        kpi.setBackground(roundedBg(Color.parseColor("#0277FA"), 14, 0));
        kpi.setPadding(dp(16), dp(14), dp(16), dp(14));
        TextView kpiTv = new TextView(this);
        kpiTv.setText("Total Jobs: " + jobs.size() + "   •   Completed Earnings: ₹" + earnings);
        kpiTv.setTextColor(Color.WHITE);
        kpiTv.setTypeface(null, Typeface.BOLD);
        kpiTv.setTextSize(14);
        kpi.addView(kpiTv);
        col.addView(kpi);

        TextView hdr = new TextView(this);
        hdr.setText("Job Requests & Assigned Bookings");
        hdr.setTextSize(16);
        hdr.setTypeface(null, Typeface.BOLD);
        hdr.setPadding(0, dp(14), 0, dp(8));
        col.addView(hdr);

        for (JobItem j : jobs) {
            LinearLayout card = new LinearLayout(this);
            card.setOrientation(LinearLayout.VERTICAL);
            card.setBackground(roundedBg(Color.WHITE, 14, Color.parseColor("#E2E8F0")));
            card.setPadding(dp(14), dp(14), dp(14), dp(14));
            LinearLayout.LayoutParams cLp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            );
            cLp.setMargins(0, 0, 0, dp(10));
            card.setLayoutParams(cLp);

            TextView t1 = new TextView(this);
            t1.setText(j.code + " • " + j.customerName + "  [" + j.status.toUpperCase() + "]");
            t1.setTypeface(null, Typeface.BOLD);
            t1.setTextSize(15);

            TextView t2 = new TextView(this);
            t2.setText(j.items);
            t2.setTextColor(Color.parseColor("#334155"));
            t2.setPadding(0, dp(4), 0, dp(2));

            TextView t3 = new TextView(this);
            t3.setText(j.address + " • " + j.phone);
            t3.setTextColor(Color.parseColor("#64748B"));
            t3.setTextSize(12);

            TextView t4 = new TextView(this);
            t4.setText(j.date + " • " + j.slot + " • ₹" + j.total);
            t4.setTextColor(Color.parseColor("#0277FA"));
            t4.setTypeface(null, Typeface.BOLD);
            t4.setPadding(0, dp(4), 0, dp(8));

            card.addView(t1);
            card.addView(t2);
            card.addView(t3);
            card.addView(t4);

            if ("pending".equals(j.status)) {
                Button btn = new Button(this);
                btn.setText("Accept Job");
                btn.setAllCaps(false);
                btn.setTextColor(Color.WHITE);
                btn.setBackground(roundedBg(Color.parseColor("#0277FA"), 10, 0));
                btn.setOnClickListener(v -> updateJobStatus(j.id, "assigned"));
                card.addView(btn);
            } else if ("assigned".equals(j.status) || "confirmed".equals(j.status)) {
                Button btn = new Button(this);
                btn.setText("Start Job");
                btn.setAllCaps(false);
                btn.setTextColor(Color.WHITE);
                btn.setBackground(roundedBg(Color.parseColor("#0277FA"), 10, 0));
                btn.setOnClickListener(v -> updateJobStatus(j.id, "in_progress"));
                card.addView(btn);
            } else if ("in_progress".equals(j.status)) {
                Button btn = new Button(this);
                btn.setText("Mark Completed");
                btn.setAllCaps(false);
                btn.setTextColor(Color.WHITE);
                btn.setBackground(roundedBg(Color.parseColor("#10B981"), 10, 0));
                btn.setOnClickListener(v -> updateJobStatus(j.id, "completed"));
                card.addView(btn);
            }

            col.addView(card);
        }

        scroll.addView(col);
        contentContainer.addView(scroll);
    }

    private void doPartnerLogin(String phoneOrId) {
        executor.execute(() -> {
            try {
                JSONObject payload = new JSONObject();
                payload.put("phone", phoneOrId);
                HttpURLConnection conn = (HttpURLConnection) new URL(serverUrl + "/api/partner/login").openConnection();
                conn.setConnectTimeout(4000);
                conn.setReadTimeout(4000);
                conn.setRequestMethod("POST");
                conn.setDoOutput(true);
                conn.setRequestProperty("Content-Type", "application/json");
                try (OutputStream os = conn.getOutputStream()) {
                    os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
                }
                if (conn.getResponseCode() == 200) {
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) sb.append(line);
                    JSONObject p = new JSONObject(sb.toString());
                    partnerId = p.getString("id");
                    partnerName = p.getString("name");
                    partnerSpecialty = p.optString("specialty", "Service Pro");
                    isAvailable = p.optInt("is_available", 1) == 1;
                    mainHandler.post(this::loadJobs);
                    return;
                }
            } catch (Exception ignored) {}
            mainHandler.post(() -> Toast.makeText(this, "Login failed or offline", Toast.LENGTH_SHORT).show());
        });
    }

    private void loadJobs() {
        executor.execute(() -> {
            try {
                HttpURLConnection conn = (HttpURLConnection) new URL(serverUrl + "/api/bookings?technicianId=" + partnerId).openConnection();
                conn.setConnectTimeout(4000);
                conn.setReadTimeout(4000);
                if (conn.getResponseCode() == 200) {
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) sb.append(line);
                    JSONArray arr = new JSONArray(sb.toString());
                    List<JobItem> loaded = new ArrayList<>();
                    for (int i = 0; i < arr.length(); i++) {
                        JSONObject o = arr.getJSONObject(i);
                        JSONArray items = o.optJSONArray("items");
                        StringBuilder sum = new StringBuilder();
                        if (items != null) {
                            for (int k = 0; k < items.length(); k++) {
                                JSONObject it = items.getJSONObject(k);
                                if (k > 0) sum.append(", ");
                                sum.append(it.optString("name")).append(" ×").append(it.optInt("qty", 1));
                            }
                        }
                        loaded.add(new JobItem(
                            o.getString("id"),
                            o.optString("booking_code"),
                            o.optString("customer_name"),
                            o.optString("customer_phone"),
                            o.optString("address"),
                            sum.toString(),
                            o.optString("scheduled_date"),
                            o.optString("scheduled_slot"),
                            o.optInt("total_amount"),
                            o.optString("status")
                        ));
                    }
                    mainHandler.post(() -> {
                        jobs.clear();
                        jobs.addAll(loaded);
                        render();
                    });
                }
            } catch (Exception ignored) {}
        });
    }

    private void updateJobStatus(String bookingId, String status) {
        executor.execute(() -> {
            try {
                JSONObject payload = new JSONObject();
                payload.put("status", status);
                payload.put("technician_id", partnerId);
                HttpURLConnection conn = (HttpURLConnection) new URL(serverUrl + "/api/bookings/" + bookingId).openConnection();
                conn.setRequestMethod("PATCH");
                conn.setDoOutput(true);
                conn.setRequestProperty("Content-Type", "application/json");
                try (OutputStream os = conn.getOutputStream()) {
                    os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
                }
                conn.getResponseCode();
                mainHandler.post(this::loadJobs);
            } catch (Exception ignored) {}
        });
    }

    private void toggleAvailability() {
        boolean next = !isAvailable;
        executor.execute(() -> {
            try {
                JSONObject payload = new JSONObject();
                payload.put("is_available", next);
                HttpURLConnection conn = (HttpURLConnection) new URL(serverUrl + "/api/technicians/" + partnerId).openConnection();
                conn.setRequestMethod("PATCH");
                conn.setDoOutput(true);
                conn.setRequestProperty("Content-Type", "application/json");
                try (OutputStream os = conn.getOutputStream()) {
                    os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
                }
                conn.getResponseCode();
                isAvailable = next;
                mainHandler.post(this::render);
            } catch (Exception ignored) {}
        });
    }
}
