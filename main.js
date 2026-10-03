// ── Site metadata ─────────────────────────────────────────────────────────────

const ARTICLE_INDEX_URL = 'articles.json?v=20261003-pinned-sort';

const CATEGORY_LABELS = {
  finance: '理财',
  journey: '旅途',
  emotion: '情感',
  bookmovie: '书影'
};

const state = {
  articles: [],
  currentCategory: 'all',
  sortOrder: 'desc'
};

// ── Utilities ────────────────────────────────────────────────────────────────

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseDateValue(date) {
  const timestamp = Date.parse(date || '');
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

async function fetchJson(url) {
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function normalizeArticle(article, index = 0) {
  return {
    title: article.title || '无题',
    category: article.category || '',
    date: article.date || '',
    excerpt: article.excerpt || '',
    tags: Array.isArray(article.tags) ? article.tags : [],
    src: article.src || '',
    pinned: Boolean(article.pinned),
    originalIndex: index
  };
}

function getVisibleArticles() {
  return state.articles
    .filter(article => state.currentCategory === 'all' || article.category === state.currentCategory)
    .slice()
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

      const diff = parseDateValue(b.date) - parseDateValue(a.date);
      if (diff === 0) return a.originalIndex - b.originalIndex;
      return state.sortOrder === 'desc' ? diff : -diff;
    });
}

// ── Rendering ────────────────────────────────────────────────────────────────

function renderArticleCard(article) {
  const label = CATEGORY_LABELS[article.category] || article.category;
  const href = `article.html?src=${encodeURIComponent(article.src)}`;
  const pinnedBadge = article.pinned ? '<span class="pin-badge">置顶</span>' : '';

  return `
    <article class="card" data-cat="${escapeHtml(article.category)}">
      <a href="${href}" class="card-link">
        <div class="card-meta">
          <span class="cat-badge ${escapeHtml(article.category)}">${escapeHtml(label)}</span>
          <span class="date">${escapeHtml(article.date)}</span>
        </div>
        <h2 class="card-title">${pinnedBadge}${escapeHtml(article.title)}</h2>
        <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>
        <div class="tag-row">
          ${article.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      </a>
    </article>`;
}

function renderArticles() {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;

  const visibleArticles = getVisibleArticles();
  if (!visibleArticles.length) {
    grid.innerHTML = '<p class="article-loading">暂无文章</p>';
    return;
  }

  grid.innerHTML = visibleArticles.map(renderArticleCard).join('');
}

function renderLoadError(message) {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="article-loading">
      <p>文章列表加载失败：${escapeHtml(message)}</p>
      <p style="margin-top: 10px; font-size: .86rem; color: #999;">
        如果是在本地直接打开文件，请使用 <code>python3 -m http.server 8080</code> 启动本地服务。
      </p>
    </div>`;
}

// ── Controls ─────────────────────────────────────────────────────────────────

function initCategoryFilter() {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.dataset.cat || 'all';
      renderArticles();
    });
  });
}

function initSortControl() {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.sortOrder = btn.dataset.sort || 'desc';
      renderArticles();
    });
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

async function initHomePage() {
  initCategoryFilter();
  initSortControl();

  try {
    const articles = await fetchJson(ARTICLE_INDEX_URL);
    state.articles = articles.map(normalizeArticle);
    renderArticles();
  } catch (e) {
    renderLoadError(e.message);
  }
}

document.addEventListener('DOMContentLoaded', initHomePage);
