import { useEffect, useMemo, useState } from 'react';
import {
  Wind, Tv, Smartphone, Laptop, Refrigerator, Zap, Wrench, Sparkles,
  Hammer, Paintbrush, ShieldCheck, Droplets, Search, ShoppingBag,
  Star, Clock, CheckCircle2, X, ClipboardList, Plus, Minus,
  Cpu, Users, Award, HelpCircle, ChevronDown, Heart, MessageSquare,
  Send, Tag, FileText, Moon, Sun, Home, User, FilePlus2, MapPin,
  Car, Scissors, Bell, ChevronLeft, ChevronRight, TrendingUp,
  Percent, Shield, Zap as ZapIcon, Package, Phone, Mail, Globe,
  Download, ChevronRight as CR, CheckCheck, AlertCircle, Bike, ArrowRight,
  Wallet, Gift, Compass, Layers, Sliders, Check, RefreshCw
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

const SUPER_COMBOS = [
  {
    id: 'combo-1',
    title: 'Summer Chill AC & Clean Combo',
    badge: 'SAVE ₹1,200',
    services: ['AC Foam-Jet Wash', 'Bathroom Deep Cleaning', 'Kitchen Exhaust Degreasing'],
    original_price: 3699,
    price: 2499,
    warranty: '60 Days Warranty',
    img: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=500&q=80'
  },
  {
    id: 'combo-2',
    title: 'Total Home Defense Combo',
    badge: 'POPULAR',
    services: ['Pest Control (2BHK)', 'Water Tank Scrubbing', 'Drain Disinfection'],
    original_price: 2899,
    price: 1899,
    warranty: '90 Days Warranty',
    img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'
  },
  {
    id: 'combo-3',
    title: 'Ultimate PC & Gadget Care',
    badge: 'BEST VALUE',
    services: ['Laptop MX-6 Repaste', 'NVMe SSD Clean Install', 'Internal Dust Jetting'],
    original_price: 2999,
    price: 1999,
    warranty: '180 Days Warranty',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80'
  }
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
  { q: 'What is FixoWallet?', a: 'FixoWallet is your instant payment balance with zero checkout failures. Add funds via UPI/Card to earn 5% extra cashback on every deposit!' }
];

const BLOG_IMGS = [
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'
];

const TRACK_STEPS = ['Booked', 'Assigned', 'On Way', 'Started', 'Done'];
const STATUS_TRACK = { pending: 1, confirmed: 1, assigned: 2, in_progress: 3, completed: 5 };

export default function App() {
  const [view, setView] = useState('home'); // home | bookings | requests | chats | wallet | profile | compare
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
  const [priceFilter, setPriceFilter] = useState('all');
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
  const [isExpress, setIsExpress] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);

  // FixoWallet State
  const [walletBalance, setWalletBalance] = useState(() => {
    try { return +localStorage.getItem('fh_wallet') || 1500; } catch { return 1500; }
  });
  const [addWalletAmt, setAddWalletAmt] = useState(500);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 'tx-1', type: 'credit', desc: 'Welcome Bonus Credited', amount: 500, date: '25 Nov 2026' },
    { id: 'tx-2', type: 'credit', desc: 'Cashback: Booking #11059', amount: 200, date: '25 Nov 2026' },
    { id: 'tx-3', type: 'credit', desc: 'Wallet Deposit via UPI', amount: 800, date: '24 Nov 2026' }
  ]);

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    { id: 'addr-1', label: 'Home', text: 'Flat 402, Green Park Residency, Sector 14', city: 'Delhi NCR', isDefault: true },
    { id: 'addr-2', label: 'Office', text: 'Plot 78, Cyber City Phase 2', city: 'Delhi NCR', isDefault: false }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({ label: 'Home', text: '', city: 'Delhi NCR' });

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Lucky Scratch Card Modal
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [scratchClaimed, setScratchClaimed] = useState(false);

  // Tickets State
  const [tickets, setTickets] = useState([
    { id: 'TKT-104', subject: 'Query on invoice receipt', category: 'Billing', status: 'Resolved', date: '24 Nov 2026' }
  ]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'Service Quality', desc: '' });

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
  const [showCityPop, setShowCityPop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fh_bookmarks') || '[]'); } catch { return []; }
  });

  // Customer Profile & Authentication State
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fh_customer') || 'null') || {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@gmail.com',
        address: 'Flat 402, Tower B, Green Park Residency',
        landmark: 'Near City Mall',
        pincode: '110016',
        alternate_phone: '+91 98111 22334',
        address_type: 'Home',
        city: 'Delhi NCR',
        active_subscription: null
      };
    } catch {
      return {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@gmail.com',
        address: 'Flat 402, Tower B, Green Park Residency',
        landmark: 'Near City Mall',
        pincode: '110016',
        alternate_phone: '',
        address_type: 'Home',
        city: 'Delhi NCR',
        active_subscription: null
      };
    }
  });

  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState(customer);
  const [amcPlans, setAmcPlans] = useState([]);
  const [amcSuccessModal, setAmcSuccessModal] = useState(null);

  const [reqForm, setReqForm] = useState({
    customer_name: customer.name || 'Rahul Sharma', title: '', category_name: 'Laptop & PC', description: '', min_budget: 500, max_budget: 2500
  });

  const [form, setForm] = useState({
    customer_name: customer.name || 'Rahul Sharma',
    customer_phone: customer.phone || '+91 98765 43210',
    alternate_phone: customer.alternate_phone || '',
    address: customer.address || 'Flat 402, Green Park Residency',
    landmark: customer.landmark || 'Near City Mall',
    pincode: customer.pincode || '110016',
    scheduled_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    scheduled_slot: TIME_SLOTS[1],
    payment_method: 'FixoWallet (Fast & 5% Cashback)',
    notes: ''
  });

  useEffect(() => { document.body.classList.toggle('dark', darkMode); }, [darkMode]);

  const loadAll = async () => {
    const [cats, srvs, techs, bks, reqs, prms, chts, blgs, ap] = await Promise.all([
      fetch(`${API}/api/categories`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/services`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/technicians`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/bookings`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/requests`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/promocodes`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/chats`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/blogs`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/amc-plans`).then(r => r.json()).catch(() => [])
    ]);
    setCategories(cats); setServices(srvs); setProviders(techs);
    setBookings(bks); setRequests(reqs); setPromos(prms); setChats(chts); setBlogs(blgs);
    setAmcPlans(Array.isArray(ap) ? ap : []);
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
      const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.category_name || '').toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      let matchPrice = true;
      if (priceFilter === 'under500') matchPrice = s.price < 500;
      if (priceFilter === '500to1500') matchPrice = s.price >= 500 && s.price <= 1500;
      if (priceFilter === 'above1500') matchPrice = s.price > 1500;
      return matchCat && matchSearch && matchPrice;
    });
    if (sortBy === 'price_asc') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [services, selectedCat, search, sortBy, priceFilter]);

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

  const addComboToCart = (combo) => {
    setCart(prev => {
      const found = prev.find(i => i.id === combo.id);
      if (found) return prev.map(i => i.id === combo.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: combo.id, name: combo.title, price: combo.price, qty: 1 }];
    });
    setCartOpen(true);
  };

  const toggleCompare = (srv) => {
    if (compareList.some(s => s.id === srv.id)) {
      setCompareList(compareList.filter(s => s.id !== srv.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare maximum 3 services at a time.');
        return;
      }
      setCompareList([...compareList, srv]);
    }
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  const getQty = id => cart.find(i => i.id === id)?.qty || 0;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = appliedPromo ? Math.min(Math.round(subTotal * (appliedPromo.discount_percent / 100)), appliedPromo.max_discount) : 0;
  const expressFee = isExpress ? 149 : 0;
  const finalPayable = Math.max(0, subTotal - discountAmt) + expressFee + tipAmount;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promos.find(p => p.code === code && p.is_active);
    if (!found) return alert('Invalid code. Try FIXO50, WELCOME20 or LUCKY30');
    if (subTotal < found.min_order) return alert(`Min order ₹${found.min_order} required`);
    setAppliedPromo(found);
  };

  const addFundsToWallet = () => {
    const amt = +addWalletAmt;
    if (amt <= 0) return;
    const bonus = Math.round(amt * 0.05);
    const newBal = walletBalance + amt + bonus;
    setWalletBalance(newBal);
    localStorage.setItem('fh_wallet', newBal);
    setWalletTransactions([
      { id: `tx-${Date.now()}`, type: 'credit', desc: `Deposit + 5% Bonus (₹${bonus})`, amount: amt + bonus, date: 'Just now' },
      ...walletTransactions
    ]);
    setShowAddWalletModal(false);
    alert(`₹${amt + bonus} successfully added to FixoWallet!`);
  };

  // Customer Registration & Profile Handler
  const handleRegisterCustomer = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch(`${API}/api/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        localStorage.setItem('fh_customer', JSON.stringify(data.customer));
        setForm(f => ({
          ...f,
          customer_name: data.customer.name,
          customer_phone: data.customer.phone,
          alternate_phone: data.customer.alternate_phone || '',
          address: data.customer.address || f.address,
          landmark: data.customer.landmark || '',
          pincode: data.customer.pincode || ''
        }));
        if (data.bonus) {
          const newBal = (Number(walletBalance) || 0) + Number(data.bonus);
          setWalletBalance(newBal);
          localStorage.setItem('fh_wallet', newBal);
        }
        setShowRegModal(false);
        alert(`Welcome ${data.customer.name}! Customer details saved. ₹${data.bonus || 100} Welcome Bonus added to your FixoWallet!`);
      } else {
        alert(data.error || 'Failed to save customer details');
      }
    } catch {
      alert('Error communicating with server');
    }
  };

  // Subscribe to Annual Maintenance Contract
  const subscribeAmcPlan = async (plan) => {
    if (!customer?.phone || !customer?.name) {
      alert('Please fill your customer profile & doorstep address first.');
      setShowRegModal(true);
      return;
    }

    const conf = confirm(`Subscribe to ${plan.name} for ₹${plan.price}/year?\n\nIncludes ${plan.visits_included} Deep Maintenance visits & zero visit charges for 365 days.`);
    if (!conf) return;

    try {
      const res = await fetch(`${API}/api/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer.id || `cust-${Date.now()}`,
          customer_name: customer.name,
          customer_phone: customer.phone,
          plan_id: plan.id,
          plan_name: plan.name,
          price_paid: plan.price,
          visits_total: plan.visits_included || 2,
          duration_days: plan.duration_days || 365
        })
      });
      const data = await res.json();
      if (data.success) {
        const updatedCustomer = {
          ...customer,
          active_subscription: plan.name,
          subscription_expires: new Date(Date.now() + (plan.duration_days || 365) * 86400000).toISOString()
        };
        setCustomer(updatedCustomer);
        localStorage.setItem('fh_customer', JSON.stringify(updatedCustomer));
        setAmcSuccessModal({ plan, sub: data.subscription });
      } else {
        alert(data.error || 'Subscription could not be processed');
      }
    } catch {
      alert('Connection error');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) return;

    if (form.payment_method.includes('FixoWallet')) {
      if (walletBalance < finalPayable) {
        alert(`Insufficient FixoWallet balance (₹${walletBalance}). Please recharge or select UPI/Card.`);
        setShowAddWalletModal(true);
        return;
      }
      const newBal = walletBalance - finalPayable;
      setWalletBalance(newBal);
      localStorage.setItem('fh_wallet', newBal);
      setWalletTransactions([
        { id: `tx-${Date.now()}`, type: 'debit', desc: `Payment for Booking`, amount: finalPayable, date: 'Just now' },
        ...walletTransactions
      ]);
    }

    setSubmitting(true);
    try {
      const activeAddr = addresses.find(a => a.id === selectedAddressId)?.text || form.address;
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          customer_name: form.customer_name || customer.name,
          customer_phone: form.customer_phone || customer.phone,
          alternate_phone: form.alternate_phone || customer.alternate_phone || '',
          address: activeAddr,
          landmark: form.landmark || customer.landmark || '',
          pincode: form.pincode || customer.pincode || '110016',
          is_amc: customer.active_subscription ? 1 : 0,
          city,
          notes: `${visitMode}${isExpress ? ' | ⚡ Express 30m' : ''}${tipAmount ? ` | Tip: ₹${tipAmount}` : ''}${appliedPromo ? ` | Promo: ${appliedPromo.code}` : ''}${customer.active_subscription ? ' | 👑 AMC Member' : ''}`,
          items: cart,
          total_amount: finalPayable,
          source: 'website'
        })
      });
      const data = await res.json();
      if (res.ok) { setBookingSuccess(data); setCart([]); setAppliedPromo(null); setTipAmount(0); setIsExpress(false); loadAll(); }
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

  const createTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject) return;
    setTickets([
      { id: `TKT-${Math.floor(100 + Math.random() * 900)}`, subject: ticketForm.subject, category: ticketForm.category, status: 'Open', date: 'Just now' },
      ...tickets
    ]);
    setShowTicketModal(false);
    setTicketForm({ subject: '', category: 'Service Quality', desc: '' });
    alert('Support ticket created! A support manager will respond within 15 minutes.');
  };

  const ongoingBookings = bookings.filter(b => ['pending', 'confirmed', 'assigned', 'in_progress'].includes(b.status));
  const pastBookings = bookings.filter(b => b.status === 'completed');
  const discPct = (p, op) => op > p ? Math.round(((op - p) / op) * 100) : 0;

  // ===================== SERVICE CARD =====================
  const SrvCard = ({ srv, horizontal }) => {
    const qty = getQty(srv.id);
    const isSaved = bookmarks.includes(srv.id);
    const isCompared = compareList.some(s => s.id === srv.id);
    const dp = discPct(srv.price, srv.original_price);
    return (
      <div className="srv-card" style={horizontal ? { minWidth: 272 } : {}}>
        <div className="srv-img-wrap">
          <img
            src={srv.image_url || `https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=500&q=80`}
            alt={srv.name} className="srv-photo" loading="lazy"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=400&q=80'; }}
          />
          <div className="srv-rating-badge">
            <Star size={11} fill="#ffd000" color="#ffd000" /> {srv.rating} ({srv.reviews_count})
          </div>
          <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
            <button className="srv-bookmark-btn" onClick={() => toggleCompare(srv)} title={isCompared ? 'Remove from Compare' : 'Compare Service'} style={{ background: isCompared ? 'var(--primary)' : '#fff', color: isCompared ? '#fff' : '#0d0d0d' }}>
              <Layers size={13} />
            </button>
            <button className="srv-bookmark-btn" onClick={() => toggleBookmark(srv.id)}>
              <Heart size={15} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#475569'} />
            </button>
          </div>
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

  return (
    <div>
      {/* ===== HEADER (NO PARTNER/ADMIN BUTTONS) ===== */}
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
              <select value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Search Laptop, Mobile, TV, AC, Cleaning..." value={search}
                onChange={e => { setSearch(e.target.value); if (view !== 'home') setView('home'); }}
                onKeyDown={e => { if (e.key === 'Enter') { setView('home'); setTimeout(() => document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' }), 50); } }}
              />
              <button className="search-btn" onClick={() => { setView('home'); setTimeout(() => document.getElementById('svc-sec')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>
                <Search size={15} />
              </button>
            </div>

            <div className="h-actions">
              {/* Wallet Pill */}
              <div
                onClick={() => setView('wallet')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ecfdf5', border: '1.5px solid #10b981', color: '#047857', padding: '6px 12px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                title="View FixoWallet"
              >
                <Wallet size={15} color="#059669" /> ₹{walletBalance}
              </div>

              {/* Compare Pill */}
              {compareList.length > 0 && (
                <button className="btn btn-outline btn-sm" onClick={() => setShowCompareModal(true)} style={{ background: '#eff6ff', borderColor: '#3b82f6', color: '#1d4ed8' }}>
                  <Layers size={14} /> Compare ({compareList.length})
                </button>
              )}

              {/* Scratch card pill */}
              <button className="btn btn-sm" onClick={() => setShowScratchModal(true)} style={{ background: '#fef3c7', border: '1.5px solid #f59e0b', color: '#b45309', fontWeight: 700 }}>
                <Gift size={14} /> Scratch & Win
              </button>

              <button className="icon-btn" onClick={() => setShowNotif(!showNotif)} title="Notifications">
                <Bell size={16} />
                <span className="notif-dot" />
              </button>

              <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {showNotif && (
                <div style={{ position: 'absolute', top: 46, right: 0, width: 300, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 14, boxShadow: '0 12px 32px rgba(0,0,0,0.15)', zIndex: 80 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
                    <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--muted)' }}>Clear</button>
                  </div>
                  {[
                    { icon: '💰', msg: '₹200 Cashback credited to your FixoWallet!', time: '5 min ago' },
                    { icon: '🎁', msg: 'Scratch Card Unlocked: 30% OFF Coupon!', time: '1h ago' },
                    { icon: '🔧', msg: 'Booking #11059: Technician is 2 km away', time: '2h ago' }
                  ].map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: '1.2rem' }}>{n.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.8rem' }}>{n.msg}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="header-sub">
            <nav className="sub-links">
              {[
                ['home', 'Home'],
                ['amc', '🛡️ AMC Care Plans'],
                ['bookings', `Bookings (${bookings.length})`],
                ['requests', `Requests (${requests.length})`],
                ['chats', 'Chats'],
                ['wallet', 'FixoWallet'],
                ['profile', 'Profile']
              ].map(([v, label]) => (
                <button key={v} className={`sub-link ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>{label}</button>
              ))}
            </nav>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                className="btn btn-outline"
                style={{ padding: '7px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6, borderColor: '#e2e8f0', background: '#f8fafc' }}
                onClick={() => { setRegForm(customer); setShowRegModal(true); }}
              >
                <span>👤</span>
                <span style={{ fontWeight: 700 }}>{customer?.name ? customer.name.split(' ')[0] : 'Register'}</span>
                {customer?.active_subscription && (
                  <span style={{ background: '#7e22ce', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>AMC</span>
                )}
              </button>
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
                    🔥 Pay with FixoWallet & Get Flat 5% Extra Cashback!
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
                  { icon: '⚡', text: '30-Min Express Service' },
                  { icon: '📅', text: '365-Day Service Warranty' },
                  { icon: '💳', text: 'FixoWallet & UPI Secure' },
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

          {/* SUPER SAVER COMBOS (NEW FEATURE) */}
          <section className="section-sm">
            <div className="container">
              <div className="sec-header">
                <div>
                  <h2>🔥 Super Saver Combo Packages</h2>
                  <p>Multi-service bundled packages with huge instant discounts</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {SUPER_COMBOS.map(combo => (
                  <div key={combo.id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={combo.img} alt={combo.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: '#fff', fontSize: '0.74rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>{combo.badge}</span>
                      <span style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6 }}>{combo.warranty}</span>
                    </div>
                    <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <strong style={{ fontSize: '1rem' }}>{combo.title}</strong>
                      <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                        {combo.services.map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                            <CheckCheck size={13} color="#10b981" /> {s}
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px dashed var(--border)' }}>
                        <div>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{combo.price}</span>
                          <span style={{ fontSize: '0.84rem', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: 6 }}>₹{combo.original_price}</span>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => addComboToCart(combo)}><Plus size={14} /> Book Combo</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

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

          {/* FEATURED PROVIDERS (NO PARTNER LOGIN BUTTON) */}
          {providers.length > 0 && (
            <section className="section-sm">
              <div className="container">
                <div className="sec-header" style={{ marginBottom: 14 }}>
                  <div><h2>Featured Ad Providers</h2><p>Top-rated pros with exclusive deals this week</p></div>
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

          {/* ALL SERVICES SECTION WITH ADVANCED FILTERS */}
          <section className="section" id="svc-sec">
            <div className="container">
              <div className="sec-header">
                <div>
                  <h2>{selectedCat === 'all' ? 'All Services & Solutions' : categories.find(c => c.id === selectedCat)?.name}</h2>
                  <p>{filteredServices.length} services with upfront pricing & warranty</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Price Filter */}
                  <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 9, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, fontSize: '0.84rem' }}>
                    <option value="all">Price: All</option>
                    <option value="under500">Under ₹500</option>
                    <option value="500to1500">₹500 - ₹1,500</option>
                    <option value="above1500">Above ₹1,500</option>
                  </select>

                  {/* Visit Mode */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['At Doorstep', 'At Store'].map(m => (
                      <button key={m} onClick={() => setVisitMode(m)} className="btn btn-sm" style={{ background: visitMode === m ? 'var(--primary)' : '#fff', color: visitMode === m ? '#fff' : '#334155', border: '1.5px solid', borderColor: visitMode === m ? 'var(--primary)' : '#d4d9e0' }}>{m}</button>
                    ))}
                  </div>

                  {/* Sort */}
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
                  <p style={{ marginBottom: 16 }}>Try resetting price or search filter</p>
                  <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCat('all'); setPriceFilter('all'); }}>Reset Filters</button>
                </div>
              ) : (
                <div className="services-grid">
                  {filteredServices.map(srv => <SrvCard key={srv.id} srv={srv} />)}
                </div>
              )}
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

          {/* FAQ */}
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="faq-wrap">
                <div className="faq-left">
                  <div style={{ width: 48, height: 48, background: 'var(--primary-soft)', borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                    <HelpCircle size={24} color="var(--primary)" />
                  </div>
                  <h3 style={{ marginBottom: 10 }}>Need Fast Support?</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--muted)', marginBottom: 20 }}>Raise a support ticket or chat with verified professionals 24/7.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button className="btn btn-primary" onClick={() => setShowTicketModal(true)}><FileText size={15} /> Raise Support Ticket</button>
                    <button className="btn btn-outline" onClick={() => setView('chats')}><MessageSquare size={15} /> Live Chat Support</button>
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
        </>
      )}

      {/* ===== WALLET VIEW (NEW FEATURE) ===== */}
      {view === 'wallet' && (
        <div className="container section">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: 20, padding: 32, color: '#fff', marginBottom: 24, boxShadow: '0 12px 30px rgba(16,185,129,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', opacity: 0.85, fontWeight: 600 }}>Total FixoWallet Balance</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '4px 0' }}>₹{walletBalance}</div>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 999 }}>⚡ 1-Click Zero Failure Checkout</span>
                </div>
                <button className="btn btn-yellow" onClick={() => setShowAddWalletModal(true)} style={{ padding: '12px 20px', fontSize: '0.92rem' }}>
                  <Plus size={16} /> Add Funds
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: 14 }}>Recent Wallet Transactions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {walletTransactions.map(tx => (
                <div key={tx.id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: tx.type === 'credit' ? '#d1fae5' : '#fee2e2', color: tx.type === 'credit' ? '#059669' : '#dc2626', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                      {tx.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>{tx.desc}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{tx.date}</div>
                    </div>
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: tx.type === 'credit' ? '#059669' : '#dc2626' }}>
                    {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== AMC / CARE SUBSCRIPTION PLANS VIEW ===== */}
      {view === 'amc' && (
        <div className="container section">
          {/* AMC Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
            borderRadius: 24,
            padding: '36px 32px',
            color: '#fff',
            marginBottom: 32,
            boxShadow: '0 16px 36px rgba(124, 58, 237, 0.28)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20
          }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: 800,
                backdropFilter: 'blur(4px)',
                marginBottom: 12
              }}>
                🛡️ FIXOCARE ANNUAL MAINTENANCE CONTRACT (AMC)
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 10 }}>
                Zero Repair Bills. Unlimited Peace of Mind.
              </h1>
              <p style={{ opacity: 0.9, fontSize: '0.94rem', lineHeight: 1.5, marginBottom: 16 }}>
                Subscribe to FixoCare annual plans for AC, Home Appliances, Water Purifiers & PC.
                Get free deep service visits, <strong>₹0 inspection charges for 365 days</strong>, and 20% off genuine spare parts.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: 700 }}>
                <span>✓ Free Deep Clean Visits</span>
                <span>✓ ₹0 Visiting Fee</span>
                <span>✓ 30-Min Fast Dispatch</span>
                <span>✓ 20% Off All Parts</span>
              </div>
            </div>

            {customer?.active_subscription ? (
              <div style={{
                background: '#fff',
                color: '#1e1b4b',
                borderRadius: 20,
                padding: 24,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                minWidth: 260
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>
                  👑 Your Active Membership
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 4 }}>
                  {customer.active_subscription}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                  Expires: {customer.subscription_expires ? new Date(customer.subscription_expires).toLocaleDateString() : 'Active (365 Days)'}
                </div>
                <div style={{ marginTop: 12, padding: '8px 12px', background: '#f5f3ff', borderRadius: 10, fontSize: '0.76rem', color: '#6d28d9', fontWeight: 700 }}>
                  ✓ VIP Benefits Active on All Bookings
                </div>
              </div>
            ) : (
              <button
                className="btn btn-yellow"
                onClick={() => {
                  const firstPlan = amcPlans[0];
                  if (firstPlan) subscribeAmcPlan(firstPlan);
                  else alert('Select a plan below to subscribe!');
                }}
                style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 800, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
              >
                Join FixoCare VIP from ₹999/yr →
              </button>
            )}
          </div>

          {/* AMC Plans Grid */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 28px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Choose Your Annual Care Package</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                All plans include free scheduled doorstep checkups, priority routing & free breakdown call-outs
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20
            }}>
              {amcPlans.map(plan => {
                let featArr = [];
                try {
                  featArr = Array.isArray(plan.features_json)
                    ? plan.features_json
                    : JSON.parse(plan.features_json || '[]');
                } catch {
                  featArr = typeof plan.features_json === 'string' ? plan.features_json.split(',') : [];
                }

                const isCurrent = customer?.active_subscription === plan.name;

                return (
                  <div key={plan.id} style={{
                    background: '#fff',
                    borderRadius: 22,
                    border: isCurrent ? '2.5px solid #7c3aed' : '1.5px solid var(--border)',
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isCurrent ? '0 12px 30px rgba(124, 58, 237, 0.15)' : '0 4px 16px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {plan.badge && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: '#7c3aed',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        padding: '4px 12px',
                        borderBottomLeftRadius: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 4 }}>
                        {plan.category_name}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>
                        {plan.name}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>₹{plan.price}</span>
                        {plan.original_price && (
                          <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{plan.original_price}
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ year</span>
                      </div>

                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: '10px 12px',
                        marginBottom: 16,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>Included Visits:</span>
                        <strong style={{ color: '#059669' }}>{plan.visits_included} Deep Maintenance Visits</strong>
                      </div>

                      <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 8, color: '#334155' }}>
                        Plan Privileges:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem', color: '#475569' }}>
                        {featArr.map((f, fi) => (
                          <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ color: '#10b981', fontWeight: 900, fontSize: '0.9rem' }}>✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      {isCurrent ? (
                        <div style={{
                          background: '#ecfdf5',
                          color: '#047857',
                          padding: '12px',
                          borderRadius: 12,
                          textAlign: 'center',
                          fontWeight: 800,
                          fontSize: '0.88rem'
                        }}>
                          ✓ Currently Subscribed
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                            borderColor: '#7c3aed',
                            fontSize: '0.92rem',
                            fontWeight: 800
                          }}
                          onClick={() => subscribeAmcPlan(plan)}
                        >
                          Subscribe Now (₹{plan.price}/yr)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Value Guarantee */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: 20,
            padding: 28,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20
          }}>
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🛡️</div>
              <strong style={{ fontSize: '0.96rem' }}>365-Day Guarantee</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>
                Any breakdown issue resolved with zero inspection fees. Certified ITI field crew.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>⚡</div>
              <strong style={{ fontSize: '0.96rem' }}>Priority Dispatch</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>
                Subscribers jump the queue with guaranteed 30-minute doorstep service assignment.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>💰</div>
              <strong style={{ fontSize: '0.96rem' }}>Save Up to ₹4,500/Year</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>
                Bundled deep maintenance services cost 40% less than on-demand individual visits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== BOOKINGS VIEW ===== */}
      {view === 'bookings' && (
        <div className="container section">
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, flex: 1 }}>My Bookings</h2>
            {[['ongoing', 'Ongoing'], ['past', 'Past']].map(([t, l]) => (
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.78rem' }}>
                    <div><span style={{ color: 'var(--muted)' }}>Provider</span><br /><strong>{b.technician_name || 'Assigning...'}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Address</span><br /><strong>{b.address || b.city}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Amount</span><br /><strong>₹{b.total_amount}</strong></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setView('chats')}><MessageSquare size={13} /> Chat</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setInvoiceModal(b)}><FileText size={13} /> Invoice</button>
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
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      )}

      {/* ===== REQUESTS VIEW ===== */}
      {view === 'requests' && (
        <div className="container section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Custom Requests & Bids</h2>
            <button className="btn btn-primary" onClick={() => setReqModal(true)}><FilePlus2 size={16} /> New Request</button>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {requests.map(r => (
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
                    <strong style={{ fontSize: '0.82rem', display: 'block', marginBottom: 6 }}>Bids Received</strong>
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
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== CHATS VIEW ===== */}
      {view === 'chats' && (
        <div className="chat-layout" style={{ height: 'calc(100vh - 118px)' }}>
          <div className="chat-sidebar">
            {providers.map(p => (
              <div key={p.id} className={`chat-contact ${activePartner?.id === p.id ? 'active' : ''}`} onClick={() => setActivePartner(p)}>
                <div className="prov-av" style={{ background: p.avatar_color || '#0079ff', width: 40, height: 40, fontSize: '0.9rem' }}>
                  {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{p.specialty}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-main" style={{ background: '#f9fafb' }}>
            {activePartner && (
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
                  <div className="msg-bubble msg-recv">Hello! I'm {activePartner.name}. How can I assist you?</div>
                  {chats.filter(c => c.partner_id === activePartner.id).map((c, i) => (
                    <div key={i} className={`msg-bubble ${c.sender === 'customer' ? 'msg-sent' : 'msg-recv'}`}>{c.message}</div>
                  ))}
                </div>
                <form onSubmit={sendChat} className="chat-input-row">
                  <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." />
                  <button type="submit" className="btn btn-primary"><Send size={16} /></button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== PROFILE & ADDRESSES VIEW ===== */}
      {view === 'profile' && (
        <div className="container section">
          {/* Customer Profile Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: 22,
            padding: '28px 30px',
            color: '#fff',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0079ff, #6366f1)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#fff'
              }}>
                {customer?.name ? customer.name[0] : '👤'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{customer?.name || 'Registered Customer'}</h2>
                  {customer?.address_type && (
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                      {customer.address_type}
                    </span>
                  )}
                  {customer?.active_subscription && (
                    <span style={{ background: '#7c3aed', color: '#fff', fontSize: '0.72rem', padding: '3px 9px', borderRadius: 999, fontWeight: 800 }}>
                      👑 VIP AMC
                    </span>
                  )}
                </div>
                <div style={{ opacity: 0.85, fontSize: '0.86rem', marginTop: 3 }}>
                  📞 {customer?.phone} {customer?.alternate_phone ? `• Alt: ${customer.alternate_phone}` : ''}
                </div>
                {customer?.email && (
                  <div style={{ opacity: 0.75, fontSize: '0.82rem', marginTop: 2 }}>
                    ✉️ {customer.email}
                  </div>
                )}
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => { setRegForm(customer); setShowRegModal(true); }}
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              ✏️ Edit Customer Profile &amp; Address
            </button>
          </div>

          {/* Doorstep Address & KYC Details Card */}
          <div style={{
            background: '#fff',
            border: '1.5px solid var(--border)',
            borderRadius: 18,
            padding: 22,
            marginBottom: 24
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12 }}>🏠 Doorstep Delivery Address on Record</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, fontSize: '0.86rem' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Full Address</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{customer?.address || 'Not filled'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Landmark</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>📍 {customer?.landmark || 'Not provided'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Area Pin Code</div>
                <div style={{ fontWeight: 700, marginTop: 2, fontFamily: 'monospace' }}>📮 {customer?.pincode || '110016'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active AMC Plan</div>
                <div style={{ fontWeight: 700, marginTop: 2, color: customer?.active_subscription ? '#7c3aed' : 'var(--muted)' }}>
                  {customer?.active_subscription ? `👑 ${customer.active_subscription}` : 'None (Pay-as-you-go)'}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses Section */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3>📍 Saved Addresses ({addresses.length})</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddAddressModal(true)}><Plus size={14} /> Add New Address</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {addresses.map(addr => (
                <div key={addr.id} style={{ background: '#fff', border: `2px solid ${addr.isDefault ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.74rem', padding: '3px 8px', borderRadius: 6 }}>{addr.label}</span>
                    {addr.isDefault && <span style={{ color: '#10b981', fontSize: '0.74rem', fontWeight: 700 }}>✓ Default</span>}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{addr.text}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{addr.city}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Tickets Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3>🎫 Support Tickets ({tickets.length})</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowTicketModal(true)}><Plus size={14} /> New Ticket</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tickets.map(tkt => (
                <div key={tkt.id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tkt.id}: {tkt.subject}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{tkt.category} • {tkt.date}</div>
                  </div>
                  <span style={{ background: tkt.status === 'Resolved' ? '#d1fae5' : '#fef3c7', color: tkt.status === 'Resolved' ? '#047857' : '#b45309', padding: '3px 10px', borderRadius: 999, fontSize: '0.74rem', fontWeight: 700 }}>{tkt.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER (NO PARTNER/ADMIN LINKS) ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <strong>FixoHub</strong>
              <p>India's trusted home & tech service marketplace. 50,000+ bookings across top cities with guaranteed 365-day service warranty.</p>
            </div>
            <div>
              <h4>Services</h4>
              {['Laptop Repair', 'Mobile Screen', 'AC Service', 'Deep Cleaning', 'TV Mount', 'Plumbing', 'Electrician', 'RO Service'].map(s => (
                <a key={s} href="#">{s}</a>
              ))}
            </div>
            <div>
              <h4>Customer Support</h4>
              <a href="#" onClick={e => { e.preventDefault(); setView('wallet'); }}>FixoWallet</a>
              <a href="#" onClick={e => { e.preventDefault(); setView('profile'); }}>Saved Addresses</a>
              <a href="#" onClick={e => { e.preventDefault(); setShowTicketModal(true); }}>Raise Ticket</a>
              <a href="#" onClick={e => { e.preventDefault(); setShowScratchModal(true); }}>Scratch Cards</a>
            </div>
            <div>
              <h4>Download Customer App</h4>
              <a href="/HomeServePro.apk" download style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1e293b', padding: '10px 16px', borderRadius: 10, color: '#fff', textDecoration: 'none', marginTop: 10 }}>
                <Download size={18} /> Download Android APK (3.2 MB)
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FixoHub. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>

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
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>Booking #{bookingSuccess.id} created.</p>
                  <button className="btn btn-primary" onClick={() => { setView('bookings'); setCartOpen(false); setBookingSuccess(null); }}>View Booking</button>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ marginBottom: 14 }}>Your cart is empty</p>
                  <button className="btn btn-primary" onClick={() => setCartOpen(false)}>Browse Services</button>
                </div>
              ) : (
                <>
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

                  {/* 30-min Express Toggle */}
                  <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: '#1e40af' }}>⚡ 30-Min Express Dispatch</strong>
                      <div style={{ fontSize: '0.74rem', color: '#3b82f6' }}>Technician arrives within 30 minutes (+₹149)</div>
                    </div>
                    <input type="checkbox" checked={isExpress} onChange={e => setIsExpress(e.target.checked)} style={{ width: 18, height: 18 }} />
                  </div>

                  {/* Tip Technician */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Tip Your Technician</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[0, 50, 100, 200].map(tip => (
                        <button key={tip} type="button" onClick={() => setTipAmount(tip)} className="btn btn-sm" style={{ flex: 1, background: tipAmount === tip ? 'var(--primary)' : '#fff', color: tipAmount === tip ? '#fff' : '#0d0d0d', border: '1.5px solid var(--border)' }}>
                          {tip === 0 ? 'None' : `₹${tip}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo Input */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Promo Code</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} placeholder="FIXO50 / LUCKY30" style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 10, padding: '9px 12px', fontSize: '0.86rem', outline: 'none' }} />
                      <button className="btn btn-outline" onClick={applyPromo}>Apply</button>
                    </div>
                    {appliedPromo && <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: 4, fontWeight: 600 }}>✓ {appliedPromo.code} applied (-₹{discountAmt})</div>}
                  </div>

                  {/* Bill Breakdown */}
                  <div style={{ background: '#f7f9fc', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 6 }}><span>Subtotal</span><span>₹{subTotal}</span></div>
                    {discountAmt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#10b981', marginBottom: 6 }}><span>Promo Discount</span><span>-₹{discountAmt}</span></div>}
                    {isExpress && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#1e40af', marginBottom: 6 }}><span>Express Dispatch</span><span>+₹149</span></div>}
                    {tipAmount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 6 }}><span>Technician Tip</span><span>+₹{tipAmount}</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', borderTop: '1.5px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                      <span>Total Payable</span><span>₹{finalPayable}</span>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {customer?.active_subscription && (
                      <div style={{ background: '#f5f3ff', border: '1.5px solid #c4b5fd', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.2rem' }}>👑</span>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6d28d9' }}>VIP AMC Care Active</div>
                          <div style={{ fontSize: '0.74rem', color: '#7c3aed' }}>Zero inspection fee & priority field crew assigned!</div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div className="form-group">
                        <label>Customer Name *</label>
                        <input
                          type="text"
                          required
                          value={form.customer_name}
                          onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Primary Phone *</label>
                        <input
                          type="tel"
                          required
                          value={form.customer_phone}
                          onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div className="form-group">
                        <label>Alternate Phone</label>
                        <input
                          type="tel"
                          value={form.alternate_phone || ''}
                          onChange={e => setForm(f => ({ ...f, alternate_phone: e.target.value }))}
                          placeholder="Alternate Mobile"
                        />
                      </div>
                      <div className="form-group">
                        <label>Area Pin Code *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={form.pincode || ''}
                          onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                          placeholder="e.g. 110016"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Complete Doorstep Address *</label>
                      <input
                        type="text"
                        required
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="House / Flat No, Building, Street"
                      />
                    </div>

                    <div className="form-group">
                      <label>Nearby Landmark</label>
                      <input
                        type="text"
                        value={form.landmark || ''}
                        onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))}
                        placeholder="e.g. Near City Mall / Opp Metro Pillar 42"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div className="form-group"><label>Date *</label><input type="date" required value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} /></div>
                      <div className="form-group"><label>Slot *</label>
                        <select value={form.scheduled_slot} onChange={e => setForm(f => ({ ...f, scheduled_slot: e.target.value }))}>
                          {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Payment Method</label>
                      <select value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
                        <option value="FixoWallet (Fast & 5% Cashback)">FixoWallet (Bal: ₹{walletBalance}) - 5% Cashback</option>
                        <option value="UPI / QR / RazorPay">UPI / GPay / PhonePe</option>
                        <option value="Credit / Debit Card">Credit / Debit Card</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}>
                      {submitting ? 'Placing Order...' : `Pay ₹${finalPayable} & Book`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== SERVICE COMPARISON MODAL ===== */}
      {showCompareModal && (
        <div className="modal-bg" onClick={() => setShowCompareModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 750, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Compare Services ({compareList.length})</h3>
              <button onClick={() => setShowCompareModal(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareList.length}, 1fr)`, gap: 14 }}>
              {compareList.map(s => (
                <div key={s.id} style={{ background: '#f7f9fc', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <img src={s.image_url} alt={s.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} />
                  <strong style={{ fontSize: '0.94rem' }}>{s.name}</strong>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{s.price}</div>
                  <div style={{ fontSize: '0.8rem' }}>⭐ {s.rating} ({s.reviews_count} reviews)</div>
                  <div style={{ fontSize: '0.8rem' }}>⏱ {s.duration_mins} mins</div>
                  <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>🛡 {s.warranty_days} Days Warranty</div>
                  <button className="btn btn-primary btn-sm" onClick={() => { addToCart(s); setShowCompareModal(false); }} style={{ marginTop: 'auto' }}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD WALLET FUNDS MODAL ===== */}
      {showAddWalletModal && (
        <div className="modal-bg" onClick={() => setShowAddWalletModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3>Recharge FixoWallet</h3>
              <button onClick={() => setShowAddWalletModal(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <div style={{ background: '#ecfdf5', borderRadius: 12, padding: 14, color: '#047857', marginBottom: 16, fontSize: '0.86rem' }}>
              🎁 <strong>5% Instant Cashback</strong> applied automatically on all top-ups!
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[500, 1000, 2000, 5000].map(amt => (
                <button key={amt} className="btn btn-sm" onClick={() => setAddWalletAmt(amt)} style={{ flex: 1, background: addWalletAmt === amt ? 'var(--primary)' : '#fff', color: addWalletAmt === amt ? '#fff' : '#0d0d0d', border: '1.5px solid var(--border)' }}>
                  ₹{amt}
                </button>
              ))}
            </div>
            <input type="number" value={addWalletAmt} onChange={e => setAddWalletAmt(+e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }} />
            <button className="btn btn-primary" onClick={addFundsToWallet} style={{ width: '100%', padding: 12 }}>Pay via UPI & Add to Wallet</button>
          </div>
        </div>
      )}

      {/* ===== LUCKY SCRATCH CARD MODAL ===== */}
      {showScratchModal && (
        <div className="modal-bg" onClick={() => setShowScratchModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎁</div>
            <h3 style={{ marginBottom: 6 }}>Daily Scratch & Win</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: 18 }}>Scratch to reveal your exclusive secret discount code!</p>
            <div
              onClick={() => setScratchClaimed(true)}
              style={{ background: scratchClaimed ? '#fef3c7' : 'linear-gradient(135deg, #0079ff, #60a5fa)', borderRadius: 14, padding: 28, cursor: 'pointer', border: '2px dashed #f59e0b', color: scratchClaimed ? '#b45309' : '#fff' }}
            >
              {scratchClaimed ? (
                <>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>CODE: LUCKY30</div>
                  <div style={{ fontSize: '0.84rem', marginTop: 4 }}>Flat 30% OFF on all services!</div>
                </>
              ) : (
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>👉 TAP TO SCRATCH 👈</div>
              )}
            </div>
            {scratchClaimed && (
              <button className="btn btn-primary btn-sm" onClick={() => { setPromoInput('LUCKY30'); setShowScratchModal(false); setCartOpen(true); }} style={{ marginTop: 16 }}>
                Apply to Cart
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== SUPPORT TICKET MODAL ===== */}
      {showTicketModal && (
        <div className="modal-bg" onClick={() => setShowTicketModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3>Raise Support Ticket</h3>
              <button onClick={() => setShowTicketModal(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <form onSubmit={createTicket} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group"><label>Category</label>
                <select value={ticketForm.category} onChange={e => setTicketForm(f => ({ ...f, category: e.target.value }))}>
                  {['Service Quality', 'Billing & Refunds', 'Rescheduling', 'Damage Claim', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Subject</label><input required placeholder="Brief summary of issue" value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} /></div>
              <div className="form-group"><label>Detailed Description</label><textarea required rows={3} placeholder="Please provide details..." value={ticketForm.desc} onChange={e => setTicketForm(f => ({ ...f, desc: e.target.value }))} /></div>
              <button type="submit" className="btn btn-primary" style={{ padding: 11 }}>Submit Ticket</button>
            </form>
          </div>
        </div>
      )}

      {/* ===== SERVICE DETAIL MODAL ===== */}
      {svcDetailModal && (
        <div className="modal-bg" onClick={() => setSvcDetailModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{ position: 'relative' }}>
              <img src={svcDetailModal.image_url} alt={svcDetailModal.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <button onClick={() => setSvcDetailModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'grid', placeItems: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{svcDetailModal.name}</h2>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>₹{svcDetailModal.price}</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#475569', marginBottom: 14 }}>{svcDetailModal.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, background: '#f7f9fc', borderRadius: 12, padding: 12, textAlign: 'center', marginBottom: 16 }}>
                <div><strong>⭐ {svcDetailModal.rating}</strong><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Rating</div></div>
                <div><strong>⏱ {svcDetailModal.duration_mins}m</strong><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Duration</div></div>
                <div><strong>🛡 {svcDetailModal.warranty_days}d</strong><div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Warranty</div></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: 12 }} onClick={() => { addToCart(svcDetailModal); setSvcDetailModal(null); }}>Add to Cart (₹{svcDetailModal.price})</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModal && (
        <div className="modal-bg" onClick={() => setInvoiceModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 24, maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <strong>FixoHub Tax Invoice</strong>
              <button onClick={() => setInvoiceModal(null)} style={{ background: 'none', border: 'none' }}><X size={18} /></button>
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--muted)', marginBottom: 12 }}>Booking ID: #{invoiceModal.id}</div>
            {(invoiceModal.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.86rem' }}>
                <span>{item.name} × {item.qty}</span>
                <strong>₹{item.price * item.qty}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 800 }}>
              <span>Total Paid</span>
              <span>₹{invoiceModal.total_amount}</span>
            </div>
            <button className="btn btn-outline" onClick={() => window.print()} style={{ width: '100%', marginTop: 16 }}>Print Receipt</button>
          </div>
        </div>
      )}

      {/* ===== CUSTOMER REGISTRATION / PROFILE MODAL ===== */}
      {showRegModal && (
        <div className="modal-bg" onClick={() => setShowRegModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottom: '1px solid var(--border)', pb: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', color: '#1d4ed8', display: 'grid', placeItems: 'center', fontSize: '1.2rem' }}>
                  👤
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Customer Details &amp; Registration</h3>
                  <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>
                    🎁 Complete registration &amp; get ₹100 Welcome Bonus!
                  </div>
                </div>
              </div>
              <button onClick={() => setShowRegModal(false)} style={{ background: 'none', border: 'none' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleRegisterCustomer} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label>Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={regForm.name || ''}
                  onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Primary Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={regForm.phone || ''}
                    onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Alternate Mobile</label>
                  <input
                    type="tel"
                    placeholder="+91 98111 22334"
                    value={regForm.alternate_phone || ''}
                    onChange={e => setRegForm(f => ({ ...f, alternate_phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Gmail / Email ID *</label>
                <input
                  type="email"
                  required
                  placeholder="customer@gmail.com"
                  value={regForm.email || ''}
                  onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Complete Doorstep Address (Flat/House No, Building, Street) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Flat 402, Tower B, Green Park Residency, Sector 15"
                  value={regForm.address || ''}
                  onChange={e => setRegForm(f => ({ ...f, address: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Nearby Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near City Mall"
                    value={regForm.landmark || ''}
                    onChange={e => setRegForm(f => ({ ...f, landmark: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Area Pin Code (6 Digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 110016"
                    value={regForm.pincode || ''}
                    onChange={e => setRegForm(f => ({ ...f, pincode: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Address Type</label>
                  <select
                    value={regForm.address_type || 'Home'}
                    onChange={e => setRegForm(f => ({ ...f, address_type: e.target.value }))}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Office / Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={regForm.city || 'Delhi NCR'}
                    onChange={e => setRegForm(f => ({ ...f, city: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowRegModal(false)}
                  style={{ flex: 1, padding: 11 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: 11, fontWeight: 800 }}
                >
                  Save &amp; Claim ₹100 Bonus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== AMC SUBSCRIPTION CONGRATULATIONS MODAL ===== */}
      {amcSuccessModal && (
        <div className="modal-bg" onClick={() => setAmcSuccessModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460, padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>👑</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e1b4b', marginBottom: 8 }}>
              VIP AMC Care Subscribed!
            </h2>
            <div style={{
              background: '#f5f3ff',
              border: '1.5px solid #c4b5fd',
              borderRadius: 14,
              padding: '16px',
              margin: '16px 0',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.76rem', color: '#7c3aed', fontWeight: 800, textTransform: 'uppercase' }}>Package Details</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', marginTop: 2 }}>{amcSuccessModal.plan.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10, fontSize: '0.82rem' }}>
                <div><strong>Duration:</strong> 365 Days</div>
                <div><strong>Visits:</strong> {amcSuccessModal.plan.visits_included} Deep Visits</div>
                <div><strong>Inspection:</strong> ₹0 (Free)</div>
                <div><strong>Spares:</strong> 20% OFF</div>
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: 20 }}>
              Your membership has been registered in the FixoHub network. All future service bookings will automatically reflect your VIP status and 0 visiting fees!
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 800, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              onClick={() => { setAmcSuccessModal(null); setView('amc'); }}
            >
              Go to AMC Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
