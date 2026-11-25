import { useEffect, useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, Users, Plus, RefreshCw, Trash2,
  CheckCircle, XCircle, ExternalLink, LogOut, Tag, MessageSquare, CreditCard,
  FileText, Layers, Settings, Send, ShieldCheck, DollarSign, UserCheck, Bell,
  AlertTriangle, Check, Ban, Search, Download
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';
const STATUSES = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('hs_admin_auth') === '1');
  const [loginPhone, setLoginPhone] = useState('+91 9876543210');
  const [loginPass, setLoginPass] = useState('12345678');
  const [tab, setTab] = useState('overview'); // overview, bookings, requests, services, categories, technicians, kyc, payouts, customers, transactions, promos, broadcast, chats, settings
  const [revMode, setRevMode] = useState('Total');

  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [requests, setRequests] = useState([]);
  const [promos, setPromos] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chats, setChats] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // KYC Verification state
  const [kycList, setKycList] = useState([
    { id: 'kyc-1', name: 'Electric (Ramesh Kumar)', phone: '+91 98765 43210', docType: 'Aadhaar + ITI Electrical', status: 'Verified', date: '2026-11-20' },
    { id: 'kyc-2', name: 'PlumbService Pvt Ltd', phone: '+91 98111 22334', docType: 'GSTIN + Trade License', status: 'Verified', date: '2026-11-22' },
    { id: 'kyc-3', name: 'Vikram Sharma (AC Tech)', phone: '+91 98234 56789', docType: 'Aadhaar Card + Experience Cert', status: 'Pending', date: '2026-11-25' },
    { id: 'kyc-4', name: 'SmartClean Solutions', phone: '+91 99876 54321', docType: 'Company Registration Certificate', status: 'Pending', date: '2026-11-25' }
  ]);

  // Partner Payouts state
  const [payouts, setPayouts] = useState([
    { id: 'pay-1', provider: 'Electric', amount: 4850, upi: 'electric@okhdfcbank', status: 'Pending', jobs: 24, date: '2026-11-25' },
    { id: 'pay-2', provider: 'PlumbService Pvt Ltd', amount: 8200, upi: 'plumb@icici', status: 'Settled', jobs: 38, date: '2026-11-23' },
    { id: 'pay-3', provider: 'World Clean Pvt. Ltd.', amount: 11400, upi: 'clean@paytm', status: 'Settled', jobs: 52, date: '2026-11-21' }
  ]);

  // Customers state
  const [customers, setCustomers] = useState([
    { id: 'cust-1', name: 'Rahul Sharma', phone: '+91 98765 43210', city: 'Delhi NCR', orders: 8, spend: 6499, status: 'Active' },
    { id: 'cust-2', name: 'Aditya Vekariya', phone: '+91 98112 33445', city: 'Pune', orders: 12, spend: 14200, status: 'Active' },
    { id: 'cust-3', name: 'Priya Nair', phone: '+91 99223 44556', city: 'Mumbai', orders: 5, spend: 4890, status: 'Active' },
    { id: 'cust-4', name: 'Amit Singh', phone: '+91 97334 55667', city: 'Bengaluru', orders: 9, spend: 8900, status: 'Active' },
    { id: 'cust-5', name: 'Spam User', phone: '+91 90000 00000', city: 'Delhi NCR', orders: 0, spend: 0, status: 'Banned' }
  ]);

  // Broadcast Banner state
  const [broadcastMsg, setBroadcastMsg] = useState('🔥 Flash Deal: 50% OFF with code FIXO50 on all AC & Home Deep Cleaning services this week!');
  const [isBroadcastActive, setIsBroadcastActive] = useState(true);

  // System Settings state
  const [platformCommission, setPlatformCommission] = useState(15);
  const [expressDeliveryFee, setExpressDeliveryFee] = useState(149);
  const [taxPercent, setTaxPercent] = useState(18);

  const [showSrvModal, setShowSrvModal] = useState(false);
  const [srvForm, setSrvForm] = useState({
    category_id: 'cat-home', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '', image_url: ''
  });

  const [showTechModal, setShowTechModal] = useState(false);
  const [techForm, setTechForm] = useState({
    name: '', phone: '', specialty: 'Electronic Services', city: 'Delhi NCR'
  });

  const [promoForm, setPromoForm] = useState({ code: '', discount_percent: 25, min_order: 299, max_discount: 500 });
  const [replyText, setReplyText] = useState('');

  const fetchAll = async () => {
    const [st, bk, sr, ct, tc, rq, pr, tx, ch] = await Promise.all([
      fetch(`${API}/api/stats`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/bookings`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/services?all=1`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/categories`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/technicians`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/requests`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/promocodes`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/transactions`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/chats`).then(r => r.json()).catch(() => [])
    ]);
    setStats(st);
    setBookings(bk);
    setServices(sr);
    setCategories(ct);
    setTechnicians(tc);
    setRequests(rq);
    setPromos(pr);
    setTransactions(tx);
    setChats(ch);
  };

  useEffect(() => {
    fetchAll().catch(console.error);
  }, []);

  const updateBooking = async (id, patch) => {
    await fetch(`${API}/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    fetchAll();
  };

  const toggleService = async (srv) => {
    await fetch(`${API}/api/services/${srv.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: srv.is_active ? 0 : 1 })
    });
    fetchAll();
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    await fetch(`${API}/api/services/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const createService = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...srvForm,
        image_url: srvForm.image_url || 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=500&q=80',
        includes: srvForm.includes.split(',').map(s => s.trim()).filter(Boolean)
      })
    });
    setShowSrvModal(false);
    setSrvForm({ category_id: 'cat-home', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '', image_url: '' });
    fetchAll();
  };

  const toggleTechnician = async (tech) => {
    await fetch(`${API}/api/technicians/${tech.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: !tech.is_available })
    });
    fetchAll();
  };

  const createTechnician = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/technicians`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(techForm)
    });
    setShowTechModal(false);
    setTechForm({ name: '', phone: '', specialty: 'Electronic Services', city: 'Delhi NCR' });
    fetchAll();
  };

  const addPromo = async (e) => {
    e.preventDefault();
    if (!promoForm.code) return;
    await fetch(`${API}/api/promocodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promoForm)
    });
    setPromoForm({ code: '', discount_percent: 25, min_order: 299, max_discount: 500 });
    fetchAll();
  };

  const deletePromo = async (id) => {
    await fetch(`${API}/api/promocodes/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const approveKyc = (id) => {
    setKycList(kycList.map(k => k.id === id ? { ...k, status: 'Verified' } : k));
    alert('Provider KYC verified and activated successfully!');
  };

  const settlePayout = (id) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Settled' } : p));
    alert('Payout transferred via Bank/UPI settlement!');
  };

  const toggleCustomerBan = (id) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Banned' : 'Active' } : c));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('hs_admin_auth', '1');
    setAuthed(true);
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        background: 'linear-gradient(120deg, rgba(15,23,42,0.72) 0%, rgba(0,121,255,0.45) 100%), url(/images/ac.jpg) center/cover no-repeat',
        padding: '28px 5vw', fontFamily: 'Nunito, "Segoe UI", sans-serif'
      }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 20px 50px rgba(0,0,0,0.28)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#0079ff', color: '#fff', display: 'inline-grid', placeItems: 'center', fontWeight: 800, fontSize: '1.25rem', marginBottom: 8 }}>FH</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d0d0d' }}>FixoHub</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Super Admin Portal</p>
          </div>
          <form onSubmit={handleLogin} className="form-grid">
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Phone Number</label>
            <input required value={loginPhone} onChange={e => setLoginPhone(e.target.value)} />
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Password</label>
            <input required type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, borderRadius: 8, background: '#0079ff' }}>
              Log in to Super Admin &rarr;
            </button>
          </form>
          <div style={{ marginTop: 16, background: '#0079ff', color: '#fff', borderRadius: 8, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 800 }}>DEMO CREDENTIALS</div>
              <div>Mobile: +91 9876543210 | Pass: 12345678</div>
            </div>
            <button type="button" onClick={handleLogin} style={{ background: '#fff', color: '#0079ff', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, fontSize: '0.76rem' }}>
              Auto Fill
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">FH</div>
          <div>
            <div style={{ color: '#0d0d0d', fontWeight: 800 }}>FixoHub</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Super Admin</div>
          </div>
        </div>

        <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <LayoutDashboard size={17} /> Dashboard
        </button>

        <div className="sidebar-group">Operations & Dispatch</div>
        <button className={`nav-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
          <CalendarCheck size={17} /> Live Dispatch ({bookings.length})
        </button>
        <button className={`nav-btn ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
          <FileText size={17} /> Custom Requests ({requests.length})
        </button>

        <div className="sidebar-group">Provider & Finance</div>
        <button className={`nav-btn ${tab === 'technicians' ? 'active' : ''}`} onClick={() => setTab('technicians')}>
          <Users size={17} /> Providers ({technicians.length})
        </button>
        <button className={`nav-btn ${tab === 'kyc' ? 'active' : ''}`} onClick={() => setTab('kyc')}>
          <ShieldCheck size={17} /> KYC Verification ({kycList.filter(k => k.status === 'Pending').length} Pending)
        </button>
        <button className={`nav-btn ${tab === 'payouts' ? 'active' : ''}`} onClick={() => setTab('payouts')}>
          <DollarSign size={17} /> Partner Payouts
        </button>
        <button className={`nav-btn ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>
          <CreditCard size={17} /> Transactions ({transactions.length})
        </button>

        <div className="sidebar-group">Catalog & Customers</div>
        <button className={`nav-btn ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
          <Wrench size={17} /> Services ({services.length})
        </button>
        <button className={`nav-btn ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>
          <Layers size={17} /> Categories ({categories.length})
        </button>
        <button className={`nav-btn ${tab === 'customers' ? 'active' : ''}`} onClick={() => setTab('customers')}>
          <UserCheck size={17} /> Customers ({customers.length})
        </button>

        <div className="sidebar-group">Marketing & Settings</div>
        <button className={`nav-btn ${tab === 'promos' ? 'active' : ''}`} onClick={() => setTab('promos')}>
          <Tag size={17} /> Promo Codes ({promos.length})
        </button>
        <button className={`nav-btn ${tab === 'broadcast' ? 'active' : ''}`} onClick={() => setTab('broadcast')}>
          <Bell size={17} /> Emergency Broadcast
        </button>
        <button className={`nav-btn ${tab === 'chats' ? 'active' : ''}`} onClick={() => setTab('chats')}>
          <MessageSquare size={17} /> Chat Logs ({chats.length})
        </button>
        <button className={`nav-btn ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
          <Settings size={17} /> Settings
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className="nav-btn" onClick={() => { localStorage.removeItem('hs_admin_auth'); setAuthed(false); }}><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <div>
            <h1 style={{ textTransform: 'capitalize' }}>{tab}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={fetchAll}><RefreshCw size={15} /> Refresh</button>
            {tab === 'services' && <button className="btn btn-primary" onClick={() => setShowSrvModal(true)}><Plus size={16} /> Add Service</button>}
            {tab === 'technicians' && <button className="btn btn-primary" onClick={() => setShowTechModal(true)}><Plus size={16} /> Add Provider</button>}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <>
            <div style={{ background: '#0079ff', color: '#fff', borderRadius: 12, padding: '22px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Super Admin Dashboard</div>
              <h2 style={{ fontSize: '1.45rem', margin: '4px 0' }}>FixoHub Platform Overview</h2>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Monitoring live bookings, partner payouts, and platform GMV.</div>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Gross Merchandise Value (GMV)</div>
                <div className="kpi-value">₹{(stats.totalRevenue || 54200).toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Admin Commission (15%)</div>
                <div className="kpi-value" style={{ color: '#059669' }}>₹{Math.round((stats.totalRevenue || 54200) * 0.15).toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Active Bookings</div>
                <div className="kpi-value">{bookings.length}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Verified Providers</div>
                <div className="kpi-value" style={{ color: '#10b981' }}>{technicians.length} Active</div>
              </div>
            </div>

            {/* Income Revenue Chart */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3>Revenue Performance</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Total GMV', 'Admin Commission', 'Partner Earnings'].map(m => (
                    <button key={m} className={`btn ${revMode === m ? 'btn-primary' : 'btn-outline'}`} onClick={() => setRevMode(m)}>{m}</button>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 600 130" style={{ width: '100%', height: 140 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0079ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0079ff" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d="M0,110 L60,105 L120,95 L180,98 L240,80 L300,30 L360,65 L420,55 L480,45 L540,25 L600,15 L600,130 L0,130 Z" fill="url(#revGrad)" />
                <path d="M0,110 L60,105 L120,95 L180,98 L240,80 L300,30 L360,65 L420,55 L480,45 L540,25 L600,15" fill="none" stroke="#0079ff" strokeWidth="3" />
              </svg>
            </div>
          </>
        )}

        {/* LIVE DISPATCH TAB */}
        {tab === 'bookings' && (
          <div className="card">
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['all', ...STATUSES].map(st => (
                <button key={st} className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter(st)} style={{ textTransform: 'capitalize' }}>{st.replace('_', ' ')}</button>
              ))}
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Booking ID</th><th>Customer</th><th>Services</th><th>Schedule</th><th>Amount</th><th>Assigned Pro</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>#{b.booking_code}</strong></td>
                      <td><strong>{b.customer_name}</strong><br /><span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{b.customer_phone}</span></td>
                      <td>{(b.items || []).map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td>{b.scheduled_date}<br /><span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{b.scheduled_slot}</span></td>
                      <td><strong>₹{b.total_amount}</strong></td>
                      <td>
                        <select className="inline-select" value={b.technician_id || ''} onChange={e => updateBooking(b.id, { technician_id: e.target.value, status: e.target.value ? 'assigned' : 'pending' })}>
                          <option value="">-- Unassigned --</option>
                          {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className="inline-select" value={b.status} onChange={e => updateBooking(b.id, { status: e.target.value })}>
                          {STATUSES.map(st => <option key={st} value={st}>{st.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KYC VERIFICATION TAB (NEW) */}
        {tab === 'kyc' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Provider KYC Verification Center</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: 16 }}>Verify identity documents, trade certifications, and police verification of onboarded technicians.</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Provider</th><th>Phone</th><th>Submitted Documents</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {kycList.map(k => (
                    <tr key={k.id}>
                      <td><strong>{k.name}</strong></td>
                      <td>{k.phone}</td>
                      <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{k.docType}</span></td>
                      <td>{k.date}</td>
                      <td><span className={`badge ${k.status === 'Verified' ? 'badge-completed' : 'badge-pending'}`}>{k.status}</span></td>
                      <td>
                        {k.status === 'Pending' ? (
                          <button className="btn btn-primary btn-sm" onClick={() => approveKyc(k.id)}>✓ Approve KYC</button>
                        ) : (
                          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem' }}>Verified ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PARTNER PAYOUTS TAB (NEW) */}
        {tab === 'payouts' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Partner Settlement &amp; Commission Payouts</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Payout ID</th><th>Provider</th><th>Jobs Completed</th><th>Payout Amount</th><th>UPI / Bank Details</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {payouts.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.id}</strong></td>
                      <td><strong>{p.provider}</strong></td>
                      <td>{p.jobs} jobs</td>
                      <td><strong style={{ fontSize: '1rem', color: '#059669' }}>₹{p.amount}</strong></td>
                      <td><code>{p.upi}</code></td>
                      <td><span className={`badge ${p.status === 'Settled' ? 'badge-completed' : 'badge-pending'}`}>{p.status}</span></td>
                      <td>
                        {p.status === 'Pending' ? (
                          <button className="btn btn-primary btn-sm" onClick={() => settlePayout(p.id)}>Settle to Bank</button>
                        ) : (
                          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem' }}>Settled ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB (NEW) */}
        {tab === 'customers' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Customer Directory &amp; Accounts</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Total Orders</th><th>Total Spend</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.phone}</td>
                      <td>{c.city}</td>
                      <td>{c.orders}</td>
                      <td><strong>₹{c.spend}</strong></td>
                      <td><span className={`badge ${c.status === 'Active' ? 'badge-completed' : 'badge-cancelled'}`}>{c.status}</span></td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleCustomerBan(c.id)}>
                          {c.status === 'Active' ? <><Ban size={12} color="#ef4444" /> Ban</> : <><Check size={12} color="#10b981" /> Unban</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMERGENCY BROADCAST TAB (NEW) */}
        {tab === 'broadcast' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Emergency Announcement &amp; Promotion Broadcast</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: 16 }}>Broadcast live announcement alerts to customer website and partner panels instantly.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 650 }}>
              <textarea rows={3} value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} style={{ padding: 12, borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '0.9rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="bc-active" checked={isBroadcastActive} onChange={e => setIsBroadcastActive(e.target.checked)} />
                <label htmlFor="bc-active" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Active &amp; Visible to All Users</label>
              </div>
              <button className="btn btn-primary" onClick={() => alert('Broadcast announcement updated live across the platform!')} style={{ width: 'fit-content' }}>
                Publish Broadcast
              </button>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {tab === 'services' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Warranty</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong><div style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.description}</div></td>
                      <td>{s.category_name}</td>
                      <td><strong>₹{s.price}</strong></td>
                      <td>{s.duration_mins}m</td>
                      <td>{s.warranty_days}d</td>
                      <td><button className="btn btn-outline" onClick={() => toggleService(s)}>{s.is_active ? <><CheckCircle size={14} color="#10b981" /> Active</> : <><XCircle size={14} color="#ef4444" /> Hidden</>}</button></td>
                      <td><button className="btn btn-danger" onClick={() => deleteService(s.id)}><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TECHNICIANS TAB */}
        {tab === 'technicians' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Provider</th><th>Phone</th><th>Specialty</th><th>City</th><th>Rating</th><th>Jobs</th><th>Duty Status</th></tr></thead>
                <tbody>
                  {technicians.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td><td>{t.phone}</td><td>{t.specialty}</td><td>{t.city}</td><td>★ {t.rating}</td><td>{t.jobs_completed}</td>
                      <td><button className="btn btn-outline" onClick={() => toggleTechnician(t)}>{t.is_available ? <><CheckCircle size={14} color="#10b981" /> Online</> : <><XCircle size={14} color="#ef4444" /> Offline</>}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROMOS TAB */}
        {tab === 'promos' && (
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Manage Promo Codes</h3>
            <form onSubmit={addPromo} style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <input required placeholder="CODE (e.g. SAVE30)" value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value })} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <input required type="number" placeholder="Discount %" value={promoForm.discount_percent} onChange={e => setPromoForm({ ...promoForm, discount_percent: e.target.value })} style={{ width: 120, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <input type="number" placeholder="Min Order ₹" value={promoForm.min_order} onChange={e => setPromoForm({ ...promoForm, min_order: e.target.value })} style={{ width: 130, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <button type="submit" className="btn btn-primary"><Plus size={15} /> Create Promo</button>
            </form>
            <table>
              <thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Max Discount</th><th>Action</th></tr></thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.code}</strong></td><td>{p.discount_percent}%</td><td>₹{p.min_order}</td><td>₹{p.max_discount}</td>
                    <td><button className="btn btn-danger" onClick={() => deletePromo(p.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div className="card" style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 16 }}>Platform Configuration &amp; Fees</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>Default Platform Commission (%)</label>
                <input type="number" value={platformCommission} onChange={e => setPlatformCommission(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>Express 30-Minute Dispatch Fee (₹)</label>
                <input type="number" value={expressDeliveryFee} onChange={e => setExpressDeliveryFee(+e.target.value)} />
              </div>
              <div className="form-group">
                <label>GST / Tax Rate (%)</label>
                <input type="number" value={taxPercent} onChange={e => setTaxPercent(+e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => alert('Platform settings saved successfully!')} style={{ width: 'fit-content' }}>
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Add Service Modal */}
        {showSrvModal && (
          <div className="modal-bg" onClick={() => setShowSrvModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add New Service</h3>
              <form className="form-grid" onSubmit={createService}>
                <select value={srvForm.category_id} onChange={e => setSrvForm({ ...srvForm, category_id: e.target.value })}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input required placeholder="Service Name" value={srvForm.name} onChange={e => setSrvForm({ ...srvForm, name: e.target.value })} />
                <textarea rows={2} placeholder="Description" value={srvForm.description} onChange={e => setSrvForm({ ...srvForm, description: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input required type="number" placeholder="Price (₹)" value={srvForm.price} onChange={e => setSrvForm({ ...srvForm, price: e.target.value })} />
                  <input type="number" placeholder="MRP (₹)" value={srvForm.original_price} onChange={e => setSrvForm({ ...srvForm, original_price: e.target.value })} />
                </div>
                <input placeholder="Unsplash Photo URL" value={srvForm.image_url} onChange={e => setSrvForm({ ...srvForm, image_url: e.target.value })} />
                <input placeholder="Includes (comma separated)" value={srvForm.includes} onChange={e => setSrvForm({ ...srvForm, includes: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}><button type="button" className="btn btn-outline" onClick={() => setShowSrvModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
              </form>
            </div>
          </div>
        )}

        {/* Add Provider Modal */}
        {showTechModal && (
          <div className="modal-bg" onClick={() => setShowTechModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add New Provider</h3>
              <form className="form-grid" onSubmit={createTechnician}>
                <input required placeholder="Full Name" value={techForm.name} onChange={e => setTechForm({ ...techForm, name: e.target.value })} />
                <input required placeholder="Phone (+91 ...)" value={techForm.phone} onChange={e => setTechForm({ ...techForm, phone: e.target.value })} />
                <input required placeholder="Specialty" value={techForm.specialty} onChange={e => setTechForm({ ...techForm, specialty: e.target.value })} />
                <input required placeholder="City" value={techForm.city} onChange={e => setTechForm({ ...techForm, city: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}><button type="button" className="btn btn-outline" onClick={() => setShowTechModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Add Provider</button></div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
