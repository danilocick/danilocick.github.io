// Pre-build checks (spec §5 i18n rules + §13; ADAPTATIONS A, E).
//
//   node scripts/checks.mjs        (npm run checks; also the first step of scripts/prerender.mjs)
//
// FAILS (exit code 1, blocks `npm run build`) only on real correctness problems:
//   i18n   es/ca/en key sets differ · a message is not a string · forbidden literals
//          (@ $ { } | outside {param} placeholders and the 5 declared plural keys) ·
//          arrow glyphs (arrows are SVG icon components) · a {param} the Spanish
//          source does not have (it would render empty) · plural keys with the wrong
//          number of "|" forms · a literal key the code uses (t('a.b'), keypath="a.b",
//          textKey: 'a.b') that es.json lacks (the page would show the key path)
//   files  fonts, public/cv.pdf, favicons, og images — plus the portraits, 404.html and
//          the index.html markers the page and the prerender rely on — missing, empty or
//          not what their extension says; og images not 1200×630
// WARNS (printed, never fails): glyphs outside the self-hosted latin subset, endonyms /
//   trilingual line not identical in every locale, Catalan straight apostrophes,
//   dropped placeholders, stale og images, heavy byline images, missing OFL texts…
// PRINTS a "Pending for Dani" report (never fails): the commitment/claim keys listed in
//   src/portfolio/content/review.ts, mailto mode (no Web3Forms key), empty legal fields,
//   unconfirmed experience rows, no testimonials, untranslated locale files, the old CV,
//   guides that are not committed yet.
//
// Exports runChecks() / printReport() for prerender.mjs, and the og signature + PNG text
// helpers shared with og.mjs.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const LOCALES = ['es', 'ca', 'en']
const SOURCE_LOCALE = 'es'
export const LOCALE_DIR = 'src/portfolio/i18n/locales'
const STYLES = 'src/portfolio/styles/portfolio.css'
export const OG_TEMPLATE = 'scripts/og.html'
/** PNG tEXt keyword og.mjs stamps on each og image: hash of og.html + the messages it used. */
export const OG_SIGNATURE_KEY = 'og-source'

/** Declared plural keys (spec §5) → number of "|" forms (2 = one | many; 3 = none | one | many). */
const PLURAL_FORMS = {
  'chores.status.man': 2,
  'picker.cta': 3,
  'picker.live': 3,
  'ticket.count': 3,
  'sticky.cta': 3,
}

/**
 * Slot words that are the page's own language are plain text there (§13 sheet: the EN
 * page writes "Catalan and English" without {ca}/{en}), so these may drop placeholders.
 */
const OPTIONAL_PLACEHOLDERS = new Set(['hero.proof.langs', 'about.facts.langs.value'])

/** Must read the same in every locale file (endonyms, the trilingual line). */
const SAME_IN_EVERY_LOCALE = [/^lang\.names\./, /^contact\.trilingual\./]

const PLACEHOLDER_RE = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g
const FORBIDDEN_CHARS = '@${}|'
const ARROW_RE = /[←-⇿⟰-⟿➔-➿⤀-⥿⬀-⯿]/u
const ARROW_RE_G = new RegExp(ARROW_RE.source, 'gu')

/** Google's latin unicode-range (§3); read from portfolio.css when possible. */
const LATIN_SUBSET =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'

/** sha256 of public/cv.pdf as it was before the redesign (spec §11 launch blocker). */
const OLD_CV_SHA256 = 'ea142eec1dd4991c6bdf3cce9487e9df9ef1c18ada40cbb26f65240a7bbec149'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NIL_UUID = '00000000-0000-0000-0000-000000000000'

const FONT_HINT = 'run `node scripts/fonts.mjs`'
const IMG_HINT = 'run `node scripts/images.mjs`'
const OG_HINT = 'run `npm run og`'

