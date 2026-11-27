import { useEffect, useState, useRef } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, RefreshCw, CheckCircle,
  XCircle, ExternalLink, LogOut, Briefcase, Play, CheckCheck,
  Wallet, Star, Clock, MapPin, Shield, DollarSign, Bell, Send,
  Radio, Award, AlertCircle, ArrowUpRight, Camera, UploadCloud,
  CreditCard, Landmark, FileText, Eye, ShieldCheck, UserCheck,
  Copy, Check, Building2, User, Phone, Mail, X, Users, Navigation,
  Volume2, VolumeX, Map
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

// Zero-dependency Web Audio API Synthesizer (Instant 4-Tone Alert Chime)
export const playOrderChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
      { freq: 659.25, time: 0.12, dur: 0.12 }, // E5
      { freq: 783.99, time: 0.24, dur: 0.15 }, // G5
      { freq: 1046.50, time: 0.38, dur: 0.30 }  // C6
    ];
    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + n.time);
      osc.stop(ctx.currentTime + n.time + n.dur);
    });
  } catch (e) {
    console.error('Audio play error', e);
  }
};

const SPECIALTIES = [
  'AC Cooling & Refrigeration',
  'Mobile Repair & Screen',
  'Laptop & PC Service',
  'TV & Home Entertainment',
  'Electrician & Wiring',
  'Home Deep Cleaning',
  'Plumbing & Sanitary',
  'RO & Chimney Service',
  'Pest Control',
  'Washing Machine & Fridge',
  'Carpentry & Furniture'
];

const CITIES = [
  'Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad',
  'Pune', 'Jaipur', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'
];

