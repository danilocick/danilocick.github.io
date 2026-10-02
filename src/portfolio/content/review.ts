// Claims and commitments Dani must confirm (spec §11 🔶 keys).
// REPORT ONLY (ADAPTATIONS A): scripts/checks.mjs prints this list under
// "Pending for Dani"; it never fails the build.
import type { ReviewItem } from './types'

export const review: ReviewItem[] = [
  { key: 'hero.subLead', reason: 'Positioning: "a medida para pymes" — is this the offer?' },
  { key: 'hero.subExamples', reason: 'Example outcomes promised in the hero.' },
  { key: 'hero.ctaNote', reason: 'Commitment: replies personally within 48 working hours.' },
  { key: 'hero.proof.years', reason: '"5+ años" is Dani\'s own figure (Sep 2021 – today, plus internship).' },
  { key: 'hero.proof.apps', reason: '"30+ aplicaciones" is not in the CV; the CV must not contradict it.' },
  { key: 'hero.proof.solo', reason: 'Claim: one person, start to finish.' },
  { key: 'chores.items.*.note', reason: 'Plain-language results shown for each example chore.' },
  { key: 'problems.*.answer', reason: 'How each problem would be solved (service promise).' },
  { key: 'about.bio1', reason: 'Bio: place of residence and "más de cinco años".' },
  { key: 'about.bio2', reason: 'Bio: scope of work (front, back, data).' },
  { key: 'about.case.*', reason: 'Unex case: every statement must be traceable to public/cv.pdf.' },
  { key: 'about.facts.mode.value', reason: 'Work mode: "En remoto, con base en Barcelona".' },
  { key: 'experience.unex.role', reason: 'Unex role as written on the CV ("Desarrollador Full Stack").' },
  { key: 'contact.availability', reason: 'Commitment: scoped, remote projects with a fixed quote (clientWork).' },
  { key: 'contact.next.1', reason: 'Commitment: free 30-minute call.' },
  { key: 'contact.next.2', reason: 'Commitment: written proposal with time and price.' },
  { key: 'contact.next.3', reason: 'Commitment: start only if it suits the client.' },
  { key: 'contact.success', reason: 'Promise to reply to the sender.' },
  { key: 'contact.privacy', reason: 'Privacy first layer (GDPR) — confirm wording.' },
  { key: 'contact.privacyProcessor', reason: 'Names Web3Forms as processor (web3forms mode only).' },
  { key: 'footer.colophon', reason: 'Claims: self-hosted fonts, no cookies, no analytics.' },
  { key: 'legal.*', reason: 'Legal notice (LSSI art. 10) and privacy policy — confirm with the gestoría.' },
]
