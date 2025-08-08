// CSR: Lazy dynamic import map for markdown files (code-splitting per locale)
const faqModules = import.meta.glob('./*.md');

// SSR: Eager import so content is available synchronously during pre-render
const faqModulesSSR = import.meta.env.SSR
  ? import.meta.glob('./*.md', { eager: true })
  : null;

/**
 * Asynchronously returns the HTML content for the FAQ for a given locale with sensible fallbacks.
 * Priority:
 * 1) Exact locale match (e.g., 'pt-BR')
 * 2) Base language (e.g., 'pt' for 'pt-BR')
 * 3) English ('en') as universal default
 */
export async function loadFaqHtmlForLocale(requestedLocale) {
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
        return html;
      }
    }
  } else {
    // CSR path: lazy load matching module
    for (const path of candidates) {
      if (faqModules[path]) {
        const mod = await faqModules[path]();
        // Prefer named export 'html'; fall back to default if it is a string
        if (mod && typeof mod.html === 'string') return mod.html;
        if (mod && typeof mod.default === 'string') return mod.default;
      }
    }
  }

  // Should not happen, but return empty string if nothing is found
  return '';
}