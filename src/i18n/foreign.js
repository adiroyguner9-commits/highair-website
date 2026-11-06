/* foreign.js: the German and Spanish texts, loaded only on the site that needs
   them (6 Nov 2026). They used to sit in the main file, so every Hebrew and
   English visitor downloaded ~100 KB of German and Spanish on every page.

   main.jsx calls loadForeign(lang) before the first render on de. / es. (and
   both on preview and local hosts, whose language toggle needs no reload).
   lang.js (tx, loc) and safariI18n.js read FOREIGN; i18n.js gets the German /
   Spanish UI bundle through addResourceBundle. */
export const FOREIGN = {};   // lang -> { ui, safari, res, dict }

export function registerForeign(lang, ui, safari, res) {
  FOREIGN[lang] = { ui, safari, res, dict: { ...safari, ...ui } };
  return FOREIGN[lang];
}

const LOAD = {
  de: () => Promise.all([import('./ui-de.json'), import('./safari-de.js'), import('./res-de.js')]),
  es: () => Promise.all([import('./ui-es.json'), import('./safari-es.js'), import('./res-es.js')]),
};
const pending = {};

export function loadForeign(lang) {
  if (!LOAD[lang]) return Promise.resolve(null);
  if (!pending[lang]) {
    pending[lang] = LOAD[lang]()
      .then(([ui, safari, res]) => registerForeign(lang, ui.default, safari.default, res.default))
      .catch(e => { delete pending[lang]; throw e; });
  }
  return pending[lang];
}