export default function App() {
  const [partner, setPartner] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hs_partner') || 'null');
    } catch {
      return null;
    }
  });
  const [partnersList, setPartnersList] = useState([]);
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [tab, setTab] = useState('overview'); // overview, profile, radar, jobs, servicemen, wallet, schedule, reviews, services
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [servicemen, setServicemen] = useState([]);
  const [copiedField, setCopiedField] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Sound Alert State (Saved to localStorage)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('hs_partner_sound') !== '0';
  });
  const prevBookingsCount = useRef(0);

  // Serviceman Management & Assignment Modals
  const [showAddSmModal, setShowAddSmModal] = useState(false);
  const [assignModalBooking, setAssignModalBooking] = useState(null);
  const [navModalBooking, setNavModalBooking] = useState(null);
  const [smSearch, setSmSearch] = useState('');

  // Add Service Man Form
  const [smForm, setSmForm] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: 'AC Cooling & Refrigeration',
    city: 'Delhi NCR',
    pincode: '110016',
    experience_years: 3,
    profile_image: '',
    id_proof_type: 'PAN Card',
    id_proof_number: '',
    aadhaar_number: '',
    aadhaar_image: '',
    bank_name: 'State Bank of India',
    bank_account_number: '',
    bank_ifsc: '',
    bank_holder_name: '',
    upi_id: '',
    address: '',
    emergency_contact: '',
    certification: 'Certified Technician'
  });

  // Registration Form State (with Photo, Pincode, Gmail, Aadhaar, ID Proof, Bank)
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: 'AC Cooling & Refrigeration',
    city: 'Delhi NCR',
    pincode: '110016',
    profile_image: '',
    id_proof_type: 'PAN Card',
    id_proof_number: '',
    id_proof_image: '',
    aadhaar_number: '',
    aadhaar_image: '',
    bank_name: 'State Bank of India',
    bank_account_number: '',
    bank_ifsc: '',
    bank_holder_name: '',
    upi_id: '',
    address: '',
    emergency_contact: '',
    certification: 'Certified ITI Expert'
  });

  // Profile Form State for Logged-in Partner
  const [profileForm, setProfileForm] = useState(null);

  // Job OTP verification modal
  const [otpModalBooking, setOtpModalBooking] = useState(null);
  const [otpInput, setOtpInput] = useState('');

  // Partner Wallet & Payout
  const [partnerBalance, setPartnerBalance] = useState(7850);
  const [withdrawAmt, setWithdrawAmt] = useState(3000);
  const [upiId, setUpiId] = useState('provider@upi');
  const [withdrawHistory, setWithdrawHistory] = useState([
    { id: 'wd-1', amount: 4500, date: '22 Nov 2026', status: 'Completed', upi: 'provider@okhdfc' },
    { id: 'wd-2', amount: 3200, date: '18 Nov 2026', status: 'Completed', upi: 'provider@okhdfc' }
  ]);

  // Working Hours Schedule
  const [schedule, setSchedule] = useState([
    { day: 'Monday', hours: '08:00 AM - 08:00 PM', active: true },
    { day: 'Tuesday', hours: '08:00 AM - 08:00 PM', active: true },
    { day: 'Wednesday', hours: '08:00 AM - 08:00 PM', active: true },
    { day: 'Thursday', hours: '08:00 AM - 08:00 PM', active: true },
    { day: 'Friday', hours: '08:00 AM - 08:00 PM', active: true },
    { day: 'Saturday', hours: '09:00 AM - 07:00 PM', active: true },
    { day: 'Sunday', hours: '09:00 AM - 05:00 PM', active: false }
  ]);

  // Customer Reviews
  const [reviews, setReviews] = useState([
    { id: 'rev-1', customer: 'Rahul Sharma', rating: 5, date: '25 Nov 2026', text: 'Arrived right on time, replaced my screen cleanly and tested TrueTone.', reply: 'Thank you Rahul! Always happy to help.' },
    { id: 'rev-2', customer: 'Priya Nair', rating: 5, date: '23 Nov 2026', text: 'Very knowledgeable technician. Fixed the AC cooling coil leak efficiently.', reply: '' }
  ]);
  const [replyInput, setReplyInput] = useState('');

  // Live Radar Simulated Request
  const [incomingJob, setIncomingJob] = useState({
    id: 'radar-992',
    title: 'Emergency AC Foam Jet Wash + Gas Check',
    customer: 'Vikram Joshi (Sector 18)',
    distance: '2.4 km away',
    amount: 1499,
    timeLeft: 45
  });

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const loadData = async (currentPartner = partner) => {
    const [techs, srvs] = await Promise.all([
      fetch(`${API}/api/technicians`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/services`).then(r => r.json()).catch(() => [])
    ]);
    setPartnersList(techs);
    setServices(srvs);

    if (currentPartner) {
      const [bks, sms] = await Promise.all([
        fetch(`${API}/api/bookings?technicianId=${encodeURIComponent(currentPartner.id)}`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/servicemen?providerId=${encodeURIComponent(currentPartner.id)}`).then(r => r.json()).catch(() => [])
      ]);
      
      // Sound alert if new booking has arrived
      if (soundEnabled && prevBookingsCount.current > 0 && bks.length > prevBookingsCount.current) {
        playOrderChime();
      }
      prevBookingsCount.current = bks.length;

      setBookings(bks);
      setServicemen(sms);
      const updatedMe = techs.find(t => t.id === currentPartner.id);
      if (updatedMe) {
        setPartner(updatedMe);
        localStorage.setItem('hs_partner', JSON.stringify(updatedMe));
      }
    }
  };

  // Add Service Man by Provider
  const handleAddServiceman = async (e) => {
    e.preventDefault();
    if (!smForm.name || !smForm.phone) {
      alert('Please enter Serviceman Full Name and Phone Number.');
      return;
    }
    try {
      const res = await fetch(`${API}/api/servicemen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...smForm,
          provider_id: partner.id,
          provider_name: partner.name,
          city: smForm.city || partner.city,
          specialty: smForm.specialty || partner.specialty
        })
      });
      if (res.ok) {
        alert(`Service Man "${smForm.name}" added successfully to your field crew!`);
        setShowAddSmModal(false);
        setSmForm({
          name: '', phone: '', email: '', specialty: partner.specialty || 'AC Cooling & Refrigeration',
          city: partner.city || 'Delhi NCR', pincode: partner.pincode || '110016',
          experience_years: 3, profile_image: '', id_proof_type: 'PAN Card',
          id_proof_number: '', aadhaar_number: '', aadhaar_image: '',
          bank_name: 'State Bank of India', bank_account_number: '', bank_ifsc: '',
          bank_holder_name: '', upi_id: '', address: '', emergency_contact: '',
          certification: 'Certified Technician'
        });
        loadData(partner);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add serviceman.');
      }
    } catch {
      alert('Network error while adding serviceman.');
    }
  };

  // Assign Serviceman to a Customer Booking
  const handleAssignServiceman = async (bookingId, sm) => {
    try {
      const res = await fetch(`${API}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceman_id: sm ? sm.id : null,
          serviceman_name: sm ? sm.name : null,
          serviceman_phone: sm ? sm.phone : null,
          status: 'assigned'
        })
      });
      if (res.ok) {
        if (soundEnabled) playOrderChime();
        alert(sm ? `Assigned to ${sm.name}! Customer and Serviceman notified.` : 'Booking unassigned.');
        setAssignModalBooking(null);
        loadData(partner);
      } else {
        alert('Failed to assign serviceman.');
      }
    } catch {
      alert('Error updating assignment.');
    }
  };

  // Toggle Serviceman Availability / Duty
  const toggleSmDuty = async (sm) => {
    try {
      const res = await fetch(`${API}/api/servicemen/${sm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !sm.is_available })
      });
      if (res.ok) {
        loadData(partner);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Serviceman
  const deleteSm = async (id) => {
    if (!confirm('Remove this service man from your crew?')) return;
    try {
      const res = await fetch(`${API}/api/servicemen/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Service man removed.');
        loadData(partner);
      }
    } catch {
      alert('Error removing serviceman.');
    }
  };

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  // Sync profile form whenever partner state updates
  useEffect(() => {
    if (partner) {
      setProfileForm({
        name: partner.name || '',
        phone: partner.phone || '',
        email: partner.email || '',
        specialty: partner.specialty || 'AC Cooling & Refrigeration',
        city: partner.city || 'Delhi NCR',
        pincode: partner.pincode || '110016',
        profile_image: partner.profile_image || '',
        id_proof_type: partner.id_proof_type || 'PAN Card',
        id_proof_number: partner.id_proof_number || '',
        id_proof_image: partner.id_proof_image || '',
        aadhaar_number: partner.aadhaar_number || '',
        aadhaar_image: partner.aadhaar_image || '',
        bank_name: partner.bank_name || 'State Bank of India',
        bank_account_number: partner.bank_account_number || '',
        bank_ifsc: partner.bank_ifsc || '',
        bank_holder_name: partner.bank_holder_name || '',
        upi_id: partner.upi_id || '',
        address: partner.address || '',
        emergency_contact: partner.emergency_contact || '',
        certification: partner.certification || 'Certified ITI Expert'
      });
      if (partner.upi_id) setUpiId(partner.upi_id);
    }
  }, [partner]);

  const loginPartner = async (phoneOrEmailOrId) => {
    const res = await fetch(`${API}/api/partner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneOrEmailOrId })
    });
    if (res.ok) {
      const p = await res.json();
      setPartner(p);
      localStorage.setItem('hs_partner', JSON.stringify(p));
      loadData(p);
    } else {
      alert('Partner not found! Check phone/Gmail or try 1-Click Demo Logins below, or click "Register as New Partner".');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone || !regForm.specialty) {
      alert('Please enter Name, Mobile Phone and Trade Specialty.');
      return;
    }
    try {
      const res = await fetch(`${API}/api/technicians`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      if (res.ok) {
        const newPartner = await res.json();
        setPartner(newPartner);
        localStorage.setItem('hs_partner', JSON.stringify(newPartner));
        alert(`Welcome ${newPartner.name}! Your Partner Registration & KYC details have been saved.`);
        loadData(newPartner);
      } else {
        const err = await res.json();
        alert(err.error || 'Registration failed. Please check inputs.');
      }
    } catch {
      alert('Network error during registration. Please try again.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm) return;
    setSavingProfile(true);
    try {
      const res = await fetch(`${API}/api/technicians/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setPartner(updated);
        localStorage.setItem('hs_partner', JSON.stringify(updated));
        alert('Profile & KYC details updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch {
      alert('Network error while saving profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const updateJobStatus = async (bookingId, status) => {
    await fetch(`${API}/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, technician_id: partner.id })
    });
    loadData(partner);
  };

  const toggleAvailability = async () => {
    await fetch(`${API}/api/technicians/${partner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: !partner.is_available })
    });
    loadData(partner);
  };

  const verifyOtpAndStart = (bookingId) => {
    if (otpInput.trim() === '1234' || otpInput.trim().length === 4) {
      updateJobStatus(bookingId, 'in_progress');
      setOtpModalBooking(null);
      setOtpInput('');
      alert('Customer OTP Verified! Job marked as In Progress.');
    } else {
      alert('Please enter a valid 4-digit customer OTP (e.g. 1234).');
    }
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (withdrawAmt > partnerBalance) {
      alert('Withdrawal amount exceeds your available balance.');
      return;
    }
    setPartnerBalance(partnerBalance - withdrawAmt);
    setWithdrawHistory([
      { id: `wd-${Date.now()}`, amount: withdrawAmt, date: 'Just now', status: 'Processing', upi: upiId },
      ...withdrawHistory
    ]);
    alert(`Withdrawal request of ₹${withdrawAmt} submitted! Funds will arrive in your UPI account within 15 minutes.`);
  };

  const submitReply = (revId) => {
    if (!replyInput.trim()) return;
    setReviews(reviews.map(r => r.id === revId ? { ...r, reply: replyInput.trim() } : r));
    setReplyInput('');
    alert('Your reply has been published on the customer app!');
  };

  // ==========================================
  // AUTH SCREEN (LOGIN & ONBOARDING REGISTRATION)
  // ==========================================
  if (!partner) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        padding: '24px 16px',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: 32,
          width: '100%',
          maxWidth: authMode === 'register' ? 760 : 440,
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: '#0079ff',
              color: '#fff',
              display: 'inline-grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              marginBottom: 10,
              boxShadow: '0 8px 16px rgba(0, 121, 255, 0.3)'
            }}>FH</div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>FixoHub Partner Portal</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Provider, Technician &amp; Field Crew Workspace</p>

            {/* Mode Switch Tabs */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: 12,
              padding: 4,
              marginTop: 16,
              gap: 4
            }}>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: authMode === 'login' ? '#ffffff' : 'transparent',
                  color: authMode === 'login' ? '#0079ff' : '#64748b',
                  boxShadow: authMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Log In to Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: authMode === 'register' ? '#ffffff' : 'transparent',
                  color: authMode === 'register' ? '#0079ff' : '#64748b',
                  boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                + Join as Partner (KYC)
              </button>
            </div>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {authMode === 'login' && (
            <>
              <form onSubmit={(e) => { e.preventDefault(); loginPartner(phoneInput); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Registered Mobile Number or Gmail
                  </label>
                  <input
                    required
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="+91 98765 43210 or yourname@gmail.com"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 12,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 12,
                    background: '#0079ff',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(0, 121, 255, 0.25)',
                    cursor: 'pointer',
                    marginTop: 4
                  }}
                >
                  Log in to Partner Portal &rarr;
                </button>
              </form>

              <div style={{ marginTop: 20, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: 8, letterSpacing: '0.04em' }}>
                  ⚡ 1-CLICK DEMO PARTNER LOGINS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {partnersList.slice(0, 4).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => loginPartner(p.id)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 10,
                        padding: '8px 12px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#0f172a',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {p.profile_image ? (
                          <img src={p.profile_image} alt={p.name} style={{ width: 22, height: 22, borderRadius: 6, objectCover: 'cover' }} />
                        ) : (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                        )}
                        <span>{p.name} <span style={{ color: '#64748b', fontWeight: 500 }}>({p.specialty})</span></span>
                      </div>
                      <span style={{ color: '#0079ff', fontSize: '0.76rem' }}>Login &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0079ff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  New technician or contractor? Join as Partner &rarr;
                </button>
              </div>
            </>
          )}

          {/* TAB 2: COMPREHENSIVE ONBOARDING REGISTRATION (WITH PHOTO, PINCODE, GMAIL, AADHAAR, ID PROOF, BANK) */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-[11px] text-blue-900 leading-relaxed font-medium">
                  Register your profile with verified identity, operating area pincode, Aadhaar KYC, and bank payout details to receive instant doorstep service bookings.
                </p>
              </div>

              {/* 1. Profile Photo Upload */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                <div className="relative shrink-0">
                  {regForm.profile_image ? (
                    <img src={regForm.profile_image} alt="Preview" className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm" />
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
                            reader.onload = ev => setRegForm(f => ({ ...f, profile_image: ev.target.result }));
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {regForm.profile_image && (
                      <button
                        type="button"
                        onClick={() => setRegForm(f => ({ ...f, profile_image: '' }))}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[11px] font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste public photo URL directly..."
                    value={regForm.profile_image}
                    onChange={e => setRegForm(f => ({ ...f, profile_image: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl text-[11px] font-mono"
                  />
                </div>
              </div>

              {/* 2. Basic Identity: Name, Mobile, Gmail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={regForm.name}
                    onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={regForm.phone}
                    onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gmail / Email *</label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh.fixo@gmail.com"
                    value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* 3. Specialty, City & Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trade Specialty *</label>
                  <select
                    value={regForm.specialty}
                    onChange={e => setRegForm(f => ({ ...f, specialty: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {SPECIALTIES.map(sp => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operating City Hub *</label>
                  <select
                    value={regForm.city}
                    onChange={e => setRegForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serving Pin Code (Area PIN) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 110016"
                    value={regForm.pincode}
                    onChange={e => setRegForm(f => ({ ...f, pincode: e.target.value.replace(/[^0-9]/g, '') }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono font-bold text-blue-600"
                    required
                  />
                </div>
              </div>

              {/* 4. Aadhaar Card KYC */}
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-700" /> Aadhaar Card KYC Verification
                  </span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                    Required for Payouts
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">12-Digit Aadhaar Number *</label>
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="e.g. 8492 1049 8271"
                      value={regForm.aadhaar_number}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setRegForm(f => ({ ...f, aadhaar_number: formatted }));
                      }}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Aadhaar Card Front/Back Photo</label>
                    <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl bg-white cursor-pointer hover:bg-slate-50 transition">
                      <UploadCloud className="w-4 h-4 text-purple-600" />
                      <span className="text-[11px] text-slate-600 truncate">
                        {regForm.aadhaar_image ? 'Document Uploaded ✓' : 'Upload Aadhaar Scan / PDF'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => setRegForm(f => ({ ...f, aadhaar_image: ev.target.result }));
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 5. ID Proof (PAN / DL / Voter ID / Passport) */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-700" /> Secondary Government ID Proof
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">ID Proof Document Type *</label>
                    <select
                      value={regForm.id_proof_type}
                      onChange={e => setRegForm(f => ({ ...f, id_proof_type: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="PAN Card">PAN Card</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Govt Service ID">Govt Service ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">ID Proof Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. BKRPV7821K / DL042019001"
                      value={regForm.id_proof_number}
                      onChange={e => setRegForm(f => ({ ...f, id_proof_number: e.target.value.toUpperCase() }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Upload ID Document</label>
                    <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl bg-white cursor-pointer hover:bg-slate-50 transition">
                      <UploadCloud className="w-4 h-4 text-amber-600" />
                      <span className="text-[11px] text-slate-600 truncate">
                        {regForm.id_proof_image ? 'Document Uploaded ✓' : 'Upload ID Photo / Scan'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => setRegForm(f => ({ ...f, id_proof_image: ev.target.result }));
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 6. Bank Details & UPI */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-emerald-700" /> Bank Payout &amp; UPI Account Details
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold">For Daily / Weekly Payouts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Bank Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India / HDFC Bank"
                      value={regForm.bank_name}
                      onChange={e => setRegForm(f => ({ ...f, bank_name: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={regForm.bank_holder_name}
                      onChange={e => setRegForm(f => ({ ...f, bank_holder_name: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Bank Account Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. 50100492817291"
                      value={regForm.bank_account_number}
                      onChange={e => setRegForm(f => ({ ...f, bank_account_number: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Bank IFSC Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. SBIN0001234 / HDFC0000128"
                      value={regForm.bank_ifsc}
                      onChange={e => setRegForm(f => ({ ...f, bank_ifsc: e.target.value.toUpperCase() }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase text-xs focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">UPI ID (Instant Settlement) *</label>
                  <input
                    type="text"
                    placeholder="e.g. ramesh@upi, 9876543210@paytm"
                    value={regForm.upi_id}
                    onChange={e => setRegForm(f => ({ ...f, upi_id: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs font-semibold text-emerald-700"
                    required
                  />
                </div>
              </div>

              {/* 7. Address & Emergency Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="House / Street, Colony, Landmark"
                    value={regForm.address}
                    onChange={e => setRegForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Person & Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Verma (Brother) - +91 98112 34567"
                    value={regForm.emergency_contact}
                    onChange={e => setRegForm(f => ({ ...f, emergency_contact: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  &larr; Back to Login
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-xs transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Register &amp; Complete KYC
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const earnings = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.total_amount, 0);
  const pendingJobs = bookings.filter(b => ['pending', 'assigned'].includes(b.status));

  // ==========================================
  // LOGGED-IN PARTNER DASHBOARD
  // ==========================================
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          {partner.profile_image ? (
            <img
              src={partner.profile_image}
              alt={partner.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
            />
          ) : (
            <div className="brand-icon" style={{ background: '#0079ff' }}>FH</div>
          )}
          <div className="truncate">
            <div style={{ fontWeight: 800 }}>{partner.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }} className="truncate">
              {partner.specialty}
            </div>
          </div>
        </div>

        <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button className={`nav-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          <UserCheck size={18} className="text-blue-600" /> My Profile &amp; KYC
        </button>

        <button className={`nav-btn ${tab === 'radar' ? 'active' : ''}`} onClick={() => setTab('radar')}>
          <Radio size={18} /> Live Job Radar
        </button>

        <button className={`nav-btn ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>
          <CalendarCheck size={18} /> My Jobs ({bookings.length})
        </button>

        <button className={`nav-btn ${tab === 'servicemen' ? 'active' : ''}`} onClick={() => setTab('servicemen')}>
          <Users size={18} className="text-emerald-500" /> My Service Men ({servicemen.length})
        </button>

        <button className={`nav-btn ${tab === 'wallet' ? 'active' : ''}`} onClick={() => setTab('wallet')}>
          <Wallet size={18} /> Partner Wallet (₹{partnerBalance})
        </button>

        <button className={`nav-btn ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}>
          <Clock size={18} /> Working Hours
        </button>

        <button className={`nav-btn ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>
          <Star size={18} /> Reviews ({reviews.length})
        </button>

        <button className={`nav-btn ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
          <Wrench size={18} /> Service Catalog
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button className="nav-btn" onClick={() => { localStorage.removeItem('hs_partner'); setPartner(null); }}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main">
        {/* Topbar with Profile Indicators */}
        <div className="topbar flex-wrap gap-3">
          <div>
            <h1 style={{ textTransform: 'capitalize' }}>
              {tab === 'profile' ? 'My Profile & KYC Verification' : tab}
            </h1>
            <div className="flex items-center gap-2 flex-wrap mt-1 text-xs">
              <span className="font-semibold text-slate-700">{partner.city}</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-mono font-bold">
                📍 PIN: {partner.pincode || '110016'}
              </span>
              {partner.email && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                  <Mail size={12} className="text-slate-500" /> {partner.email}
                </span>
              )}
              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                <ShieldCheck size={12} className="text-purple-600" /> Aadhaar: ••• {partner.aadhaar_number ? partner.aadhaar_number.slice(-4) : '8271'}
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                <Landmark size={12} className="text-emerald-600" /> {partner.bank_name ? partner.bank_name.split(' ')[0] : 'Bank'} Verified
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                localStorage.setItem('hs_partner_sound', next ? '1' : '0');
                if (next) playOrderChime();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
              title="Toggle Order Incoming Sound Alert"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={16} color="#10b981" />
                  <span style={{ color: '#047857' }}>Sound: ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={16} color="#94a3b8" />
                  <span style={{ color: '#64748b' }}>Sound: OFF</span>
                </>
              )}
            </button>
            <button
              className="btn btn-outline"
              onClick={playOrderChime}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem' }}
              title="Test 4-Tone Alert Chime"
            >
              <Bell size={14} color="#0079ff" /> Test Chime
            </button>
            <button className="btn btn-outline" onClick={toggleAvailability}>
              {partner.is_available ? <><CheckCircle size={15} color="#10b981" /> Duty: ONLINE</> : <><XCircle size={15} color="#ef4444" /> Duty: OFFLINE</>}
            </button>
            <button className="btn btn-primary" onClick={() => loadData(partner)}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {/* ==========================================
            TAB: MY PROFILE & KYC DETAILS (NEW)
            ========================================== */}
        {tab === 'profile' && profileForm && (
          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl">
            {/* Header / KYC Status Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profileForm.profile_image ? (
                    <img
                      src={profileForm.profile_image}
                      alt={profileForm.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center font-bold text-2xl">
                      {profileForm.name ? profileForm.name[0] : 'P'}
                    </div>
                  )}
                  <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${partner.is_available ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                </div>
                <div>
                  <h2 className="text-xl font-black">{profileForm.name}</h2>
                  <p className="text-blue-100 text-xs mt-0.5">{profileForm.specialty} • {profileForm.city}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      📍 PIN: {profileForm.pincode}
                    </span>
                    <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      ✓ KYC &amp; Police Verified
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-blue-700 font-bold rounded-2xl shadow-lg transition flex items-center gap-2 text-xs"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {savingProfile ? 'Saving Changes...' : 'Save Profile & KYC Updates'}
                </button>
              </div>
            </div>

            {/* 1. Profile Picture Editor */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" /> Technician Profile Picture (Photo Upload)
              </h3>
              <p className="text-xs text-slate-500">
                This photo is displayed to customers on the live dispatch map and booking confirmation screens.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <div className="relative shrink-0">
                  {profileForm.profile_image ? (
                    <img src={profileForm.profile_image} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs border border-dashed border-slate-300">
                      No Photo
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-sm">
                      Upload New Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => setProfileForm(f => ({ ...f, profile_image: ev.target.result }));
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {profileForm.profile_image && (
                      <button
                        type="button"
                        onClick={() => setProfileForm(f => ({ ...f, profile_image: '' }))}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste public photo URL directly..."
                    value={profileForm.profile_image}
                    onChange={e => setProfileForm(f => ({ ...f, profile_image: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Personal & Contact Details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Personal Identity &amp; Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Technician Full Name *</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Mobile Number *</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gmail / Official Email *</label>
                  <input
                    type="email"
                    placeholder="e.g. technician@gmail.com"
                    value={profileForm.email}
                    onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Trade Specialty</label>
                  <select
                    value={profileForm.specialty}
                    onChange={e => setProfileForm(f => ({ ...f, specialty: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {SPECIALTIES.map(sp => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trade Certification / Skill</label>
                  <input
                    type="text"
                    placeholder="e.g. Certified ITI Expert"
                    value={profileForm.certification}
                    onChange={e => setProfileForm(f => ({ ...f, certification: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 3. Operating Hub & Area Pincode */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Operating City Hub &amp; Area Pin Code
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operating City Hub</label>
                  <select
                    value={profileForm.city}
                    onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serving Pin Code (Area PIN) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 110016"
                    value={profileForm.pincode}
                    onChange={e => setProfileForm(f => ({ ...f, pincode: e.target.value.replace(/[^0-9]/g, '') }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono font-bold text-blue-600"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Bookings in this pincode are prioritized and dispatched to your radar first.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Aadhaar Card KYC Verification */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> Aadhaar Card KYC Verification
                </h3>
                <span className="text-[11px] bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">
                  Verified Identity Document
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">12-Digit Aadhaar Card Number *</label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="e.g. 8492 1049 8271"
                    value={profileForm.aadhaar_number}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                      const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setProfileForm(f => ({ ...f, aadhaar_number: formatted }));
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-sm font-bold text-purple-900 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Document Upload</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer flex items-center gap-2 p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                      <UploadCloud className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="truncate text-slate-600">
                        {profileForm.aadhaar_image ? 'Aadhaar Document On File ✓' : 'Upload Aadhaar Scan / Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => setProfileForm(f => ({ ...f, aadhaar_image: ev.target.result }));
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {profileForm.aadhaar_image && (
                      <button
                        type="button"
                        onClick={() => setProfileForm(f => ({ ...f, aadhaar_image: '' }))}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500"
                        title="Remove Document"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Secondary ID Proof */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" /> Government ID Proof (PAN / DL / Voter ID)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Document Type</label>
                  <select
                    value={profileForm.id_proof_type}
                    onChange={e => setProfileForm(f => ({ ...f, id_proof_type: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    <option value="PAN Card">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Govt Service ID">Govt Service ID</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Document Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. BKRPV7821K"
                    value={profileForm.id_proof_number}
                    onChange={e => setProfileForm(f => ({ ...f, id_proof_number: e.target.value.toUpperCase() }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase font-semibold text-amber-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Proof Document Photo</label>
                  <label className="cursor-pointer flex items-center gap-2 p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                    <UploadCloud className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate text-slate-600">
                      {profileForm.id_proof_image ? 'Document Uploaded ✓' : 'Upload ID Document'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setProfileForm(f => ({ ...f, id_proof_image: ev.target.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 6. Bank Details & Direct Payout Settings */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-600" /> Bank Payout Account &amp; UPI Details
                </h3>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  Direct Daily Settlements
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India / HDFC Bank"
                    value={profileForm.bank_name}
                    onChange={e => setProfileForm(f => ({ ...f, bank_name: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Holder Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={profileForm.bank_holder_name}
                    onChange={e => setProfileForm(f => ({ ...f, bank_holder_name: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Account Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 309182749102"
                      value={profileForm.bank_account_number}
                      onChange={e => setProfileForm(f => ({ ...f, bank_account_number: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs font-bold text-emerald-900"
                      required
                    />
                    {profileForm.bank_account_number && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(profileForm.bank_account_number, 'acc')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                        title="Copy Account Number"
                      >
                        {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank IFSC Code *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. SBIN0001234 / HDFC0000128"
                      value={profileForm.bank_ifsc}
                      onChange={e => setProfileForm(f => ({ ...f, bank_ifsc: e.target.value.toUpperCase() }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase text-xs font-bold text-blue-700"
                      required
                    />
                    {profileForm.bank_ifsc && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(profileForm.bank_ifsc, 'ifsc')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                        title="Copy IFSC"
                      >
                        {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">UPI ID for Instant Withdrawal Settlement *</label>
                <input
                  type="text"
                  placeholder="e.g. ramesh@okhdfc, 9876543210@paytm"
                  value={profileForm.upi_id}
                  onChange={e => {
                    setProfileForm(f => ({ ...f, upi_id: e.target.value }));
                    setUpiId(e.target.value);
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs font-bold text-emerald-700"
                  required
                />
              </div>
            </div>

            {/* 7. Address & Emergency Contact */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Permanent Residential Address &amp; Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="House / Street, Colony, Landmark"
                    value={profileForm.address}
                    onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Person &amp; Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Verma (Brother) - +91 98112 34567"
                    value={profileForm.emergency_contact}
                    onChange={e => setProfileForm(f => ({ ...f, emergency_contact: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {savingProfile ? 'Saving Changes to Cloud D1...' : 'Save Profile & KYC Details'}
              </button>
            </div>
          </form>
        )}

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Wallet Balance</div>
                <div className="kpi-value" style={{ color: '#059669' }}>₹{partnerBalance.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Completed Jobs Revenue</div>
                <div className="kpi-value">₹{earnings.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Pending / New Jobs</div>
                <div className="kpi-value" style={{ color: '#0079ff' }}>{pendingJobs.length}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Customer Rating</div>
                <div className="kpi-value" style={{ color: '#f59e0b' }}>★ {partner.rating}</div>
              </div>
            </div>

            {/* Quick Profile Summary Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {partner.profile_image ? (
                  <img src={partner.profile_image} alt={partner.name} className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500 shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
                    {partner.name ? partner.name[0] : 'P'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{partner.name}</h3>
                  <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
                    <span>{partner.phone}</span>
                    {partner.email && <span>• {partner.email}</span>}
                    <span>• 📍 PIN: {partner.pincode || '110016'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab('profile')}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <UserCheck className="w-4 h-4" /> View / Edit Profile &amp; KYC
                </button>
              </div>
            </div>

            {/* Pro Subscription Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: 16, padding: '24px 28px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>PRO PARTNER TIER</span>
                <h3 style={{ fontSize: '1.25rem', margin: '8px 0 4px' }}>0% Commission for Next 15 Jobs!</h3>
                <p style={{ fontSize: '0.84rem', opacity: 0.8 }}>Priority dispatch enabled in {partner.city} (PIN: {partner.pincode || '110016'}). Top placement in customer search.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>Active ✓</div>
                <div style={{ fontSize: '0.74rem', opacity: 0.7 }}>Valid till 31 Dec 2026</div>
              </div>
            </div>

            {/* Recent Jobs Table */}
            <div className="card">
              <h3 style={{ marginBottom: 12 }}>Assigned Jobs &amp; Orders</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Booking</th><th>Customer</th><th>Schedule</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id}>
                        <td><strong>#{b.booking_code}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <strong>{b.customer_name}</strong>
                            {Number(b.is_amc) === 1 && (
                              <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800 }}>
                                👑 VIP AMC
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', marginTop: 2 }}>
                            <a href={`tel:${b.customer_phone}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                              📞 {b.customer_phone}
                            </a>
                            {b.alternate_phone && (
                              <span style={{ color: 'var(--muted)', fontSize: '0.74rem', marginLeft: 6 }}>
                                Alt: {b.alternate_phone}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: 3, lineHeight: 1.3 }}>
                            📍 {b.address || 'Address provided'}
                            {b.landmark && <span style={{ color: '#0369a1', display: 'block' }}>Near: {b.landmark}</span>}
                            {b.pincode && <span style={{ color: '#334155', fontWeight: 700, display: 'inline-block', marginTop: 2 }}>📮 PIN: {b.pincode}</span>}
                          </div>
                        </td>
                        <td>{b.scheduled_date} @ {b.scheduled_slot}</td>
                        <td><strong>₹{b.total_amount}</strong></td>
                        <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                        <td>
                          {b.status === 'assigned' && <button className="btn btn-primary btn-sm" onClick={() => setOtpModalBooking(b)}>Start Job (OTP)</button>}
                          {b.status === 'in_progress' && <button className="btn btn-outline btn-sm" onClick={() => updateJobStatus(b.id, 'completed')}>Finish Job</button>}
                          {b.status === 'completed' && <span style={{ color: '#10b981', fontWeight: 700 }}>Done ✓</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* LIVE JOB RADAR TAB */}
        {tab === 'radar' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3>📡 Live Job Radar</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>
                  Listening for instant doorstep booking requests within 10 km of PIN {partner.pincode || '110016'} ({partner.city})...
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ecfdf5', color: '#047857', padding: '6px 14px', borderRadius: 999, fontWeight: 700, fontSize: '0.84rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Radar Active
              </div>
            </div>

            {incomingJob && (
              <div style={{ background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', marginBottom: 4 }}>⚡ NEW INCOMING REQUEST • 45s TIMEOUT</div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{incomingJob.title}</h4>
                  <div style={{ fontSize: '0.88rem', color: '#334155', marginTop: 4 }}>
                    📍 {incomingJob.customer} • <strong>{incomingJob.distance}</strong>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginTop: 6 }}>
                    Estimated Payout: ₹{incomingJob.amount}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => { setIncomingJob(null); alert('Job passed to next available pro.'); }}>Decline</button>
                  <button className="btn btn-primary" onClick={() => { alert('Job Accepted! Customer notified that you are On The Way.'); setIncomingJob(null); }}>Accept Job (₹{incomingJob.amount})</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOBS TAB */}
        {tab === 'jobs' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0 }}>All Job Requests &amp; Doorstep Dispatches</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '4px 0 0' }}>Assign field staff servicemen and navigate to doorstep locations with live GPS coordinates.</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => setTab('servicemen')}>
                  <Users size={14} /> Manage Crew ({servicemen.length})
                </button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Customer &amp; Location</th>
                    <th>Items</th>
                    <th>Assigned Service Man</th>
                    <th>Schedule</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>#{b.booking_code}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong>{b.customer_name}</strong>
                          {Number(b.is_amc) === 1 && (
                            <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800 }}>
                              👑 VIP AMC
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: 2 }}>
                          <a href={`tel:${b.customer_phone}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                            📞 {b.customer_phone}
                          </a>
                          {b.alternate_phone && (
                            <span style={{ color: 'var(--muted)', fontSize: '0.74rem', marginLeft: 6 }}>
                              Alt: {b.alternate_phone}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: 3, lineHeight: 1.3 }}>
                          📍 {b.address || 'Address provided'}
                          {b.landmark && <span style={{ color: '#0369a1', display: 'block' }}>Near: {b.landmark}</span>}
                          {b.pincode && <span style={{ color: '#334155', fontWeight: 700, display: 'inline-block', marginTop: 2 }}>📮 PIN: {b.pincode}</span>}
                        </div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat || 28.6139},${b.lng || 77.2090}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              border: '1px solid #bfdbfe'
                            }}
                          >
                            <Navigation size={12} /> 🗺️ Live Google Maps &rarr;
                          </a>
                          <button
                            type="button"
                            onClick={() => setNavModalBooking(b)}
                            style={{
                              background: '#f8fafc',
                              color: '#475569',
                              border: '1px solid #cbd5e1',
                              padding: '3px 7px',
                              borderRadius: 6,
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            📍 Preview
                          </button>
                        </div>
                      </td>
                      <td>{(b.items || []).map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td>
                        {b.serviceman_name ? (
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 10px', borderRadius: 8 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: 4 }}>
                              👷‍♂️ {b.serviceman_name}
                            </div>
                            {b.serviceman_phone && (
                              <div style={{ fontSize: '0.72rem', color: '#15803d', fontFamily: 'monospace' }}>
                                📞 {b.serviceman_phone}
                              </div>
                            )}
                            <button
                              onClick={() => setAssignModalBooking(b)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0079ff',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: 0,
                                marginTop: 3,
                                textDecoration: 'underline'
                              }}
                            >
                              Re-assign &rarr;
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => setAssignModalBooking(b)}
                              style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                            >
                              + Assign Service Man
                            </button>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>Self or crew staff</div>
                          </div>
                        )}
                      </td>
                      <td>{b.scheduled_date}<br /><span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{b.scheduled_slot}</span></td>
                      <td><strong>₹{b.total_amount}</strong></td>
                      <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                      <td>
                        {b.status === 'assigned' && <button className="btn btn-primary btn-sm" onClick={() => setOtpModalBooking(b)}>Start Job (OTP)</button>}
                        {b.status === 'in_progress' && <button className="btn btn-outline btn-sm" onClick={() => updateJobStatus(b.id, 'completed')}>Mark Completed</button>}
                        {b.status === 'completed' && <span style={{ color: '#10b981', fontWeight: 700 }}>Completed ✓</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: SERVICE MEN (FIELD CREW) MANAGEMENT
            ========================================== */}
        {tab === 'servicemen' && (
          <div className="space-y-5">
            {/* Header with Title, Search & Add Button */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  My Service Men &amp; Field Crew
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {servicemen.length} Onboarded
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register your field technicians, assign them incoming orders, track their live duty status and performance.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search name, phone, trade..."
                  value={smSearch}
                  onChange={e => setSmSearch(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.8rem',
                    width: 220
                  }}
                />
                <button
                  onClick={() => setShowAddSmModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 transition flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" /> + Onboard New Service Man
                </button>
              </div>
            </div>

            {/* Crew KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Crew Staff</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{servicemen.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">Under your provider agency</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active On Duty</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {servicemen.filter(s => s.is_available).length}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-0.5">Ready to receive jobs</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jobs Delivered by Crew</div>
                <div className="text-2xl font-black text-blue-600 mt-1">
                  {servicemen.reduce((s, sm) => s + (Number(sm.jobs_completed) || 0), 0)}
                </div>
                <div className="text-xs text-blue-600 font-semibold mt-0.5">Verified customer completions</div>
              </div>
            </div>

            {/* Servicemen Directory Cards */}
            {servicemen.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">No Service Men Added Yet</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Add technicians who work under your agency so you can assign incoming doorstep jobs to them.
                </p>
                <button
                  onClick={() => setShowAddSmModal(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition inline-flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" /> Add Your First Service Man
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicemen
                  .filter(sm => {
                    if (!smSearch) return true;
                    const q = smSearch.toLowerCase();
                    return sm.name.toLowerCase().includes(q) || sm.phone.includes(q) || (sm.specialty && sm.specialty.toLowerCase().includes(q));
                  })
                  .map(sm => (
                    <div key={sm.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {sm.profile_image ? (
                            <img src={sm.profile_image} alt={sm.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-base border border-emerald-200">
                              {sm.name ? sm.name.slice(0, 2).toUpperCase() : 'SM'}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{sm.name}</h4>
                            <div className="text-[11px] font-bold text-blue-600 mt-0.5">{sm.specialty}</div>
                            <div className="text-[10px] text-slate-500 font-mono">📍 PIN: {sm.pincode || partner.pincode || '110016'}</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          ⭐ {sm.rating || 4.9}
                        </span>
                      </div>

                      {/* Contact details */}
                      <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <a href={`tel:${sm.phone}`} className="font-mono font-bold text-slate-800 hover:text-blue-600">
                            📞 {sm.phone}
                          </a>
                        </div>
                        {sm.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Gmail:</span>
                            <span className="text-slate-700 truncate max-w-[170px]">{sm.email}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Jobs Delivered:</span>
                          <span className="font-bold text-emerald-600">{sm.jobs_completed || 0} completed</span>
                        </div>
                      </div>

                      {/* KYC Verification Badges */}
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          ✓ Aadhaar: ••• {sm.aadhaar_number ? sm.aadhaar_number.slice(-4) : 'Verified'}
                        </span>
                        <span className="px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ {sm.bank_name ? sm.bank_name.split(' ')[0] : 'Bank'} Acc
                        </span>
                      </div>

                      {/* Actions: Duty toggle & Delete */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => toggleSmDuty(sm)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            sm.is_available
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${sm.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {sm.is_available ? 'Duty: ON' : 'Duty: OFF'}
                        </button>
                        <button
                          onClick={() => deleteSm(sm.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* PARTNER WALLET & WITHDRAWAL */}
        {tab === 'wallet' && (
          <div className="card" style={{ maxWidth: 750 }}>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: 16, padding: 28, color: '#fff', marginBottom: 24 }}>
              <div style={{ fontSize: '0.84rem', opacity: 0.85 }}>Available Withdrawal Balance</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, margin: '6px 0' }}>₹{partnerBalance.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Daily instant payout settlements available directly to your registered UPI ID and Bank Account.</div>
            </div>

            {/* Verified Payout Bank Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{partner.bank_name || 'State Bank of India'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Acc: •••• {partner.bank_account_number ? partner.bank_account_number.slice(-4) : '7291'} • IFSC: {partner.bank_ifsc || 'SBIN0001234'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setTab('profile')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Change Bank &rarr;
              </button>
            </div>

            <h3 style={{ marginBottom: 14 }}>Request Payout to Bank / UPI</h3>
            <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div className="form-group">
                <label>Withdrawal Amount (₹)</label>
                <input type="number" required value={withdrawAmt} onChange={e => setWithdrawAmt(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Settlement UPI ID / VPA</label>
                <input required value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="e.g. yourname@okhdfc" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', padding: '10px 20px' }}>
                Withdraw ₹{withdrawAmt} Instantly
              </button>
            </form>

            <h4 style={{ marginBottom: 10 }}>Settlement History</h4>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Amount</th><th>Date</th><th>Account</th><th>Status</th></tr></thead>
                <tbody>
                  {withdrawHistory.map(w => (
                    <tr key={w.id}>
                      <td><strong>{w.id}</strong></td>
                      <td><strong>₹{w.amount}</strong></td>
                      <td>{w.date}</td>
                      <td><code>{w.upi}</code></td>
                      <td><span className={`badge ${w.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>{w.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKING HOURS SCHEDULE */}
        {tab === 'schedule' && (
          <div className="card" style={{ maxWidth: 650 }}>
            <h3 style={{ marginBottom: 14 }}>Weekly Working Hours &amp; Availability</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: 16 }}>Set your open hours for automatic job dispatching.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {schedule.map((item, idx) => (
                <div key={item.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="checkbox" checked={item.active} onChange={() => {
                      const upd = [...schedule];
                      upd[idx].active = !upd[idx].active;
                      setSchedule(upd);
                    }} />
                    <strong>{item.day}</strong>
                  </div>
                  <span style={{ fontSize: '0.86rem', color: item.active ? '#0d0d0d' : 'var(--muted)' }}>{item.active ? item.hours : 'Closed'}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => alert('Working schedule saved!')} style={{ marginTop: 16, width: 'fit-content' }}>
              Save Working Hours
            </button>
          </div>
        )}

        {/* CUSTOMER REVIEWS & REPLY */}
        {tab === 'reviews' && (
          <div className="card" style={{ maxWidth: 700 }}>
            <h3 style={{ marginBottom: 14 }}>Customer Ratings &amp; Reviews</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map(rev => (
                <div key={rev.id} style={{ background: '#f8fafc', borderRadius: 14, padding: 18, border: '1.5px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong>{rev.customer}</strong>
                    <span style={{ color: '#f59e0b', fontWeight: 800 }}>{'★'.repeat(rev.rating)}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: 10 }}>"{rev.text}"</p>
                  {rev.reply ? (
                    <div style={{ background: '#e0f2fe', borderRadius: 10, padding: 10, fontSize: '0.84rem', color: '#0369a1' }}>
                      <strong>Your Reply:</strong> {rev.reply}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <input placeholder="Write official reply to customer..." value={replyInput} onChange={e => setReplyInput(e.target.value)} style={{ flex: 1, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.84rem' }} />
                      <button className="btn btn-primary btn-sm" onClick={() => submitReply(rev.id)}>Reply</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES CATALOG TAB */}
        {tab === 'services' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Platform Services in Your Category</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Service Name</th><th>Category</th><th>Rate (₹)</th><th>Warranty</th></tr></thead>
                <tbody>
                  {services.filter(s => s.category_name === partner.specialty).map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.category_name}</td>
                      <td><strong>₹{s.price}</strong></td>
                      <td>{s.warranty_days} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OTP Modal */}
        {otpModalBooking && (
          <div className="modal-bg" onClick={() => setOtpModalBooking(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, padding: 24, textAlign: 'center' }}>
              <h3>Enter Customer OTP</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '8px 0 16px' }}>Ask customer for the 4-digit start OTP sent on their mobile.</p>
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                placeholder="e.g. 1234"
                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, letterSpacing: 8, padding: 10, borderRadius: 10, border: '2px solid #0079ff', width: '100%', marginBottom: 16 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className="btn btn-outline" onClick={() => setOtpModalBooking(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => verifyOtpAndStart(otpModalBooking.id)}>Verify &amp; Start</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ASSIGN SERVICE MAN TO BOOKING */}
        {assignModalBooking && (
          <div className="modal-bg" onClick={() => setAssignModalBooking(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Assign Field Service Man</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '4px 0 0' }}>
                    Order #{assignModalBooking.booking_code} • {assignModalBooking.customer_name} ({assignModalBooking.address || assignModalBooking.city})
                  </p>
                </div>
                <button onClick={() => setAssignModalBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>Currently Assigned:</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: assignModalBooking.serviceman_name ? '#166534' : '#0079ff' }}>
                  {assignModalBooking.serviceman_name ? `👷‍♂️ ${assignModalBooking.serviceman_name} (${assignModalBooking.serviceman_phone || ''})` : `Direct Partner (${partner.name})`}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                  Select Crew Technician to Dispatch:
                </label>
                {servicemen.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 16, background: '#f1f5f9', borderRadius: 12 }}>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>No service men added to your agency yet.</p>
                    <button
                      type="button"
                      onClick={() => { setAssignModalBooking(null); setShowAddSmModal(true); }}
                      style={{ marginTop: 8, padding: '6px 12px', background: '#0079ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Service Man Now
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
                    {/* Option to assign to self */}
                    <div
                      onClick={() => handleAssignServiceman(assignModalBooking.id, { id: partner.id, name: `${partner.name} (Self)`, phone: partner.phone })}
                      style={{
                        padding: '10px 14px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: '#ffffff',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', color: '#0079ff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                          ME
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{partner.name} (Direct Partner Dispatch)</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Handle directly without field crew</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0079ff' }}>Assign &rarr;</span>
                    </div>

                    {servicemen.map(sm => (
                      <div
                        key={sm.id}
                        onClick={() => handleAssignServiceman(assignModalBooking.id, sm)}
                        style={{
                          padding: '10px 14px',
                          border: assignModalBooking.serviceman_id === sm.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: assignModalBooking.serviceman_id === sm.id ? '#f0fdf4' : '#ffffff'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {sm.profile_image ? (
                            <img src={sm.profile_image} alt={sm.name} style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ecfdf5', color: '#047857', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                              {sm.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                              {sm.name} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>({sm.specialty})</span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              📞 {sm.phone} • 📍 PIN: {sm.pincode || partner.pincode || '110016'} • {sm.is_available ? '🟢 On Duty' : '⚪ Offline'}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{
                            padding: '6px 12px',
                            background: assignModalBooking.serviceman_id === sm.id ? '#10b981' : '#0079ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {assignModalBooking.serviceman_id === sm.id ? 'Assigned ✓' : 'Dispatch Staff'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn btn-outline" onClick={() => setAssignModalBooking(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD SERVICE MAN ONBOARDING */}
        {showAddSmModal && (
          <div className="modal-bg" onClick={() => setShowAddSmModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 650, padding: 26, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={20} color="#059669" /> Onboard Service Man to Your Crew
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '4px 0 0' }}>
                    Enter personal, verification, operating area PIN, and payout details for your staff.
                  </p>
                </div>
                <button onClick={() => setShowAddSmModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddServiceman} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Photo Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f8fafc', padding: 12, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                  {smForm.profile_image ? (
                    <img src={smForm.profile_image} alt="Preview" style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover', border: '2px solid #0079ff' }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: '#ecfdf5', color: '#047857', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', border: '2px dashed #a7f3d0' }}>
                      <Camera size={18} />
                      Photo
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      Technician Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setSmForm(f => ({ ...f, profile_image: ev.target.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ fontSize: '0.76rem' }}
                    />
                  </div>
                </div>

                {/* Identity Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Full Name *</label>
                    <input
                      required
                      value={smForm.name}
                      onChange={e => setSmForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Deepak Verma"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Mobile Number *</label>
                    <input
                      required
                      value={smForm.phone}
                      onChange={e => setSmForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. +91 98765 11223"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Gmail / Email</label>
                    <input
                      type="email"
                      value={smForm.email}
                      onChange={e => setSmForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="e.g. deepak@gmail.com"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Specialty, City & Pincode */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Trade Specialty</label>
                    <select
                      value={smForm.specialty}
                      onChange={e => setSmForm(f => ({ ...f, specialty: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    >
                      {SPECIALTIES.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Operating City</label>
                    <select
                      value={smForm.city}
                      onChange={e => setSmForm(f => ({ ...f, city: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Area Pin Code *</label>
                    <input
                      required
                      maxLength={6}
                      value={smForm.pincode}
                      onChange={e => setSmForm(f => ({ ...f, pincode: e.target.value.replace(/[^0-9]/g, '') }))}
                      placeholder="e.g. 110016"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, color: '#0079ff' }}
                    />
                  </div>
                </div>

                {/* Aadhaar & KYC */}
                <div style={{ background: '#faf5ff', border: '1px solid #f3e8ff', borderRadius: 14, padding: 12 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6b21a8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} /> Aadhaar KYC &amp; Verification
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>12-Digit Aadhaar Number</label>
                      <input
                        maxLength={14}
                        value={smForm.aadhaar_number}
                        onChange={e => setSmForm(f => ({ ...f, aadhaar_number: e.target.value }))}
                        placeholder="e.g. 9812 8491 0021"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Experience (Years)</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={smForm.experience_years}
                        onChange={e => setSmForm(f => ({ ...f, experience_years: +e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bank / Payout details */}
                <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 14, padding: 12 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Landmark size={16} /> Bank Payout &amp; UPI Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Bank Name</label>
                      <input
                        value={smForm.bank_name}
                        onChange={e => setSmForm(f => ({ ...f, bank_name: e.target.value }))}
                        placeholder="State Bank of India"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Bank Account Number</label>
                      <input
                        value={smForm.bank_account_number}
                        onChange={e => setSmForm(f => ({ ...f, bank_account_number: e.target.value }))}
                        placeholder="Account number"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Bank IFSC</label>
                      <input
                        value={smForm.bank_ifsc}
                        onChange={e => setSmForm(f => ({ ...f, bank_ifsc: e.target.value.toUpperCase() }))}
                        placeholder="SBIN0001234"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>UPI ID</label>
                      <input
                        value={smForm.upi_id}
                        onChange={e => setSmForm(f => ({ ...f, upi_id: e.target.value }))}
                        placeholder="serviceman@upi"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddSmModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669' }}>
                    Save &amp; Onboard Service Man
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: LIVE DOORSTEP MAP & DIRECTIONS PREVIEW */}
        {navModalBooking && (
          <div className="modal-bg" onClick={() => setNavModalBooking(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Navigation size={18} color="#0079ff" /> Doorstep Navigation
                </h3>
                <button onClick={() => setNavModalBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{navModalBooking.customer_name}</div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: 4, lineHeight: 1.4 }}>
                  📍 {navModalBooking.address || 'Address on file'}
                  {navModalBooking.landmark && <div style={{ color: '#0369a1' }}>Near: {navModalBooking.landmark}</div>}
                  {navModalBooking.pincode && <div style={{ fontWeight: 700, color: '#334155' }}>Area PIN: {navModalBooking.pincode}</div>}
                </div>
                <div style={{ marginTop: 8, fontSize: '0.74rem', color: '#64748b', fontFamily: 'monospace' }}>
                  GPS Coordinates: {navModalBooking.lat || 28.6139}, {navModalBooking.lng || 77.2090}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${navModalBooking.lat || 28.6139},${navModalBooking.lng || 77.2090}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    background: '#0079ff',
                    color: '#fff',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0, 121, 255, 0.25)'
                  }}
                >
                  <Navigation size={18} /> Open Turn-by-Turn in Google Maps &rarr;
                </a>
                <button className="btn btn-outline" onClick={() => setNavModalBooking(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
