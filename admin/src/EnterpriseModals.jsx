import React, { useState } from 'react';
import {
  X, Users, Map, AlertOctagon, ShieldCheck, UserPlus, Phone, Mail, Award,
  CheckCircle, Camera, UploadCloud, CreditCard, Landmark, FileText, Eye,
  Shield, Copy, Check, MapPin, Building2, User
} from 'lucide-react';

// ==========================================
// 1. ADD / EDIT SERVICEMAN MODAL (WITH FULL IDENTITY, AADHAAR, BANK & PHOTO)
// ==========================================
export function AddServicemanModal({ show, isOpen, onClose, onSave, onSubmit, form, setForm, cities }) {
  const visible = show || isOpen;
  const handleSubmit = onSubmit || onSave;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Add Serviceman / Field Crew</h3>
              <p className="text-[11px] text-slate-500">Identity, Pincode, Aadhaar KYC & Bank Payout Details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* PROFILE PHOTO UPLOADER */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
            <div className="relative shrink-0">
              {form.profile_image ? (
                <img src={form.profile_image} alt="Preview" className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex flex-col items-center justify-center font-bold text-xs border-2 border-dashed border-blue-300">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>Photo</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="block font-bold text-slate-800 text-xs">Technician Profile Picture *</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-[11px] shadow transition">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setForm(f => ({ ...f, profile_image: ev.target.result }));
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {form.profile_image && (
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, profile_image: '' }))}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[11px] font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Or paste photo URL (https://images.unsplash.com/...)"
                value={form.profile_image || ''}
                onChange={e => setForm(f => ({ ...f, profile_image: e.target.value }))}
                className="w-full p-1.5 text-[11px] border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* BASIC DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={form.name || ''}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (+91) *</label>
              <input
                type="text"
                placeholder="+91 98765 11223"
                value={form.phone || ''}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-red-500" /> Gmail / Email Address *
              </label>
              <input
                type="email"
                placeholder="rajesh.technician@gmail.com"
                value={form.email || ''}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Operating Pincode (Area PIN) *
              </label>
              <input
                type="text"
                placeholder="e.g. 110016"
                value={form.pincode || ''}
                onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Skill *</label>
              <select
                value={form.specialty || 'AC & Cooling'}
                onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                <option value="AC & Cooling">AC & Cooling</option>
                <option value="Home Deep Cleaning">Home Deep Cleaning</option>
                <option value="Electrician & Inverter">Electrician & Inverter</option>
                <option value="Plumbing & Motor">Plumbing & Motor</option>
                <option value="Washing Machine & Fridge">Washing Machine & Fridge</option>
                <option value="Mobile Repair">Mobile Repair</option>
                <option value="Laptop & PC Repair">Laptop & PC Repair</option>
                <option value="TV & Entertainment">TV & Entertainment</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Carpentry & Locksmith">Carpentry & Locksmith</option>
                <option value="RO & Chimney">RO & Chimney</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating City *</label>
              <select
                value={form.city || 'Delhi NCR'}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                {cities && cities.map(c => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Zone</label>
              <input
                type="text"
                placeholder="e.g. South Delhi Hub"
                value={form.zone_name || ''}
                onChange={e => setForm(f => ({ ...f, zone_name: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.experience_years || 3}
                onChange={e => setForm(f => ({ ...f, experience_years: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Crew / Agency Name</label>
              <input
                type="text"
                placeholder="e.g. FixoHub Direct Crew"
                value={form.provider_name || ''}
                onChange={e => setForm(f => ({ ...f, provider_name: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* ==================== AADHAAR & ID PROOF (KYC) ==================== */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" /> Aadhaar Card & Identity Proof (KYC)
              </h4>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Government Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aadhaar Number (12 Digits) *</label>
                <input
                  type="text"
                  placeholder="e.g. 8492 1049 8271"
                  value={form.aadhaar_number || ''}
                  onChange={e => setForm(f => ({ ...f, aadhaar_number: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Document / Photo</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 bg-white border border-purple-200 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-50 flex items-center gap-1.5 shadow-sm">
                    <UploadCloud className="w-3.5 h-3.5 text-purple-600" /> Upload Aadhaar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setForm(f => ({ ...f, aadhaar_image: ev.target.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {form.aadhaar_image && <span className="text-[11px] text-emerald-600 font-bold">✓ Uploaded</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Secondary ID Proof Type</label>
                <select
                  value={form.id_proof_type || 'PAN Card'}
                  onChange={e => setForm(f => ({ ...f, id_proof_type: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium text-xs"
                >
                  <option value="PAN Card">PAN Card</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Voter ID Card">Voter ID Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Government Service ID">Government Service ID</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ID Proof Number</label>
                <input
                  type="text"
                  placeholder="e.g. BKRPV7821K"
                  value={form.id_proof_number || ''}
                  onChange={e => setForm(f => ({ ...f, id_proof_number: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Police Background Verification</label>
                <select
                  value={form.police_verified ? '1' : '0'}
                  onChange={e => setForm(f => ({ ...f, police_verified: e.target.value === '1' }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="1">✅ Police Verified (Clear Record)</option>
                  <option value="0">⏳ Pending Verification</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trade Certification / ITI</label>
                <input
                  type="text"
                  placeholder="e.g. Certified NSDC / ITI Master"
                  value={form.certification || ''}
                  onChange={e => setForm(f => ({ ...f, certification: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* ==================== BANK ACCOUNT & PAYOUT DETAILS ==================== */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-700" /> Bank Account & Payout Details
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">For Direct Payouts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank"
                  value={form.bank_name || ''}
                  onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Holder Full Name *</label>
                <input
                  type="text"
                  placeholder="As per bank passbook"
                  value={form.bank_holder_name || ''}
                  onChange={e => setForm(f => ({ ...f, bank_holder_name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 50100492817291"
                  value={form.bank_account_number || ''}
                  onChange={e => setForm(f => ({ ...f, bank_account_number: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank IFSC Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234 / HDFC0000128"
                  value={form.bank_ifsc || ''}
                  onChange={e => setForm(f => ({ ...f, bank_ifsc: e.target.value.toUpperCase() }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">UPI ID (Instant Settlement)</label>
              <input
                type="text"
                placeholder="e.g. technician@upi, 9876543210@paytm"
                value={form.upi_id || ''}
                onChange={e => setForm(f => ({ ...f, upi_id: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
              />
            </div>
          </div>

          {/* ADDRESS & EMERGENCY CONTACT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Residential Address</label>
              <input
                type="text"
                placeholder="House / Street, Colony, Landmark"
                value={form.address || ''}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Person & Phone</label>
              <input
                type="text"
                placeholder="e.g. Sunil Verma (Brother) - +91 98112 34567"
                value={form.emergency_contact || ''}
                onChange={e => setForm(f => ({ ...f, emergency_contact: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 text-xs transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Save & Register Serviceman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 1B. VIEW FULL TECHNICIAN KYC & BANK MODAL
// ==========================================
export function ViewTechnicianKYCModal({ technician, onClose }) {
  const [copiedField, setCopiedField] = useState('');

  if (!technician) return null;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-xs">
        {/* Header with Photo & Basic Details */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {technician.profile_image ? (
              <img
                src={technician.profile_image}
                alt={technician.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                {technician.name ? technician.name.slice(0, 2).toUpperCase() : 'TC'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{technician.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {technician.specialty}
                </span>
              </div>
              <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
                <span>{technician.phone}</span>
                {technician.email && <span>• {technician.email}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operating Area & Pincode */}
        <div className="bg-slate-50 p-3 rounded-2xl grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">City Hub</div>
            <div className="font-bold text-slate-800">{technician.city || 'Delhi NCR'}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Serving Pincode</div>
            <div className="font-mono font-bold text-blue-600">📍 {technician.pincode || '110016'}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Duty Status</div>
            <div className={`font-bold ${technician.is_available ? 'text-emerald-600' : 'text-slate-500'}`}>
              {technician.is_available ? '● Available' : 'Offline'}
            </div>
          </div>
        </div>

        {/* Aadhaar & ID Proof Section */}
        <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" /> Aadhaar & Identity Proof (KYC)
            </span>
            <span className="text-[10px] bg-purple-200/80 text-purple-900 font-bold px-2 py-0.5 rounded-full">
              {technician.police_verified ? 'Police Verified' : 'Pending Verification'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-purple-100">
            <div>
              <div className="text-[10px] text-slate-400 font-bold">Aadhaar Card Number</div>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                {technician.aadhaar_number || '8492 1049 8271'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{technician.id_proof_type || 'PAN Card'}</div>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                {technician.id_proof_number || 'BKRPV7821K'}
              </div>
            </div>
          </div>

          {technician.aadhaar_image && (
            <div className="p-2 bg-white rounded-xl border border-purple-100">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Attached Aadhaar Document:</span>
              <img src={technician.aadhaar_image} alt="Aadhaar" className="max-h-32 object-contain rounded-lg border" />
            </div>
          )}
        </div>

        {/* Bank & Payout Details */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-700" /> Bank Account & Payout Details
            </span>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
              Verified Beneficiary
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Bank Name:</span>
              <span className="font-bold text-slate-900">{technician.bank_name || 'State Bank of India'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Account Holder:</span>
              <span className="font-semibold text-slate-800">{technician.bank_holder_name || technician.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Account Number:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                <span>{technician.bank_account_number || '309182749102'}</span>
                <button
                  onClick={() => copyToClipboard(technician.bank_account_number || '309182749102', 'acc')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                  title="Copy Account Number"
                >
                  {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">IFSC Code:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-blue-600">
                <span>{technician.bank_ifsc || 'SBIN0001234'}</span>
                <button
                  onClick={() => copyToClipboard(technician.bank_ifsc || 'SBIN0001234', 'ifsc')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                  title="Copy IFSC"
                >
                  {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">UPI ID:</span>
              <span className="font-mono font-semibold text-emerald-700">{technician.upi_id || `${technician.phone?.replace(/[^0-9]/g, '')}@upi`}</span>
            </div>
          </div>
        </div>

        {/* Address & Emergency Info */}
        <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-slate-600">
          <div><span className="font-semibold text-slate-700">Residential Address:</span> {technician.address || 'Address on file with Aadhaar verification'}</div>
          <div><span className="font-semibold text-slate-700">Emergency Contact:</span> {technician.emergency_contact || 'None specified'}</div>
          <div><span className="font-semibold text-slate-700">Certification:</span> {technician.certification || 'Certified ITI Expert'}</div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. ADD SERVICE ZONE MODAL
// ==========================================
export function AddZoneModal({ show, isOpen, onClose, onSave, onSubmit, form, setForm, cities }) {
  const visible = show || isOpen;
  const handleSubmit = onSubmit || onSave;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add New Service Zone (Geo-fence)</h3>
              <p className="text-[11px] text-slate-500">Define operational boundary, pincodes and surge multiplier</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Zone Name</label>
            <input
              type="text"
              placeholder="e.g. South Delhi Premium Sector"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">City Hub</label>
            <select
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
            >
              {cities && cities.map(c => (
                <option key={c.id || c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Covered Pincodes (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. 110016, 110017, 110019, 110020"
              value={form.pincodes}
              onChange={e => setForm(f => ({ ...f, pincodes: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Surge Multiplier</label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="3.0"
                value={form.surge_multiplier}
                onChange={e => setForm(f => ({ ...f, surge_multiplier: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
              />
              <span className="text-[10px] text-slate-400">1.0 = Normal, 1.25 = 25% Surge</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Visiting Charge (₹)</label>
              <input
                type="number"
                value={form.visiting_charge}
                onChange={e => setForm(f => ({ ...f, visiting_charge: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-blue-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              Save Service Zone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. REPORT NEW INCIDENT / ISSUE MODAL
// ==========================================
export function AddIssueModal({ show, isOpen, onClose, onSave, onSubmit, form, setForm }) {
  const visible = show || isOpen;
  const handleSubmit = onSubmit || onSave;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Log New Incident / Dispute</h3>
              <p className="text-[11px] text-slate-500">Record customer complaint, damage claim or overcharging</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Booking Order Code</label>
              <input
                type="text"
                placeholder="e.g. BK-2026-901"
                value={form.booking_code}
                onChange={e => setForm(f => ({ ...f, booking_code: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Serviceman Involved</label>
              <input
                type="text"
                placeholder="e.g. Suresh Verma"
                value={form.serviceman_name}
                onChange={e => setForm(f => ({ ...f, serviceman_name: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="e.g. Rohit Sharma"
                value={form.customer_name}
                onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Phone</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={form.customer_phone}
                onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dispute Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Damaged Equipment">Damaged Equipment</option>
                <option value="Substandard Work">Substandard Work</option>
                <option value="Late Arrival / No Show">Late Arrival / No Show</option>
                <option value="Overcharging / Extra Cash">Overcharging / Extra Cash</option>
                <option value="Unprofessional Behavior">Unprofessional Behavior</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
              <select
                value={form.severity}
                onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Critical">Critical (Immediate Refund / Escalation)</option>
                <option value="High">High (4-Hour Resolution)</option>
                <option value="Medium">Medium (Standard Review)</option>
                <option value="Low">Low (Feedback / Minor)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description of Incident</label>
            <textarea
              rows={3}
              placeholder="State the customer claim, technician version, and initial assessment..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              Log Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. RESOLVE INCIDENT & COMPENSATION MODAL
// ==========================================
export function ResolveIssueModal({ issue, onClose, onSubmit, form, setForm }) {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Resolve Dispute: {issue.id}</h3>
              <p className="text-[11px] text-slate-500">Order: {issue.booking_code} • Customer: {issue.customer_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1">
          <div className="font-semibold text-slate-800">{issue.category} ({issue.severity} Priority)</div>
          <p className="text-slate-600">{issue.description}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resolution Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
            >
              <option value="Resolved">Resolved (Close Complaint)</option>
              <option value="Investigating">Investigating (Needs Evidence / Call)</option>
              <option value="Open">Re-open Complaint</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Customer Wallet Compensation Refund (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 500"
              value={form.refund_amount}
              onChange={e => setForm(f => ({ ...f, refund_amount: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-emerald-600"
            />
            <span className="text-[10px] text-slate-400">
              Refund is automatically credited to the customer's FixoWallet balance in Cloudflare D1.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Administrative Resolution Notes</label>
            <textarea
              rows={3}
              placeholder="Record explanation provided to customer, disciplinary action taken, and agreement..."
              value={form.resolution_notes}
              onChange={e => setForm(f => ({ ...f, resolution_notes: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              Save Resolution & Credit Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADD STAFF MEMBER (RBAC) MODAL
// ==========================================
export function AddStaffModal({ show, isOpen, onClose, onSave, onSubmit, form, setForm, roles, cities }) {
  const visible = show || isOpen;
  const handleSubmit = onSubmit || onSave;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add Administrative Staff Member</h3>
              <p className="text-[11px] text-slate-500">Assign role permissions and regional access jurisdiction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Vikram Singhania"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                placeholder="vikram@fixohub.in"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98112 33445"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
              <select
                value={form.role_id}
                onChange={e => {
                  const rId = e.target.value;
                  const selectedRole = roles.find(r => r.id === rId);
                  setForm(f => ({
                    ...f,
                    role_id: rId,
                    role_name: selectedRole ? selectedRole.role_name : 'Staff Member'
                  }));
                }}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                {roles && roles.map(r => (
                  <option key={r.id} value={r.id}>{r.role_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jurisdiction / City Access</label>
              <select
                value={form.city_access}
                onChange={e => setForm(f => ({ ...f, city_access: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                <option value="All Cities">All Cities (Global Access)</option>
                {cities && cities.map(c => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              Save Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 6. ADD NEW CUSTOMER MODAL
// ==========================================
export function AddCustomerModal({ show, isOpen, onClose, onSave, onSubmit, form, setForm, cities }) {
  const visible = show || isOpen;
  const handleSubmit = onSubmit || onSave;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add New Customer Account</h3>
              <p className="text-[11px] text-slate-500">Register customer in CRM with initial wallet bonus</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer Full Name</label>
            <input
              type="text"
              placeholder="e.g. Meera Nambiar"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (10 Digits)</label>
              <input
                type="text"
                placeholder="9876543210"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="meera@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <select
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                {cities && cities.map(c => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Welcome Wallet Balance (₹)</label>
              <input
                type="number"
                min="0"
                value={form.wallet_balance}
                onChange={e => setForm(f => ({ ...f, wallet_balance: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-emerald-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 7. ONBOARD TECHNICIAN MODAL (FOR PROVIDERS TAB)
// ==========================================
export function OnboardTechnicianModal({ show, isOpen, onClose, onSave, onSubmit, form, setForm, cities }) {
  const visible = show || isOpen;
  const handleSubmit = onSubmit || onSave;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Onboard Verified Technician / Partner</h3>
              <p className="text-[11px] text-slate-500">Photo, Pincode, Gmail, Aadhaar KYC & Bank Payout Details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* PROFILE PHOTO UPLOADER */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
            <div className="relative shrink-0">
              {form.profile_image ? (
                <img src={form.profile_image} alt="Preview" className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex flex-col items-center justify-center font-bold text-xs border-2 border-dashed border-indigo-300">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>Photo</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="block font-bold text-slate-800 text-xs">Technician Profile Picture *</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-[11px] shadow transition">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setForm(f => ({ ...f, profile_image: ev.target.result }));
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {form.profile_image && (
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, profile_image: '' }))}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[11px] font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Or paste photo URL (https://images.unsplash.com/...)"
                value={form.profile_image || ''}
                onChange={e => setForm(f => ({ ...f, profile_image: e.target.value }))}
                className="w-full p-1.5 text-[11px] border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* BASIC DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Technician Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Manoj Sharma"
                value={form.name || ''}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (+91) *</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={form.phone || ''}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-red-500" /> Gmail / Official Email *
              </label>
              <input
                type="email"
                placeholder="manoj.tech@gmail.com"
                value={form.email || ''}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Operating Pincode (Area PIN) *
              </label>
              <input
                type="text"
                placeholder="e.g. 110016"
                value={form.pincode || ''}
                onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trade Specialty *</label>
              <input
                type="text"
                placeholder="e.g. AC Cooling & Refrigeration, Electrical"
                value={form.specialty || ''}
                onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating City *</label>
              <select
                value={form.city || 'Delhi NCR'}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              >
                {cities && cities.map(c => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ==================== AADHAAR & ID PROOF (KYC) ==================== */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" /> Aadhaar Card & Identity Proof (KYC)
              </h4>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Government Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Number (12 Digits) *</label>
                <input
                  type="text"
                  placeholder="e.g. 6521 8934 1120"
                  value={form.aadhaar_number || ''}
                  onChange={e => setForm(f => ({ ...f, aadhaar_number: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Document</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 bg-white border border-purple-200 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-50 flex items-center gap-1.5 shadow-sm">
                    <UploadCloud className="w-3.5 h-3.5 text-purple-600" /> Upload Document
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setForm(f => ({ ...f, aadhaar_image: ev.target.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {form.aadhaar_image && <span className="text-[11px] text-emerald-600 font-bold">✓ Attached</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Secondary ID Proof Type</label>
                <select
                  value={form.id_proof_type || 'PAN Card'}
                  onChange={e => setForm(f => ({ ...f, id_proof_type: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium text-xs"
                >
                  <option value="PAN Card">PAN Card</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Voter ID Card">Voter ID Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Government Service ID">Government Service ID</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ID Proof Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-04201800912"
                  value={form.id_proof_number || ''}
                  onChange={e => setForm(f => ({ ...f, id_proof_number: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Police Background Verification</label>
                <select
                  value={form.police_verified ? '1' : '0'}
                  onChange={e => setForm(f => ({ ...f, police_verified: e.target.value === '1' }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="1">✅ Police Verified (Clear Record)</option>
                  <option value="0">⏳ Pending Verification</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trade Certification / ITI</label>
                <input
                  type="text"
                  placeholder="e.g. Certified NSDC AC Specialist"
                  value={form.certification || ''}
                  onChange={e => setForm(f => ({ ...f, certification: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* ==================== BANK ACCOUNT & PAYOUT DETAILS ==================== */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-700" /> Bank Account & Payout Details
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">For Direct Payouts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank"
                  value={form.bank_name || ''}
                  onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Holder Full Name *</label>
                <input
                  type="text"
                  placeholder="As per bank passbook"
                  value={form.bank_holder_name || ''}
                  onChange={e => setForm(f => ({ ...f, bank_holder_name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 50100492817291"
                  value={form.bank_account_number || ''}
                  onChange={e => setForm(f => ({ ...f, bank_account_number: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank IFSC Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234 / HDFC0000128"
                  value={form.bank_ifsc || ''}
                  onChange={e => setForm(f => ({ ...f, bank_ifsc: e.target.value.toUpperCase() }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">UPI ID (Instant Settlement)</label>
              <input
                type="text"
                placeholder="e.g. technician@upi, 9876543210@paytm"
                value={form.upi_id || ''}
                onChange={e => setForm(f => ({ ...f, upi_id: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
              />
            </div>
          </div>

          {/* ADDRESS & EMERGENCY CONTACT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Residential Address</label>
              <input
                type="text"
                placeholder="House / Street, Colony, Landmark"
                value={form.address || ''}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Person & Phone</label>
              <input
                type="text"
                placeholder="e.g. Meena Kumar (Wife) - +91 98234 56789"
                value={form.emergency_contact || ''}
                onChange={e => setForm(f => ({ ...f, emergency_contact: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 text-xs transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Onboard & Register Provider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