const REQUIRED_FILES = [
  { path: 'index.html', type: 'html' },
  { path: 'public/fonts/archivo.woff2', type: 'woff2', hint: FONT_HINT },
  { path: 'public/fonts/atkinson.woff2', type: 'woff2', hint: FONT_HINT },
  { path: 'public/cv.pdf', type: 'pdf', hint: 'Dani regenerates it (spec §11)' },
  { path: 'public/favicon.svg', type: 'svg', hint: IMG_HINT },
  { path: 'public/favicon-32.png', type: 'png', size: [32, 32], hint: IMG_HINT },
  { path: 'public/apple-touch-icon.png', type: 'png', size: [180, 180], hint: IMG_HINT },
  ...LOCALES.map((l) => ({ path: `public/img/og-${l}.png`, type: 'png', size: [1200, 630], strictSize: true, hint: OG_HINT })),
  ...['dani-40', 'dani-80'].flatMap((n) =>
    ['avif', 'webp', 'jpg'].map((ext) => ({ path: `public/img/${n}.${ext}`, type: ext, hint: IMG_HINT, maxBytes: 3 * 1024 })),
  ),
  ...['avif', 'webp'].map((ext) => ({ path: `public/img/dani-360.${ext}`, type: ext, hint: IMG_HINT })),
  ...['avif', 'webp', 'jpg'].map((ext) => ({ path: `public/img/dani-720.${ext}`, type: ext, hint: IMG_HINT })),
  { path: 'public/404.html', type: 'html' },
]

const RECOMMENDED_FILES = ['public/fonts/OFL-Archivo.txt', 'public/fonts/OFL-AtkinsonHyperlegibleNext.txt']

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * @returns {Promise<{ failures: string[], warnings: string[], info: string[],
 *   pending: { title: string, items: string[] }[] }>}
 */
export async function runChecks({ root = ROOT } = {}) {
  const result = { failures: [], warnings: [], info: [], pending: [] }
  const fail = (area, msg) => result.failures.push(`${area}: ${msg}`)
  const warn = (area, msg) => result.warnings.push(`${area}: ${msg}`)

  const locales = checkI18n(root, fail, warn, result.info)
  if (locales[SOURCE_LOCALE]) checkKeyUsage(root, locales[SOURCE_LOCALE].flat, fail, result.info)
  checkFiles(root, fail, warn, result.info)
  await collectPending(root, warn, result, locales)
  return result
}

export function printReport(result, { stream = process.stdout } = {}) {
  const tty = Boolean(stream.isTTY) && !process.env.NO_COLOR
  const paint = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s)
  const out = []
  for (const line of result.info) out.push(`checks: ${line}`)
  if (result.warnings.length) {
    out.push(paint('33', `checks: ${result.warnings.length} warning(s)`))
    for (const w of result.warnings) out.push(`  - ${w}`)
  }
  if (result.pending.length) {
    out.push('', paint('1', 'Pending for Dani (report only; it never blocks the build)'))
    for (const section of result.pending) {
      out.push(`  ${section.title}`)
      for (const item of section.items) out.push(`    - ${item}`)
    }
    out.push('')
  }
  if (result.failures.length) {
    out.push(paint('31;1', `checks: FAILED (${result.failures.length})`))
    for (const f of result.failures) out.push(paint('31', `  - ${f}`))
  } else {
    out.push(paint('32', 'checks: OK'))
  }
  stream.write(out.join('\n') + '\n')
}

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------

