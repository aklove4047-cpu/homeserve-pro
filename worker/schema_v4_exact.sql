DELETE FROM services;
DELETE FROM categories;
DELETE FROM technicians;
DELETE FROM bookings;
DELETE FROM custom_requests;
DELETE FROM chat_messages;
DELETE FROM transactions;

INSERT INTO categories (id, name, slug, icon, color, tagline, sort_order) VALUES
  ('cat-home', 'Home Services', 'home-services', 'Home', '#10b981', 'Kitchen, bathroom & full home cleaning', 1),
  ('cat-ac', 'AC Services', 'ac-services', 'Wind', '#0079ff', 'AC wash, gas refill & installation', 2),
  ('cat-laundry', 'Laundry Services', 'laundry-services', 'Sparkles', '#8b5cf6', 'Steam ironing, dry cleaning & wash', 3),
  ('cat-plumbing', 'Plumbing Services', 'plumbing-services', 'Wrench', '#ef4444', 'Water leaks, pump & bathroom fittings', 4),
  ('cat-pest', 'Pest Control Services', 'pest-control', 'ShieldCheck', '#06b6d4', 'Termite, cockroach & rodent control', 5),
  ('cat-electronic', 'Electronic Services', 'electronic-services', 'Zap', '#f59e0b', 'Switch, MCB, fan, inverter & EV charger', 6),
  ('cat-mechanic', 'Mechanic Services', 'mechanic-services', 'Car', '#3b82f6', 'Car wash, service, detailing & towing', 7),
  ('cat-salon', 'Salon Services', 'salon-services', 'Scissors', '#ec4899', 'Mens & womens haircut, facial & grooming', 8),
  ('cat-carpenter', 'Carpenter Services', 'carpenter-services', 'Hammer', '#d97706', 'Kitchen cabinets, shelves & door repair', 9),
  ('cat-pet', 'Pet Care', 'pet-care', 'Heart', '#14b8a6', 'Pet grooming, dental care & dog walking', 10);

INSERT INTO technicians (id, name, phone, specialty, city, rating, jobs_completed, is_available, avatar_color) VALUES
  ('tech-1', 'Electric', '+91 98765 43210', 'Electronic Services', 'Delhi NCR', 4.6, 133, 1, '#0f172a'),
  ('tech-2', 'PlumbService Pvt Ltd', '+91 98111 22334', 'Plumbing Services', 'Mumbai', 4.8, 94, 1, '#0079ff'),
  ('tech-3', 'World Clean Pvt. Ltd.', '+91 98222 33445', 'Home Services', 'Delhi NCR', 4.9, 118, 1, '#10b981'),
  ('tech-4', 'Piston Car Service', '+91 98333 44556', 'Mechanic Services', 'Bengaluru', 4.7, 82, 1, '#1e293b'),
  ('tech-5', 'QUB Saloon', '+91 98444 55667', 'Salon Services', 'Mumbai', 4.5, 65, 1, '#d97706'),
  ('tech-6', 'DiyingData Multi-Services', '+91 98555 66778', 'Laundry Services', 'Pune', 4.8, 74, 1, '#6366f1'),
  ('tech-7', 'Big Brand Electronic Service', '+91 98666 77889', 'Electronic Services', 'Hyderabad', 4.7, 51, 1, '#0284c7'),
  ('tech-8', 'Pestguard Pvt Ltd', '+91 98777 88990', 'Pest Control Services', 'Delhi NCR', 4.9, 46, 1, '#059669'),
  ('tech-9', 'Woodwork Carpentry', '+91 98888 99001', 'Carpenter Services', 'Jaipur', 4.8, 39, 1, '#b45309'),
  ('tech-10', 'CarePaws Clinic', '+91 98999 00112', 'Pet Care', 'Bengaluru', 4.9, 28, 1, '#dc2626');

