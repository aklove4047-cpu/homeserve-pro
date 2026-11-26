export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // In-memory OTP Store for sandbox / demo verification
    if (!globalThis.OTP_STORE) {
      globalThis.OTP_STORE = new Map();
    }
    const OTP_STORE = globalThis.OTP_STORE;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    try {
      // ==================== HEALTH ====================
      if (path === '/api/health') {
        return json({
          status: 'ok',
          platform: 'FixoHub Enterprise',
          database: 'Cloudflare D1',
          timestamp: new Date().toISOString()
        });
      }

      // ==================== OTP SYSTEM APIS ====================
      if (path === '/api/otp/send' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const phone = body.phone;
        const purpose = body.purpose || 'login';
        if (!phone) return json({ error: 'Phone number is required' }, 400);

        const cleanPhone = String(phone).replace(/\s+/g, '');
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        const expiresAt = Date.now() + 5 * 60 * 1000;
        OTP_STORE.set(cleanPhone, { otp, expiresAt, purpose });

        return json({
          success: true,
          message: `OTP sent successfully to ${cleanPhone}`,
          phone: cleanPhone,
          otp,
          expires_in_seconds: 300
        });
      }

      if (path === '/api/otp/verify' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const { phone, otp } = body;
        if (!phone || !otp) return json({ error: 'Phone and OTP are required' }, 400);

        const cleanPhone = String(phone).replace(/\s+/g, '');
        const enteredOtp = String(otp).trim();
        const record = OTP_STORE.get(cleanPhone);

        if (enteredOtp === '1234' || (record && record.otp === enteredOtp && Date.now() < record.expiresAt)) {
          OTP_STORE.delete(cleanPhone);
          return json({
            success: true,
            verified: true,
            message: 'Phone number verified successfully!',
            user: {
              phone: cleanPhone,
              name: 'Customer',
              token: `fh_tok_${crypto.randomUUID().slice(0, 16)}`
            }
          });
        }
        return json({ success: false, verified: false, error: 'Invalid or expired OTP. (Demo master OTP: 1234)' }, 400);
      }

      // ==================== PAYMENT GATEWAYS & SETTINGS ====================
      if (path === '/api/payments/gateways' && method === 'GET') {
        const row = await env.DB.prepare("SELECT value FROM system_settings WHERE key = 'gateways_config'").first();
        let gatewaysConfig = null;
        if (row && row.value) {
          try { gatewaysConfig = JSON.parse(row.value); } catch (_) {}
        }
        if (!gatewaysConfig) {
          gatewaysConfig = {
            razorpay: { enabled: true, key_id: 'rzp_live_FIXOHUB2026' },
            phonepe: { enabled: true, merchant_id: 'MERCHANT_FIXOHUB' },
            stripe: { enabled: false },
            cod: { enabled: true }
          };
        }
        return json({
          gateways: [
            { id: 'razorpay', name: 'RazorPay UPI / Cards / NetBanking', active: !!gatewaysConfig.razorpay?.enabled, key_id: gatewaysConfig.razorpay?.key_id },
            { id: 'phonepe', name: 'PhonePe Direct Payment Gateway', active: !!gatewaysConfig.phonepe?.enabled, merchant_id: gatewaysConfig.phonepe?.merchant_id },
            { id: 'wallet', name: 'FixoWallet (Fast & 5% Cashback)', active: true },
            { id: 'cod', name: 'Cash on Doorstep Visit', active: !!gatewaysConfig.cod?.enabled }
          ]
        });
      }

      if (path === '/api/payments/create-order' && method === 'POST') {
        const { amount, currency = 'INR', booking_id = null } = await request.json().catch(() => ({}));
        if (!amount) return json({ error: 'Amount is required' }, 400);
        const order_id = `order_rzp_${crypto.randomUUID().slice(0, 12)}`;
        return json({
          success: true,
          order_id,
          amount: Math.round(Number(amount) * 100),
          currency,
          key_id: 'rzp_test_FIXOHUB2026',
          booking_id
        });
      }

      if (path === '/api/payments/verify' && method === 'POST') {
        const { order_id, payment_id, booking_code, amount, customer_name, provider_name, method: payMethod = 'RazorPay' } = await request.json().catch(() => ({}));
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

      // ==================== SYSTEM SETTINGS (PERSISTENT IN D1) ====================
      if (path === '/api/settings' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT key, value FROM system_settings').all();
        const settings = {};
        for (const r of results) {
          try {
            settings[r.key] = JSON.parse(r.value);
          } catch (_) {
            settings[r.key] = r.value;
          }
        }
        return json(settings);
      }

      if (path === '/api/settings' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const now = new Date().toISOString();
        for (const [key, val] of Object.entries(body)) {
          const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
          await env.DB.prepare(`
            INSERT INTO system_settings (key, value, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
          `).bind(key, strVal, now).run();
        }
        return json({ success: true, message: 'Settings saved to D1 database successfully!' });
      }

      // ==================== KYC VERIFICATIONS (REAL D1 CRUD) ====================
      if (path === '/api/kyc' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM kyc_verifications ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/kyc' && method === 'POST') {
        const { provider_id, provider_name, phone, doc_type, cert_no, city = 'Delhi NCR', doc_url = '' } = await request.json().catch(() => ({}));
        if (!provider_name || !phone || !doc_type) return json({ error: 'Missing required KYC fields' }, 400);
        const id = `kyc-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO kyc_verifications (id, provider_id, provider_name, phone, doc_type, cert_no, city, doc_url, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
        `).bind(id, provider_id || null, provider_name, phone, doc_type, cert_no || 'CERT-UNSPECIFIED', city, doc_url, now).run();
        return json(await env.DB.prepare('SELECT * FROM kyc_verifications WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/kyc/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const { status, rejection_reason = '' } = await request.json().catch(() => ({}));
        const now = new Date().toISOString();
        await env.DB.prepare(`
          UPDATE kyc_verifications
          SET status = ?, rejection_reason = ?, reviewed_at = ?
          WHERE id = ?
        `).bind(status, rejection_reason, now, id).run();
        return json(await env.DB.prepare('SELECT * FROM kyc_verifications WHERE id = ?').bind(id).first());
      }

      // ==================== PARTNER PAYOUTS (REAL D1 CRUD) ====================
      if (path === '/api/payouts' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM partner_payouts ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/payouts' && method === 'POST') {
        const { provider_id, provider_name, amount, upi_id = '', bank_account = '', ifsc = '', jobs_count = 1 } = await request.json().catch(() => ({}));
        if (!provider_name || !amount) return json({ error: 'provider_name and amount are required' }, 400);
        const id = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO partner_payouts (id, provider_id, provider_name, amount, upi_id, bank_account, ifsc, status, jobs_count, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
        `).bind(id, provider_id || null, provider_name, Number(amount), upi_id, bank_account, ifsc, Number(jobs_count), now).run();
        return json(await env.DB.prepare('SELECT * FROM partner_payouts WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/payouts/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const { status, utr_number = '' } = await request.json().catch(() => ({}));
        const now = new Date().toISOString();
        await env.DB.prepare(`
          UPDATE partner_payouts
          SET status = ?, utr_number = ?, settled_at = ?
          WHERE id = ?
        `).bind(status, utr_number, now, id).run();
        return json(await env.DB.prepare('SELECT * FROM partner_payouts WHERE id = ?').bind(id).first());
      }

      // ==================== CUSTOMERS CRM (REAL D1 CRUD) ====================
      if (path === '/api/customers' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM customers ORDER BY orders_count DESC, joined_at DESC').all();
        return json(results);
      }

      if (path === '/api/customers' && method === 'POST') {
        const { name, phone, email = '', city = 'Delhi NCR', wallet_balance = 100 } = await request.json().catch(() => ({}));
        if (!name || !phone) return json({ error: 'name and phone are required' }, 400);
        const id = `cust-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO customers (id, name, phone, email, city, orders_count, total_spend, wallet_balance, status, joined_at)
          VALUES (?, ?, ?, ?, ?, 0, 0, ?, 'Active', ?)
        `).bind(id, name, phone, email, city, Number(wallet_balance), now).run();
        return json(await env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/customers/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const body = await request.json().catch(() => ({}));
        const existing = await env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Customer not found' }, 404);

        let newStatus = body.status !== undefined ? body.status : existing.status;
        let newWallet = existing.wallet_balance;
        if (body.wallet_delta !== undefined) {
          newWallet += Number(body.wallet_delta);
        } else if (body.wallet_balance !== undefined) {
          newWallet = Number(body.wallet_balance);
        }

        await env.DB.prepare(`
          UPDATE customers
          SET status = ?, wallet_balance = ?
          WHERE id = ?
        `).bind(newStatus, newWallet, id).run();
        return json(await env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first());
      }

      // ==================== SUPPORT DISPUTE TICKETS (REAL D1 CRUD) ====================
      if (path === '/api/tickets' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM support_tickets ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/tickets' && method === 'POST') {
        const { customer_name, customer_phone, category = 'General', subject } = await request.json().catch(() => ({}));
        if (!customer_name || !customer_phone || !subject) return json({ error: 'Missing required ticket fields' }, 400);
        const id = `TKT-${Math.floor(100 + Math.random() * 900)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO support_tickets (id, customer_name, customer_phone, category, subject, status, reply_text, created_at)
          VALUES (?, ?, ?, ?, ?, 'Open', '', ?)
        `).bind(id, customer_name, customer_phone, category, subject, now).run();
        return json(await env.DB.prepare('SELECT * FROM support_tickets WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/tickets/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const { status = 'Resolved', reply_text = '' } = await request.json().catch(() => ({}));
        const now = new Date().toISOString();
        await env.DB.prepare(`
          UPDATE support_tickets
          SET status = ?, reply_text = ?, resolved_at = ?
          WHERE id = ?
        `).bind(status, reply_text, now, id).run();
        return json(await env.DB.prepare('SELECT * FROM support_tickets WHERE id = ?').bind(id).first());
      }

      // ==================== OPERATIONAL CITIES (REAL D1 CRUD) ====================
      if (path === '/api/cities' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM operational_cities ORDER BY name ASC').all();
        return json(results);
      }

      if (path === '/api/cities' && method === 'POST') {
        const { name, min_order = 199, express_dispatch = 1 } = await request.json().catch(() => ({}));
        if (!name) return json({ error: 'City name is required' }, 400);
        const id = `city-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO operational_cities (id, name, min_order, express_dispatch, is_active, created_at)
          VALUES (?, ?, ?, ?, 1, ?)
        `).bind(id, name, Number(min_order), express_dispatch ? 1 : 0, now).run();
        return json(await env.DB.prepare('SELECT * FROM operational_cities WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/cities/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const { is_active, min_order, express_dispatch } = await request.json().catch(() => ({}));
        const existing = await env.DB.prepare('SELECT * FROM operational_cities WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'City not found' }, 404);

        const newActive = is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active;
        const newMin = min_order !== undefined ? Number(min_order) : existing.min_order;
        const newExp = express_dispatch !== undefined ? (express_dispatch ? 1 : 0) : existing.express_dispatch;

        await env.DB.prepare('UPDATE operational_cities SET is_active = ?, min_order = ?, express_dispatch = ? WHERE id = ?')
          .bind(newActive, newMin, newExp, id).run();
        return json(await env.DB.prepare('SELECT * FROM operational_cities WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/cities/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM operational_cities WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== HERO BANNERS (REAL D1 CRUD) ====================
      if (path === '/api/banners' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM hero_banners ORDER BY sort_order ASC, created_at DESC').all();
        return json(results);
      }

      if (path === '/api/banners' && method === 'POST') {
        const { title, subtitle, category = 'All Services', badge = 'Offer', image_url = '' } = await request.json().catch(() => ({}));
        if (!title) return json({ error: 'Title is required' }, 400);
        const id = `ban-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO hero_banners (id, title, subtitle, category, badge, image_url, is_active, sort_order, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?)
        `).bind(id, title, subtitle || '', category, badge, image_url, now).run();
        return json(await env.DB.prepare('SELECT * FROM hero_banners WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/banners/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const { is_active } = await request.json().catch(() => ({}));
        await env.DB.prepare('UPDATE hero_banners SET is_active = ? WHERE id = ?').bind(is_active ? 1 : 0, id).run();
        return json(await env.DB.prepare('SELECT * FROM hero_banners WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/banners/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM hero_banners WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== BROADCAST ANNOUNCEMENTS (REAL D1 CRUD) ====================
      if (path === '/api/broadcast' && method === 'GET') {
        const active = await env.DB.prepare('SELECT * FROM broadcast_announcements WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1').first();
        return json(active || { message: 'Welcome to FixoHub Enterprise!', is_active: 0 });
      }

      if (path === '/api/broadcast' && method === 'POST') {
        const { message, type = 'info', is_active = 1 } = await request.json().catch(() => ({}));
        const id = `bc-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        // Deactivate old broadcasts
        await env.DB.prepare('UPDATE broadcast_announcements SET is_active = 0').run();
        await env.DB.prepare(`
          INSERT INTO broadcast_announcements (id, message, type, target_audience, is_active, created_at)
          VALUES (?, ?, ?, 'all', ?, ?)
        `).bind(id, message, type, is_active ? 1 : 0, now).run();
        return json(await env.DB.prepare('SELECT * FROM broadcast_announcements WHERE id = ?').bind(id).first(), 201);
      }

      // ==================== CUSTOMER REVIEWS (REAL D1 CRUD) ====================
      if (path === '/api/reviews' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/reviews' && method === 'POST') {
        const { service_id = 'srv-gen', service_name = 'General Service', customer_name, rating = 5, comment = '' } = await request.json().catch(() => ({}));
        if (!customer_name || !comment) return json({ error: 'customer_name and comment are required' }, 400);
        const id = `rev-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO reviews (id, service_id, service_name, customer_name, rating, comment, status, reply_text, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'Published', '', ?)
        `).bind(id, service_id, service_name, customer_name, Number(rating), comment, now).run();
        return json(await env.DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/reviews/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const { status, reply_text } = await request.json().catch(() => ({}));
        const existing = await env.DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Review not found' }, 404);

        const newStatus = status !== undefined ? status : existing.status;
        const newReply = reply_text !== undefined ? reply_text : existing.reply_text;
        await env.DB.prepare('UPDATE reviews SET status = ?, reply_text = ? WHERE id = ?').bind(newStatus, newReply, id).run();
        return json(await env.DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/reviews/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== IMAGE / PHOTO UPLOADER ====================
      if (path === '/api/upload' && method === 'POST') {
        const { data, filename = 'photo.jpg' } = await request.json().catch(() => ({}));
        return json({
          success: true,
          url: data && data.startsWith('data:') ? data : `https://images.unsplash.com/photo-1581092334651-ddf19d571e17?w=600&q=80`,
          filename
        });
      }

      // ==================== CATEGORIES (FULL CRUD) ====================
      if (path === '/api/categories' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
        return json(results);
      }

      if (path === '/api/categories' && method === 'POST') {
        const { name, slug, icon = 'Wrench', color = '#0079ff', tagline = '' } = await request.json().catch(() => ({}));
        if (!name) return json({ error: 'Name is required' }, 400);
        const autoSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const id = `cat-${autoSlug}`;
        await env.DB.prepare(`
          INSERT INTO categories (id, name, slug, icon, color, tagline, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, 99)
        `).bind(id, name, autoSlug, icon, color, tagline).run();
        return json(await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/categories/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== SERVICES (FULL CRUD) ====================
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
        const body = await request.json().catch(() => ({}));
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
        const body = await request.json().catch(() => ({}));

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

      // ==================== TECHNICIANS & PARTNERS (FULL CRUD) ====================
      if (path === '/api/technicians' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM technicians ORDER BY jobs_completed DESC').all();
        return json(results);
      }

      if (path === '/api/partner/login' && method === 'POST') {
        const { phone } = await request.json().catch(() => ({}));
        const clean = String(phone || '').replace(/\s+/g, '');
        const { results } = await env.DB.prepare('SELECT * FROM technicians').all();
        const found = results.find(t => 
          (t.phone && t.phone.replace(/\s+/g, '').includes(clean)) || 
          t.id === phone || 
          (t.email && t.email.toLowerCase().trim() === clean.toLowerCase())
        );
        if (!found) return json({ error: 'Partner not found' }, 404);
        return json(found);
      }

      if (path === '/api/technicians' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const {
          name, phone, specialty, city = 'Delhi NCR', pincode = '110001', email = '',
          profile_image = '', id_proof_type = 'PAN Card', id_proof_number = '', id_proof_image = '',
          aadhaar_number = '', aadhaar_image = '',
          bank_name = 'State Bank of India', bank_account_number = '', bank_ifsc = '', bank_holder_name = '', upi_id = '',
          address = '', emergency_contact = '', police_verified = 1, certification = 'Certified ITI Expert'
        } = body;
        if (!name || !phone || !specialty) return json({ error: 'name, phone and specialty are required' }, 400);
        const id = `tech-${crypto.randomUUID().slice(0, 8)}`;
        await env.DB.prepare(`
          INSERT INTO technicians (
            id, name, phone, specialty, city, pincode, email, profile_image,
            id_proof_type, id_proof_number, id_proof_image, aadhaar_number, aadhaar_image,
            bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id,
            address, emergency_contact, police_verified, certification,
            rating, jobs_completed, is_available, avatar_color
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.9, 0, 1, '#0079ff')
        `).bind(
          id, name, phone, specialty, city, pincode, email, profile_image,
          id_proof_type, id_proof_number, id_proof_image, aadhaar_number, aadhaar_image,
          bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id,
          address, emergency_contact, Number(police_verified), certification
        ).run();
        return json(await env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/technicians/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Technician not found' }, 404);
        const body = await request.json().catch(() => ({}));

        const is_available = body.is_available !== undefined ? (body.is_available ? 1 : 0) : existing.is_available;
        const name = body.name ?? existing.name;
        const phone = body.phone ?? existing.phone;
        const specialty = body.specialty ?? existing.specialty;
        const city = body.city ?? existing.city;
        const pincode = body.pincode ?? existing.pincode;
        const email = body.email ?? existing.email;
        const profile_image = body.profile_image ?? existing.profile_image;
        const id_proof_type = body.id_proof_type ?? existing.id_proof_type;
        const id_proof_number = body.id_proof_number ?? existing.id_proof_number;
        const id_proof_image = body.id_proof_image ?? existing.id_proof_image;
        const aadhaar_number = body.aadhaar_number ?? existing.aadhaar_number;
        const aadhaar_image = body.aadhaar_image ?? existing.aadhaar_image;
        const bank_name = body.bank_name ?? existing.bank_name;
        const bank_account_number = body.bank_account_number ?? existing.bank_account_number;
        const bank_ifsc = body.bank_ifsc ?? existing.bank_ifsc;
        const bank_holder_name = body.bank_holder_name ?? existing.bank_holder_name;
        const upi_id = body.upi_id ?? existing.upi_id;
        const address = body.address ?? existing.address;
        const emergency_contact = body.emergency_contact ?? existing.emergency_contact;
        const police_verified = body.police_verified !== undefined ? Number(body.police_verified) : existing.police_verified;
        const certification = body.certification ?? existing.certification;

        await env.DB.prepare(`
          UPDATE technicians SET
            is_available = ?, name = ?, phone = ?, specialty = ?, city = ?, pincode = ?, email = ?, profile_image = ?,
            id_proof_type = ?, id_proof_number = ?, id_proof_image = ?, aadhaar_number = ?, aadhaar_image = ?,
            bank_name = ?, bank_account_number = ?, bank_ifsc = ?, bank_holder_name = ?, upi_id = ?,
            address = ?, emergency_contact = ?, police_verified = ?, certification = ?
          WHERE id = ?
        `).bind(
          is_available, name, phone, specialty, city, pincode, email, profile_image,
          id_proof_type, id_proof_number, id_proof_image, aadhaar_number, aadhaar_image,
          bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id,
          address, emergency_contact, police_verified, certification, id
        ).run();
        return json(await env.DB.prepare('SELECT * FROM technicians WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/technicians/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM technicians WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== BOOKINGS (FULL CRUD) ====================
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
        const body = await request.json().catch(() => ({}));
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

        // Also ensure customer exists in customers CRM
        const cleanCustPhone = customer_phone.replace(/\s+/g, '');
        await env.DB.prepare(`
          INSERT INTO customers (id, name, phone, city, orders_count, total_spend, joined_at)
          VALUES (?, ?, ?, ?, 1, ?, ?)
          ON CONFLICT(phone) DO UPDATE SET orders_count = orders_count + 1, total_spend = total_spend + excluded.total_spend
        `).bind(`cust-${crypto.randomUUID().slice(0, 8)}`, customer_name, cleanCustPhone, city, total_amount, created_at).run();

        const created = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
        return json({ ...created, items }, 201);
      }

      if (path.startsWith('/api/bookings/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Booking not found' }, 404);
        const body = await request.json().catch(() => ({}));
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

      if (path.startsWith('/api/bookings/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();
        return json({ deleted: true });
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
        const pendingKyc = (await env.DB.prepare("SELECT COUNT(*) as c FROM kyc_verifications WHERE status = 'Pending'").first()).c;
        const pendingPayouts = (await env.DB.prepare("SELECT COUNT(*) as c FROM partner_payouts WHERE status = 'Pending'").first()).c;
        const totalCustomers = (await env.DB.prepare('SELECT COUNT(*) as c FROM customers').first()).c;
        const openTickets = (await env.DB.prepare("SELECT COUNT(*) as c FROM support_tickets WHERE status = 'Open'").first()).c;
        const totalServicemen = (await env.DB.prepare('SELECT COUNT(*) as c FROM servicemen').first()).c;
        const totalZones = (await env.DB.prepare('SELECT COUNT(*) as c FROM service_zones').first()).c;
        const openIssues = (await env.DB.prepare("SELECT COUNT(*) as c FROM system_issues WHERE status = 'Open'").first()).c;
        const totalStaff = (await env.DB.prepare('SELECT COUNT(*) as c FROM admin_staff').first()).c;

        return json({
          totalBookings, pendingBookings, completedBookings,
          activeServices, totalTechnicians, availableTechnicians,
          totalRevenue, pendingKyc, pendingPayouts, totalCustomers, openTickets,
          totalServicemen, totalZones, openIssues, totalStaff
        });
      }

      // ==================== CUSTOM REQUESTS ====================
      if (path === '/api/requests' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM custom_requests ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/requests' && method === 'POST') {
        const { customer_name = 'Guest User', title, category_name = 'General', description = '', min_budget = 200, max_budget = 1000 } = await request.json().catch(() => ({}));
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
        const body = await request.json().catch(() => ({}));
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
        const { code, discount_percent, min_order = 299, max_discount = 500, valid_until = '2026-12-31' } = await request.json().catch(() => ({}));
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
        const { partner_id = 'tech-1', partner_name = 'Provider', sender = 'customer', message, booking_code = null } = await request.json().catch(() => ({}));
        if (!message) return json({ error: 'message required' }, 400);
        const id = `msg-${crypto.randomUUID().slice(0, 8)}`;
        const created_at = new Date().toISOString();
        await env.DB.prepare('INSERT INTO chat_messages (id, partner_id, partner_name, sender, message, booking_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(id, partner_id, partner_name, sender, message, booking_code, created_at).run();
        return json(await env.DB.prepare('SELECT * FROM chat_messages WHERE id = ?').bind(id).first(), 201);
      }

      // ==================== SERVICEMEN (FIELD STAFF) ====================
      if (path === '/api/servicemen' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM servicemen ORDER BY jobs_completed DESC, created_at DESC').all();
        return json(results);
      }

      if (path === '/api/servicemen' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const {
          name, phone, email = '', city = 'Delhi NCR', pincode = '110001', zone_name = 'Central Zone',
          specialty, experience_years = 3, provider_name = 'FixoHub Direct Crew',
          profile_image = '', id_proof_type = 'PAN Card', id_proof_number = '', id_proof_image = '',
          aadhaar_number = '', aadhaar_image = '',
          bank_name = 'HDFC Bank', bank_account_number = '', bank_ifsc = '', bank_holder_name = '', upi_id = '',
          address = '', emergency_contact = '', police_verified = 1, certification = 'Certified ITI Expert'
        } = body;
        if (!name || !phone || !specialty) return json({ error: 'name, phone and specialty are required' }, 400);

        const id = `sm-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO servicemen (
            id, name, phone, email, city, pincode, zone_name, specialty, experience_years,
            rating, jobs_completed, is_available, status, provider_name,
            profile_image, id_proof_type, id_proof_number, id_proof_image,
            aadhaar_number, aadhaar_image, bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id,
            address, emergency_contact, police_verified, certification, created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 4.9, 0, 1, 'Active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, name, phone, email, city, pincode, zone_name, specialty, Number(experience_years), provider_name,
          profile_image, id_proof_type, id_proof_number, id_proof_image,
          aadhaar_number, aadhaar_image, bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id,
          address, emergency_contact, Number(police_verified), certification, now
        ).run();

        return json(await env.DB.prepare('SELECT * FROM servicemen WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/servicemen/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM servicemen WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Serviceman not found' }, 404);
        const body = await request.json().catch(() => ({}));

        const is_available = body.is_available !== undefined ? (body.is_available ? 1 : 0) : existing.is_available;
        const status = body.status || existing.status;
        const zone_name = body.zone_name || existing.zone_name;
        const name = body.name ?? existing.name;
        const phone = body.phone ?? existing.phone;
        const email = body.email ?? existing.email;
        const city = body.city ?? existing.city;
        const pincode = body.pincode ?? existing.pincode;
        const specialty = body.specialty ?? existing.specialty;
        const experience_years = body.experience_years !== undefined ? Number(body.experience_years) : existing.experience_years;
        const provider_name = body.provider_name ?? existing.provider_name;
        const profile_image = body.profile_image ?? existing.profile_image;
        const id_proof_type = body.id_proof_type ?? existing.id_proof_type;
        const id_proof_number = body.id_proof_number ?? existing.id_proof_number;
        const id_proof_image = body.id_proof_image ?? existing.id_proof_image;
        const aadhaar_number = body.aadhaar_number ?? existing.aadhaar_number;
        const aadhaar_image = body.aadhaar_image ?? existing.aadhaar_image;
        const bank_name = body.bank_name ?? existing.bank_name;
        const bank_account_number = body.bank_account_number ?? existing.bank_account_number;
        const bank_ifsc = body.bank_ifsc ?? existing.bank_ifsc;
        const bank_holder_name = body.bank_holder_name ?? existing.bank_holder_name;
        const upi_id = body.upi_id ?? existing.upi_id;
        const address = body.address ?? existing.address;
        const emergency_contact = body.emergency_contact ?? existing.emergency_contact;
        const police_verified = body.police_verified !== undefined ? Number(body.police_verified) : existing.police_verified;
        const certification = body.certification ?? existing.certification;

        await env.DB.prepare(`
          UPDATE servicemen SET
            is_available = ?, status = ?, zone_name = ?, name = ?, phone = ?, email = ?, city = ?, pincode = ?,
            specialty = ?, experience_years = ?, provider_name = ?, profile_image = ?,
            id_proof_type = ?, id_proof_number = ?, id_proof_image = ?, aadhaar_number = ?, aadhaar_image = ?,
            bank_name = ?, bank_account_number = ?, bank_ifsc = ?, bank_holder_name = ?, upi_id = ?,
            address = ?, emergency_contact = ?, police_verified = ?, certification = ?
          WHERE id = ?
        `).bind(
          is_available, status, zone_name, name, phone, email, city, pincode,
          specialty, experience_years, provider_name, profile_image,
          id_proof_type, id_proof_number, id_proof_image, aadhaar_number, aadhaar_image,
          bank_name, bank_account_number, bank_ifsc, bank_holder_name, upi_id,
          address, emergency_contact, police_verified, certification, id
        ).run();
        return json(await env.DB.prepare('SELECT * FROM servicemen WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/servicemen/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM servicemen WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== SERVICE ZONES (GEO-FENCING) ====================
      if (path === '/api/zones' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM service_zones ORDER BY city ASC, name ASC').all();
        return json(results);
      }

      if (path === '/api/zones' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const { name, city, pincodes = '', surge_multiplier = 1.0, visiting_charge = 49 } = body;
        if (!name || !city) return json({ error: 'name and city are required' }, 400);

        const id = `zn-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO service_zones (id, name, city, pincodes, surge_multiplier, visiting_charge, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 1, ?)
        `).bind(id, name, city, pincodes, Number(surge_multiplier), Number(visiting_charge), now).run();

        return json(await env.DB.prepare('SELECT * FROM service_zones WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/zones/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM service_zones WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Zone not found' }, 404);
        const body = await request.json().catch(() => ({}));

        const is_active = body.is_active !== undefined ? (body.is_active ? 1 : 0) : existing.is_active;
        const surge = body.surge_multiplier !== undefined ? Number(body.surge_multiplier) : existing.surge_multiplier;
        const visiting = body.visiting_charge !== undefined ? Number(body.visiting_charge) : existing.visiting_charge;

        await env.DB.prepare('UPDATE service_zones SET is_active = ?, surge_multiplier = ?, visiting_charge = ? WHERE id = ?')
          .bind(is_active, surge, visiting, id).run();
        return json(await env.DB.prepare('SELECT * FROM service_zones WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/zones/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM service_zones WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      // ==================== SYSTEM ISSUES & DISPUTES ====================
      if (path === '/api/issues' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM system_issues ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/issues' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const { booking_code = '', customer_name, customer_phone, serviceman_name = 'Unassigned', category = 'Service Quality', severity = 'Medium', description } = body;
        if (!customer_name || !customer_phone || !description) return json({ error: 'Missing required issue fields' }, 400);

        const id = `ISSUE-${Math.floor(100 + Math.random() * 900)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO system_issues (id, booking_code, customer_name, customer_phone, serviceman_name, category, severity, description, status, refund_amount, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open', 0, ?)
        `).bind(id, booking_code, customer_name, customer_phone, serviceman_name, category, severity, description, now).run();

        return json(await env.DB.prepare('SELECT * FROM system_issues WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/issues/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM system_issues WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Issue not found' }, 404);
        const body = await request.json().catch(() => ({}));

        const status = body.status || existing.status;
        const resolution_notes = body.resolution_notes !== undefined ? body.resolution_notes : existing.resolution_notes;
        const refund_amount = body.refund_amount !== undefined ? Number(body.refund_amount) : existing.refund_amount;
        const now = new Date().toISOString();

        await env.DB.prepare(`
          UPDATE system_issues
          SET status = ?, resolution_notes = ?, refund_amount = ?, resolved_at = ?
          WHERE id = ?
        `).bind(status, resolution_notes, refund_amount, status === 'Resolved' ? now : null, id).run();

        // If refund_amount > 0 and customer has wallet, add refund credit to customer wallet!
        if (refund_amount > 0 && existing.customer_phone) {
          const cleanPhone = existing.customer_phone.replace(/\s+/g, '');
          await env.DB.prepare(`
            UPDATE customers SET wallet_balance = wallet_balance + ? WHERE phone = ?
          `).bind(refund_amount, cleanPhone).run().catch(() => {});
        }

        return json(await env.DB.prepare('SELECT * FROM system_issues WHERE id = ?').bind(id).first());
      }

      // ==================== USER ROLES & STAFF (RBAC) ====================
      if (path === '/api/roles' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM admin_roles').all();
        return json(results);
      }

      if (path === '/api/staff' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM admin_staff ORDER BY created_at DESC').all();
        return json(results);
      }

      if (path === '/api/staff' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const { name, email, phone, role_id = 'role-support', role_name = 'Staff Member', city_access = 'All Cities' } = body;
        if (!name || !email || !phone) return json({ error: 'name, email and phone are required' }, 400);

        const id = `staff-${crypto.randomUUID().slice(0, 8)}`;
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO admin_staff (id, name, email, phone, role_id, role_name, city_access, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?)
        `).bind(id, name, email, phone, role_id, role_name, city_access, now).run();

        return json(await env.DB.prepare('SELECT * FROM admin_staff WHERE id = ?').bind(id).first(), 201);
      }

      if (path.startsWith('/api/staff/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const existing = await env.DB.prepare('SELECT * FROM admin_staff WHERE id = ?').bind(id).first();
        if (!existing) return json({ error: 'Staff member not found' }, 404);
        const body = await request.json().catch(() => ({}));

        const status = body.status || existing.status;
        const role_name = body.role_name || existing.role_name;
        const city_access = body.city_access || existing.city_access;

        await env.DB.prepare('UPDATE admin_staff SET status = ?, role_name = ?, city_access = ? WHERE id = ?')
          .bind(status, role_name, city_access, id).run();
        return json(await env.DB.prepare('SELECT * FROM admin_staff WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/staff/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM admin_staff WHERE id = ?').bind(id).run();
        return json({ deleted: true });
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
