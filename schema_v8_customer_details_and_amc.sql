-- Add detailed address & identity columns to customers
ALTER TABLE customers ADD COLUMN address TEXT DEFAULT '';
ALTER TABLE customers ADD COLUMN landmark TEXT DEFAULT '';
ALTER TABLE customers ADD COLUMN pincode TEXT DEFAULT '110016';
ALTER TABLE customers ADD COLUMN alternate_phone TEXT DEFAULT '';
ALTER TABLE customers ADD COLUMN address_type TEXT DEFAULT 'Home';
ALTER TABLE customers ADD COLUMN active_subscription TEXT DEFAULT 'None';
ALTER TABLE customers ADD COLUMN subscription_expires TEXT DEFAULT '';

-- Add extra columns to bookings
ALTER TABLE bookings ADD COLUMN pincode TEXT DEFAULT '110016';
ALTER TABLE bookings ADD COLUMN landmark TEXT DEFAULT '';
ALTER TABLE bookings ADD COLUMN alternate_phone TEXT DEFAULT '';
ALTER TABLE bookings ADD COLUMN is_amc INTEGER DEFAULT 0;

-- Create amc_plans table
CREATE TABLE IF NOT EXISTS amc_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  duration_days INTEGER DEFAULT 365,
  visits_included INTEGER DEFAULT 2,
  features_json TEXT NOT NULL,
  badge TEXT DEFAULT 'BESTSELLER',
  created_at TEXT NOT NULL
);

-- Create customer_subscriptions table
CREATE TABLE IF NOT EXISTS customer_subscriptions (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price_paid INTEGER NOT NULL,
  status TEXT DEFAULT 'Active',
  visits_total INTEGER DEFAULT 2,
  visits_used INTEGER DEFAULT 0,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Seed realistic AMC Plans
INSERT OR REPLACE INTO amc_plans (id, name, category_name, price, original_price, duration_days, visits_included, features_json, badge, created_at) VALUES
('amc-ac-chillcare', 'AC ChillCare 365 AMC', 'AC & Cooling', 1999, 2999, 365, 2, '["2 Full Foam-Jet Deep Chemical Cleanings", "Unlimited Free Gas Leak Checks & Top-up at 50% Off", "Zero Inspection Visit Charges (Free 365 Days)", "Priority Doorstep Dispatch within 2 Hours", "20% Flat Discount on all AC Spares & PCB Repair"]', 'MOST POPULAR', datetime('now')),
('amc-home-total', 'Complete Home Care AMC (All-in-One)', 'Home Appliances', 3999, 5999, 365, 6, '["Covers AC, Washing Machine, Refrigerator, RO & Microwave", "6 Scheduled Preventive Maintenance Checkups", "100% Free Doorstep Technician Visits for 1 Year", "Free Minor Plumbing & Electrical Adjustments", "VIP Emergency Priority Hotline"]', 'BEST VALUE', datetime('now')),
('amc-ro-pureflow', 'PureFlow RO Water Purifier AMC', 'RO & Chimney', 1499, 2199, 365, 3, '["3 Periodic Scheduled Filter & Membrane Servicing", "1 Free Sediment Filter & Pre-Carbon Candle Replacement", "Digital TDS & pH Level Water Quality Testing", "Zero Labor Charge on Motor & SMPS Pump Diagnostics"]', 'ESSENTIAL', datetime('now')),
('amc-pc-care', 'MacBook & Gaming PC Pro Care AMC', 'Laptop & PC', 1299, 1899, 365, 4, '["4 Deep Clean, Dusting & Arctic MX-6 Thermal Paste Repastes", "Unlimited Windows/MacOS Diagnostics & Virus Removal", "Priority Doorstep Hardware Upgrades", "Free Data Backup & SSD Health Audits"]', 'PRO TECH', datetime('now'));

-- Seed sample customer subscription
INSERT OR REPLACE INTO customer_subscriptions (id, customer_id, customer_name, customer_phone, plan_id, plan_name, price_paid, status, visits_total, visits_used, start_date, end_date, created_at) VALUES
('sub-101', 'cust-1', 'Amit Sharma', '+91 98765 43210', 'amc-ac-chillcare', 'AC ChillCare 365 AMC', 1999, 'Active', 2, 0, '2026-11-01', '2027-11-01', datetime('now')),
('sub-102', 'cust-2', 'Priya Patel', '+91 98112 23344', 'amc-home-total', 'Complete Home Care AMC (All-in-One)', 3999, 'Active', 6, 1, '2026-10-15', '2027-10-15', datetime('now'));

-- Update existing sample customers with realistic full address & pincode
UPDATE customers SET 
  address = 'Flat 402, Tower B, Palm Heights, Sector 62',
  landmark = 'Near Fortis Hospital',
  pincode = '110016',
  alternate_phone = '+91 98112 00099',
  address_type = 'Home',
  active_subscription = 'AC ChillCare 365 AMC'
WHERE id = 'cust-1' OR id = (SELECT id FROM customers LIMIT 1);
