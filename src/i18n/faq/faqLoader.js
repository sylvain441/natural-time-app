// CSR: Lazy dynamic import map for markdown files (code-splitting per locale)
const faqModules = import.meta.glob('./*.md');

// SSR: Eager import so content is available synchronously during pre-render
const faqModulesSSR = import.meta.env.SSR
  ? import.meta.glob('./*.md', { eager: true })
  : null;

/**
 * Finishes the comparative plates that open the clock and spiral chapters.
 *
 * A markdown table cannot carry attributes, and the plates need four things:
 * - a title line, which says the plate is a comparison. It is the one string
 *   here that is not in the markdown: the column headings name the two
 *   systems, so the title has nothing left to name and says what the plate is
 *   for instead. It comes from the locale files, via `title`;
 * - a `data-label` on each of the two answer cells, so the stacked layout can
 *   drop the header row without leaving the answers unlabelled;
 * - a `<span>` around the natural-time heading, so the highlighter stroke
 *   hugs the words instead of the whole cell;
 * - a `<colgroup>`, so the column widths do not depend on which row the fixed
 *   layout happens to measure.
 *
 * The `<em>` in a header is the old "vs" mark. The title says the plate is a
 * comparison now, so the word is dropped from the page as well as from the
 * labels.
 *
 * This is deliberately string surgery rather than DOM work: it runs unchanged
 * during the static pre-render, where there is no DOMParser, so the plates end
 * up in the generated HTML instead of being bolted on after hydration.
 */
const BOARD_RE = /<figure class="faq-board"[\s\S]*?<\/figure>/g;
const TH_RE = /<th[^>]*>([\s\S]*?)<\/th>/g;
const FIGURE_OPEN_RE = /<figure class="faq-board"[^>]*>/;
const COLGROUP = '<colgroup><col><col><col></colgroup>';
const EM_RE = /<em>[\s\S]*?<\/em>\s*/g;

function enhanceBoards(html, title) {
  if (!html || html.indexOf('faq-board') === -1) return html;

  return html.replace(BOARD_RE, (figure) => {
    const thead = figure.match(/<thead>[\s\S]*?<\/thead>/);
    if (!thead) return figure;

    // Header text, tags stripped — it becomes an attribute value.
    const labels = Array.from(thead[0].matchAll(TH_RE), (m) =>
      m[1].replace(/<em>[\s\S]*?<\/em>/g, '').replace(/<[^>]*>/g, '').trim());
    if (labels.length < 3) return figure;

    let out = figure.replace(thead[0], () => {
      let seen = 0;
      return thead[0].replace(EM_RE, '').replace(TH_RE, (cell, inner) =>
        (++seen === 2 ? cell.replace(inner, `<span>${inner}</span>`) : cell));
    });

    if (title) {
      out = out.replace(FIGURE_OPEN_RE,
        (open) => `${open}<p class="faq-board-title">${title}</p>`);
    }
    out = out.replace('<table>', `<table>${COLGROUP}`);

    // Second and third cell of every body row get the matching header label.
    out = out.replace(/<tbody>[\s\S]*?<\/tbody>/, (body) =>
      body.replace(/<tr>[\s\S]*?<\/tr>/g, (row) => {
        let seen = 0;
        return row.replace(/<td(\s[^>]*)?>/g, (tag, attrs) => {
          seen += 1;
          if (seen === 1) return tag;
          return `<td${attrs || ''} data-label="${labels[seen - 1]}">`;
        });
      }));

    return out;
  });
}

/**
 * Asynchronously returns the HTML content for the FAQ for a given locale with sensible fallbacks.
 * Priority:
 * 1) Exact locale match (e.g., 'pt-BR')
 * 2) Base language (e.g., 'pt' for 'pt-BR')
 * 3) English ('en') as universal default
 *
 * `boardTitle` is the heading the comparative plates open with, already
 * translated by the caller — the markdown has no place to keep it.
 */
export async function loadFaqHtmlForLocale(requestedLocale, boardTitle) {
  const locale = requestedLocale || 'en';
  const candidates = [];

  // 1) Exact
  candidates.push(`./${locale}.md`);
  // 2) Base language
  if (typeof locale === 'string' && locale.includes('-')) {
    const base = locale.split('-')[0];
    if (base) candidates.push(`./${base}.md`);
  }
  // 3) English default
  candidates.push('./en.md');

  // SSR path: return synchronously from eager modules
  if (import.meta.env.SSR && faqModulesSSR) {
    for (const path of candidates) {
      const mod = faqModulesSSR[path];
      if (mod) {
        const html = typeof mod.html === 'string' ? mod.html : (typeof mod.default === 'string' ? mod.default : '');
        return enhanceBoards(html, boardTitle);
      }
    }
  } else {
    // CSR path: lazy load matching module
    for (const path of candidates) {
      if (faqModules[path]) {
        const mod = await faqModules[path]();
        // Prefer named export 'html'; fall back to default if it is a string
        if (mod && typeof mod.html === 'string') return enhanceBoards(mod.html, boardTitle);
        if (mod && typeof mod.default === 'string') return enhanceBoards(mod.default, boardTitle);
      }
    }
  }

  // Should not happen, but return empty string if nothing is found
  return '';
}