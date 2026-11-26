-- ========================================================
-- Schema V7: Comprehensive Technician & Serviceman Expansion
-- Pincode, Gmail, ID Proof, Aadhaar, Bank Details & Photo Upload
-- ========================================================

-- 1. ADD COLUMNS TO TECHNICIANS TABLE
ALTER TABLE technicians ADD COLUMN pincode TEXT DEFAULT '110001';
ALTER TABLE technicians ADD COLUMN email TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN profile_image TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN id_proof_type TEXT DEFAULT 'PAN Card';
ALTER TABLE technicians ADD COLUMN id_proof_number TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN id_proof_image TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN aadhaar_number TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN aadhaar_image TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN bank_name TEXT DEFAULT 'State Bank of India';
ALTER TABLE technicians ADD COLUMN bank_account_number TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN bank_ifsc TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN bank_holder_name TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN upi_id TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN address TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN emergency_contact TEXT DEFAULT '';
ALTER TABLE technicians ADD COLUMN police_verified INTEGER DEFAULT 1;
ALTER TABLE technicians ADD COLUMN certification TEXT DEFAULT 'Certified NSDC / ITI Master';

-- 2. ADD COLUMNS TO SERVICEMEN TABLE
ALTER TABLE servicemen ADD COLUMN pincode TEXT DEFAULT '110001';
ALTER TABLE servicemen ADD COLUMN profile_image TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN id_proof_type TEXT DEFAULT 'PAN Card';
ALTER TABLE servicemen ADD COLUMN id_proof_number TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN id_proof_image TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN aadhaar_number TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN aadhaar_image TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN bank_name TEXT DEFAULT 'HDFC Bank';
ALTER TABLE servicemen ADD COLUMN bank_account_number TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN bank_ifsc TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN bank_holder_name TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN upi_id TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN address TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN emergency_contact TEXT DEFAULT '';
ALTER TABLE servicemen ADD COLUMN police_verified INTEGER DEFAULT 1;
ALTER TABLE servicemen ADD COLUMN certification TEXT DEFAULT 'National Skill Development Certificate';

-- 3. UPDATE EXISTING TECHNICIANS WITH COMPLETE RICH DATA & PROFILE IMAGES
UPDATE technicians SET 
  pincode = '110016',
  email = 'vikas.verma@gmail.com',
  profile_image = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  id_proof_type = 'PAN Card',
  id_proof_number = 'BKRPV7821K',
  aadhaar_number = '8492 1049 8271',
  bank_name = 'State Bank of India',
  bank_account_number = '309182749102',
  bank_ifsc = 'SBIN0001234',
  bank_holder_name = 'Vikas Verma',
  upi_id = 'vikas.fixo@sbi',
  address = 'Flat 204, Sector 7, RK Puram, New Delhi',
  emergency_contact = 'Sunil Verma (Brother) - +91 98112 34567',
  police_verified = 1
WHERE id = 'tech-1' OR name LIKE '%Vikas%';

UPDATE technicians SET 
  pincode = '110020',
  email = 'suresh.kumar.ac@gmail.com',
  profile_image = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  id_proof_type = 'Driving License',
  id_proof_number = 'DL-04201800912',
  aadhaar_number = '6521 8934 1120',
  bank_name = 'HDFC Bank',
  bank_account_number = '50100492817291',
  bank_ifsc = 'HDFC0000128',
  bank_holder_name = 'Suresh Kumar',
  upi_id = 'suresh.cooling@hdfcbank',
  address = 'House 45, Okhla Phase 2, New Delhi',
  emergency_contact = 'Meena Kumar (Wife) - +91 98234 56789',
  police_verified = 1
WHERE id = 'tech-2' OR name LIKE '%Suresh%';

UPDATE technicians SET 
  pincode = '110092',
  email = 'amit.patel.tech@gmail.com',
  profile_image = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  id_proof_type = 'PAN Card',
  id_proof_number = 'AMTPP9921J',
  aadhaar_number = '4910 2234 9812',
  bank_name = 'ICICI Bank',
  bank_account_number = '001201592819',
  bank_ifsc = 'ICIC0000012',
  bank_holder_name = 'Amit Patel',
  upi_id = 'amit.patel@icici',
  address = 'B-12, Laxmi Nagar, East Delhi',
  emergency_contact = 'Ramesh Patel (Father) - +91 98991 12233',
  police_verified = 1
WHERE id = 'tech-3' OR name LIKE '%Amit%';

-- 4. UPDATE EXISTING SERVICEMEN WITH COMPLETE RICH DATA & PROFILE IMAGES
UPDATE servicemen SET
  pincode = '110017',
  profile_image = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  id_proof_type = 'PAN Card',
  id_proof_number = 'RMSHK1928P',
  aadhaar_number = '7891 2345 6789',
  bank_name = 'Punjab National Bank',
  bank_account_number = '09281001928192',
  bank_ifsc = 'PUNB0092800',
  bank_holder_name = 'Ramesh Kumar',
  upi_id = 'ramesh.crew@pnb',
  address = 'G-72, Malviya Nagar, New Delhi',
  emergency_contact = 'Kavita Kumar (Wife) - +91 98101 22334',
  police_verified = 1
WHERE id = 'sm-1' OR name LIKE '%Ramesh%';

UPDATE servicemen SET
  pincode = '110024',
  profile_image = 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  id_proof_type = 'Aadhaar Card',
  id_proof_number = '5412 8901 2345',
  aadhaar_number = '5412 8901 2345',
  bank_name = 'State Bank of India',
  bank_account_number = '20491827419',
  bank_ifsc = 'SBIN0004567',
  bank_holder_name = 'Deepak Verma',
  upi_id = 'deepak.verma@sbi',
  address = 'M-14, Lajpat Nagar 2, New Delhi',
  emergency_contact = 'Sunita Verma (Mother) - +91 98199 44556',
  police_verified = 1
WHERE id = 'sm-2' OR name LIKE '%Deepak%';
