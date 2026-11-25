import { useEffect, useMemo, useState } from 'react';
import {
  Wind, Tv, Smartphone, Laptop, Refrigerator, Zap, Wrench, Sparkles,
  Hammer, Paintbrush, ShieldCheck, Droplets, Search, ShoppingBag,
  Star, Clock, CheckCircle2, X, ClipboardList, Plus, Minus,
  Cpu, Download, Briefcase, Users, Award, HelpCircle, ChevronDown
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

const FAQS = [
  { q: 'What is HomeServe eDemand?', a: 'An on-demand multi-provider marketplace for Laptop, Mobile, 4K TV, Tech Accessories, AC, Plumbing, Electrician, and Home Cleaning services.' },
  { q: 'How do I book a service or gadget repair?', a: 'Select any service or accessory, add to Cart, pick your date & time slot, and confirm your booking in 30 seconds.' },
  { q: 'Are providers verified and covered by warranty?', a: 'Yes! Every technician is background-verified and services include up to 365-day replacement or service warranty.' }
];

export default function App() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

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
      fetch(`${API}/api/services`).then(r => r.json()),
      fetch(`${API}/api/technicians`).then(r => r.json())
    ]).then(([cats, srvs, techs]) => {
      setCategories(cats);
      setServices(srvs);
      setProviders(techs);
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
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const getQty = (id) => cart.find(i => i.id === id)?.qty || 0;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const loadBookings = async () => {
    const res = await fetch(`${API}/api/bookings`);
    setBookings(await res.json());
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
        body: JSON.stringify({ ...form, city, items: cart, source: 'website' })
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
      {/* 2-Row Sticky eDemand Header */}
      <header className="header-wrap">
        <div className="container">
          <div className="header-top">
            <a href="#" className="brand">
              <div className="brand-icon">eD</div>
              <div className="brand-text">
                <strong>eDemand</strong>
                <span>Home &amp; Tech Services</span>
              </div>
            </a>

            <div className="pill-search">
              <select value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                placeholder="Search for Laptop, Mobile, TV, Accessories, AC..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className="search-circle-btn"
                onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" onClick={loadBookings}>
                <ClipboardList size={16} /> Bookings
              </button>
              <a href="/partner/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Partner Login
              </a>
            </div>
          </div>

          <div className="header-sub">
            <nav className="sub-links">
              <a href="#" className="sub-link active">Home</a>
              <a href="#categories" className="sub-link">Categories</a>
              <a href="#services-section" className="sub-link">Services</a>
              <a href="#providers" className="sub-link">Providers</a>
              <a href="/partner/" className="sub-link">Become a Provider</a>
              <a href="/admin/" className="sub-link">Admin Panel</a>
            </nav>

            <button className="btn btn-outline-dark" onClick={() => { setBookingSuccess(null); setCartOpen(true); }}>
              <ShoppingBag size={16} /> Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {/* eDemand Split Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-banner">
            <div className="hero-left">
              <h1>
                Reliable &amp; Affordable <span>Home &amp; Tech</span> Services!
              </h1>
              <ul className="hero-checks">
                <li><CheckCircle2 size={16} color="#ffd000" /> Laptop &amp; MacBook Repairs</li>
                <li><CheckCircle2 size={16} color="#ffd000" /> iPhone &amp; Android OLED Fix</li>
                <li><CheckCircle2 size={16} color="#ffd000" /> 4K QLED TV &amp; Wall Mount</li>
                <li><CheckCircle2 size={16} color="#ffd000" /> AC, Plumbing &amp; Accessories</li>
              </ul>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-yellow"
                  onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Book Now
                </button>
                <a
                  href="/HomeServePro.apk"
                  download
                  className="btn"
                  style={{ background: 'transparent', color: '#fff', border: '1.5px solid #fff', textDecoration: 'none' }}
                >
                  <Download size={16} /> Customer APK
                </a>
                <a
                  href="/HomeServeProvider.apk"
                  download
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.45)', textDecoration: 'none' }}
                >
                  <Briefcase size={16} /> Provider APK
                </a>
              </div>
            </div>

            <div className="hero-right">
              <img src="/images/laptop.jpg" alt="Laptop" className="hero-photo-tile" />
              <img src="/images/mobile.jpg" alt="Mobile" className="hero-photo-tile" />
              <img src="/images/tv.jpg" alt="4K TV" className="hero-photo-tile" />
              <img src="/images/accessories.jpg" alt="Accessories" className="hero-photo-tile" />
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Category (5-column eDemand grid) */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Choose Your Category</h2>
              <p>Pick a service category to explore verified providers and instant pricing</p>
            </div>
            {selectedCat !== 'all' && (
              <button className="btn btn-outline" onClick={() => setSelectedCat('all')}>
                Browse All Categories &raquo;
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

          {/* 3 Horizontal Stat Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-circle"><CheckCircle2 size={22} /></div>
              <div>
                <strong style={{ fontSize: '1.35rem', display: 'block' }}>4,850+</strong>
                <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Services Completed</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-circle"><Users size={22} /></div>
              <div>
                <strong style={{ fontSize: '1.35rem', display: 'block' }}>{providers.length}+ Verified</strong>
                <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Trusted Professionals</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-circle"><Award size={22} /></div>
              <div>
                <strong style={{ fontSize: '1.35rem', display: 'block' }}>4.9 ★</strong>
                <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Average Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page Blue CTA Banner */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="mid-cta">
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Your Search for Reliable Services Starts Here</h2>
              <p style={{ opacity: 0.9, fontSize: '0.94rem' }}>
                Download our Customer &amp; Provider Android APKs or book directly online in {city}.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="/HomeServePro.apk" download className="btn" style={{ background: '#0d0d0d', color: '#fff', textDecoration: 'none' }}>
                Get Customer APK ↗
              </a>
              <a href="/HomeServeProvider.apk" download className="btn btn-yellow" style={{ textDecoration: 'none' }}>
                Get Provider APK ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* All Services & Tech Accessories */}
      <section className="section" id="services-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>
                {selectedCat === 'all'
                  ? 'Popular Services, Laptops, Mobiles, TVs & Accessories'
                  : categories.find(c => c.id === selectedCat)?.name || 'Services'}
              </h2>
              <p>{filteredServices.length} items available with upfront pricing &amp; warranty</p>
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
                    <span className="srv-badge">{srv.category_name}</span>
                    <h3>{srv.name}</h3>
                    <div className="srv-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#0d0d0d' }}>
                        <Star size={14} fill="#ffd000" color="#ffd000" /> {srv.rating} ({srv.reviews_count})
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} /> {srv.duration_mins}m
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
                    <div>
                      <span className="price-now">₹{srv.price}</span>
                      {srv.original_price && <span className="price-old">₹{srv.original_price}</span>}
                    </div>
                    {qty === 0 ? (
                      <button className="btn btn-primary" onClick={() => addToCart(srv)}>
                        <Plus size={15} /> Add
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

      {/* Top Verified Providers */}
      <section className="section" id="providers" style={{ paddingTop: 10 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Top Verified Providers</h2>
              <p>Multi-vendor partners ready for doorstep visits</p>
            </div>
            <a href="/partner/" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Partner Login / Join
            </a>
          </div>

          <div className="providers-grid">
            {providers.map(p => (
              <div key={p.id} className="provider-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="provider-avatar" style={{ background: p.avatar_color || '#0079ff' }}>
                    {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 700 }}>{p.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.specialty} • {p.city}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontWeight: 700 }}>★ {p.rating} ({p.jobs_completed} jobs)</span>
                  <span style={{
                    padding: '3px 9px', borderRadius: 999, fontSize: '0.73rem', fontWeight: 700,
                    background: p.is_available ? '#d1fae5' : '#fee2e2',
                    color: p.is_available ? '#047857' : '#b91c1c'
                  }}>
                    {p.is_available ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Flow) */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Book Trusted Services in Just a Few Simple Steps</h2>
            <p style={{ color: '#64748b' }}>Fast, transparent, and backed by eDemand service warranty</p>
          </div>
          <div className="steps-grid">
            {[
              { step: 'Step One', title: 'Choose a Service', desc: 'Browse Laptop, Mobile, TV, Accessories or Home services.' },
              { step: 'Step Two', title: 'Pick Date & Time', desc: 'Select your preferred doorstep visit slot.' },
              { step: 'Step Three', title: 'Confirm Booking', desc: 'Instant booking code & live provider assignment.' },
              { step: 'Step Four', title: 'Get the Job Done', desc: 'Verified pro completes the service with warranty.' }
            ].map((s, i) => (
              <div key={i} className="step-card">
                <span className="step-pill">{s.step}</span>
                <h4 style={{ marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (#E6F2FF exact) */}
      <section className="testimonials-sec">
        <div className="container testi-grid">
          <div>
            <h2 style={{ fontSize: '1.7rem', marginBottom: 10 }}>Trusted by Thousands of Happy Customers</h2>
            <p style={{ color: '#475569', marginBottom: 16 }}>
              Real feedback from customers who booked Laptop upgrades, OLED phone screens, 4K TV mounts &amp; AC service.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', padding: '10px 16px', borderRadius: 12 }}>
              <strong style={{ fontSize: '1.3rem' }}>4.9</strong>
              <span style={{ color: '#ffd000', fontSize: '1.1rem' }}>★★★★★</span>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Based on 12,400+ Reviews</span>
            </div>
          </div>
          <div className="testi-cards">
            {[
              { name: 'Rohan Mehta', srv: 'iPhone 15 OLED Screen', text: 'Technician arrived in 30 mins and replaced my screen cleanly right at my desk.' },
              { name: 'Priya Nair', srv: 'Laptop SSD + Repaste', text: 'My gaming laptop runs 15°C cooler and boots in 6 seconds now. Super transparent pricing.' }
            ].map((t, i) => (
              <div key={i} className="testi-card">
                <span style={{ display: 'inline-block', background: '#fff8db', color: '#b45309', fontSize: '0.76rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, marginBottom: 8 }}>
                  ★ 5.00
                </span>
                <p style={{ fontSize: '0.88rem', color: '#334155', marginBottom: 12 }}>"{t.text}"</p>
                <strong style={{ fontSize: '0.88rem', display: 'block' }}>{t.name}</strong>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>{t.srv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container faq-grid">
          <div style={{ background: '#f7f7f7', borderRadius: 16, padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e6f2ff', color: '#0079ff', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
              <HelpCircle size={22} />
            </div>
            <h3 style={{ marginBottom: 6 }}>Still Need Help?</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 16 }}>
              Have questions about doorstep repairs, accessories warranty, or becoming a partner?
            </p>
            <a href="/partner/" className="btn" style={{ background: '#0d0d0d', color: '#fff', textDecoration: 'none' }}>
              Partner Portal
            </a>
          </div>
          <div>
            <h2 style={{ marginBottom: 16 }}>Frequently Asked Questions</h2>
            {FAQS.map((f, idx) => (
              <div key={idx} className="faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.95rem', textAlign: 'left' }}
                >
                  <span>{f.q}</span>
                  <ChevronDown size={18} />
                </button>
                {openFaq === idx && <p style={{ marginTop: 8, fontSize: '0.86rem', color: '#475569' }}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solid Black Footer (eDemand exact) */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="brand-icon">eD</div>
              <strong style={{ color: '#fff', fontSize: '1.2rem' }}>eDemand</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', marginBottom: 14 }}>
              On-Demand Home Services, Laptop, Mobile, TV &amp; Accessories Marketplace.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="/HomeServePro.apk" download className="btn btn-primary" style={{ marginTop: 0, color: '#fff' }}>Customer APK</a>
              <a href="/HomeServeProvider.apk" download className="btn btn-outline" style={{ marginTop: 0, color: '#0d0d0d' }}>Provider APK</a>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 6 }}>Quick Links</h4>
            <a href="#categories">Categories</a>
            <a href="#services-section">Services &amp; Accessories</a>
            <a href="#providers">Verified Providers</a>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 6 }}>Portals</h4>
            <a href="/admin/">Admin Login</a>
            <a href="/partner/">Partner / Provider Login</a>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 6 }}>Contact Us</h4>
            <a href="tel:+919876543210">+91 98765 43210</a>
            <a href="mailto:support@homeserve-edemand.in">support@homeserve-edemand.in</a>
            <span style={{ display: 'block', marginTop: 8, fontSize: '0.84rem', color: '#a3a3a3' }}>Mon–Sun: 8:00 AM – 9:00 PM</span>
          </div>
        </div>
      </footer>

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
                    Thank you, <strong>{bookingSuccess.customer_name}</strong>! Scheduled for{' '}
                    <strong>{bookingSuccess.scheduled_date}</strong> ({bookingSuccess.scheduled_slot}).
                  </p>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setCartOpen(false); loadBookings(); }}>
                    Track Booking Status
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                  <ShoppingBag size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p>Your cart is empty. Add Laptop, Mobile, TV, Accessories or Home services.</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.83rem', color: '#64748b' }}>₹{item.price} × {item.qty}</div>
                      </div>
                      <div className="qty-stepper">
                        <button onClick={() => updateQty(item.id, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                  <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} placeholder="Rahul Sharma" />
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
                  </form>
                </>
              )}
            </div>
            {!bookingSuccess && cart.length > 0 && (
              <div className="drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontWeight: 800 }}>
                  <span>Total Amount</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button type="submit" form="checkout-form" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: 12 }}>
                  {submitting ? 'Confirming...' : `Confirm Booking • ₹${cartTotal}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookings Modal */}
      {bookingsOpen && (
        <div className="modal-center" onClick={() => setBookingsOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2>Recent Bookings</h2>
              <button className="btn btn-outline" style={{ padding: 6 }} onClick={() => setBookingsOpen(false)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bookings.map(b => (
                <div key={b.id} style={{ border: '1px solid #ebebeb', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>{b.booking_code} • {b.customer_name}</strong>
                    <span className={`status-badge status-${b.status}`}>{b.status.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#475569' }}>{b.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                    <span>{b.scheduled_date} • {b.scheduled_slot}</span>
                    <strong style={{ color: '#0d0d0d' }}>₹{b.total_amount}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
