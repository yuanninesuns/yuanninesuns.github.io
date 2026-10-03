// ── Helpers ──────────────────────────────────────────────────────────────────

const catLabels = {
  finance: '理财', journey: '旅途', emotion: '情感', bookmovie: '书影'
};

function parseFrontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
    }
    meta[key] = val;
  });
  return { meta, body: match[2] };
}

// Extract plain-text excerpt from markdown body (strip markdown syntax)
function extractExcerpt(body, maxLen = 60) {
  const plain = body
    .replace(/^#{1,6}\s+/gm, '')   // headings
    .replace(/>\s*/gm, '')          // blockquotes
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline/block code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text
    .replace(/[*_~]+/g, '')         // bold/italic/strike
    .replace(/\n+/g, ' ')           // newlines → space
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/[，。？！、\s]+$/, '') + '……';
}

// ── Load cards from Markdown ──────────────────────────────────────────────────

async function loadCard(card) {
  const src = card.dataset.src;
  if (!src) return;

  // file:// protocol — fetch will fail, keep static HTML as-is
  if (location.protocol === 'file:') return;

  let text;
  try {
    const resp = await fetch(src);
    if (!resp.ok) return;
    text = await resp.text();
  } catch {
    return;
  }

  const { meta, body } = parseFrontmatter(text);
  const title   = meta.title   || '';
  const cat     = meta.category || card.dataset.cat || '';
  const date    = meta.date    || '';
  const tags    = Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []);
  const excerpt = extractExcerpt(body);
  const label   = catLabels[cat] || cat;
  const href    = `article.html?src=${src}`;

  // Sync data-cat in case it differs
  card.dataset.cat = cat;

  card.innerHTML = `
    <a href="${href}" class="card-link">
      <div class="card-meta">
        <span class="cat-badge ${cat}">${label}</span>
        <span class="date">${date}</span>
      </div>
      <h2 class="card-title">${title}</h2>
      <p class="card-excerpt">${excerpt}</p>
      <div class="tag-row">
        ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </a>`;
}

// ── Category filter ───────────────────────────────────────────────────────────

function initFilter() {
  const buttons = document.querySelectorAll('.cat-btn');
  const cards   = document.querySelectorAll('.card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      cards.forEach(card => {
        const visible = cat === 'all' || card.dataset.cat === cat;
        card.classList.toggle('hidden', !visible);
      });
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card[data-src]');
  Promise.all([...cards].map(loadCard)).then(initFilter);
  // Also init filter immediately so static fallback works while loading
  initFilter();
});
