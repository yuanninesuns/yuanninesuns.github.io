// ── Site metadata ─────────────────────────────────────────────────────────────

const ARTICLE_INDEX_URL = 'articles.json?v=20261003-articles-json';

const CATEGORY_LABELS = {
  finance: '理财',
  journey: '旅途',
  emotion: '情感',
  bookmovie: '书影'
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

async function fetchJson(url) {
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function normalizeArticle(article) {
  return {
    title: article.title || '无题',
    category: article.category || '',
    date: article.date || '',
    excerpt: article.excerpt || '',
    tags: Array.isArray(article.tags) ? article.tags : [],
    src: article.src || ''
  };
}

// ── Rendering ────────────────────────────────────────────────────────────────

function renderArticleCard(article) {
  const item = normalizeArticle(article);
  const label = CATEGORY_LABELS[item.category] || item.category;
  const href = `article.html?src=${encodeURIComponent(item.src)}`;

  return `
    <article class="card" data-cat="${escapeHtml(item.category)}">
      <a href="${href}" class="card-link">
        <div class="card-meta">
          <span class="cat-badge ${escapeHtml(item.category)}">${escapeHtml(label)}</span>
          <span class="date">${escapeHtml(item.date)}</span>
        </div>
        <h2 class="card-title">${escapeHtml(item.title)}</h2>
        <p class="card-excerpt">${escapeHtml(item.excerpt)}</p>
        <div class="tag-row">
          ${item.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      </a>
    </article>`;
}

function renderArticles(articles) {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;

  if (!articles.length) {
    grid.innerHTML = '<p class="article-loading">暂无文章</p>';
    return;
  }

  grid.innerHTML = articles.map(renderArticleCard).join('');
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

// ── Category filter ──────────────────────────────────────────────────────────

function initFilter() {
  const buttons = document.querySelectorAll('.cat-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.dataset.cat;
      document.querySelectorAll('.card').forEach(card => {
        const visible = selectedCategory === 'all' || card.dataset.cat === selectedCategory;
        card.classList.toggle('hidden', !visible);
      });
    });
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

async function initHomePage() {
  try {
    const articles = await fetchJson(ARTICLE_INDEX_URL);
    renderArticles(articles.map(normalizeArticle));
    initFilter();
  } catch (e) {
    renderLoadError(e.message);
    initFilter();
  }
}

document.addEventListener('DOMContentLoaded', initHomePage);
