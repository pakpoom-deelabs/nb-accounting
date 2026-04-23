#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'index.html');
const OUT_DIR = resolve(ROOT, 'en');
const OUT = resolve(OUT_DIR, 'index.html');

const DOMAIN = 'https://nbaccountingphuket.com';
const EN_TITLE = 'NB Accounting — Accounting, Visa & Work Permit Services in Phuket, Thailand';
const EN_DESCRIPTION = 'Professional accounting, tax, visa, work permit, and company registration services in Phuket. Bilingual Thai-English. Call +66 97-008-1294.';

const html = readFileSync(SRC, 'utf8');
const root = parse(html, { comment: true, voidTag: { tags: ['img', 'meta', 'link', 'br', 'hr', 'input'] } });

const htmlEl = root.querySelector('html');
if (!htmlEl) throw new Error('No <html> element found');
htmlEl.setAttribute('lang', 'en');

const setAttr = (sel, attr, val) => {
  const el = root.querySelector(sel);
  if (el) el.setAttribute(attr, val);
};
const setContent = (sel, val) => {
  const el = root.querySelector(sel);
  if (el) el.set_content(val);
};

setAttr('meta[http-equiv="content-language"]', 'content', 'en');
setContent('title', EN_TITLE);
setAttr('meta[name="description"]', 'content', EN_DESCRIPTION);
setAttr('link[rel="canonical"]', 'href', `${DOMAIN}/en/`);
setAttr('meta[property="og:url"]', 'content', `${DOMAIN}/en/`);
setAttr('meta[property="og:title"]', 'content', EN_TITLE);
setAttr('meta[property="og:description"]', 'content', EN_DESCRIPTION);
setAttr('meta[property="og:locale"]', 'content', 'en_US');
setAttr('meta[property="og:locale:alternate"]', 'content', 'th_TH');
setAttr('meta[name="twitter:title"]', 'content', EN_TITLE);
setAttr('meta[name="twitter:description"]', 'content', EN_DESCRIPTION);

const ldScript = root.querySelector('script[type="application/ld+json"]');
if (ldScript) {
  const parsed = JSON.parse(ldScript.text);
  parsed.inLanguage = 'en';
  ldScript.set_content(JSON.stringify(parsed, null, 2));
}

root.querySelectorAll('[data-th]').forEach((el) => {
  if (el.tagName && el.tagName.toLowerCase() === 'span') el.remove();
  else el.remove();
});
root.querySelectorAll('[data-en]').forEach((el) => {
  if (el.tagName && el.tagName.toLowerCase() === 'span') el.replaceWith(el.innerHTML);
  else el.removeAttribute('data-en');
});

const langBtn = root.querySelector('button[onclick="toggleLang()"]');
if (langBtn) {
  const classes = langBtn.getAttribute('class') || '';
  const anchor = parse(`<a href="/" class="${classes}" aria-label="Switch to Thai"><span>TH</span></a>`).firstChild;
  langBtn.replaceWith(anchor);
}

root.querySelectorAll('script').forEach((el) => {
  if (el.text.includes('function toggleLang')) el.remove();
});

const rewriteAttr = (attr) => (el) => {
  const val = el.getAttribute(attr);
  if (!val) return;
  if (/^(https?:|mailto:|tel:|\/|#|data:|javascript:)/i.test(val)) return;
  el.setAttribute(attr, `/${val}`);
};
root.querySelectorAll('img[src]').forEach(rewriteAttr('src'));
root.querySelectorAll('source[src]').forEach(rewriteAttr('src'));
root.querySelectorAll('source[srcset]').forEach((el) => {
  const val = el.getAttribute('srcset');
  if (!val) return;
  const rewritten = val.split(',').map((part) => {
    const [url, size] = part.trim().split(/\s+/, 2);
    if (/^(https?:|\/|data:)/i.test(url)) return part.trim();
    return size ? `/${url} ${size}` : `/${url}`;
  }).join(', ');
  el.setAttribute('srcset', rewritten);
});
root.querySelectorAll('link[href]').forEach((el) => {
  const rel = (el.getAttribute('rel') || '').toLowerCase();
  if (rel === 'canonical' || rel === 'alternate') return;
  rewriteAttr('href')(el);
});
root.querySelectorAll('script[src]').forEach(rewriteAttr('src'));

const output = root.toString();

const assertions = [
  { pattern: /\sdata-th(\s|=|>)/, msg: 'Post-build: data-th attribute still present in EN output' },
  { pattern: /\sdata-en(\s|=|>)/, msg: 'Post-build: data-en attribute still present in EN output' },
  { pattern: /toggleLang/, msg: 'Post-build: toggleLang function still present in EN output' },
  { pattern: /promotekit_referral/, msg: 'Post-build: promotekit script still present in EN output' },
];
for (const { pattern, msg } of assertions) {
  if (pattern.test(output)) throw new Error(msg);
}

const htmlLangMatch = output.match(/<html\s+lang="([^"]+)"/);
if (!htmlLangMatch || htmlLangMatch[1] !== 'en') throw new Error(`<html lang> should be "en"`);
const canonicalMatch = output.match(/rel="canonical"\s+href="([^"]+)"/);
if (!canonicalMatch || canonicalMatch[1] !== `${DOMAIN}/en/`) throw new Error(`canonical should be ${DOMAIN}/en/`);
const thHreflang = output.match(/hreflang="th"\s+href="([^"]+)"/);
const enHreflang = output.match(/hreflang="en"\s+href="([^"]+)"/);
if (!thHreflang || thHreflang[1] !== `${DOMAIN}/`) throw new Error(`hreflang th should be ${DOMAIN}/`);
if (!enHreflang || enHreflang[1] !== `${DOMAIN}/en/`) throw new Error(`hreflang en should be ${DOMAIN}/en/`);

const srcTh = html.match(/hreflang="th"\s+href="([^"]+)"/);
const srcEn = html.match(/hreflang="en"\s+href="([^"]+)"/);
if (!srcTh || srcTh[1] !== `${DOMAIN}/`) throw new Error(`Source hreflang th should be ${DOMAIN}/`);
if (!srcEn || srcEn[1] !== `${DOMAIN}/en/`) throw new Error(`Source hreflang en should be ${DOMAIN}/en/`);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, output, 'utf8');
console.log(`Wrote ${OUT}`);
console.log(`  html lang: ${htmlLangMatch[1]}`);
console.log(`  canonical: ${canonicalMatch[1]}`);
console.log(`  hreflang th→${thHreflang[1]} en→${enHreflang[1]}`);
