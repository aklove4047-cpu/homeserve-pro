import { useEffect, useState, useMemo } from 'react';
import {
  LayoutDashboard, CalendarCheck, Wrench, Users, Plus, RefreshCw, Trash2,
  CheckCircle, XCircle, ExternalLink, LogOut, Tag, MessageSquare, CreditCard,
  FileText, Layers, Settings, Send, ShieldCheck, DollarSign, UserCheck, Bell,
  AlertTriangle, Check, Ban, Search, Download, Edit3, Image, HelpCircle,
  TrendingUp, Clock, MapPin, Eye, Filter, ArrowUpRight, CheckCheck, X,
  Radio, Smartphone, UploadCloud, Key, Globe, Shield, Database, Sliders,
  Printer, Star, ChevronRight, Lock
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';
const STATUSES = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('hs_admin_auth') === '1');
  const [loginPhone, setLoginPhone] = useState('admin@fixohub.in');
  const [loginPass, setLoginPass] = useState('admin1234');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [tab, setTab] = useState('overview');
  const [revMode, setRevMode] = useState('Total GMV');
  const [toast, setToast] = useState(null);

  // Core Data State (Loaded from D1)
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [requests, setRequests] = useState([]);
  const [promos, setPromos] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chats, setChats] = useState([]);
  const [kycList, setKycList] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [cities, setCities] = useState([]);
  const [banners, setBanners] = useState([]);
  const [broadcast, setBroadcast] = useState({ message: '', is_active: 0 });
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('All');
  const [searchBooking, setSearchBooking] = useState('');
  const [searchService, setSearchService] = useState('');
  const [serviceCatFilter, setServiceCatFilter] = useState('all');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [kycTab, setKycTab] = useState('All');

  // Modals & Action States
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [invoiceBooking, setInvoiceBooking] = useState(null);
  const [viewCustomerModal, setViewCustomerModal] = useState(null);
  const [viewProviderModal, setViewProviderModal] = useState(null);
  const [viewKycDocModal, setViewKycDocModal] = useState(null);
  const [addWalletCustomer, setAddWalletCustomer] = useState(null);
  const [adminWalletBonus, setAdminWalletBonus] = useState(250);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Service Modal
  const [showSrvModal, setShowSrvModal] = useState(false);
  const [editSrv, setEditSrv] = useState(null);
  const [srvForm, setSrvForm] = useState({
    category_id: 'cat-home', name: '', description: '', price: '', original_price: '', duration_mins: 45, warranty_days: 30, includes: '', image_url: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  // Category Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', slug: '', icon: 'Wrench', color: '#0079ff', tagline: '' });

  // Technician Modal
  const [showTechModal, setShowTechModal] = useState(false);
  const [techForm, setTechForm] = useState({ name: '', phone: '', specialty: 'Electronic Services', city: 'Delhi NCR' });

  // Promo Form
  const [promoForm, setPromoForm] = useState({ code: '', discount_percent: 25, min_order: 299, max_discount: 500, valid_until: '2026-12-31' });

  // City Modal
  const [showCityModal, setShowCityModal] = useState(false);
  const [cityForm, setCityForm] = useState({ name: '', min_order: 199, express_dispatch: 1 });

  // Banner Modal
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', category: 'All Services', badge: 'Offer', image_url: '' });

  // Gateways & OTP local forms
  const [gatewaysForm, setGatewaysForm] = useState({
    razorpay: { enabled: true, key_id: 'rzp_live_FIXOHUB2026', secret: 'rzp_sec_FIXO9981', webhook: 'https://homeserve-pro.aklove4047.workers.dev/api/webhook/razorpay' },
    phonepe: { enabled: true, merchant_id: 'MERCHANT_FIXOHUB', salt_key: 'salt_key_99214451' },
    stripe: { enabled: false, pub_key: 'pk_live_fixo', secret: 'sk_live_fixo' },
    cod: { enabled: true, fee: 0 }
  });
  const [otpForm, setOtpForm] = useState({
    provider: 'Fast2SMS / MSG91',
    apiKey: 'f2s_live_APIKEY_9921827419',
    senderId: 'FIXHUB',
    templateId: 'DLT_TE_10074829',
    expiryMins: 5,
    demoMasterOtp: '1234',
    testPhone: '+91 98765 43210'
  });
  const [testOtpStatus, setTestOtpStatus] = useState('');

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch All from D1
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [
        st, bk, sr, ct, tc, rq, pr, tx, ch, kc, py, cs, tk, ci, bn, bc, rv, sg
      ] = await Promise.all([
        fetch(`${API}/api/stats`).then(r => r.json()).catch(() => ({})),
        fetch(`${API}/api/bookings`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/services?all=1`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/categories`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/technicians`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/requests`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/promocodes`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/transactions`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/chats`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/kyc`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/payouts`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/customers`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/tickets`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/cities`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/banners`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/broadcast`).then(r => r.json()).catch(() => ({ message: '', is_active: 0 })),
        fetch(`${API}/api/reviews`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/settings`).then(r => r.json()).catch(() => ({}))
      ]);

      setStats(st);
      setBookings(Array.isArray(bk) ? bk : []);
      setServices(Array.isArray(sr) ? sr : []);
      setCategories(Array.isArray(ct) ? ct : []);
      setTechnicians(Array.isArray(tc) ? tc : []);
      setRequests(Array.isArray(rq) ? rq : []);
      setPromos(Array.isArray(pr) ? pr : []);
      setTransactions(Array.isArray(tx) ? tx : []);
      setChats(Array.isArray(ch) ? ch : []);
      setKycList(Array.isArray(kc) ? kc : []);
      setPayouts(Array.isArray(py) ? py : []);
      setCustomers(Array.isArray(cs) ? cs : []);
      setTickets(Array.isArray(tk) ? tk : []);
      setCities(Array.isArray(ci) ? ci : []);
      setBanners(Array.isArray(bn) ? bn : []);
      setBroadcast(bc || { message: '', is_active: 0 });
      setReviews(Array.isArray(rv) ? rv : []);
      setSettings(sg || {});

      if (sg && sg.gateways_config) {
        setGatewaysForm(sg.gateways_config);
      }
      if (sg && sg.otp_config) {
        setOtpForm(prev => ({ ...prev, ...sg.otp_config }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if ((loginPhone.toLowerCase().includes('admin') || loginPhone.includes('9876543210')) && loginPass === 'admin1234') {
      localStorage.setItem('hs_admin_auth', '1');
      setAuthed(true);
      setLoginError('');
      showToast('Welcome back, Super Administrator!');
    } else {
      setLoginError('Invalid Administrator credentials. Hint: admin@fixohub.in / admin1234');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hs_admin_auth');
    setAuthed(false);
  };

  // Image Upload handler (Direct file picker to DataURL)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setImagePreview(base64);
      setSrvForm(f => ({ ...f, image_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Booking Actions
  const updateBooking = async (id, patch) => {
    const res = await fetch(`${API}/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if (res.ok) {
      showToast(`Booking ${patch.status ? 'status updated to ' + patch.status : 'assigned'}`);
      fetchAll();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(b => ({ ...b, ...patch }));
      }
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this booking?')) return;
    const res = await fetch(`${API}/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Booking deleted successfully');
      setSelectedBooking(null);
      fetchAll();
    }
  };

  // Service Actions
  const toggleService = async (srv) => {
    await fetch(`${API}/api/services/${srv.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: srv.is_active ? 0 : 1 })
    });
    showToast(`Service ${srv.is_active ? 'deactivated' : 'activated'}`);
    fetchAll();
  };

  const deleteService = async (id) => {
    if (!confirm('Permanently delete this service from catalog?')) return;
    await fetch(`${API}/api/services/${id}`, { method: 'DELETE' });
    showToast('Service deleted from catalog');
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
      showToast('Service updated successfully!');
      setEditSrv(null);
    } else {
      await fetch(`${API}/api/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast('New service published to catalog!');
    }
    setShowSrvModal(false);
    setImagePreview('');
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
    setImagePreview(srv.image_url || '');
    setShowSrvModal(true);
  };

  // Category Actions
  const createCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name) return;
    await fetch(`${API}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catForm)
    });
    showToast('Category created successfully!');
    setShowCatModal(false);
    setCatForm({ name: '', slug: '', icon: 'Wrench', color: '#0079ff', tagline: '' });
    fetchAll();
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category? Services linked to it may be affected.')) return;
    await fetch(`${API}/api/categories/${id}`, { method: 'DELETE' });
    showToast('Category deleted');
    fetchAll();
  };

  // Provider Actions
  const toggleTechnician = async (tech) => {
    await fetch(`${API}/api/technicians/${tech.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: !tech.is_available })
    });
    showToast(`Provider marked as ${!tech.is_available ? 'Available' : 'Busy'}`);
    fetchAll();
  };

  const createTechnician = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/technicians`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(techForm)
    });
    showToast('New Verified Provider registered!');
    setShowTechModal(false);
    setTechForm({ name: '', phone: '', specialty: 'Electronic Services', city: 'Delhi NCR' });
    fetchAll();
  };

  const deleteTechnician = async (id) => {
    if (!confirm('Permanently remove this provider?')) return;
    await fetch(`${API}/api/technicians/${id}`, { method: 'DELETE' });
    showToast('Provider removed');
    fetchAll();
  };

  // KYC Actions (Real D1 Update)
  const approveKyc = async (id) => {
    await fetch(`${API}/api/kyc/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });
    showToast('Provider KYC Approved & Verified Badge granted!');
    fetchAll();
  };

  const rejectKyc = async (id) => {
    const reason = prompt('Reason for rejection:', 'Documents unreadable or incomplete');
    if (!reason) return;
    await fetch(`${API}/api/kyc/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rejected', rejection_reason: reason })
    });
    showToast('KYC rejected with reason recorded');
    fetchAll();
  };

  // Payout Actions (Real D1 Update)
  const settlePayout = async (id) => {
    const utr = prompt('Enter Bank/UPI Reference / UTR Number:', `UTR${Math.floor(1000000 + Math.random() * 9000000)}`);
    if (!utr) return;
    await fetch(`${API}/api/payouts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Settled', utr_number: utr })
    });
    showToast(`Payout ${id} settled with UTR ${utr}! Funds transferred.`);
    fetchAll();
  };

  // Customer Actions (Real D1 Update)
  const toggleCustomerBan = async (cust) => {
    const nextStatus = cust.status === 'Active' ? 'Banned' : 'Active';
    await fetch(`${API}/api/customers/${cust.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    showToast(`Customer account marked as ${nextStatus}`);
    fetchAll();
  };

  const addBonusToCustomer = async (e) => {
    e.preventDefault();
    if (!addWalletCustomer || !adminWalletBonus) return;
    await fetch(`${API}/api/customers/${addWalletCustomer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_delta: +adminWalletBonus })
    });
    showToast(`₹${adminWalletBonus} added to ${addWalletCustomer.name}'s FixoWallet!`);
    setAddWalletCustomer(null);
    fetchAll();
  };

  // Ticket Actions (Real D1 Update)
  const submitTicketReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReplyText) return;
    await fetch(`${API}/api/tickets/${selectedTicket.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved', reply_text: ticketReplyText })
    });
    showToast('Reply sent to customer and ticket marked as Resolved!');
    setSelectedTicket(null);
    setTicketReplyText('');
    fetchAll();
  };

  // Operational Cities Actions
  const addCity = async (e) => {
    e.preventDefault();
    if (!cityForm.name) return;
    await fetch(`${API}/api/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityForm)
    });
    showToast(`City ${cityForm.name} added to operations!`);
    setShowCityModal(false);
    setCityForm({ name: '', min_order: 199, express_dispatch: 1 });
    fetchAll();
  };

  const toggleCity = async (city) => {
    await fetch(`${API}/api/cities/${city.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: city.is_active ? 0 : 1 })
    });
    showToast(`City ${city.name} ${city.is_active ? 'paused' : 'activated'}`);
    fetchAll();
  };

  const deleteCity = async (id) => {
    if (!confirm('Remove this operational city?')) return;
    await fetch(`${API}/api/cities/${id}`, { method: 'DELETE' });
    showToast('City removed');
    fetchAll();
  };

  // Banner Actions
  const addBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.title) return;
    await fetch(`${API}/api/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bannerForm)
    });
    showToast('Hero banner published!');
    setShowBannerModal(false);
    setBannerForm({ title: '', subtitle: '', category: 'All Services', badge: 'Offer', image_url: '' });
    fetchAll();
  };

  const toggleBanner = async (ban) => {
    await fetch(`${API}/api/banners/${ban.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: ban.is_active ? 0 : 1 })
    });
    showToast(`Banner ${ban.is_active ? 'hidden' : 'shown'}`);
    fetchAll();
  };

  const deleteBanner = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await fetch(`${API}/api/banners/${id}`, { method: 'DELETE' });
    showToast('Banner deleted');
    fetchAll();
  };

  // Broadcast Actions
  const saveBroadcast = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(broadcast)
    });
    showToast('Global Broadcast Announcement updated on customer website!');
    fetchAll();
  };

  // Review Actions
  const moderateReview = async (id, status) => {
    await fetch(`${API}/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    showToast(`Review marked as ${status}`);
    fetchAll();
  };

  const deleteReview = async (id) => {
    if (!confirm('Permanently delete review?')) return;
    await fetch(`${API}/api/reviews/${id}`, { method: 'DELETE' });
    showToast('Review removed');
    fetchAll();
  };

  // Save Settings to D1
  const saveSettings = async (e) => {
    e?.preventDefault?.();
    const payload = {
      platform_name: settings.platform_name || 'FixoHub Enterprise',
      support_phone: settings.support_phone || '1800-FIXOHUB',
      support_email: settings.support_email || 'support@fixohub.in',
      currency: settings.currency || 'INR (₹)',
      platform_commission: settings.platform_commission || '15',
      express_delivery_fee: settings.express_delivery_fee || '149',
      tax_percent: settings.tax_percent || '18',
      min_order_amount: settings.min_order_amount || '199',
      cancel_penalty: settings.cancel_penalty || '99',
      gateways_config: gatewaysForm,
      otp_config: otpForm
    };

    const res = await fetch(`${API}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast('All Platform Settings, Gateways & OTP Keys saved to D1 Database!');
      fetchAll();
    }
  };

  // Test OTP Sandbox
  const testSendOtp = async () => {
    setTestOtpStatus('Sending OTP to ' + otpForm.testPhone + '...');
    const res = await fetch(`${API}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: otpForm.testPhone, purpose: 'admin_test' })
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      setTestOtpStatus(`✅ Success! OTP ${data.otp} generated for ${otpForm.testPhone} (Expires in 300s)`);
    } else {
      setTestOtpStatus(`✅ Demo Gateway: Master OTP 1234 active for ${otpForm.testPhone}`);
    }
  };

  // Backup Export
  const exportDataJson = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      platform: 'FixoHub Enterprise Cloud',
      totalBookings: bookings.length,
      bookings,
      services,
      categories,
      technicians,
      customers,
      transactions,
      kycList,
      payouts,
      tickets,
      cities,
      settings
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixohub-d1-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Database JSON backup downloaded!');
  };

  // Filtered lists
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesCity = cityFilter === 'All' || b.city === cityFilter;
      const matchesSearch = !searchBooking ||
        b.booking_code?.toLowerCase().includes(searchBooking.toLowerCase()) ||
        b.customer_name?.toLowerCase().includes(searchBooking.toLowerCase()) ||
        b.customer_phone?.includes(searchBooking);
      return matchesStatus && matchesCity && matchesSearch;
    });
  }, [bookings, statusFilter, cityFilter, searchBooking]);

  const unassignedBookings = useMemo(() => {
    return bookings.filter(b => !b.technician_id && b.status !== 'cancelled');
  }, [bookings]);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesCat = serviceCatFilter === 'all' || s.category_id === serviceCatFilter;
      const matchesSearch = !searchService ||
        s.name?.toLowerCase().includes(searchService.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchService.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [services, serviceCatFilter, searchService]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      return !searchCustomer ||
        c.name?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        c.phone?.includes(searchCustomer) ||
        c.email?.toLowerCase().includes(searchCustomer.toLowerCase());
    });
  }, [customers, searchCustomer]);

  const filteredKyc = useMemo(() => {
    return kycList.filter(k => {
      return kycTab === 'All' || k.status.toLowerCase() === kycTab.toLowerCase();
    });
  }, [kycList, kycTab]);

  // Auth Screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">FixoHub Control Tower</h1>
            <p className="text-sm text-slate-300 mt-1">Enterprise Multi-Service Admin Portal</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Admin Email / Phone</label>
              <input
                type="text"
                value={loginPhone}
                onChange={e => setLoginPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="admin@fixohub.in"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Security Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Sign In to Command Center
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">Default Sandbox Credentials:</p>
            <p className="text-xs font-mono text-blue-300 mt-0.5">admin@fixohub.in / admin1234</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white border border-slate-700'
        }`}>
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>FixoHub</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full font-mono uppercase">Pro</span>
              </div>
              <div className="text-[11px] text-slate-400">Cloud Operations</div>
            </div>
          </div>
          <button onClick={fetchAll} title="Refresh Database Sync" className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Dispatch</div>
          <button
            onClick={() => setTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><LayoutDashboard className="w-4 h-4" /> Overview Dashboard</div>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">{bookings.length}</span>
          </button>

          <button
            onClick={() => setTab('dispatch')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'dispatch' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Dispatch Radar</div>
            {unassignedBookings.length > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-900 font-bold px-1.5 py-0.5 rounded-full">{unassignedBookings.length} Unassigned</span>
            )}
          </button>

          <button
            onClick={() => setTab('bookings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'bookings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><CalendarCheck className="w-4 h-4" /> Customer Bookings</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{bookings.length}</span>
          </button>

          <button
            onClick={() => setTab('requests')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'requests' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><MessageSquare className="w-4 h-4" /> Custom Service Quotes</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{requests.length}</span>
          </button>

          <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalog & Team</div>
          <button
            onClick={() => setTab('services')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'services' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Wrench className="w-4 h-4" /> Services Management</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{services.length}</span>
          </button>

          <button
            onClick={() => setTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'categories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Layers className="w-4 h-4" /> Categories List</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{categories.length}</span>
          </button>

          <button
            onClick={() => setTab('technicians')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'technicians' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Users className="w-4 h-4" /> Providers & Techs</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{technicians.length}</span>
          </button>

          <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification & Finance</div>
          <button
            onClick={() => setTab('kyc')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'kyc' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><UserCheck className="w-4 h-4" /> KYC Verification Center</div>
            {kycList.filter(k => k.status === 'Pending').length > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-900 font-bold px-1.5 py-0.5 rounded-full">
                {kycList.filter(k => k.status === 'Pending').length} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('payouts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'payouts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><DollarSign className="w-4 h-4" /> Partner Payouts</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{payouts.length}</span>
          </button>

          <button
            onClick={() => setTab('transactions')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'transactions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><CreditCard className="w-4 h-4" /> Transactions Audit</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{transactions.length}</span>
          </button>

          <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">CRM & Operations</div>
          <button
            onClick={() => setTab('customers')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'customers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Users className="w-4 h-4" /> Customers Directory</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{customers.length}</span>
          </button>

          <button
            onClick={() => setTab('cities')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'cities' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Globe className="w-4 h-4" /> Operational Cities</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{cities.length}</span>
          </button>

          <button
            onClick={() => setTab('tickets')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'tickets' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><HelpCircle className="w-4 h-4" /> Dispute & Support Tickets</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{tickets.length}</span>
          </button>

          <button
            onClick={() => setTab('reviews')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'reviews' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Star className="w-4 h-4" /> Reviews Moderation</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{reviews.length}</span>
          </button>

          <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marketing & APIs</div>
          <button
            onClick={() => setTab('promos')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'promos' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Tag className="w-4 h-4" /> Promo Coupons</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{promos.length}</span>
          </button>

          <button
            onClick={() => setTab('banners')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'banners' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Image className="w-4 h-4" /> Hero Sliders</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{banners.length}</span>
          </button>

          <button
            onClick={() => setTab('broadcast')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'broadcast' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Bell className="w-4 h-4" /> Global Broadcast</div>
          </button>

          <button
            onClick={() => setTab('gateways')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'gateways' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Key className="w-4 h-4 text-amber-400" /> Payment Gateways API</div>
          </button>

          <button
            onClick={() => setTab('otp')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'otp' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Smartphone className="w-4 h-4 text-cyan-400" /> SMS & OTP API</div>
          </button>

          <button
            onClick={() => setTab('chats')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'chats' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><MessageSquare className="w-4 h-4" /> Chat Monitor</div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{chats.length}</span>
          </button>

          <button
            onClick={() => setTab('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${tab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <div className="flex items-center gap-2.5"><Settings className="w-4 h-4" /> Platform Settings</div>
          </button>
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={exportDataJson}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" /> 1-Click JSON Backup
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight flex items-center gap-2">
              <span>{tab.replace('-', ' ')}</span>
              {loading && <span className="text-xs font-normal text-blue-600 animate-pulse">(Syncing Cloud D1...)</span>}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Cloudflare D1 Database Active • Singapore Region • Real-time Mirror</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <span>Customer Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="/partner/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <span>Partner App</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>D1 Synced</span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8">
          {/* TAB: OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{bookings.length}</div>
                    <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +12% this month
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">₹{stats.totalRevenue ? Number(stats.totalRevenue).toLocaleString('en-IN') : '0'}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">15% platform commission</div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Catalog Services</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{services.filter(s => s.is_active).length}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">{categories.length} Categories Live</div>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
                    <Wrench className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Providers</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{technicians.length}</div>
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      {technicians.filter(t => t.is_available).length} Online & Ready
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Unassigned Dispatch Alert */}
              {unassignedBookings.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">
                        {unassignedBookings.length} Bookings awaiting technician assignment!
                      </h4>
                      <p className="text-xs text-amber-700">Immediate attention needed to meet 30-min doorstep SLA.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTab('dispatch')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow transition"
                  >
                    Open Dispatch Radar
                  </button>
                </div>
              )}

              {/* Recent Bookings & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Recent Customer Bookings</h3>
                    <button onClick={() => setTab('bookings')} className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
                      View All ({bookings.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            <span>{b.customer_name}</span>
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{b.booking_code}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">{b.city} • {b.scheduled_date} ({b.scheduled_slot})</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">₹{b.total_amount}</div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase mt-0.5 ${
                            b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-slate-900 text-base">Quick Control Actions</h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => { setEditSrv(null); setImagePreview(''); setShowSrvModal(true); }}
                      className="w-full py-2.5 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold text-xs flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Service</span>
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </button>

                    <button
                      onClick={() => setShowTechModal(true)}
                      className="w-full py-2.5 px-3.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-semibold text-xs flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Onboard New Provider</span>
                      <ChevronRight className="w-4 h-4 text-purple-400" />
                    </button>

                    <button
                      onClick={() => setTab('kyc')}
                      className="w-full py-2.5 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-semibold text-xs flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> Review KYC Queue</span>
                      <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                        {kycList.filter(k => k.status === 'Pending').length}
                      </span>
                    </button>

                    <button
                      onClick={() => setTab('gateways')}
                      className="w-full py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-xs flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2"><Key className="w-4 h-4" /> Gateway API Keys</span>
                      <ChevronRight className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE DISPATCH RADAR */}
          {tab === 'dispatch' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Live Dispatch Radar</h3>
                  <p className="text-xs text-slate-500">Assign verified field providers to customer bookings in real-time</p>
                </div>
                <div className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Radar Listening for Orders</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {unassignedBookings.length === 0 ? (
                  <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-slate-800">All Bookings Dispatched!</h4>
                    <p className="text-xs text-slate-500 mt-1">Zero unassigned pending orders in the queue right now.</p>
                  </div>
                ) : (
                  unassignedBookings.map(b => (
                    <div key={b.id} className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded uppercase">Unassigned</span>
                        <span className="font-mono text-xs font-bold text-slate-900">{b.booking_code}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{b.customer_name}</div>
                        <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {b.address}, {b.city}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Slot: {b.scheduled_date} at {b.scheduled_slot}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assign Verified Technician:</label>
                        <select
                          className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              updateBooking(b.id, { technician_id: e.target.value, status: 'assigned' });
                            }
                          }}
                        >
                          <option value="" disabled>-- Select available technician --</option>
                          {technicians.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.city}) - {t.specialty} [{t.is_available ? 'Available' : 'Busy'}]
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS TABLE */}
          {tab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search booking ID, customer, phone..."
                      value={searchBooking}
                      onChange={e => setSearchBooking(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Showing {filteredBookings.length} of {bookings.length} Orders
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Booking Code</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Service & Slot</th>
                      <th className="p-4">Assigned Provider</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-mono font-bold text-blue-600">{b.booking_code}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{b.customer_name}</div>
                          <div className="text-slate-500 text-[11px]">{b.customer_phone} • {b.city}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-800 font-medium">
                            {b.items && b.items.length > 0 ? b.items[0].name : 'Home Service'}
                            {b.items && b.items.length > 1 && ` +${b.items.length - 1} more`}
                          </div>
                          <div className="text-slate-500 text-[11px]">{b.scheduled_date} ({b.scheduled_slot})</div>
                        </td>
                        <td className="p-4">
                          <select
                            value={b.technician_id || ''}
                            onChange={(e) => updateBooking(b.id, { technician_id: e.target.value || null, status: b.status === 'pending' ? 'assigned' : b.status })}
                            className="text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50"
                          >
                            <option value="">-- Unassigned --</option>
                            {technicians.map(t => (
                              <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 font-bold text-slate-900">₹{b.total_amount}</td>
                        <td className="p-4">
                          <select
                            value={b.status}
                            onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                            className={`text-[11px] font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                              b.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              b.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              b.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              b.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setInvoiceBooking(b)}
                            title="Print Tax Invoice"
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBooking(b.id)}
                            title="Delete Booking"
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {tab === 'services' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search service name or description..."
                      value={searchService}
                      onChange={e => setSearchService(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={serviceCatFilter}
                    onChange={e => setServiceCatFilter(e.target.value)}
                    className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <button
                  onClick={() => { setEditSrv(null); setImagePreview(''); setShowSrvModal(true); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map(srv => (
                  <div key={srv.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="h-40 w-full relative bg-slate-100 overflow-hidden">
                        <img
                          src={srv.image_url || 'https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=500&q=80'}
                          alt={srv.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {srv.category_name || 'Service'}
                        </span>
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${srv.is_active ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {srv.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                          <span className="text-base text-blue-600">₹{srv.price}</span>
                          {srv.original_price && <span className="line-through text-slate-400 text-xs">₹{srv.original_price}</span>}
                          <span className="text-slate-400 text-[11px] ml-auto">{srv.duration_mins} mins • {srv.warranty_days}d warranty</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <button
                        onClick={() => toggleService(srv)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${srv.is_active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        {srv.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditService(srv)}
                          className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteService(srv.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {tab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Categories Management</h3>
                  <p className="text-xs text-slate-500">Service domains published on consumer mobile & web apps</p>
                </div>
                <button
                  onClick={() => setShowCatModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map(c => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: c.color || '#0079ff' }}>
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-slate-400 text-xs font-mono">{c.slug}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{c.tagline}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROVIDERS / TECHNICIANS */}
          {tab === 'technicians' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Verified Providers & Technicians</h3>
                  <p className="text-xs text-slate-500">Service partners registered on FixoHub Partner App</p>
                </div>
                <button
                  onClick={() => setShowTechModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Onboard Provider
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {technicians.map(t => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                          {t.name ? t.name[0] : 'P'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                          <div className="text-slate-500 text-xs">{t.phone}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        {t.is_available ? 'Online' : 'Busy'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div><span className="font-semibold text-slate-700">Specialty:</span> {t.specialty}</div>
                      <div><span className="font-semibold text-slate-700">City:</span> {t.city}</div>
                      <div><span className="font-semibold text-slate-700">Rating:</span> ⭐ {t.rating || '4.9'} ({t.jobs_completed || 0} jobs)</div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleTechnician(t)}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        {t.is_available ? 'Mark as Busy' : 'Mark Available'}
                      </button>
                      <button
                        onClick={() => deleteTechnician(t.id)}
                        className="p-1 hover:bg-red-50 text-red-600 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: KYC VERIFICATION CENTER */}
          {tab === 'kyc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Partner KYC & Document Verification</h3>
                  <p className="text-xs text-slate-500">Review Government IDs, ITI trade certificates, and Police Verification</p>
                </div>
                <div className="flex items-center gap-2">
                  {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                    <button
                      key={s}
                      onClick={() => setKycTab(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${kycTab === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Provider Name</th>
                      <th className="p-4">Phone / City</th>
                      <th className="p-4">Document Type</th>
                      <th className="p-4">Certificate / ID No.</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredKyc.map(k => (
                      <tr key={k.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900">{k.provider_name}</td>
                        <td className="p-4 text-slate-600">{k.phone} • {k.city}</td>
                        <td className="p-4 font-medium text-slate-800">{k.doc_type}</td>
                        <td className="p-4 font-mono text-slate-600">{k.cert_no}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            k.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            k.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {k.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setViewKycDocModal(k)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                          >
                            View Docs
                          </button>
                          {k.status !== 'Approved' && (
                            <button
                              onClick={() => approveKyc(k.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Approve
                            </button>
                          )}
                          {k.status !== 'Rejected' && (
                            <button
                              onClick={() => rejectKyc(k.id)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Reject
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

          {/* TAB: PARTNER PAYOUTS */}
          {tab === 'payouts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Partner Earnings & Payout Requests</h3>
                  <p className="text-xs text-slate-500">Process instant bank/UPI payouts with real UTR tracking</p>
                </div>
                <div className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl font-bold">
                  Total Pending Payout: ₹{payouts.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Payout ID</th>
                      <th className="p-4">Partner Provider</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">UPI / Bank Detail</th>
                      <th className="p-4">Jobs</th>
                      <th className="p-4">Status & UTR</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payouts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-mono font-bold text-slate-600">{p.id}</td>
                        <td className="p-4 font-semibold text-slate-900">{p.provider_name}</td>
                        <td className="p-4 font-bold text-emerald-600 text-sm">₹{p.amount.toLocaleString('en-IN')}</td>
                        <td className="p-4 font-mono text-slate-600">{p.upi_id || p.bank_account || 'Default UPI'}</td>
                        <td className="p-4 text-slate-700">{p.jobs_count || 1} jobs completed</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'Settled' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status}
                          </span>
                          {p.utr_number && <div className="text-[10px] text-slate-400 font-mono mt-0.5">UTR: {p.utr_number}</div>}
                        </td>
                        <td className="p-4 text-right">
                          {p.status === 'Pending' ? (
                            <button
                              onClick={() => settlePayout(p.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition"
                            >
                              Settle Payout
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS CRM */}
          {tab === 'customers' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search customer name, phone, email..."
                    value={searchCustomer}
                    onChange={e => setSearchCustomer(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {customers.length} Registered Consumers
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Total Orders</th>
                      <th className="p-4">FixoWallet</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right">CRM Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900">{c.name}</td>
                        <td className="p-4 text-slate-600">{c.phone} {c.email && `• ${c.email}`}</td>
                        <td className="p-4 text-slate-700">{c.city}</td>
                        <td className="p-4 font-semibold text-slate-900">{c.orders_count || 0} (₹{c.total_spend || 0})</td>
                        <td className="p-4 font-bold text-emerald-600">₹{c.wallet_balance || 0}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setAddWalletCustomer(c)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold"
                          >
                            + Credit Wallet
                          </button>
                          <button
                            onClick={() => toggleCustomerBan(c)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${c.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-100 text-slate-700'}`}
                          >
                            {c.status === 'Active' ? 'Ban User' : 'Unban'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: OPERATIONAL CITIES */}
          {tab === 'cities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Operational Cities & Hubs</h3>
                  <p className="text-xs text-slate-500">Service coverage areas, minimum booking rules, and express dispatch</p>
                </div>
                <button
                  onClick={() => setShowCityModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Operational City
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cities.map(c => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        {c.is_active ? 'Active' : 'Paused'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Min Booking Value: <span className="font-bold text-slate-900">₹{c.min_order}</span></div>
                      <div>Express 30m Dispatch: <span className="font-semibold text-emerald-600">{c.express_dispatch ? 'Enabled' : 'Disabled'}</span></div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleCity(c)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        {c.is_active ? 'Pause City' : 'Resume City'}
                      </button>
                      <button
                        onClick={() => deleteCity(c.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PAYMENT GATEWAYS API */}
          {tab === 'gateways' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Payment Gateway Integrations</h3>
                <p className="text-xs text-slate-500">Live API credentials and keys stored directly in Cloudflare D1</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RazorPay Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">
                        RP
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">RazorPay Payment Gateway</h4>
                        <p className="text-[11px] text-slate-500">UPI, Credit/Debit Cards, NetBanking, EMI</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatewaysForm.razorpay?.enabled ?? true}
                        onChange={e => setGatewaysForm(g => ({ ...g, razorpay: { ...g.razorpay, enabled: e.target.checked } }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">RazorPay Key ID</label>
                      <input
                        type="text"
                        value={gatewaysForm.razorpay?.key_id || ''}
                        onChange={e => setGatewaysForm(g => ({ ...g, razorpay: { ...g.razorpay, key_id: e.target.value } }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">RazorPay Key Secret</label>
                      <input
                        type="password"
                        value={gatewaysForm.razorpay?.secret || ''}
                        onChange={e => setGatewaysForm(g => ({ ...g, razorpay: { ...g.razorpay, secret: e.target.value } }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* PhonePe Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">
                        Pe
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">PhonePe PG API</h4>
                        <p className="text-[11px] text-slate-500">Direct UPI & Intent Flow</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatewaysForm.phonepe?.enabled ?? true}
                        onChange={e => setGatewaysForm(g => ({ ...g, phonepe: { ...g.phonepe, enabled: e.target.checked } }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Merchant ID (MID)</label>
                      <input
                        type="text"
                        value={gatewaysForm.phonepe?.merchant_id || ''}
                        onChange={e => setGatewaysForm(g => ({ ...g, phonepe: { ...g.phonepe, merchant_id: e.target.value } }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Salt Key</label>
                      <input
                        type="password"
                        value={gatewaysForm.phonepe?.salt_key || ''}
                        onChange={e => setGatewaysForm(g => ({ ...g, phonepe: { ...g.phonepe, salt_key: e.target.value } }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* COD & Wallet Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Cash on Doorstep & FixoWallet</h4>
                      <p className="text-[11px] text-slate-500">Enable cash on visit payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatewaysForm.cod?.enabled ?? true}
                        onChange={e => setGatewaysForm(g => ({ ...g, cod: { ...g.cod, enabled: e.target.checked } }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">
                    Customers can choose to pay the verified technician directly via UPI QR code or cash when the job is completed.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={saveSettings}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition"
                >
                  Save Gateway Credentials to D1 Database
                </button>
              </div>
            </div>
          )}

          {/* TAB: SMS & OTP API */}
          {tab === 'otp' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SMS Gateway & OTP Authentication API</h3>
                <p className="text-xs text-slate-500">Configure Fast2SMS / MSG91 / Twilio credentials and test live dispatch</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Provider Credentials</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Provider Service</label>
                      <select
                        value={otpForm.provider}
                        onChange={e => setOtpForm(o => ({ ...o, provider: e.target.value }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl"
                      >
                        <option value="Fast2SMS / MSG91">Fast2SMS / MSG91 (India DLT Compliant)</option>
                        <option value="Twilio">Twilio Global SMS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">API Key / Token</label>
                      <input
                        type="password"
                        value={otpForm.apiKey}
                        onChange={e => setOtpForm(o => ({ ...o, apiKey: e.target.value }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Sender ID (6 Chars)</label>
                      <input
                        type="text"
                        value={otpForm.senderId}
                        onChange={e => setOtpForm(o => ({ ...o, senderId: e.target.value }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Master Demo OTP (Universal)</label>
                      <input
                        type="text"
                        value={otpForm.demoMasterOtp}
                        onChange={e => setOtpForm(o => ({ ...o, demoMasterOtp: e.target.value }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Live Sandbox OTP Dispatch Console</h4>
                  <p className="text-xs text-slate-500">Test live OTP delivery to any test phone number directly from admin.</p>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Test Mobile Number</label>
                      <input
                        type="text"
                        value={otpForm.testPhone}
                        onChange={e => setOtpForm(o => ({ ...o, testPhone: e.target.value }))}
                        className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <button
                      onClick={testSendOtp}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition"
                    >
                      Dispatch Test OTP
                    </button>
                    {testOtpStatus && (
                      <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-mono">
                        {testOtpStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={saveSettings}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition"
                >
                  Save OTP Settings to D1 Database
                </button>
              </div>
            </div>
          )}

          {/* TAB: SUPPORT DISPUTE TICKETS */}
          {tab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Customer Support & Dispute Tickets</h3>
                  <p className="text-xs text-slate-500">Resolve customer queries, billing disputes, and reschedule requests</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Ticket ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Subject & Issue</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tickets.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-mono font-bold text-slate-600">{t.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{t.customer_name}</div>
                          <div className="text-slate-500 text-[11px]">{t.customer_phone}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{t.category}</td>
                        <td className="p-4">
                          <div className="text-slate-900 font-semibold">{t.subject}</div>
                          {t.reply_text && <div className="text-emerald-600 text-[11px] mt-0.5">Reply: {t.reply_text}</div>}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => { setSelectedTicket(t); setTicketReplyText(t.reply_text || ''); }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition"
                          >
                            Reply & Resolve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS MODERATION */}
          {tab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Customer Reviews & Ratings Moderation</h3>
                  <p className="text-xs text-slate-500">Approve authentic customer reviews and hide inappropriate comments</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{r.customer_name}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        {r.status}
                      </span>
                    </div>

                    <div className="text-xs text-blue-600 font-semibold">{r.service_name}</div>
                    <div className="text-amber-500 text-xs">{'★'.repeat(Math.round(r.rating || 5))} <span className="text-slate-500 font-mono text-[11px]">({r.rating})</span></div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => moderateReview(r.id, r.status === 'Published' ? 'Hidden' : 'Published')}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        {r.status === 'Published' ? 'Hide Review' : 'Publish Review'}
                      </button>
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="p-1 hover:bg-red-50 text-red-600 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROMO CODES */}
          {tab === 'promos' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Create New Discount Coupon</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!promoForm.code) return;
                  await fetch(`${API}/api/promocodes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(promoForm)
                  });
                  showToast(`Coupon ${promoForm.code} created!`);
                  setPromoForm({ code: '', discount_percent: 25, min_order: 299, max_discount: 500, valid_until: '2026-12-31' });
                  fetchAll();
                }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder="COUPON CODE (e.g. SAVE30)"
                    value={promoForm.code}
                    onChange={e => setPromoForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    className="p-2.5 border border-slate-200 rounded-xl text-xs uppercase font-mono font-bold"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Discount % (e.g. 25)"
                    value={promoForm.discount_percent}
                    onChange={e => setPromoForm(p => ({ ...p, discount_percent: +e.target.value }))}
                    className="p-2.5 border border-slate-200 rounded-xl text-xs"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Min Order Value (₹)"
                    value={promoForm.min_order}
                    onChange={e => setPromoForm(p => ({ ...p, min_order: +e.target.value }))}
                    className="p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max Discount (₹)"
                    value={promoForm.max_discount}
                    onChange={e => setPromoForm(p => ({ ...p, max_discount: +e.target.value }))}
                    className="p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition"
                  >
                    Publish Coupon
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {promos.map(pr => (
                  <div key={pr.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-blue-600 text-base">{pr.code}</div>
                      <div className="text-xs text-slate-800 font-semibold mt-0.5">{pr.discount_percent}% OFF (up to ₹{pr.max_discount})</div>
                      <div className="text-[11px] text-slate-500">Min order: ₹{pr.min_order} • Valid till {pr.valid_until}</div>
                    </div>
                    <button
                      onClick={async () => {
                        await fetch(`${API}/api/promocodes/${pr.id}`, { method: 'DELETE' });
                        showToast(`Coupon ${pr.code} deleted`);
                        fetchAll();
                      }}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BANNERS & BROADCAST */}
          {tab === 'banners' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Hero Carousel Banners</h3>
                  <p className="text-xs text-slate-500">Manage promotional banners on website homepage and mobile apps</p>
                </div>
                <button
                  onClick={() => setShowBannerModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Hero Banner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {banners.map(b => (
                  <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">{b.badge || 'Banner'}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        {b.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                    <p className="text-xs text-slate-500">{b.subtitle}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleBanner(b)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        {b.is_active ? 'Hide Banner' : 'Show Banner'}
                      </button>
                      <button
                        onClick={() => deleteBanner(b.id)}
                        className="p-1 hover:bg-red-50 text-red-600 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GLOBAL BROADCAST */}
          {tab === 'broadcast' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Global Broadcast Announcement</h3>
                <p className="text-xs text-slate-500">Live ticker banner displayed across customer website header</p>
              </div>

              <form onSubmit={saveBroadcast} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Text</label>
                  <textarea
                    rows={3}
                    value={broadcast.message}
                    onChange={e => setBroadcast(b => ({ ...b, message: e.target.value }))}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter special offer message or emergency weather update..."
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!broadcast.is_active}
                      onChange={e => setBroadcast(b => ({ ...b, is_active: e.target.checked ? 1 : 0 }))}
                      className="rounded text-blue-600"
                    />
                    <span>Activate Broadcast on Customer Site</span>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition"
                  >
                    Save Broadcast to D1
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: TRANSACTIONS AUDIT */}
          {tab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Payment & Transaction Audit Ledger</h3>
                  <p className="text-xs text-slate-500">Immutable ledger of customer orders and payouts</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Booking Code</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-mono font-bold text-blue-600">{t.id}</td>
                        <td className="p-4 font-mono text-slate-700">{t.booking_code}</td>
                        <td className="p-4 font-semibold text-slate-900">{t.customer_name}</td>
                        <td className="p-4 text-slate-700">{t.provider_name}</td>
                        <td className="p-4 font-medium text-slate-800">{t.method}</td>
                        <td className="p-4 font-bold text-slate-900">₹{t.amount}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                            {t.status || 'Success'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CHAT MONITOR */}
          {tab === 'chats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Live Customer - Provider Chat Monitor</h3>
                  <p className="text-xs text-slate-500">Monitor ongoing conversations between users and technicians</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {chats.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No chat records available yet.</div>
                ) : (
                  chats.map(c => (
                    <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span className="capitalize font-bold text-blue-600">[{c.sender}]</span>
                          <span>{c.message}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          Partner: {c.partner_name} • Booking: {c.booking_code || 'General Inquiry'}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{c.created_at ? new Date(c.created_at).toLocaleTimeString() : ''}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: PLATFORM SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enterprise Platform Settings</h3>
                <p className="text-xs text-slate-500">Global system parameters stored and executed by Cloudflare Worker</p>
              </div>

              <form onSubmit={saveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Platform Brand Name</label>
                    <input
                      type="text"
                      value={settings.platform_name || 'FixoHub Enterprise'}
                      onChange={e => setSettings(s => ({ ...s, platform_name: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={settings.currency || 'INR (₹)'}
                      onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Toll-Free Support Phone</label>
                    <input
                      type="text"
                      value={settings.support_phone || '1800-FIXOHUB'}
                      onChange={e => setSettings(s => ({ ...s, support_phone: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Official Support Email</label>
                    <input
                      type="email"
                      value={settings.support_email || 'support@fixohub.in'}
                      onChange={e => setSettings(s => ({ ...s, support_email: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Platform Commission Rate (%)</label>
                    <input
                      type="number"
                      value={settings.platform_commission || '15'}
                      onChange={e => setSettings(s => ({ ...s, platform_commission: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">GST / Tax Percentage (%)</label>
                    <input
                      type="number"
                      value={settings.tax_percent || '18'}
                      onChange={e => setSettings(s => ({ ...s, tax_percent: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Express 30-Min Doorstep Fee (₹)</label>
                    <input
                      type="number"
                      value={settings.express_delivery_fee || '149'}
                      onChange={e => setSettings(s => ({ ...s, express_delivery_fee: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Minimum Booking Order (₹)</label>
                    <input
                      type="number"
                      value={settings.min_order_amount || '199'}
                      onChange={e => setSettings(s => ({ ...s, min_order_amount: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Settings will be saved to Cloudflare D1 table immediately.</p>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition"
                  >
                    Save All Settings to Database
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADD / EDIT SERVICE (WITH LOCAL FILE PHOTO UPLOADER) */}
      {showSrvModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">{editSrv ? 'Edit Service' : 'Add New Service to Catalog'}</h3>
              <button onClick={() => setShowSrvModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={srvForm.category_id}
                  onChange={e => setSrvForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g. Full Home Deep Cleaning (2BHK)"
                  value={srvForm.name}
                  onChange={e => setSrvForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain process, machines used, and technician crew size..."
                  value={srvForm.description}
                  onChange={e => setSrvForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={srvForm.price}
                    onChange={e => setSrvForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={srvForm.original_price}
                    onChange={e => setSrvForm(f => ({ ...f, original_price: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl line-through text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={srvForm.duration_mins}
                    onChange={e => setSrvForm(f => ({ ...f, duration_mins: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warranty (Days)</label>
                  <input
                    type="number"
                    value={srvForm.warranty_days}
                    onChange={e => setSrvForm(f => ({ ...f, warranty_days: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Included Highlights (Comma separated)</label>
                <input
                  type="text"
                  placeholder="3-person crew, Floor scrubbing machine, Eco-safe chemicals"
                  value={srvForm.includes}
                  onChange={e => setSrvForm(f => ({ ...f, includes: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              {/* REAL PHOTO UPLOADER */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block font-semibold text-slate-800">Service Image / Photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-300 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400">Or type image URL:</div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={srvForm.image_url}
                  onChange={e => {
                    setSrvForm(f => ({ ...f, image_url: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSrvModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow"
                >
                  {editSrv ? 'Save Changes' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINT TAX INVOICE */}
      {invoiceBooking && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  FH
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">FixoHub Technologies Pvt. Ltd.</h3>
                  <p className="text-xs text-slate-500">Tax Invoice / Receipt • GSTIN: 07AAECF9988C1Z8</p>
                </div>
              </div>
              <button onClick={() => setInvoiceBooking(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 text-xs gap-4">
              <div>
                <span className="font-semibold text-slate-400 uppercase text-[10px]">Billed To:</span>
                <div className="font-bold text-slate-900 mt-0.5">{invoiceBooking.customer_name}</div>
                <div className="text-slate-600">{invoiceBooking.customer_phone}</div>
                <div className="text-slate-600">{invoiceBooking.address}, {invoiceBooking.city}</div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-400 uppercase text-[10px]">Invoice Reference:</span>
                <div className="font-mono font-bold text-blue-600 mt-0.5">INV-{invoiceBooking.booking_code}</div>
                <div className="text-slate-500">Date: {invoiceBooking.scheduled_date}</div>
                <div className="text-slate-500">Payment: {invoiceBooking.payment_method}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Service Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceBooking.items && invoiceBooking.items.length > 0 ? (
                    invoiceBooking.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-slate-800">{it.name}</td>
                        <td className="p-3 text-center">{it.qty || 1}</td>
                        <td className="p-3 text-right">₹{it.price}</td>
                        <td className="p-3 text-right font-bold">₹{Number(it.price) * Number(it.qty || 1)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 font-medium">Home Service Package</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right">₹{invoiceBooking.total_amount}</td>
                      <td className="p-3 text-right font-bold">₹{invoiceBooking.total_amount}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-900">Total Net Amount Paid:</span>
              <span className="text-lg text-emerald-600">₹{invoiceBooking.total_amount}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" /> Print Tax Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW KYC SUBMITTED DOCUMENT */}
      {viewKycDocModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">KYC Document Verification</h3>
              </div>
              <button onClick={() => setViewKycDocModal(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div><span className="font-semibold text-slate-500">Applicant:</span> <span className="font-bold text-slate-900">{viewKycDocModal.provider_name}</span></div>
              <div><span className="font-semibold text-slate-500">Phone:</span> <span className="font-mono">{viewKycDocModal.phone}</span></div>
              <div><span className="font-semibold text-slate-500">Document Type:</span> <span className="font-semibold text-blue-600">{viewKycDocModal.doc_type}</span></div>
              <div><span className="font-semibold text-slate-500">Certificate/ID No:</span> <span className="font-mono font-bold">{viewKycDocModal.cert_no}</span></div>
              <div><span className="font-semibold text-slate-500">City:</span> {viewKycDocModal.city}</div>
              <div><span className="font-semibold text-slate-500">Status:</span> <span className="font-bold text-emerald-600 uppercase">{viewKycDocModal.status}</span></div>
            </div>

            <div className="p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-1">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-bold text-xs text-slate-700">Digital Certificate Cryptographically Signed</div>
              <div className="text-[10px] text-slate-500">Verified by UIDAI / ITI Skill Registry Mock Gateway</div>
            </div>

            <div className="flex justify-end gap-2">
              {viewKycDocModal.status !== 'Approved' && (
                <button
                  onClick={() => { approveKyc(viewKycDocModal.id); setViewKycDocModal(null); }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Approve KYC
                </button>
              )}
              <button
                onClick={() => setViewKycDocModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD WALLET CASHBACK TO CUSTOMER */}
      {addWalletCustomer && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Credit FixoWallet Balance</h3>
            <p className="text-xs text-slate-500">Deposit promotional bonus to {addWalletCustomer.name}'s wallet.</p>
            <form onSubmit={addBonusToCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Bonus Amount (₹)</label>
                <input
                  type="number"
                  value={adminWalletBonus}
                  onChange={e => setAdminWalletBonus(+e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-emerald-600"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddWalletCustomer(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow"
                >
                  Credit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPLY SUPPORT TICKET */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Reply to Ticket {selectedTicket.id}</h3>
              <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div><span className="font-bold text-slate-900">{selectedTicket.customer_name}:</span> {selectedTicket.subject}</div>
            </div>
            <form onSubmit={submitTicketReply} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Admin Resolution</label>
                <textarea
                  rows={4}
                  value={ticketReplyText}
                  onChange={e => setTicketReplyText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs"
                  placeholder="Explain resolution, refund reference, or reschedule details..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow"
                >
                  Send Reply & Resolve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD OPERATIONAL CITY */}
      {showCityModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Operational City</h3>
            <form onSubmit={addCity} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">City Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad, Chandigarh"
                  value={cityForm.name}
                  onChange={e => setCityForm(c => ({ ...c, name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={cityForm.min_order}
                  onChange={e => setCityForm(c => ({ ...c, min_order: +e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow"
                >
                  Add City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD HERO BANNER */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Hero Promotional Banner</h3>
            <form onSubmit={addBanner} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Main Heading</label>
                <input
                  type="text"
                  placeholder="e.g. 50% OFF on First Booking"
                  value={bannerForm.title}
                  onChange={e => setBannerForm(b => ({ ...b, title: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subtitle / Details</label>
                <input
                  type="text"
                  placeholder="e.g. Verified expert technicians at your doorstep"
                  value={bannerForm.subtitle}
                  onChange={e => setBannerForm(b => ({ ...b, subtitle: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Launch"
                    value={bannerForm.badge}
                    onChange={e => setBannerForm(b => ({ ...b, badge: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category Link</label>
                  <input
                    type="text"
                    placeholder="e.g. AC Services"
                    value={bannerForm.category}
                    onChange={e => setBannerForm(b => ({ ...b, category: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {showCatModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add New Service Domain</h3>
            <form onSubmit={createCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Solar & Inverter"
                  value={catForm.name}
                  onChange={e => setCatForm(c => ({ ...c, name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Catchy Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Solar panel install & battery diagnostics"
                  value={catForm.tagline}
                  onChange={e => setCatForm(c => ({ ...c, tagline: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ONBOARD TECHNICIAN */}
      {showTechModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Onboard Verified Technician</h3>
            <form onSubmit={createTechnician} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Technician Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Manoj Sharma"
                  value={techForm.name}
                  onChange={e => setTechForm(t => ({ ...t, name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={techForm.phone}
                  onChange={e => setTechForm(t => ({ ...t, phone: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Trade Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. AC Cooling & Refrigeration"
                  value={techForm.specialty}
                  onChange={e => setTechForm(t => ({ ...t, specialty: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operating City</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi NCR"
                  value={techForm.city}
                  onChange={e => setTechForm(t => ({ ...t, city: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTechModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow"
                >
                  Register Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
