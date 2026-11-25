-- Schema V5: Full Persistence for Admin Panel Modules

-- 1. KYC Verifications
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id TEXT PRIMARY KEY,
  provider_id TEXT,
  provider_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  cert_no TEXT NOT NULL,
  city TEXT NOT NULL,
  doc_url TEXT DEFAULT '',
  status TEXT DEFAULT 'Pending',
  rejection_reason TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

-- 2. Partner Payouts
CREATE TABLE IF NOT EXISTS partner_payouts (
  id TEXT PRIMARY KEY,
  provider_id TEXT,
  provider_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  upi_id TEXT NOT NULL,
  bank_account TEXT DEFAULT '',
  ifsc TEXT DEFAULT '',
  status TEXT DEFAULT 'Pending',
  jobs_count INTEGER DEFAULT 1,
  utr_number TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  settled_at TEXT
);

-- 3. Customers CRM
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT DEFAULT '',
  city TEXT NOT NULL,
  orders_count INTEGER DEFAULT 0,
  total_spend INTEGER DEFAULT 0,
  wallet_balance INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  joined_at TEXT NOT NULL
);

-- 4. Support Dispute Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  reply_text TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

-- 5. Operational Cities
CREATE TABLE IF NOT EXISTS operational_cities (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  min_order INTEGER DEFAULT 199,
  express_dispatch INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);

-- 6. Hero Banners
CREATE TABLE IF NOT EXISTS hero_banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT DEFAULT 'All Services',
  badge TEXT DEFAULT 'Special Offer',
  image_url TEXT DEFAULT '',
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 7. Broadcast Announcements
CREATE TABLE IF NOT EXISTS broadcast_announcements (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  target_audience TEXT DEFAULT 'all',
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);

-- 8. Customer Reviews Moderation
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  service_id TEXT,
  service_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating REAL DEFAULT 5.0,
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'Published',
  reply_text TEXT DEFAULT '',
  created_at TEXT NOT NULL
);

-- 9. System Settings Key-Value Store
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Initial seed data for fresh tables
INSERT OR IGNORE INTO kyc_verifications (id, provider_id, provider_name, phone, doc_type, cert_no, city, status, created_at)
VALUES 
('kyc-1', 'tech-elec-1', 'Electric (Ramesh Kumar)', '+91 98765 43210', 'Aadhaar + ITI Electrical Cert', 'ITI-DEL-98442', 'Delhi NCR', 'Approved', '2026-11-20T10:00:00Z'),
('kyc-2', 'tech-plm-1', 'PlumbService Pvt Ltd', '+91 98111 22334', 'GSTIN + Trade License', 'GST27AABCP1234', 'Mumbai', 'Approved', '2026-11-22T11:30:00Z'),
('kyc-3', 'tech-ac-1', 'Vikram Sharma (AC Pro)', '+91 98234 56789', 'Aadhaar Card + Experience Cert', 'AADHAAR-8921', 'Delhi NCR', 'Pending', '2026-11-25T09:15:00Z'),
('kyc-4', 'tech-cln-1', 'SmartClean Solutions', '+91 99876 54321', 'Company Registration Certificate', 'CIN-U74999KA', 'Bengaluru', 'Pending', '2026-11-25T14:20:00Z'),
('kyc-5', 'tech-car-1', 'DiyingData Multi-Services', '+91 98555 66778', 'Shop Act License + Police Clearance', 'MH-PUN-552', 'Pune', 'Approved', '2026-11-19T16:00:00Z');

INSERT OR IGNORE INTO partner_payouts (id, provider_id, provider_name, amount, upi_id, status, jobs_count, utr_number, created_at)
VALUES
('PAY-1001', 'tech-elec-1', 'Electric', 4850, 'electric@okhdfcbank', 'Pending', 24, '', '2026-11-25T08:00:00Z'),
('PAY-1002', 'tech-plm-1', 'PlumbService Pvt Ltd', 8200, 'plumb@icici', 'Settled', 38, 'UTR9988221', '2026-11-23T12:00:00Z'),
('PAY-1003', 'tech-cln-1', 'World Clean Pvt. Ltd.', 11400, 'clean@paytm', 'Settled', 52, 'UTR7711440', '2026-11-21T15:30:00Z'),
('PAY-1004', 'tech-car-1', 'Piston Car Service', 3950, 'piston@axisbank', 'Pending', 18, '', '2026-11-25T17:45:00Z');

INSERT OR IGNORE INTO customers (id, name, phone, email, city, orders_count, total_spend, wallet_balance, status, joined_at)
VALUES
('cust-1', 'Rahul Sharma', '+91 98765 43210', 'rahul@gmail.com', 'Delhi NCR', 8, 6499, 1500, 'Active', '2026-10-15T10:00:00Z'),
('cust-2', 'Aditya Vekariya', '+91 98112 33445', 'aditya@yahoo.com', 'Pune', 12, 14200, 800, 'Active', '2026-09-02T12:00:00Z'),
('cust-3', 'Priya Nair', '+91 99223 44556', 'priya@tech.com', 'Mumbai', 5, 4890, 350, 'Active', '2026-11-12T09:30:00Z'),
('cust-4', 'Amit Singh', '+91 97334 55667', 'amit@outlook.com', 'Bengaluru', 9, 8900, 620, 'Active', '2026-10-28T14:10:00Z'),
('cust-5', 'Sneha Kapoor', '+91 98445 66778', 'sneha@gmail.com', 'Delhi NCR', 6, 5400, 200, 'Active', '2026-11-05T16:45:00Z'),
('cust-6', 'Spam Account', '+91 90000 00000', 'spam@bot.net', 'Delhi NCR', 0, 0, 0, 'Banned', '2026-11-24T18:00:00Z');