function checkI18n(root, fail, warn, info) {
  const subset = fontSubset(root)
  /** @type {Record<string, { file: string, json: object, flat: Map<string, unknown> }>} */
  const data = {}

  for (const locale of LOCALES) {
    const file = `${LOCALE_DIR}/${locale}.json`
    const abs = resolve(root, file)
    if (!existsSync(abs)) {
      fail('i18n', `${file} is missing`)
      continue
    }
    let json
    try {
      json = JSON.parse(readFileSync(abs, 'utf8').replace(/^﻿/, ''))
    } catch (e) {
      fail('i18n', `${file} is not valid JSON (${e.message})`)
      continue
    }
    if (!isPlainObject(json)) {
      fail('i18n', `${file} must contain a JSON object`)
      continue
    }
    const flat = new Map()
    flatten(json, '', flat, (msg) => fail('i18n', `${file}: ${msg}`))
    data[locale] = { file, json, flat }
  }

  // Per-message rules, every locale.
  for (const locale of LOCALES) {
    const d = data[locale]
    if (!d) continue
    const outsideSubset = new Map()
    for (const [key, value] of d.flat) {
      if (typeof value !== 'string') {
        fail('i18n', `${d.file} › ${key} must be a string (found ${describe(value)})`)
        continue
      }
      if (!value.trim()) warn('i18n', `${d.file} › ${key} is empty`)

      const isPlural = Object.hasOwn(PLURAL_FORMS, key)
      const literal = value.replace(PLACEHOLDER_RE, '')
      const bad = new Set([...literal].filter((ch) => FORBIDDEN_CHARS.includes(ch) && !(ch === '|' && isPlural)))
      if (bad.size) {
        const chars = [...bad].map((c) => `"${c}"`).join(', ')
        fail(
          'i18n',
          `${d.file} › ${key} contains ${chars} — messages allow only {param} placeholders` +
            `${isPlural ? '' : ' and "|" only in the 5 plural keys'} (emails, years and links go in as params or slots): ${preview(value)}`,
        )
      }

      const arrows = [...new Set(value.match(ARROW_RE_G) ?? [])]
      if (arrows.length) {
        fail('i18n', `${d.file} › ${key} contains ${arrows.join(' ')} — arrows are icon components (ArrowIcon, ArrowUpIcon), never text`)
      }

      if (isPlural) {
        const forms = value.split('|')
        const expected = PLURAL_FORMS[key]
        if (forms.length !== expected) {
          const shape = expected === 3 ? '"none | one | {n} many"' : '"one | {n} many"'
          fail('i18n', `${d.file} › ${key} needs ${expected} plural forms ${shape}, found ${forms.length}: ${preview(value)}`)
        } else if (forms.some((f) => !f.trim())) {
          fail('i18n', `${d.file} › ${key} has an empty plural form: ${preview(value)}`)
        }
      }

      for (const ch of value) {
        const cp = ch.codePointAt(0)
        if (inSubset(subset, cp) || ARROW_RE.test(ch)) continue
        if (!outsideSubset.has(ch)) outsideSubset.set(ch, [])
        outsideSubset.get(ch).push(key)
      }
    }
    for (const [ch, keys] of outsideSubset) {
      const cp = ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')
      warn('fonts', `${d.file}: "${ch}" (U+${cp}) is outside the self-hosted latin subset and renders in a fallback font (${list(keys, 3)})`)
    }
  }

  const src = data[SOURCE_LOCALE]
  if (!src) return data

  // Parity with the Spanish source.
  for (const locale of LOCALES) {
    if (locale === SOURCE_LOCALE || !data[locale]) continue
    const d = data[locale]
    const missing = [...src.flat.keys()].filter((k) => !d.flat.has(k))
    const extra = [...d.flat.keys()].filter((k) => !src.flat.has(k))
    if (missing.length) fail('i18n', `${d.file} lacks ${missing.length} key(s) that es.json has: ${list(missing)}`)
    if (extra.length) fail('i18n', `${d.file} has ${extra.length} key(s) that es.json lacks: ${list(extra)}`)

    for (const [key, value] of d.flat) {
      const srcValue = src.flat.get(key)
      if (typeof value !== 'string' || typeof srcValue !== 'string') continue
      const mine = placeholders(value)
      const theirs = placeholders(srcValue)
      const unknown = [...mine].filter((n) => !theirs.has(n))
      if (unknown.length) {
        fail(
          'i18n',
          `${d.file} › ${key} uses ${braces(unknown)}, which es.json does not (${braces([...theirs]) || 'no placeholders'}) — it would render empty`,
        )
      }
      const dropped = [...theirs].filter((n) => !mine.has(n))
      if (dropped.length && !OPTIONAL_PLACEHOLDERS.has(key)) {
        warn('i18n', `${d.file} › ${key} drops ${braces(dropped)} (es.json has it) — make sure that is intended`)
      }
    }

    for (const [key, value] of src.flat) {
      if (!SAME_IN_EVERY_LOCALE.some((re) => re.test(key)) || !d.flat.has(key)) continue
      if (d.flat.get(key) !== value) warn('i18n', `${d.file} › ${key} must read the same in every locale file: ${JSON.stringify(value)}`)
    }
  }

  if (data.ca) {
    const straight = [...data.ca.flat].filter(([, v]) => typeof v === 'string' && v.includes("'")).map(([k]) => k)
    if (straight.length) {
      warn('i18n', `ca.json: ${straight.length} message(s) use a straight apostrophe (') where Catalan copy uses ’ (${list(straight, 5)})`)
    }
  }

  info.push(
    `i18n — ${LOCALES.filter((l) => data[l]).join(', ')} · ${src.flat.size} messages in es.json · ` +
      `${Object.keys(PLURAL_FORMS).length} plural keys`,
  )
  return data
}

