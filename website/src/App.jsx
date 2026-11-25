import { useEffect, useMemo, useState } from 'react';
import {
  Wind, Tv, Smartphone, Laptop, Refrigerator, Zap, Wrench, Sparkles,
  Hammer, Paintbrush, ShieldCheck, Droplets, Search, ShoppingBag,
  Star, Clock, Shield, CheckCircle2, X, MapPin, ClipboardList, Plus, Minus,
  Cpu, Download
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

const ICON_MAP = {
  Wind, Tv, Smartphone, Laptop, Refrigerator, Zap, Wrench,
  Sparkles, Hammer, Paintbrush, ShieldCheck, Droplets, Cpu
};

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
  '06:00 PM - 07:00 PM'
];

const CITIES = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Jaipur'];

export default function App() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    scheduled_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    scheduled_slot: TIME_SLOTS[0],
    payment_method: 'UPI / Cash on Visit',
    notes: ''
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/categories`).then(r => r.json()),
      fetch(`${API}/api/services`).then(r => r.json())
    ]).then(([cats, srvs]) => {
      setCategories(cats);
      setServices(srvs);
    }).catch(console.error);
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchCat = selectedCat === 'all' || s.category_id === selectedCat;
      const q = search.trim().toLowerCase();
      const matchSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.category_name || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, selectedCat, search]);

  const addToCart = (srv) => {
    setCart(prev => {
      const found = prev.find(i => i.id === srv.id);
      if (found) return prev.map(i => i.id === srv.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: srv.id, name: srv.name, price: srv.price, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  };

  const getQty = (id) => cart.find(i => i.id === id)?.qty || 0;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const loadBookings = async () => {
    const res = await fetch(`${API}/api/bookings`);
    const data = await res.json();
    setBookings(data);
    setBookingsOpen(true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          city,
          items: cart,
          source: 'website'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess(data);
        setCart([]);
      } else {
        alert(data.error || 'Could not create booking');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="container navbar-inner">
          <a href="#" className="brand">
            <div className="brand-badge">HS</div>
            <span>HomeServe Pro</span>
          </a>

          <div className="search-wrap">
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search AC service, TV mount, mobile screen, laptop SSD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="nav-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color="#4f46e5" />
              <select className="city-select" value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button className="btn btn-outline" onClick={loadBookings}>
              <ClipboardList size={17} />
              <span>My Bookings</span>
            </button>

            <button className="btn btn-primary" onClick={() => { setBookingSuccess(null); setCartOpen(true); }}>
              <ShoppingBag size={17} />
              <span>Cart ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-pill">
              <Shield size={14} />
              <span>Verified Technicians • Up to 90-Day Warranty</span>
            </div>
            <h1>Home services, electronics &amp; repairs at your doorstep.</h1>
            <p>
              Book trusted experts for AC service, LED TV repair, mobile screen replacement,
              laptop upgrades, plumbing, electrician, deep cleaning and more in {city}.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>4.9 ★</strong>
                <span>Average Service Rating</span>
              </div>
              <div className="hero-stat">
                <strong>30 Mins</strong>
                <span>Express Arrival</span>
              </div>
              <div className="hero-stat">
                <strong>50,000+</strong>
                <span>Happy Homes</span>
              </div>
              <a
                href="/HomeServePro.apk"
                download
                className="btn"
                style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', textDecoration: 'none' }}
              >
                <Download size={16} />
                <span>Download Android APK</span>
              </a>
            </div>
          </div>

          <div className="hero-card">
            <h3>Popular Instant Repairs</h3>
            <div className="quick-grid">
              {[
                { id: 'cat-ac', title: 'AC Service & Gas', sub: 'Starts ₹299' },
                { id: 'cat-tv', title: 'TV Repair & Mount', sub: 'Starts ₹349' },
                { id: 'cat-mobile', title: 'Mobile Screen Fix', sub: '30-min doorstep' },
                { id: 'cat-laptop', title: 'Laptop SSD & Clean', sub: 'Starts ₹399' }
              ].map(q => (
                <button
                  key={q.id}
                  className="quick-item"
                  onClick={() => {
                    setSelectedCat(q.id);
                    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <strong>{q.title}</strong>
                  <span>{q.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>What are you looking for?</h2>
              <p>Choose from 12+ categories of home &amp; gadget services</p>
            </div>
            {selectedCat !== 'all' && (
              <button className="btn btn-outline" onClick={() => setSelectedCat('all')}>
                Show All Categories
              </button>
            )}
          </div>

          <div className="cat-grid">
            {categories.map(cat => {
              const Icon = ICON_MAP[cat.icon] || Wrench;
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`cat-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCat(isActive ? 'all' : cat.id)}
                >
                  <div className="cat-icon" style={{ background: cat.color }}>
                    <Icon size={20} />
                  </div>
                  <h4>{cat.name}</h4>
                  <p>{cat.tagline}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section" id="services-section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2>
                {selectedCat === 'all'
                  ? 'All Home & Gadget Services'
                  : categories.find(c => c.id === selectedCat)?.name || 'Services'}
              </h2>
              <p>{filteredServices.length} services available with transparent upfront pricing</p>
            </div>
          </div>

          <div className="services-grid">
            {filteredServices.map(srv => {
              const qty = getQty(srv.id);
              return (
                <div key={srv.id} className="srv-card">
                  <div>
                    <img
                      src={srv.image_url || '/images/ac.jpg'}
                      alt={srv.name}
                      className="srv-photo"
                      loading="lazy"
                    />
                    <div className="srv-top">
                      <div>
                        <span className="srv-badge">{srv.category_name}</span>
                        <h3>{srv.name}</h3>
                      </div>
                    </div>

                    <div className="srv-meta">
                      <span className="rating-pill">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        {srv.rating} ({srv.reviews_count})
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} /> {srv.duration_mins} mins
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <ShieldCheck size={14} color="#10b981" /> {srv.warranty_days}d warranty
                      </span>
                    </div>

                    <p className="srv-desc">{srv.description}</p>

                    <div className="includes-list">
                      {(srv.includes || []).map((inc, idx) => (
                        <span key={idx} className="include-chip">✓ {inc}</span>
                      ))}
                    </div>
                  </div>

                  <div className="srv-bottom">
                    <div className="price-wrap">
                      <span className="price-now">₹{srv.price}</span>
                      {srv.original_price && <span className="price-old">₹{srv.original_price}</span>}
                    </div>

                    {qty === 0 ? (
                      <button className="btn btn-primary" onClick={() => addToCart(srv)}>
                        <Plus size={16} /> Add
                      </button>
                    ) : (
                      <div className="qty-stepper">
                        <button onClick={() => updateQty(srv.id, -1)}><Minus size={14} /></button>
                        <span>{qty}</span>
                        <button onClick={() => updateQty(srv.id, 1)}><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cart & Checkout Drawer */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{bookingSuccess ? 'Booking Confirmed!' : `Your Service Cart (${cartCount})`}</h3>
              <button className="btn btn-outline" style={{ padding: 6 }} onClick={() => setCartOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                  <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 14px' }} />
                  <h2 style={{ marginBottom: 8 }}>Booking {bookingSuccess.booking_code}</h2>
                  <p style={{ color: '#64748b', marginBottom: 18 }}>
                    Thank you, <strong>{bookingSuccess.customer_name}</strong>! Our technician will arrive on{' '}
                    <strong>{bookingSuccess.scheduled_date}</strong> ({bookingSuccess.scheduled_slot}).
                  </p>
                  <div className="cart-item" style={{ textAlign: 'left', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>Total Payable</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{bookingSuccess.payment_method}</div>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{bookingSuccess.total_amount}</div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setCartOpen(false); loadBookings(); }}>
                    Track Booking Status
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                  <ShoppingBag size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p>Your service cart is empty. Add AC, TV, Mobile, Laptop or other services to book.</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>₹{item.price} × {item.qty}</div>
                      </div>
                      <div className="qty-stepper">
                        <button onClick={() => updateQty(item.id, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                  ))}

                  <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} placeholder="e.g. Rahul Sharma" />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input required value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                    <div className="form-group">
                      <label>Complete Address ({city}) *</label>
                      <textarea required rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House/Flat No., Street, Landmark" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div className="form-group">
                        <label>Date *</label>
                        <input type="date" required value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Time Slot *</label>
                        <select value={form.scheduled_slot} onChange={e => setForm({ ...form, scheduled_slot: e.target.value })}>
                          {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Payment Method</label>
                      <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}>
                        <option>UPI / Cash on Visit</option>
                        <option>Cash on Visit</option>
                        <option>Online Card / NetBanking</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Issue Notes (Optional)</label>
                      <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Split AC 1.5 Ton, low cooling" />
                    </div>
                  </form>
                </>
              )}
            </div>

            {!bookingSuccess && cart.length > 0 && (
              <div className="drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontWeight: 800, fontSize: '1.05rem' }}>
                  <span>Total Amount</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button type="submit" form="checkout-form" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: 12 }}>
                  {submitting ? 'Confirming Booking...' : `Confirm Booking • ₹${cartTotal}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Bookings Modal */}
      {bookingsOpen && (
        <div className="modal-center" onClick={() => setBookingsOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2>Recent Bookings</h2>
              <button className="btn btn-outline" style={{ padding: 6 }} onClick={() => setBookingsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.map(b => (
                <div key={b.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <strong>{b.booking_code} • {b.customer_name}</strong>
                    <span className={`status-badge status-${b.status}`}>{b.status.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: 6 }}>
                    {b.items.map(i => `${i.name} (×${i.qty})`).join(', ')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                    <span>{b.scheduled_date} • {b.scheduled_slot}</span>
                    <strong style={{ color: '#0f172a' }}>₹{b.total_amount}</strong>
                  </div>
                  {b.technician_name && (
                    <div style={{ marginTop: 6, fontSize: '0.82rem', color: '#4f46e5', fontWeight: 600 }}>
                      Assigned Pro: {b.technician_name} ({b.technician_phone})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