INSERT INTO services (id, category_id, name, description, price, original_price, duration_mins, rating, reviews_count, warranty_days, includes, is_popular, is_active, image_url) VALUES
  -- Plumbing Solutions (exact 5 from screenshot)
  ('srv-plm-1', 'cat-plumbing', 'Water Leaks', 'Fast pipeline leak detection and waterproof pipe sealing.', 240, 350, 45, 4.8, 410, 30, 'Leak detection,Pipe sealing,Pressure check', 1, 1, '/images/ac.jpg'),
  ('srv-plm-2', 'cat-plumbing', 'Bathroom Installations', 'Complete sink, commode, mixer & sanitaryware installation.', 290, 450, 60, 4.9, 320, 30, 'Fixture mounting,Leak test,Sealant finish', 1, 1, '/images/ac.jpg'),
  ('srv-plm-3', 'cat-plumbing', 'Wall Pump Repair', 'Booster & wall water pump motor repair and priming.', 350, 500, 60, 4.8, 215, 30, 'Motor check,Impeller clean,Pressure test', 1, 1, '/images/ac.jpg'),
  ('srv-plm-4', 'cat-plumbing', 'Water Heater Repair', 'Geyser & instant water heater thermostat and coil fix.', 230, 380, 45, 4.8, 380, 45, 'Thermostat check,Element test,Safety valve check', 1, 1, '/images/ac.jpg'),
  ('srv-plm-5', 'cat-plumbing', 'Shower Installation', 'Overhead rain shower, hand shower & diverter installation.', 190, 320, 40, 4.9, 290, 30, 'Mixer alignment,Teflon sealing,Flow test', 1, 1, '/images/ac.jpg'),

  -- Electronic Services (exact from screenshot)
  ('srv-elc-1', 'cat-electronic', 'Ceiling Fan Installation', 'Precision ceiling fan mounting, balancing & regulator setup.', 180, 250, 30, 4.9, 620, 30, 'Mounting & balancing,Regulator wiring,Speed check', 1, 1, '/images/tv.jpg'),
  ('srv-elc-2', 'cat-electronic', 'Switch & Socket Repair', 'Replace burnt switches, modular sockets & USB outlets.', 100, 160, 25, 4.8, 540, 30, 'Safe isolation,Switch swap,Earthing check', 1, 1, '/images/tv.jpg'),
  ('srv-elc-3', 'cat-electronic', 'MCB & Fuse Box Repair', 'Fix tripping MCBs, short circuits & distribution board faults.', 190, 290, 45, 4.8, 390, 30, 'Load balancing,MCB replacement,Thermal check', 1, 1, '/images/tv.jpg'),
  ('srv-elc-4', 'cat-electronic', 'Inverter Setup & Battery Service', 'Complete home inverter wiring, distilled water & backup test.', 150, 250, 45, 4.9, 470, 60, 'Battery check,Inverter wiring,Backup load test', 1, 1, '/images/accessories.jpg'),
  ('srv-elc-5', 'cat-electronic', 'EV Charger Home Installation', 'Dedicated 7.4kW / 3.3kW EV wall-box charger installation.', 680, 950, 90, 4.9, 185, 90, 'MCB & RCCB setup,Armoured cabling,Voltage test', 1, 1, '/images/accessories.jpg'),

  -- Home Services (exact from screenshot)
  ('srv-hom-1', 'cat-home', 'Kitchen Cleaning', 'Deep chimney, stove, tiles & cabinet oil-grease removal.', 115, 199, 60, 4.8, 890, 7, 'Grease removal,Sink descaling,Cabinet wipe', 1, 1, '/images/ac.jpg'),
  ('srv-hom-2', 'cat-home', 'Bathroom Cleaning', 'Hard-water stain removal, tile scrubbing & sanitization.', 565, 799, 60, 4.9, 760, 7, 'Tile descaling,Glass polish,Disinfection', 1, 1, '/images/ac.jpg'),
  ('srv-hom-3', 'cat-home', 'Full Home Cleaning', 'Complete room, floor machine scrubbing & balcony deep clean.', 1195, 1699, 180, 4.9, 640, 7, '3-person crew,Machine scrub,Eco chemicals', 1, 1, '/images/ac.jpg'),
  ('srv-hom-4', 'cat-home', 'Sofa Cleaning', 'Dry vacuuming, foam shampoo & hot-water stain extraction.', 735, 999, 60, 4.8, 410, 7, 'HEPA vacuum,Foam shampoo,Fabric safe', 0, 1, '/images/ac.jpg'),
  ('srv-hom-5', 'cat-home', 'Window Cleaning', 'Interior & exterior glass, channel & mesh deep cleaning.', 269, 399, 45, 4.8, 310, 7, 'Track vacuuming,Streak-free glass,Grill wipe', 0, 1, '/images/ac.jpg'),

  -- AC Services
  ('srv-ac-1', 'cat-ac', 'AC Wash Service', 'Foam-jet indoor & outdoor AC unit cleaning for cool airflow.', 190, 350, 45, 4.9, 720, 30, 'Filter wash,Coil jet clean,Drain flush', 1, 1, '/images/ac.jpg'),
  ('srv-ac-2', 'cat-ac', 'AC Installation-Uninstallation Service', 'Safe split/window AC mounting or uninstallation.', 310, 499, 90, 4.8, 430, 30, 'Gas lock,Bracket mount,Pressure check', 0, 1, '/images/ac.jpg'),

  -- Laundry Services
  ('srv-lnd-1', 'cat-laundry', 'Dry Cleaning', 'Gentle solvent dry cleaning for suits, sarees & woollens.', 200, 300, 120, 4.8, 520, 7, 'Stain spotting,Steam press,Hanger pack', 1, 1, '/images/accessories.jpg'),
  ('srv-lnd-2', 'cat-laundry', 'Steam Ironing', 'Crisp wrinkle-free steam pressing with doorstep pickup.', 200, 280, 60, 4.8, 390, 7, 'Steam press,Collar fold,Express delivery', 0, 1, '/images/accessories.jpg'),
  ('srv-lnd-3', 'cat-laundry', 'Premium Laundry', 'Wash, fabric softener & tumble dry per-bundle service.', 180, 260, 120, 4.9, 310, 7, 'Bio-detergent,Softener wash,Folded pack', 0, 1, '/images/accessories.jpg'),

  -- Mechanic Services
  ('srv-mec-1', 'cat-mechanic', 'Car Wash', 'Foam wash, interior vacuuming & dashboard polish at home.', 340, 499, 45, 4.8, 610, 7, 'Snow foam wash,Interior vacuum,Tyre polish', 1, 1, '/images/laptop.jpg'),
  ('srv-mec-2', 'cat-mechanic', 'Car Service', 'Engine oil check, air filter clean & 25-point inspection.', 220, 399, 60, 4.8, 480, 30, 'Fluid top-up,Brake check,Battery health', 1, 1, '/images/laptop.jpg'),
  ('srv-mec-3', 'cat-mechanic', 'Towing Service', '24/7 flatbed & wheel-lift emergency roadside towing.', 650, 999, 45, 4.7, 190, 7, 'GPS tracking,Safe loading,Doorstep drop', 0, 1, '/images/laptop.jpg'),

  -- Salon Services
  ('srv-sal-1', 'cat-salon', 'Mens Haircut', 'Precision haircut, beard trim & relaxing head massage.', 75, 150, 30, 4.8, 840, 7, 'Sanitized tools,Styling,Clean-up', 1, 1, '/images/mobile.jpg'),
  ('srv-sal-2', 'cat-salon', 'Womens Haircut', 'Layer/step haircut, blow-dry & hair spa consultation.', 70, 180, 40, 4.9, 920, 7, 'Single-use cape,Blow dry,Styling', 1, 1, '/images/mobile.jpg'),
  ('srv-sal-3', 'cat-salon', 'Express Facial', 'Glow cleanup, blackhead removal & hydrating mask at home.', 70, 160, 35, 4.8, 430, 7, 'Branded kit,Steam & scrub,Face massage', 0, 1, '/images/mobile.jpg'),

  -- Pest Control Services
  ('srv-pst-1', 'cat-pest', 'General Pest Control', 'Odorless gel & herbal spray for cockroaches and ants.', 200, 350, 45, 4.9, 510, 90, 'Odorless gel,Crack spray,90-day warranty', 1, 1, '/images/ac.jpg'),
  ('srv-pst-2', 'cat-pest', 'Termite Control', 'Drill-fill-seal anti-termite barrier treatment.', 114, 250, 90, 4.8, 290, 180, 'Wall injection,Wood treatment,6-month warranty', 0, 1, '/images/ac.jpg'),
  ('srv-pst-3', 'cat-pest', 'Rodents/Mice/Rat Control', 'Safe bait stations & entry-point sealing for home/office.', 74, 150, 45, 4.7, 175, 30, 'Bait boxes,Glue traps,Inspection', 0, 1, '/images/ac.jpg'),

  -- Carpenter Services
  ('srv-crp-1', 'cat-carpenter', 'Kitchen Cabinets', 'Modular cabinet hinge, channel & shutter alignment.', 140, 260, 45, 4.8, 340, 30, 'Soft-close adjust,Channel fix,Handle fit', 1, 1, '/images/laptop.jpg'),
  ('srv-crp-2', 'cat-carpenter', 'Shelves Installation', 'Wall-mounted wooden & floating shelves installation.', 220, 350, 45, 4.8, 260, 30, 'Spirit-level align,Heavy anchors,Clean drill', 0, 1, '/images/laptop.jpg'),

  -- Pet Care
  ('srv-pet-1', 'cat-pet', 'Pet Grooming', 'Bath, nail trim, ear cleaning & coat brushing at home.', 50, 120, 45, 4.9, 310, 7, 'Pet-safe shampoo,Nail clip,Coat brush', 1, 1, '/images/mobile.jpg'),
  ('srv-pet-2', 'cat-pet', 'Pet Dental Care', 'Gentle plaque cleaning & breath freshening checkup.', 60, 140, 30, 4.8, 190, 7, 'Oral check,Plaque clean,Vet tips', 0, 1, '/images/mobile.jpg');