/**
 * Literal keys the code asks for — t('a.b'), $t("a.b"), <i18n-t keypath="a.b">, textKey: 'a.b',
 * { key: 'a.b' } — must exist in es.json (vue-i18n would print the key path instead).
 * Computed keys (t(c.noteKey), t(`lang.names.${l}`)) are not checked here; the prerender
 * catches the server-rendered ones.
 */
function checkKeyUsage(root, esFlat, fail, info) {
  const KEY = String.raw`([A-Za-z][\w-]*(?:\.[\w-]+)+)`
  const patterns = [
    new RegExp(String.raw`(?<![\w$])\$?t\(\s*(['"])${KEY}\1`, 'g'),
    new RegExp(String.raw`(?<![\w:.-])keypath\s*=\s*(["'])${KEY}\1`, 'g'),
    new RegExp(String.raw`\b(?:key|[a-z]\w*Key)\s*:\s*(['"])${KEY}\1`, 'g'),
  ]
  const srcDir = resolve(root, 'src/portfolio')
  if (!existsSync(srcDir)) return
  const skip = [resolve(root, LOCALE_DIR), resolve(root, 'src/portfolio/content/review.ts')]
  const missing = new Map()
  let files = 0
  let uses = 0
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      if (skip.some((s) => abs === s || abs.startsWith(s + sep))) continue
      if (entry.isDirectory()) walk(abs)
      else if (/\.(?:vue|ts|js|mjs)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) scan(abs)
    }
  }
  const scan = (abs) => {
    files++
    const text = readFileSync(abs, 'utf8')
    for (const re of patterns) {
      for (const m of text.matchAll(re)) {
        uses++
        const key = m[2]
        if (typeof esFlat.get(key) === 'string') continue
        const line = text.slice(0, m.index).split('\n').length
        const where = `${relative(root, abs).split(sep).join('/')}:${line}`
        if (!missing.has(key)) missing.set(key, [])
        missing.get(key).push(where)
      }
    }
  }
  walk(srcDir)
  for (const [key, where] of missing) {
    fail('i18n', `"${key}" is used in ${list(where, 3)} but is not a message in es.json (add it to es, ca and en)`)
  }
  info.push(`i18n keys — ${uses} literal key uses in ${files} source files checked against es.json`)
}

function flatten(obj, prefix, out, report) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.includes('.')) report(`key segment "${k}" contains a dot (under "${prefix || '(root)'}")`)
    const key = prefix ? `${prefix}.${k}` : k
    if (isPlainObject(v)) flatten(v, key, out, report)
    else out.set(key, v)
  }
}

function placeholders(value) {
  return new Set([...value.matchAll(PLACEHOLDER_RE)].map((m) => m[1]))
}

