import React from 'react';
import { X, Users, Map, AlertOctagon, ShieldCheck, UserPlus, Phone, Mail, Award, CheckCircle } from 'lucide-react';

// ==========================================
// 1. ADD SERVICEMAN MODAL
// ==========================================
export function AddServicemanModal({ show, onClose, onSave, form, setForm, cities }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add New Serviceman / Field Crew</h3>
              <p className="text-[11px] text-slate-500">Deploy verified technician to local service zone</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (+91)</label>
              <input
                type="text"
                placeholder="+91 98765 11223"
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
                placeholder="rajesh@fixohub.in"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Specialty Skill</label>
              <select
                value={form.specialty}
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
              <label className="block font-semibold text-slate-700 mb-1">Operating City</label>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Zone</label>
              <input
                type="text"
                placeholder="e.g. South Delhi Hub / Bandra West"
                value={form.zone_name}
                onChange={e => setForm(f => ({ ...f, zone_name: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.experience_years}
                onChange={e => setForm(f => ({ ...f, experience_years: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Crew / Agency Name</label>
            <input
              type="text"
              placeholder="e.g. FixoHub Direct Crew / Apex Tech Solutions"
              value={form.provider_name}
              onChange={e => setForm(f => ({ ...f, provider_name: e.target.value }))}
              className="w-full p-2.5 border border-slate-200 rounded-xl"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              Register Serviceman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. ADD SERVICE ZONE MODAL
// ==========================================
export function AddZoneModal({ show, onClose, onSave, form, setForm, cities }) {
  if (!show) return null;

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

        <form onSubmit={onSave} className="space-y-3 text-xs">
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
export function AddIssueModal({ show, onClose, onSave, form, setForm }) {
  if (!show) return null;

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

        <form onSubmit={onSave} className="space-y-3 text-xs">
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
export function AddStaffModal({ show, onClose, onSave, form, setForm, roles, cities }) {
  if (!show) return null;

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

        <form onSubmit={onSave} className="space-y-3 text-xs">
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
export function AddCustomerModal({ show, onClose, onSave, form, setForm, cities }) {
  if (!show) return null;

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

        <form onSubmit={onSave} className="space-y-3 text-xs">
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
