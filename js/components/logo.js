/**
 * HAIDER wordmark approximation built from safe, static HTML and CSS geometry.
 * The mark intentionally avoids traced SVG paths because the original art file
 * is not available. Styling lives in css/app.css.
 */

const mark = () => `
  <span class="haider-logo__mark" aria-hidden="true">
    <span class="haider-logo__roof"></span>
    <span class="haider-logo__h"></span>
  </span>`;

export function compactLogo({ reversed = false } = {}) {
  const reversedClass = reversed ? ' is-reversed' : '';
  return `<span class="haider-logo haider-logo--compact${reversedClass}" role="img" aria-label="Haider Associates and Builders">${mark()}</span>`;
}

export function fullLogo({ reversed = false, compact = false } = {}) {
  if (compact) return compactLogo({ reversed });

  const reversedClass = reversed ? ' is-reversed' : '';
  return `
    <span class="haider-logo haider-logo--full${reversedClass}" role="img" aria-label="Haider Associates and Builders">
      ${mark()}
      <span class="haider-logo__copy" aria-hidden="true">
        <span class="haider-logo__name"><strong>HAIDER</strong></span>
        <span class="haider-logo__tagline">Associates &amp; Builders</span>
      </span>
    </span>`;
}