INSERT INTO bookings (id, booking_code, customer_name, customer_phone, address, city, scheduled_date, scheduled_slot, payment_method, notes, items_json, total_amount, status, technician_id, source, created_at) VALUES
  ('bk-1', '11063', 'Aditya Vekariya', '+91 98765 43210', 'Rukmini Colony, Keshavnagar', 'Pune', '2026-12-02', '07:30 PM', 'UPI / RazorPay', 'At Doorstep', '[{"id":"srv-lnd-2","name":"Steam Ironing","price":200,"qty":1}]', 200, 'pending', 'tech-6', 'website', '2026-11-25T14:00:00Z'),
  ('bk-2', '11059', 'Aditya Vekariya', '+91 98765 43210', 'Rukmini Colony, Keshavnagar', 'Pune', '2026-11-26', '10:00 AM', 'UPI / RazorPay', 'On The Way', '[{"id":"srv-elc-1","name":"Ceiling Fan Installation","price":180,"qty":1}]', 180, 'in_progress', 'tech-1', 'website', '2026-11-25T11:30:00Z'),
  ('bk-3', '10991', 'Chetan Gaikwad', '+91 99100 11223', 'B-402, Green Park', 'Delhi NCR', '2026-11-27', '05:30 PM', 'Stripe / Card', 'At Doorstep', '[{"id":"srv-elc-5","name":"EV Charger Home Installation","price":680,"qty":1}]', 680, 'confirmed', 'tech-1', 'android', '2026-11-25T10:15:00Z'),
  ('bk-4', '10827', 'Aditya Vekariya', '+91 98765 43210', 'Rukmini Colony, Keshavnagar', 'Pune', '2026-11-24', '02:40 PM', 'UPI / RazorPay', 'Completed cleanly', '[{"id":"srv-hom-1","name":"Kitchen Cleaning","price":115,"qty":1},{"id":"srv-elc-2","name":"Switch & Socket Repair","price":100,"qty":1}]', 215, 'completed', 'tech-3', 'website', '2026-11-24T09:00:00Z');

