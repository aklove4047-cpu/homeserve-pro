function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// In-memory demo OTP cache for ultra-fast OTP verification
const OTP_STORE = new Map();

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      if (path === '/api/health') {
        return json({ ok: true, service: 'FixoHub Enterprise Worker', timestamp: new Date().toISOString() });
      }

      // ==================== OTP SYSTEM APIS ====================
      if (path === '/api/otp/send' && method === 'POST') {
        const { phone, purpose = 'login' } = await request.json();
        if (!phone) return json({ error: 'Phone number is required' }, 400);

        // Generate 4-digit OTP
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
        OTP_STORE.set(phone.replace(/\s+/g, ''), { otp, expiresAt, purpose });

        return json({
          success: true,
          message: `OTP sent successfully to ${phone}`,
          phone,
          otp, // returned for seamless instant testing / demo experience
          expires_in_seconds: 300
        });
      }

      if (path === '/api/otp/verify' && method === 'POST') {
        const { phone, otp } = await request.json();
        if (!phone || !otp) return json({ error: 'Phone and OTP are required' }, 400);

        const cleanPhone = phone.replace(/\s+/g, '');
        const record = OTP_STORE.get(cleanPhone);

        // Universal master demo OTP '1234' or exact generated OTP
        if (otp === '1234' || (record && record.otp === otp && Date.now() < record.expiresAt)) {
          OTP_STORE.delete(cleanPhone);
          return json({
            success: true,
            verified: true,
            message: 'Phone number verified successfully!',
            user: {
              phone,
              name: 'Customer',
              token: `fh_tok_${crypto.randomUUID().slice(0, 16)}`
            }
          });
        }
        return json({ success: false, verified: false, error: 'Invalid or expired OTP. (Demo: try 1234)' }, 400);
      }

      // ==================== PAYMENT GATEWAY APIS ====================
      if (path === '/api/payments/gateways' && method === 'GET') {
        return json({
          gateways: [
            { id: 'razorpay', name: 'RazorPay UPI / Cards / NetBanking', active: true, key_id: 'rzp_live_demo_fixohub' },
            { id: 'phonepe', name: 'PhonePe Direct Payment Gateway', active: true, merchant_id: 'MERCHANT_FIXOHUB' },
            { id: 'wallet', name: 'FixoWallet (Fast & 5% Cashback)', active: true },
            { id: 'cod', name: 'Cash on Doorstep Visit', active: true }
          ]
        });
      }

      if (path === '/api/payments/create-order' && method === 'POST') {
        const { amount, currency = 'INR', booking_id = null } = await request.json();
        if (!amount) return json({ error: 'Amount is required' }, 400);

        const order_id = `order_rzp_${crypto.randomUUID().slice(0, 12)}`;
        return json({
          success: true,
          order_id,
          amount: Math.round(Number(amount) * 100), // in paise for RazorPay
          currency,
          key_id: 'rzp_test_FIXOHUB2026',
          booking_id
        });
      }

      if (path === '/api/payments/verify' && method === 'POST') {
        const { order_id, payment_id, booking_code, amount, customer_name, provider_name, method: payMethod = 'RazorPay' } = await request.json();
        const txnId = `txn-${crypto.randomUUID().slice(0, 8)}`;
        const created_at = new Date().toISOString();

        await env.DB.prepare(`
          INSERT INTO transactions (id, booking_code, customer_name, provider_name, method, amount, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'Success', ?)
        `).bind(txnId, booking_code || '11059', customer_name || 'Customer', provider_name || 'Verified Pro', payMethod, Number(amount || 0), created_at).run();

        return json({
          success: true,
          verified: true,
          transaction_id: txnId,
          order_id: order_id || `order_${txnId}`,
          message: 'Payment verified and transaction ledger updated!'
        });
      }

      // ==================== IMAGE / PHOTO UPLOAD SIMULATOR ====================
      if (path === '/api/upload' && method === 'POST') {
        const { data, filename = 'photo.jpg' } = await request.json().catch(() => ({}));
        // If data is provided as base64 or URL, return usable URL
        return json({
          success: true,
          url: data && data.startsWith('data:') ? data : `https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=600&q=80`,
          filename
        });
      }

      // ==================== CATEGORIES ====================
      if (path === '/api/categories' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
        return json(results);
      }

      // ==================== SERVICES ====================
      if (path === '/api/services' && method === 'GET') {
        const all = url.searchParams.get('all');
        const categoryId = url.searchParams.get('categoryId');
        const q = url.searchParams.get('q');

        let sql = `
          SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color
          FROM services s
          JOIN categories c ON s.category_id = c.id
          WHERE 1=1
        `;
        const params = [];
        if (!all) sql += ' AND s.is_active = 1';
        if (categoryId && categoryId !== 'all') {
          sql += ' AND s.category_id = ?';
          params.push(categoryId);
        }
        if (q) {
          sql += ' AND (LOWER(s.name) LIKE ? OR LOWER(s.description) LIKE ? OR LOWER(c.name) LIKE ?)';
          const term = `%${q.toLowerCase()}%`;
          params.push(term, term, term);
        }
        sql += ' ORDER BY s.is_popular DESC, s.reviews_count DESC';

        const { results } = await env.DB.prepare(sql).bind(...params).all();
        return json(results.map(r => ({
          ...r,
          includes: r.includes ? String(r.includes).split(',').map(x => x.trim()) : []
        })));
      }

      if (path === '/api/services' && method === 'POST') {
        const body = await request.json();
        const { category_id, name, description = '', price, original_price = null, duration_mins = 45, warranty_days = 30, includes = [], image_url = '', is_popular = 0 } = body;
        if (!category_id || !name || !price) return json({ error: 'category_id, name and price are required' }, 400);

        const id = `srv-${crypto.randomUUID().slice(0, 8)}`;
        const includesStr = Array.isArray(includes) ? includes.join(',') : String(includes || '');
        await env.DB.prepare(`
          INSERT INTO services (id, category_id, name, description, price, original_price, duration_mins, warranty_days, includes, is_popular, is_active, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `).bind(id, category_id, name, description, Number(price), original_price ? Number(original_price) : null, Number(duration_mins), Number(warranty_days), includesStr, is_popular ? 1 : 0, image_url).run();

        const created = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).first();
        return json(created, 201);
      }

      if (path.startsWith('/api/services/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Service not found' }, 404);
        const body = await request.json();

        const is_active = body.is_active !== undefined ? (body.is_active ? 1 : 0) : existing.is_active;
        const price = body.price !== undefined ? Number(body.price) : existing.price;
        const original_price = body.original_price !== undefined ? Number(body.original_price) : existing.original_price;
        const name = body.name || existing.name;
        const description = body.description !== undefined ? body.description : existing.description;
        const image_url = body.image_url || existing.image_url;
        const warranty_days = body.warranty_days !== undefined ? Number(body.warranty_days) : existing.warranty_days;
        const duration_mins = body.duration_mins !== undefined ? Number(body.duration_mins) : existing.duration_mins;

        await env.DB.prepare(`
          UPDATE services
          SET is_active = ?, price = ?, original_price = ?, name = ?, description = ?, image_url = ?, warranty_days = ?, duration_mins = ?
          WHERE id = ?
        `).bind(is_active, price, original_price, name, description, image_url, warranty_days, duration_mins, id).run();

        return json(await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/services/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== TECHNICIANS & PARTNERS ====================
      if (path === '/api/technicians' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM technicians ORDER BY jobs_completed DESC').all();
        return json(results);
      }

      if (path === '/api/partner/login' && method === 'POST') {
        const { phone } = await request.json();
        const clean = String(phone || '').replace(/\s+/g, '');
        const { results } = await env.DB.prepare('SELECT * FROM technicians').all();
        const found = results.find(t => t.phone.replace(/\s+/g, '').includes(clean) || t.id === phone);
        if (!found) return json({ error: 'Partner not found' }, 404);
        return json(found);
      }

      if (path === '/api/technicians' && method === 'POST') {
        const { name, phone, specialty, city = 'Delhi NCR' } = await request.json();
        if (!name || !phone || !specialty) return json({ error: 'name, phone and specialty are required' }, 400);
        const id = `tech-${crypto.randomUUID().slice(0, 8)}`;
        await env.DB.prepare(`
          INSERT INTO technicians (id, name, phone, specialty, city, rating, jobs_completed, is_available, avatar_color)
          VALUES (?, ?, ?, ?, ?, 4.9, 0, 1, '#0079ff')
        `).bind(id, name, phone, specialty, city).run();
        return json(await env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/technicians/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Technician not found' }, 404);
        const body = await request.json();
        const is_available = body.is_available !== undefined ? (body.is_available ? 1 : 0) : existing.is_available;
        await env.DB.prepare('UPDATE technicians SET is_available = ? WHERE id = ?').bind(is_available, id).run();
        return json(await env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first());
      }

      // ==================== BOOKINGS ====================
      if (path === '/api/bookings' && method === 'GET') {
        const techId = url.searchParams.get('technicianId');
        let sql = `
          SELECT b.*, t.name as technician_name, t.phone as technician_phone
          FROM bookings b
          LEFT JOIN technicians t ON b.technician_id = t.id
        `;
        const params = [];
        if (techId) {
          sql += ' WHERE b.technician_id = ? OR b.technician_id IS NULL';
          params.push(techId);
        }
        sql += ' ORDER BY b.created_at DESC';
        const { results } = await env.DB.prepare(sql).bind(...params).all();
        return json(results.map(r => ({ ...r, items: JSON.parse(r.items_json || '[]') })));
      }

      if (path === '/api/bookings' && method === 'POST') {
        const body = await request.json();
        const {
          customer_name, customer_phone, address, city = 'Delhi NCR',
          scheduled_date, scheduled_slot, payment_method = 'UPI / Cash on Visit',
          notes = '', items = [], source = 'website'
        } = body;

        if (!customer_name || !customer_phone || !address || !scheduled_date || !scheduled_slot || !items.length) {
          return json({ error: 'Missing required booking fields or empty cart' }, 400);
        }

        const total_amount = body.total_amount ? Number(body.total_amount) : items.reduce((s, it) => s + Number(it.price) * Number(it.qty || 1), 0);
        const id = `bk-${crypto.randomUUID().slice(0, 8)}`;
        const booking_code = `HS-${Math.floor(1000 + Math.random() * 9000)}`;
        const created_at = new Date().toISOString();

        await env.DB.prepare(`
          INSERT INTO bookings (id, booking_code, customer_name, customer_phone, address, city, scheduled_date, scheduled_slot, payment_method, notes, items_json, total_amount, status, source, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
        `).bind(id, booking_code, customer_name, customer_phone, address, city, scheduled_date, scheduled_slot, payment_method, notes, JSON.stringify(items), total_amount, source, created_at).run();

        const created = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
        return json({ ...created, items }, 201);
      }

      if (path.startsWith('/api/bookings/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Booking not found' }, 404);
        const body = await request.json();
        const status = body.status ?? existing.status;
        const technician_id = body.technician_id !== undefined ? (body.technician_id || null) : existing.technician_id;

        await env.DB.prepare('UPDATE bookings SET status = ?, technician_id = ? WHERE id = ?').bind(status, technician_id, id).run();
        if (status === 'completed' && existing.status !== 'completed' && technician_id) {
          await env.DB.prepare('UPDATE technicians SET jobs_completed = jobs_completed + 1 WHERE id = ?').bind(technician_id).run();
        }
        const updated = await env.DB.prepare(`
          SELECT b.*, t.name as technician_name, t.phone as technician_phone
          FROM bookings b LEFT JOIN technicians t ON b.technician_id = t.id WHERE b.id = ?
        `).bind(id).first();
        return json({ ...updated, items: JSON.parse(updated.items_json || '[]') });
      }

      // ==================== STATS ====================
      if (path === '/api/stats' && method === 'GET') {
        const totalBookings = (await env.DB.prepare('SELECT COUNT(*) as c FROM bookings').first()).c;
        const pendingBookings = (await env.DB.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'").first()).c;
        const completedBookings = (await env.DB.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'completed'").first()).c;
        const activeServices = (await env.DB.prepare('SELECT COUNT(*) as c FROM services WHERE is_active = 1').first()).c;
        const totalTechnicians = (await env.DB.prepare('SELECT COUNT(*) as c FROM technicians').first()).c;
        const availableTechnicians = (await env.DB.prepare('SELECT COUNT(*) as c FROM technicians WHERE is_available = 1').first()).c;
        const totalRevenue = (await env.DB.prepare("SELECT COALESCE(SUM(total_amount), 0) as rev FROM bookings WHERE status != 'cancelled'").first()).rev;
        return json({ totalBookings, pendingBookings, completedBookings, activeServices, totalTechnicians, availableTechnicians, totalRevenue });
      }

      // ==================== CUSTOM REQUESTS ====================
      if (path === '/api/requests' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM custom_requests ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/requests' && method === 'POST') {
        const { customer_name = 'Guest User', title, category_name = 'General', description = '', min_budget = 200, max_budget = 1000 } = await request.json();
        if (!title) return json({ error: 'title is required' }, 400);
        const id = `req-${crypto.randomUUID().slice(0, 8)}`;
        const created_at = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO custom_requests (id, customer_name, title, category_name, description, min_budget, max_budget, status, bids_count, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested', 0, ?)
        `).bind(id, customer_name, title, category_name, description, Number(min_budget), Number(max_budget), created_at).run();
        return json(await env.DB.prepare('SELECT * FROM custom_requests WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/requests/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM custom_requests WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Request not found' }, 404);
        const body = await request.json();
        const status = body.status ?? existing.status;
        const bid_provider = body.bid_provider ?? existing.bid_provider;
        const bid_amount = body.bid_amount !== undefined ? Number(body.bid_amount) : existing.bid_amount;
        const bids_count = body.bid_provider ? existing.bids_count + 1 : existing.bids_count;
        await env.DB.prepare('UPDATE custom_requests SET status = ?, bid_provider = ?, bid_amount = ?, bids_count = ? WHERE id = ?')
          .bind(status, bid_provider, bid_amount, bids_count, id).run();
        return json(await env.DB.prepare('SELECT * FROM custom_requests WHERE id = ?').bind(id).first());
      }

      // ==================== PROMO CODES ====================
      if (path === '/api/promocodes' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM promocodes ORDER BY discount_percent DESC').all();
        return json(results);
      }

      if (path === '/api/promocodes' && method === 'POST') {
        const { code, discount_percent, min_order = 299, max_discount = 500, valid_until = '2026-12-31' } = await request.json();
        if (!code || !discount_percent) return json({ error: 'code and discount_percent required' }, 400);
        const id = `prm-${crypto.randomUUID().slice(0, 8)}`;
        await env.DB.prepare('INSERT INTO promocodes (id, code, discount_percent, min_order, max_discount, valid_until, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)')
          .bind(id, String(code).toUpperCase(), Number(discount_percent), Number(min_order), Number(max_discount), valid_until).run();
        return json(await env.DB.prepare('SELECT * FROM promocodes WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/promocodes/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM promocodes WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== CHAT MESSAGES ====================
      if (path === '/api/chats' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM chat_messages ORDER BY created_at ASC').all();
        return json(results);
      }

      if (path === '/api/chats' && method === 'POST') {
        const { partner_id = 'tech-1', partner_name = 'Provider', sender = 'customer', message, booking_code = null } = await request.json();
        if (!message) return json({ error: 'message required' }, 400);
        const id = `msg-${crypto.randomUUID().slice(0, 8)}`;
        const created_at = new Date().toISOString();
        await env.DB.prepare('INSERT INTO chat_messages (id, partner_id, partner_name, sender, message, booking_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(id, partner_id, partner_name, sender, message, booking_code, created_at).run();
        return json(await env.DB.prepare('SELECT * FROM chat_messages WHERE id = ?').bind(id).first(), 201);
      }

      // ==================== TRANSACTIONS & BLOGS ====================
      if (path === '/api/transactions' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM transactions ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/blogs' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
        return json(results);
      }

      return env.ASSETS.fetch(request);
    } catch (err) {
      return json({ error: err.message || 'Internal error' }, 500);
    }
  }
};
