// Last step of `npm run build` (spec §13 "Build and deploy"; ADAPTATIONS A, E, G):
//
//   vite build                                                    client → docs/ (+ .vite/manifest.json)
//   vite build --ssr src/portfolio/entry-server.ts --outDir .ssr  SSR bundle → .ssr/entry-server.js
//   node scripts/prerender.mjs                                    this script
//
// 1. Runs scripts/checks.mjs: correctness failures stop the build; the "Pending for Dani"
//    report is printed and never blocks.
// 2. Renders /, /ca/ and /en/ with render(locale) from the SSR bundle.
// 3. Per page: sets <html lang>, drops the template's dev <title>, fills <!--head--> with the
//    head tags (+ the inlined CSS, before the JSON-LD) and <!--app-html--> with the markup.
// 4. Inlines the built CSS in place of its <link rel="stylesheet"> and deletes the CSS file.
// 5. Validates each page (one <title>, lang, canonical, H1, no leaked i18n key paths, no
//    twitter:* tags), then writes docs/index.html, docs/ca/index.html, docs/en/index.html.
// 6. Writes docs/sitemap.xml (3 URLs with xhtml:link alternates) and docs/robots.txt,
//    ensures docs/.nojekyll and deletes docs/.vite (the manifest is only read for the JS budget).
//
// All three locales are bundled statically, so there is no locale modulepreload (ADAPTATIONS G).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { LOCALE_DIR, ROOT, fmtBytes, isMain, printReport, runChecks } from './checks.mjs'

// Vue and vue-i18n are external to the SSR bundle; pick their production builds.
process.env.NODE_ENV ??= 'production'

const BUDGET = { css: 14 * 1024, js: 80 * 1024 } // gzip (spec §13)
const JSON_LD_TAG = '<script type="application/ld+json">'
/** Public files the deployed pages link to; vite copies them from public/. */
const DEPLOYED_ASSETS = [
  '404.html',
  'cv.pdf',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'fonts/archivo.woff2',
  'fonts/atkinson.woff2',
]

export class BuildError extends Error {}

/**
 * @param {{ root?: string, outDir?: string, ssrEntry?: string }} [options]
 */
