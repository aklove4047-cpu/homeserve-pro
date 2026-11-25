import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Wind, Tv, Smartphone, Laptop, Refrigerator, Zap, Wrench, Sparkles,
  Hammer, Paintbrush, ShieldCheck, Droplets, Search, ShoppingBag,
  Star, Clock, CheckCircle2, X, ClipboardList, Plus, Minus,
  Cpu, Users, Award, HelpCircle, ChevronDown, Heart, MessageSquare,
  Send, Tag, FileText, Moon, Sun, Home, User, FilePlus2, MapPin,
  Car, Scissors, Bell, ChevronLeft, ChevronRight, TrendingUp,
  Percent, Shield, Zap as ZapIcon, Package, Phone, Mail, Globe,
  Download, ChevronRight as CR,
  CheckCheck, AlertCircle, Bike, ArrowRight, ThumbsUp, Eye
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

const ICON_MAP = {
  Wind, Tv, Smartphone, Laptop, Refrigerator, Zap, Wrench,
  Sparkles, Hammer, Paintbrush, ShieldCheck, Droplets, Cpu,
  Home, Car, Scissors, Heart, Users, Award, Package
};

const TIME_SLOTS = [
  '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM',
  '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM'
];

const CITIES = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Jaipur', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'];

const HERO_SLIDES = [
  {
    title: 'Reliable & Affordable', span: 'Home Services!',
    checks: ['Laptop Repair & Upgrade', 'Mobile Screen & Battery', 'TV Wall Mount & Repair', 'AC Service & Gas Refill'],
    img: 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=600&q=80'
  },
  {
    title: 'Expert Technicians', span: 'At Your Doorstep!',
    checks: ['Home Deep Cleaning', 'Plumbing & Electrician', 'Chimney & RO Service', 'Pest Control & Painting'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
  },
  {
    title: 'Verified Experts &', span: '365-Day Warranty!',
    checks: ['Up to 365-Day Warranty', 'Custom Bid Requests', 'Live Chat with Providers', 'Instant PDF Invoices'],
    img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'
  }
];

const HERO_TILES = [
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
  'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'
];

const TESTIMONIALS = [
  { name: 'Rohan Mehta', city: 'Delhi', srv: 'iPhone 15 OLED Screen', text: 'Technician arrived in 30 mins and replaced my screen cleanly. TrueTone works perfectly!', rating: 5 },
  { name: 'Priya Nair', city: 'Mumbai', srv: 'Laptop SSD + Repaste', text: 'My gaming laptop boots in 6 seconds now and runs 15°C cooler. Super transparent pricing!', rating: 5 },
  { name: 'Amit Singh', city: 'Bengaluru', srv: 'AC Gas Refill', text: 'The technician ran a nitrogen leak test, refilled R32 gas, and my AC cools like new.', rating: 5 },
  { name: 'Sneha Kapoor', city: 'Pune', srv: 'Home Deep Cleaning', text: '3-person crew with floor scrubbers and eco chemicals. My 2BHK looks showroom fresh!', rating: 5 }
];

const FAQS = [
  { q: 'What is FixoHub?', a: 'FixoHub is an on-demand multi-provider marketplace for Laptop, Mobile, 4K TV, Tech Accessories, AC, Plumbing, Electrician, and Home Cleaning services. Book verified experts at your doorstep in minutes.' },
  { q: 'How do Custom Service Requests & Bids work?', a: "Can't find a service? Post a custom request with your budget. Nearby verified providers send bids within minutes and you can accept the best offer in 1 click." },
  { q: 'Are providers background-verified?', a: 'Yes! Every technician goes through ID verification, skill certification, and customer rating checks before being listed on FixoHub.' },
  { q: 'What warranty do I get?', a: 'All services come with up to 365-day warranty. Accessories have 1-year replacement warranty. If anything goes wrong, we send the same technician back for free.' },
  { q: 'Can I track my booking in real-time?', a: 'Yes! Once a provider accepts your booking, you get live status updates — Assigned → On The Way → Started → Completed. You can also chat directly with the provider.' },
  { q: 'Which payment methods are supported?', a: 'We support UPI, RazorPay, Credit/Debit Cards, Net Banking, Wallets, and Cash on Delivery. All transactions are secured with 256-bit SSL encryption.' },
  { q: 'Can I cancel a booking?', a: 'Free cancellation up to 1 hour before the scheduled slot. After that, a small cancellation fee may apply. Rescheduling is always free.' }
];

const BLOG_IMGS = [
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'
];

const TRACK_STEPS = ['Booked', 'Assigned', 'On Way', 'Started', 'Done'];
const STATUS_TRACK = { pending: 1, confirmed: 1, assigned: 2, in_progress: 3, completed: 5 };

export default function App() {
  const [view, setView] = useState('home');
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
  const [sortBy, setSortBy] = useState('popular');
  const [showNotif, setShowNotif] = useState(false);
  const [lang, setLang] = useState('EN');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [visitMode, setVisitMode] = useState('At Doorstep');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [bookingTab, setBookingTab] = useState('ongoing');
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [svcDetailModal, setSvcDetailModal] = useState(null);
  const [providerModal, setProviderModal] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingText, setRatingText] = useState('');
  const [reqModal, setReqModal] = useState(false);
  const [reqFilter, setReqFilter] = useState('All');
  const [chatTab, setChatTab] = useState('Enquiries');
  const [activePartner, setActivePartner] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [loyaltyPoints] = useState(1240);
  const [showCityPop, setShowCityPop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fh_bookmarks') || '[]'); } catch { return []; }
  });

  const [reqForm, setReqForm] = useState({
    customer_name: 'Rahul Sharma', title: '', category_name: 'Laptop & PC', description: '', min_budget: 500, max_budget: 2500
  });

  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', address: '',
    scheduled_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    scheduled_slot: TIME_SLOTS[1], payment_method: 'UPI / RazorPay', notes: ''
  });

  useEffect(() => { document.body.classList.toggle('dark', darkMode); }, [darkMode]);

  const loadAll = async () => {
    const [cats, srvs, techs, bks, reqs, prms, chts, blgs] = await Promise.all([
      fetch(`${API}/api/categories`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/services`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/technicians`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/bookings`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/requests`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/promocodes`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/chats`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/blogs`).then(r => r.json()).catch(() => [])
    ]);
    setCategories(cats); setServices(srvs); setProviders(techs);
    setBookings(bks); setRequests(reqs); setPromos(prms); setChats(chts); setBlogs(blgs);
    if (!activePartner && techs.length) setActivePartner(techs[0]);
  };

  useEffect(() => {
    loadAll().catch(console.error);
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredServices = useMemo(() => {
    const list = services.filter(s => {
      const matchCat = selectedCat === 'all' || s.category_id === selectedCat;
      const q = search.trim().toLowerCase();
      return matchCat && (!q || s.name.toLowerCase().includes(q) || (s.category_name || '').toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    });
    if (sortBy === 'price_asc') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [services, selectedCat, search, sortBy]);

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

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  const getQty = id => cart.find(i => i.id === id)?.qty || 0;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = appliedPromo ? Math.min(Math.round(subTotal * (appliedPromo.discount_percent / 100)), appliedPromo.max_discount) : 0;
  const cartTotal = Math.max(0, subTotal - discountAmt);
  const taxAmt = Math.round(cartTotal * 0.18);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promos.find(p => p.code === code && p.is_active);
    if (!found) return alert('Invalid promo code. Try FIXO50, WELCOME20 or TECH15');
    if (subTotal < found.min_order) return alert(`Min order ₹${found.min_order} required`);
    setAppliedPromo(found);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, city, notes: `${visitMode}${appliedPromo ? ` | Promo: ${appliedPromo.code}` : ''}${form.notes ? ` | ${form.notes}` : ''}`, items: cart, source: 'website' })
      });
      const data = await res.json();
      if (res.ok) { setBookingSuccess(data); setCart([]); setAppliedPromo(null); loadAll(); }
      else alert(data.error || 'Could not create booking');
    } finally { setSubmitting(false); }
  };

  const submitCustomRequest = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqForm) });
    if (res.ok) { setReqModal(false); setReqForm({ customer_name: 'Rahul Sharma', title: '', category_name: 'Laptop & PC', description: '', min_budget: 500, max_budget: 2500 }); await loadAll(); setView('requests'); }
  };

  const acceptBid = async (reqId) => {
    await fetch(`${API}/api/requests/${reqId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Booked' }) });
    loadAll();
  };

  const sendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activePartner) return;
    await fetch(`${API}/api/chats`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partner_id: activePartner.id, partner_name: activePartner.name, sender: 'customer', message: chatInput.trim() }) });
    setChatInput(''); loadAll();
  };

  const ongoingBookings = bookings.filter(b => ['pending', 'confirmed', 'assigned', 'in_progress'].includes(b.status));
  const pastBookings = bookings.filter(b => b.status === 'completed');

  // Discount calc for display
  const discPct = (p, op) => op > p ? Math.round(((op - p) / op) * 100) : 0;

  // ===================== SERVICE CARD =====================
  const SrvCard = ({ srv, horizontal }) => {
    const qty = getQty(srv.id);
    const isSaved = bookmarks.includes(srv.id);
    const dp = discPct(srv.price, srv.original_price);
    return (
      <div className="srv-card" style={horizontal ? { minWidth: 272 } : {}}>
        <div className="srv-img-wrap">
          <img
            src={srv.image_url || `https://source.unsplash.com/400x250/?${encodeURIComponent(srv.category_name || 'service')}`}
            alt={srv.name} className="srv-photo" loading="lazy"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=400&q=80'; }}
          />
          <div className="srv-rating-badge">
            <Star size={11} fill="#ffd000" color="#ffd000" /> {srv.rating} ({srv.reviews_count})
          </div>
          <button className="srv-bookmark-btn" onClick={() => toggleBookmark(srv.id)}>
            <Heart size={15} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#475569'} />
          </button>
          <span className="srv-cat-label">{srv.category_name}</span>
          {dp > 0 && <span className="srv-discount-badge">{dp}% OFF</span>}
        </div>
        <div className="srv-body" onClick={() => setSvcDetailModal(srv)} style={{ cursor: 'pointer' }}>
          <div className="srv-title">{srv.name}</div>
          <div className="srv-meta-row">
            <span className="srv-meta-item"><Clock size={12} /> {srv.duration_mins}m</span>
            <span className="srv-meta-item"><ShieldCheck size={12} color="#10b981" /> {srv.warranty_days}d warranty</span>
          </div>
          <p className="srv-desc">{srv.description}</p>
          <div className="includes-list">
            {(srv.includes || []).slice(0, 3).map((inc, i) => <span key={i} className="include-chip">✓ {inc}</span>)}
          </div>
        </div>
        <div className="srv-bottom">
          <div>
            <span className="price-now">₹{srv.price}</span>
            {srv.original_price > srv.price && <span className="price-old">₹{srv.original_price}</span>}
          </div>
          {qty === 0 ? (
            <button className="btn btn-primary btn-sm" onClick={() => addToCart(srv)}><Plus size={14} /> Add</button>
          ) : (
            <div className="qty-stepper">
              <button onClick={() => updateQty(srv.id, -1)}><Minus size={13} /></button>
              <span>{qty}</span>
              <button onClick={() => updateQty(srv.id, 1)}><Plus size={13} /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===================== INVOICE GENERATOR =====================
  const InvoiceModal = ({ booking }) => (
    <div className="modal-bg" onClick={() => setInvoiceModal(null)}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 480 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div><strong style={{ fontSize: '1.1rem' }}>FixoHub Invoice</strong><div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>#{booking.id} • {booking.created_at?.slice(0, 10)}</div></div>
          <button onClick={() => setInvoiceModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem' }}>✕</button>
        </div>
        <div style={{ background: '#f7f9fc', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <strong>{booking.customer_name}</strong>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{booking.address} • {booking.city}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{booking.scheduled_date} @ {booking.scheduled_slot}</div>
        </div>
        {(booking.items || []).map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
            <span>{item.name} × {item.qty}</span>
            <strong>₹{item.price * item.qty}</strong>
          </div>
        ))}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.86rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{booking.total_amount}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}><span>Promo Discount</span><span>-₹0</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>GST 18%</span><span>₹{Math.round(booking.total_amount * 0.18)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', borderTop: '2px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
            <span>Total Paid</span><span>₹{Math.round(booking.total_amount * 1.18)}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          <button className="btn btn-outline" onClick={() => window.print()}>🖨 Print</button>
          <button className="btn btn-primary" onClick={() => setInvoiceModal(null)}>✓ Done</button>
        </div>
      </div>
    </div>
  );

  // ===================== SERVICE DETAIL MODAL =====================
  const SvcDetailModal = ({ srv }) => {
    const qty = getQty(srv.id);
    return (
      <div className="modal-bg" onClick={() => setSvcDetailModal(null)}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div style={{ position: 'relative' }}>
            <img
              src={srv.image_url || 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=600&q=80'}
              alt={srv.name} className="modal-photo"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=600&q=80'; }}
            />
            <button onClick={() => setSvcDetailModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center', color: '#fff' }}><X size={16} /></button>
            <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(0,121,255,0.9)', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700 }}>{srv.category_name}</div>
          </div>
          <div className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{srv.name}</h2>
              <button onClick={() => toggleBookmark(srv.id)} style={{ background: 'none', border: 'none' }}>
                <Heart size={20} fill={bookmarks.includes(srv.id) ? '#ef4444' : 'none'} color={bookmarks.includes(srv.id) ? '#ef4444' : '#475569'} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.84rem' }}><Star size={14} fill="#ffd000" color="#ffd000" /> <strong>{srv.rating}</strong> ({srv.reviews_count} reviews)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.84rem' }}><Clock size={14} /> {srv.duration_mins} mins</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.84rem' }}><ShieldCheck size={14} color="#10b981" /> {srv.warranty_days}-day warranty</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: 16, lineHeight: 1.6 }}>{srv.description}</p>
            {(srv.includes || []).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: 8 }}>What's Included</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {(srv.includes || []).map((inc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem' }}>
                      <CheckCircle2 size={14} color="#10b981" /> {inc}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ background: '#f7f9fc', borderRadius: 12, padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16, textAlign: 'center' }}>
              <div><div style={{ fontSize: '1rem', fontWeight: 800 }}>{srv.rating} ★</div><div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Rating</div></div>
              <div><div style={{ fontSize: '1rem', fontWeight: 800 }}>{srv.reviews_count}</div><div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Reviews</div></div>
              <div><div style={{ fontSize: '1rem', fontWeight: 800 }}>{srv.warranty_days}d</div><div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Warranty</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '2px solid var(--border)', borderRadius: 14, padding: '14px 18px', position: 'sticky', bottom: 0 }}>
              <div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{srv.price}</span>
                {srv.original_price > srv.price && <span style={{ fontSize: '0.88rem', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: 8 }}>₹{srv.original_price}</span>}
              </div>
              {getQty(srv.id) === 0 ? (
                <button className="btn btn-primary" onClick={() => { addToCart(srv); setSvcDetailModal(null); }}><Plus size={16} /> Add to Cart</button>
              ) : (
                <div className="qty-stepper">
                  <button onClick={() => updateQty(srv.id, -1)}><Minus size={14} /></button>
                  <span>{getQty(srv.id)}</span>
                  <button onClick={() => updateQty(srv.id, 1)}><Plus size={14} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===================== PROVIDER PROFILE MODAL =====================
  const ProviderModal = ({ p }) => (
    <div className="modal-bg" onClick={() => setProviderModal(null)}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="prov-av" style={{ background: p.avatar_color || '#0079ff', width: 64, height: 64, fontSize: '1.4rem' }}>
                {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{p.name}</strong>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{p.specialty}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{p.city}</div>
              </div>
            </div>
            <button onClick={() => setProviderModal(null)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18, textAlign: 'center' }}>
            <div style={{ background: '#f7f9fc', borderRadius: 10, padding: '12px 8px' }}><div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{p.rating} ★</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Rating</div></div>
            <div style={{ background: '#f7f9fc', borderRadius: 10, padding: '12px 8px' }}><div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{p.jobs_completed}</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Jobs Done</div></div>
            <div style={{ background: '#f7f9fc', borderRadius: 10, padding: '12px 8px' }}><div style={{ fontSize: '1.1rem', fontWeight: 800 }}>3 yrs</div><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Experience</div></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: 10 }}>Services Offered</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {services.filter(s => s.category_name === p.specialty).slice(0, 6).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: '#f7f9fc', borderRadius: 10, padding: '8px 12px' }}>
                  <span style={{ fontSize: '0.84rem' }}>{s.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>₹{s.price}</span>
                    <button className="btn btn-primary btn-sm" onClick={() => { addToCart(s); setProviderModal(null); }}><Plus size={12} /> Add</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="btn btn-outline" onClick={() => { setActivePartner(p); setProviderModal(null); setView('chats'); }}><MessageSquare size={15} /> Chat</button>
            <button className="btn btn-primary" onClick={() => { setCartOpen(true); setProviderModal(null); }}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===================== BOOKING TRACKER =====================
  const BookingTracker = ({ status }) => {
    const idx = STATUS_TRACK[status] || 1;
    return (
      <div>
        <div className="booking-track">
          {TRACK_STEPS.map((step, i) => (
            <div key={step} className="track-step">
              <div className={`track-dot ${i < idx ? 'done' : i === idx - 1 ? 'active' : ''}`}>
                {i < idx ? <CheckCheck size={11} /> : i + 1}
              </div>
              {i < TRACK_STEPS.length - 1 && <div className={`track-line ${i < idx - 1 ? 'done' : ''}`} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {TRACK_STEPS.map((s, i) => <span key={s} className="track-label" style={{ color: i < idx ? 'var(--primary)' : 'var(--muted)', fontWeight: i === idx - 1 ? 700 : 400 }}>{s}</span>)}
        </div>
      </div>
    );
  };

  // ===================== RENDER =====================
  return (
    <div>
      {/* ===== HEADER ===== */}
      <header className="header-wrap">
        <div className="container">
          <div className="header-top">
            <a href="#" className="brand" onClick={e => { e.preventDefault(); setView('home'); }}>
              <div className="brand-logo">FH</div>
              <div className="brand-text">
                <strong>FixoHub</strong>
                <span>Home & Tech Services</span>
              </div>
            </a>

            <div className="pill-search">
              <div style={{ position: 'relative' }}>
                <select value={city} onChange={e => setCity(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Search Laptop, Mobile, TV, AC, Cleaning..." value={search}
                onChange={e => { setSearch(e.target.value); if (view !== 'home') setView('home'); }}
                onKeyDown={e => { if (e.key === 'Enter') { setView('home'); setTimeout(() => document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' }), 50); } }}
              />
              <button className="search-btn" onClick={() => { setView('home'); setTimeout(() => document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>
                <Search size={15} />
              </button>
            </div>

            <div className="h-actions">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f7f9fc', borderRadius: 20, padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid var(--border)', cursor: 'pointer' }}
                onClick={() => setShowCityPop(!showCityPop)}>
                <MapPin size={14} color="var(--primary)" /> {city} <ChevronDown size={12} />
              </div>
              <button className="icon-btn" onClick={() => setShowNotif(!showNotif)} title="Notifications">
                <Bell size={16} />
                <span className="notif-dot" />
              </button>
              <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <a href="/partner/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                {lang === 'HI' ? 'पार्टनर' : 'Partner Login'}
              </a>
              {showNotif && (
                <div style={{ position: 'absolute', top: 46, right: 0, width: 300, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 14, boxShadow: '0 12px 32px rgba(0,0,0,0.15)', zIndex: 80 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
                    <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--muted)' }}>Mark all read</button>
                  </div>
                  {[
                    { icon: '🔧', msg: 'Booking #11059: Provider is On The Way!', time: '2 min ago' },
                    { icon: '🎁', msg: 'Promo FIXO50: Get 50% OFF on next order!', time: '1h ago' },
                    { icon: '💬', msg: '1 new bid received on your Custom Request!', time: '3h ago' },
                    { icon: '⭐', msg: 'Rate your last Laptop Repair service', time: 'Yesterday' }
                  ].map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.1rem' }}>{n.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.8rem' }}>{n.msg}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="header-sub">
            <nav className="sub-links">
              {[['home', 'Home'], ['bookings', `Bookings (${bookings.length})`], ['requests', `Requests (${requests.length})`], ['chats', 'Chats'], ['profile', 'Profile']].map(([v, label]) => (
                <button key={v} className={`sub-link ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>{label}</button>
              ))}
              <a href="/admin/" className="sub-link">Admin</a>
            </nav>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: 20 }}>
                🏅 {loyaltyPoints} pts
              </div>
              <button className="btn btn-outline-dark" style={{ padding: '7px 14px' }} onClick={() => { setBookingSuccess(null); setCartOpen(true); }}>
                <ShoppingBag size={15} /> Cart {cartCount > 0 && <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HOME VIEW ===== */}
      {view === 'home' && (
        <>
          {/* HERO */}
          <section className="hero-section">
            <div className="container">
              <div className="hero-banner">
                <div className="hero-left">
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 999, marginBottom: 14, backdropFilter: 'blur(4px)' }}>
                    🔥 50% OFF on First Booking — Use WELCOME20
                  </div>
                  <h1>
                    {HERO_SLIDES[heroSlide].title} <span>{HERO_SLIDES[heroSlide].span}</span>
                  </h1>
                  <ul className="hero-checks">
                    {HERO_SLIDES[heroSlide].checks.map((c, i) => (
                      <li key={i}><CheckCircle2 size={15} color="#ffd000" /> {c}</li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18, fontSize: '0.84rem', opacity: 0.88 }}>
                    <span>📍 {city}</span>
                    <span>⭐ 4.9 Avg Rating</span>
                    <span>✅ 50,000+ Orders</span>
                  </div>
                  <div className="hero-btns">
                    <button className="btn btn-yellow" onClick={() => document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' })}>
                      Book Now
                    </button>
                    <button className="btn" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.6)' }}
                      onClick={() => setReqModal(true)}>
                      Custom Request
                    </button>
                    <div className="hero-dots">
                      {HERO_SLIDES.map((_, i) => (
                        <button key={i} className={`hero-dot ${heroSlide === i ? 'active' : ''}`} onClick={() => setHeroSlide(i)} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hero-right">
                  {HERO_TILES.map((src, i) => (
                    <img key={i} src={src} alt={`Service ${i + 1}`} className="hero-tile"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=400&q=80'; }}
                    />
                  ))}
                  <div className="hero-badge">🏅 Verified Pros Only</div>
                </div>
              </div>
            </div>
          </section>

          {/* TRUST BAR */}
          <section style={{ padding: '0 0 8px' }}>
            <div className="container">
              <div className="trust-bar">
                {[
                  { icon: '🛡️', text: 'Background Verified Pros' },
                  { icon: '📅', text: '365-Day Service Warranty' },
                  { icon: '🔁', text: 'Free Rescheduling' },
                  { icon: '💳', text: 'Secure UPI & Card Payments' },
                  { icon: '📍', text: 'Doorstep & Store Service' },
                  { icon: '💬', text: 'Live Chat Support' }
                ].map((t, i) => (
                  <div key={i} className="trust-item">
                    <span className="trust-icon">{t.icon}</span> {t.text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROMO BANNERS */}
          {promos.length > 0 && (
            <section className="section-sm">
              <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {promos.slice(0, 3).map(p => (
                    <div key={p.id} className="promo-banner">
                      <div>
                        <div style={{ fontSize: '0.76rem', color: '#78350f', marginBottom: 4 }}>{p.description}</div>
                        <div className="promo-code">{p.code}</div>
                        <div style={{ fontSize: '0.74rem', color: '#92400e', marginTop: 2 }}>Min. order ₹{p.min_order} • Save up to ₹{p.max_discount}</div>
                      </div>
                      <div style={{ background: '#fef3c7', border: '2px solid #fcd34d', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309' }}>{p.discount_percent}%</div>
                        <div style={{ fontSize: '0.68rem', color: '#92400e', fontWeight: 600 }}>OFF</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CATEGORIES */}
          <section className="section" id="categories">
            <div className="container">
              <div className="sec-header">
                <div>
                  <h2>Choose Your Category</h2>
                  <p>Browse 10+ categories with verified providers & instant pricing</p>
                </div>
                {selectedCat !== 'all' && (
                  <button className="btn btn-outline" onClick={() => setSelectedCat('all')}>All Categories</button>
                )}
              </div>
              <div className="cat-grid">
                {categories.map(cat => {
                  const Icon = ICON_MAP[cat.icon] || Wrench;
                  const count = services.filter(s => s.category_id === cat.id).length;
                  return (
                    <button key={cat.id} className={`cat-card ${selectedCat === cat.id ? 'active' : ''}`} onClick={() => { setSelectedCat(selectedCat === cat.id ? 'all' : cat.id); document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' }); }}>
                      <div className="cat-icon-box" style={{ background: cat.color }}>
                        <Icon size={22} />
                      </div>
                      <h4>{cat.name}</h4>
                      <p>{cat.tagline}</p>
                      <span className="cat-svc-count">{count} services</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* STATS STRIP */}
          <section className="section-sm">
            <div className="container">
              <div className="stats-strip">
                {[
                  { icon: <CheckCircle2 size={22} />, num: '50,000+', label: 'Services Completed' },
                  { icon: <Users size={22} />, num: `${providers.length}+ Verified`, label: 'Trusted Professionals' },
                  { icon: <Award size={22} />, num: '4.9 ★', label: 'Average Rating' },
                  { icon: <Shield size={22} />, num: '365-Day', label: 'Service Warranty' }
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-circle">{s.icon}</div>
                    <div><span className="stat-num">{s.num}</span><span className="stat-label">{s.label}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FEATURED PROVIDERS */}
          {providers.length > 0 && (
            <section className="section-sm">
              <div className="container">
                <div className="sec-header" style={{ marginBottom: 14 }}>
                  <div><h2>Featured Ad Providers</h2><p>Top-rated pros with exclusive deals this week</p></div>
                  <a href="/partner/" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>Join as Partner →</a>
                </div>
                <div className="featured-scroll">
                  {providers.map(p => (
                    <div key={p.id} className="feat-prov-card" onClick={() => setProviderModal(p)} style={{ cursor: 'pointer' }}>
                      <div className="feat-prov-top">
                        <div className="prov-av" style={{ background: p.avatar_color || '#0079ff' }}>
                          {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{p.specialty}</div>
                          <div className="feat-prov-stars">★ {p.rating}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="prov-promo">GET{Math.floor(Math.random() * 3 + 1) * 10}% OFF</span>
                        <span className="feat-prov-jobs">{p.jobs_completed} jobs</span>
                      </div>
                      <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>View Profile</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ONGOING BOOKINGS */}
          {ongoingBookings.length > 0 && (
            <section className="section-sm">
              <div className="container">
                <div className="sec-header" style={{ marginBottom: 14 }}>
                  <h2>Ongoing Bookings</h2>
                  <button className="btn btn-outline btn-sm" onClick={() => setView('bookings')}>View All</button>
                </div>
                <div className="providers-grid">
                  {ongoingBookings.slice(0, 3).map(b => (
                    <div key={b.id} className="booking-card">
                      <div className="booking-card-header">
                        <div>
                          <strong style={{ fontSize: '0.94rem' }}>{b.items.map(i => i.name).join(', ')}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>{b.scheduled_date} • {b.scheduled_slot}</div>
                        </div>
                        <span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span>
                      </div>
                      <BookingTracker status={b.status} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', alignItems: 'center' }}>
                        <span>Provider: <strong>{b.technician_name || 'Assigning...'}</strong></span>
                        <button className="btn btn-outline btn-sm" onClick={() => setView('chats')}><MessageSquare size={13} /> Chat</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* HORIZONTAL SCROLL — Popular in Laptop & PC */}
          {categories.slice(0, 3).map(cat => {
            const catSrvs = services.filter(s => s.category_id === cat.id).slice(0, 8);
            if (!catSrvs.length) return null;
            return (
              <section key={cat.id} className="section-sm">
                <div className="container">
                  <div className="sec-header" style={{ marginBottom: 14 }}>
                    <div>
                      <h2>{cat.name} Solutions</h2>
                      <p>Top services in {cat.name} — book now with upfront pricing</p>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => { setSelectedCat(cat.id); document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' }); }}>
                      See All →
                    </button>
                  </div>
                  <div className="h-scroll-row">
                    {catSrvs.map(srv => <SrvCard key={srv.id} srv={srv} horizontal />)}
                  </div>
                </div>
              </section>
            );
          })}

          {/* ALL SERVICES */}
          <section className="section" id="svc-sec">
            <div className="container">
              <div className="sec-header">
                <div>
                  <h2>{selectedCat === 'all' ? 'All Services & Solutions' : categories.find(c => c.id === selectedCat)?.name}</h2>
                  <p>{filteredServices.length} services with upfront pricing & warranty</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['At Doorstep', 'At Store'].map(m => (
                      <button key={m} onClick={() => setVisitMode(m)} className="btn btn-sm" style={{ background: visitMode === m ? 'var(--primary)' : '#fff', color: visitMode === m ? '#fff' : '#334155', border: '1.5px solid', borderColor: visitMode === m ? 'var(--primary)' : '#d4d9e0' }}>{m}</button>
                    ))}
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', borderRadius: 9, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, fontSize: '0.84rem' }}>
                    <option value="popular">Popular</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {filteredServices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <Search size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                  <h3>No services found</h3>
                  <p style={{ marginBottom: 16 }}>Try a different search or browse by category</p>
                  <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCat('all'); }}>Reset Filters</button>
                </div>
              ) : (
                <div className="services-grid">
                  {filteredServices.map(srv => <SrvCard key={srv.id} srv={srv} />)}
                </div>
              )}
            </div>
          </section>

          {/* CAN'T FIND SERVICE */}
          <section className="section-sm">
            <div className="container">
              <div style={{ background: 'var(--primary-soft)', borderRadius: 16, padding: '28px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>Can't find the service?</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--muted)' }}>Tell us what you need and verified experts will send you custom bids within minutes.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setReqModal(true)}><FilePlus2 size={16} /> Post Custom Request</button>
              </div>
            </div>
          </section>

          {/* MID CTA BANNER */}
          <section className="section-sm">
            <div className="container">
              <div className="mid-cta">
                <div>
                  <h2>Book a Service in <span style={{ color: '#ffd000' }}>60 Seconds!</span></h2>
                  <p>Transparent pricing, certified experts, and real-time tracking at your fingertips.</p>
                  <div className="mid-cta-tags">
                    {['Laptop Repair', 'Mobile Screen', 'AC Service', 'Deep Cleaning', 'TV Mount', 'Plumbing', 'Electrician'].map(t => (
                      <span key={t} className="cta-tag">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn btn-yellow" onClick={() => document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' })}>Explore All Services</button>
                    <button className="btn" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)' }} onClick={() => setReqModal(true)}>Custom Request</button>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=300&q=80" alt="Technician" className="mid-cta-img"
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
            </div>
          </section>

          {/* TOP PROVIDERS */}
          <section className="section" id="providers">
            <div className="container">
              <div className="sec-header">
                <div><h2>Top Verified Providers</h2><p>Multi-vendor partners ready for doorstep visits</p></div>
                <a href="/partner/" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>Partner Login / Join →</a>
              </div>
              <div className="providers-grid">
                {providers.map(p => (
                  <div key={p.id} className="provider-card" onClick={() => setProviderModal(p)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="provider-avatar" style={{ background: p.avatar_color || '#0079ff' }}>
                        {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.94rem', fontWeight: 700 }}>{p.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{p.specialty} • {p.city}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, fontSize: '0.76rem', textAlign: 'center' }}>
                      <div style={{ background: '#f7f9fc', borderRadius: 8, padding: '5px 4px' }}><strong>★ {p.rating}</strong><div style={{ color: 'var(--muted)', fontSize: '0.68rem' }}>Rating</div></div>
                      <div style={{ background: '#f7f9fc', borderRadius: 8, padding: '5px 4px' }}><strong>{p.jobs_completed}</strong><div style={{ color: 'var(--muted)', fontSize: '0.68rem' }}>Jobs</div></div>
                      <div style={{ background: '#d1fae5', borderRadius: 8, padding: '5px 4px' }}><strong style={{ color: '#047857' }}>✓</strong><div style={{ color: '#047857', fontSize: '0.68rem' }}>Verified</div></div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); setActivePartner(p); setView('chats'); }}><MessageSquare size={13} /> Chat</button>
                      <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); setCartOpen(true); }}>Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="section" style={{ background: '#fff', padding: '44px 0' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>Book Trusted Services in 4 Simple Steps</h2>
                <p style={{ color: 'var(--muted)' }}>Fast, transparent, and backed by FixoHub guarantee</p>
              </div>
              <div className="steps-grid">
                {[
                  { n: '1', pill: 'Step One', title: 'Choose a Service', desc: 'Browse 100+ Laptop, Mobile, TV, AC & Home services by category or search.', icon: <Search size={20} color="var(--primary)" /> },
                  { n: '2', pill: 'Step Two', title: 'Pick Date & Time', desc: 'Select your preferred doorstep slot from morning to evening — 7 days a week.', icon: <Clock size={20} color="var(--primary)" /> },
                  { n: '3', pill: 'Step Three', title: 'Confirm & Pay', desc: 'Instant invoice, provider assignment, UPI / Card / COD — 100% secure.', icon: <ShieldCheck size={20} color="var(--primary)" /> },
                  { n: '4', pill: 'Step Four', title: 'Get It Done + Rate', desc: 'Verified pro arrives, completes service with warranty & you rate the job.', icon: <Award size={20} color="var(--primary)" /> }
                ].map((s, i) => (
                  <div key={i} className="step-card">
                    <div className="step-num">{s.n}</div>
                    <span className="step-pill">{s.pill}</span>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="testimonials-sec">
            <div className="container">
              <div className="testi-wrap">
                <div className="testi-left">
                  <h2>Trusted by Thousands of Happy Customers</h2>
                  <p>Real feedback from customers who booked Laptop upgrades, OLED screens, 4K TV mounts, AC service and Home Cleaning through FixoHub.</p>
                  <div className="rating-pill">
                    <span className="rating-num">4.9</span>
                    <span className="rating-stars">★★★★★</span>
                    <span className="rating-txt">Based on 12,400+ Reviews</span>
                  </div>
                  <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {['Instant Booking', '365-Day Warranty', 'Expert Technicians', 'Doorstep Service'].map(t => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.84rem', fontWeight: 600, color: '#1d4ed8' }}>
                        <CheckCircle2 size={14} color="#1d4ed8" /> {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="testi-cards">
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="testi-card">
                      <div className="testi-stars">{'★'.repeat(t.rating)}</div>
                      <p className="testi-quote">"{t.text}"</p>
                      <strong className="testi-name">{t.name}</strong>
                      <span className="testi-svc">{t.srv}</span>
                      <div className="testi-date">{t.city}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* BLOGS */}
          {blogs.length > 0 && (
            <section className="section">
              <div className="container">
                <div className="sec-header">
                  <div><h2>Tech & Home Care Guides</h2><p>Expert tips to maintain your devices and home</p></div>
                  <button className="btn btn-outline btn-sm">View All Guides →</button>
                </div>
                <div className="blogs-grid">
                  {blogs.slice(0, 3).map((bl, i) => (
                    <div key={bl.id} className="blog-card">
                      <img src={BLOG_IMGS[i % BLOG_IMGS.length]} alt={bl.title} className="blog-img"
                        onError={e => { e.target.style.display = 'none'; }} />
                      <div className="blog-body">
                        <span className="blog-cat">{bl.category}</span>
                        <div className="blog-title">{bl.title}</div>
                        <div className="blog-summary">{bl.summary}</div>
                        <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>Read More →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="faq-wrap">
                <div className="faq-left">
                  <div style={{ width: 48, height: 48, background: 'var(--primary-soft)', borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                    <HelpCircle size={24} color="var(--primary)" />
                  </div>
                  <h3 style={{ marginBottom: 10 }}>Still Need Help?</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>Post a custom request or chat directly with our verified providers. 24/7 support available.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button className="btn btn-primary" onClick={() => setView('chats')}><MessageSquare size={15} /> Chat Support</button>
                    <button className="btn btn-outline" onClick={() => setReqModal(true)}><FilePlus2 size={15} /> Post a Request</button>
                    <div style={{ marginTop: 10, padding: '12px 14px', background: 'var(--primary-soft)', borderRadius: 10 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>📞 Customer Support</div>
                      <div style={{ fontSize: '0.84rem', color: '#334155' }}>1800-FIXOHUB (Mon–Sun 7AM–10PM)</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
                  <div className="faq-list">
                    {FAQS.map((f, i) => (
                      <div key={i} className="faq-item">
                        <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                          {f.q}
                          <ChevronDown size={16} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                        </button>
                        {openFaq === i && <div className="faq-a">{f.a}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* APP DOWNLOAD */}
          <section className="section-sm">
            <div className="container">
              <div className="app-download">
                <div>
                  <h2>Get the FixoHub App</h2>
                  <p>Book services, track your provider in real-time, chat and pay — all from your phone.</p>
                  <div className="app-badges">
                    <a href="#" className="app-badge">
                      <span style={{ fontSize: '1.4rem' }}>📱</span>
                      <div><span className="ab-title">Download on</span><span className="ab-name">Google Play</span></div>
                    </a>
                    <a href="#" className="app-badge">
                      <span style={{ fontSize: '1.4rem' }}>🍎</span>
                      <div><span className="ab-title">Download on</span><span className="ab-name">App Store</span></div>
                    </a>
                    <a href="/HomeServePro.apk" className="app-badge" download>
                      <Download size={20} />
                      <div><span className="ab-title">Direct</span><span className="ab-name">APK Download</span></div>
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd000' }}>4.9 ★</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>12,400+ reviews</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd000' }}>50K+</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>Happy customers</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ===== BOOKINGS VIEW ===== */}
      {view === 'bookings' && (
        <div className="container section">
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, flex: 1 }}>My Bookings</h2>
            {[['ongoing', 'Ongoing'], ['past', 'Past'], ['cancelled', 'Cancelled']].map(([t, l]) => (
              <button key={t} onClick={() => setBookingTab(t)} className="btn btn-sm" style={{ background: bookingTab === t ? 'var(--primary)' : '#fff', color: bookingTab === t ? '#fff' : '#334155', border: '1.5px solid', borderColor: bookingTab === t ? 'var(--primary)' : '#d4d9e0' }}>{l}</button>
            ))}
          </div>

          {bookingTab === 'ongoing' && (
            <>
              {ongoingBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
                  <ClipboardList size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p>No ongoing bookings. <button className="btn btn-primary btn-sm" style={{ marginLeft: 8 }} onClick={() => setView('home')}>Book a Service</button></p>
                </div>
              ) : ongoingBookings.map(b => (
                <div key={b.id} className="booking-card" style={{ marginBottom: 16 }}>
                  <div className="booking-card-header">
                    <div>
                      <strong>{b.items?.map(i => i.name).join(', ')}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{b.scheduled_date} • {b.scheduled_slot}</div>
                    </div>
                    <span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span>
                  </div>
                  <BookingTracker status={b.status} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.78rem' }}>
                    <div><span style={{ color: 'var(--muted)' }}>Provider</span><br /><strong>{b.technician_name || 'Assigning...'}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Address</span><br /><strong>{b.city}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Amount</span><br /><strong>₹{b.total_amount}</strong></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setActivePartner(providers.find(p => p.name === b.technician_name) || providers[0])}><MessageSquare size={13} /> Chat</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setInvoiceModal(b)}><FileText size={13} /> Invoice</button>
                    <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>Reschedule</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {bookingTab === 'past' && (
            <>
              {pastBookings.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>No past bookings.</div>
                : pastBookings.map(b => (
                  <div key={b.id} className="booking-card" style={{ marginBottom: 16 }}>
                    <div className="booking-card-header">
                      <div>
                        <strong>{b.items?.map(i => i.name).join(', ')}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{b.scheduled_date} • By {b.technician_name || 'Verified Pro'}</div>
                      </div>
                      <span style={{ color: '#ffd000', fontWeight: 800, fontSize: '0.9rem' }}>★ 5.00</span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>₹{b.total_amount} paid • {b.payment_method}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setInvoiceModal(b)}><FileText size={13} /> Invoice</button>
                      <button className="btn btn-outline btn-sm" onClick={() => setRatingModal(b)}><Star size={13} /> Rate</button>
                      <button className="btn btn-primary btn-sm">Re-Book</button>
                    </div>
                  </div>
                ))}
            </>
          )}
          {bookingTab === 'cancelled' && <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>No cancelled bookings. 🎉</div>}
        </div>
      )}

      {/* ===== CUSTOM REQUESTS VIEW ===== */}
      {view === 'requests' && (
        <div className="container section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Custom Requests</h2>
            <button className="btn btn-primary" onClick={() => setReqModal(true)}><FilePlus2 size={16} /> New Request</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['All', 'Open', 'Pending', 'Booked'].map(f => (
              <button key={f} onClick={() => setReqFilter(f)} className="btn btn-sm" style={{ background: reqFilter === f ? 'var(--primary)' : '#fff', color: reqFilter === f ? '#fff' : '#334155', border: '1.5px solid', borderColor: reqFilter === f ? 'var(--primary)' : '#d4d9e0' }}>{f}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {requests.filter(r => reqFilter === 'All' || r.status === reqFilter.toLowerCase()).map(r => (
              <div key={r.id} className="req-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '0.96rem' }}>{r.title}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{r.category_name} • Budget ₹{r.min_budget}–₹{r.max_budget}</div>
                  </div>
                  <span className={r.status === 'open' ? 'req-status-open' : 'req-status-booked'}>{r.status?.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#475569' }}>{r.description}</p>
                {r.bids?.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <strong style={{ fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Bids ({r.bids.length})</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {r.bids.map((bid, bi) => (
                        <div key={bi} className="bid-item">
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{bid.provider_name}</div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>★ {bid.rating} • {bid.delivery_time}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong>₹{bid.amount}</strong>
                            {r.status === 'open' && <button className="btn btn-primary btn-sm" onClick={() => acceptBid(r.id)}>Accept</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {requests.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
                <FilePlus2 size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p>No custom requests yet.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={() => setReqModal(true)}>Post Your First Request</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== CHATS VIEW ===== */}
      {view === 'chats' && (
        <div className="chat-layout" style={{ height: 'calc(100vh - 118px)' }}>
          <div className="chat-sidebar">
            <div style={{ padding: '12px 14px', borderBottom: '1.5px solid var(--border)', display: 'flex', gap: 8 }}>
              {['Enquiries', 'Support'].map(t => (
                <button key={t} onClick={() => setChatTab(t)} className="btn btn-sm" style={{ background: chatTab === t ? 'var(--primary)' : '#fff', color: chatTab === t ? '#fff' : '#334155', border: '1.5px solid', borderColor: chatTab === t ? 'var(--primary)' : '#d4d9e0', flex: 1 }}>{t}</button>
              ))}
            </div>
            {providers.map(p => (
              <div key={p.id} className={`chat-contact ${activePartner?.id === p.id ? 'active' : ''}`} onClick={() => setActivePartner(p)}>
                <div className="prov-av" style={{ background: p.avatar_color || '#0079ff', width: 40, height: 40, fontSize: '0.9rem' }}>
                  {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{p.specialty}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginLeft: 'auto', marginBottom: 2 }} />
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>now</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-main" style={{ background: '#f9fafb' }}>
            {activePartner ? (
              <>
                <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="prov-av" style={{ background: activePartner.avatar_color || '#0079ff', width: 38, height: 38, fontSize: '0.9rem' }}>
                    {activePartner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.94rem' }}>{activePartner.name}</strong>
                    <div style={{ fontSize: '0.74rem', color: '#10b981' }}>● Online</div>
                  </div>
                </div>
                <div className="chat-msgs">
                  <div className="msg-bubble msg-recv">Hello! I'm {activePartner.name}. How can I help you today?</div>
                  {chats.filter(c => c.partner_id === activePartner.id).map((c, i) => (
                    <div key={i} className={`msg-bubble ${c.sender === 'customer' ? 'msg-sent' : 'msg-recv'}`}>{c.message}</div>
                  ))}
                </div>
                <form onSubmit={sendChat} className="chat-input-row">
                  <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." />
                  <button type="submit" className="btn btn-primary"><Send size={16} /></button>
                </form>
              </>
            ) : (
              <div style={{ display: 'grid', placeItems: 'center', flex: 1, color: 'var(--muted)' }}>
                <div style={{ textAlign: 'center' }}>
                  <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p>Select a provider to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PROFILE VIEW ===== */}
      {view === 'profile' && (
        <div className="container section">
          <div className="profile-header" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div className="profile-av">👤</div>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Rahul Sharma</h2>
                <div style={{ opacity: 0.8, fontSize: '0.86rem' }}>rahul@example.com • Delhi NCR</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center' }}>
              {[
                { n: bookings.length, l: 'Total Bookings' },
                { n: loyaltyPoints, l: 'Loyalty Points' },
                { n: bookmarks.length, l: 'Saved Services' },
                { n: '4.9 ★', l: 'Avg Rating' }
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 8px', backdropFilter: 'blur(4px)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{s.n}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '📋', title: 'My Bookings', desc: `${bookings.length} total bookings`, action: () => setView('bookings') },
              { icon: '💬', title: 'My Chats', desc: `${providers.length} provider contacts`, action: () => setView('chats') },
              { icon: '📝', title: 'Custom Requests', desc: `${requests.length} requests posted`, action: () => setView('requests') },
              { icon: '❤️', title: 'Saved Services', desc: `${bookmarks.length} services bookmarked`, action: () => {} },
              { icon: '🎁', title: 'Promo Codes', desc: `${promos.length} active promos`, action: () => setCartOpen(true) },
              { icon: '🏅', title: 'Loyalty Points', desc: `${loyaltyPoints} pts — Redeem now!`, action: () => {} }
            ].map((item, i) => (
              <div key={i} className="provider-card" style={{ cursor: 'pointer' }} onClick={item.action}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                  <div>
                    <strong style={{ fontSize: '0.92rem' }}>{item.title}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item.desc}</div>
                  </div>
                  <ChevronDown size={16} color="var(--muted)" style={{ marginLeft: 'auto', transform: 'rotate(-90deg)' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Referral */}
          <div style={{ marginTop: 20, background: 'linear-gradient(135deg, #0062d6, #0079ff)', borderRadius: 16, padding: 24, color: '#fff' }}>
            <h3 style={{ marginBottom: 6 }}>Refer & Earn ₹200!</h3>
            <p style={{ fontSize: '0.86rem', opacity: 0.85, marginBottom: 16 }}>Share your referral code with friends. Both of you get ₹200 credits when they book their first service.</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px', fontWeight: 800, letterSpacing: 2, fontSize: '0.96rem' }}>FIXO-RAHUL200</div>
              <button className="btn btn-yellow" style={{ flexShrink: 0 }}>Copy Code</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <strong>FixoHub</strong>
              <p>India's trusted multi-vendor marketplace for Laptop, Mobile, TV, Tech Accessories, AC & all Home Services. 50,000+ bookings. 4.9 ★ rating.</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[['📘', 'Facebook'], ['🐦', 'Twitter'], ['📸', 'Instagram'], ['▶️', 'YouTube']].map(([icon, label]) => (
                  <div key={label} className="social-btn" title={label}>{icon}</div>
                ))}
              </div>
            </div>
            <div>
              <h4>Services</h4>
              {['Laptop Repair', 'Mobile Screen', 'AC Service', 'Deep Cleaning', 'TV Mount', 'Plumbing', 'Electrician', 'RO Service'].map(s => (
                <a key={s} href="#">{s}</a>
              ))}
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About FixoHub</a>
              <a href="#">Partner Program</a>
              <a href="#">Blog & Guides</a>
              <a href="#">Careers</a>
              <a href="#">Press Kit</a>
              <a href="/admin/">Admin Login</a>
              <a href="/partner/">Partner Login</a>
            </div>
            <div>
              <h4>Stay Updated</h4>
              <p style={{ fontSize: '0.82rem', marginBottom: 10, opacity: 0.65 }}>Get exclusive deals & service alerts</p>
              <div className="footer-newsletter">
                <input placeholder="Enter your email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} />
                <button onClick={() => { if (newsletterEmail) alert('Subscribed! 🎉'); }}>Go</button>
              </div>
              <h4 style={{ marginTop: 20 }}>Download App</h4>
              <a href="/HomeServePro.apk" download style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.84rem' }}>
                📱 Customer APK
              </a>
              <a href="/HomeServeProvider.apk" download style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.84rem' }}>
                🔧 Provider APK
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 FixoHub. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#" style={{ color: '#a3a3a3', fontSize: '0.78rem' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#a3a3a3', fontSize: '0.78rem' }}>Terms of Service</a>
              <a href="#" style={{ color: '#a3a3a3', fontSize: '0.78rem' }}>Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="mobile-bottom-nav">
        {[
          { v: 'home', icon: <Home size={20} />, label: 'Home' },
          { v: 'bookings', icon: <ClipboardList size={20} />, label: 'Bookings' },
          { v: null, icon: <ShoppingBag size={20} />, label: 'Cart', action: () => { setBookingSuccess(null); setCartOpen(true); }, badge: cartCount },
          { v: 'chats', icon: <MessageSquare size={20} />, label: 'Chat' },
          { v: 'profile', icon: <User size={20} />, label: 'Profile' }
        ].map((item, i) => (
          <button key={i} onClick={() => item.action ? item.action() : setView(item.v)}
            style={{ flex: 1, background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: '0.65rem', fontWeight: 600, color: view === item.v ? 'var(--primary)' : 'var(--muted)', position: 'relative' }}>
            {item.icon}
            {item.label}
            {item.badge > 0 && <span style={{ position: 'absolute', top: -2, right: 'calc(50% - 18px)', background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.6rem', display: 'grid', placeItems: 'center', fontWeight: 800 }}>{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* ===== CART DRAWER ===== */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <strong style={{ fontSize: '1rem' }}>Your Cart ({cartCount})</strong>
              <button onClick={() => setCartOpen(false)} className="btn-ghost"><X size={18} /></button>
            </div>
            <div className="drawer-body">
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
                  <h3 style={{ marginBottom: 8 }}>Booking Confirmed!</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>Booking #{bookingSuccess.id} created. Provider will be assigned shortly.</p>
                  <BookingTracker status="pending" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                    <button className="btn btn-outline" onClick={() => setInvoiceModal(bookingSuccess)}>Get Invoice</button>
                    <button className="btn btn-primary" onClick={() => { setView('bookings'); setCartOpen(false); setBookingSuccess(null); }}>Track Booking</button>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ marginBottom: 14 }}>Your cart is empty</p>
                  <button className="btn btn-primary" onClick={() => setCartOpen(false)}>Browse Services</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    {['At Doorstep', 'At Store'].map(m => (
                      <button key={m} onClick={() => setVisitMode(m)} className="btn btn-sm" style={{ background: visitMode === m ? 'var(--primary)' : '#fff', color: visitMode === m ? '#fff' : '#334155', border: '1.5px solid', borderColor: visitMode === m ? 'var(--primary)' : '#d4d9e0', flex: 1 }}>{m}</button>
                    ))}
                  </div>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>₹{item.price} each</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="qty-stepper">
                          <button onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                        </div>
                        <strong>₹{item.price * item.qty}</strong>
                      </div>
                    </div>
                  ))}

                  {/* Promo */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Promo Code</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} placeholder="FIXO50 / WELCOME20" style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 10, padding: '9px 12px', fontSize: '0.86rem', outline: 'none' }} />
                      <button className="btn btn-outline" onClick={applyPromo}>Apply</button>
                    </div>
                    {appliedPromo && <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: 4, fontWeight: 600 }}>✓ {appliedPromo.code} applied — Saving ₹{discountAmt}</div>}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {promos.filter(p => p.is_active).map(p => (
                        <button key={p.id} onClick={() => { setPromoInput(p.code); }} style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 7, padding: '3px 10px', fontSize: '0.74rem', fontWeight: 700, color: '#b45309' }}>{p.code}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f7f9fc', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 6 }}><span>Subtotal</span><span>₹{subTotal}</span></div>
                    {discountAmt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#10b981', marginBottom: 6 }}><span>Promo ({appliedPromo?.code})</span><span>-₹{discountAmt}</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 6 }}><span>GST 18%</span><span>₹{taxAmt}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', borderTop: '1.5px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                      <span>Total</span><span>₹{cartTotal + taxAmt}</span>
                    </div>
                  </div>

                  <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="form-group"><label>Name</label><input required placeholder="Your name" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} /></div>
                    <div className="form-group"><label>Phone</label><input required placeholder="10-digit mobile" value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))} /></div>
                    <div className="form-group"><label>Address</label><input required placeholder="Door, Floor, Street, Area" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div className="form-group"><label>Date</label><input type="date" required value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} /></div>
                      <div className="form-group"><label>Slot</label>
                        <select value={form.scheduled_slot} onChange={e => setForm(f => ({ ...f, scheduled_slot: e.target.value }))}>
                          {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-group"><label>Payment</label>
                      <select value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
                        {['UPI / RazorPay', 'Credit / Debit Card', 'Net Banking', 'Paytm / PhonePe', 'Cash on Delivery'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label>Notes (optional)</label><textarea rows={2} placeholder="Specific instructions..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                      {submitting ? 'Placing Booking...' : `Confirm Booking — ₹${cartTotal + taxAmt}`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODALS ===== */}
      {svcDetailModal && <SvcDetailModal srv={svcDetailModal} />}
      {providerModal && <ProviderModal p={providerModal} />}
      {invoiceModal && <InvoiceModal booking={invoiceModal} />}

      {/* Rating Modal */}
      {ratingModal && (
        <div className="modal-bg" onClick={() => setRatingModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 420 }}>
            <h3 style={{ marginBottom: 6 }}>Rate Your Service</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted)', marginBottom: 16 }}>{ratingModal.items?.map(i => i.name).join(', ')}</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRatingVal(n)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>
                  {n <= ratingVal ? '★' : '☆'}
                </button>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Your Review</label>
              <textarea rows={3} placeholder="Tell us about your experience..." value={ratingText} onChange={e => setRatingText(e.target.value)} style={{ border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: '0.88rem' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setRatingModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { alert(`Thanks for your ${ratingVal}-star review! 🎉`); setRatingModal(null); }}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Request Modal */}
      {reqModal && (
        <div className="modal-bg" onClick={() => setReqModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Post Custom Request</h3>
                <button onClick={() => setReqModal(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
              </div>
              <form onSubmit={submitCustomRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group"><label>Service Title</label><input required placeholder="e.g. MacBook Pro screen replacement" value={reqForm.title} onChange={e => setReqForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div className="form-group"><label>Category</label>
                  <select value={reqForm.category_name} onChange={e => setReqForm(f => ({ ...f, category_name: e.target.value }))}>
                    {categories.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Describe Your Problem</label><textarea required rows={3} placeholder="Describe the issue in detail..." value={reqForm.description} onChange={e => setReqForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group"><label>Min Budget (₹)</label><input type="number" value={reqForm.min_budget} onChange={e => setReqForm(f => ({ ...f, min_budget: +e.target.value }))} /></div>
                  <div className="form-group"><label>Max Budget (₹)</label><input type="number" value={reqForm.max_budget} onChange={e => setReqForm(f => ({ ...f, max_budget: +e.target.value }))} /></div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px' }}><FilePlus2 size={16} /> Submit Request</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
