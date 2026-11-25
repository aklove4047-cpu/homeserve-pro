import { useEffect, useMemo, useState } from 'react';
import {
  Wind, Tv, Smartphone, Laptop, Refrigerator, Zap, Wrench, Sparkles,
  Hammer, Paintbrush, ShieldCheck, Droplets, Search, ShoppingBag,
  Star, Clock, CheckCircle2, X, ClipboardList, Plus, Minus,
  Cpu, Users, Award, HelpCircle, ChevronDown, Heart, MessageSquare,
  Send, Tag, FileText, Moon, Sun, Home, User, FilePlus2, MapPin
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
  { q: 'What is FixoHub?', a: 'An on-demand multi-provider marketplace for Laptop, Mobile, 4K TV, Tech Accessories, AC, Plumbing, Electrician, and Home Cleaning services.' },
  { q: 'How do Custom Service Requests & Bids work?', a: 'Can\'t find a service? Post a custom request with your budget. Nearby verified providers send bids and you can accept the best offer in 1 click.' },
  { q: 'Are providers verified and covered by warranty?', a: 'Yes! Every technician is background-verified and services include up to 365-day replacement or service warranty.' }
];

export default function App() {
  const [view, setView] = useState('home'); // home | bookings | chats | requests | profile
  const [darkMode, setDarkMode] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [promos, setPromos] = useState([]);
  const [chats, setChats] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Extra features state
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fh_bookmarks') || '[]'); } catch { return []; }
  });
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fh_addresses') || '["B-402, Green Park Extension, Delhi NCR"]'); } catch { return []; }
  });
  const [newAddress, setNewAddress] = useState('');
  const [bookingTab, setBookingTab] = useState('all');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [visitMode, setVisitMode] = useState('At Doorstep');
  const [invoiceModal, setInvoiceModal] = useState(null);

  // Chat state
  const [activePartner, setActivePartner] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatTab, setChatTab] = useState('Enquiries');

  // Custom Request state
  const [reqModal, setReqModal] = useState(false);
  const [reqFilter, setReqFilter] = useState('All');
  const [reqForm, setReqForm] = useState({
    customer_name: 'Rahul Sharma', title: '', category_name: 'Laptop & PC', description: '', min_budget: 500, max_budget: 2500
  });

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    scheduled_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    scheduled_slot: TIME_SLOTS[0],
    payment_method: 'UPI / RazorPay',
    notes: ''
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const loadAll = async () => {
    const [cats, srvs, techs, bks, reqs, prms, chts, blgs] = await Promise.all([
      fetch(`${API}/api/categories`).then(r => r.json()),
      fetch(`${API}/api/services`).then(r => r.json()),
      fetch(`${API}/api/technicians`).then(r => r.json()),
      fetch(`${API}/api/bookings`).then(r => r.json()),
      fetch(`${API}/api/requests`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/promocodes`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/chats`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/blogs`).then(r => r.json()).catch(() => [])
    ]);
    setCategories(cats);
    setServices(srvs);
    setProviders(techs);
    setBookings(bks);
    setRequests(reqs);
    setPromos(prms);
    setChats(chts);
    setBlogs(blgs);
    if (!activePartner && techs.length) setActivePartner(techs[0]);
  };

  useEffect(() => {
    loadAll().catch(console.error);
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

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('fh_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const addToCart = (srv) => {
    setCart(prev => {
      const found = prev.find(i => i.id === srv.id);
      if (found) return prev.map(i => i.id === srv.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: srv.id, name: srv.name, price: srv.price, qty: 1 }];
    });
  };

  const reBook = (b) => {
    if (b.items && b.items.length) {
      setCart(b.items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty || 1 })));
      setBookingSuccess(null);
      setCartOpen(true);
    }
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const getQty = (id) => cart.find(i => i.id === id)?.qty || 0;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = appliedPromo ? Math.min(Math.round(subTotal * (appliedPromo.discount_percent / 100)), appliedPromo.max_discount) : 0;
  const cartTotal = Math.max(0, subTotal - discountAmt);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promos.find(p => p.code === code && p.is_active);
    if (!found) return alert('Invalid promo code. Try FIXO50, WELCOME20 or TECH15');
    if (subTotal < found.min_order) return alert(`Minimum order ₹${found.min_order} required for ${found.code}`);
    setAppliedPromo(found);
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
          notes: `${visitMode}${appliedPromo ? ` | Promo: ${appliedPromo.code}` : ''}${form.notes ? ` | ${form.notes}` : ''}`,
          items: cart,
          source: 'website'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess(data);
        setCart([]);
        setAppliedPromo(null);
        loadAll();
      } else {
        alert(data.error || 'Could not create booking');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const submitCustomRequest = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqForm)
    });
    if (res.ok) {
      setReqModal(false);
      setReqForm({ customer_name: 'Rahul Sharma', title: '', category_name: 'Laptop & PC', description: '', min_budget: 500, max_budget: 2500 });
      await loadAll();
      setView('requests');
    }
  };

  const acceptBid = async (reqId) => {
    await fetch(`${API}/api/requests/${reqId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Booked' })
    });
    loadAll();
  };

  const sendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activePartner) return;
    await fetch(`${API}/api/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: activePartner.id,
        partner_name: activePartner.name,
        sender: 'customer',
        message: chatInput.trim()
      })
    });
    setChatInput('');
    loadAll();
  };

  const ongoingBookings = bookings.filter(b => ['pending', 'confirmed', 'assigned', 'in_progress'].includes(b.status));
  const pastBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div>
      {/* 2-Row Sticky Header */}
      <header className="header-wrap">
        <div className="container">
          <div className="header-top">
            <a href="#" className="brand" onClick={(e) => { e.preventDefault(); setView('home'); }}>
              <div className="brand-icon">FH</div>
              <div className="brand-text">
                <strong>FixoHub</strong>
                <span>Home service</span>
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
                onChange={e => { setSearch(e.target.value); if (view !== 'home') setView('home'); }}
              />
              <button
                className="search-circle-btn"
                onClick={() => {
                  setView('home');
                  setTimeout(() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
              >
                <Search size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="btn btn-outline" style={{ padding: 8 }} onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <a href="/partner/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Partner Login
              </a>
            </div>
          </div>

          <div className="header-sub">
            <nav className="sub-links">
              <button className={`sub-link ${view === 'home' ? 'active' : ''}`} style={{ background: 'none', border: 'none' }} onClick={() => setView('home')}>Home</button>
              <button className={`sub-link ${view === 'bookings' ? 'active' : ''}`} style={{ background: 'none', border: 'none' }} onClick={() => setView('bookings')}>My Bookings ({bookings.length})</button>
              <button className={`sub-link ${view === 'requests' ? 'active' : ''}`} style={{ background: 'none', border: 'none' }} onClick={() => setView('requests')}>Custom Requests ({requests.length})</button>
              <button className={`sub-link ${view === 'chats' ? 'active' : ''}`} style={{ background: 'none', border: 'none' }} onClick={() => setView('chats')}>Chats</button>
              <button className={`sub-link ${view === 'profile' ? 'active' : ''}`} style={{ background: 'none', border: 'none' }} onClick={() => setView('profile')}>Profile</button>
              <a href="/admin/" className="sub-link">Admin</a>
            </nav>

            <button className="btn btn-outline-dark" onClick={() => { setBookingSuccess(null); setCartOpen(true); }}>
              <ShoppingBag size={16} /> Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {view === 'home' && (
        <>
          {/* Hero Carousel */}
          <section className="hero-section">
            <div className="container">
              <div className="hero-banner">
                <div className="hero-left">
                  {heroSlide === 0 ? (
                    <>
                      <h1>Reliable &amp; Affordable <span>Home &amp; Tech</span> Services!</h1>
                      <ul className="hero-checks">
                        <li><CheckCircle2 size={16} color="#ffd000" /> Laptop &amp; MacBook Repairs</li>
                        <li><CheckCircle2 size={16} color="#ffd000" /> iPhone &amp; Android OLED Fix</li>
                        <li><CheckCircle2 size={16} color="#ffd000" /> 4K QLED TV &amp; Wall Mount</li>
                        <li><CheckCircle2 size={16} color="#ffd000" /> AC, Plumbing &amp; Accessories</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <h1>Quick &amp; Reliable Services <span>at Your Doorstep!</span></h1>
                      <ul className="hero-checks">
                        <li><CheckCircle2 size={16} color="#ffd000" /> Verified Professionals</li>
                        <li><CheckCircle2 size={16} color="#ffd000" /> Up to 365-Day Warranty</li>
                        <li><CheckCircle2 size={16} color="#ffd000" /> Custom Job Bidding</li>
                        <li><CheckCircle2 size={16} color="#ffd000" /> Live Provider Chat</li>
                      </ul>
                    </>
                  )}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn btn-yellow" onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}>
                      Book Now
                    </button>
                    <button className="btn" style={{ background: 'transparent', color: '#fff', border: '1.5px solid #fff' }} onClick={() => setHeroSlide(heroSlide === 0 ? 1 : 0)}>
                      Explore Services
                    </button>
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

          {/* Choose Your Category */}
          <section className="section" id="categories">
            <div className="container">
              <div className="section-header">
                <div>
                  <h2>Choose Your Category</h2>
                  <p>Pick a service category to explore verified providers and instant pricing</p>
                </div>
                {selectedCat !== 'all' && (
                  <button className="btn btn-outline" onClick={() => setSelectedCat('all')}>Browse All Categories &raquo;</button>
                )}
              </div>

              <div className="cat-grid">
                {categories.map(cat => {
                  const Icon = ICON_MAP[cat.icon] || Wrench;
                  const isActive = selectedCat === cat.id;
                  return (
                    <button key={cat.id} className={`cat-card ${isActive ? 'active' : ''}`} onClick={() => setSelectedCat(isActive ? 'all' : cat.id)}>
                      <div className="cat-icon" style={{ background: cat.color }}><Icon size={20} /></div>
                      <h4>{cat.name}</h4>
                      <p>{cat.tagline}</p>
                    </button>
                  );
                })}
              </div>

              {/* Ongoing Bookings Strip (from PDF screenshot Page 3) */}
              {ongoingBookings.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div className="section-header" style={{ marginBottom: 12 }}>
                    <h3>Ongoing Bookings</h3>
                    <button className="btn btn-outline" onClick={() => setView('bookings')}>View All Bookings</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {ongoingBookings.slice(0, 3).map(b => (
                      <div key={b.id} className="provider-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                          <span>{b.scheduled_date} • {b.scheduled_slot}</span>
                          <span className={`status-badge status-${b.status}`}>{b.status.replace('_', ' ')}</span>
                        </div>
                        <strong style={{ fontSize: '0.94rem' }}>{b.items.map(i => i.name).join(', ')}</strong>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                          <span>Provider: <strong>{b.technician_name || 'Assigning...'}</strong></span>
                          <button className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => setView('chats')}>
                            <MessageSquare size={14} /> Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3 Stat Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-circle"><CheckCircle2 size={22} /></div>
                  <div><strong style={{ fontSize: '1.35rem', display: 'block' }}>4,850+</strong><span style={{ fontSize: '0.84rem', color: '#64748b' }}>Services Completed</span></div>
                </div>
                <div className="stat-card">
                  <div className="stat-circle"><Users size={22} /></div>
                  <div><strong style={{ fontSize: '1.35rem', display: 'block' }}>{providers.length}+ Verified</strong><span style={{ fontSize: '0.84rem', color: '#64748b' }}>Trusted Professionals</span></div>
                </div>
                <div className="stat-card">
                  <div className="stat-circle"><Award size={22} /></div>
                  <div><strong style={{ fontSize: '1.35rem', display: 'block' }}>4.9 ★</strong><span style={{ fontSize: '0.84rem', color: '#64748b' }}>Average Customer Rating</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* Services & Tech Accessories */}
          <section className="section" id="services-section" style={{ paddingTop: 10 }}>
            <div className="container">
              <div className="section-header">
                <div>
                  <h2>{selectedCat === 'all' ? 'Popular Services, Laptops, Mobiles, TVs & Accessories' : categories.find(c => c.id === selectedCat)?.name}</h2>
                  <p>{filteredServices.length} items available with upfront pricing &amp; warranty</p>
                </div>
              </div>

              <div className="services-grid">
                {filteredServices.map(srv => {
                  const qty = getQty(srv.id);
                  const isSaved = bookmarks.includes(srv.id);
                  return (
                    <div key={srv.id} className="srv-card">
                      <div>
                        <div style={{ position: 'relative' }}>
                          <img src={srv.image_url || '/images/ac.jpg'} alt={srv.name} className="srv-photo" loading="lazy" />
                          <button
                            onClick={() => toggleBookmark(srv.id)}
                            style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                            title="Save to Bookmarks"
                          >
                            <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#334155'} />
                          </button>
                        </div>
                        <span className="srv-badge">{srv.category_name}</span>
                        <h3>{srv.name}</h3>
                        <div className="srv-meta">
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                            <Star size={14} fill="#ffd000" color="#ffd000" /> {srv.rating} ({srv.reviews_count})
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {srv.duration_mins}m</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={14} color="#10b981" /> {srv.warranty_days}d</span>
                        </div>
                        <p className="srv-desc">{srv.description}</p>
                        <div className="includes-list">
                          {(srv.includes || []).map((inc, idx) => <span key={idx} className="include-chip">✓ {inc}</span>)}
                        </div>
                      </div>

                      <div className="srv-bottom">
                        <div>
                          <span className="price-now">₹{srv.price}</span>
                          {srv.original_price && <span className="price-old">₹{srv.original_price}</span>}
                        </div>
                        {qty === 0 ? (
                          <button className="btn btn-primary" onClick={() => addToCart(srv)}><Plus size={15} /> Add</button>
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

          {/* Can't find the service? Custom Request Banner (from PDF Page 1-3) */}
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div style={{ background: 'var(--primary-soft)', borderRadius: 16, padding: '26px 24px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: 4 }}>Can't find the service?</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 14 }}>
                  Tell us what you need and verified experts will send you custom bids.
                </p>
                <button className="btn btn-primary" onClick={() => setReqModal(true)}>Request Service</button>
              </div>
            </div>
          </section>

          {/* Previously Bookings Strip (from PDF Page 3) */}
          {pastBookings.length > 0 && (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="container">
                <div className="section-header" style={{ marginBottom: 12 }}>
                  <h3>Previously Bookings</h3>
                  <button className="btn btn-outline" onClick={() => setView('bookings')}>View All Bookings</button>
                </div>
                <div className="providers-grid">
                  {pastBookings.map(b => (
                    <div key={b.id} className="provider-card">
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{b.scheduled_date}</span>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ 5.00</span>
                      </div>
                      <strong>{b.items.map(i => i.name).join(', ')}</strong>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>By {b.technician_name || 'Verified Pro'} • ₹{b.total_amount}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                        <button className="btn btn-outline" onClick={() => setInvoiceModal(b)}>Get Invoice</button>
                        <button className="btn btn-primary" onClick={() => reBook(b)}>Re-Book</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Top Verified Providers */}
          <section className="section" id="providers" style={{ paddingTop: 10 }}>
            <div className="container">
              <div className="section-header">
                <div><h2>Top Verified Providers</h2><p>Multi-vendor partners ready for doorstep visits</p></div>
                <a href="/partner/" className="btn btn-outline" style={{ textDecoration: 'none' }}>Partner Login / Join</a>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 700 }}>★ {p.rating} ({p.jobs_completed} jobs)</span>
                      <button className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => { setActivePartner(p); setView('chats'); }}>
                        <MessageSquare size={14} /> Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="section">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.55rem', marginBottom: 6 }}>Book Trusted Services in Just a Few Simple Steps</h2>
                <p style={{ color: '#64748b' }}>Fast, transparent, and backed by FixoHub service warranty</p>
              </div>
              <div className="steps-grid">
                {[
                  { step: 'Step One', title: 'Choose a Service', desc: 'Browse Laptop, Mobile, TV, Accessories or Home services.' },
                  { step: 'Step Two', title: 'Pick Date & Time', desc: 'Select your preferred doorstep visit slot.' },
                  { step: 'Step Three', title: 'Confirm Booking', desc: 'Instant invoice & live provider assignment.' },
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

          {/* Testimonials */}
          <section className="testimonials-sec">
            <div className="container testi-grid">
              <div>
                <h2 style={{ fontSize: '1.7rem', marginBottom: 10 }}>Trusted by Thousands of Happy Customers</h2>
                <p style={{ color: '#475569', marginBottom: 16 }}>
                  Real feedback from customers who booked Laptop upgrades, OLED phone screens, 4K TV mounts &amp; AC service.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: '#0d0d0d', padding: '10px 16px', borderRadius: 12 }}>
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
                    <span style={{ display: 'inline-block', background: '#fff8db', color: '#b45309', fontSize: '0.76rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, marginBottom: 8 }}>★ 5.00</span>
                    <p style={{ fontSize: '0.88rem', marginBottom: 12 }}>"{t.text}"</p>
                    <strong style={{ fontSize: '0.88rem', display: 'block' }}>{t.name}</strong>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>{t.srv}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Blogs + FAQ */}
          <section className="section">
            <div className="container">
              {blogs.length > 0 && (
                <div style={{ marginBottom: 36 }}>
                  <h2 style={{ marginBottom: 16 }}>Tech &amp; Home Care Guides</h2>
                  <div className="stats-grid" style={{ marginTop: 0 }}>
                    {blogs.map(bl => (
                      <div key={bl.id} className="provider-card">
                        <span className="srv-badge" style={{ width: 'fit-content' }}>{bl.category}</span>
                        <h4>{bl.title}</h4>
                        <p style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>{bl.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="faq-grid">
                <div style={{ background: 'var(--pill-bg)', borderRadius: 16, padding: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-soft)', color: '#0079ff', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                    <HelpCircle size={22} />
                  </div>
                  <h3 style={{ marginBottom: 6 }}>Still Need Help?</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 16 }}>
                    Post a custom request or chat directly with our verified providers.
                  </p>
                  <button className="btn" style={{ background: '#0d0d0d', color: '#fff' }} onClick={() => setView('chats')}>Chat Support</button>
                </div>
                <div>
                  <h2 style={{ marginBottom: 16 }}>Frequently Asked Questions</h2>
                  {FAQS.map((f, idx) => (
                    <div key={idx} className="faq-item">
                      <button onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)} style={{ width: '100%', background: 'none', border: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.95rem', textAlign: 'left' }}>
                        <span>{f.q}</span><ChevronDown size={18} />
                      </button>
                      {openFaq === idx && <p style={{ marginTop: 8, fontSize: '0.86rem', color: 'var(--muted)' }}>{f.a}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* My Bookings Page (matching PDF Pages 4-19) */}
      {view === 'bookings' && (
        <section className="section">
          <div className="container">
            <h2 style={{ marginBottom: 14 }}>My Bookings</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {['all', 'pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'].map(st => (
                <button key={st} className={`btn ${bookingTab === st ? 'btn-primary' : 'btn-outline'}`} onClick={() => setBookingTab(st)} style={{ textTransform: 'capitalize' }}>
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="providers-grid">
              {bookings.filter(b => bookingTab === 'all' || b.status === bookingTab).map(b => (
                <div key={b.id} className="provider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Invoice No <strong>#{b.booking_code}</strong></span>
                    <span className={`status-badge status-${b.status}`}>{b.status.replace('_', ' ')}</span>
                  </div>
                  <strong style={{ fontSize: '0.98rem' }}>{b.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</strong>
                  <div style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>
                    <strong>₹{b.total_amount}</strong> • {b.scheduled_date} • {b.scheduled_slot}
                  </div>
                  <div style={{ fontSize: '0.82rem' }}>Provider: <strong>{b.technician_name || 'Pending Assignment'}</strong></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                    <button className="btn btn-outline" onClick={() => setInvoiceModal(b)}><FileText size={14} /> Invoice</button>
                    <button className="btn btn-primary" onClick={() => reBook(b)}>Book Again</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* My Service Requests & Bids (matching PDF Page 25) */}
      {view === 'requests' && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div><h2>My Service Requests</h2><p>Post custom requirements and accept provider bids</p></div>
              <button className="btn btn-primary" onClick={() => setReqModal(true)}><FilePlus2 size={16} /> Request Service</button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['All', 'Requested', 'Booked'].map(f => (
                <button key={f} className={`btn ${reqFilter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setReqFilter(f)}>{f}</button>
              ))}
            </div>
            <div className="providers-grid">
              {requests.filter(r => reqFilter === 'All' || r.status === reqFilter).map(r => (
                <div key={r.id} className="provider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{r.title}</strong>
                    <span className={`status-badge ${r.status === 'Booked' ? 'status-completed' : 'status-pending'}`}>{r.status}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#0079ff', fontWeight: 700 }}>{r.category_name}</span>
                  <p style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>{r.description}</p>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Budget: ₹{r.min_budget} – ₹{r.max_budget}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {r.bids_count > 0 ? `${r.bids_count} Bid (${r.bid_provider}: ₹${r.bid_amount})` : 'No bids yet'}
                    </span>
                    {r.status !== 'Booked' && r.bids_count > 0 && (
                      <button className="btn btn-primary" style={{ padding: '5px 12px' }} onClick={() => acceptBid(r.id)}>Accept Bid</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chats View (matching PDF Pages 20-24) */}
      {view === 'chats' && (
        <section className="section">
          <div className="container">
            <h2 style={{ marginBottom: 14 }}>Chat with Providers</h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              {['Enquiries', 'Bookings'].map(t => (
                <button key={t} className={`btn ${chatTab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setChatTab(t)}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
              <div className="provider-card" style={{ padding: 10 }}>
                {providers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePartner(p)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: 10, borderRadius: 10, border: 'none', textAlign: 'left',
                      background: activePartner?.id === p.id ? 'var(--primary-soft)' : 'transparent', color: 'inherit'
                    }}
                  >
                    <div className="provider-avatar" style={{ width: 38, height: 38, fontSize: '0.85rem', background: p.avatar_color }}>{p.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.specialty}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="provider-card" style={{ minHeight: 360, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                    {activePartner ? `${activePartner.name} (${activePartner.specialty})` : 'Select a Provider'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 0', maxHeight: 260, overflowY: 'auto' }}>
                    {chats.filter(c => !activePartner || c.partner_id === activePartner.id).map(c => (
                      <div key={c.id} style={{
                        alignSelf: c.sender === 'customer' ? 'flex-end' : 'flex-start',
                        background: c.sender === 'customer' ? '#0079ff' : 'var(--pill-bg)',
                        color: c.sender === 'customer' ? '#fff' : 'var(--text)',
                        padding: '8px 12px', borderRadius: 12, maxWidth: '75%', fontSize: '0.88rem'
                      }}>
                        <div>{c.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <form onSubmit={sendChat} style={{ display: 'flex', gap: 8 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type your message to provider..." style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)' }} />
                  <button type="submit" className="btn btn-primary"><Send size={16} /> Send</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Profile View (matching PDF Page 26) */}
      {view === 'profile' && (
        <section className="section">
          <div className="container" style={{ maxWidth: 820 }}>
            <h2 style={{ marginBottom: 16 }}>My Profile</h2>
            <div className="provider-card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>Guest Customer</h3>
                  <span style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>{city} • FixoHub Member</span>
                </div>
                <button className="btn btn-outline" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="provider-card">
                <h4>Saved Bookmarks ({bookmarks.length})</h4>
                {bookmarks.length === 0 ? <p style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>Tap ❤️ on any service to bookmark it.</p> : (
                  services.filter(s => bookmarks.includes(s.id)).map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>{s.name}</span>
                      <button className="btn btn-primary" style={{ padding: '3px 9px' }} onClick={() => addToCart(s)}>+ Add</button>
                    </div>
                  ))
                )}
              </div>

              <div className="provider-card">
                <h4>Active Promo Codes</h4>
                {promos.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 10px', background: 'var(--primary-soft)', borderRadius: 8 }}>
                    <strong><Tag size={13} /> {p.code}</strong>
                    <span>{p.discount_percent}% OFF (Min ₹{p.min_order})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="provider-card" style={{ marginTop: 16 }}>
              <h4>Saved Addresses</h4>
              {savedAddresses.map((a, idx) => <div key={idx} style={{ fontSize: '0.86rem' }}><MapPin size={14} /> {a}</div>)}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="Add new address..." style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
                <button className="btn btn-primary" onClick={() => {
                  if (!newAddress.trim()) return;
                  const next = [...savedAddresses, newAddress.trim()];
                  setSavedAddresses(next);
                  localStorage.setItem('fh_addresses', JSON.stringify(next));
                  setNewAddress('');
                }}>Save</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Solid Black Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="brand-icon">FH</div>
              <strong style={{ color: '#fff', fontSize: '1.2rem' }}>FixoHub</strong>
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
            <a href="#categories" onClick={() => setView('home')}>Categories</a>
            <a href="#services-section" onClick={() => setView('home')}>Services &amp; Accessories</a>
            <a href="#providers" onClick={() => setView('home')}>Verified Providers</a>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 6 }}>Portals</h4>
            <a href="/admin/">Admin Login</a>
            <a href="/partner/">Partner / Provider Login</a>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 6 }}>Contact Us</h4>
            <a href="tel:+919876543210">+91 98765 43210</a>
            <a href="mailto:support@fixohub.in">support@fixohub.in</a>
            <span style={{ display: 'block', marginTop: 8, fontSize: '0.84rem', color: '#a3a3a3' }}>Mon–Sun: 8:00 AM – 9:00 PM</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav (exact match to PDF screenshots) */}
      <nav className="mobile-bottom-nav">
        <button className="btn" style={{ background: 'none', flexDirection: 'column', gap: 2, fontSize: '0.7rem', color: view === 'home' ? '#0079ff' : 'var(--muted)' }} onClick={() => setView('home')}><Home size={18} />Home</button>
        <button className="btn" style={{ background: 'none', flexDirection: 'column', gap: 2, fontSize: '0.7rem', color: view === 'bookings' ? '#0079ff' : 'var(--muted)' }} onClick={() => setView('bookings')}><ClipboardList size={18} />Bookings</button>
        <button className="btn" style={{ background: 'none', flexDirection: 'column', gap: 2, fontSize: '0.7rem', color: view === 'chats' ? '#0079ff' : 'var(--muted)' }} onClick={() => setView('chats')}><MessageSquare size={18} />Chats</button>
        <button className="btn" style={{ background: 'none', flexDirection: 'column', gap: 2, fontSize: '0.7rem', color: view === 'requests' ? '#0079ff' : 'var(--muted)' }} onClick={() => setView('requests')}><FilePlus2 size={18} />Request</button>
        <button className="btn" style={{ background: 'none', flexDirection: 'column', gap: 2, fontSize: '0.7rem', color: view === 'profile' ? '#0079ff' : 'var(--muted)' }} onClick={() => setView('profile')}><User size={18} />Profile</button>
      </nav>

      {/* Cart & Checkout Drawer */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{bookingSuccess ? 'Booking Confirmed!' : `Your Service Cart (${cartCount})`}</h3>
              <button className="btn btn-outline" style={{ padding: 6 }} onClick={() => setCartOpen(false)}><X size={18} /></button>
            </div>
            <div className="drawer-body">
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                  <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 14px' }} />
                  <h2 style={{ marginBottom: 8 }}>Booking {bookingSuccess.booking_code}</h2>
                  <p style={{ color: '#64748b', marginBottom: 18 }}>
                    Thank you, <strong>{bookingSuccess.customer_name}</strong>! Scheduled for <strong>{bookingSuccess.scheduled_date}</strong> ({bookingSuccess.scheduled_slot}).
                  </p>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setCartOpen(false); setView('bookings'); }}>
                    View My Bookings
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                  <ShoppingBag size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p>Your cart is empty. Add Laptop, Mobile, TV, Accessories or Home services.</p>
                </div>
              ) : (
                <>
                  {/* At Doorstep / At Store toggle */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['At Doorstep', 'At Store'].map(m => (
                      <button key={m} type="button" className={`btn ${visitMode === m ? 'btn-primary' : 'btn-outline'}`} onClick={() => setVisitMode(m)}>{m}</button>
                    ))}
                  </div>

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

                  {/* Promo Code Box */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Promo code (FIXO50, WELCOME20)" style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
                    <button type="button" className="btn btn-outline" onClick={applyPromo}>Apply</button>
                  </div>
                  {appliedPromo && <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>✓ {appliedPromo.code} applied (-₹{discountAmt})</div>}

                  <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="form-group"><label>Full Name *</label><input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} placeholder="Rahul Sharma" /></div>
                    <div className="form-group"><label>Mobile Number *</label><input required value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} placeholder="+91 98765 43210" /></div>
                    <div className="form-group"><label>Complete Address ({city}) *</label><textarea required rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House/Flat No., Street, Landmark" /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div className="form-group"><label>Date *</label><input type="date" required value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} /></div>
                      <div className="form-group"><label>Time Slot *</label><select value={form.scheduled_slot} onChange={e => setForm({ ...form, scheduled_slot: e.target.value })}>{TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    </div>
                    <div className="form-group"><label>Payment Method</label><select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}><option>UPI / RazorPay</option><option>Cash on Visit</option><option>Stripe / Card</option></select></div>
                  </form>
                </>
              )}
            </div>
            {!bookingSuccess && cart.length > 0 && (
              <div className="drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontWeight: 800 }}>
                  <span>Total Payable</span>
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

      {/* Custom Service Request Modal */}
      {reqModal && (
        <div className="modal-center" onClick={() => setReqModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3>Post a Custom Service Request</h3>
              <button className="btn btn-outline" style={{ padding: 6 }} onClick={() => setReqModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={submitCustomRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group"><label>Your Name *</label><input required value={reqForm.customer_name} onChange={e => setReqForm({ ...reqForm, customer_name: e.target.value })} /></div>
              <div className="form-group"><label>Service Title *</label><input required placeholder="e.g. MacBook Pro Hinge & Display Check" value={reqForm.title} onChange={e => setReqForm({ ...reqForm, title: e.target.value })} /></div>
              <div className="form-group"><label>Category</label><select value={reqForm.category_name} onChange={e => setReqForm({ ...reqForm, category_name: e.target.value })}>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
              <div className="form-group"><label>Description *</label><textarea required rows={3} placeholder="Describe the issue..." value={reqForm.description} onChange={e => setReqForm({ ...reqForm, description: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group"><label>Min Budget (₹)</label><input type="number" value={reqForm.min_budget} onChange={e => setReqForm({ ...reqForm, min_budget: e.target.value })} /></div>
                <div className="form-group"><label>Max Budget (₹)</label><input type="number" value={reqForm.max_budget} onChange={e => setReqForm({ ...reqForm, max_budget: e.target.value })} /></div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: 12 }}>Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModal && (
        <div className="modal-center" onClick={() => setInvoiceModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3>Invoice #{invoiceModal.booking_code}</h3>
              <button className="btn btn-outline" style={{ padding: 6 }} onClick={() => setInvoiceModal(null)}><X size={18} /></button>
            </div>
            <p><strong>Customer:</strong> {invoiceModal.customer_name} ({invoiceModal.customer_phone})</p>
            <p><strong>Address:</strong> {invoiceModal.address}, {invoiceModal.city}</p>
            <p><strong>Schedule:</strong> {invoiceModal.scheduled_date} • {invoiceModal.scheduled_slot}</p>
            <hr style={{ margin: '12px 0', borderColor: 'var(--border)' }} />
            {invoiceModal.items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>{it.name} × {it.qty}</span>
                <strong>₹{it.price * it.qty}</strong>
              </div>
            ))}
            <hr style={{ margin: '12px 0', borderColor: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Total Paid</span>
              <span>₹{invoiceModal.total_amount}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => window.print()}>Print / Save PDF Invoice</button>
          </div>
        </div>
      )}
    </div>
  );
}
