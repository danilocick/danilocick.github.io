// Renders the Open Graph images public/img/og-{es,ca,en}.png (1200×630) from scripts/og.html
// with headless Chrome — Edge as the fallback — over the DevTools protocol (ADAPTATIONS E, H).
//
//   npm run og                          render all three into public/img/
//   node scripts/og.mjs --out <dir>     write them somewhere else (to compare before replacing)
//   node scripts/og.mjs --locale ca     only some locales (repeatable)
//   node scripts/og.mjs --serve         serve og.html to look at it in a browser
//   CHROME_PATH=<exe> / --browser <exe> use a specific Chrome, Edge or Chromium
//
// og.html loads its copy from src/portfolio/i18n/locales/ and its fonts from public/fonts/,
// so it is served from a throwaway 127.0.0.1 server (only those folders and scripts/).
// The page reports readiness (copy filled, fonts loaded, text fitted) through window.ogReady;
// any problem it finds fails the run instead of producing a broken image.
// Each PNG gets a tEXt signature of the copy and template it was rendered from, which
// scripts/checks.mjs compares to warn when an image is out of date.
// Run it again after changing og.html or the hero/chore copy (and once translations land).
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { extname, join, relative, resolve, sep } from 'node:path'
import { parseArgs } from 'node:util'
import { LOCALES, OG_SIGNATURE_KEY, OG_TEMPLATE, ROOT, fmtBytes, isMain, ogSignature, pngSize, withPngText } from './checks.mjs'

const W = 1200
const H = 630
const SERVED = ['scripts/', 'public/', 'src/portfolio/i18n/locales/']
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
}
const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/microsoft-edge',
].filter(Boolean)

class OgError extends Error {}

/**
 * @param {{ root?: string, out?: string, locales?: string[], browser?: string }} [options]
 */
export async function renderOgImages({ root = ROOT, out = 'public/img', locales = LOCALES, browser } = {}) {
  const outDir = resolve(root, out)
  const template = resolve(root, OG_TEMPLATE)
  if (!existsSync(template)) throw new OgError(`${OG_TEMPLATE} not found`)
  const unknown = locales.filter((l) => !LOCALES.includes(l))
  if (unknown.length) throw new OgError(`unknown locale(s): ${unknown.join(', ')} (expected ${LOCALES.join(', ')})`)

  const candidates = browser || process.env.CHROME_PATH ? [browser || process.env.CHROME_PATH] : BROWSERS.filter((p) => existsSync(p))
  if (!candidates.length) throw new OgError('no Chrome or Edge found — set CHROME_PATH to a Chromium-based browser')
  if (!existsSync(candidates[0])) throw new OgError(`browser not found: ${candidates[0]}`)

  const sharp = await import('sharp').then((m) => m.default).catch(() => null)
  const server = await serve(root)
  const base = `http://127.0.0.1:${server.address().port}`
  let session
  const errors = []
  try {
    for (const exe of candidates) {
      try {
        session = await launch(exe)
        break
      } catch (e) {
        errors.push(`${exe}: ${e.message}`)
      }
    }
    if (!session) throw new OgError(`could not start a headless browser:\n  ${errors.join('\n  ')}`)

    mkdirSync(outDir, { recursive: true })
    const written = []
    for (const locale of locales) {
      const { png, state } = await capture(session.cdp, `${base}/${OG_TEMPLATE}#${locale}`)
      let image = png
      if (sharp) image = await sharp(png).png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 }).toBuffer()
      const [w, h] = pngSize(image)
      if (w !== W || h !== H) throw new OgError(`og-${locale}.png came out ${w}×${h}, expected ${W}×${H}`)
      image = withPngText(image, OG_SIGNATURE_KEY, ogSignature(root, locale))
      const file = join(outDir, `og-${locale}.png`)
      writeFileSync(file, image)
      written.push(file)
      const inRoot = relative(root, file)
      const where = (inRoot.startsWith('..') ? file : inRoot).split(sep).join('/')
      console.log(`og: ${where}  ${W}×${H}  ${fmtBytes(image.length)}  (H1 ${state.h1.size}px, ${state.h1.lines} lines; chores ${state.chore}px)`)
    }
    console.log(`og: rendered with ${session.exe}`)
    return written
  } finally {
    await session?.close()
    await new Promise((done) => server.close(done))
  }
}

// ---------------------------------------------------------------------------
// Static server (127.0.0.1, ephemeral port, read-only, a few folders only)
// ---------------------------------------------------------------------------

function serve(root) {
  const server = createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return void res.writeHead(405).end()
    let file
    try {
      file = resolve(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, ''))
    } catch {
      return void res.writeHead(400).end()
    }
    const rel = relative(root, file).split(sep).join('/')
    const allowed = !rel.startsWith('..') && SERVED.some((p) => rel.startsWith(p))
    if (!allowed || !existsSync(file) || !statSync(file).isFile()) {
      return void res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found')
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
    res.end(req.method === 'HEAD' ? undefined : readFileSync(file))
  })
  return new Promise((ok, ko) => {
    server.once('error', ko)
    server.listen(0, '127.0.0.1', () => ok(server))
  })
}

// ---------------------------------------------------------------------------
// Headless browser + a minimal DevTools protocol client
// ---------------------------------------------------------------------------

