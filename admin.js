(function () {
  const config = window.SITE_CONFIG || {};
  const state = {
    content: { version: 1, updatedAt: null, items: [] },
    editingId: null
  };

  const els = {};
  const fields = [
    'apiBaseUrl', 'adminToken', 'itemId', 'type', 'category', 'titleEn', 'titleAr',
    'labelEn', 'labelAr', 'descriptionEn', 'descriptionAr', 'tags', 'link',
    'duration', 'order', 'anchor', 'color', 'tagColor', 'featured', 'published', 'file', 'fileUrl',
    'objectKey', 'filterType'
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
    els.resetForm = document.getElementById('resetForm');
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

  function readForm() {
    const type = els.type.value;
    const id = els.itemId.value || `${type}-${Date.now()}`;
    const labelKey = labelFieldForType(type);
    const item = {
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
      objectKey: els.objectKey.value.trim()
    };
    item[labelKey] = localValue(els.labelEn.value, els.labelAr.value);
    Object.keys(item).forEach(key => {
      if (item[key] === '' || item[key] === 0 && key === 'duration') delete item[key];
    });
    return item;
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
    els.formTitle.textContent = 'Edit item';
    state.editingId = item.id;
  }

  function resetForm() {
    els.form.reset();
    els.type.value = 'voice';
    els.published.checked = true;
    els.itemId.value = '';
    els.order.value = state.content.items.length + 1;
    els.formTitle.textContent = 'Add item';
    state.editingId = null;
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
    form.append('file', els.file.files[0]);
    form.append('type', els.type.value);
    form.append('category', els.category.value || 'uncategorized');
    setStatus('Uploading...');
    const result = await api('/api/admin/upload', {
      method: 'POST',
      headers: authHeaders(),
      body: form
    });
    els.fileUrl.value = result.fileUrl || '';
    els.objectKey.value = result.objectKey || '';
    setStatus('Uploaded');
  }

  function upsertItem(event) {
    event.preventDefault();
    const item = readForm();
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
    els.resetForm.addEventListener('click', resetForm);
    els.form.addEventListener('submit', upsertItem);
    els.itemList.addEventListener('click', handleListClick);
    els.filterType.addEventListener('change', renderList);
  }

  document.addEventListener('DOMContentLoaded', wire);
})();
