function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      if (path === '/api/health') {
        return json({ ok: true, service: 'HomeServe Pro Cloudflare Worker', timestamp: new Date().toISOString() });
      }

      if (path === '/api/categories' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
        return json(results);
      }

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
        const { category_id, name, description = '', price, original_price = null, duration_mins = 45, warranty_days = 30, includes = [], is_popular = 0 } = body;
        if (!category_id || !name || !price) return json({ error: 'category_id, name and price are required' }, 400);

        const id = `srv-${crypto.randomUUID().slice(0, 8)}`;
        const includesStr = Array.isArray(includes) ? includes.join(',') : String(includes || '');
        await env.DB.prepare(`
          INSERT INTO services (id, category_id, name, description, price, original_price, duration_mins, warranty_days, includes, is_popular, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).bind(id, category_id, name, description, Number(price), original_price ? Number(original_price) : null, Number(duration_mins), Number(warranty_days), includesStr, is_popular ? 1 : 0).run();

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
        await env.DB.prepare('UPDATE services SET is_active = ?, price = ? WHERE id = ?').bind(is_active, price, id).run();
        return json(await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).first());
      }

      if (path.startsWith('/api/services/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
        return json({ deleted: true });
      }

      if (path === '/api/technicians' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM technicians ORDER BY jobs_completed DESC').all();
        return json(results);
      }

      if (path === '/api/technicians' && method === 'POST') {
        const { name, phone, specialty, city = 'Delhi NCR' } = await request.json();
        if (!name || !phone || !specialty) return json({ error: 'name, phone and specialty are required' }, 400);
        const id = `tech-${crypto.randomUUID().slice(0, 8)}`;
        await env.DB.prepare(`
          INSERT INTO technicians (id, name, phone, specialty, city, rating, jobs_completed, is_available, avatar_color)
          VALUES (?, ?, ?, ?, ?, 4.8, 0, 1, '#6366f1')
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

      if (path === '/api/bookings' && method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT b.*, t.name as technician_name, t.phone as technician_phone
          FROM bookings b
          LEFT JOIN technicians t ON b.technician_id = t.id
          ORDER BY b.created_at DESC
        `).all();
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

        const total_amount = items.reduce((s, it) => s + Number(it.price) * Number(it.qty || 1), 0);
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

      return env.ASSETS.fetch(request);
    } catch (err) {
      return json({ error: err.message || 'Internal error' }, 500);
    }
  }
};