function fontSubset(root) {
  let source = LATIN_SUBSET
  try {
    const css = readFileSync(resolve(root, STYLES), 'utf8')
    const m = /unicode-range\s*:\s*([^;}]+)/i.exec(css)
    if (m) source = m[1]
  } catch {
    // fall back to the spec's range
  }
  const ranges = []
  for (const part of source.split(',')) {
    const m = /U\+([0-9A-F?]{1,6})(?:-([0-9A-F]{1,6}))?/i.exec(part.trim())
    if (!m) continue
    if (m[1].includes('?')) {
      ranges.push([parseInt(m[1].replace(/\?/g, '0'), 16), parseInt(m[1].replace(/\?/g, 'F'), 16)])
    } else {
      const lo = parseInt(m[1], 16)
      ranges.push([lo, m[2] ? parseInt(m[2], 16) : lo])
    }
  }
  return ranges
}

const inSubset = (ranges, cp) => ranges.some(([lo, hi]) => cp >= lo && cp <= hi)

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

const SNIFF = {
  woff2: (b) => b.toString('latin1', 0, 4) === 'wOF2',
  pdf: (b) => b.toString('latin1', 0, 5) === '%PDF-',
  png: (b) => b.length > 24 && b.readUInt32BE(0) === 0x89504e47 && b.toString('latin1', 12, 16) === 'IHDR',
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  webp: (b) => b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP',
  avif: (b) => b.toString('latin1', 4, 8) === 'ftyp' && /avi[fs]/.test(b.toString('latin1', 8, 64)),
  svg: (b) => /<svg[\s>]/i.test(b.toString('utf8')),
  html: (b) => /<html[\s>]/i.test(b.toString('utf8')),
}

function checkFiles(root, fail, warn, info) {
  let present = 0
  for (const spec of REQUIRED_FILES) {
    const abs = resolve(root, spec.path)
    const hint = spec.hint ? ` — ${spec.hint}` : ''
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      fail('files', `${spec.path} is missing${hint}`)
      continue
    }
    const buf = readFileSync(abs)
    if (!buf.length) {
      fail('files', `${spec.path} is empty${hint}`)
      continue
    }
    if (!SNIFF[spec.type](buf)) {
      fail('files', `${spec.path} is not a valid ${spec.type.toUpperCase()} file${hint}`)
      continue
    }
    if (spec.size && spec.type === 'png') {
      const [w, h] = pngSize(buf)
      if (w !== spec.size[0] || h !== spec.size[1]) {
        const msg = `${spec.path} is ${w}×${h}, expected ${spec.size[0]}×${spec.size[1]}${hint}`
        if (spec.strictSize) {
          fail('files', msg)
          continue
        }
        warn('files', msg)
      }
    }
    if (spec.maxBytes && buf.length > spec.maxBytes) {
      warn('budget', `${spec.path} is ${fmtBytes(buf.length)} (byline images ≤ ${fmtBytes(spec.maxBytes)})`)
    }
    present++
  }

  // The prerender fills these markers in the built template.
  const tplPath = resolve(root, 'index.html')
  if (existsSync(tplPath)) {
    const tpl = readFileSync(tplPath, 'utf8')
    if (!tpl.includes('<!--head-->')) fail('files', 'index.html lacks the <!--head--> marker the prerender fills')
    if (!/<div id="app"><!--app-html--><\/div>/.test(tpl)) {
      fail('files', 'index.html lacks <div id="app"><!--app-html--></div> (no whitespace inside — it is hydrated)')
    }
    if (!/<html\b[^>]*\blang="[^"]*"/i.test(tpl)) fail('files', 'index.html: <html> has no lang attribute to replace per locale')
  }

  const notFound = resolve(root, 'public/404.html')
  if (existsSync(notFound) && !/noindex/i.test(readFileSync(notFound, 'utf8'))) {
    warn('files', 'public/404.html should be noindex (spec §13)')
  }

  for (const file of RECOMMENDED_FILES) {
    if (!existsSync(resolve(root, file))) warn('files', `${file} is missing (the OFL asks to ship the licence with the fonts) — ${FONT_HINT}`)
  }

  // og images carry a signature of the copy and template they were rendered from.
  for (const locale of LOCALES) {
    const file = `public/img/og-${locale}.png`
    const abs = resolve(root, file)
    if (!existsSync(abs)) continue
    let expected
    try {
      expected = ogSignature(root, locale)
    } catch {
      continue // og.html or the locale file is unreadable: reported elsewhere
    }
    const stamped = readPngText(readFileSync(abs))[OG_SIGNATURE_KEY]
    if (stamped !== expected) {
      warn('og', `${file} is out of date (its copy in ${locale}.json or scripts/og.html changed since it was rendered) — ${OG_HINT}`)
    }
  }

  const fonts = ['archivo', 'atkinson']
    .map((n) => [n, resolve(root, `public/fonts/${n}.woff2`)])
    .filter(([, p]) => existsSync(p))
    .map(([n, p]) => `${n}.woff2 ${fmtBytes(statSync(p).size)}`)
  info.push(`files — ${present}/${REQUIRED_FILES.length} required files OK${fonts.length ? ` · fonts: ${fonts.join(', ')}` : ''}`)
}

