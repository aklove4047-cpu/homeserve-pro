-- Schema V6: Servicemen, Service Zones, Issues, User Roles, and Staff Management

-- 1. Servicemen / Field Staff
CREATE TABLE IF NOT EXISTS servicemen (
  id TEXT PRIMARY KEY,
  provider_id TEXT,
  provider_name TEXT DEFAULT 'FixoHub Direct Crew',
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT DEFAULT '',
  city TEXT NOT NULL,
  zone_id TEXT,
  zone_name TEXT DEFAULT 'Central Zone',
  specialty TEXT NOT NULL,
  experience_years INTEGER DEFAULT 3,
  rating REAL DEFAULT 4.9,
  jobs_completed INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Active',
  avatar_color TEXT DEFAULT '#0079ff',
  created_at TEXT NOT NULL
);

-- 2. Service Zones (Geo-fencing & Local Surge Pricing)
CREATE TABLE IF NOT EXISTS service_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  pincodes TEXT NOT NULL,
  surge_multiplier REAL DEFAULT 1.0,
  visiting_charge INTEGER DEFAULT 49,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);

-- 3. Issues & Complaints Management
CREATE TABLE IF NOT EXISTS system_issues (
  id TEXT PRIMARY KEY,
  booking_code TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  serviceman_name TEXT DEFAULT 'Unassigned',
  category TEXT NOT NULL,
  severity TEXT DEFAULT 'Medium',
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  resolution_notes TEXT DEFAULT '',
  refund_amount INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

-- 4. User Roles & Permissions (RBAC)
CREATE TABLE IF NOT EXISTS admin_roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  permissions_json TEXT NOT NULL,
  users_count INTEGER DEFAULT 1
);

-- 5. Admin Staff Members
CREATE TABLE IF NOT EXISTS admin_staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  role_id TEXT NOT NULL,
  role_name TEXT NOT NULL,
  city_access TEXT DEFAULT 'All Cities',
  status TEXT DEFAULT 'Active',
  created_at TEXT NOT NULL
);

-- Initial Seed Data: Servicemen
INSERT OR IGNORE INTO servicemen (id, provider_id, provider_name, name, phone, email, city, zone_name, specialty, experience_years, rating, jobs_completed, is_available, status, created_at)
VALUES
('sm-101', 'tech-elec-1', 'Electric Co.', 'Ramesh Kumar', '+91 98765 11001', 'ramesh.elec@fixohub.in', 'Delhi NCR', 'South Delhi - Saket & GK', 'AC & Electrical Wiring', 5, 4.9, 142, 1, 'Active', '2026-10-10T10:00:00Z'),
('sm-102', 'tech-plm-1', 'PlumbService Ltd', 'Suresh Patel', '+91 98765 11002', 'suresh.plumb@fixohub.in', 'Mumbai', 'Western Suburbs - Andheri & Bandra', 'Plumbing & Drainage', 7, 4.8, 218, 1, 'Active', '2026-09-15T11:00:00Z'),
('sm-103', 'tech-cln-1', 'World Clean Pvt Ltd', 'Vikram Yadav', '+91 98765 11003', 'vikram.clean@fixohub.in', 'Delhi NCR', 'Noida & East NCR', 'Deep Cleaning & Sanitization', 4, 4.9, 98, 1, 'Active', '2026-11-01T09:00:00Z'),
('sm-104', 'tech-mob-1', 'QuickTech Solutions', 'Amit Verma', '+91 98765 11004', 'amit.mob@fixohub.in', 'Bengaluru', 'Tech Corridor - Whitefield', 'Mobile & Laptop Hardware', 6, 4.95, 310, 1, 'Active', '2026-08-20T14:30:00Z'),
('sm-105', 'tech-car-1', 'Piston Car Care', 'Mohan Lal', '+91 98765 11005', 'mohan.car@fixohub.in', 'Pune', 'West Pune - Hinjewadi & Wakad', 'Car Foam Wash & Mechanics', 3, 4.7, 74, 1, 'Active', '2026-11-05T12:00:00Z');

