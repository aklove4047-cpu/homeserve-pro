import { useEffect, useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, Users, Plus, RefreshCw, Trash2,
  CheckCircle, XCircle, ExternalLink, LogOut, Tag, MessageSquare, CreditCard,
  FileText, Layers, Settings, Send
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';
const STATUSES = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('hs_admin_auth') === '1');
  const [loginPhone, setLoginPhone] = useState('+91 9876543210');
  const [loginPass, setLoginPass] = useState('12345678');
  const [tab, setTab] = useState('overview');
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

  const [showSrvModal, setShowSrvModal] = useState(false);
  const [srvForm, setSrvForm] = useState({
    category_id: 'cat-laptop', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: ''
  });

  const [showTechModal, setShowTechModal] = useState(false);
  const [techForm, setTechForm] = useState({
    name: '', phone: '', specialty: 'Laptop & Mobile', city: 'Delhi NCR'
  });

  const [promoForm, setPromoForm] = useState({ code: '', discount_percent: 25, min_order: 299, max_discount: 500 });
  const [replyText, setReplyText] = useState('');

  const fetchAll = async () => {
    const [st, bk, sr, ct, tc, rq, pr, tx, ch] = await Promise.all([
      fetch(`${API}/api/stats`).then(r => r.json()),
      fetch(`${API}/api/bookings`).then(r => r.json()),
      fetch(`${API}/api/services?all=1`).then(r => r.json()),
      fetch(`${API}/api/categories`).then(r => r.json()),
      fetch(`${API}/api/technicians`).then(r => r.json()),
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
        includes: srvForm.includes.split(',').map(s => s.trim()).filter(Boolean)
      })
    });
    setShowSrvModal(false);
    setSrvForm({ category_id: 'cat-laptop', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '' });
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
    setTechForm({ name: '', phone: '', specialty: 'Laptop & Mobile', city: 'Delhi NCR' });
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

  const sendAdminReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await fetch(`${API}/api/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partner_id: 'tech-1', partner_name: 'FixoHub Support', sender: 'partner', message: replyText.trim() })
    });
    setReplyText('');
    fetchAll();
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
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Home service • Admin Login</p>
          </div>
          <form onSubmit={handleLogin} className="form-grid">
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Phone Number</label>
            <input required value={loginPhone} onChange={e => setLoginPhone(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Password</label>
              <span style={{ fontSize: '0.78rem', color: '#0079ff', fontWeight: 600 }}>Forgot Password ?</span>
            </div>
            <input required type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, borderRadius: 8, background: '#0079ff' }}>
              Log in to Portal &rarr;
            </button>
          </form>
          <div style={{ textAlign: 'center', margin: '16px 0 10px', fontSize: '0.78rem', color: '#64748b' }}>Access other panels</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <a href="/partner/" className="btn btn-primary" style={{ justifyContent: 'center', textDecoration: 'none', background: '#0079ff', fontSize: '0.8rem' }}>Login as Provider</a>
            <a href="/" className="btn btn-outline" style={{ justifyContent: 'center', textDecoration: 'none', fontSize: '0.8rem' }}>Customer Site</a>
          </div>
          <div style={{ marginTop: 16, background: '#0079ff', color: '#fff', borderRadius: 8, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 800 }}>ADMIN LOGIN (DEMO)</div>
              <div>Mobile: +91 9876543210 | Pass: 12345678</div>
            </div>
            <button type="button" onClick={handleLogin} style={{ background: '#fff', color: '#0079ff', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, fontSize: '0.76rem' }}>
              Auto Login
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.74rem', color: '#94a3b8' }}>Copyright &copy; 2026 FixoHub. All rights reserved.</div>
        </div>
      </div>
    );
  }

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  return (
    <div className="layout">
      {/* White eDemand Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">FH</div>
          <div>
            <div style={{ color: '#0d0d0d' }}>FixoHub</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Home service</div>
          </div>
        </div>

        <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <LayoutDashboard size={17} /> Dashboard
        </button>

        <div className="sidebar-group">Booking Management</div>
        <button className={`nav-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
          <CalendarCheck size={17} /> Bookings ({bookings.length})
        </button>
        <button className={`nav-btn ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
          <FileText size={17} /> Custom Job Requests ({requests.length})
        </button>

        <div className="sidebar-group">Service Management</div>
        <button className={`nav-btn ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
          <Wrench size={17} /> Service List ({services.length})
        </button>
        <button className={`nav-btn ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>
          <Layers size={17} /> Categories ({categories.length})
        </button>

        <div className="sidebar-group">Provider &amp; Finance</div>
        <button className={`nav-btn ${tab === 'technicians' ? 'active' : ''}`} onClick={() => setTab('technicians')}>
          <Users size={17} /> Providers ({technicians.length})
        </button>
        <button className={`nav-btn ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>
          <CreditCard size={17} /> Transactions ({transactions.length})
        </button>

        <div className="sidebar-group">Promotions &amp; Support</div>
        <button className={`nav-btn ${tab === 'promos' ? 'active' : ''}`} onClick={() => setTab('promos')}>
          <Tag size={17} /> Promo Codes ({promos.length})
        </button>
        <button className={`nav-btn ${tab === 'chats' ? 'active' : ''}`} onClick={() => setTab('chats')}>
          <MessageSquare size={17} /> Chat ({chats.length})
        </button>
        <button className={`nav-btn ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
          <Settings size={17} /> System Settings
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="/" className="nav-btn" style={{ textDecoration: 'none' }}><ExternalLink size={16} /> Customer Website</a>
          <a href="/partner/" className="nav-btn" style={{ textDecoration: 'none' }}><ExternalLink size={16} /> Partner Panel</a>
          <button className="nav-btn" onClick={() => { localStorage.removeItem('hs_admin_auth'); setAuthed(false); }}><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <h1>
              {tab === 'overview' && 'Dashboard'}
              {tab === 'bookings' && 'Bookings'}
              {tab === 'requests' && 'Custom Job Requests'}
              {tab === 'services' && 'Services'}
              {tab === 'categories' && 'Service Categories'}
              {tab === 'technicians' && 'Providers & Handymen'}
              {tab === 'transactions' && 'Transactions'}
              {tab === 'promos' && 'Promo Codes'}
              {tab === 'chats' && 'Customer & Provider Chat'}
              {tab === 'settings' && 'System Settings'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={fetchAll}><RefreshCw size={15} /> Refresh</button>
            {tab === 'services' && <button className="btn btn-primary" onClick={() => setShowSrvModal(true)}><Plus size={16} /> Add Service</button>}
            {tab === 'technicians' && <button className="btn btn-primary" onClick={() => setShowTechModal(true)}><Plus size={16} /> Add Provider</button>}
          </div>
        </div>

        {tab === 'overview' && (
          <>
            {/* Blue Greeting Banner (exact match to PDF Page 2) */}
            <div style={{ background: '#0079ff', color: '#fff', borderRadius: 12, padding: '22px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Good morning</div>
              <h2 style={{ fontSize: '1.45rem', margin: '4px 0' }}>Hi, FixoHub Admin</h2>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>View Your Current Sales &amp; Summary.</div>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Total Revenue</div>
                <div className="kpi-value">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Services</div>
                <div className="kpi-value">{stats.activeServices || 0}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Booking Statistics</div>
                <div className="kpi-value">{stats.totalBookings || 0}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Available Providers</div>
                <div className="kpi-value" style={{ color: '#10b981' }}>{stats.availableTechnicians || 0} / {stats.totalTechnicians || 0}</div>
              </div>
            </div>

            {/* Income Revenue Area Chart (from PDF Page 2) */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3>Income Revenue</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Total', 'Admin', 'Provider'].map(m => (
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
                <path d={revMode === 'Total' ? 'M0,110 L60,105 L120,95 L180,98 L240,80 L300,30 L360,65 L420,55 L480,45 L540,25 L600,15 L600,130 L0,130 Z' : 'M0,115 L120,100 L240,90 L360,50 L480,60 L600,30 L600,130 L0,130 Z'} fill="url(#revGrad)" />
                <path d={revMode === 'Total' ? 'M0,110 L60,105 L120,95 L180,98 L240,80 L300,30 L360,65 L420,55 L480,45 L540,25 L600,15' : 'M0,115 L120,100 L240,90 L360,50 L480,60 L600,30'} fill="none" stroke="#0079ff" strokeWidth="3" />
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
              <div className="card">
                <h3 style={{ marginBottom: 12 }}>Recent Bookings</h3>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Code</th><th>Customer</th><th>Schedule</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {bookings.slice(0, 6).map(b => (
                        <tr key={b.id}>
                          <td><strong>{b.booking_code}</strong></td>
                          <td>{b.customer_name}</td>
                          <td>{b.scheduled_date}</td>
                          <td><strong>₹{b.total_amount}</strong></td>
                          <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: 12 }}>Top Trending Services</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {services.slice(0, 5).map((s, idx) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <strong style={{ fontSize: '0.86rem' }}>{s.name}</strong>
                        <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>₹{s.price} • {s.category_name}</div>
                      </div>
                      <span style={{ background: '#0079ff', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: '0.74rem', fontWeight: 700 }}>{35 - idx * 5}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'bookings' && (
          <div className="card">
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['all', ...STATUSES].map(st => (
                <button key={st} className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter(st)} style={{ textTransform: 'capitalize' }}>{st.replace('_', ' ')}</button>
              ))}
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Code</th><th>Customer</th><th>Services</th><th>Schedule</th><th>Amount</th><th>Assign Provider</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.booking_code}</strong><div style={{ fontSize: '0.74rem', color: '#64748b' }}>{b.source}</div></td>
                      <td><strong>{b.customer_name}</strong> ({b.customer_phone})<div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.address}, {b.city}</div></td>
                      <td>{b.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td>{b.scheduled_date}<br /><span style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.scheduled_slot}</span></td>
                      <td><strong>₹{b.total_amount}</strong></td>
                      <td>
                        <select className="inline-select" value={b.technician_id || ''} onChange={e => updateBooking(b.id, { technician_id: e.target.value, status: e.target.value && b.status === 'pending' ? 'assigned' : b.status })}>
                          <option value="">Unassigned</option>
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

        {tab === 'requests' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Custom Job Requests ({requests.length})</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Customer</th><th>Title</th><th>Category</th><th>Budget</th><th>Bids</th><th>Status</th></tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.customer_name}</strong></td>
                      <td>{r.title}<div style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.description}</div></td>
                      <td>{r.category_name}</td>
                      <td>₹{r.min_budget} – ₹{r.max_budget}</td>
                      <td>{r.bids_count} {r.bid_provider ? `(${r.bid_provider}: ₹${r.bid_amount})` : ''}</td>
                      <td><span className={`badge ${r.status === 'Booked' ? 'badge-completed' : 'badge-pending'}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {tab === 'categories' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Category Name</th><th>Slug</th><th>Tagline</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}><td>{c.id}</td><td><strong>{c.name}</strong></td><td>{c.slug}</td><td>{c.tagline}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'technicians' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Provider</th><th>Phone</th><th>Specialty</th><th>City</th><th>Rating</th><th>Jobs</th><th>Status</th></tr></thead>
                <tbody>
                  {technicians.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td><td>{t.phone}</td><td>{t.specialty}</td><td>{t.city}</td><td>★ {t.rating}</td><td>{t.jobs_completed}</td>
                      <td><button className="btn btn-outline" onClick={() => toggleTechnician(t)}>{t.is_available ? <><CheckCircle size={14} color="#10b981" /> Active</> : <><XCircle size={14} color="#ef4444" /> Busy</>}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'transactions' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Payment Transactions</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Booking</th><th>Customer</th><th>Provider</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td><strong>#{t.booking_code}</strong></td><td>{t.customer_name}</td><td>{t.provider_name}</td><td>{t.method}</td><td><strong>₹{t.amount}</strong></td>
                      <td><span className={`badge ${t.status === 'Success' ? 'badge-completed' : 'badge-pending'}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
              <thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Max Discount</th><th>Valid Until</th><th>Action</th></tr></thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.code}</strong></td><td>{p.discount_percent}%</td><td>₹{p.min_order}</td><td>₹{p.max_discount}</td><td>{p.valid_until}</td>
                    <td><button className="btn btn-danger" onClick={() => deletePromo(p.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'chats' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Platform Chat Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto', marginBottom: 14 }}>
              {chats.map(c => (
                <div key={c.id} style={{ padding: 10, borderRadius: 10, background: c.sender === 'customer' ? '#f1f5f9' : '#e6f2ff' }}>
                  <strong>{c.sender === 'customer' ? 'Customer' : c.partner_name}:</strong> {c.message}
                </div>
              ))}
            </div>
            <form onSubmit={sendAdminReply} style={{ display: 'flex', gap: 8 }}>
              <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Send broadcast / support reply..." style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <button type="submit" className="btn btn-primary"><Send size={15} /> Send</button>
            </form>
          </div>
        )}

        {tab === 'settings' && (
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>FixoHub System Settings</h3>
            <p style={{ color: '#64748b', marginBottom: 12 }}>Brand: <strong>FixoHub</strong> • Currency: <strong>INR (₹)</strong> • Database: <strong>Cloudflare D1 (Global Edge)</strong></p>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="/HomeServePro.apk" download className="btn btn-primary" style={{ textDecoration: 'none' }}>Download Customer APK</a>
              <a href="/HomeServeProvider.apk" download className="btn btn-outline" style={{ textDecoration: 'none' }}>Download Provider APK</a>
            </div>
          </div>
        )}

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
                <input placeholder="Includes (comma separated)" value={srvForm.includes} onChange={e => setSrvForm({ ...srvForm, includes: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}><button type="button" className="btn btn-outline" onClick={() => setShowSrvModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
              </form>
            </div>
          </div>
        )}

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
