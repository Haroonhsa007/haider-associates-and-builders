/**
 * Haider Associates & Builders identity.
 *
 * The mark is a vector rebuild of the monogram used on the D-12 Markaz signage:
 * a ground bar, two mirrored "sail" ribbons with inner pillars, a floating gable
 * and a square window. Geometry was traced from assets/images/logo/ artwork and
 * is drawn on 45 degree diagonals with a constant 11-unit stroke, so it stays
 * crisp from a 16px favicon up to signage scale.
 *
 * The mark inherits `currentColor`, which lets the same markup render red on
 * light surfaces and white on navy. Styling lives in css/brand-redesign.css.
 */

const MARK_PATHS = `
  <g fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="12">
    <path d="M0 114.5H200" />
    <path d="M41.5 120V30.5L81.5 70.5V120" />
    <path d="M60 50V120" />
    <path d="M158.5 120V30.5L118.5 70.5V120" />
    <path d="M140 50V120" />
    <path d="M64 38L100 7L136 38" />
  </g>
  <rect x="90" y="33" width="20" height="19" fill="currentColor" />`;

export function logoMark() {
  return `<svg class="haider-logo__mark" viewBox="0 0 200 120" role="presentation" aria-hidden="true" focusable="false">${MARK_PATHS}</svg>`;
}

export function compactLogo({ reversed = false } = {}) {
  const reversedClass = reversed ? ' is-reversed' : '';
  return `<span class="haider-logo haider-logo--compact${reversedClass}" role="img" aria-label="Haider Associates and Builders">${logoMark()}</span>`;
}

export function fullLogo({ reversed = false, compact = false } = {}) {
  if (compact) return compactLogo({ reversed });

  const reversedClass = reversed ? ' is-reversed' : '';
  return `
    <span class="haider-logo haider-logo--full${reversedClass}" role="img" aria-label="Haider Associates and Builders">
      ${logoMark()}
      <span class="haider-logo__copy" aria-hidden="true">
        <span class="haider-logo__name">HAIDER</span>
        <span class="haider-logo__tagline">Associates &amp; Builders</span>
      </span>
    </span>`;
}
