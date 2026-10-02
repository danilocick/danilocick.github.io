// Functional inline SVG icons: 1em × 1em, aria-hidden, stroke/fill = currentColor.
// Usage: <ArrowIcon />, <CopyIcon class="text-muted" />, <MenuIcon size="24" />.
// The class "icon" (portfolio.css) is always applied; extra classes merge in.
import { h, type FunctionalComponent, type VNode } from 'vue'

export interface IconProps {
  /** width/height; default '1em' */
  size?: string | number
}

function icon(name: string, children: () => VNode[]): FunctionalComponent<IconProps> {
  const C: FunctionalComponent<IconProps> = (props) =>
    h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: props.size ?? '1em',
        height: props.size ?? '1em',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.75,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
        focusable: 'false',
        class: 'icon',
      },
      children(),
    )
  C.props = ['size']
  C.displayName = name
  return C
}

const p = (d: string) => h('path', { d })

/** → (all left/right arrows are this SVG; locale strings contain no arrows) */
export const ArrowIcon = icon('ArrowIcon', () => [p('M4.5 12h15'), p('M13.5 6l6 6-6 6')])

/** ↑ (footer "Volver arriba") */
export const ArrowUpIcon = icon('ArrowUpIcon', () => [p('M12 19.5v-15'), p('M6 10.5l6-6 6 6')])

export const CopyIcon = icon('CopyIcon', () => [
  h('rect', { x: 8.5, y: 8.5, width: 12, height: 12, rx: 2 }),
  p('M15.5 5.5v-.5a2 2 0 0 0-2-2h-8.5a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h.5'),
])

export const CheckIcon = icon('CheckIcon', () => [p('M4.5 12.5l5 5 10-11')])

export const MailIcon = icon('MailIcon', () => [
  h('rect', { x: 3, y: 5, width: 18, height: 14, rx: 2 }),
  p('M3.5 6.5l8.5 6.5 8.5-6.5'),
])

export const LinkedInIcon = icon('LinkedInIcon', () => [
  h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3 }),
  p('M8 10.5V17'),
  h('circle', { cx: 8, cy: 7.25, r: 0.6, fill: 'currentColor' }),
  p('M12 17v-6.5'),
  p('M12 13.5c0-1.7 1.2-3 2.75-3S17 11.6 17 13.3V17'),
])

export const GitHubIcon = icon('GitHubIcon', () => [
  p(
    'M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  ),
])

export const MenuIcon = icon('MenuIcon', () => [p('M4 7h16'), p('M4 12h16'), p('M4 17h16')])

export const CloseIcon = icon('CloseIcon', () => [p('M6 6l12 12'), p('M18 6L6 18')])
