import { useEffect, useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, RefreshCw, CheckCircle,
  XCircle, ExternalLink, LogOut, Briefcase, Play, CheckCheck,
  Wallet, Star, Clock, MapPin, Shield, DollarSign, Bell, Send,
  Radio, Award, AlertCircle, ArrowUpRight
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

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
  const [tab, setTab] = useState('overview'); // overview, radar, jobs, wallet, schedule, reviews, services
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

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

  const loadData = async (currentPartner = partner) => {
    const [techs, srvs] = await Promise.all([
      fetch(`${API}/api/technicians`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/services`).then(r => r.json()).catch(() => [])
    ]);
    setPartnersList(techs);
    setServices(srvs);

    if (currentPartner) {
      const bks = await fetch(`${API}/api/bookings?technicianId=${encodeURIComponent(currentPartner.id)}`).then(r => r.json()).catch(() => []);
      setBookings(bks);
      const updatedMe = techs.find(t => t.id === currentPartner.id);
      if (updatedMe) {
        setPartner(updatedMe);
        localStorage.setItem('hs_partner', JSON.stringify(updatedMe));
      }
    }
  };

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  const loginPartner = async (phoneOrId) => {
    const res = await fetch(`${API}/api/partner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneOrId })
    });
    if (res.ok) {
      const p = await res.json();
      setPartner(p);
      localStorage.setItem('hs_partner', JSON.stringify(p));
      loadData(p);
    } else {
      alert('Partner not found! Try 1-Click Demo Partner Login below.');
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

  if (!partner) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        background: 'linear-gradient(120deg, rgba(15,23,42,0.72) 0%, rgba(0,121,255,0.45) 100%), url(/images/laptop.jpg) center/cover no-repeat',
        padding: '28px 5vw',
        fontFamily: 'Nunito, "Segoe UI", sans-serif'
      }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 32, width: '100%', maxWidth: 430, boxShadow: '0 20px 50px rgba(0,0,0,0.28)' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#0079ff', color: '#fff', display: 'inline-grid', placeItems: 'center', fontWeight: 800, fontSize: '1.25rem', marginBottom: 8 }}>FH</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d0d0d' }}>FixoHub Partner</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Provider &amp; Technician Portal</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); loginPartner(phoneInput); }} className="form-grid">
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Email or Phone number</label>
            <input required value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="Email or phone" />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, borderRadius: 8, background: '#0079ff' }}>
              Log in to Partner Portal &rarr;
            </button>
          </form>

          <div style={{ marginTop: 14, background: '#0079ff', color: '#fff', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, marginBottom: 6 }}>DEMO PARTNER LOGINS (1-CLICK)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {partnersList.slice(0, 4).map(p => (
                <button key={p.id} type="button" onClick={() => loginPartner(p.id)} style={{ background: '#fff', color: '#0079ff', border: 'none', borderRadius: 6, padding: '7px 10px', fontWeight: 700, fontSize: '0.78rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.name} ({p.specialty})</span>
                  <span>Login &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const earnings = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.total_amount, 0);
  const pendingJobs = bookings.filter(b => ['pending', 'assigned'].includes(b.status));

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon" style={{ background: '#0079ff' }}>FH</div>
          <div>
            <div style={{ fontWeight: 800 }}>{partner.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>{partner.specialty}</div>
          </div>
        </div>

        <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <LayoutDashboard size={18} /> Dashboard
        </button>
        <button className={`nav-btn ${tab === 'radar' ? 'active' : ''}`} onClick={() => setTab('radar')}>
          <Radio size={18} /> Live Job Radar
        </button>
        <button className={`nav-btn ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>
          <CalendarCheck size={18} /> My Jobs ({bookings.length})
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
        <div className="topbar">
          <div>
            <h1 style={{ textTransform: 'capitalize' }}>{tab}</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>{partner.city} • Rating ★ {partner.rating}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={toggleAvailability}>
              {partner.is_available ? <><CheckCircle size={15} color="#10b981" /> Duty: ONLINE</> : <><XCircle size={15} color="#ef4444" /> Duty: OFFLINE</>}
            </button>
            <button className="btn btn-primary" onClick={() => loadData(partner)}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

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

            {/* Pro Subscription Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: 16, padding: '24px 28px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>PRO PARTNER TIER</span>
                <h3 style={{ fontSize: '1.25rem', margin: '8px 0 4px' }}>0% Commission for Next 15 Jobs!</h3>
                <p style={{ fontSize: '0.84rem', opacity: 0.8 }}>Priority dispatch enabled in {partner.city}. Top placement in customer search.</p>
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
                        <td>{b.customer_name} ({b.customer_phone})<br /><span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{b.address}</span></td>
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

        {/* LIVE JOB RADAR TAB (NEW) */}
        {tab === 'radar' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3>📡 Live Job Radar</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>Listening for instant doorstep booking requests within 10 km...</p>
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
            <h3 style={{ marginBottom: 14 }}>All Job Requests</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Booking</th><th>Customer</th><th>Items</th><th>Schedule</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>#{b.booking_code}</strong></td>
                      <td><strong>{b.customer_name}</strong><br />{b.customer_phone}<br /><span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{b.address}</span></td>
                      <td>{(b.items || []).map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
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

        {/* PARTNER WALLET & WITHDRAWAL (NEW) */}
        {tab === 'wallet' && (
          <div className="card" style={{ maxWidth: 700 }}>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: 16, padding: 28, color: '#fff', marginBottom: 24 }}>
              <div style={{ fontSize: '0.84rem', opacity: 0.85 }}>Available Withdrawal Balance</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, margin: '6px 0' }}>₹{partnerBalance.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Daily instant payout settlements available directly to your UPI ID.</div>
            </div>

            <h3 style={{ marginBottom: 14 }}>Request Payout to Bank / UPI</h3>
            <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div className="form-group">
                <label>Withdrawal Amount (₹)</label>
                <input type="number" required value={withdrawAmt} onChange={e => setWithdrawAmt(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Your UPI ID / VPA</label>
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

        {/* WORKING HOURS SCHEDULE (NEW) */}
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

        {/* CUSTOMER REVIEWS & REPLY (NEW) */}
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
      </main>
    </div>
  );
}
