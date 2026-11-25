import { useEffect, useState, useMemo } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, Users, Plus, RefreshCw, Trash2,
  CheckCircle, XCircle, ExternalLink, LogOut, Tag, MessageSquare, CreditCard,
  FileText, Layers, Settings, Send, ShieldCheck, DollarSign, UserCheck, Bell,
  AlertTriangle, Check, Ban, Search, Download, Edit3, Image, HelpCircle,
  TrendingUp, Clock, MapPin, Eye, Filter, ArrowUpRight, CheckCheck, X,
  Radio, Smartphone
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';
const STATUSES = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];
const CITIES = ['All Cities', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Jaipur', 'Chennai', 'Kolkata'];

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('hs_admin_auth') === '1');
  const [loginPhone, setLoginPhone] = useState('+91 9876543210');
  const [loginPass, setLoginPass] = useState('12345678');

  // Navigation tab
  const [tab, setTab] = useState('overview');
  const [revMode, setRevMode] = useState('Total GMV');

  // Backend state
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [requests, setRequests] = useState([]);
  const [promos, setPromos] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chats, setChats] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [searchBooking, setSearchBooking] = useState('');
  const [searchService, setSearchService] = useState('');
  const [serviceCatFilter, setServiceCatFilter] = useState('all');
  const [searchCustomer, setSearchCustomer] = useState('');

  // Selected Booking Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // KYC Verification state
  const [kycTab, setKycTab] = useState('Pending');
  const [kycList, setKycList] = useState([
    { id: 'kyc-1', name: 'Electric (Ramesh Kumar)', phone: '+91 98765 43210', docType: 'Aadhaar + ITI Electrical Cert', city: 'Delhi NCR', status: 'Approved', date: '20 Nov 2026', certNo: 'ITI-DEL-98442' },
    { id: 'kyc-2', name: 'PlumbService Pvt Ltd', phone: '+91 98111 22334', docType: 'GSTIN + Trade License', city: 'Mumbai', status: 'Approved', date: '22 Nov 2026', certNo: 'GST27AABCP1234' },
    { id: 'kyc-3', name: 'Vikram Sharma (AC Pro)', phone: '+91 98234 56789', docType: 'Aadhaar Card + Experience Cert', city: 'Delhi NCR', status: 'Pending', date: '25 Nov 2026', certNo: 'AADHAAR-8921' },
    { id: 'kyc-4', name: 'SmartClean Solutions', phone: '+91 99876 54321', docType: 'Company Registration Certificate', city: 'Bengaluru', status: 'Pending', date: '25 Nov 2026', certNo: 'CIN-U74999KA' },
    { id: 'kyc-5', name: 'DiyingData Multi-Services', phone: '+91 98555 66778', docType: 'Shop Act License + Police Clearance', city: 'Pune', status: 'Approved', date: '19 Nov 2026', certNo: 'MH-PUN-552' }
  ]);

  // Partner Payouts state
  const [payouts, setPayouts] = useState([
    { id: 'PAY-1001', provider: 'Electric', amount: 4850, upi: 'electric@okhdfcbank', status: 'Pending', jobs: 24, date: '25 Nov 2026', utr: '' },
    { id: 'PAY-1002', provider: 'PlumbService Pvt Ltd', amount: 8200, upi: 'plumb@icici', status: 'Settled', jobs: 38, date: '23 Nov 2026', utr: 'UTR9988221' },
    { id: 'PAY-1003', provider: 'World Clean Pvt. Ltd.', amount: 11400, upi: 'clean@paytm', status: 'Settled', jobs: 52, date: '21 Nov 2026', utr: 'UTR7711440' },
    { id: 'PAY-1004', provider: 'Piston Car Service', amount: 3950, upi: 'piston@axisbank', status: 'Pending', jobs: 18, date: '25 Nov 2026', utr: '' }
  ]);

  // Customers CRM state
  const [customers, setCustomers] = useState([
    { id: 'cust-1', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@gmail.com', city: 'Delhi NCR', orders: 8, spend: 6499, wallet: 1500, joined: '15 Oct 2026', status: 'Active' },
    { id: 'cust-2', name: 'Aditya Vekariya', phone: '+91 98112 33445', email: 'aditya@yahoo.com', city: 'Pune', orders: 12, spend: 14200, wallet: 800, joined: '02 Sep 2026', status: 'Active' },
    { id: 'cust-3', name: 'Priya Nair', phone: '+91 99223 44556', email: 'priya@tech.com', city: 'Mumbai', orders: 5, spend: 4890, wallet: 350, joined: '12 Nov 2026', status: 'Active' },
    { id: 'cust-4', name: 'Amit Singh', phone: '+91 97334 55667', email: 'amit@outlook.com', city: 'Bengaluru', orders: 9, spend: 8900, wallet: 620, joined: '28 Oct 2026', status: 'Active' },
    { id: 'cust-5', name: 'Sneha Kapoor', phone: '+91 98445 66778', email: 'sneha@gmail.com', city: 'Delhi NCR', orders: 6, spend: 5400, wallet: 200, joined: '05 Nov 2026', status: 'Active' },
    { id: 'cust-6', name: 'Fake Account (Spam)', phone: '+91 90000 00000', email: 'spam@bot.net', city: 'Delhi NCR', orders: 0, spend: 0, wallet: 0, joined: '24 Nov 2026', status: 'Banned' }
  ]);
  const [addWalletCustomer, setAddWalletCustomer] = useState(null);
  const [adminWalletBonus, setAdminWalletBonus] = useState(200);

  // Support Dispute Tickets state
  const [tickets, setTickets] = useState([
    { id: 'TKT-104', customer: 'Rahul Sharma', phone: '+91 98765 43210', category: 'Billing & Refunds', subject: 'Query on invoice receipt', status: 'Resolved', date: '24 Nov 2026', reply: 'Invoice re-sent to email.' },
    { id: 'TKT-105', customer: 'Priya Nair', phone: '+91 99223 44556', category: 'Service Quality', subject: 'Technician was 15 mins late due to rain', status: 'Open', date: '25 Nov 2026', reply: '' },
    { id: 'TKT-106', customer: 'Aditya Vekariya', phone: '+91 98112 33445', category: 'Rescheduling', subject: 'Request slot change for Kitchen deep clean', status: 'In Progress', date: '25 Nov 2026', reply: 'Reassigned slot to 04:00 PM.' }
  ]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Hero Banners & Promotional Ads
  const [heroBanners, setHeroBanners] = useState([
    { id: 'ban-1', title: 'Reliable & Affordable Home Services', subtitle: 'Flat 50% OFF on your first booking with FIXO50', category: 'All Services', active: true },
    { id: 'ban-2', title: 'Expert AC Foam-Jet Cleaning & Gas Refill', subtitle: 'Doorstep technicians equipped with nitrogen leak tests', category: 'AC Services', active: true },
    { id: 'ban-3', title: 'Doorstep Laptop & Mobile Screen Replacement', subtitle: 'OEM grade displays with 180-day warranty', category: 'Laptop & Mobile', active: true }
  ]);
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', category: 'All Services' });
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);

  // Emergency Broadcast Banner
  const [broadcastMsg, setBroadcastMsg] = useState('🔥 Diwali Festive Offer: Get Flat ₹250 OFF on orders above ₹999 with code DIWALI250!');
  const [isBroadcastActive, setIsBroadcastActive] = useState(true);

  // System Settings state
  const [settingsForm, setSettingsForm] = useState({
    platformName: 'FixoHub',
    supportPhone: '1800-FIXOHUB',
    supportEmail: 'support@fixohub.in',
    currency: 'INR (₹)',
    platformCommission: 15,
    expressDeliveryFee: 149,
    taxPercent: 18,
    minOrderAmount: 199,
    cancelPenalty: 99,
    maintenanceMode: false,
    appVersion: '2.4.0',
    forceUpdate: false
  });

  // Modals state
  const [showSrvModal, setShowSrvModal] = useState(false);
  const [editSrv, setEditSrv] = useState(null);
  const [srvForm, setSrvForm] = useState({
    category_id: 'cat-home', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '', image_url: ''
  });

  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({
    id: '', name: '', slug: '', icon: 'Wrench', color: '#0079ff', tagline: ''
  });

  const [showTechModal, setShowTechModal] = useState(false);
  const [techForm, setTechForm] = useState({
    name: '', phone: '', specialty: 'Electronic Services', city: 'Delhi NCR'
  });

  const [promoForm, setPromoForm] = useState({ code: '', discount_percent: 25, min_order: 299, max_discount: 500 });
  const [replyText, setReplyText] = useState('');

  // Initial Load
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

  // Handlers
  const updateBooking = async (id, patch) => {
    await fetch(`${API}/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    fetchAll();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, ...patch });
    }
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
    if (!confirm('Are you sure you want to permanently delete this service?')) return;
    await fetch(`${API}/api/services/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const saveService = async (e) => {
    e.preventDefault();
    const payload = {
      ...srvForm,
      price: +srvForm.price,
      original_price: +srvForm.original_price || +srvForm.price * 1.3,
      duration_mins: +srvForm.duration_mins,
      warranty_days: +srvForm.warranty_days,
      image_url: srvForm.image_url || 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=500&q=80',
      includes: typeof srvForm.includes === 'string' ? srvForm.includes.split(',').map(s => s.trim()).filter(Boolean) : srvForm.includes
    };

    if (editSrv) {
      await fetch(`${API}/api/services/${editSrv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setEditSrv(null);
    } else {
      await fetch(`${API}/api/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    setShowSrvModal(false);
    setSrvForm({ category_id: 'cat-home', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '', image_url: '' });
    fetchAll();
  };

  const openEditService = (srv) => {
    setEditSrv(srv);
    setSrvForm({
      category_id: srv.category_id || 'cat-home',
      name: srv.name,
      description: srv.description || '',
      price: srv.price,
      original_price: srv.original_price || '',
      duration_mins: srv.duration_mins || 45,
      warranty_days: srv.warranty_days || 30,
      includes: Array.isArray(srv.includes) ? srv.includes.join(', ') : '',
      image_url: srv.image_url || ''
    });
    setShowSrvModal(true);
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
    setKycList(kycList.map(k => k.id === id ? { ...k, status: 'Approved' } : k));
    alert('Provider KYC Approved & Verified Badge granted!');
  };

  const rejectKyc = (id) => {
    const reason = prompt('Reason for rejection:', 'Documents unreadable or incomplete');
    if (!reason) return;
    setKycList(kycList.map(k => k.id === id ? { ...k, status: `Rejected: ${reason}` } : k));
  };

  const settlePayout = (id) => {
    const utr = prompt('Enter Bank/UPI Reference / UTR Number:', `UTR${Math.floor(1000000 + Math.random() * 9000000)}`);
    if (!utr) return;
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Settled', utr } : p));
    alert(`Payout ${id} settled successfully! Funds transferred.`);
  };

  const toggleCustomerBan = (id) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Banned' : 'Active' } : c));
  };

  const addBonusToCustomer = (e) => {
    e.preventDefault();
    if (!addWalletCustomer || !adminWalletBonus) return;
    setCustomers(customers.map(c => c.id === addWalletCustomer.id ? { ...c, wallet: c.wallet + (+adminWalletBonus) } : c));
    alert(`₹${adminWalletBonus} added to ${addWalletCustomer.name}'s FixoWallet!`);
    setAddWalletCustomer(null);
  };

  const submitTicketReply = (e) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReplyText) return;
    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, reply: ticketReplyText, status: 'Resolved' } : t));
    setSelectedTicket(null);
    setTicketReplyText('');
    alert('Reply sent to customer and ticket marked as Resolved!');
  };

  const addHeroBanner = (e) => {
    e.preventDefault();
    if (!newBanner.title) return;
    setHeroBanners([
      ...heroBanners,
      { id: `ban-${Date.now()}`, title: newBanner.title, subtitle: newBanner.subtitle, category: newBanner.category, active: true }
    ]);
    setShowAddBannerModal(false);
    setNewBanner({ title: '', subtitle: '', category: 'All Services' });
    alert('Banner added to Homepage Carousel!');
  };

  const deleteHeroBanner = (id) => {
    setHeroBanners(heroBanners.filter(b => b.id !== id));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('hs_admin_auth', '1');
    setAuthed(true);
  };

  // Filtered Bookings calculation
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchCity = cityFilter === 'All Cities' || b.city === cityFilter;
      const q = searchBooking.trim().toLowerCase();
      const matchSearch = !q ||
        (b.booking_code && b.booking_code.toLowerCase().includes(q)) ||
        (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
        (b.customer_phone && b.customer_phone.includes(q));
      return matchStatus && matchCity && matchSearch;
    });
  }, [bookings, statusFilter, cityFilter, searchBooking]);

  // Filtered Services calculation
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchCat = serviceCatFilter === 'all' || s.category_id === serviceCatFilter;
      const q = searchService.trim().toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, serviceCatFilter, searchService]);

  // Filtered Customers calculation
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchCustomer.trim().toLowerCase();
      return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
    });
  }, [customers, searchCustomer]);

  // Total GMV & Platform Earnings
  const totalGMV = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 54200;
  const platformEarnings = Math.round(totalGMV * (settingsForm.platformCommission / 100));

  // If not authenticated, show professional Super Admin Login Screen
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        background: 'linear-gradient(120deg, rgba(15,23,42,0.75) 0%, rgba(0,121,255,0.5) 100%), url(/images/ac.jpg) center/cover no-repeat',
        padding: '28px 6vw', fontFamily: 'Inter, -apple-system, sans-serif'
      }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 36, width: '100%', maxWidth: 430, boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: '#0079ff', color: '#fff', display: 'inline-grid', placeItems: 'center', fontWeight: 800, fontSize: '1.3rem', marginBottom: 10 }}>FH</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d0d0d' }}>FixoHub Admin</h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Master Control &amp; Operations Center</p>
          </div>
          <form onSubmit={handleLogin} className="form-grid">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Phone or Username</label>
              <input required value={loginPhone} onChange={e => setLoginPhone(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Password</label>
              <input required type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, borderRadius: 10, background: '#0079ff', fontSize: '0.94rem' }}>
              Log In to Master Admin &rarr;
            </button>
          </form>
          <div style={{ marginTop: 20, background: '#f1f5f9', borderRadius: 10, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.78rem' }}>
              <strong>Demo Super Admin Credentials</strong>
              <div style={{ color: '#64748b' }}>Phone: +91 9876543210 | Pass: 12345678</div>
            </div>
            <button type="button" onClick={handleLogin} style={{ background: '#0079ff', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 700, fontSize: '0.78rem' }}>
              Quick Fill
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">FH</div>
          <div>
            <div style={{ color: '#0d0d0d', fontWeight: 800, fontSize: '1.05rem' }}>FixoHub</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Enterprise Admin</div>
          </div>
        </div>

        <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <LayoutDashboard size={17} /> Dashboard
        </button>

        <div className="sidebar-group">Live Operations</div>
        <button className={`nav-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
          <CalendarCheck size={17} /> Live Dispatch ({bookings.length})
        </button>
        <button className={`nav-btn ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
          <FileText size={17} /> Custom Bids ({requests.length})
        </button>

        <div className="sidebar-group">Service Catalog</div>
        <button className={`nav-btn ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
          <Wrench size={17} /> Services ({services.length})
        </button>
        <button className={`nav-btn ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>
          <Layers size={17} /> Categories ({categories.length})
        </button>

        <div className="sidebar-group">Providers &amp; KYC</div>
        <button className={`nav-btn ${tab === 'technicians' ? 'active' : ''}`} onClick={() => setTab('technicians')}>
          <Users size={17} /> Providers ({technicians.length})
        </button>
        <button className={`nav-btn ${tab === 'kyc' ? 'active' : ''}`} onClick={() => setTab('kyc')}>
          <ShieldCheck size={17} /> KYC Center ({kycList.filter(k => k.status === 'Pending').length})
        </button>

        <div className="sidebar-group">Finance &amp; Ledger</div>
        <button className={`nav-btn ${tab === 'payouts' ? 'active' : ''}`} onClick={() => setTab('payouts')}>
          <DollarSign size={17} /> Partner Payouts
        </button>
        <button className={`nav-btn ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>
          <CreditCard size={17} /> Transactions ({transactions.length})
        </button>

        <div className="sidebar-group">Customers &amp; Support</div>
        <button className={`nav-btn ${tab === 'customers' ? 'active' : ''}`} onClick={() => setTab('customers')}>
          <UserCheck size={17} /> Customers ({customers.length})
        </button>
        <button className={`nav-btn ${tab === 'tickets' ? 'active' : ''}`} onClick={() => setTab('tickets')}>
          <HelpCircle size={17} /> Support Tickets ({tickets.filter(t => t.status !== 'Resolved').length})
        </button>
        <button className={`nav-btn ${tab === 'chats' ? 'active' : ''}`} onClick={() => setTab('chats')}>
          <MessageSquare size={17} /> Chat Monitor ({chats.length})
        </button>

        <div className="sidebar-group">Marketing &amp; Ads</div>
        <button className={`nav-btn ${tab === 'promos' ? 'active' : ''}`} onClick={() => setTab('promos')}>
          <Tag size={17} /> Promo Coupons ({promos.length})
        </button>
        <button className={`nav-btn ${tab === 'banners' ? 'active' : ''}`} onClick={() => setTab('banners')}>
          <Image size={17} /> Banner Ads ({heroBanners.length})
        </button>
        <button className={`nav-btn ${tab === 'broadcast' ? 'active' : ''}`} onClick={() => setTab('broadcast')}>
          <Bell size={17} /> Live Announcement
        </button>

        <div className="sidebar-group">System</div>
        <button className={`nav-btn ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
          <Settings size={17} /> Platform Settings
        </button>

        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className="nav-btn" onClick={() => { localStorage.removeItem('hs_admin_auth'); setAuthed(false); }}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main">
        <div className="topbar">
          <div>
            <h1 style={{ textTransform: 'capitalize', fontSize: '1.45rem' }}>{tab}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-outline" onClick={fetchAll}><RefreshCw size={15} /> Refresh Data</button>
            {tab === 'services' && (
              <button className="btn btn-primary" onClick={() => { setEditSrv(null); setSrvForm({ category_id: 'cat-home', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '', image_url: '' }); setShowSrvModal(true); }}>
                <Plus size={16} /> Add Service
              </button>
            )}
            {tab === 'categories' && (
              <button className="btn btn-primary" onClick={() => setShowCatModal(true)}>
                <Plus size={16} /> Add Category
              </button>
            )}
            {tab === 'technicians' && (
              <button className="btn btn-primary" onClick={() => setShowTechModal(true)}>
                <Plus size={16} /> Add Provider
              </button>
            )}
            {tab === 'banners' && (
              <button className="btn btn-primary" onClick={() => setShowAddBannerModal(true)}>
                <Plus size={16} /> New Banner
              </button>
            )}
          </div>
        </div>

        {/* ==================== 1. OVERVIEW DASHBOARD ==================== */}
        {tab === 'overview' && (
          <>
            <div style={{ background: 'linear-gradient(135deg, #0079ff 0%, #0056b3 100%)', color: '#fff', borderRadius: 14, padding: '22px 26px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.82rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>EXECUTIVE METRICS</span>
                <h2 style={{ fontSize: '1.5rem', margin: '8px 0 4px' }}>Welcome back, Super Admin</h2>
                <div style={{ fontSize: '0.86rem', opacity: 0.9 }}>Real-time overview across {technicians.length} providers and {bookings.length} active service orders.</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{totalGMV.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Total GMV</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffd000' }}>₹{platformEarnings.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Platform Commission (15%)</div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Gross Merchandise Value</div>
                <div className="kpi-value">₹{totalGMV.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: 4 }}>↑ 18.4% vs last week</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Bookings</div>
                <div className="kpi-value">{bookings.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>{bookings.filter(b => b.status === 'completed').length} completed</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Active Services</div>
                <div className="kpi-value">{services.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>Across {categories.length} categories</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Verified Providers</div>
                <div className="kpi-value" style={{ color: '#10b981' }}>{technicians.length} Active</div>
                <div style={{ fontSize: '0.74rem', color: '#f59e0b', marginTop: 4 }}>{kycList.filter(k => k.status === 'Pending').length} KYC pending</div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>Revenue &amp; Order Volume Growth</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Daily aggregated transactions from customer bookings</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Total GMV', 'Platform Fee', 'Partner Payouts'].map(m => (
                    <button key={m} className={`btn ${revMode === m ? 'btn-primary' : 'btn-outline'}`} onClick={() => setRevMode(m)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>{m}</button>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 600 130" style={{ width: '100%', height: 140 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0079ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0079ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,110 L60,105 L120,95 L180,98 L240,80 L300,30 L360,65 L420,55 L480,45 L540,25 L600,15 L600,130 L0,130 Z" fill="url(#revGrad)" />
                <path d="M0,110 L60,105 L120,95 L180,98 L240,80 L300,30 L360,65 L420,55 L480,45 L540,25 L600,15" fill="none" stroke="#0079ff" strokeWidth="3" />
              </svg>
            </div>

            {/* Bottom 2 Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3>Recent Booking Dispatch</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setTab('bookings')}>View All &rarr;</button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>Customer</th><th>Services</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id} onClick={() => setSelectedBooking(b)} style={{ cursor: 'pointer' }}>
                          <td><strong>#{b.booking_code}</strong></td>
                          <td>{b.customer_name}</td>
                          <td>{(b.items || []).map(i => i.name).join(', ')}</td>
                          <td><strong>₹{b.total_amount}</strong></td>
                          <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: 12 }}>Category Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {categories.slice(0, 5).map((cat, idx) => {
                    const count = services.filter(s => s.category_id === cat.id).length;
                    const pct = Math.round((count / (services.length || 1)) * 100);
                    return (
                      <div key={cat.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                          <strong>{cat.name}</strong>
                          <span style={{ color: '#64748b' }}>{count} services ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: 7, background: '#e2e8f0', borderRadius: 99 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: cat.color || '#0079ff', borderRadius: 99 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== 2. LIVE BOOKINGS DISPATCH ==================== */}
        {tab === 'bookings' && (
          <div className="card">
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', gap: 8, flex: 1, minWidth: 200 }}>
                <Search size={15} color="#64748b" />
                <input
                  placeholder="Search by Booking ID, Customer, Phone..."
                  value={searchBooking}
                  onChange={e => setSearchBooking(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.86rem', width: '100%' }}
                />
              </div>

              {/* City filter */}
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.86rem' }}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>

              {/* Status pills */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', ...STATUSES].map(st => (
                  <button key={st} className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter(st)} style={{ padding: '6px 10px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Customer Info</th>
                    <th>Services</th>
                    <th>Schedule</th>
                    <th>Total (₹)</th>
                    <th>Assigned Provider</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>#{b.booking_code}</strong></td>
                      <td>
                        <strong>{b.customer_name}</strong>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{b.customer_phone}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{b.city}</div>
                      </td>
                      <td>{(b.items || []).map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td>
                        <div>{b.scheduled_date}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{b.scheduled_slot}</div>
                      </td>
                      <td><strong style={{ fontSize: '0.96rem' }}>₹{b.total_amount}</strong></td>
                      <td>
                        <select className="inline-select" value={b.technician_id || ''} onChange={e => updateBooking(b.id, { technician_id: e.target.value, status: e.target.value ? 'assigned' : 'pending' })}>
                          <option value="">-- Unassigned --</option>
                          {technicians.map(t => <option key={t.id} value={t.id}>{t.name} ({t.city})</option>)}
                        </select>
                      </td>
                      <td>
                        <select className="inline-select" value={b.status} onChange={e => updateBooking(b.id, { status: e.target.value })}>
                          {STATUSES.map(st => <option key={st} value={st}>{st.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelectedBooking(b)} title="View Complete Detail">
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>No bookings matching current filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 3. CUSTOM REQUESTS & BIDS ==================== */}
        {tab === 'requests' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Custom Job Requests &amp; Bids Management</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: 16 }}>Manage custom service job requests posted by customers and bids submitted by providers.</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Customer</th><th>Requirement Title</th><th>Category</th><th>Budget Range</th><th>Bids Count</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td><strong>#{r.id}</strong></td>
                      <td><strong>{r.customer_name}</strong></td>
                      <td>
                        <div>{r.title}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{r.description}</div>
                      </td>
                      <td><span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: '0.78rem' }}>{r.category_name}</span></td>
                      <td>₹{r.min_budget} – ₹{r.max_budget}</td>
                      <td><strong>{r.bids_count} bids</strong></td>
                      <td><span className={`badge ${r.status === 'Booked' ? 'badge-completed' : 'badge-pending'}`}>{r.status}</span></td>
                      <td>
                        {r.status !== 'Booked' && (
                          <button className="btn btn-primary btn-sm" onClick={() => {
                            fetch(`${API}/api/requests/${r.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Booked' }) }).then(fetchAll);
                            alert('Request accepted & booking converted!');
                          }}>
                            Mark Booked
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 4. SERVICE CATALOG ==================== */}
        {tab === 'services' && (
          <div className="card">
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', gap: 8, flex: 1, minWidth: 200 }}>
                <Search size={15} color="#64748b" />
                <input placeholder="Search service name or keyword..." value={searchService} onChange={e => setSearchService(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.86rem', width: '100%' }} />
              </div>
              <select value={serviceCatFilter} onChange={e => setServiceCatFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.86rem' }}>
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>Photo</th><th>Service Name</th><th>Category</th><th>Price (₹)</th><th>MRP (₹)</th><th>Duration</th><th>Warranty</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredServices.map(s => (
                    <tr key={s.id}>
                      <td><img src={s.image_url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} /></td>
                      <td>
                        <strong>{s.name}</strong>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{s.description}</div>
                      </td>
                      <td>{s.category_name}</td>
                      <td><strong>₹{s.price}</strong></td>
                      <td><span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹{s.original_price}</span></td>
                      <td>{s.duration_mins}m</td>
                      <td>{s.warranty_days}d</td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleService(s)}>
                          {s.is_active ? <><CheckCircle size={13} color="#10b981" /> Active</> : <><XCircle size={13} color="#ef4444" /> Hidden</>}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEditService(s)} title="Edit"><Edit3 size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteService(s.id)} title="Delete"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 5. CATEGORIES MANAGER ==================== */}
        {tab === 'categories' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Service Categories ({categories.length})</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Category Name</th><th>Slug</th><th>Tagline</th><th>Services Count</th><th>Color</th></tr></thead>
                <tbody>
                  {categories.map(c => {
                    const count = services.filter(s => s.category_id === c.id).length;
                    return (
                      <tr key={c.id}>
                        <td><code>{c.id}</code></td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.slug}</td>
                        <td style={{ color: '#64748b' }}>{c.tagline}</td>
                        <td><span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>{count} services</span></td>
                        <td><div style={{ width: 22, height: 22, borderRadius: 6, background: c.color || '#0079ff' }} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 6. PROVIDERS ROSTER ==================== */}
        {tab === 'technicians' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Verified Handymen &amp; Multi-Vendor Partners ({technicians.length})</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Provider</th><th>Phone</th><th>Specialty</th><th>City</th><th>Rating</th><th>Completed Jobs</th><th>Duty Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {technicians.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.phone}</td>
                      <td><span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{t.specialty}</span></td>
                      <td>{t.city}</td>
                      <td><strong style={{ color: '#f59e0b' }}>★ {t.rating}</strong></td>
                      <td><strong>{t.jobs_completed}</strong></td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleTechnician(t)}>
                          {t.is_available ? <><CheckCircle size={13} color="#10b981" /> Online</> : <><XCircle size={13} color="#ef4444" /> Busy/Offline</>}
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => alert(`Provider Performance Report:\n${t.name}\nCompleted: ${t.jobs_completed} jobs\nCity: ${t.city}\nRating: ${t.rating} / 5.0`)}>
                          Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 7. KYC & COMPLIANCE ==================== */}
        {tab === 'kyc' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3>Provider KYC &amp; Verification Center</h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>Approve trade licenses, identity proofs, and police verification.</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Pending', 'Approved', 'All'].map(k => (
                  <button key={k} className={`btn ${kycTab === k ? 'btn-primary' : 'btn-outline'}`} onClick={() => setKycTab(k)} style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>Provider</th><th>Phone</th><th>City</th><th>Document Type</th><th>Cert / Doc #</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {kycList.filter(k => kycTab === 'All' || k.status.startsWith(kycTab)).map(k => (
                    <tr key={k.id}>
                      <td><strong>{k.name}</strong></td>
                      <td>{k.phone}</td>
                      <td>{k.city}</td>
                      <td><span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: '0.78rem' }}>{k.docType}</span></td>
                      <td><code>{k.certNo}</code></td>
                      <td>{k.date}</td>
                      <td><span className={`badge ${k.status === 'Approved' ? 'badge-completed' : 'badge-pending'}`}>{k.status}</span></td>
                      <td>
                        {k.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-primary btn-sm" onClick={() => approveKyc(k.id)}>✓ Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => rejectKyc(k.id)}>✕ Reject</button>
                          </div>
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

        {/* ==================== 8. PARTNER PAYOUTS ==================== */}
        {tab === 'payouts' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Partner Wallet Settlement &amp; Payouts</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: 16 }}>Process automated and manual payout requests from verified technicians.</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Payout ID</th><th>Provider</th><th>Jobs Completed</th><th>Amount (₹)</th><th>Bank / UPI Account</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {payouts.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.id}</strong></td>
                      <td><strong>{p.provider}</strong></td>
                      <td>{p.jobs} jobs</td>
                      <td><strong style={{ fontSize: '1.05rem', color: '#059669' }}>₹{p.amount}</strong></td>
                      <td><code>{p.upi}</code></td>
                      <td>{p.date}</td>
                      <td>
                        <span className={`badge ${p.status === 'Settled' ? 'badge-completed' : 'badge-pending'}`}>{p.status}</span>
                        {p.utr && <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>Ref: {p.utr}</div>}
                      </td>
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

        {/* ==================== 9. TRANSACTIONS ==================== */}
        {tab === 'transactions' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Payment Gateway &amp; Transaction Ledger</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Booking #</th><th>Customer</th><th>Provider</th><th>Method</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td><strong>#{t.booking_code}</strong></td>
                      <td>{t.customer_name}</td>
                      <td>{t.provider_name}</td>
                      <td><span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{t.method}</span></td>
                      <td><strong>₹{t.amount}</strong></td>
                      <td><span className={`badge ${t.status === 'Success' ? 'badge-completed' : 'badge-pending'}`}>{t.status}</span></td>
                      <td>{t.created_at?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 10. CUSTOMERS CRM ==================== */}
        {tab === 'customers' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3>Customer Directory ({customers.length})</h3>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>Manage user accounts, order volume, and wallet credits.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', gap: 8 }}>
                <Search size={15} color="#64748b" />
                <input placeholder="Search customer name, phone..." value={searchCustomer} onChange={e => setSearchCustomer(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.86rem' }} />
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>Customer Name</th><th>Phone</th><th>City</th><th>Total Orders</th><th>Lifetime Spend</th><th>Wallet Bal</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredCustomers.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong><div style={{ fontSize: '0.76rem', color: '#64748b' }}>{c.email}</div></td>
                      <td>{c.phone}</td>
                      <td>{c.city}</td>
                      <td><strong>{c.orders}</strong></td>
                      <td><strong>₹{c.spend}</strong></td>
                      <td><span style={{ color: '#059669', fontWeight: 800 }}>₹{c.wallet}</span></td>
                      <td><span className={`badge ${c.status === 'Active' ? 'badge-completed' : 'badge-cancelled'}`}>{c.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setAddWalletCustomer(c)} title="Add Wallet Bonus">+ Wallet</button>
                          <button className="btn btn-outline btn-sm" onClick={() => toggleCustomerBan(c.id)}>
                            {c.status === 'Active' ? <><Ban size={12} color="#ef4444" /> Ban</> : <><Check size={12} color="#10b981" /> Unban</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 11. PROMO CODES ==================== */}
        {tab === 'promos' && (
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Create &amp; Manage Promo Codes</h3>
            <form onSubmit={addPromo} style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <input required placeholder="CODE (e.g. FESTIVE50)" value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontWeight: 700 }} />
              <input required type="number" placeholder="Discount %" value={promoForm.discount_percent} onChange={e => setPromoForm({ ...promoForm, discount_percent: +e.target.value })} style={{ width: 120, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <input type="number" placeholder="Min Order ₹" value={promoForm.min_order} onChange={e => setPromoForm({ ...promoForm, min_order: +e.target.value })} style={{ width: 130, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <input type="number" placeholder="Max Cap ₹" value={promoForm.max_discount} onChange={e => setPromoForm({ ...promoForm, max_discount: +e.target.value })} style={{ width: 130, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <button type="submit" className="btn btn-primary"><Plus size={15} /> Add Coupon</button>
            </form>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Promo Code</th><th>Discount</th><th>Min Order</th><th>Max Discount</th><th>Active</th><th>Action</th></tr></thead>
                <tbody>
                  {promos.map(p => (
                    <tr key={p.id}>
                      <td><strong style={{ fontSize: '0.96rem', letterSpacing: 1, color: '#0079ff' }}>{p.code}</strong></td>
                      <td><strong>{p.discount_percent}% OFF</strong></td>
                      <td>₹{p.min_order}</td>
                      <td>₹{p.max_discount}</td>
                      <td><span className="badge badge-completed">Active</span></td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deletePromo(p.id)}><Trash2 size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 12. BANNER ADS ==================== */}
        {tab === 'banners' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Hero Carousel Banners &amp; Promo Sliders ({heroBanners.length})</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Banner Title</th><th>Subtitle / Promo Text</th><th>Target Category</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {heroBanners.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.title}</strong></td>
                      <td>{b.subtitle}</td>
                      <td><span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{b.category}</span></td>
                      <td><span className="badge badge-completed">Live</span></td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteHeroBanner(b.id)}><Trash2 size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 13. EMERGENCY BROADCAST ==================== */}
        {tab === 'broadcast' && (
          <div className="card" style={{ maxWidth: 650 }}>
            <h3 style={{ marginBottom: 14 }}>Emergency Broadcast Announcement</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: 16 }}>This announcement bar will immediately appear across all pages on customer and provider websites.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <textarea rows={3} value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} style={{ padding: 12, borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '0.9rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="bc-on" checked={isBroadcastActive} onChange={e => setIsBroadcastActive(e.target.checked)} style={{ width: 18, height: 18 }} />
                <label htmlFor="bc-on" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Active &amp; Visible to All Users</label>
              </div>
              <button className="btn btn-primary" onClick={() => alert('Broadcast announcement updated live across the entire platform!')} style={{ width: 'fit-content' }}>
                Publish Broadcast Now
              </button>
            </div>
          </div>
        )}

        {/* ==================== 14. SUPPORT TICKETS ==================== */}
        {tab === 'tickets' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Customer Dispute &amp; Support Tickets</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Ticket ID</th><th>Customer</th><th>Category</th><th>Subject</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.id}</strong></td>
                      <td><strong>{t.customer}</strong><br /><span style={{ fontSize: '0.76rem', color: '#64748b' }}>{t.phone}</span></td>
                      <td><span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{t.category}</span></td>
                      <td>
                        <strong>{t.subject}</strong>
                        {t.reply && <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: 2 }}>Admin reply: {t.reply}</div>}
                      </td>
                      <td>{t.date}</td>
                      <td><span className={`badge ${t.status === 'Resolved' ? 'badge-completed' : 'badge-pending'}`}>{t.status}</span></td>
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => { setSelectedTicket(t); setTicketReplyText(t.reply || ''); }}>
                          Resolve / Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 15. CHAT MONITOR ==================== */}
        {tab === 'chats' && (
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Customer &amp; Provider Chat Monitor</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto', marginBottom: 14 }}>
              {chats.map(c => (
                <div key={c.id} style={{ padding: '10px 14px', borderRadius: 10, background: c.sender === 'customer' ? '#f1f5f9' : '#e6f2ff' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 2 }}>
                    <strong>{c.sender === 'customer' ? 'Customer' : c.partner_name}</strong> • {c.created_at?.slice(0, 16)}
                  </div>
                  <div>{c.message}</div>
                </div>
              ))}
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              if (!replyText.trim()) return;
              fetch(`${API}/api/chats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partner_id: 'tech-1', partner_name: 'FixoHub Super Admin Support', sender: 'partner', message: replyText.trim() })
              }).then(() => { setReplyText(''); fetchAll(); alert('Official message posted in chat thread!'); });
            }} style={{ display: 'flex', gap: 8 }}>
              <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Send official Admin message into chat thread..." style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              <button type="submit" className="btn btn-primary"><Send size={15} /> Send</button>
            </form>
          </div>
        )}

        {/* ==================== 16. SYSTEM SETTINGS ==================== */}
        {tab === 'settings' && (
          <div className="card" style={{ maxWidth: 700 }}>
            <h3 style={{ marginBottom: 16 }}>Platform Configuration &amp; Business Rules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Platform Name</label>
                  <input value={settingsForm.platformName} onChange={e => setSettingsForm({ ...settingsForm, platformName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Support Phone Hotline</label>
                  <input value={settingsForm.supportPhone} onChange={e => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Platform Commission (%)</label>
                  <input type="number" value={settingsForm.platformCommission} onChange={e => setSettingsForm({ ...settingsForm, platformCommission: +e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Express 30-Min Dispatch Fee (₹)</label>
                  <input type="number" value={settingsForm.expressDeliveryFee} onChange={e => setSettingsForm({ ...settingsForm, expressDeliveryFee: +e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>GST / Tax Rate (%)</label>
                  <input type="number" value={settingsForm.taxPercent} onChange={e => setSettingsForm({ ...settingsForm, taxPercent: +e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Cancellation Fee (₹)</label>
                  <input type="number" value={settingsForm.cancelPenalty} onChange={e => setSettingsForm({ ...settingsForm, cancelPenalty: +e.target.value })} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => alert('Platform settings saved successfully!')} style={{ width: 'fit-content', padding: '10px 20px' }}>
                Save Business Rules
              </button>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: 10 }}>Direct APK Downloads</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href="/HomeServePro.apk" download className="btn btn-outline" style={{ textDecoration: 'none' }}><Download size={14} /> Customer APK (3.2MB)</a>
                  <a href="/HomeServeProvider.apk" download className="btn btn-outline" style={{ textDecoration: 'none' }}><Download size={14} /> Provider APK (20KB)</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== BOOKING DETAIL MODAL ===== */}
        {selectedBooking && (
          <div className="modal-bg" onClick={() => setSelectedBooking(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>Booking #{selectedBooking.booking_code}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Created: {selectedBooking.created_at || 'Recent'}</div>
                </div>
                <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <strong>Customer: {selectedBooking.customer_name}</strong>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>Phone: {selectedBooking.customer_phone}</div>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>Address: {selectedBooking.address}, {selectedBooking.city}</div>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>Schedule: {selectedBooking.scheduled_date} @ {selectedBooking.scheduled_slot}</div>
              </div>

              <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: 6 }}>Ordered Services</strong>
              <div style={{ marginBottom: 14 }}>
                {(selectedBooking.items || []).map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.86rem' }}>
                    <span>{it.name} × {it.qty}</span>
                    <strong>₹{it.price * it.qty}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, marginBottom: 16, borderTop: '2px solid var(--border)', paddingTop: 8 }}>
                <span>Total Amount</span>
                <span>₹{selectedBooking.total_amount}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className="btn btn-outline" onClick={() => { window.print(); }}>Print Invoice</button>
                <button className="btn btn-primary" onClick={() => setSelectedBooking(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ===== ADD / EDIT SERVICE MODAL ===== */}
        {showSrvModal && (
          <div className="modal-bg" onClick={() => setShowSrvModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
              <h3>{editSrv ? 'Edit Service' : 'Add New Service'}</h3>
              <form className="form-grid" onSubmit={saveService}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Category</label>
                  <select value={srvForm.category_id} onChange={e => setSrvForm({ ...srvForm, category_id: e.target.value })}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <input required placeholder="Service Name" value={srvForm.name} onChange={e => setSrvForm({ ...srvForm, name: e.target.value })} />
                <textarea rows={2} placeholder="Service Description" value={srvForm.description} onChange={e => setSrvForm({ ...srvForm, description: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input required type="number" placeholder="Offer Price (₹)" value={srvForm.price} onChange={e => setSrvForm({ ...srvForm, price: e.target.value })} />
                  <input type="number" placeholder="MRP Price (₹)" value={srvForm.original_price} onChange={e => setSrvForm({ ...srvForm, original_price: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input type="number" placeholder="Duration (mins)" value={srvForm.duration_mins} onChange={e => setSrvForm({ ...srvForm, duration_mins: e.target.value })} />
                  <input type="number" placeholder="Warranty (days)" value={srvForm.warranty_days} onChange={e => setSrvForm({ ...srvForm, warranty_days: e.target.value })} />
                </div>
                <input placeholder="Image URL (Unsplash or direct URL)" value={srvForm.image_url} onChange={e => setSrvForm({ ...srvForm, image_url: e.target.value })} />
                <input placeholder="What's Included (comma separated)" value={srvForm.includes} onChange={e => setSrvForm({ ...srvForm, includes: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowSrvModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editSrv ? 'Update Service' : 'Save Service'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== ADD CATEGORY MODAL ===== */}
        {showCatModal && (
          <div className="modal-bg" onClick={() => setShowCatModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add New Service Category</h3>
              <form className="form-grid" onSubmit={e => {
                e.preventDefault();
                setCategories([...categories, { ...catForm, id: catForm.id || `cat-${Date.now()}` }]);
                setShowCatModal(false);
                setCatForm({ id: '', name: '', slug: '', icon: 'Wrench', color: '#0079ff', tagline: '' });
                alert('New category created!');
              }}>
                <input required placeholder="Category Name (e.g. Solar & Inverter)" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
                <input required placeholder="Tagline (e.g. Solar panel cleaning & inverter wiring)" value={catForm.tagline} onChange={e => setCatForm({ ...catForm, tagline: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input placeholder="Color Hex (#0079ff)" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} />
                  <input placeholder="Icon (Wrench, Zap, Sun, Shield)" value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCatModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Category</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== ADD PROVIDER MODAL ===== */}
        {showTechModal && (
          <div className="modal-bg" onClick={() => setShowTechModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add New Provider / Handyman</h3>
              <form className="form-grid" onSubmit={createTechnician}>
                <input required placeholder="Full Name or Business Name" value={techForm.name} onChange={e => setTechForm({ ...techForm, name: e.target.value })} />
                <input required placeholder="Phone (+91 ...)" value={techForm.phone} onChange={e => setTechForm({ ...techForm, phone: e.target.value })} />
                <input required placeholder="Specialty (e.g. AC Services)" value={techForm.specialty} onChange={e => setTechForm({ ...techForm, specialty: e.target.value })} />
                <input required placeholder="Serving City (e.g. Delhi NCR)" value={techForm.city} onChange={e => setTechForm({ ...techForm, city: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowTechModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Provider</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== ADD HERO BANNER MODAL ===== */}
        {showAddBannerModal && (
          <div className="modal-bg" onClick={() => setShowAddBannerModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3>Add Promotional Banner</h3>
              <form className="form-grid" onSubmit={addHeroBanner}>
                <input required placeholder="Banner Title" value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} />
                <input required placeholder="Banner Subtitle / Discount description" value={newBanner.subtitle} onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })} />
                <input placeholder="Target Category" value={newBanner.category} onChange={e => setNewBanner({ ...newBanner, category: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddBannerModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Banner</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== CUSTOMER WALLET BONUS MODAL ===== */}
        {addWalletCustomer && (
          <div className="modal-bg" onClick={() => setAddWalletCustomer(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
              <h3>Add FixoWallet Bonus</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '6px 0 14px' }}>Customer: <strong>{addWalletCustomer.name}</strong> ({addWalletCustomer.phone})</p>
              <form className="form-grid" onSubmit={addBonusToCustomer}>
                <input required type="number" placeholder="Bonus Amount (₹)" value={adminWalletBonus} onChange={e => setAdminWalletBonus(e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setAddWalletCustomer(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Credit to Wallet</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== TICKET RESOLUTION MODAL ===== */}
        {selectedTicket && (
          <div className="modal-bg" onClick={() => setSelectedTicket(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
              <h3>Resolve Ticket #{selectedTicket.id}</h3>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, margin: '12px 0' }}>
                <strong>{selectedTicket.customer} ({selectedTicket.category})</strong>
                <div style={{ fontSize: '0.86rem', marginTop: 4 }}>Subject: {selectedTicket.subject}</div>
              </div>
              <form className="form-grid" onSubmit={submitTicketReply}>
                <textarea rows={3} required placeholder="Type official resolution message to customer..." value={ticketReplyText} onChange={e => setTicketReplyText(e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setSelectedTicket(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Send &amp; Resolve</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