async function launch(exe) {
  const profile = mkdtempSync(join(tmpdir(), 'og-browser-'))
  const proc = spawn(
    exe,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-sync',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-default-apps',
      '--mute-audio',
      '--hide-scrollbars',
      '--force-color-profile=srgb',
      '--force-device-scale-factor=1',
      `--window-size=${W},${H}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )
  const cleanup = () => rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })

  let wsUrl
  try {
    wsUrl = await new Promise((ok, ko) => {
      let log = ''
      const timer = setTimeout(() => ko(new Error('no DevTools endpoint after 30 s')), 30_000)
      proc.stderr.setEncoding('utf8')
      proc.stderr.on('data', (chunk) => {
        log += chunk
        const m = /DevTools listening on (ws:\/\/\S+)/.exec(log)
        if (m) {
          clearTimeout(timer)
          ok(m[1])
        }
      })
      proc.once('error', (e) => {
        clearTimeout(timer)
        ko(e)
      })
      proc.once('exit', (code) => {
        clearTimeout(timer)
        ko(new Error(`exited with code ${code}${log ? `: ${log.trim().slice(-500)}` : ''}`))
      })
    })
  } catch (e) {
    proc.kill()
    cleanup()
    throw e
  }

  const cdp = await connect(wsUrl)
  return {
    exe,
    cdp,
    async close() {
      const exited = new Promise((done) => (proc.exitCode !== null ? done() : proc.once('exit', done)))
      await cdp.send('Browser.close').catch(() => {})
      cdp.close()
      const timer = setTimeout(() => proc.kill(), 5_000)
      await exited
      clearTimeout(timer)
      try {
        cleanup()
      } catch {
        // a temp folder Windows still holds: harmless
      }
    },
  }
}

function connect(wsUrl) {
  return new Promise((ok, ko) => {
    const ws = new WebSocket(wsUrl)
    const pending = new Map()
    const waiters = new Set()
    let lastId = 0

    const send = (method, params = {}, sessionId) =>
      new Promise((resolveCall, rejectCall) => {
        const id = ++lastId
        const timer = setTimeout(() => {
          pending.delete(id)
          rejectCall(new Error(`${method} timed out`))
        }, 60_000)
        pending.set(id, { resolveCall, rejectCall, timer, method })
        ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }))
      })

    const waitFor = (method, sessionId, ms = 30_000) => {
      const waiter = { method, sessionId }
      const promise = new Promise((resolveWait, rejectWait) => {
        waiter.resolveWait = resolveWait
        waiter.timer = setTimeout(() => {
          waiters.delete(waiter)
          rejectWait(new Error(`timed out waiting for ${method}`))
        }, ms)
      })
      waiters.add(waiter)
      return promise
    }

    ws.addEventListener('open', () => ok({ send, waitFor, close: () => ws.close() }))
    ws.addEventListener('error', () => ko(new Error(`cannot connect to ${wsUrl}`)))
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(typeof event.data === 'string' ? event.data : Buffer.from(event.data).toString('utf8'))
      if (msg.id !== undefined) {
        const call = pending.get(msg.id)
        if (!call) return
        pending.delete(msg.id)
        clearTimeout(call.timer)
        if (msg.error) call.rejectCall(new Error(`${call.method}: ${msg.error.message}`))
        else call.resolveCall(msg.result)
        return
      }
      for (const waiter of waiters) {
        if (waiter.method === msg.method && (!waiter.sessionId || waiter.sessionId === msg.sessionId)) {
          waiters.delete(waiter)
          clearTimeout(waiter.timer)
          waiter.resolveWait(msg.params)
        }
      }
    })
    ws.addEventListener('close', () => {
      for (const call of pending.values()) {
        clearTimeout(call.timer)
        call.rejectCall(new Error('DevTools connection closed'))
      }
      pending.clear()
    })
  })
}

async function capture(cdp, url) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
  try {
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
    const page = (method, params) => cdp.send(method, params, sessionId)
    await page('Page.enable')
    await page('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false })
    await page('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [
        { name: 'prefers-color-scheme', value: 'light' },
        { name: 'prefers-reduced-motion', value: 'reduce' },
        { name: 'forced-colors', value: 'none' },
      ],
    })
    const loaded = cdp.waitFor('Page.loadEventFired', sessionId)
    const nav = await page('Page.navigate', { url })
    if (nav.errorText) throw new OgError(`cannot open ${url}: ${nav.errorText}`)
    await loaded

    const { result, exceptionDetails } = await page('Runtime.evaluate', {
      expression: 'window.ogReady',
      awaitPromise: true,
      returnByValue: true,
    })
    if (exceptionDetails) throw new OgError(`og.html threw: ${exceptionDetails.exception?.description ?? exceptionDetails.text}`)
    const state = result?.value
    if (!state?.ok) throw new OgError(`og.html is not ready for ${url}:\n  - ${(state?.problems ?? ['no window.ogReady']).join('\n  - ')}`)

    const { data } = await page('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: W, height: H, scale: 1 },
      captureBeyondViewport: false,
    })
    return { png: Buffer.from(data, 'base64'), state }
  } finally {
    await cdp.send('Target.closeTarget', { targetId }).catch(() => {})
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (isMain(import.meta.url)) {
  try {
    const { values } = parseArgs({
      options: {
        out: { type: 'string' },
        locale: { type: 'string', multiple: true },
        browser: { type: 'string' },
        serve: { type: 'boolean' },
      },
    })
    if (values.serve) {
      const server = await serve(ROOT)
      const base = `http://127.0.0.1:${server.address().port}/${OG_TEMPLATE}`
      console.log(`og: serving ${OG_TEMPLATE} (Ctrl+C to stop)`)
      for (const l of LOCALES) console.log(`  ${base}#${l}`)
    } else {
      await renderOgImages({
        out: values.out && resolve(values.out),
        locales: values.locale?.flatMap((l) => l.split(',')).map((l) => l.trim()).filter(Boolean),
        browser: values.browser,
      })
    }
  } catch (e) {
    console.error(`og: ${e instanceof OgError || e?.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION' ? e.message : (e?.stack ?? e)}`)
    process.exitCode = 1
  }
}