// ---------------------------------------------------------------------------
// "Pending for Dani" (report only)
// ---------------------------------------------------------------------------

async function collectPending(root, warn, result, locales) {
  const add = (title, items) => {
    if (items.length) result.pending.push({ title, items })
  }

  const env = await loadProductionEnv(root)
  const [review, site, profile] = await Promise.all(
    ['src/portfolio/content/review.ts', 'src/portfolio/config/site.ts', 'src/portfolio/content/profile.ts'].map((file) =>
      loadTsModule(root, file, env).catch((e) => {
        warn('report', `could not read ${file} (${e.message.split('\n')[0]}) — its pending items are not listed`)
        return null
      }),
    ),
  )

  // 1. Copy and commitments Dani must confirm (spec §11 🔶 keys).
  if (review && Array.isArray(review.review)) {
    const keys = locales[SOURCE_LOCALE] ? [...locales[SOURCE_LOCALE].flat.keys()] : []
    const entries = review.review.filter((item) => item && typeof item.key === 'string')
    const items = entries.map(({ key, reason }) => {
      const matches = matchKeys(keys, key)
      if (keys.length && !matches.length) warn('report', `review.ts lists "${key}", which matches no message in es.json`)
      return `${key}${key.includes('*') ? ` (${matches.length} messages)` : ''}: ${reason}`
    })
    add('Copy and commitments to confirm (src/portfolio/content/review.ts)', items)
  }

  // 2. Contact form mode.
  const key = (env.VITE_WEB3FORMS_KEY ?? '').trim()
  const mode = site?.contactMode ?? (UUID_RE.test(key) && key !== NIL_UUID ? 'web3forms' : 'mailto')
  if (mode === 'mailto') {
    add('Contact form', [
      key
        ? 'VITE_WEB3FORMS_KEY is set but is not a valid Web3Forms access key, so the form runs in mailto mode ("Escribir desde mi correo").'
        : 'No VITE_WEB3FORMS_KEY (.env.production.local), so the form runs in mailto mode ("Escribir desde mi correo"); the email and Copiar stay visible.',
    ])
  }

  if (site) {
    // 3. Legal notice fields (rendered only when non-empty).
    const legal = site.legal ?? {}
    const items = []
    if (!String(legal.nif ?? '').trim()) items.push('legal.nif is empty: the NIF line is hidden (LSSI art. 10; confirm with the gestoría).')
    if (!String(legal.address ?? '').trim()) items.push('legal.address is empty: the Domicilio line is hidden (LSSI art. 10).')
    add('Legal notice (src/portfolio/config/site.ts)', items)
    result.info.push(
      `config — contact form: ${mode} · clientWork: ${site.clientWork} · whatsapp: ${site.whatsapp === false ? 'off' : 'on'}`,
    )
  }

  if (profile) {
    // 4. Unconfirmed experience rows.
    const hidden = (profile.experience ?? []).filter((x) => !x.confirmed)
    add(
      'Experience (src/portfolio/content/profile.ts)',
      hidden.map((x) => `${x.company} is not confirmed, so its row is hidden (add it to the CV first, then set confirmed: true).`),
    )

    // 5. Testimonials.
    if (!(profile.testimonials ?? []).length) {
      add('Testimonials', ['None yet, so the block is hidden. Priority: two LinkedIn recommendations, verbatim, with their url.'])
    }

    // 6. Guides linked to GitHub must be committed and pushed.
    const items = []
    for (const guide of profile.guides ?? []) {
      const m = guide.url && /\/blob\/[^/]+\/(.+?)(?:[?#].*)?$/.exec(guide.url)
      if (!m) continue
      const rel = decodeURIComponent(m[1])
      if (!existsSync(resolve(root, rel))) items.push(`${rel} does not exist, so the "${guide.id}" link 404s.`)
      else if (isUntracked(root, rel)) items.push(`${rel} is not committed yet; its GitHub link 404s until it is pushed.`)
    }
    add('Guides', items)
  }

  // 7. Locale files still copied from Spanish.
  const copies = LOCALES.filter((l) => l !== SOURCE_LOCALE && locales[l] && locales[SOURCE_LOCALE])
    .filter((l) => JSON.stringify(locales[l].json) === JSON.stringify(locales[SOURCE_LOCALE].json))
    .map((l) => `${l}.json`)
  if (copies.length) {
    add('Translations', [
      `${copies.join(' and ')} ${copies.length > 1 ? 'are still copies' : 'is still a copy'} of es.json (use the §13 translation sheet), then ${OG_HINT}.`,
    ])
  }

  // 8. The CV must match the page (spec §11 launch blocker).
  const cv = resolve(root, 'public/cv.pdf')
  if (existsSync(cv) && createHash('sha256').update(readFileSync(cv)).digest('hex') === OLD_CV_SHA256) {
    const noPhone = site && site.whatsapp === false ? '; no phone number (WhatsApp is off)' : ''
    add('CV (public/cv.pdf)', [
      `Still the old CV. Regenerate it (spec §11): no skill bars; Unex role as on the page; Oropelius on both or neither; ` +
        `ASIR title typo fixed ("Administración de Sistemas Informáticos en Red")${noPhone}.`,
    ])
  }
}

/** VITE_* variables as the production build sees them (.env, .env.production, *.local, process.env). */
async function loadProductionEnv(root) {
  try {
    const { loadEnv } = await import('vite')
    return loadEnv('production', root, 'VITE_')
  } catch {
    return Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith('VITE_')))
  }
}

