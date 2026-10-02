// Copies the self-hosted LATIN woff2 files from the Fontsource npm packages
// into public/fonts/ with stable names, plus their OFL licence texts.
// Run once after `npm install` (or whenever the font packages are updated):
//   node scripts/fonts.mjs
import { copyFileSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nm = (p) => resolve(root, 'node_modules/@fontsource-variable', p)
const out = resolve(root, 'public/fonts')

// Archivo: the latin file WITH the wdth axis (wght 100–900, wdth 62–125%),
// used at font-weight:800; font-stretch:112%.
// Atkinson Hyperlegible Next: the latin wght variable file (wght 200–800),
// used only at 400 and 700.
const jobs = [
  [nm('archivo/files/archivo-latin-wdth-normal.woff2'), 'archivo.woff2'],
  [nm('atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2'), 'atkinson.woff2'],
  [nm('archivo/LICENSE'), 'OFL-Archivo.txt'],
  [nm('atkinson-hyperlegible-next/LICENSE'), 'OFL-AtkinsonHyperlegibleNext.txt'],
]

mkdirSync(out, { recursive: true })
let failed = false
for (const [src, name] of jobs) {
  if (!existsSync(src)) {
    console.error(`fonts: missing ${src} (run npm install)`)
    failed = true
    continue
  }
  const dest = resolve(out, name)
  copyFileSync(src, dest)
  console.log(`fonts: public/fonts/${name}  ${statSync(dest).size.toLocaleString('en')} B`)
}
if (failed) process.exit(1)
