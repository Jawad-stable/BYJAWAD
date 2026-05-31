const DEFAULT_CONTENT_KEY = 'content/site-content.json';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      if (url.pathname === '/api/content' && request.method === 'GET') {
        const content = await readContent(env);
        return json(content, { headers: cors });
      }

      if (!url.pathname.startsWith('/api/admin/')) {
        return json({ error: 'Not found' }, { status: 404, headers: cors });
      }

      requireAdmin(request, env);

      if (url.pathname === '/api/admin/content' && request.method === 'GET') {
        const content = await readContent(env);
        return json(content, { headers: cors });
      }

      if (url.pathname === '/api/admin/content' && request.method === 'PUT') {
        const content = await request.json();
        validateContent(content);
        content.updatedAt = new Date().toISOString();
        await env.CONTENT_BUCKET.put(contentKey(env), JSON.stringify(content, null, 2), {
          httpMetadata: { contentType: 'application/json; charset=utf-8' }
        });
        return json({ ok: true, updatedAt: content.updatedAt }, { headers: cors });
      }

      if (url.pathname === '/api/admin/upload' && request.method === 'POST') {
        const result = await uploadFile(request, env);
        return json(result, { status: 201, headers: cors });
      }

      if (url.pathname === '/api/admin/object' && request.method === 'DELETE') {
        const key = url.searchParams.get('key');
        if (!key) return json({ error: 'Missing object key' }, { status: 400, headers: cors });
        await env.CONTENT_BUCKET.delete(key);
        return json({ ok: true }, { headers: cors });
      }

      return json({ error: 'Not found' }, { status: 404, headers: cors });
    } catch (error) {
      const status = error.status || 500;
      return json({ error: error.message || 'Server error' }, { status, headers: cors });
    }
  }
};

function contentKey(env) {
  return env.CONTENT_KEY || DEFAULT_CONTENT_KEY;
}

async function readContent(env) {
  const object = await env.CONTENT_BUCKET.get(contentKey(env));
  if (!object) {
    return {
      version: 1,
      updatedAt: null,
      items: []
    };
  }
  return object.json();
}

function validateContent(content) {
  if (!content || typeof content !== 'object') throw httpError(400, 'Content must be an object');
  if (!Array.isArray(content.items)) throw httpError(400, 'Content must include an items array');
  for (const item of content.items) {
    if (!item.id || !item.type) throw httpError(400, 'Every item needs id and type');
    if (!['voice', 'project', 'visual-id', 'social-post', 'video', 'asset'].includes(item.type)) throw httpError(400, `Invalid item type: ${item.type}`);
    if (item.type === 'voice' && item.published !== false && !item.fileUrl) {
      throw httpError(400, `Published voice item is missing fileUrl: ${item.id}`);
    }
  }
}

async function uploadFile(request, env) {
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') throw httpError(400, 'Missing file');

  const type = safeSegment(form.get('type') || 'asset');
  const category = safeSegment(form.get('category') || 'uncategorized');
  const filename = safeFilename(file.name || 'upload.bin');
  const objectKey = `uploads/${type}/${category}/${Date.now()}-${filename}`;

  await env.CONTENT_BUCKET.put(objectKey, file.stream(), {
    httpMetadata: {
      contentType: file.type || 'application/octet-stream'
    },
    customMetadata: {
      originalName: file.name || filename,
      uploadedAt: new Date().toISOString()
    }
  });

  return {
    ok: true,
    objectKey,
    fileUrl: publicUrl(env, objectKey),
    size: file.size,
    contentType: file.type || 'application/octet-stream'
  };
}

function publicUrl(env, objectKey) {
  const base = String(env.PUBLIC_ASSET_BASE_URL || '').replace(/\/+$/, '');
  if (!base) return '';
  return `${base}/${objectKey.split('/').map(encodeURIComponent).join('/')}`;
}

function requireAdmin(request, env) {
  if (!env.ADMIN_TOKEN) throw httpError(500, 'ADMIN_TOKEN is not configured');
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token !== env.ADMIN_TOKEN) throw httpError(401, 'Unauthorized');
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGIN || '*').split(',').map(item => item.trim()).filter(Boolean);
  const wildcard = allowed.includes('*');
  const headers = {
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  if (wildcard) {
    headers['Access-Control-Allow-Origin'] = origin || '*';
  } else if (origin && origin !== 'null' && allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function safeSegment(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'uncategorized';
}

function safeFilename(value) {
  const cleaned = String(value)
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  return cleaned || 'upload.bin';
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    }
  });
}