/**
 * Evaluates a small, import-free TS module (type-only imports are erased) with
 * import.meta.env replaced by `env`.
 */
async function loadTsModule(root, file, env) {
  const { transformWithEsbuild } = await import('vite')
  const abs = resolve(root, file)
  const source = readFileSync(abs, 'utf8').replace(/\bimport\.meta\.env\b/g, '__CHECKS_ENV__')
  const { code } = await transformWithEsbuild(source, abs, { loader: 'ts', format: 'esm', target: 'node18' })
  const js = `const __CHECKS_ENV__ = ${JSON.stringify({ ...env, MODE: 'production', PROD: true, DEV: false, SSR: false })};\n${code}`
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
}

/** "a.b" (exact or subtree), "a.*" (any depth below a), "a.*.c" (one segment). */
function matchKeys(keys, pattern) {
  if (!pattern.includes('*')) return keys.filter((k) => k === pattern || k.startsWith(`${pattern}.`))
  const parts = pattern.split('.')
  const body = parts.map((p, i) => (p === '*' ? (i === parts.length - 1 ? '.+' : '[^.]+') : escapeRe(p))).join('\\.')
  const re = new RegExp(`^${body}$`)
  return keys.filter((k) => re.test(k))
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isUntracked(root, rel) {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', '--', rel], { cwd: root, stdio: 'ignore' })
    return false
  } catch (e) {
    return e.status === 1 // 1 = not tracked; no git (ENOENT) or not a repository (128) = unknown
  }
}

