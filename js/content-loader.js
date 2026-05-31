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
      .filter(item => type !== 'voice' || item.fileUrl)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  }

  function sortedItemsByTypes(types) {
    if (!content || !Array.isArray(content.items)) return [];
    return content.items
      .filter(item => types.includes(item.type) && item.published !== false)
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

  function videoMimeFor(url) {
    const ext = String(url || '').toLowerCase().split('?')[0].split('#')[0].split('.').pop();
    if (ext === 'webm') return 'video/webm';
    if (ext === 'ogv' || ext === 'ogg') return 'video/ogg';
    if (ext === 'mov') return 'video/quicktime';
    return 'video/mp4';
  }

  function isSafeUrl(url) {
    if (!url) return false;
    const trimmed = String(url).trim();
    return /^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(trimmed);
  }

  function toEmbedUrl(url) {
    if (!url) return '';
    if (!isSafeUrl(url)) return '';
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/')) return url;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return url;
  }

  // ── POPUP / LIGHTBOX ─────────────────────────────────
  let _popupTrigger = null;

  function openPopup(item, locale) {
    const popup = document.getElementById('work-popup');
    if (!popup) return;

    const eyebrow = document.getElementById('popup-eyebrow');
    const titleEl = document.getElementById('popup-title');
    const body = document.getElementById('popup-body');

    if (eyebrow) eyebrow.textContent = localize(item.meta || item.category, locale) || '';
    if (titleEl) titleEl.textContent = localize(item.title, locale) || '';

    body.className = 'popup-body';
    body.innerHTML = '';

    const rawUrl = item.fileUrl || (item.link && item.link.startsWith('http') ? item.link : '');
    const fileUrl = isSafeUrl(rawUrl) ? rawUrl : '';
    const embedUrl = toEmbedUrl(item.embedUrl || '');
    const isImageUrl = fileUrl && /\.(jpe?g|png|gif|webp|svg)([?#]|$)/i.test(fileUrl);
    const isVideoFile = fileUrl && /\.(mp4|webm|ogv|mov)([?#]|$)/i.test(fileUrl);
    const titleText = escapeHtml(localize(item.title, locale) || '');

    const showAsVideo = embedUrl || isVideoFile || (item.type === 'video' && !isImageUrl && fileUrl);

    if (showAsVideo) {
      if (embedUrl) {
        body.classList.add('is-video');
        body.innerHTML = `<iframe src="${escapeHtml(embedUrl)}" title="${titleText}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      } else {
        body.classList.add('is-video');
        body.innerHTML = `<video controls playsinline><source src="${escapeHtml(fileUrl)}" type="${escapeHtml(videoMimeFor(fileUrl))}"><p>Your browser does not support video playback.</p></video>`;
      }
    } else if (item.type === 'video' && !fileUrl) {
      body.innerHTML = '<p class="popup-no-media">No video attached yet. Add an embed URL or upload a file in the admin panel.</p>';
    } else if (isImageUrl) {
      body.classList.add('is-image');
      body.innerHTML = `<img src="${escapeHtml(fileUrl)}" alt="${titleText}">`;
    } else if (fileUrl) {
      body.innerHTML = `<iframe src="${escapeHtml(fileUrl)}" title="${titleText || 'Document'}"></iframe>`;
    } else {
      body.innerHTML = '<p class="popup-no-media">No file attached yet. Upload a file in the admin panel.</p>';
    }

    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('popup-close')?.focus(), 60);
  }

  function closePopup() {
    const popup = document.getElementById('work-popup');
    if (!popup || popup.hidden) return;
    const body = document.getElementById('popup-body');
    if (body) body.innerHTML = '';
    popup.hidden = true;
    document.body.style.overflow = '';
    if (_popupTrigger) { _popupTrigger.focus(); _popupTrigger = null; }
  }

  function initPopup() {
    document.getElementById('popup-close')?.addEventListener('click', closePopup);
    document.getElementById('popup-backdrop')?.addEventListener('click', closePopup);

    document.addEventListener('keydown', e => {
      const popup = document.getElementById('work-popup');
      if (e.key === 'Escape' && popup && !popup.hidden) closePopup();
    });

    document.addEventListener('keydown', e => {
      const popup = document.getElementById('work-popup');
      if (!popup || popup.hidden || e.key !== 'Tab') return;
      const focusable = Array.from(popup.querySelectorAll(
        'button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    document.addEventListener('click', e => {
      const trigger = e.target.closest('.popup-trigger');
      if (!trigger) return;
      const id = trigger.dataset.itemId;
      if (!id) return;
      const item = content?.items?.find(i => i.id === id);
      if (!item) return;
      _popupTrigger = trigger;
      openPopup(item, document.documentElement.lang || 'en');
    });
  }

  // ── CARD RENDERERS ────────────────────────────────────

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
    const rawUrl = item.link || item.fileUrl || '';
    const safeUrl = isSafeUrl(rawUrl) ? rawUrl : '';
    const hasFile = !!(safeUrl && !safeUrl.includes('#contact') && !safeUrl.includes('index.html'));
    const id = item.anchor || slug(localize(item.title, 'en') || localize(item.title, locale));
    const fileType = item.fileUrl ? item.fileUrl.split('?')[0].split('.').pop().toUpperCase().slice(0, 4) : '';
    const fileBadge = (hasFile && fileType) ? `<span class="file-badge">${escapeHtml(fileType)}</span>` : '';
    const ctaLabel = escapeHtml(localize(item.cta, locale) || (hasFile ? 'Open' : 'Inquire'));
    const ctaHref = hasFile ? safeUrl : 'index.html#contact';
    const ctaAttrs = hasFile ? ' target="_blank" rel="noopener noreferrer"' : '';
    const ctaHtml = `<a href="${escapeHtml(ctaHref)}" class="btn-outline"${ctaAttrs}>${ctaLabel}</a>`;
    return `
      <div id="${escapeHtml(id)}" class="card ${colorClass} project-card r d${(index % 3) + 1}">
        <div>
          <div class="project-meta">${escapeHtml(localize(item.meta || item.category, locale))}${fileBadge}</div>
          <div class="wt">${escapeHtml(localize(item.title, locale))}</div>
          <p class="project-desc">${escapeHtml(localize(item.description, locale))}</p>
        </div>
        <div class="wtags">${renderTags(item.tags, tone)}</div>
        ${ctaHtml}
      </div>`;
  }

  function visualIdCard(item, index, locale) {
    const colorClass = cardClass(item, index);
    const tone = tagClass(item, colorClass);
    const rawUrl = item.fileUrl || (item.link && item.link.startsWith('http') ? item.link : '');
    const fileUrl = isSafeUrl(rawUrl) ? rawUrl : '';
    const hasFile = !!fileUrl;
    const id = item.anchor || slug(localize(item.title, 'en') || localize(item.title, locale));
    const fileType = item.fileUrl ? item.fileUrl.split('?')[0].split('.').pop().toUpperCase().slice(0, 4) : '';
    const fileBadge = (hasFile && fileType) ? `<span class="file-badge">${escapeHtml(fileType)}</span>` : '';
    const titleText = escapeHtml(localize(item.title, locale) || '');

    if (hasFile) {
      return `
        <button type="button" id="${escapeHtml(id)}" class="card ${colorClass} project-card popup-trigger r d${(index % 3) + 1}" data-item-id="${escapeHtml(item.id)}" aria-label="Open ${titleText}">
          <div>
            <div class="project-meta">${escapeHtml(localize(item.meta || item.category, locale))}${fileBadge}</div>
            <div class="wt">${titleText}</div>
            <p class="project-desc">${escapeHtml(localize(item.description, locale))}</p>
          </div>
          <div class="wtags">${renderTags(item.tags, tone)}</div>
        </button>`;
    }
    return `
      <div id="${escapeHtml(id)}" class="card ${colorClass} project-card r d${(index % 3) + 1}">
        <div>
          <div class="project-meta">${escapeHtml(localize(item.meta || item.category, locale))}</div>
          <div class="wt">${titleText}</div>
          <p class="project-desc">${escapeHtml(localize(item.description, locale))}</p>
        </div>
        <div class="wtags">${renderTags(item.tags, tone)}</div>
      </div>`;
  }

  function socialPostCard(item, index, locale) {
    const rawUrl = item.fileUrl || item.link || '';
    const fileUrl = isSafeUrl(rawUrl) ? rawUrl : '';
    const embedUrl = toEmbedUrl(item.embedUrl || '');
    const hasMedia = !!(fileUrl || embedUrl);
    const isImage = fileUrl && /\.(jpe?g|png|gif|webp|svg)([?#]|$)/i.test(fileUrl);
    const catText = localize(item.category || item.label, locale) || '';
    const titleText = localize(item.title, locale) || '';
    const thumbHtml = isImage
      ? `<img class="post-thumb" src="${escapeHtml(fileUrl)}" alt="" aria-hidden="true" loading="lazy">`
      : `<div class="post-placeholder" aria-hidden="true">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><polyline fill="none" stroke="currentColor" stroke-width="2" points="14 2 14 8 20 8"/></svg>
           <span>${escapeHtml(catText || titleText)}</span>
         </div>`;
    const inner = `${thumbHtml}
        <div class="post-overlay" aria-hidden="true">
          ${catText ? `<div class="post-overlay-cat">${escapeHtml(catText)}</div>` : ''}
          <div class="post-overlay-title">${escapeHtml(titleText)}</div>
        </div>`;
    if (hasMedia) {
      return `
      <button type="button" class="post-item r d${(index % 4) + 1} popup-trigger"
              data-item-id="${escapeHtml(item.id)}"
              aria-label="${escapeHtml(titleText)}${catText ? ' — ' + escapeHtml(catText) : ''}, click to view">
        ${inner}
      </button>`;
    }
    return `<div class="post-item r d${(index % 4) + 1}" aria-label="${escapeHtml(titleText)}">${inner}</div>`;
  }

  function videoCard(item, index, locale) {
    const thumbUrl = item.thumbnailUrl || (item.fileUrl && /\.(jpe?g|png|gif|webp)([?#]|$)/i.test(item.fileUrl) ? item.fileUrl : '');
    const catText = localize(item.meta || item.category, locale) || 'Video';
    const titleText = localize(item.title, locale) || '';
    const embedUrl = toEmbedUrl(item.embedUrl || '');
    const hasMedia = !!(embedUrl || item.fileUrl);
    const playIcon = `<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>`;
    const thumbInner = thumbUrl
      ? `<img src="${escapeHtml(thumbUrl)}" alt="" aria-hidden="true" loading="lazy">
         <div class="video-play-overlay"><div class="video-play-icon">${playIcon}</div></div>`
      : `<div class="video-thumb-bg"><div class="video-play-icon">${playIcon}</div></div>`;
    const inner = `
        <div class="video-thumb">${thumbInner}</div>
        <div class="video-info">
          <div class="video-cat">${escapeHtml(catText)}</div>
          <div class="video-title">${escapeHtml(titleText)}</div>
        </div>`;
    if (hasMedia) {
      return `
      <button type="button" class="video-card r d${(index % 3) + 1} popup-trigger"
              data-item-id="${escapeHtml(item.id)}"
              aria-label="Play video: ${escapeHtml(titleText)}">${inner}
      </button>`;
    }
    return `<div class="video-card r d${(index % 3) + 1}" aria-label="${escapeHtml(titleText)}">${inner}</div>`;
  }

  // ── PAGE RENDERERS ────────────────────────────────────

  function renderSamples(locale) {
    const voices = sortedItems('voice');
    if (!voices.length) return;

    window.resetAudioPlayers?.();

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

  function renderVisualIds(locale) {
    const grid = document.getElementById('visual-id-grid');
    if (!grid) return;
    const items = sortedItemsByTypes(['project', 'visual-id']);
    if (!items.length) return;
    grid.innerHTML = items.map((item, index) => visualIdCard(item, index, locale)).join('');
    window.refreshInteractiveElements?.(grid);
  }

  function renderSocialPosts(locale) {
    const grid = document.getElementById('social-posts-grid');
    if (!grid) return;
    const items = sortedItems('social-post');
    if (!items.length) return;
    grid.innerHTML = items.map((item, index) => socialPostCard(item, index, locale)).join('');
    window.refreshInteractiveElements?.(grid);
  }

  function renderVideos(locale) {
    const grid = document.getElementById('video-grid');
    if (!grid) return;
    const items = sortedItems('video');
    if (!items.length) return;
    grid.innerHTML = items.map((item, index) => videoCard(item, index, locale)).join('');
    window.refreshInteractiveElements?.(grid);
  }

  // ── LOAD & RENDER ────────────────────────────────────

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

  function applyProjectsComingSoon(comingSoon) {
    const banner = document.getElementById('projects-coming-soon');
    const catNav = document.getElementById('projects-cat-nav');
    const main = document.getElementById('main-content');
    if (banner) banner.hidden = !comingSoon;
    if (catNav) catNav.hidden = !!comingSoon;
    if (main) main.hidden = !!comingSoon;
  }

  function render(locale) {
    if (!content) return;
    const page = document.body.dataset.page;
    if (page === 'projects') {
      const comingSoon = content.projectsComingSoon !== false;
      applyProjectsComingSoon(comingSoon);
      if (comingSoon) return;
      renderVisualIds(locale || 'en');
      renderSocialPosts(locale || 'en');
      renderVideos(locale || 'en');
    } else {
      renderSamples(locale || 'en');
      renderProjects(locale || 'en');
    }
  }

  window.SiteContent = { load, render, get data() { return content; } };

  initPopup();
  load();
})();
