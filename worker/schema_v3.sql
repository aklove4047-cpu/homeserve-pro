CREATE TABLE IF NOT EXISTS custom_requests (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  title TEXT NOT NULL,
  category_name TEXT NOT NULL,
  description TEXT NOT NULL,
  min_budget INTEGER NOT NULL,
  max_budget INTEGER NOT NULL,
  status TEXT DEFAULT 'Requested',
  bids_count INTEGER DEFAULT 0,
  bid_provider TEXT,
  bid_amount INTEGER,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS promocodes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  min_order INTEGER DEFAULT 299,
  max_discount INTEGER DEFAULT 500,
  valid_until TEXT NOT NULL,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  booking_code TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  booking_code TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  method TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'Success',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO custom_requests (id, customer_name, title, category_name, description, min_budget, max_budget, status, bids_count, bid_provider, bid_amount, created_at) VALUES
  ('req-1', 'Rohan Mehta', 'MacBook Pro M2 Screen Flicker Fix', 'Laptop & PC', 'Display flickers when opening lid past 90 degrees, need hinge/flex check.', 1500, 4500, 'Requested', 2, 'Vikram Patel', 2200, '2026-11-25T14:20:00Z'),
  ('req-2', 'Ananya Gupta', '2BHK Full Deep Cleaning + Sofa Spa', 'Home Deep Cleaning', 'Need 3-person crew with scrubbing machine before weekend.', 2500, 4000, 'Booked', 1, 'Deepak Yadav', 3100, '2026-11-24T09:15:00Z'),
  ('req-3', 'Karan Malhotra', '65" QLED TV Concealed Wall Mount + Soundbar', 'TV & Entertainment', 'Brick wall mounting with hidden HDMI raceway.', 800, 1800, 'Requested', 1, 'Aman Verma', 1200, '2026-11-25T16:40:00Z');

INSERT OR IGNORE INTO promocodes (id, code, discount_percent, min_order, max_discount, valid_until, is_active) VALUES
  ('prm-1', 'FIXO50', 50, 499, 300, '2026-12-31', 1),
  ('prm-2', 'WELCOME20', 20, 299, 500, '2026-12-31', 1),
  ('prm-3', 'TECH15', 15, 999, 750, '2026-12-31', 1);

INSERT OR IGNORE INTO chat_messages (id, partner_id, partner_name, sender, message, booking_code, created_at) VALUES
  ('msg-1', 'tech-1', 'Rajesh Sharma', 'partner', 'Hello! I am on the way for your AC Foam-Jet service.', 'HS-1042', '2026-11-25T10:30:00Z'),
  ('msg-2', 'tech-2', 'Vikram Patel', 'partner', 'Please keep your laptop charger ready for the SSD & thermal test.', 'HS-1044', '2026-11-25T11:15:00Z'),
  ('msg-3', 'tech-3', 'Aman Verma', 'customer', 'Hi, can you bring a 65-inch swivel mount bracket?', NULL, '2026-11-25T12:00:00Z');

INSERT OR IGNORE INTO transactions (id, booking_code, customer_name, provider_name, method, amount, status, created_at) VALUES
  ('txn-1', 'HS-1042', 'Ananya Gupta', 'Rajesh Sharma', 'UPI / RazorPay', 1198, 'Success', '2026-11-25T10:20:00Z'),
  ('txn-2', 'HS-1043', 'Rohan Mehta', 'Unassigned', 'Cash on Visit', 1999, 'Pending', '2026-11-25T11:10:00Z'),
  ('txn-3', 'HS-1044', 'Priya Nair', 'Vikram Patel', 'Stripe Card', 1598, 'Success', '2026-11-24T17:00:00Z');

INSERT OR IGNORE INTO blogs (id, title, category, summary, created_at) VALUES
  ('blg-1', '5 Signs Your Laptop Needs Thermal Repasting', 'Laptop & PC', 'High fan noise, sudden FPS drops, and hot palmrests mean dried thermal paste.', '2026-11-20T10:00:00Z'),
  ('blg-2', 'OLED vs LCD Mobile Screen Replacement Guide', 'Mobile Repair', 'Why choosing OEM-grade OLED panels preserves TrueTone, battery life & touch.', '2026-11-22T10:00:00Z'),
  ('blg-3', 'Pre-Summer AC Foam-Jet Checklist', 'AC & Cooling', 'Save up to 25% on electricity bills with annual indoor & outdoor coil jet wash.', '2026-11-24T10:00:00Z');