INSERT INTO custom_requests (id, customer_name, title, category_name, description, min_budget, max_budget, status, bids_count, bid_provider, bid_amount, created_at) VALUES
  ('req-1', 'Aditya Vekariya', 'Need repair', 'Plumbing Services', 'Need urgent water leak check in kitchen sink', 100, 500, 'Requested', 1, 'PlumbService Pvt Ltd', 280, '2026-11-25T14:20:00Z'),
  ('req-2', 'Chetan Gaikwad', 'Full Room Cleaning', 'Home Services', 'Need full room cleaning services before weekend', 500, 1200, 'Booked', 1, 'World Clean Pvt. Ltd.', 850, '2026-11-24T09:15:00Z');

INSERT INTO chat_messages (id, partner_id, partner_name, sender, message, booking_code, created_at) VALUES
  ('msg-1', 'tech-1', 'Electric', 'partner', 'Hi! I am on the way for your Ceiling Fan Installation (#11059).', '11059', '2026-11-25T10:30:00Z'),
  ('msg-2', 'tech-2', 'PlumbService Pvt Ltd', 'customer', 'Do you provide a satisfaction guarantee?', NULL, '2026-11-25T11:15:00Z'),
  ('msg-3', 'tech-3', 'World Clean Pvt. Ltd.', 'partner', 'Yo! Our 3-person crew is ready for your booking.', '10827', '2026-11-25T12:00:00Z');

INSERT INTO transactions (id, booking_code, customer_name, provider_name, method, amount, status, created_at) VALUES
  ('txn-1', '11059', 'Aditya Vekariya', 'Electric', 'RazorPay', 180, 'Success', '2026-11-25T11:30:00Z'),
  ('txn-2', '10991', 'Chetan Gaikwad', 'Electric', 'Cashfree', 680, 'Success', '2026-11-25T10:15:00Z'),
  ('txn-3', '10827', 'Aditya Vekariya', 'World Clean Pvt. Ltd.', 'Stripe', 215, 'Success', '2026-11-24T09:00:00Z');
