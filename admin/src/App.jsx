import { useEffect, useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, Users, Plus,
  RefreshCw, Trash2, CheckCircle, XCircle, ExternalLink, LogOut, ShieldCheck
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';
const STATUSES = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('hs_admin_auth') === '1');
  const [loginPhone, setLoginPhone] = useState('+91 9876543210');
  const [loginPass, setLoginPass] = useState('12345678');
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const [showSrvModal, setShowSrvModal] = useState(false);
  const [srvForm, setSrvForm] = useState({
    category_id: 'cat-ac', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: ''
  });

  const [showTechModal, setShowTechModal] = useState(false);
  const [techForm, setTechForm] = useState({
    name: '', phone: '', specialty: 'AC & Appliances', city: 'Delhi NCR'
  });

  const fetchAll = async () => {
    const [st, bk, sr, ct, tc] = await Promise.all([
      fetch(`${API}/api/stats`).then(r => r.json()),
      fetch(`${API}/api/bookings`).then(r => r.json()),
      fetch(`${API}/api/services?all=1`).then(r => r.json()),
      fetch(`${API}/api/categories`).then(r => r.json()),
      fetch(`${API}/api/technicians`).then(r => r.json())
    ]);
    setStats(st);
    setBookings(bk);
    setServices(sr);
    setCategories(ct);
    setTechnicians(tc);
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
    setSrvForm({ category_id: 'cat-ac', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '' });
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
    setTechForm({ name: '', phone: '', specialty: 'AC & Appliances', city: 'Delhi NCR' });
    fetchAll();
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('hs_admin_auth', '1');
    setAuthed(true);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #003a8c 100%)', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: 32, width: '100%', maxWidth: 410, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: '#0277fa', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>eD</div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admin Panel Login</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>HomeServe eDemand Super Admin</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="form-grid">
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Phone / Email</label>
            <input required value={loginPhone} onChange={e => setLoginPhone(e.target.value)} />
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Password</label>
            <input required type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, marginTop: 6 }}>
              <ShieldCheck size={17} /> Sign In to Admin Panel
            </button>
            <button type="button" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
              1-Click Demo Admin Login
            </button>
          </form>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontSize: '0.82rem' }}>
            <a href="/" style={{ color: '#0277fa', textDecoration: 'none' }}>← Customer Website</a>
            <a href="/partner/" style={{ color: '#0277fa', textDecoration: 'none' }}>Partner Login →</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">HS</div>
          <div>
            <div>HomeServe</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>Admin Panel</div>
          </div>
        </div>

        <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <LayoutDashboard size={18} /> Overview
        </button>
        <button className={`nav-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
          <CalendarCheck size={18} /> Bookings ({bookings.length})
        </button>
        <button className={`nav-btn ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
          <Wrench size={18} /> Services ({services.length})
        </button>
        <button className={`nav-btn ${tab === 'technicians' ? 'active' : ''}`} onClick={() => setTab('technicians')}>
          <Users size={18} /> Technicians ({technicians.length})
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <a href="/" className="nav-btn" style={{ textDecoration: 'none' }}>
            <ExternalLink size={17} /> Customer Website
          </a>
          <a href="/partner/" className="nav-btn" style={{ textDecoration: 'none' }}>
            <ExternalLink size={17} /> Partner Panel
          </a>
          <button className="nav-btn" onClick={() => { localStorage.removeItem('hs_admin_auth'); setAuthed(false); }}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <h1>
              {tab === 'overview' && 'Dashboard Overview'}
              {tab === 'bookings' && 'Manage Bookings'}
              {tab === 'services' && 'Service Catalog'}
              {tab === 'technicians' && 'Technicians & Partners'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={fetchAll}>
              <RefreshCw size={15} /> Refresh
            </button>
            {tab === 'services' && (
              <button className="btn btn-primary" onClick={() => setShowSrvModal(true)}>
                <Plus size={16} /> Add Service
              </button>
            )}
            {tab === 'technicians' && (
              <button className="btn btn-primary" onClick={() => setShowTechModal(true)}>
                <Plus size={16} /> Add Technician
              </button>
            )}
          </div>
        </div>

        {tab === 'overview' && (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Total Revenue</div>
                <div className="kpi-value">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Bookings</div>
                <div className="kpi-value">{stats.totalBookings || 0}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Pending Requests</div>
                <div className="kpi-value" style={{ color: '#d97706' }}>{stats.pendingBookings || 0}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Available Technicians</div>
                <div className="kpi-value" style={{ color: '#10b981' }}>
                  {stats.availableTechnicians || 0} / {stats.totalTechnicians || 0}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 14 }}>Latest Bookings</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Customer</th>
                      <th>Services</th>
                      <th>Schedule</th>
                      <th>Amount</th>
                      <th>Source</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 8).map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.booking_code}</strong></td>
                        <td>
                          <div>{b.customer_name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.city}</div>
                        </td>
                        <td>{b.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                        <td>{b.scheduled_date}<br /><span style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.scheduled_slot}</span></td>
                        <td><strong>₹{b.total_amount}</strong></td>
                        <td><span className="badge" style={{ background: '#f1f5f9', color: '#334155' }}>{b.source}</span></td>
                        <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'bookings' && (
          <div className="card">
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['all', ...STATUSES].map(st => (
                <button
                  key={st}
                  className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setStatusFilter(st)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Customer &amp; Address</th>
                    <th>Services</th>
                    <th>Schedule</th>
                    <th>Amount</th>
                    <th>Assign Technician</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.booking_code}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.source}</div>
                      </td>
                      <td>
                        <strong>{b.customer_name}</strong> ({b.customer_phone})
                        <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: 230 }}>{b.address}, {b.city}</div>
                      </td>
                      <td>{b.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td>{b.scheduled_date}<br /><span style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.scheduled_slot}</span></td>
                      <td><strong>₹{b.total_amount}</strong></td>
                      <td>
                        <select
                          className="inline-select"
                          value={b.technician_id || ''}
                          onChange={e => updateBooking(b.id, { technician_id: e.target.value, status: e.target.value && b.status === 'pending' ? 'assigned' : b.status })}
                        >
                          <option value="">Unassigned</option>
                          {technicians.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="inline-select"
                          value={b.status}
                          onChange={e => updateBooking(b.id, { status: e.target.value })}
                        >
                          {STATUSES.map(st => (
                            <option key={st} value={st}>{st.replace('_', ' ')}</option>
                          ))}
                        </select>
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
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Warranty</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: 320 }}>{s.description}</div>
                      </td>
                      <td>{s.category_name}</td>
                      <td><strong>₹{s.price}</strong></td>
                      <td>{s.duration_mins} mins</td>
                      <td>{s.warranty_days} days</td>
                      <td>
                        <button className="btn btn-outline" onClick={() => toggleService(s)}>
                          {s.is_active ? <><CheckCircle size={14} color="#10b981" /> Active</> : <><XCircle size={14} color="#ef4444" /> Hidden</>}
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => deleteService(s.id)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
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
                <thead>
                  <tr>
                    <th>Technician</th>
                    <th>Phone</th>
                    <th>Specialty</th>
                    <th>City</th>
                    <th>Rating</th>
                    <th>Jobs Done</th>
                    <th>Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.phone}</td>
                      <td>{t.specialty}</td>
                      <td>{t.city}</td>
                      <td>★ {t.rating}</td>
                      <td>{t.jobs_completed}</td>
                      <td>
                        <button className="btn btn-outline" onClick={() => toggleTechnician(t)}>
                          {t.is_available ? <><CheckCircle size={14} color="#10b981" /> Available</> : <><XCircle size={14} color="#ef4444" /> Busy</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showSrvModal && (
          <div className="modal-bg" onClick={() => setShowSrvModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add New Service</h3>
              <form className="form-grid" onSubmit={createService}>
                <select value={srvForm.category_id} onChange={e => setSrvForm({ ...srvForm, category_id: e.target.value })}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input required placeholder="Service Name" value={srvForm.name} onChange={e => setSrvForm({ ...srvForm, name: e.target.value })} />
                <textarea rows={2} placeholder="Description" value={srvForm.description} onChange={e => setSrvForm({ ...srvForm, description: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input required type="number" placeholder="Price (₹)" value={srvForm.price} onChange={e => setSrvForm({ ...srvForm, price: e.target.value })} />
                  <input type="number" placeholder="MRP (₹)" value={srvForm.original_price} onChange={e => setSrvForm({ ...srvForm, original_price: e.target.value })} />
                </div>
                <input placeholder="Includes (comma separated)" value={srvForm.includes} onChange={e => setSrvForm({ ...srvForm, includes: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowSrvModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Service</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTechModal && (
          <div className="modal-bg" onClick={() => setShowTechModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add New Technician</h3>
              <form className="form-grid" onSubmit={createTechnician}>
                <input required placeholder="Full Name" value={techForm.name} onChange={e => setTechForm({ ...techForm, name: e.target.value })} />
                <input required placeholder="Phone (+91 ...)" value={techForm.phone} onChange={e => setTechForm({ ...techForm, phone: e.target.value })} />
                <input required placeholder="Specialty (e.g. AC, TV, Mobile)" value={techForm.specialty} onChange={e => setTechForm({ ...techForm, specialty: e.target.value })} />
                <input required placeholder="City" value={techForm.city} onChange={e => setTechForm({ ...techForm, city: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowTechModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Partner</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
