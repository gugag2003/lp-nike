// Utilidades de DOM pequenas: o HTML sai de template string, com o texto escapado.
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const $ = (sel, raiz = document) => raiz.querySelector(sel);
export const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
export const pad = n => String(n).padStart(2, '0');

// toque sem mouse: muda frase de apoio e tira o cursor próprio
export const toque = matchMedia('(hover: none), (pointer: coarse)');
export const celular = matchMedia('(max-width: 899px)');
export const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)');

export const SETA_DIR = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1.5 8h12.5M9.5 3.5 14 8l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
export const SETA_ESQ = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M14.5 8H2M6.5 3.5 2 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
export const SETA_CIMA = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 14.5V2M3.5 6.5 8 2l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
export const MAIS = '<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M7 .5v13M.5 7h13" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
export const MENOS = '<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M.5 7h13" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
export const CHECK = '<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M1.5 7.5 5.2 11 12.5 2.8" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
export const X = '<svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
