(function () {
  const config = window.SITE_CONFIG || {};
  let content = null;

  function apiBase() {
    return String(config.apiBaseUrl || localStorage.getItem('siteApiBaseUrl') || '').replace(/\/+$/, '');
  }

  function localize(value, locale) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[locale] || value.en || value.ar || Object.values(value)[0] || '';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function slug(value) {
    return String(value || 'item').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';
  }

  function sortedItems(type) {
    if (!content || !Array.isArray(content.items)) return [];
    return content.items
      .filter(item => item.type === type && item.published !== false)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  }

  function renderTags(tags, tone) {
    return (Array.isArray(tags) ? tags : [])
      .map(tag => `<span class="wtag ${tone}">${escapeHtml(tag)}</span>`)
      .join('');
  }

  function cardClass(item, index) {
    const value = item.color || '';
    if (value === 'maroon') return 'cm';
    if (value === 'navy') return 'cm';
    if (value === 'steel') return 'cc';
    if (value === 'gold') return 'cg';
    if (value === 'champagne') return 'cg';
    if (value === 'copper') return 'cw';
    if (value === 'dark') return 'cd';
    if (value === 'charcoal') return 'cd';
    if (value === 'light') return '';
    if (value === 'pearl') return '';
    return ['cm', '', 'cg', '', 'cm', 'cd'][index % 6];
  }

  function tagClass(item, fallbackCardClass) {
    const value = item.tagColor || '';
    if (value === 'maroon') return 'wtag-m';
    if (value === 'navy') return 'wtag-m';
    if (value === 'gold') return 'wtag-g';
    if (value === 'champagne') return 'wtag-g';
    if (value === 'steel') return 'wtag-s';
    if (value === 'copper') return 'wtag-c';
    if (value === 'light') return 'wtag-w';
    if (value === 'pearl') return 'wtag-w';
    if (fallbackCardClass === 'cg') return 'wtag-g';
    if (fallbackCardClass === '') return 'wtag-m';
    if (fallbackCardClass === 'cc') return 'wtag-s';
    if (fallbackCardClass === 'cw') return 'wtag-c';
    return 'wtag-w';
  }

  function sampleCard(item, index, locale) {
    const style = ['pc-light', 'pc-mid', 'pc-dark'][index % 3];
    const duration = Number(item.duration || 30);
    const minutes = Math.floor(duration / 60);
    const seconds = String(duration % 60).padStart(2, '0');
    const src = item.fileUrl ? ` src="${escapeHtml(item.fileUrl)}"` : '';
    return `
      <div class="pc ${style} r d${(index % 3) + 1}">
        <div class="pc-decor"></div>
        <div class="pc-label">${escapeHtml(localize(item.label || item.category, locale))}</div>
        <div class="pc-title">${escapeHtml(localize(item.title, locale))}</div>
        <div class="pc-sub">${escapeHtml(localize(item.sub || item.description, locale))}</div>
        <div class="wf" id="wf${index}"></div>
        <div class="prow">
          <span class="ptime" id="pt${index}">0:00</span>
          <button class="pbtn" data-idx="${index}" data-dur="${duration}" aria-label="Play sample"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
          <span class="pdur">${minutes}:${seconds}</span>
        </div>
        <audio id="audio${index}"${src} preload="none"></audio>
      </div>`;
  }

  function projectCard(item, index, locale) {
    const colorClass = cardClass(item, index);
    const tone = tagClass(item, colorClass);
    const href = item.link || item.fileUrl || 'index.html#contact';
    const id = item.anchor || slug(localize(item.title, 'en') || localize(item.title, locale));
    return `
      <div id="${escapeHtml(id)}" class="card ${colorClass} project-card r d${(index % 3) + 1}">
        <div>
          <div class="project-meta">${escapeHtml(localize(item.meta || item.category, locale))}</div>
          <div class="wt">${escapeHtml(localize(item.title, locale))}</div>
          <p class="project-desc">${escapeHtml(localize(item.description, locale))}</p>
        </div>
        <div class="wtags">${renderTags(item.tags, tone)}</div>
        <a href="${escapeHtml(href)}" class="btn-outline">${escapeHtml(localize(item.cta, locale) || 'Inquire')}</a>
      </div>`;
  }

  function renderSamples(locale) {
    const voices = sortedItems('voice');
    if (!voices.length) return;

    const library = document.querySelector('.sample-library');
    if (library) {
      library.innerHTML = voices.map((item, index) => sampleCard(item, index, locale)).join('');
      window.refreshInteractiveElements?.(library);
    }

    const featured = document.querySelector('.featured-samples');
    if (featured) {
      const items = voices.filter(item => item.featured !== false).slice(0, 2);
      featured.innerHTML = items.map((item, index) => sampleCard(item, index, locale)).join('');
      window.refreshInteractiveElements?.(featured);
    }
  }

  function renderProjects(locale) {
    const projects = sortedItems('project');
    if (!projects.length) return;

    const grid = document.querySelector('.project-grid');
    if (grid) {
      grid.innerHTML = projects.map((item, index) => projectCard(item, index, locale)).join('');
      window.refreshInteractiveElements?.(grid);
    }

    const featured = document.querySelector('.work-featured');
    const row = document.querySelector('.work-row');
    if (!featured || !row) return;

    const first = projects[0];
    const side = projects.slice(1, 3);
    const list = projects.slice(3, 6);
    const firstCardClass = cardClass(first, 0) || 'cm';
    const bigTone = tagClass(first, firstCardClass);
    featured.innerHTML = `
      <a href="${escapeHtml(first.link || first.fileUrl || 'projects.html')}" class="card ${firstCardClass} wf-big r d1">
        <div class="warrow">↗</div>
        <div class="wn">${escapeHtml(localize(first.meta || first.category, locale))}</div>
        <div class="wt"><span class="hw">${escapeHtml(localize(first.title, locale))}</span></div>
        <div class="wd">${escapeHtml(localize(first.description, locale))}</div>
        <div class="wtags">${renderTags(first.tags, bigTone)}</div>
      </a>
      <div class="wf-right">
        ${side.map((item, index) => `
          <a href="${escapeHtml(item.link || item.fileUrl || 'projects.html')}" class="card ${cardClass(item, index + 1)} wcard-sm r d${index + 2}">
            <div class="warrow">↗</div>
            <div class="wn">${escapeHtml(localize(item.meta || item.category, locale))}</div>
            <div class="wt">${escapeHtml(localize(item.title, locale))}</div>
            <div class="wtags">${renderTags(item.tags, tagClass(item, cardClass(item, index + 1)))}</div>
          </a>`).join('')}
      </div>`;
    row.innerHTML = list.map((item, index) => `
      <a href="${escapeHtml(item.link || item.fileUrl || 'projects.html')}" class="card ${cardClass(item, index + 3)} wcard-list r d${index + 1}">
        <div class="warrow">↗</div>
        <div class="wn">${escapeHtml(localize(item.meta || item.category, locale))}</div>
        <div class="wt">${escapeHtml(localize(item.title, locale))}</div>
        <div class="wtags">${renderTags(item.tags, tagClass(item, cardClass(item, index + 3)))}</div>
      </a>`).join('');
    window.refreshInteractiveElements?.(featured);
    window.refreshInteractiveElements?.(row);
  }

  async function load() {
    const base = apiBase();
    if (!base) return null;
    try {
      const response = await fetch(`${base}/api/content`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Content API returned ${response.status}`);
      content = await response.json();
      render(document.documentElement.lang || 'en');
      return content;
    } catch (error) {
      console.warn('Remote content is unavailable; using static page content.', error);
      return null;
    }
  }

  function render(locale) {
    if (!content) return;
    renderSamples(locale || 'en');
    renderProjects(locale || 'en');
  }

  window.SiteContent = { load, render, get data() { return content; } };
  load();
})();