export async function prerender({ root = ROOT, outDir = 'docs', ssrEntry = '.ssr/entry-server.js' } = {}) {
  const out = resolve(root, outDir)
  const show = (p) => relative(root, p).split(sep).join('/')
  const warnings = []

  // 1. Checks -----------------------------------------------------------------
  const checks = await runChecks({ root })
  printReport(checks)
  if (checks.failures.length) throw new BuildError(`stopped: ${checks.failures.length} check(s) failed (listed above)`)

  // 2. The client build's index.html is the template --------------------------
  const templatePath = join(out, 'index.html')
  if (!existsSync(templatePath)) throw new BuildError(`${show(templatePath)} not found — run \`vite build\` first`)
  let template = readFileSync(templatePath, 'utf8')
  if (!template.includes('<!--head-->') || !template.includes('<!--app-html-->')) {
    throw new BuildError(`${show(templatePath)} is not the client build template (already prerendered?) — run \`npm run build-only\``)
  }
  if (!/<script\b[^>]*\btype="module"[^>]*\bsrc="[^"]+\.js"/i.test(template)) {
    throw new BuildError(`${show(templatePath)} has no module script — the pages would never hydrate`)
  }

  // 3. CSS: collect every local stylesheet, remove its <link> ------------------
  const cssFiles = []
  let css = ''
  template = template.replace(/[ \t]*<link\b[^>]*\brel=["']?stylesheet["']?[^>]*>[ \t]*\r?\n?/gi, (tag) => {
    const href = /\bhref=["']?([^"'\s>]+)/i.exec(tag)?.[1] ?? ''
    if (!href.startsWith('/') || href.startsWith('//')) {
      throw new BuildError(`external stylesheet ${href || '(no href)'} in the template — the page must not depend on third-party CSS`)
    }
    const file = resolve(out, decodeURIComponent(href.split(/[?#]/)[0]).slice(1))
    if (!file.startsWith(out + sep) || !existsSync(file)) throw new BuildError(`stylesheet ${href} not found in ${outDir}/`)
    cssFiles.push(file)
    css += absolutizeCssUrls(readFileSync(file, 'utf8'), href)
    return ''
  })
  if (!cssFiles.length) throw new BuildError(`no stylesheet <link> in ${show(templatePath)} to inline`)
  css = css
    .replace(/\/\*#\s*sourceMappingURL=[^*]*\*\/\s*/g, '')
    .replace(/<\/style/gi, '<\\/style')
    .trim()

  // The template's dev <title> (main.ts sets it in dev); render() supplies the real one.
  template = template.replace(/[ \t]*<title>[\s\S]*?<\/title>[ \t]*\r?\n?/i, '')

  // 4. Render every locale ------------------------------------------------------
  const entry = resolve(root, ssrEntry)
  if (!existsSync(entry)) {
    throw new BuildError(`${show(entry)} not found — run \`vite build --ssr src/portfolio/entry-server.ts --outDir .ssr\``)
  }
  let mod
  try {
    mod = await import(pathToFileURL(entry).href)
  } catch (e) {
    throw new BuildError(`could not load ${show(entry)}:\n${e?.stack ?? e}`)
  }
  if (typeof mod.render !== 'function') throw new BuildError(`${show(entry)} does not export render(locale)`)
  const locales = Array.isArray(mod.SUPPORTED_LOCALES) && mod.SUPPORTED_LOCALES.length ? [...mod.SUPPORTED_LOCALES] : ['es', 'ca', 'en']
  const namespaces = messageNamespaces(root)

  const pages = []
  for (const locale of locales) {
    let rendered
    try {
      rendered = await mod.render(locale)
    } catch (e) {
      throw new BuildError(`render('${locale}') failed:\n${e?.stack ?? e}`)
    }
    const { html, head } = rendered ?? {}
    const headHtml = rendered?.headHtml ?? (typeof mod.headToHtml === 'function' ? mod.headToHtml(head) : null)
    if (typeof html !== 'string' || !head || typeof headHtml !== 'string') {
      throw new BuildError(`render('${locale}') must return { html, head, headHtml }`)
    }

    let path
    try {
      path = new URL(head.canonical).pathname
    } catch {
      throw new BuildError(`render('${locale}'): head.canonical is not an absolute URL (${head.canonical})`)
    }
    if (!/^\/(?:[a-z]{2}\/)?$/.test(path)) throw new BuildError(`render('${locale}'): unexpected canonical path ${path}`)

    const headBlock = insertBefore(headHtml, JSON_LD_TAG, `<style>${css}</style>`)
    const page = template
      .replace(/(<html\b[^>]*?\blang=")[^"]*(")/i, (_, open, close) => `${open}${locale}${close}`)
      .replace('<!--head-->', () => headBlock)
      .replace('<!--app-html-->', () => html)

    const problems = validatePage(page, { locale, head, html, namespaces })
    if (problems.length) throw new BuildError(`${path} (${locale}) is broken:\n  - ${problems.join('\n  - ')}`)
    const suspicious = page.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').match(/\bundefined\b|\[object Object\]|\bNaN\b/g)
    if (suspicious) warnings.push(`${path}: the markup contains ${[...new Set(suspicious)].join(', ')}`)

    const file = join(out, ...path.split('/').filter(Boolean), 'index.html')
    pages.push({ locale, path, file, page, head })
  }

  const missingAssets = DEPLOYED_ASSETS.concat(locales.map((l) => `img/og-${l}.png`)).filter((p) => !existsSync(join(out, p)))
  if (missingAssets.length) throw new BuildError(`${outDir}/ lacks ${missingAssets.join(', ')} (were they copied from public/?)`)

  // 5. Write the pages (only once all of them rendered and validated) -------------
  for (const { file, page } of pages) {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, page)
  }

  // The CSS now lives in every page; delete the file unless something else still loads it.
  const removed = []
  for (const file of cssFiles) {
    const name = file.split(sep).pop()
    const users = listFiles(out).filter((f) => f !== file && /\.(?:js|mjs|css|html)$/.test(f) && readFileSync(f, 'utf8').includes(name))
    if (users.length) {
      warnings.push(`kept ${show(file)}: still referenced by ${users.map(show).join(', ')}`)
    } else {
      rmSync(file)
      removed.push(show(file))
    }
  }

  // 6. sitemap.xml, robots.txt, .nojekyll, .vite ---------------------------------
  writeFileSync(join(out, 'sitemap.xml'), sitemap(pages))
  const origin = new URL('/', pages[0].head.canonical).href
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', origin).href}\n`)
  if (!existsSync(join(out, '.nojekyll'))) writeFileSync(join(out, '.nojekyll'), '')

  const jsBudget = initialJs(out)
  rmSync(join(out, '.vite'), { recursive: true, force: true })

  // Summary -------------------------------------------------------------------------
  const log = (s) => console.log(`prerender: ${s}`)
  for (const { file, locale, page } of pages) {
    log(`${show(file).padEnd(20)} ${locale}  ${fmtBytes(Buffer.byteLength(page))} (gzip ${fmtBytes(gzipSync(page, { level: 9 }).length)})`)
  }
  const cssGzip = gzipSync(css, { level: 9 }).length
  log(`inline CSS ${fmtBytes(Buffer.byteLength(css))} (gzip ${fmtBytes(cssGzip)}, budget ${fmtBytes(BUDGET.css)})`)
  if (cssGzip > BUDGET.css) warnings.push(`inline CSS is ${fmtBytes(cssGzip)} gzip, over the ${fmtBytes(BUDGET.css)} budget`)
  if (jsBudget) {
    log(`initial JS ${fmtBytes(jsBudget.raw)} in ${jsBudget.files} file(s) (gzip ${fmtBytes(jsBudget.gzip)}, budget ${fmtBytes(BUDGET.js)})`)
    if (jsBudget.gzip > BUDGET.js) warnings.push(`initial JS is ${fmtBytes(jsBudget.gzip)} gzip, over the ${fmtBytes(BUDGET.js)} budget`)
  }
  log(`wrote ${outDir}/sitemap.xml, ${outDir}/robots.txt, ${outDir}/.nojekyll · removed ${[...removed, `${outDir}/.vite`].join(', ')}`)
  for (const w of warnings) log(`warning: ${w}`)
  return { pages: pages.map(({ locale, path, file }) => ({ locale, path, file })), warnings }
}

// ---------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------

function insertBefore(html, marker, insert) {
  const at = html.indexOf(marker)
  if (at < 0) return `${html}\n    ${insert}`
  return `${html.slice(0, at)}${insert}\n    ${html.slice(at)}`
}

/** Relative url() in the CSS would break once inlined into /ca/ and /en/: make them root-relative. */
function absolutizeCssUrls(css, href) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (match, quote, url) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(url.trim())) return match
    const abs = new URL(url.trim(), `https://prerender.invalid${href}`)
    return `url(${quote}${abs.pathname}${abs.search}${abs.hash}${quote})`
  })
}

/** Top-level message namespaces (hero, contact…): a rendered "hero.cta" means a missing message. */
function messageNamespaces(root) {
  try {
    return Object.keys(JSON.parse(readFileSync(resolve(root, LOCALE_DIR, 'es.json'), 'utf8').replace(/^﻿/, '')))
  } catch {
    return []
  }
}

function validatePage(page, { locale, head, html, namespaces }) {
  const problems = []
  const titles = page.match(/<title[\s>]/gi)?.length ?? 0
  if (titles !== 1) problems.push(`${titles} <title> elements (expected 1)`)
  if (!new RegExp(`<html\\b[^>]*\\blang="${locale}"`, 'i').test(page)) problems.push(`<html lang="${locale}"> not set`)
  if (head.lang && head.lang !== locale) problems.push(`head.lang is "${head.lang}"`)
  if (page.includes('<!--head-->') || page.includes('<!--app-html-->')) problems.push('a template marker was not replaced')
  if (!page.includes(`<link rel="canonical" href="${head.canonical}">`)) problems.push(`no canonical link to ${head.canonical}`)
  if (!html.trim()) problems.push('render() returned empty markup')
  else if (!/<h1[\s>]/i.test(html)) problems.push('the markup has no <h1>')
  if (/<link\b[^>]*rel=["']?stylesheet/i.test(page)) problems.push('a <link rel="stylesheet"> is left (the CSS must be inlined)')
  if (/\b(?:name|property)=["']twitter:/i.test(page)) problems.push('twitter:* meta tags (ADAPTATIONS E: there are none)')
  if (!/<div id="app"><(?!\/div>)/.test(page)) problems.push('<div id="app"> must start directly with the rendered markup')

  if (namespaces.length) {
    const visible = page.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
    const ns = namespaces.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    const leaked = [...new Set(visible.match(new RegExp(`(?<![\\w./-])(?:${ns})(?:\\.[\\w-]+)+(?![\\w-]|\\.\\w)`, 'g')) ?? [])]
    if (leaked.length) problems.push(`rendered i18n key paths (missing messages?): ${leaked.join(', ')}`)
  }
  return problems
}

function sitemap(pages) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...pages.flatMap(({ head }) => [
      '  <url>',
      `    <loc>${esc(head.canonical)}</loc>`,
      ...(head.alternates ?? []).map((a) => `    <xhtml:link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}"/>`),
      '  </url>',
    ]),
    '</urlset>',
    '',
  ].join('\n')
}

/** Entry chunk + its static imports, from docs/.vite/manifest.json. */
function initialJs(out) {
  const manifestPath = join(out, '.vite', 'manifest.json')
  if (!existsSync(manifestPath)) return null
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const seen = new Set()
  const visit = (key) => {
    const chunk = manifest[key]
    if (!chunk || seen.has(chunk.file)) return
    seen.add(chunk.file)
    for (const dep of chunk.imports ?? []) visit(dep)
  }
  for (const [key, chunk] of Object.entries(manifest)) if (chunk.isEntry) visit(key)
  let raw = 0
  let gzip = 0
  for (const file of seen) {
    const abs = join(out, file)
    if (!existsSync(abs)) continue
    const buf = readFileSync(abs)
    raw += buf.length
    gzip += gzipSync(buf, { level: 9 }).length
  }
  return { files: seen.size, raw, gzip }
}

function listFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...listFiles(abs))
    else if (entry.isFile() && statSync(abs).size < 8 * 1024 * 1024) files.push(abs)
  }
  return files
}

if (isMain(import.meta.url)) {
  try {
    await prerender()
  } catch (e) {
    console.error(`prerender: ${e instanceof BuildError ? e.message : (e?.stack ?? e)}`)
    process.exitCode = 1
  }
}
