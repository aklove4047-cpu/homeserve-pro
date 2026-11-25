import { useEffect, useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, RefreshCw, CheckCircle,
  XCircle, ExternalLink, LogOut, Briefcase, Play, CheckCheck
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
  const [tab, setTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  const loadData = async (currentPartner = partner) => {
    const [techs, srvs] = await Promise.all([
      fetch(`${API}/api/technicians`).then(r => r.json()),
      fetch(`${API}/api/services`).then(r => r.json())
    ]);
    setPartnersList(techs);
    setServices(srvs);

    if (currentPartner) {
      const bks = await fetch(`${API}/api/bookings?technicianId=${encodeURIComponent(currentPartner.id)}`).then(r => r.json());
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

  if (!partner) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #0277fa 100%)', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: 32, width: '100%', maxWidth: 430, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: '#0277fa', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>eD</div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Partner / Provider Login</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>HomeServe eDemand Partner Portal</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); loginPartner(phoneInput); }} className="form-grid">
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Registered Mobile Number</label>
            <input required value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="+91 98765 43210" />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
              <Briefcase size={17} /> Sign In as Partner
            </button>
          </form>

          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 8 }}>1-Click Demo Partner Accounts:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {partnersList.slice(0, 4).map(p => (
                <button key={p.id} className="btn btn-outline" style={{ justifyContent: 'space-between' }} onClick={() => loginPartner(p.id)}>
                  <span>{p.name} ({p.specialty})</span>
                  <span style={{ color: '#0277fa', fontSize: '0.78rem' }}>Login →</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontSize: '0.82rem' }}>
            <a href="/" style={{ color: '#0277fa', textDecoration: 'none' }}>← Customer Website</a>
            <a href="/admin/" style={{ color: '#0277fa', textDecoration: 'none' }}>Admin Login →</a>
          </div>
        </div>
      </div>
    );
  }

  const earnings = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.total_amount, 0);
  const pendingCount = bookings.filter(b => b.status === 'pending' || b.status === 'assigned').length;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon" style={{ background: '#0277fa' }}>eD</div>
          <div>
            <div>{partner.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>{partner.specialty}</div>
          </div>
        </div>

        <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <LayoutDashboard size={18} /> Overview
        </button>
        <button className={`nav-btn ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>
          <CalendarCheck size={18} /> Job Requests ({bookings.length})
        </button>
        <button className={`nav-btn ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
          <Wrench size={18} /> Service Catalog
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <a href="/" className="nav-btn" style={{ textDecoration: 'none' }}>
            <ExternalLink size={17} /> Customer Website
          </a>
          <a href="/HomeServeProvider.apk" download className="nav-btn" style={{ textDecoration: 'none', color: '#60a5fa' }}>
            <ExternalLink size={17} /> Provider APK
          </a>
          <button className="nav-btn" onClick={() => { localStorage.removeItem('hs_partner'); setPartner(null); }}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <h1>Partner Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>{partner.city} • Rating ★ {partner.rating}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={toggleAvailability}>
              {partner.is_available ? <><CheckCircle size={15} color="#10b981" /> Online (Available)</> : <><XCircle size={15} color="#ef4444" /> Offline (Busy)</>}
            </button>
            <button className="btn btn-primary" onClick={() => loadData(partner)}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {tab === 'overview' && (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Completed Earnings</div>
                <div className="kpi-value">₹{earnings.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Active / New Requests</div>
                <div className="kpi-value" style={{ color: '#0277fa' }}>{pendingCount}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Lifetime Jobs</div>
                <div className="kpi-value">{partner.jobs_completed}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Partner Rating</div>
                <div className="kpi-value" style={{ color: '#f59e0b' }}>★ {partner.rating}</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 14 }}>Incoming &amp; Assigned Jobs</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Customer</th>
                      <th>Services</th>
                      <th>Schedule</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.booking_code}</strong></td>
                        <td>{b.customer_name}<br /><span style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.address}</span></td>
                        <td>{b.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                        <td>{b.scheduled_date}<br /><span style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.scheduled_slot}</span></td>
                        <td><strong>₹{b.total_amount}</strong></td>
                        <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {(b.status === 'pending' || b.status === 'assigned') && (
                              <button className="btn btn-primary" onClick={() => updateJobStatus(b.id, 'in_progress')}>
                                <Play size={13} /> Start
                              </button>
                            )}
                            {b.status === 'in_progress' && (
                              <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={() => updateJobStatus(b.id, 'completed')}>
                                <CheckCheck size={13} /> Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'jobs' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>All Job Requests</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Customer &amp; Phone</th>
                    <th>Services</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.booking_code}</strong></td>
                      <td>{b.customer_name} ({b.customer_phone})<br /><span style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.address}, {b.city}</span></td>
                      <td>{b.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td><strong>₹{b.total_amount}</strong></td>
                      <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {b.status === 'pending' && (
                            <button className="btn btn-primary" onClick={() => updateJobStatus(b.id, 'assigned')}>Accept</button>
                          )}
                          {(b.status === 'assigned' || b.status === 'confirmed') && (
                            <button className="btn btn-primary" onClick={() => updateJobStatus(b.id, 'in_progress')}>Start Job</button>
                          )}
                          {b.status === 'in_progress' && (
                            <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={() => updateJobStatus(b.id, 'completed')}>Complete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'services' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Platform Service Catalog ({services.length})</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.category_name}</td>
                      <td>₹{s.price}</td>
                      <td>{s.duration_mins} mins</td>
                      <td>{s.warranty_days} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
