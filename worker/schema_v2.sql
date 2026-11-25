ALTER TABLE services ADD COLUMN image_url TEXT DEFAULT '/images/ac.jpg';

INSERT OR IGNORE INTO categories (id, name, slug, icon, color, tagline, sort_order) VALUES
  ('cat-accessories', 'Accessories & Gadgets', 'accessories', 'Cpu', '#ec4899', 'Chargers, SSDs, keyboards, cases & audio', 5);

UPDATE services SET image_url = '/images/ac.jpg' WHERE category_id IN ('cat-ac', 'cat-appliance', 'cat-electrician', 'cat-plumber', 'cat-cleaning', 'cat-carpenter', 'cat-painting', 'cat-pest', 'cat-ro');
UPDATE services SET image_url = '/images/tv.jpg' WHERE category_id = 'cat-tv';
UPDATE services SET image_url = '/images/mobile.jpg' WHERE category_id = 'cat-mobile';
UPDATE services SET image_url = '/images/laptop.jpg' WHERE category_id = 'cat-laptop';

INSERT OR REPLACE INTO services (id, category_id, name, description, price, original_price, duration_mins, rating, reviews_count, warranty_days, includes, is_popular, is_active, image_url) VALUES
  -- Extra Laptops
  ('srv-lap-4', 'cat-laptop', 'MacBook Air / Pro Retina Display Replacement', 'Original TrueTone Retina panel replacement for M1/M2/M3 MacBooks.', 14999, 19500, 90, 4.9, 890, 180, 'OEM Retina Panel,TrueTone calibration,90-min doorstep', 1, 1, '/images/laptop.jpg'),
  ('srv-lap-5', 'cat-laptop', 'Gaming Laptop GPU Repaste & Dual-Fan Service', 'Liquid-metal / Arctic MX-6 repaste for ROG, Legion & Victus laptops.', 1199, 1699, 60, 4.9, 1240, 60, 'Dual fan deep clean,MX-6 thermal paste,Stress test report', 1, 1, '/images/laptop.jpg'),
  ('srv-lap-6', 'cat-laptop', 'Laptop 16GB / 32GB DDR4/DDR5 RAM Upgrade', 'Boost multitasking & editing speed with branded Crucial/Corsair RAM.', 3499, 4499, 30, 4.8, 760, 365, 'Genuine RAM module,Dual-channel check,1-year warranty', 0, 1, '/images/laptop.jpg'),
  ('srv-lap-7', 'cat-laptop', 'Laptop Battery & Type-C Charger Replacement', 'High-backup 6-cell battery & original wattage adapter at home.', 2499, 3299, 40, 4.8, 1120, 180, 'Zero-cycle battery,Voltage & IC test,6-month warranty', 0, 1, '/images/laptop.jpg'),
  ('srv-lap-8', 'cat-laptop', 'Dell / HP / Lenovo Broken Hinge & Body Fix', 'Precision chassis welding, hinge alignment & palmrest restoration.', 999, 1499, 75, 4.7, 640, 90, 'Metal hinge reinforcement,Bezel alignment,Smooth open/close', 0, 1, '/images/laptop.jpg'),

  -- Extra Mobiles
  ('srv-mob-4', 'cat-mobile', 'iPhone 14 / 15 / 16 Pro OLED Display Swap', '120Hz ProMotion OLED screen with FaceID & TrueTone retention.', 6999, 9499, 45, 4.9, 1580, 180, '120Hz OLED display,TrueTone transfer,Free edge-to-edge glass', 1, 1, '/images/mobile.jpg'),
  ('srv-mob-5', 'cat-mobile', 'Samsung S23 / S24 Ultra Curved AMOLED Fix', 'Original Dynamic AMOLED 2X screen & ultrasonic fingerprint calibration.', 8499, 11200, 60, 4.9, 920, 180, 'Dynamic AMOLED 2X,Fingerprint calibration,Water-seal tape', 1, 1, '/images/mobile.jpg'),
  ('srv-mob-6', 'cat-mobile', 'OnePlus / Xiaomi / Realme SuperVOOC Screen Fix', 'Fast doorstep display replacement with original brightness & touch.', 2499, 3499, 35, 4.8, 1840, 90, 'AMOLED/IPS panel,Touch & sensor test,Free tempered glass', 0, 1, '/images/mobile.jpg'),
  ('srv-mob-7', 'cat-mobile', 'Phone Back Glass & Camera Lens Replacement', 'Laser-cut OEM back glass & sapphire camera ring replacement.', 1299, 1899, 40, 4.8, 710, 60, 'OEM back panel,Camera dust clean,Sealant finish', 0, 1, '/images/mobile.jpg'),

  -- Extra TVs
  ('srv-tv-4', 'cat-tv', '55" / 65" 4K QLED & OLED TV Panel & T-Con Fix', 'Fix vertical lines, double image, flickering & no-picture issues.', 2499, 3699, 90, 4.8, 860, 90, 'T-Con & COF check,Panel bonding test,Color calibration', 1, 1, '/images/tv.jpg'),
  ('srv-tv-5', 'cat-tv', 'Smart TV Wi-Fi, Android OS & Motherboard Repair', 'Resolve boot-loop, slow OS, HDMI port or Wi-Fi disconnect faults.', 1299, 1899, 60, 4.8, 1040, 60, 'Mainboard diagnostics,Firmware flash,HDMI/audio test', 0, 1, '/images/tv.jpg'),
  ('srv-tv-6', 'cat-tv', 'Swivel / Heavy-Duty TV Wall Mount (50"–85")', 'Full-motion articulating bracket installation with hidden trunking.', 999, 1499, 60, 4.9, 1420, 90, 'Heavy-duty swivel mount,Spirit-level align,Cable concealment', 1, 1, '/images/tv.jpg'),
  ('srv-tv-7', 'cat-tv', 'Soundbar & Home Theater 5.1 Setup', 'Dolby Atmos HDMI eARC setup, speaker mounting & acoustic tuning.', 799, 1199, 60, 4.9, 630, 30, 'Wall mount & wiring,eARC/Optical sync,Bass calibration', 0, 1, '/images/tv.jpg'),

  -- Accessories & Gadgets
  ('srv-acc-1', 'cat-accessories', '65W GaN Fast Charger + Braided USB-C Cable', 'Ultra-compact 3-port GaN charger for MacBook, iPhone & Android.', 1499, 2199, 15, 4.9, 2340, 365, '65W PD 3.0 GaN,100W braided cable,1-year replacement', 1, 1, '/images/accessories.jpg'),
  ('srv-acc-2', 'cat-accessories', '1TB NVMe M.2 SSD + Aluminum USB-C Enclosure', 'Ultra-fast 10Gbps portable storage & laptop upgrade kit.', 5499, 6999, 20, 4.9, 1180, 1095, '1TB Gen4 NVMe SSD,Thermal pad enclosure,3-year warranty', 1, 1, '/images/accessories.jpg'),
  ('srv-acc-3', 'cat-accessories', '8-in-1 Aluminum USB-C Hub (4K HDMI + 100W PD)', 'Expand MacBook/Ultrabook with 4K HDMI, Gigabit LAN, SD & USB 3.0.', 1699, 2499, 15, 4.8, 940, 365, '4K@60Hz HDMI,100W PD pass-through,1Gbps Ethernet', 0, 1, '/images/accessories.jpg'),
  ('srv-acc-4', 'cat-accessories', 'Wireless Mechanical Keyboard & Silent Mouse Combo', 'Hot-swappable compact keyboard + dual-mode Bluetooth mouse.', 2299, 3199, 15, 4.8, 820, 365, 'Tri-mode wireless,RGB backlight,Rechargeable battery', 1, 1, '/images/accessories.jpg'),
  ('srv-acc-5', 'cat-accessories', 'ANC Wireless Earbuds Pro (40dB Noise Cancel)', '40-hour battery, dual-device pairing & quad-mic ENC calling.', 1799, 2999, 15, 4.8, 1650, 365, '40dB Active Noise Cancel,Type-C fast charge,1-year warranty', 0, 1, '/images/accessories.jpg'),
  ('srv-acc-6', 'cat-accessories', 'Dual-Fan RGB Laptop Cooling Stand + Phone Holder', '6-level ergonomic height stand with silent high-RPM cooling fans.', 1199, 1799, 15, 4.7, 730, 180, 'Dual silent fans,6 height angles,Detachable phone mount', 0, 1, '/images/accessories.jpg');