-- Initial Seed Data: Service Zones
INSERT OR IGNORE INTO service_zones (id, name, city, pincodes, surge_multiplier, visiting_charge, is_active, created_at)
VALUES
('zn-del-south', 'South Delhi & Gurugram Prime', 'Delhi NCR', '110017, 110019, 110048, 122001, 122002', 1.0, 49, 1, '2026-11-01T00:00:00Z'),
('zn-del-noida', 'Noida & Greater Noida Zone', 'Delhi NCR', '201301, 201303, 201305, 201310', 1.0, 49, 1, '2026-11-01T00:00:00Z'),
('zn-mum-west', 'Mumbai Western Suburbs (Bandra to Borivali)', 'Mumbai', '400050, 400053, 400058, 400064, 400092', 1.15, 69, 1, '2026-11-01T00:00:00Z'),
('zn-blr-tech', 'Bengaluru Tech Belt (Whitefield, Koramangala & HSR)', 'Bengaluru', '560034, 560066, 560102, 560103', 1.1, 59, 1, '2026-11-01T00:00:00Z'),
('zn-pun-west', 'Pune IT Hub (Hinjewadi, Baner & Wakad)', 'Pune', '411045, 411057, 411061', 1.0, 39, 1, '2026-11-01T00:00:00Z'),
('zn-hyd-hitec', 'Hyderabad HITEC City & Gachibowli', 'Hyderabad', '500032, 500081, 500084', 1.0, 49, 1, '2026-11-05T00:00:00Z'),
('zn-jai-prime', 'Jaipur Central & Vaishali Nagar', 'Jaipur', '302001, 302021, 302017', 1.0, 29, 1, '2026-11-10T00:00:00Z');

-- Initial Seed Data: Issues & Disputes
INSERT OR IGNORE INTO system_issues (id, booking_code, customer_name, customer_phone, serviceman_name, category, severity, description, status, resolution_notes, refund_amount, created_at)
VALUES
('ISSUE-901', '10827', 'Aditya Vekariya', '+91 98112 33445', 'Suresh Patel', 'Delay in Arrival', 'Medium', 'Technician arrived 40 mins late due to heavy waterlogging near highway.', 'Resolved', 'Compensation coupon of ₹100 issued to customer wallet.', 100, '2026-11-24T15:00:00Z'),
('ISSUE-902', '10991', 'Chetan Gaikwad', '+91 99100 11223', 'Ramesh Kumar', 'Damaged Equipment / Parts', 'High', 'Old switchboard screw socket broke during installation of heavy MCB.', 'Investigating', 'Investigator assigned to check repair quote.', 0, '2026-11-25T11:20:00Z'),
('ISSUE-903', '11063', 'Rahul Sharma', '+91 98765 43210', 'Vikram Yadav', 'Overcharging Demanded', 'Critical', 'Technician asked for ₹150 extra cash for chemical detergent.', 'Resolved', 'Direct warning to technician. ₹150 refunded to customer wallet.', 150, '2026-11-25T16:45:00Z');

-- Initial Seed Data: Admin Roles
INSERT OR IGNORE INTO admin_roles (id, name, description, permissions_json, users_count)
VALUES
('role-super', 'Super Administrator', 'Full unrestricted platform access across all zones & finance', '["all"]', 1),
('role-ops', 'Dispatch & Operations Manager', 'Manage live dispatch, servicemen assignments, zones and bookings', '["bookings", "dispatch", "servicemen", "zones", "kyc"]', 3),
('role-support', 'Customer Support Executive', 'Handle customer disputes, support tickets and issue resolutions', '["tickets", "issues", "customers", "reviews"]', 4),
('role-finance', 'Finance & Payouts Officer', 'Oversee transactions audit, partner payouts, and payment gateways', '["payouts", "transactions", "gateways", "reports"]', 2),
('role-catalog', 'Catalog & Pricing Manager', 'Manage services, categories, promotional discount coupons and banners', '["services", "categories", "promos", "banners"]', 2);

-- Initial Seed Data: Admin Staff Members
INSERT OR IGNORE INTO admin_staff (id, name, email, phone, role_id, role_name, city_access, status, created_at)
VALUES
('staff-1', 'Amitabh Sinha', 'amitabh.admin@fixohub.in', '+91 98100 00001', 'role-super', 'Super Administrator', 'All Cities', 'Active', '2026-01-01T00:00:00Z'),
('staff-2', 'Pooja Kashyap', 'pooja.dispatch@fixohub.in', '+91 98100 00002', 'role-ops', 'Dispatch & Operations Manager', 'Delhi NCR', 'Active', '2026-06-15T00:00:00Z'),
('staff-3', 'Rohit Saxena', 'rohit.support@fixohub.in', '+91 98100 00003', 'role-support', 'Customer Support Executive', 'All Cities', 'Active', '2026-08-01T00:00:00Z'),
('staff-4', 'Neha Agarwal', 'neha.finance@fixohub.in', '+91 98100 00004', 'role-finance', 'Finance & Payouts Officer', 'All Cities', 'Active', '2026-09-10T00:00:00Z');