INSERT OR IGNORE INTO support_tickets (id, customer_name, customer_phone, category, subject, status, reply_text, created_at)
VALUES
('TKT-104', 'Rahul Sharma', '+91 98765 43210', 'Billing & Refunds', 'Query on invoice receipt', 'Resolved', 'Invoice re-sent to registered email.', '2026-11-24T11:00:00Z'),
('TKT-105', 'Priya Nair', '+91 99223 44556', 'Service Quality', 'Technician was 15 mins late due to rain', 'Open', '', '2026-11-25T08:30:00Z'),
('TKT-106', 'Aditya Vekariya', '+91 98112 33445', 'Rescheduling', 'Request slot change for Kitchen deep clean', 'In Progress', 'Slot updated to 04:00 PM today.', '2026-11-25T10:15:00Z');

INSERT OR IGNORE INTO operational_cities (id, name, min_order, express_dispatch, is_active, created_at)
VALUES
('city-del', 'Delhi NCR', 199, 1, 1, '2026-11-01T00:00:00Z'),
('city-mum', 'Mumbai', 249, 1, 1, '2026-11-01T00:00:00Z'),
('city-blr', 'Bengaluru', 249, 1, 1, '2026-11-01T00:00:00Z'),
('city-pun', 'Pune', 199, 1, 1, '2026-11-01T00:00:00Z'),
('city-hyd', 'Hyderabad', 199, 1, 1, '2026-11-01T00:00:00Z'),
('city-jai', 'Jaipur', 149, 1, 1, '2026-11-01T00:00:00Z'),
('city-chn', 'Chennai', 249, 0, 1, '2026-11-15T00:00:00Z'),
('city-kol', 'Kolkata', 199, 0, 1, '2026-11-15T00:00:00Z');

INSERT OR IGNORE INTO hero_banners (id, title, subtitle, category, badge, is_active, sort_order, created_at)
VALUES
('ban-1', 'Reliable & Affordable Home Services', 'Flat 50% OFF on your first booking with FIXO50', 'All Services', 'Grand Launch', 1, 1, '2026-11-01T00:00:00Z'),
('ban-2', 'Expert AC Foam-Jet Cleaning & Gas Refill', 'Doorstep technicians equipped with nitrogen leak tests', 'AC & Cooling', 'Top Rated', 1, 2, '2026-11-01T00:00:00Z'),
('ban-3', 'Doorstep Laptop & Mobile Screen Replacement', 'OEM grade displays with 180-day warranty', 'Mobile Repair', 'Express 30m', 1, 3, '2026-11-01T00:00:00Z');

INSERT OR IGNORE INTO broadcast_announcements (id, message, type, target_audience, is_active, created_at)
VALUES
('bc-1', '🔥 Festive Offer: Get Flat ₹250 OFF on orders above ₹999 with code FESTIVE250!', 'info', 'all', 1, '2026-11-20T00:00:00Z');

INSERT OR IGNORE INTO reviews (id, service_id, service_name, customer_name, rating, comment, status, reply_text, created_at)
VALUES
('rev-1', 'srv-cln-1', 'Full Home Deep Cleaning (2BHK)', 'Rahul Sharma', 5.0, '3-person crew arrived on time and did an amazing machine scrubbing job on floors!', 'Published', 'Thank you Rahul! Glad you loved the deep clean.', '2026-11-22T14:00:00Z'),
('rev-2', 'srv-mob-1', 'Doorstep Mobile Screen Replacement', 'Priya Nair', 5.0, 'Screen replaced in 25 minutes right on my dining table. Free glass installed too!', 'Published', '', '2026-11-24T18:30:00Z'),
('rev-3', 'srv-ac-2', 'AC Gas Refill & Leak Fix', 'Aditya Vekariya', 4.5, 'Vacuuming and nitrogen test was done properly before gas fill. Very professional.', 'Published', '', '2026-11-25T11:00:00Z');

INSERT OR IGNORE INTO system_settings (key, value, updated_at)
VALUES
('platform_name', 'FixoHub Enterprise', '2026-11-26T00:00:00Z'),
('support_phone', '1800-FIXOHUB', '2026-11-26T00:00:00Z'),
('support_email', 'support@fixohub.in', '2026-11-26T00:00:00Z'),
('currency', 'INR (₹)', '2026-11-26T00:00:00Z'),
('platform_commission', '15', '2026-11-26T00:00:00Z'),
('express_delivery_fee', '149', '2026-11-26T00:00:00Z'),
('tax_percent', '18', '2026-11-26T00:00:00Z'),
('min_order_amount', '199', '2026-11-26T00:00:00Z'),
('cancel_penalty', '99', '2026-11-26T00:00:00Z'),
('gateways_config', '{"razorpay":{"enabled":true,"key_id":"rzp_live_FIXOHUB2026","secret":"rzp_sec_FIXO9981","webhook":"https://homeserve-pro.aklove4047.workers.dev/api/webhook/razorpay"},"phonepe":{"enabled":true,"merchant_id":"MERCHANT_FIXOHUB","salt_key":"salt_99214451"},"stripe":{"enabled":false,"pub_key":"pk_live_fixo","secret":"sk_live_fixo"},"cod":{"enabled":true,"fee":0}}', '2026-11-26T00:00:00Z'),
('otp_config', '{"provider":"Fast2SMS / MSG91","apiKey":"f2s_live_APIKEY_9921827419","senderId":"FIXHUB","templateId":"DLT_TE_10074829","expiryMins":5,"demoMasterOtp":"1234"}', '2026-11-26T00:00:00Z');
