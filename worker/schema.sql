CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  tagline TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  duration_mins INTEGER NOT NULL,
  rating REAL DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 120,
  warranty_days INTEGER DEFAULT 30,
  includes TEXT NOT NULL,
  is_popular INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS technicians (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  city TEXT NOT NULL,
  rating REAL DEFAULT 4.8,
  jobs_completed INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  avatar_color TEXT DEFAULT '#6366f1'
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  scheduled_slot TEXT NOT NULL,
  payment_method TEXT DEFAULT 'Cash / UPI on Visit',
  notes TEXT DEFAULT '',
  items_json TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  technician_id TEXT,
  source TEXT DEFAULT 'website',
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO categories (id, name, slug, icon, color, tagline, sort_order) VALUES
  ('cat-ac', 'AC & Cooling', 'ac-repair', 'Wind', '#0ea5e9', 'Service, gas refill & installation', 1),
  ('cat-tv', 'TV & Entertainment', 'tv-repair', 'Tv', '#8b5cf6', 'LED, QLED, OLED repair & wall mount', 2),
  ('cat-mobile', 'Mobile Repair', 'mobile-repair', 'Smartphone', '#ec4899', 'Doorstep screen, battery & charging fix', 3),
  ('cat-laptop', 'Laptop & PC', 'laptop-repair', 'Laptop', '#6366f1', 'SSD upgrade, OS, hinge & motherboard', 4),
  ('cat-appliance', 'Washing Machine & Fridge', 'appliances', 'Refrigerator', '#14b8a6', 'Front/top load, inverter fridge & microwave', 5),
  ('cat-electrician', 'Electrician', 'electrician', 'Zap', '#f59e0b', 'Switches, MCB, fan, inverter & wiring', 6),
  ('cat-plumber', 'Plumbing', 'plumbing', 'Wrench', '#3b82f6', 'Tap, leakage, motor & bathroom fittings', 7),
  ('cat-cleaning', 'Home Deep Cleaning', 'cleaning', 'Sparkles', '#10b981', 'Full home, kitchen, sofa & bathroom spa', 8),
  ('cat-carpenter', 'Carpentry', 'carpentry', 'Hammer', '#d97706', 'Door lock, furniture repair & assembly', 9),
  ('cat-painting', 'Painting & Waterproofing', 'painting', 'Paintbrush', '#f43f5e', 'Interior walls, texture & dampness fix', 10),
  ('cat-pest', 'Pest Control', 'pest-control', 'ShieldCheck', '#84cc16', 'Cockroach, termite & bed-bug treatment', 11),
  ('cat-ro', 'RO & Chimney', 'ro-chimney', 'Droplets', '#06b6d4', 'RO filter kit, UV lamp & chimney deep clean', 12);

INSERT OR IGNORE INTO services (id, category_id, name, description, price, original_price, duration_mins, rating, reviews_count, warranty_days, includes, is_popular) VALUES
  ('srv-ac-1', 'cat-ac', 'Foam-Jet AC Service (Split)', '2X deeper indoor & outdoor jet cleaning for maximum cooling.', 599, 899, 60, 4.9, 4820, 30, 'Foam jet wash,Filter & coil cleaning,Drain pipe flush,Cooling check', 1),
  ('srv-ac-2', 'cat-ac', 'AC Gas Refill & Leak Fix', 'Complete R32/R410A refrigerant refill with nitrogen leak testing.', 2499, 3200, 90, 4.8, 1940, 60, 'Nitrogen leak test,Vacuuming,Full gas top-up,Ampere check', 1),
  ('srv-ac-3', 'cat-ac', 'Split AC Installation', 'Precision indoor & outdoor unit mounting with copper piping check.', 1499, 1999, 120, 4.8, 1320, 30, 'Wall drilling,Indoor/outdoor mount,Vacuum & pressure test', 0),
  ('srv-ac-4', 'cat-ac', 'AC Not Cooling Diagnosis', 'Expert PCB, capacitor, compressor & sensor inspection.', 299, 499, 45, 4.7, 2150, 30, 'Full electrical diagnosis,Error code scan,Repair quote', 0),
  ('srv-tv-1', 'cat-tv', 'LED / Smart TV Inspection & Repair', 'Fix no-display, backlight, sound or motherboard issues at home.', 349, 599, 45, 4.8, 1650, 45, 'Panel & T-con check,Power supply test,Backlight diagnostics', 1),
  ('srv-tv-2', 'cat-tv', 'TV Wall Mount Installation (up to 65")', 'Laser-leveled wall mounting with concealed cable routing.', 499, 799, 45, 4.9, 2890, 30, 'Bracket alignment,Heavy-duty anchors,HDMI/power setup', 1),
  ('srv-tv-3', 'cat-tv', 'TV Backlight Strip Replacement', 'Restore bright uniform display for dim or dark TV screens.', 1899, 2599, 90, 4.7, 740, 90, 'LED strip kit,Diffuser cleaning,Brightness calibration', 0),
  ('srv-mob-1', 'cat-mobile', 'Doorstep Mobile Screen Replacement', 'Original-grade OLED/LCD display replacement in 30 mins.', 1999, 2799, 30, 4.9, 3410, 90, 'OEM-grade display,TrueTone/touch test,Free tempered glass', 1),
  ('srv-mob-2', 'cat-mobile', 'Mobile Battery Replacement', 'High-capacity zero-cycle battery replacement at your doorstep.', 999, 1499, 30, 4.8, 2240, 90, 'Zero-cycle battery,Charging IC check,Sealant re-application', 1),
  ('srv-mob-3', 'cat-mobile', 'Charging Port & Mic Fix', 'Fix slow charging, loose Type-C/Lightning port or muffled mic.', 599, 899, 40, 4.7, 980, 45, 'Port cleaning/swap,Voltage test,Mic & speaker test', 0),
  ('srv-lap-1', 'cat-laptop', 'Laptop Deep Clean & Thermal Paste', 'Solve overheating, loud fan noise & thermal throttling.', 699, 999, 60, 4.9, 1870, 30, 'Dust removal,Arctic thermal paste,Fan lubrication,Temp test', 1),
  ('srv-lap-2', 'cat-laptop', 'NVMe SSD Upgrade & Windows Setup', '10X faster boot speed with data migration & OS optimization.', 899, 1299, 60, 4.9, 1540, 60, 'SSD installation,OS & driver setup,Data backup transfer', 1),
  ('srv-lap-3', 'cat-laptop', 'Laptop Keyboard / Hinge / Screen Repair', 'Doorstep diagnosis & replacement for broken hinges, keys or LCD.', 399, 599, 45, 4.8, 1120, 60, 'Hardware inspection,Spare part sourcing,Full functionality test', 0),
  ('srv-app-1', 'cat-appliance', 'Washing Machine Repair (Front/Top)', 'Fix drum spin, water drain, error codes & vibration issues.', 349, 549, 60, 4.8, 2310, 30, 'Motor & pump check,Inlet valve clean,PCB diagnostics', 1),
  ('srv-app-2', 'cat-appliance', 'Refrigerator Cooling & Gas Fix', 'Fix freezer icing, weak cooling, thermostat & compressor relay.', 349, 599, 60, 4.8, 1890, 45, 'Thermostat & relay check,Door gasket test,Gas pressure check', 0),
  ('srv-app-3', 'cat-appliance', 'Microwave Heating & Magnetron Check', 'Resolve no-heating, sparking or touch-panel faults safely.', 299, 499, 45, 4.7, 680, 30, 'Magnetron & diode test,Capacitor check,Safety interlock test', 0),
  ('srv-elec-1', 'cat-electrician', 'Ceiling Fan / Exhaust Installation', 'Safe installation or regulator replacement with wiring check.', 249, 399, 30, 4.9, 3120, 30, 'Mounting & balancing,Regulator wiring,Speed & noise check', 0),
  ('srv-elec-2', 'cat-electrician', 'MCB, Switchboard & Inverter Wiring', 'Fix tripping breakers, burnt sockets or inverter backup setup.', 299, 499, 45, 4.8, 2740, 30, 'Load balancing check,MCB/socket swap,Earthing test', 1),
  ('srv-plm-1', 'cat-plumber', 'Tap, Mixer & Flush Tank Repair', 'Stop dripping taps, jammed angle valves & cistern leaks fast.', 199, 349, 30, 4.8, 2950, 30, 'Washer/cartridge fix,Leakage seal,Water pressure test', 0),
  ('srv-plm-2', 'cat-plumber', 'Water Motor & Overhead Tank Cleaning', 'Anti-bacterial tank scrubbing and booster pump check.', 799, 1199, 90, 4.9, 1410, 30, 'Mechanized dewatering,UV/anti-bacterial wash,Motor check', 0),
  ('srv-cln-1', 'cat-cleaning', 'Full Home Deep Cleaning (2BHK)', 'Machine scrubbing, bathroom descaling & kitchen degreasing.', 2999, 3999, 240, 4.9, 3620, 7, '3-person crew,Floor scrubbing machine,Eco-safe chemicals', 1),
  ('srv-cln-2', 'cat-cleaning', 'Sofa & Mattress Shampoo Spa (5-Seater)', 'Deep vacuuming, stain extraction & sanitization.', 799, 1199, 60, 4.8, 2190, 7, 'HEPA vacuuming,Foam shampooing,Hot-water extraction', 0),
  ('srv-crp-1', 'cat-carpenter', 'Door Lock, Hinge & Wardrobe Repair', 'Fix misaligned doors, smart locks, drawer channels & hinges.', 249, 399, 45, 4.8, 1680, 30, 'Alignment & planing,Hinge/channel fix,Lock fitting', 0),
  ('srv-pnt-1', 'cat-painting', 'Room Painting & Waterproofing Survey', 'Laser moisture scan, shade consultation & exact sqft quote.', 199, 499, 45, 4.9, 920, 30, 'Dampness meter scan,Color catalogue,Itemized estimate', 0),
  ('srv-pst-1', 'cat-pest', 'Cockroach & Ant Gel Treatment (2BHK)', 'Odorless Bayer gel & herbal spray with zero kitchen emptying.', 899, 1299, 45, 4.9, 2480, 90, 'Odorless gel bait,Drain treatment,90-day free re-service', 1),
  ('srv-ro-1', 'cat-ro', 'RO Purifier Complete Filter Service', 'Sediment, carbon, membrane check & TDS calibration.', 499, 799, 45, 4.8, 1950, 30, 'Filter sanitization,TDS & pH test,Leakage check', 0),
  ('srv-ro-2', 'cat-ro', 'Kitchen Chimney Deep Degreasing', 'Baffle filter & blower oil-grease removal for strong suction.', 699, 999, 60, 4.9, 1730, 30, 'Caustic degreasing,Blower cleaning,Suction & motor test', 0);

INSERT OR IGNORE INTO technicians (id, name, phone, specialty, city, rating, jobs_completed, is_available, avatar_color) VALUES
  ('tech-1', 'Rajesh Sharma', '+91 98765 43210', 'AC & Appliances', 'Delhi NCR', 4.9, 412, 1, '#0ea5e9'),
  ('tech-2', 'Vikram Patel', '+91 98111 22334', 'Mobile & Laptop', 'Delhi NCR', 4.9, 358, 1, '#6366f1'),
  ('tech-3', 'Aman Verma', '+91 98222 33445', 'TV & Electrician', 'Mumbai', 4.8, 289, 1, '#8b5cf6'),
  ('tech-4', 'Suresh Kumar', '+91 98333 44556', 'Plumbing & RO', 'Bengaluru', 4.8, 504, 1, '#14b8a6'),
  ('tech-5', 'Deepak Yadav', '+91 98444 55667', 'Cleaning & Pest', 'Delhi NCR', 4.9, 610, 1, '#10b981'),
  ('tech-6', 'Karan Singh', '+91 98555 66778', 'Laptop & TV', 'Hyderabad', 4.7, 195, 0, '#ec4899');

INSERT OR IGNORE INTO bookings (id, booking_code, customer_name, customer_phone, address, city, scheduled_date, scheduled_slot, payment_method, notes, items_json, total_amount, status, technician_id, source, created_at) VALUES
  ('bk-1', 'HS-1042', 'Ananya Gupta', '+91 99100 11223', 'B-402, Green Park Extension', 'Delhi NCR', '2026-11-26', '10:00 AM - 11:00 AM', 'UPI on Visit', 'Split AC making slight noise', '[{"id":"srv-ac-1","name":"Foam-Jet AC Service (Split)","price":599,"qty":2}]', 1198, 'assigned', 'tech-1', 'website', '2026-11-25T10:15:00Z'),
  ('bk-2', 'HS-1043', 'Rohan Mehta', '+91 98200 44556', '14th Main, Indiranagar', 'Bengaluru', '2026-11-26', '02:00 PM - 03:00 PM', 'Cash on Visit', 'iPhone 14 screen cracked', '[{"id":"srv-mob-1","name":"Doorstep Mobile Screen Replacement","price":1999,"qty":1}]', 1999, 'pending', NULL, 'android', '2026-11-25T11:05:00Z'),
  ('bk-3', 'HS-1044', 'Priya Nair', '+91 97400 77889', 'Flat 9B, Bandra West', 'Mumbai', '2026-11-25', '04:00 PM - 05:00 PM', 'Card / UPI', 'Laptop thermal paste + SSD', '[{"id":"srv-lap-1","name":"Laptop Deep Clean & Thermal Paste","price":699,"qty":1},{"id":"srv-lap-2","name":"NVMe SSD Upgrade & Windows Setup","price":899,"qty":1}]', 1598, 'completed', 'tech-2', 'website', '2026-11-24T16:30:00Z');
