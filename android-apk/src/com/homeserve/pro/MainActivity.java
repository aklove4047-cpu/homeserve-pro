package com.homeserve.pro;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {

    static class ServiceItem {
        String id, categoryId, categoryName, name, desc, imageUrl;
        int price, originalPrice, durationMins, warrantyDays;
        double rating;

        ServiceItem(String id, String categoryId, String categoryName, String name, String desc,
                    int price, int originalPrice, int durationMins, double rating, int warrantyDays, String imageUrl) {
            this.id = id;
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.name = name;
            this.desc = desc;
            this.price = price;
            this.originalPrice = originalPrice;
            this.durationMins = durationMins;
            this.rating = rating;
            this.warrantyDays = warrantyDays;
            this.imageUrl = imageUrl;
        }
    }

    static class BookingItem {
        String code, customerName, itemsSummary, date, slot, status, techName;
        int total;

        BookingItem(String code, String customerName, String itemsSummary, String date, String slot,
                    int total, String status, String techName) {
            this.code = code;
            this.customerName = customerName;
            this.itemsSummary = itemsSummary;
            this.date = date;
            this.slot = slot;
            this.total = total;
            this.status = status;
            this.techName = techName;
        }
    }

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private String serverUrl = "https://homeserve-pro.aklove4047.workers.dev";
    private boolean isOnline = false;
    private int currentTab = 0; // 0: Services, 1: Cart, 2: Bookings
    private String selectedCategory = "all";
    private String searchQuery = "";

    private final List<ServiceItem> allServices = new ArrayList<>();
    private final Map<String, Integer> cartQty = new LinkedHashMap<>();
    private final List<BookingItem> bookings = new ArrayList<>();
    private final Map<String, Bitmap> imageCache = new java.util.concurrent.ConcurrentHashMap<>();

    private final String[][] categories = {
        {"all", "All"},
        {"cat-laptop", "Laptop & PC"},
        {"cat-mobile", "Mobile"},
        {"cat-tv", "TV Repair"},
        {"cat-accessories", "Accessories"},
        {"cat-ac", "AC & Cooling"},
        {"cat-appliance", "Appliances"},
        {"cat-electrician", "Electrician"},
        {"cat-plumber", "Plumbing"},
        {"cat-cleaning", "Cleaning"},
        {"cat-carpenter", "Carpentry"},
        {"cat-painting", "Painting"},
        {"cat-pest", "Pest Control"},
        {"cat-ro", "RO & Chimney"}
    };

    private TextView statusSubtitle;
    private LinearLayout contentContainer;
    private Button tabServicesBtn, tabCartBtn, tabBookingsBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        seedFallbackServices();
        buildRootLayout();
        renderCurrentTab();
        syncWithServer(false);
    }

    private void seedFallbackServices() {
        allServices.clear();
        allServices.add(new ServiceItem("srv-lap-1", "cat-laptop", "Laptop & PC", "Laptop Deep Clean & Thermal Paste", "Solve overheating and loud fan noise.", 699, 999, 60, 4.9, 30, "/images/laptop.jpg"));
        allServices.add(new ServiceItem("srv-lap-2", "cat-laptop", "Laptop & PC", "NVMe SSD Upgrade & Windows Setup", "10X faster boot with data migration.", 899, 1299, 60, 4.9, 60, "/images/laptop.jpg"));
        allServices.add(new ServiceItem("srv-lap-4", "cat-laptop", "Laptop & PC", "MacBook Air / Pro Retina Display Swap", "Original TrueTone Retina panel for M1/M2/M3.", 14999, 19500, 90, 4.9, 180, "/images/laptop.jpg"));
        allServices.add(new ServiceItem("srv-lap-5", "cat-laptop", "Laptop & PC", "Gaming Laptop GPU Repaste & Fan Service", "Arctic MX-6 repaste for ROG, Legion & Victus.", 1199, 1699, 60, 4.9, 60, "/images/laptop.jpg"));
        allServices.add(new ServiceItem("srv-lap-6", "cat-laptop", "Laptop & PC", "16GB / 32GB DDR4/DDR5 RAM Upgrade", "Boost multitasking speed with genuine RAM.", 3499, 4499, 30, 4.8, 365, "/images/laptop.jpg"));
        allServices.add(new ServiceItem("srv-lap-7", "cat-laptop", "Laptop & PC", "Laptop Battery & Type-C Charger Swap", "Zero-cycle 6-cell battery & original adapter.", 2499, 3299, 40, 4.8, 180, "/images/laptop.jpg"));
        allServices.add(new ServiceItem("srv-lap-8", "cat-laptop", "Laptop & PC", "Dell / HP / Lenovo Hinge & Body Fix", "Precision chassis & metal hinge restoration.", 999, 1499, 75, 4.7, 90, "/images/laptop.jpg"));

        allServices.add(new ServiceItem("srv-mob-1", "cat-mobile", "Mobile", "Doorstep Mobile Screen Replacement", "OEM-grade display replacement in 30 mins.", 1999, 2799, 30, 4.9, 90, "/images/mobile.jpg"));
        allServices.add(new ServiceItem("srv-mob-2", "cat-mobile", "Mobile", "Mobile Battery Replacement", "Zero-cycle battery replacement at doorstep.", 999, 1499, 30, 4.8, 90, "/images/mobile.jpg"));
        allServices.add(new ServiceItem("srv-mob-4", "cat-mobile", "Mobile", "iPhone 14 / 15 / 16 Pro OLED Display", "120Hz ProMotion OLED with FaceID & TrueTone.", 6999, 9499, 45, 4.9, 180, "/images/mobile.jpg"));
        allServices.add(new ServiceItem("srv-mob-5", "cat-mobile", "Mobile", "Samsung S23 / S24 Ultra AMOLED Fix", "Dynamic AMOLED 2X & fingerprint calibration.", 8499, 11200, 60, 4.9, 180, "/images/mobile.jpg"));
        allServices.add(new ServiceItem("srv-mob-6", "cat-mobile", "Mobile", "OnePlus / Xiaomi SuperVOOC Screen Fix", "Fast doorstep display with tempered glass.", 2499, 3499, 35, 4.8, 90, "/images/mobile.jpg"));
        allServices.add(new ServiceItem("srv-mob-7", "cat-mobile", "Mobile", "Phone Back Glass & Camera Lens Fix", "Laser-cut OEM back glass & camera ring.", 1299, 1899, 40, 4.8, 60, "/images/mobile.jpg"));

        allServices.add(new ServiceItem("srv-tv-1", "cat-tv", "TV Repair", "LED / Smart TV Inspection & Repair", "Fix no-display, backlight or sound issues.", 349, 599, 45, 4.8, 45, "/images/tv.jpg"));
        allServices.add(new ServiceItem("srv-tv-2", "cat-tv", "TV Repair", "TV Wall Mount Installation", "Laser-leveled wall mounting up to 65 inch.", 499, 799, 45, 4.9, 30, "/images/tv.jpg"));
        allServices.add(new ServiceItem("srv-tv-4", "cat-tv", "TV Repair", "55\" / 65\" 4K QLED & OLED Panel Fix", "Fix vertical lines, flicker & T-Con issues.", 2499, 3699, 90, 4.8, 90, "/images/tv.jpg"));
        allServices.add(new ServiceItem("srv-tv-6", "cat-tv", "TV Repair", "Swivel TV Wall Mount (50\"-85\")", "Heavy-duty articulating bracket & trunking.", 999, 1499, 60, 4.9, 90, "/images/tv.jpg"));
        allServices.add(new ServiceItem("srv-tv-7", "cat-tv", "TV Repair", "Soundbar & Home Theater 5.1 Setup", "Dolby Atmos HDMI eARC setup & tuning.", 799, 1199, 60, 4.9, 30, "/images/tv.jpg"));

        allServices.add(new ServiceItem("srv-acc-1", "cat-accessories", "Accessories", "65W GaN Fast Charger + Braided Cable", "3-port GaN charger for MacBook & Phones.", 1499, 2199, 15, 4.9, 365, "/images/accessories.jpg"));
        allServices.add(new ServiceItem("srv-acc-2", "cat-accessories", "Accessories", "1TB NVMe M.2 SSD + USB-C Enclosure", "10Gbps portable storage & upgrade kit.", 5499, 6999, 20, 4.9, 1095, "/images/accessories.jpg"));
        allServices.add(new ServiceItem("srv-acc-3", "cat-accessories", "Accessories", "8-in-1 Aluminum USB-C Hub (4K HDMI)", "4K@60Hz HDMI, 100W PD & Gigabit LAN.", 1699, 2499, 15, 4.8, 365, "/images/accessories.jpg"));
        allServices.add(new ServiceItem("srv-acc-4", "cat-accessories", "Accessories", "Wireless Mechanical Keyboard & Mouse", "Hot-swappable RGB keyboard & silent mouse.", 2299, 3199, 15, 4.8, 365, "/images/accessories.jpg"));
        allServices.add(new ServiceItem("srv-acc-5", "cat-accessories", "Accessories", "ANC Wireless Earbuds Pro (40dB)", "40hr battery & quad-mic ENC calling.", 1799, 2999, 15, 4.8, 365, "/images/accessories.jpg"));
        allServices.add(new ServiceItem("srv-acc-6", "cat-accessories", "Accessories", "Dual-Fan RGB Laptop Cooling Stand", "6-level height stand with silent fans.", 1199, 1799, 15, 4.7, 180, "/images/accessories.jpg"));

        allServices.add(new ServiceItem("srv-ac-1", "cat-ac", "AC & Cooling", "Foam-Jet AC Service (Split)", "2X deeper indoor & outdoor jet cleaning.", 599, 899, 60, 4.9, 30, "/images/ac.jpg"));
        allServices.add(new ServiceItem("srv-ac-2", "cat-ac", "AC & Cooling", "AC Gas Refill & Leak Fix", "Complete R32/R410A refill with nitrogen test.", 2499, 3200, 90, 4.8, 60, "/images/ac.jpg"));
        allServices.add(new ServiceItem("srv-app-1", "cat-appliance", "Appliances", "Washing Machine Repair", "Fix drum spin, water drain & error codes.", 349, 549, 60, 4.8, 30, "/images/ac.jpg"));
        allServices.add(new ServiceItem("srv-elec-2", "cat-electrician", "Electrician", "MCB, Switchboard & Inverter Wiring", "Fix tripping breakers and inverter setup.", 299, 499, 45, 4.8, 30, "/images/ac.jpg"));
        allServices.add(new ServiceItem("srv-plm-1", "cat-plumber", "Plumbing", "Tap, Mixer & Flush Tank Repair", "Stop dripping taps and cistern leaks.", 199, 349, 30, 4.8, 30, "/images/ac.jpg"));
        allServices.add(new ServiceItem("srv-cln-1", "cat-cleaning", "Cleaning", "Full Home Deep Cleaning (2BHK)", "Machine scrubbing & kitchen degreasing.", 2999, 3999, 240, 4.9, 7, "/images/ac.jpg"));
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

    private void buildRootLayout() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#F8FAFC"));

        // Top Bar
        LinearLayout topBar = new LinearLayout(this);
        topBar.setOrientation(LinearLayout.HORIZONTAL);
        topBar.setBackgroundColor(Color.parseColor("#0F172A"));
        topBar.setPadding(dp(16), dp(14), dp(16), dp(14));
        topBar.setGravity(Gravity.CENTER_VERTICAL);

        LinearLayout titleCol = new LinearLayout(this);
        titleCol.setOrientation(LinearLayout.VERTICAL);
        titleCol.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

        TextView title = new TextView(this);
        title.setText("eDemand");
        title.setTextColor(Color.WHITE);
        title.setTextSize(19);
        title.setTypeface(null, Typeface.BOLD);

        statusSubtitle = new TextView(this);
        statusSubtitle.setText("Home & Tech Services");
        statusSubtitle.setTextColor(Color.parseColor("#94A3B8"));
        statusSubtitle.setTextSize(12);

        titleCol.addView(title);
        titleCol.addView(statusSubtitle);

        Button syncBtn = new Button(this);
        syncBtn.setText("Sync");
        syncBtn.setTextColor(Color.WHITE);
        syncBtn.setBackground(roundedBg(Color.parseColor("#0079FF"), 8, 0));
        syncBtn.setPadding(dp(14), dp(6), dp(14), dp(6));
        syncBtn.setOnClickListener(v -> syncWithServer(true));

        topBar.addView(titleCol);
        topBar.addView(syncBtn);
        root.addView(topBar);

        // Main Scrollable Content
        contentContainer = new LinearLayout(this);
        contentContainer.setOrientation(LinearLayout.VERTICAL);
        contentContainer.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f
        ));
        root.addView(contentContainer);

        // Bottom Navigation
        LinearLayout bottomBar = new LinearLayout(this);
        bottomBar.setOrientation(LinearLayout.HORIZONTAL);
        bottomBar.setBackgroundColor(Color.WHITE);
        bottomBar.setElevation(dp(6));
        bottomBar.setPadding(dp(8), dp(8), dp(8), dp(8));

        tabServicesBtn = makeNavBtn("Explore", 0);
        tabCartBtn = makeNavBtn("Cart (0)", 1);
        tabBookingsBtn = makeNavBtn("Bookings", 2);

        bottomBar.addView(tabServicesBtn);
        bottomBar.addView(tabCartBtn);
        bottomBar.addView(tabBookingsBtn);
        root.addView(bottomBar);

        setContentView(root);
    }

    private Button makeNavBtn(String label, int tabIndex) {
        Button b = new Button(this);
        b.setText(label);
        b.setTextSize(13);
        b.setAllCaps(false);
        b.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));
        b.setOnClickListener(v -> {
            currentTab = tabIndex;
            renderCurrentTab();
        });
        return b;
    }

    private void updateNavStyles() {
        int totalQty = 0;
        for (int q : cartQty.values()) totalQty += q;
        tabCartBtn.setText("Cart (" + totalQty + ")");

        Button[] btns = {tabServicesBtn, tabCartBtn, tabBookingsBtn};
        for (int i = 0; i < btns.length; i++) {
            boolean active = (i == currentTab);
            btns[i].setBackground(roundedBg(active ? Color.parseColor("#E8F2FF") : Color.TRANSPARENT, 10, 0));
            btns[i].setTextColor(Color.parseColor(active ? "#0277FA" : "#64748B"));
            btns[i].setTypeface(null, active ? Typeface.BOLD : Typeface.NORMAL);
        }
    }

    private void renderCurrentTab() {
        updateNavStyles();
        contentContainer.removeAllViews();
        if (currentTab == 0) renderServicesTab();
        else if (currentTab == 1) renderCartTab();
        else renderBookingsTab();
    }

    private void renderServicesTab() {
        // eDemand Blue Hero Banner
        LinearLayout heroBanner = new LinearLayout(this);
        heroBanner.setOrientation(LinearLayout.VERTICAL);
        heroBanner.setBackground(roundedBg(Color.parseColor("#0079FF"), 14, 0));
        heroBanner.setPadding(dp(16), dp(14), dp(16), dp(14));
        LinearLayout.LayoutParams hLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        hLp.setMargins(dp(14), dp(10), dp(14), dp(4));
        heroBanner.setLayoutParams(hLp);
        TextView heroTitle = new TextView(this);
        heroTitle.setText("Quick & Reliable Services at Your Doorstep!");
        heroTitle.setTextColor(Color.WHITE);
        heroTitle.setTextSize(15);
        heroTitle.setTypeface(null, Typeface.BOLD);
        TextView heroSub = new TextView(this);
        heroSub.setText("Laptop • Mobile • 4K TV • Accessories • AC & Home");
        heroSub.setTextColor(Color.parseColor("#FFD000"));
        heroSub.setTextSize(12);
        heroSub.setTypeface(null, Typeface.BOLD);
        heroBanner.addView(heroTitle);
        heroBanner.addView(heroSub);
        contentContainer.addView(heroBanner);

        // Search Box
        EditText searchBox = new EditText(this);
        searchBox.setHint("Search AC, TV, Mobile, Laptop, Plumbing...");
        searchBox.setText(searchQuery);
        searchBox.setBackground(roundedBg(Color.WHITE, 12, Color.parseColor("#CBD5E1")));
        searchBox.setPadding(dp(14), dp(10), dp(14), dp(10));
        LinearLayout.LayoutParams sLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        sLp.setMargins(dp(14), dp(12), dp(14), dp(8));
        searchBox.setLayoutParams(sLp);
        contentContainer.addView(searchBox);

        // Category Chips
        HorizontalScrollView chipScroll = new HorizontalScrollView(this);
        chipScroll.setHorizontalScrollBarEnabled(false);
        LinearLayout chipRow = new LinearLayout(this);
        chipRow.setOrientation(LinearLayout.HORIZONTAL);
        chipRow.setPadding(dp(14), dp(4), dp(14), dp(8));

        for (String[] cat : categories) {
            Button chip = new Button(this);
            chip.setText(cat[1]);
            chip.setAllCaps(false);
            chip.setTextSize(12);
            boolean active = selectedCategory.equals(cat[0]);
            chip.setBackground(roundedBg(
                active ? Color.parseColor("#0277FA") : Color.WHITE,
                20,
                active ? 0 : Color.parseColor("#CBD5E1")
            ));
            chip.setTextColor(active ? Color.WHITE : Color.parseColor("#334155"));
            LinearLayout.LayoutParams cLp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, dp(36)
            );
            cLp.setMargins(0, 0, dp(8), 0);
            chip.setLayoutParams(cLp);
            chip.setPadding(dp(14), 0, dp(14), 0);
            chip.setOnClickListener(v -> {
                selectedCategory = cat[0];
                renderCurrentTab();
            });
            chipRow.addView(chip);
        }
        chipScroll.addView(chipRow);
        contentContainer.addView(chipScroll);

        // Services List
        ScrollView scroll = new ScrollView(this);
        scroll.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f
        ));
        LinearLayout listLayout = new LinearLayout(this);
        listLayout.setOrientation(LinearLayout.VERTICAL);
        listLayout.setPadding(dp(14), dp(6), dp(14), dp(16));
        scroll.addView(listLayout);
        contentContainer.addView(scroll);

        // Floating Blue Bottom Cart Bar (eDemand Customer App style)
        int cartTotal = 0;
        int cartCount = 0;
        for (ServiceItem s : allServices) {
            if (cartQty.containsKey(s.id)) {
                int q = cartQty.get(s.id);
                cartCount += q;
                cartTotal += s.price * q;
            }
        }
        if (cartCount > 0) {
            LinearLayout cartBar = new LinearLayout(this);
            cartBar.setOrientation(LinearLayout.HORIZONTAL);
            cartBar.setBackgroundColor(Color.parseColor("#0079FF"));
            cartBar.setPadding(dp(16), dp(10), dp(16), dp(10));
            cartBar.setGravity(Gravity.CENTER_VERTICAL);

            TextView cTv = new TextView(this);
            cTv.setText("₹" + cartTotal + "  |  " + cartCount + " service(s)");
            cTv.setTextColor(Color.WHITE);
            cTv.setTypeface(null, Typeface.BOLD);
            cTv.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

            Button goBtn = new Button(this);
            goBtn.setText("Check Out >");
            goBtn.setAllCaps(false);
            goBtn.setTextColor(Color.parseColor("#0079FF"));
            goBtn.setTypeface(null, Typeface.BOLD);
            goBtn.setBackground(roundedBg(Color.WHITE, 8, 0));
            goBtn.setOnClickListener(v -> {
                currentTab = 1;
                renderCurrentTab();
            });

            cartBar.addView(cTv);
            cartBar.addView(goBtn);
            contentContainer.addView(cartBar);
        }

        Runnable populateList = () -> {
            listLayout.removeAllViews();
            String q = searchQuery.trim().toLowerCase();
            for (ServiceItem srv : allServices) {
                boolean catOk = selectedCategory.equals("all") || srv.categoryId.equals(selectedCategory);
                boolean qOk = q.isEmpty() || srv.name.toLowerCase().contains(q) || srv.categoryName.toLowerCase().contains(q);
                if (!catOk || !qOk) continue;

                LinearLayout card = new LinearLayout(this);
                card.setOrientation(LinearLayout.VERTICAL);
                card.setBackground(roundedBg(Color.WHITE, 14, Color.parseColor("#E2E8F0")));
                card.setPadding(dp(14), dp(14), dp(14), dp(14));
                LinearLayout.LayoutParams cardLp = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
                );
                cardLp.setMargins(0, 0, 0, dp(10));
                card.setLayoutParams(cardLp);

                ImageView imgView = new ImageView(this);
                imgView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                LinearLayout.LayoutParams imgLp = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, dp(145)
                );
                imgLp.setMargins(0, 0, 0, dp(10));
                imgView.setLayoutParams(imgLp);
                imgView.setClipToOutline(true);
                imgView.setBackground(roundedBg(Color.parseColor("#F1F5F9"), 10, 0));
                loadServiceImage(imgView, srv);
                card.addView(imgView);

                TextView catTv = new TextView(this);
                catTv.setText(srv.categoryName.toUpperCase());
                catTv.setTextColor(Color.parseColor("#4F46E5"));
                catTv.setTextSize(11);
                catTv.setTypeface(null, Typeface.BOLD);

                TextView nameTv = new TextView(this);
                nameTv.setText(srv.name);
                nameTv.setTextColor(Color.parseColor("#0F172A"));
                nameTv.setTextSize(16);
                nameTv.setTypeface(null, Typeface.BOLD);

                TextView metaTv = new TextView(this);
                metaTv.setText("★ " + srv.rating + "  •  " + srv.durationMins + " mins  •  " + srv.warrantyDays + "d warranty");
                metaTv.setTextColor(Color.parseColor("#64748B"));
                metaTv.setTextSize(12);

                TextView descTv = new TextView(this);
                descTv.setText(srv.desc);
                descTv.setTextColor(Color.parseColor("#475569"));
                descTv.setTextSize(13);
                descTv.setPadding(0, dp(4), 0, dp(10));

                LinearLayout bottomRow = new LinearLayout(this);
                bottomRow.setOrientation(LinearLayout.HORIZONTAL);
                bottomRow.setGravity(Gravity.CENTER_VERTICAL);

                TextView priceTv = new TextView(this);
                priceTv.setText("₹" + srv.price);
                priceTv.setTextColor(Color.parseColor("#0F172A"));
                priceTv.setTextSize(18);
                priceTv.setTypeface(null, Typeface.BOLD);
                priceTv.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

                int qty = cartQty.containsKey(srv.id) ? cartQty.get(srv.id) : 0;
                bottomRow.addView(priceTv);

                if (qty == 0) {
                    Button addBtn = new Button(this);
                    addBtn.setText("+ Add");
                    addBtn.setAllCaps(false);
                    addBtn.setTextColor(Color.WHITE);
                    addBtn.setBackground(roundedBg(Color.parseColor("#4F46E5"), 10, 0));
                    addBtn.setOnClickListener(v -> {
                        cartQty.put(srv.id, 1);
                        renderCurrentTab();
                    });
                    bottomRow.addView(addBtn);
                } else {
                    Button minusBtn = new Button(this);
                    minusBtn.setText("-");
                    minusBtn.setBackground(roundedBg(Color.parseColor("#EEF2FF"), 8, Color.parseColor("#4F46E5")));
                    minusBtn.setOnClickListener(v -> {
                        if (qty <= 1) cartQty.remove(srv.id);
                        else cartQty.put(srv.id, qty - 1);
                        renderCurrentTab();
                    });

                    TextView qtyTv = new TextView(this);
                    qtyTv.setText("  " + qty + "  ");
                    qtyTv.setTypeface(null, Typeface.BOLD);
                    qtyTv.setTextSize(15);

                    Button plusBtn = new Button(this);
                    plusBtn.setText("+");
                    plusBtn.setBackground(roundedBg(Color.parseColor("#EEF2FF"), 8, Color.parseColor("#4F46E5")));
                    plusBtn.setOnClickListener(v -> {
                        cartQty.put(srv.id, qty + 1);
                        renderCurrentTab();
                    });

                    bottomRow.addView(minusBtn);
                    bottomRow.addView(qtyTv);
                    bottomRow.addView(plusBtn);
                }

                card.addView(catTv);
                card.addView(nameTv);
                card.addView(metaTv);
                card.addView(descTv);
                card.addView(bottomRow);
                listLayout.addView(card);
            }
        };

        populateList.run();

        searchBox.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchQuery = s.toString();
                populateList.run();
            }
            @Override public void afterTextChanged(Editable s) {}
        });
    }

    private void renderCartTab() {
        ScrollView scroll = new ScrollView(this);
        scroll.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
        ));
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(16), dp(16), dp(16), dp(24));
        scroll.addView(col);
        contentContainer.addView(scroll);

        if (cartQty.isEmpty()) {
            TextView empty = new TextView(this);
            empty.setText("Your cart is empty. Add AC, TV, Mobile, Laptop or home services from the Services tab.");
            empty.setTextColor(Color.parseColor("#64748B"));
            empty.setTextSize(15);
            col.addView(empty);
            return;
        }

        int total = 0;
        List<ServiceItem> selectedItems = new ArrayList<>();
        for (ServiceItem s : allServices) {
            if (cartQty.containsKey(s.id)) {
                int q = cartQty.get(s.id);
                total += s.price * q;
                selectedItems.add(s);

                LinearLayout row = new LinearLayout(this);
                row.setBackground(roundedBg(Color.WHITE, 12, Color.parseColor("#E2E8F0")));
                row.setPadding(dp(12), dp(12), dp(12), dp(12));
                LinearLayout.LayoutParams rLp = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
                );
                rLp.setMargins(0, 0, 0, dp(8));
                row.setLayoutParams(rLp);

                TextView tv = new TextView(this);
                tv.setText(s.name + "\n₹" + s.price + " × " + q + " = ₹" + (s.price * q));
                tv.setTextSize(14);
                tv.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

                Button rm = new Button(this);
                rm.setText("Remove");
                rm.setAllCaps(false);
                rm.setOnClickListener(v -> {
                    cartQty.remove(s.id);
                    renderCurrentTab();
                });

                row.addView(tv);
                row.addView(rm);
                col.addView(row);
            }
        }

        TextView formHeader = new TextView(this);
        formHeader.setText("Visit & Customer Details (Total: ₹" + total + ")");
        formHeader.setTextSize(16);
        formHeader.setTypeface(null, Typeface.BOLD);
        formHeader.setPadding(0, dp(12), 0, dp(8));
        col.addView(formHeader);

        EditText nameEt = makeInput("Full Name");
        EditText phoneEt = makeInput("Mobile Number (+91 ...)");
        EditText addressEt = makeInput("Complete Address");
        EditText dateEt = makeInput("Date (YYYY-MM-DD)");
        dateEt.setText("2026-11-26");
        EditText notesEt = makeInput("Issue Notes (Optional)");

        Spinner citySp = new Spinner(this);
        citySp.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item,
            new String[]{"Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune"}));

        Spinner slotSp = new Spinner(this);
        slotSp.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item,
            new String[]{"10:00 AM - 11:00 AM", "12:00 PM - 01:00 PM", "02:00 PM - 03:00 PM", "04:00 PM - 05:00 PM"}));

        col.addView(nameEt);
        col.addView(phoneEt);
        col.addView(addressEt);
        col.addView(citySp);
        col.addView(dateEt);
        col.addView(slotSp);
        col.addView(notesEt);

        final int finalTotal = total;
        Button submitBtn = new Button(this);
        submitBtn.setText("Confirm Booking • ₹" + total);
        submitBtn.setAllCaps(false);
        submitBtn.setTextColor(Color.WHITE);
        submitBtn.setTextSize(15);
        submitBtn.setTypeface(null, Typeface.BOLD);
        submitBtn.setBackground(roundedBg(Color.parseColor("#4F46E5"), 12, 0));
        LinearLayout.LayoutParams bLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(48)
        );
        bLp.setMargins(0, dp(14), 0, 0);
        submitBtn.setLayoutParams(bLp);

        submitBtn.setOnClickListener(v -> {
            String cname = nameEt.getText().toString().trim();
            String cphone = phoneEt.getText().toString().trim();
            String caddr = addressEt.getText().toString().trim();
            if (cname.isEmpty() || cphone.isEmpty() || caddr.isEmpty()) {
                Toast.makeText(this, "Please fill Name, Phone and Address", Toast.LENGTH_SHORT).show();
                return;
            }
            submitBooking(
                cname, cphone, caddr,
                citySp.getSelectedItem().toString(),
                dateEt.getText().toString().trim(),
                slotSp.getSelectedItem().toString(),
                notesEt.getText().toString().trim(),
                selectedItems, finalTotal
            );
        });
        col.addView(submitBtn);
    }

    private EditText makeInput(String hint) {
        EditText et = new EditText(this);
        et.setHint(hint);
        et.setBackground(roundedBg(Color.WHITE, 10, Color.parseColor("#CBD5E1")));
        et.setPadding(dp(12), dp(10), dp(12), dp(10));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        lp.setMargins(0, 0, 0, dp(8));
        et.setLayoutParams(lp);
        return et;
    }

    private void renderBookingsTab() {
        ScrollView scroll = new ScrollView(this);
        scroll.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
        ));
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(16), dp(16), dp(16), dp(24));
        scroll.addView(col);
        contentContainer.addView(scroll);

        // Server settings card
        LinearLayout srvCard = new LinearLayout(this);
        srvCard.setOrientation(LinearLayout.VERTICAL);
        srvCard.setBackground(roundedBg(Color.WHITE, 12, Color.parseColor("#E2E8F0")));
        srvCard.setPadding(dp(14), dp(14), dp(14), dp(14));

        TextView srvLbl = new TextView(this);
        srvLbl.setText("Backend Server URL (Emulator: 10.0.2.2:4000)");
        srvLbl.setTypeface(null, Typeface.BOLD);

        EditText urlEt = makeInput("http://10.0.2.2:4000");
        urlEt.setText(serverUrl);

        Button connBtn = new Button(this);
        connBtn.setText("Connect & Refresh");
        connBtn.setAllCaps(false);
        connBtn.setTextColor(Color.WHITE);
        connBtn.setBackground(roundedBg(Color.parseColor("#4F46E5"), 10, 0));
        connBtn.setOnClickListener(v -> {
            serverUrl = urlEt.getText().toString().trim();
            syncWithServer(true);
        });

        srvCard.addView(srvLbl);
        srvCard.addView(urlEt);
        srvCard.addView(connBtn);
        col.addView(srvCard);

        TextView hdr = new TextView(this);
        hdr.setText("Recent Bookings (" + bookings.size() + ")");
        hdr.setTextSize(16);
        hdr.setTypeface(null, Typeface.BOLD);
        hdr.setPadding(0, dp(16), 0, dp(8));
        col.addView(hdr);

        for (BookingItem b : bookings) {
            LinearLayout card = new LinearLayout(this);
            card.setOrientation(LinearLayout.VERTICAL);
            card.setBackground(roundedBg(Color.WHITE, 12, Color.parseColor("#E2E8F0")));
            card.setPadding(dp(14), dp(12), dp(14), dp(12));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            );
            lp.setMargins(0, 0, 0, dp(8));
            card.setLayoutParams(lp);

            TextView t1 = new TextView(this);
            t1.setText(b.code + " • " + b.customerName + "  [" + b.status.toUpperCase() + "]");
            t1.setTypeface(null, Typeface.BOLD);

            TextView t2 = new TextView(this);
            t2.setText(b.itemsSummary);
            t2.setTextColor(Color.parseColor("#475569"));

            TextView t3 = new TextView(this);
            t3.setText(b.date + " • " + b.slot + " • ₹" + b.total);
            t3.setTextColor(Color.parseColor("#64748B"));
            t3.setTextSize(12);

            card.addView(t1);
            card.addView(t2);
            card.addView(t3);
            if (b.techName != null && !b.techName.isEmpty()) {
                TextView t4 = new TextView(this);
                t4.setText("Assigned Pro: " + b.techName);
                t4.setTextColor(Color.parseColor("#10B981"));
                t4.setTypeface(null, Typeface.BOLD);
                card.addView(t4);
            }
            col.addView(card);
        }
    }

    private void syncWithServer(boolean showToast) {
        executor.execute(() -> {
            try {
                // Fetch services
                HttpURLConnection c1 = (HttpURLConnection) new URL(serverUrl + "/api/services").openConnection();
                c1.setConnectTimeout(3000);
                c1.setReadTimeout(3000);
                if (c1.getResponseCode() == 200) {
                    BufferedReader br = new BufferedReader(new InputStreamReader(c1.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) sb.append(line);
                    JSONArray arr = new JSONArray(sb.toString());
                    List<ServiceItem> loaded = new ArrayList<>();
                    for (int i = 0; i < arr.length(); i++) {
                        JSONObject o = arr.getJSONObject(i);
                        loaded.add(new ServiceItem(
                            o.getString("id"),
                            o.getString("category_id"),
                            o.optString("category_name", "Service"),
                            o.getString("name"),
                            o.optString("description", ""),
                            o.getInt("price"),
                            o.optInt("original_price", 0),
                            o.optInt("duration_mins", 45),
                            o.optDouble("rating", 4.8),
                            o.optInt("warranty_days", 30),
                            o.optString("image_url", "/images/ac.jpg")
                        ));
                    }
                    // Fetch bookings
                    HttpURLConnection c2 = (HttpURLConnection) new URL(serverUrl + "/api/bookings").openConnection();
                    c2.setConnectTimeout(3000);
                    c2.setReadTimeout(3000);
                    List<BookingItem> loadedBookings = new ArrayList<>();
                    if (c2.getResponseCode() == 200) {
                        BufferedReader br2 = new BufferedReader(new InputStreamReader(c2.getInputStream()));
                        StringBuilder sb2 = new StringBuilder();
                        while ((line = br2.readLine()) != null) sb2.append(line);
                        JSONArray bArr = new JSONArray(sb2.toString());
                        for (int i = 0; i < bArr.length(); i++) {
                            JSONObject o = bArr.getJSONObject(i);
                            JSONArray items = o.optJSONArray("items");
                            StringBuilder sum = new StringBuilder();
                            if (items != null) {
                                for (int j = 0; j < items.length(); j++) {
                                    JSONObject it = items.getJSONObject(j);
                                    if (j > 0) sum.append(", ");
                                    sum.append(it.optString("name")).append(" ×").append(it.optInt("qty", 1));
                                }
                            }
                            loadedBookings.add(new BookingItem(
                                o.optString("booking_code"),
                                o.optString("customer_name"),
                                sum.toString(),
                                o.optString("scheduled_date"),
                                o.optString("scheduled_slot"),
                                o.optInt("total_amount"),
                                o.optString("status"),
                                o.isNull("technician_name") ? null : o.optString("technician_name")
                            ));
                        }
                    }

                    mainHandler.post(() -> {
                        if (!loaded.isEmpty()) {
                            allServices.clear();
                            allServices.addAll(loaded);
                        }
                        bookings.clear();
                        bookings.addAll(loadedBookings);
                        isOnline = true;
                        statusSubtitle.setText("Connected to Live Server");
                        statusSubtitle.setTextColor(Color.parseColor("#34D399"));
                        renderCurrentTab();
                        if (showToast) Toast.makeText(this, "Synced with server!", Toast.LENGTH_SHORT).show();
                    });
                }
            } catch (Exception e) {
                mainHandler.post(() -> {
                    isOnline = false;
                    statusSubtitle.setText("Offline Catalog Mode");
                    statusSubtitle.setTextColor(Color.parseColor("#94A3B8"));
                    if (showToast) Toast.makeText(this, "Server unreachable — using offline mode", Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    private void submitBooking(String name, String phone, String addr, String city,
                               String date, String slot, String notes,
                               List<ServiceItem> items, int total) {
        executor.execute(() -> {
            StringBuilder summary = new StringBuilder();
            JSONArray arr = new JSONArray();
            try {
                for (int i = 0; i < items.size(); i++) {
                    ServiceItem s = items.get(i);
                    int q = cartQty.get(s.id);
                    if (i > 0) summary.append(", ");
                    summary.append(s.name).append(" ×").append(q);
                    JSONObject obj = new JSONObject();
                    obj.put("id", s.id);
                    obj.put("name", s.name);
                    obj.put("price", s.price);
                    obj.put("qty", q);
                    arr.put(obj);
                }

                JSONObject payload = new JSONObject();
                payload.put("customer_name", name);
                payload.put("customer_phone", phone);
                payload.put("address", addr);
                payload.put("city", city);
                payload.put("scheduled_date", date);
                payload.put("scheduled_slot", slot);
                payload.put("notes", notes);
                payload.put("items", arr);
                payload.put("source", "android");

                HttpURLConnection conn = (HttpURLConnection) new URL(serverUrl + "/api/bookings").openConnection();
                conn.setConnectTimeout(3500);
                conn.setReadTimeout(3500);
                conn.setRequestMethod("POST");
                conn.setDoOutput(true);
                conn.setRequestProperty("Content-Type", "application/json");
                try (OutputStream os = conn.getOutputStream()) {
                    os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
                }

                if (conn.getResponseCode() >= 200 && conn.getResponseCode() < 300) {
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) sb.append(line);
                    JSONObject res = new JSONObject(sb.toString());
                    String code = res.optString("booking_code", "HS-NEW");
                    mainHandler.post(() -> {
                        bookings.add(0, new BookingItem(code, name, summary.toString(), date, slot, total, "pending", null));
                        cartQty.clear();
                        currentTab = 2;
                        renderCurrentTab();
                        Toast.makeText(this, "Booking " + code + " confirmed!", Toast.LENGTH_LONG).show();
                    });
                    return;
                }
            } catch (Exception ignored) {}

            // Offline fallback
            String localCode = "HS-" + (1000 + new Random().nextInt(9000));
            mainHandler.post(() -> {
                bookings.add(0, new BookingItem(localCode, name, summary.toString(), date, slot, total, "pending", null));
                cartQty.clear();
                currentTab = 2;
                renderCurrentTab();
                Toast.makeText(this, "Saved offline (" + localCode + ")", Toast.LENGTH_LONG).show();
            });
        });
    }

    private int getFallbackDrawable(String categoryId) {
        if ("cat-laptop".equals(categoryId)) return R.drawable.img_laptop;
        if ("cat-mobile".equals(categoryId)) return R.drawable.img_mobile;
        if ("cat-tv".equals(categoryId)) return R.drawable.img_tv;
        if ("cat-accessories".equals(categoryId)) return R.drawable.img_accessories;
        return R.drawable.img_ac;
    }

    private void loadServiceImage(ImageView iv, ServiceItem srv) {
        iv.setImageResource(getFallbackDrawable(srv.categoryId));
        if (srv.imageUrl == null || srv.imageUrl.isEmpty()) return;
        String fullUrl = srv.imageUrl.startsWith("http") ? srv.imageUrl : (serverUrl + srv.imageUrl);
        Bitmap cached = imageCache.get(fullUrl);
        if (cached != null) {
            iv.setImageBitmap(cached);
            return;
        }
        iv.setTag(fullUrl);
        executor.execute(() -> {
            try {
                HttpURLConnection conn = (HttpURLConnection) new URL(fullUrl).openConnection();
                conn.setConnectTimeout(4000);
                conn.setReadTimeout(4000);
                if (conn.getResponseCode() == 200) {
                    Bitmap bmp = BitmapFactory.decodeStream(conn.getInputStream());
                    if (bmp != null) {
                        imageCache.put(fullUrl, bmp);
                        mainHandler.post(() -> {
                            if (fullUrl.equals(iv.getTag())) iv.setImageBitmap(bmp);
                        });
                    }
                }
            } catch (Exception ignored) {}
        });
    }
}