// ---------------------------------------------------------------------------
// og image signature + PNG helpers (shared with og.mjs)
// ---------------------------------------------------------------------------

/** Message keys og.html renders, from its <script type="application/json" id="og-keys">. */
export function ogKeys(html) {
  const m = /<script\b[^>]*\bid="og-keys"[^>]*>([\s\S]*?)<\/script>/i.exec(html)
  if (!m) throw new Error(`${OG_TEMPLATE} has no <script id="og-keys">`)
  const keys = JSON.parse(m[1])
  if (!Array.isArray(keys) || keys.some((k) => typeof k !== 'string')) throw new Error('og-keys must be an array of strings')
  return keys
}

/** Hash of og.html + the messages it renders for `locale`: changes whenever the image would. */
export function ogSignature(root, locale) {
  const html = readFileSync(resolve(root, OG_TEMPLATE), 'utf8').replace(/\r\n?/g, '\n')
  const messages = JSON.parse(readFileSync(resolve(root, LOCALE_DIR, `${locale}.json`), 'utf8').replace(/^﻿/, ''))
  const used = ogKeys(html).map((k) => [k, k.split('.').reduce((o, s) => (isPlainObject(o) ? o[s] : undefined), messages) ?? null])
  return createHash('sha256').update(html).update('\0').update(JSON.stringify(used)).digest('hex').slice(0, 32)
}

export function pngSize(buf) {
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
}

/** tEXt chunks of a PNG as { keyword: text }. */
export function readPngText(buf) {
  const out = {}
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504e47) return out
  let p = 8
  while (p + 12 <= buf.length) {
    const len = buf.readUInt32BE(p)
    const type = buf.toString('latin1', p + 4, p + 8)
    if (type === 'tEXt') {
      const data = buf.subarray(p + 8, p + 8 + len)
      const nul = data.indexOf(0)
      if (nul > 0) out[data.toString('latin1', 0, nul)] = data.toString('latin1', nul + 1)
    }
    if (type === 'IEND') break
    p += 12 + len
  }
  return out
}

/** Returns a copy of `png` with a tEXt chunk inserted right after IHDR. */
export function withPngText(png, keyword, text) {
  const type = Buffer.from('tEXt', 'latin1')
  const data = Buffer.concat([Buffer.from(keyword, 'latin1'), Buffer.from([0]), Buffer.from(text, 'latin1')])
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([type, data])))
  const afterIhdr = 8 + 12 + png.readUInt32BE(8)
  return Buffer.concat([png.subarray(0, afterIhdr), len, type, data, crc, png.subarray(afterIhdr)])
}

let CRC_TABLE
function crc32(buf) {
  CRC_TABLE ??= Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function describe(v) {
  return v === null ? 'null' : Array.isArray(v) ? 'an array' : typeof v
}

function preview(s, max = 90) {
  const one = s.replace(/\s+/g, ' ')
  return JSON.stringify(one.length > max ? `${one.slice(0, max - 1)}…` : one)
}

function braces(names) {
  return names.map((n) => `{${n}}`).join(', ')
}

function list(items, max = 12) {
  return items.length > max ? `${items.slice(0, max).join(', ')} … (+${items.length - max} more)` : items.join(', ')
}

export function fmtBytes(n) {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`
}

export function isMain(metaUrl) {
  if (!process.argv[1]) return false
  const a = resolve(fileURLToPath(metaUrl))
  const b = resolve(process.argv[1])
  return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b
}

if (isMain(import.meta.url)) {
  const result = await runChecks()
  printReport(result)
  process.exitCode = result.failures.length ? 1 : 0
}
