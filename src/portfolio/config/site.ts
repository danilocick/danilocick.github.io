// Site configuration and decisions (ADAPTATIONS B, C, D).
import type { ContactMode, SiteConfig } from '../content/types'

export const siteUrl = 'https://danilocick.github.io/' as const

/** Optional Web3Forms access key from .env.production.local (public by design). */
export const web3formsKey: string = import.meta.env.VITE_WEB3FORMS_KEY ?? ''

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** §12 mode detection: a missing, placeholder or nil key falls back to mailto — a legitimate production mode. */
export const contactMode: ContactMode =
  UUID.test(web3formsKey) && web3formsKey !== '00000000-0000-0000-0000-000000000000' ? 'web3forms' : 'mailto'

/** Dani takes outside client projects (his #1 goal is freelance clients). */
export const clientWork = true

/** E.164 digits, or false = no WhatsApp row. */
export const whatsapp: string | false = false

/** Legal notice fields; each line renders ONLY when non-empty. TODO(Dani): confirm with the gestoría. */
export const legal = { nif: '', address: '' }

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

export const site: SiteConfig = {
  siteUrl,
  web3formsKey,
  contactMode,
  clientWork,
  whatsapp,
  legal,
}
