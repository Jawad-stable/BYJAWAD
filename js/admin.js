(function () {
  const config = window.SITE_CONFIG || {};
  const state = {
    content: { version: 1, updatedAt: null, items: [] },
    editingId: null,
    pages: [],
    pdfMeta: null,
    // True once a file is uploaded in this edit: the stored page images and PDF
    // link belong to the old file and must not ride along on the new one.
    fileReplaced: false
  };

  // A PDF in a browser tab is a download prompt on most phones, so every uploaded
  // PDF is also rendered to WEBP page images here and the item carries both: the
  // page images the site shows, and the original PDF as a download link.
  const PDF_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
  const PDF_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
  const PAGE_MAX_WIDTH = 1600;
  const PAGE_MAX_HEIGHT = 2200;
  const PAGE_QUALITY = 0.8;

  const els = {};
  const fields = [
    'apiBaseUrl', 'adminToken', 'itemId', 'type', 'category', 'titleEn', 'titleAr',
    'labelEn', 'labelAr', 'descriptionEn', 'descriptionAr', 'tags', 'link',
    'duration', 'order', 'anchor', 'color', 'tagColor', 'featured', 'published', 'file', 'fileUrl',
    'objectKey', 'filterType', 'embedUrl'
  ];

  function initEls() {
    fields.forEach(id => { els[id] = document.getElementById(id); });
    els.status = document.getElementById('status');
    els.form = document.getElementById('itemForm');
    els.formTitle = document.getElementById('formTitle');
    els.itemList = document.getElementById('itemList');
    els.loadContent = document.getElementById('loadContent');
    els.saveContent = document.getElementById('saveContent');
    els.uploadFile = document.getElementById('uploadFile');
    els.quickPublish = document.getElementById('quickPublish');
    els.resetForm = document.getElementById('resetForm');
    els.toggleComingSoon = document.getElementById('toggleComingSoon');
    els.comingSoonStatus = document.getElementById('comingSoonStatus');
  }

  function isComingSoon() {
    return state.content.projectsComingSoon !== false;
  }

  function refreshComingSoonUi() {
    if (!els.toggleComingSoon || !els.comingSoonStatus) return;
    const loaded = state.content && Array.isArray(state.content.items);
    els.toggleComingSoon.disabled = !loaded;
    if (!loaded) {
      els.comingSoonStatus.textContent = 'Load content first';
      els.toggleComingSoon.textContent = 'Toggle Projects page mode';
      return;
    }
    const coming = isComingSoon();
    els.comingSoonStatus.textContent = coming ? 'Currently: Coming Soon' : 'Currently: Full projects page';
    els.toggleComingSoon.textContent = coming ? 'Show full projects page' : 'Switch to Coming Soon';
  }

  async function toggleComingSoon() {
    if (!state.content || !Array.isArray(state.content.items)) {
      setStatus('Load content first.');
      return;
    }
    const next = !isComingSoon();
    state.content.projectsComingSoon = next;
    setStatus(next ? 'Switching to Coming Soon...' : 'Switching to full projects page...');
    await saveContent(next ? 'Coming Soon mode is live' : 'Full projects page is live');
    refreshComingSoonUi();
  }

  function apiBase() {
    return String(els.apiBaseUrl.value || config.apiBaseUrl || '').replace(/\/+$/, '');
  }

  function setStatus(message) {
    els.status.textContent = message;
  }

  function authHeaders(extra = {}) {
    const token = els.adminToken.value.trim();
    if (!token) throw new Error('Admin token is required.');
    return { Authorization: `Bearer ${token}`, ...extra };
  }

  async function api(path, options = {}) {
    const base = apiBase();
    if (!base) throw new Error('API base URL is required.');
    const response = await fetch(`${base}${path}`, options);
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(data?.error || `Request failed with ${response.status}`);
    return data;
  }

  function localValue(en, ar) {
    const value = {};
    if (en.trim()) value.en = en.trim();
    if (ar.trim()) value.ar = ar.trim();
    return value;
  }

  function labelFieldForType(type) {
    return type === 'project' ? 'meta' : 'label';
  }

  function cleanTitleFromFilename(name) {
    return String(name || '')
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function inferTypeFromFile(file) {
    if (!file) return els.type.value;
    if (file.type.startsWith('audio/')) return 'voice';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'social-post';
    if (file.type === 'application/pdf') return 'visual-id';
    return 'project';
  }

  function isPdfFile(file) {
    return !!file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name || ''));
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'document';
  }

  let pdfLibPromise = null;
  function loadPdfLib() {
    if (!pdfLibPromise) {
      pdfLibPromise = (async () => {
        const lib = await import(PDF_LIB_URL);
        // A Worker script has to be same-origin no matter what CORS says, so the
        // worker comes across as a blob rather than straight from the CDN.
        const source = await fetch(PDF_WORKER_URL);
        if (!source.ok) throw new Error(`Could not load the PDF worker (${source.status})`);
        lib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(await source.blob());
        return lib;
      })();
    }
    return pdfLibPromise;
  }

  function encodeCanvas(canvas) {
    // Safari only learned to encode WEBP recently; JPEG keeps older browsers working.
    return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/webp', PAGE_QUALITY))
      .then(blob => (blob && blob.type === 'image/webp')
        ? { blob, ext: 'webp' }
        : new Promise(resolve => canvas.toBlob(jpeg => resolve({ blob: jpeg, ext: 'jpg' }), 'image/jpeg', 0.85)));
  }

  async function renderPdfPages(file, onProgress) {
    const lib = await loadPdfLib();
    const document_ = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = [];
    for (let number = 1; number <= document_.numPages; number += 1) {
      const page = await document_.getPage(number);
      const unscaled = page.getViewport({ scale: 1 });
      const scale = Math.min(PAGE_MAX_WIDTH / unscaled.width, PAGE_MAX_HEIGHT / unscaled.height, 4);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff'; // pages with no background would otherwise go transparent
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport }).promise;
      const encoded = await encodeCanvas(canvas);
      pages.push({ blob: encoded.blob, ext: encoded.ext, number, w: canvas.width, h: canvas.height });
      onProgress?.(number, document_.numPages);
    }
    return pages;
  }

  async function uploadPdfPages(file, images) {
    const folder = `${slugify(els.titleEn.value || file.name)}-pages`;
    const uploaded = [];
    for (const image of images) {
      const name = `page-${String(image.number).padStart(2, '0')}.${image.ext}`;
      const form = new FormData();
      form.append('file', new File([image.blob], name, { type: image.blob.type }));
      form.append('type', els.type.value || 'visual-id');
      form.append('category', folder);
      const result = await api('/api/admin/upload', { method: 'POST', headers: authHeaders(), body: form });
      uploaded.push({ url: result.fileUrl, w: image.w, h: image.h });
      setStatus(`Uploading page images ${uploaded.length}/${images.length}...`);
    }
    return uploaded;
  }

  function detectAudioDuration(file) {
    return new Promise(resolve => {
      if (!file || !file.type.startsWith('audio/')) {
        resolve(0);
        return;
      }
      const audio = document.createElement('audio');
      const url = URL.createObjectURL(file);
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(Math.round(audio.duration || 0));
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      audio.src = url;
    });
  }

  function readForm() {
    const type = els.type.value;
    const id = els.itemId.value || `${type}-${Date.now()}`;
    const labelKey = labelFieldForType(type);
    // Start from the stored item so fields this form does not expose — page
    // images, pdfUrl, video dimensions — survive an edit.
    const existing = state.content.items.find(entry => entry.id === id) || {};
    const item = {
      ...existing,
      id,
      type,
      category: els.category.value.trim(),
      title: localValue(els.titleEn.value, els.titleAr.value),
      description: localValue(els.descriptionEn.value, els.descriptionAr.value),
      tags: els.tags.value.split(',').map(tag => tag.trim()).filter(Boolean),
      link: els.link.value.trim(),
      duration: Number(els.duration.value || 0),
      order: Number(els.order.value || state.content.items.length + 1),
      anchor: els.anchor.value.trim(),
      color: els.color.value,
      tagColor: els.tagColor.value,
      featured: els.featured.checked,
      published: els.published.checked,
      fileUrl: els.fileUrl.value.trim(),
      objectKey: els.objectKey.value.trim(),
      embedUrl: els.embedUrl.value.trim()
    };
    item[labelKey] = localValue(els.labelEn.value, els.labelAr.value);
    if (state.fileReplaced) {
      delete item.pages;
      delete item.pdfUrl;
      delete item.pdfSize;
    }
    if (state.pages.length) {
      item.pages = state.pages;
      if (state.pdfMeta) {
        item.pdfUrl = state.pdfMeta.pdfUrl;
        item.pdfSize = state.pdfMeta.pdfSize;
      }
    }
    Object.keys(item).forEach(key => {
      if (item[key] === '' || item[key] === 0 && key === 'duration') delete item[key];
    });
    return item;
  }

  function validateItem(item) {
    if (!item.title?.en && !item.title?.ar) {
      throw new Error('Add a title first.');
    }
    if (item.type === 'voice' && !item.fileUrl) {
      throw new Error('Voice samples need an uploaded audio file.');
    }
    if (item.published !== false) {
      if (item.type === 'video' && !item.fileUrl && !item.embedUrl) {
        throw new Error('Published videos need a file upload or an embed URL.');
      }
      if ((item.type === 'social-post' || item.type === 'visual-id') && !item.fileUrl && !item.pages?.length) {
        throw new Error(`Published ${item.type} items need an uploaded file.`);
      }
    }
  }

  function fillForm(item) {
    const label = item.label || item.meta || {};
    els.itemId.value = item.id || '';
    els.type.value = item.type || 'voice';
    els.category.value = item.category || '';
    els.titleEn.value = item.title?.en || '';
    els.titleAr.value = item.title?.ar || '';
    els.labelEn.value = label.en || '';
    els.labelAr.value = label.ar || '';
    els.descriptionEn.value = item.description?.en || item.sub?.en || '';
    els.descriptionAr.value = item.description?.ar || item.sub?.ar || '';
    els.tags.value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
    els.link.value = item.link || '';
    els.duration.value = item.duration || '';
    els.order.value = item.order || '';
    els.anchor.value = item.anchor || '';
    els.color.value = item.color || '';
    els.tagColor.value = item.tagColor || '';
    els.featured.checked = Boolean(item.featured);
    els.published.checked = item.published !== false;
    els.fileUrl.value = item.fileUrl || '';
    els.objectKey.value = item.objectKey || '';
    els.embedUrl.value = item.embedUrl || '';
    els.formTitle.textContent = 'Edit item';
    state.editingId = item.id;
    state.pages = [];
    state.pdfMeta = null;
    state.fileReplaced = false;
  }

  function resetForm() {
    els.form.reset();
    els.type.value = 'voice';
    els.published.checked = true;
    els.itemId.value = '';
    els.embedUrl.value = '';
    els.order.value = state.content.items.length + 1;
    els.formTitle.textContent = 'Add item';
    state.editingId = null;
    state.pages = [];
    state.pdfMeta = null;
    state.fileReplaced = false;
  }

  function itemTitle(item) {
    return item.title?.en || item.title?.ar || item.id || 'Untitled';
  }

  function renderList() {
    const filter = els.filterType.value;
    const items = state.content.items
      .slice()
      .filter(item => filter === 'all' || item.type === filter)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    els.itemList.innerHTML = items.map(item => `
      <article class="item-row${item.published === false ? ' is-hidden' : ''}" data-id="${item.id}">
        <header>
          <div>
            <div class="item-title">${escapeHtml(itemTitle(item))}</div>
            <div class="item-meta">${escapeHtml(item.type || '')} / ${escapeHtml(item.category || 'Uncategorized')} / order ${item.order || 0}${item.published === false ? ' / hidden' : ''}</div>
          </div>
        </header>
        <div class="item-actions">
          <button type="button" data-action="edit">Edit</button>
          <button type="button" data-action="up">Up</button>
          <button type="button" data-action="down">Down</button>
          <button type="button" data-action="toggle">${item.published === false ? 'Publish' : 'Hide'}</button>
          <button type="button" class="danger" data-action="delete">Delete</button>
        </div>
      </article>`).join('') || '<p class="item-meta">No items yet.</p>';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeOrders() {
    state.content.items
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .forEach((item, index) => { item.order = index + 1; });
  }

  async function loadContent() {
    localStorage.setItem('siteApiBaseUrl', apiBase());
    localStorage.setItem('portfolioAdminApiBaseUrl', apiBase());
    sessionStorage.setItem('portfolioAdminToken', els.adminToken.value);
    setStatus('Loading...');
    state.content = await api('/api/admin/content', { headers: authHeaders() });
    if (!Array.isArray(state.content.items)) state.content.items = [];
    normalizeOrders();
    renderList();
    resetForm();
    refreshComingSoonUi();
    setStatus('Connected');
  }

  async function saveContent(statusMessage = 'Saved') {
    normalizeOrders();
    state.content.updatedAt = new Date().toISOString();
    await api('/api/admin/content', {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(state.content)
    });
    renderList();
    setStatus(statusMessage);
  }

  async function uploadFile() {
    if (!els.file.files.length) throw new Error('Choose a file first.');
    const form = new FormData();
    const file = els.file.files[0];
    form.append('file', file);
    form.append('type', els.type.value || inferTypeFromFile(file));
    form.append('category', els.category.value || 'uncategorized');
    setStatus('Uploading...');
    const result = await api('/api/admin/upload', {
      method: 'POST',
      headers: authHeaders(),
      body: form
    });
    if (!result || !result.fileUrl) {
      throw new Error('Upload completed but the server returned no file URL. Check the worker PUBLIC_ASSET_BASE_URL env var.');
    }
    els.fileUrl.value = result.fileUrl;
    els.objectKey.value = result.objectKey || '';
    if (state.editingId) els.itemId.value = state.editingId;
    state.pages = [];
    state.pdfMeta = null;
    state.fileReplaced = true;

    if (isPdfFile(file)) {
      try {
        setStatus('Rendering PDF pages...');
        const images = await renderPdfPages(file, (number, total) => setStatus(`Rendering page ${number}/${total}...`));
        state.pages = await uploadPdfPages(file, images);
        state.pdfMeta = { pdfUrl: result.fileUrl, pdfSize: file.size };
        setStatus(`Uploaded — ${state.pages.length} page images ready`);
      } catch (error) {
        // The PDF itself is already safe in R2; the item just falls back to a link.
        setStatus(`Uploaded the PDF, but the page images failed: ${error.message}`);
      }
      return result;
    }

    setStatus('Uploaded');
    return result;
  }

  async function handleFileSelected() {
    const file = els.file.files[0];
    if (!file) return;
    if (!els.type.value || els.type.value === 'voice') els.type.value = inferTypeFromFile(file);
    if (!els.titleEn.value.trim()) els.titleEn.value = cleanTitleFromFilename(file.name);
    if (!els.category.value.trim()) els.category.value = file.type.startsWith('audio/') ? 'Voice Sample' : 'Project';
    const duration = await detectAudioDuration(file);
    if (duration) els.duration.value = duration;
  }

  async function quickPublish() {
    const file = els.file.files[0];
    if (!file) throw new Error('Choose a file first.');
    await handleFileSelected();
    if (!els.titleEn.value.trim() && !els.titleAr.value.trim()) {
      els.titleEn.value = cleanTitleFromFilename(file.name);
    }
    const upload = await uploadFile();
    const item = readForm();
    item.fileUrl = upload.fileUrl || item.fileUrl;
    item.objectKey = upload.objectKey || item.objectKey;
    if (item.type === 'project' || item.type === 'visual-id') item.link = item.fileUrl;
    item.published = true;
    validateItem(item);
    const index = state.content.items.findIndex(existing => existing.id === item.id);
    if (index >= 0) state.content.items[index] = item;
    else state.content.items.push(item);
    normalizeOrders();
    await saveContent('Uploaded and published');
    resetForm();
  }

  function upsertItem(event) {
    event.preventDefault();
    const item = readForm();
    try {
      validateItem(item);
    } catch (error) {
      setStatus(error.message);
      return;
    }
    const index = state.content.items.findIndex(existing => existing.id === item.id);
    if (index >= 0) state.content.items[index] = item;
    else state.content.items.push(item);
    normalizeOrders();
    renderList();
    resetForm();
    setStatus('Unsaved changes');
  }

  function moveItem(id, direction) {
    normalizeOrders();
    const index = state.content.items.findIndex(item => item.id === id);
    const otherIndex = index + direction;
    if (index < 0 || otherIndex < 0 || otherIndex >= state.content.items.length) return;
    const current = state.content.items[index].order;
    state.content.items[index].order = state.content.items[otherIndex].order;
    state.content.items[otherIndex].order = current;
    normalizeOrders();
    renderList();
    setStatus('Unsaved changes');
  }

  async function handleListClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const row = button.closest('.item-row');
    const id = row?.dataset.id;
    const item = state.content.items.find(entry => entry.id === id);
    if (!item) return;

    try {
      button.disabled = true;
      if (button.dataset.action === 'edit') fillForm(item);
      if (button.dataset.action === 'up') moveItem(id, -1);
      if (button.dataset.action === 'down') moveItem(id, 1);
      if (button.dataset.action === 'toggle') {
        item.published = item.published === false ? true : false;
        renderList();
        setStatus(item.published === false ? 'Hiding...' : 'Publishing...');
        await saveContent(item.published === false ? 'Hidden and saved' : 'Published and saved');
      }
      if (button.dataset.action === 'delete') {
        state.content.items = state.content.items.filter(entry => entry.id !== id);
        normalizeOrders();
        renderList();
        setStatus('Unsaved changes');
      }
    } catch (error) {
      setStatus(error.message);
      renderList();
    }
  }

  function wire() {
    initEls();
    els.apiBaseUrl.value = localStorage.getItem('portfolioAdminApiBaseUrl') || config.apiBaseUrl || '';
    els.adminToken.value = sessionStorage.getItem('portfolioAdminToken') || '';
    resetForm();
    renderList();

    els.loadContent.addEventListener('click', () => loadContent().catch(error => setStatus(error.message)));
    els.saveContent.addEventListener('click', () => saveContent().catch(error => setStatus(error.message)));
    els.uploadFile.addEventListener('click', () => uploadFile().catch(error => setStatus(error.message)));
    els.quickPublish.addEventListener('click', () => quickPublish().catch(error => setStatus(error.message)));
    els.file.addEventListener('change', () => handleFileSelected().catch(error => setStatus(error.message)));
    els.resetForm.addEventListener('click', resetForm);
    els.form.addEventListener('submit', upsertItem);
    els.itemList.addEventListener('click', handleListClick);
    els.filterType.addEventListener('change', renderList);
    els.toggleComingSoon?.addEventListener('click', () => toggleComingSoon().catch(error => setStatus(error.message)));
    refreshComingSoonUi();
  }

  document.addEventListener('DOMContentLoaded', wire);
})();
