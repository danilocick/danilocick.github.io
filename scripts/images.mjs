// Generates the portrait crops and the favicons with sharp (devDependency).
//   node scripts/images.mjs
// Source: src/assets/userImage.jpeg (1024×1260).
// Outputs:
//   public/img/dani-{40,80}.{avif,webp,jpg}      face square (byline)
//   public/img/dani-{360,720}.{avif,webp} + dani-720.jpg   4:5 portrait (About, JSON-LD)
//   public/favicon.svg                           dial in AUTOMÁTICO, light/dark via inner media query
//   public/favicon-32.png, public/apple-touch-icon.png (180)
import { mkdirSync, writeFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'src/assets/userImage.jpeg')
const imgDir = resolve(root, 'public/img')
mkdirSync(imgDir, { recursive: true })

// Crop boxes in source pixels (spec §5). Checked visually: the face square is
// centred on the face (nose x ≈ 515) with a little headroom above the hair;
// the 4:5 portrait keeps head and shoulders centred.
const FACE = { left: 262, top: 70, width: 510, height: 510 }
const PORTRAIT = { left: 8, top: 0, width: 1008, height: 1260 } // 4:5

const encoders = {
  avif: (s) => s.avif({ quality: 52, effort: 6 }),
  webp: (s) => s.webp({ quality: 74, effort: 6 }),
  jpg: (s) => s.jpeg({ quality: 78, mozjpeg: true }),
}

const jobs = [
  { box: FACE, size: [40, 40], name: 'dani-40', formats: ['avif', 'webp', 'jpg'] },
  { box: FACE, size: [80, 80], name: 'dani-80', formats: ['avif', 'webp', 'jpg'] },
  { box: PORTRAIT, size: [360, 450], name: 'dani-360', formats: ['avif', 'webp'] },
  { box: PORTRAIT, size: [720, 900], name: 'dani-720', formats: ['avif', 'webp', 'jpg'] },
]

const report = (file) => console.log(`images: ${file.replace(root + '\\', '').replace(root + '/', '').replaceAll('\\', '/')}  ${statSync(file).size.toLocaleString('en')} B`)

for (const job of jobs) {
  for (const fmt of job.formats) {
    const out = resolve(imgDir, `${job.name}.${fmt}`)
    const pipeline = sharp(src)
      .extract(job.box)
      .resize(job.size[0], job.size[1], { fit: 'cover', kernel: 'lanczos3' })
      .withMetadata({}) // keep sRGB, drop EXIF
    await encoders[fmt](pipeline).toFile(out)
    report(out)
  }
}

// ---------------------------------------------------------------------------
// Favicon: the dial (DialGlyph geometry, viewBox 56) in AUTOMÁTICO (+45°),
// heavier strokes so it survives 16px. Paper-filled disc so it reads on light
// and dark tab bars; colours follow prefers-color-scheme.
// ---------------------------------------------------------------------------
const LIGHT = { paper: '#F3F2EE', ink: '#15140F' }
const DARK = { paper: '#14130F', ink: '#EFEDE6' }

const dialShapes = (cls) =>
  `<circle class="${cls.disc}" cx="28" cy="28" r="25" stroke-width="4.5"/>` +
  `<g transform="rotate(45 28 28)">` +
  `<rect class="${cls.bar}" x="23.5" y="7.5" width="9" height="41" rx="4.5"/>` +
  `<circle class="${cls.tip}" cx="28" cy="14" r="2.4"/>` +
  `</g>`

const faviconSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">` +
  `<style>` +
  `.d{fill:${LIGHT.paper};stroke:${LIGHT.ink}}.b{fill:${LIGHT.ink}}.t{fill:${LIGHT.paper}}` +
  `@media (prefers-color-scheme:dark){.d{fill:${DARK.paper};stroke:${DARK.ink}}.b{fill:${DARK.ink}}.t{fill:${DARK.paper}}}` +
  `</style>` +
  dialShapes({ disc: 'd', bar: 'b', tip: 't' }) +
  `</svg>\n`

writeFileSync(resolve(root, 'public/favicon.svg'), faviconSvg)
report(resolve(root, 'public/favicon.svg'))

// Raster versions use explicit light colours (no media queries in librsvg).
const rasterSvg = (px, { background } = {}) => {
  const c = LIGHT
  const shapes = dialShapes({ disc: 'd', bar: 'b', tip: 't' })
  const style = `<style>.d{fill:${c.paper};stroke:${c.ink}}.b{fill:${c.ink}}.t{fill:${c.paper}}</style>`
  if (!background) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 56 56">${style}${shapes}</svg>`
  }
  // Apple touch icon: opaque paper square, dial at ~66% (iOS adds its own mask).
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 84 84">${style}` +
    `<rect width="84" height="84" fill="${c.paper}"/><g transform="translate(14 14)">${shapes}</g></svg>`
  )
}

const fav32 = resolve(root, 'public/favicon-32.png')
await sharp(Buffer.from(rasterSvg(32)), { density: 72 })
  .png({ compressionLevel: 9 })
  .toFile(fav32)
report(fav32)

const apple = resolve(root, 'public/apple-touch-icon.png')
await sharp(Buffer.from(rasterSvg(180, { background: true })), { density: 72 })
  .flatten({ background: LIGHT.paper })
  .png({ compressionLevel: 9 })
  .toFile(apple)
report(apple)
