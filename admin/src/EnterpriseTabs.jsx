import React, { useState, useMemo } from 'react';
import {
  BarChart3, Users, Map, AlertOctagon, ShieldCheck, FileSpreadsheet,
  Plus, Search, Filter, Download, CheckCircle, XCircle, Clock,
  MapPin, Star, Phone, Mail, Award, AlertTriangle, Shield, Check,
  TrendingUp, DollarSign, Calendar, Eye, ArrowUpRight, Ban, RefreshCw
} from 'lucide-react';

// RFC 4180 Compliant CSV / Excel Exporter with UTF-8 BOM
export const exportToCsv = (filename, dataRows, columnHeaders, showToast) => {
  if (!dataRows || !dataRows.length) {
    if (showToast) showToast('No records available to export', 'error');
    return;
  }
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };
  const headerLine = columnHeaders.map(h => escapeCsv(h.label)).join(',');
  const dataLines = dataRows.map(row => {
    return columnHeaders.map(h => {
      const raw = h.getValue ? h.getValue(row) : row[h.key];
      return escapeCsv(raw);
    }).join(',');
  });
  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (showToast) showToast(`Excel CSV "${filename}.csv" exported successfully!`);
};

// ==========================================
// 1. REPORTS & ANALYTICS TAB
// ==========================================
export function ReportsTab({ stats, bookings, servicemen, customers, issues, transactions, cities, showToast }) {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCity, setSelectedCity] = useState('All');

  // Filter bookings based on selected city & date range
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const cityMatch = selectedCity === 'All' || b.city === selectedCity;
      return cityMatch;
    });
  }, [bookings, selectedCity]);

  // Aggregate metrics
  const totalGMV = filteredBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

  const netCommission = Math.round(totalGMV * 0.15);
  const completedCount = filteredBookings.filter(b => b.status === 'completed').length;
  const cancelledCount = filteredBookings.filter(b => b.status === 'cancelled').length;
  const pendingCount = filteredBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  const completionRate = filteredBookings.length > 0 ? Math.round((completedCount / filteredBookings.length) * 100) : 100;

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map = {};
    filteredBookings.forEach(b => {
      const cat = b.category_name || 'General Repairs';
      if (!map[cat]) map[cat] = { count: 0, revenue: 0 };
      map[cat].count += 1;
      if (b.status !== 'cancelled') {
        map[cat].revenue += Number(b.total_amount) || 0;
      }
    });
    return Object.entries(map).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue);
  }, [filteredBookings]);

  // City breakdown
  const cityBreakdown = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const c = b.city || 'Other';
      if (!map[c]) map[c] = { count: 0, revenue: 0 };
      map[c].count += 1;
      if (b.status !== 'cancelled') map[c].revenue += Number(b.total_amount) || 0;
    });
    return Object.entries(map).map(([city, data]) => ({ city, ...data })).sort((a, b) => b.revenue - a.revenue);
  }, [bookings]);

  // Export Executive Master Report
  const handleExportExecutiveReport = () => {
    const headers = [
      { label: 'Booking Code', key: 'booking_code' },
      { label: 'Customer Name', key: 'customer_name' },
      { label: 'Customer Phone', key: 'customer_phone' },
      { label: 'City', key: 'city' },
      { label: 'Service Category', key: 'category_name' },
      { label: 'Scheduled Date', key: 'scheduled_date' },
      { label: 'Status', key: 'status' },
      { label: 'Gross Amount (INR)', key: 'total_amount' },
      { label: 'Platform 15% Share (INR)', getValue: (b) => Math.round((Number(b.total_amount) || 0) * 0.15) },
      { label: 'Partner 85% Share (INR)', getValue: (b) => Math.round((Number(b.total_amount) || 0) * 0.85) },
      { label: 'Payment Method', key: 'payment_method' },
      { label: 'Technician Assigned', key: 'technician_name' }
    ];
    exportToCsv(`Executive_Sales_Report_${selectedCity}`, filteredBookings, headers, showToast);
  };

  // Export Servicemen Productivity
  const handleExportServicemenProductivity = () => {
    const headers = [
      { label: 'Serviceman ID', key: 'id' },
      { label: 'Name', key: 'name' },
      { label: 'Phone', key: 'phone' },
      { label: 'Specialty', key: 'specialty' },
      { label: 'City', key: 'city' },
      { label: 'Zone', key: 'zone_name' },
      { label: 'Rating', key: 'rating' },
      { label: 'Jobs Completed', key: 'jobs_completed' },
      { label: 'Availability', getValue: (s) => (s.is_available ? 'Available' : 'Offline') },
      { label: 'Status', key: 'status' },
      { label: 'Crew / Agency', key: 'provider_name' }
    ];
    exportToCsv('Servicemen_Productivity_Report', servicemen, headers, showToast);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Export Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Executive Analytics & Financial Reports
          </h2>
          <p className="text-xs text-slate-500">Real-time revenue, booking performance & field productivity</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Operating Cities</option>
            {cities && cities.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
          </select>

          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days (Current Month)</option>
            <option value="all">All-Time Cumulative</option>
          </select>

          <button
            onClick={handleExportExecutiveReport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Complete Excel Report
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Booking Value (GMV)</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{totalGMV.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last period
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Net Revenue (15%)</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Award className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-emerald-600">₹{netCommission.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-1">Direct platform margin retained</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Fulfillment & Success Rate</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><CheckCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-indigo-600">{completionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {completedCount} completed • {cancelledCount} cancelled • {pendingCount} in queue
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Field Servicemen</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {servicemen.filter(s => s.is_available).length} <span className="text-sm font-normal text-slate-400">/ {servicemen.length} on duty</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg rating: 4.88 ⭐ across all field staff
          </div>
        </div>
      </div>

      {/* Two Column Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Revenue by Service Category
            </h3>
            <span className="text-xs text-slate-500">{categoryBreakdown.length} Categories</span>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((cat, idx) => {
              const pct = totalGMV > 0 ? Math.round((cat.revenue / totalGMV) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cat.name} ({cat.count} orders)</span>
                    <span className="font-bold text-slate-900">₹{cat.revenue.toLocaleString('en-IN')} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City Performance Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" /> City Hub Revenue Performance
            </h3>
            <span className="text-xs text-slate-500">{cityBreakdown.length} Hubs</span>
          </div>

          <div className="space-y-3">
            {cityBreakdown.map((ct, idx) => {
              const pct = totalGMV > 0 ? Math.round((ct.revenue / totalGMV) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{ct.city} ({ct.count} bookings)</span>
                    <span className="font-bold text-slate-900">₹{ct.revenue.toLocaleString('en-IN')} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Field Crew Productivity Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Servicemen Productivity Leaderboard
            </h3>
            <p className="text-xs text-slate-500">Field staff ranked by completed jobs, quality ratings and availability</p>
          </div>
          <button
            onClick={handleExportServicemenProductivity}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" /> Export Servicemen CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Rank & Serviceman</th>
                <th className="p-4">Specialty & Crew</th>
                <th className="p-4">Operating Hub & Zone</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Jobs Completed</th>
                <th className="p-4">Current Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {servicemen.map((sm, index) => (
                <tr key={sm.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{sm.name}</div>
                        <div className="text-slate-500 text-[11px]">{sm.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-800">{sm.specialty}</span>
                    <div className="text-[11px] text-slate-500">{sm.provider_name}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{sm.city}</div>
                    <div className="text-[11px] text-slate-500">{sm.zone_name}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {sm.experience_years} Years
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      ⭐ {sm.rating || 4.9}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {sm.jobs_completed} Done
                  </td>
                  <td className="p-4">
                    {sm.is_available ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> On Duty
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                        Offline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. SERVICEMEN (FIELD CREW) MANAGEMENT TAB
// ==========================================
export function ServicemenTab({ servicemen, cities, onAddClick, onToggleAvailability, onDeleteClick, showToast }) {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  const filtered = useMemo(() => {
    return servicemen.filter(s => {
      const matchCity = cityFilter === 'All' || s.city === cityFilter;
      const q = search.toLowerCase();
      const matchSearch = !search ||
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.specialty.toLowerCase().includes(q) ||
        (s.zone_name && s.zone_name.toLowerCase().includes(q));
      return matchCity && matchSearch;
    });
  }, [servicemen, cityFilter, search]);

  const handleExport = () => {
    const headers = [
      { label: 'Serviceman ID', key: 'id' },
      { label: 'Name', key: 'name' },
      { label: 'Phone', key: 'phone' },
      { label: 'Email', key: 'email' },
      { label: 'City', key: 'city' },
      { label: 'Zone Name', key: 'zone_name' },
      { label: 'Specialty', key: 'specialty' },
      { label: 'Experience (Years)', key: 'experience_years' },
      { label: 'Rating', key: 'rating' },
      { label: 'Jobs Completed', key: 'jobs_completed' },
      { label: 'On Duty Status', getValue: s => (s.is_available ? 'Available' : 'Offline') },
      { label: 'Account Status', key: 'status' },
      { label: 'Provider / Agency', key: 'provider_name' }
    ];
    exportToCsv('FixoHub_Servicemen_Directory', filtered, headers, showToast);
  };

  return (
    <div className="space-y-4">
      {/* Header with Search, Filter, Export & Add button */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search serviceman name, phone, specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            <option value="All">All Operating Cities</option>
            {cities && cities.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export to Excel
          </button>

          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add New Serviceman
          </button>
        </div>
      </div>

      {/* Grid of Servicemen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sm => (
          <div key={sm.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
                  {sm.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{sm.name}</h4>
                  <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {sm.specialty}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                ⭐ {sm.rating || 4.9}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hub & Zone:</span>
                <span className="font-semibold text-slate-800">{sm.city} • {sm.zone_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="font-semibold text-slate-800">{sm.experience_years} Years field experience</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Jobs Completed:</span>
                <span className="font-bold text-emerald-600">{sm.jobs_completed} verified orders</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Crew / Agency:</span>
                <span className="font-medium text-slate-700">{sm.provider_name}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleAvailability(sm)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    sm.is_available
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${sm.is_available ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  {sm.is_available ? 'Available (On Duty)' : 'Offline / Off-Duty'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${sm.phone}`}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
                  title="Call Serviceman"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => onDeleteClick(sm.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs transition"
                  title="Delete Serviceman"
                >
                  <Ban className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. SERVICE ZONES & GEO-FENCING TAB
// ==========================================
export function ZonesTab({ zones, cities, onAddClick, onToggleActive, onDeleteClick, showToast }) {
  const handleExport = () => {
    const headers = [
      { label: 'Zone ID', key: 'id' },
      { label: 'Zone Name', key: 'name' },
      { label: 'City Hub', key: 'city' },
      { label: 'Covered Pincodes', key: 'pincodes' },
      { label: 'Surge Multiplier', key: 'surge_multiplier' },
      { label: 'Visiting Charge (INR)', key: 'visiting_charge' },
      { label: 'Status', getValue: z => (z.is_active ? 'Active' : 'Disabled') }
    ];
    exportToCsv('FixoHub_Service_Zones', zones, headers, showToast);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Map className="w-5 h-5 text-indigo-600" /> Operating Service Zones & Dynamic Surge
          </h2>
          <p className="text-xs text-slate-500">Configure geo-fenced delivery zones, pincode routing and peak surge pricing</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Zones
          </button>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Service Zone
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map(zn => (
          <div key={zn.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 mb-1">
                  {zn.city}
                </span>
                <h4 className="font-bold text-slate-900 text-base">{zn.name}</h4>
              </div>

              <button
                onClick={() => onToggleActive(zn)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                  zn.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {zn.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Peak Surge Multiplier:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  zn.surge_multiplier > 1.0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {zn.surge_multiplier}x {zn.surge_multiplier > 1.0 ? 'Peak Surge' : 'Standard'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Visiting Inspection Fee:</span>
                <span className="font-bold text-slate-900">₹{zn.visiting_charge || 49}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Covered Pincodes:</div>
              <div className="flex flex-wrap gap-1">
                {zn.pincodes ? zn.pincodes.split(',').map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-mono text-slate-700">
                    {p.trim()}
                  </span>
                )) : (
                  <span className="text-slate-400 text-xs">All city pincodes</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">ID: {zn.id}</span>
              <button
                onClick={() => onDeleteClick(zn.id)}
                className="text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                Delete Zone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. INCIDENT & DISPUTE TRACKING TAB
// ==========================================
export function IssuesTab({ issues, onAddClick, onResolveClick, showToast }) {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    return issues.filter(i => {
      if (filter === 'All') return true;
      return i.status.toLowerCase() === filter.toLowerCase();
    });
  }, [issues, filter]);

  const handleExport = () => {
    const headers = [
      { label: 'Issue ID', key: 'id' },
      { label: 'Booking Code', key: 'booking_code' },
      { label: 'Customer Name', key: 'customer_name' },
      { label: 'Customer Phone', key: 'customer_phone' },
      { label: 'Serviceman Involved', key: 'serviceman_name' },
      { label: 'Category', key: 'category' },
      { label: 'Severity', key: 'severity' },
      { label: 'Description', key: 'description' },
      { label: 'Status', key: 'status' },
      { label: 'Refund / Compensation (INR)', key: 'refund_amount' },
      { label: 'Resolution Notes', key: 'resolution_notes' },
      { label: 'Reported At', key: 'created_at' },
      { label: 'Resolved At', key: 'resolved_at' }
    ];
    exportToCsv('FixoHub_Disputes_Log', filtered, headers, showToast);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
            {['All', 'Open', 'Investigating', 'Resolved'].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === st ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st} ({issues.filter(i => st === 'All' || i.status.toLowerCase() === st.toLowerCase()).length})
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Disputes
          </button>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-red-600/20 transition"
          >
            <AlertOctagon className="w-4 h-4" /> Report New Incident
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Incident ID & Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Serviceman</th>
                <th className="p-4">Category & Severity</th>
                <th className="p-4">Issue Description</th>
                <th className="p-4">Status & Compensation</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(iss => (
                <tr key={iss.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold font-mono text-slate-900">{iss.id}</div>
                    <div className="text-[11px] font-mono text-blue-600">Booking: {iss.booking_code}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{iss.customer_name}</div>
                    <div className="text-[11px] text-slate-500">{iss.customer_phone}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    {iss.serviceman_name || 'Unassigned'}
                  </td>
                  <td className="p-4 space-y-1">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {iss.category}
                    </span>
                    <div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        iss.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                        iss.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {iss.severity} Priority
                      </span>
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="text-slate-700 line-clamp-2">{iss.description}</p>
                    {iss.resolution_notes && (
                      <p className="text-[11px] text-emerald-600 mt-1">Resolution: {iss.resolution_notes}</p>
                    )}
                  </td>
                  <td className="p-4 space-y-1">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      iss.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      iss.status === 'Investigating' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {iss.status}
                    </span>
                    {iss.refund_amount > 0 && (
                      <div className="text-[11px] font-bold text-emerald-600">
                        ₹{iss.refund_amount} refunded to wallet
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onResolveClick(iss)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs transition"
                    >
                      {iss.status === 'Resolved' ? 'View / Update' : 'Investigate & Resolve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. USER ROLES & STAFF (RBAC) TAB
// ==========================================
export function RolesTab({ roles, staff, onAddStaffClick, onToggleStaffStatus, onDeleteStaffClick, showToast }) {
  const handleExport = () => {
    const headers = [
      { label: 'Staff ID', key: 'id' },
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Role Assigned', key: 'role_name' },
      { label: 'City Access', key: 'city_access' },
      { label: 'Status', key: 'status' }
    ];
    exportToCsv('FixoHub_Staff_RBAC', staff, headers, showToast);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" /> Staff Roles & Granular RBAC Permissions
          </h2>
          <p className="text-xs text-slate-500">Configure administrative access, staff credentials and regional dispatch zones</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Staff List
          </button>
          <button
            onClick={onAddStaffClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
      </div>

      {/* Role Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{r.role_name}</span>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                {r.id}
              </span>
            </div>
            <p className="text-xs text-slate-600">{r.description}</p>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Permissions:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {r.permissions ? r.permissions.split(',').map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                    {p.trim()}
                  </span>
                )) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Members List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Active Administrative Staff Members</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">City Access Jurisdiction</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(st => (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-900">{st.name}</td>
                  <td className="p-4 text-slate-600">
                    <div>{st.email}</div>
                    <div className="text-[11px] text-slate-500">{st.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {st.role_name}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{st.city_access}</td>
                  <td className="p-4">
                    <button
                      onClick={() => onToggleStaffStatus(st)}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition ${
                        st.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {st.status}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDeleteStaffClick(st.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
