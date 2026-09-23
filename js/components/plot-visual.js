/**
 * Plot and land listings get a site-plan visual instead of a house photograph.
 *
 * Showing a villa on a bare-land record misrepresents the listing, which was
 * the specific complaint raised on the first revision. Until a listing carries
 * its own photography (for example the images used on the Zameen ad), a plot
 * renders as a measured parcel drawing: surrounding blocks in grey, the subject
 * parcel picked out in brand red, with the frontage dimensions and plot size.
 *
 * Any real image on `property.images` takes priority over this drawing, so
 * attaching photos later needs no code change.
 */

import { escapeHTML } from '../utils.js';

export const LAND_TYPES = new Set(['Residential Plot', 'Commercial Plot', 'Farmhouse']);

export function isLandListing(property) {
  return LAND_TYPES.has(property?.propertyType);
}

/** Small deterministic hash so each plot drawing differs but stays stable. */
function seedFrom(value = '') {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

/** Pulls "60 x 90" style frontage out of the listing title when present. */
function dimensionsFrom(property) {
  const match = String(property.title || '').match(/(\d+)\s*[x×]\s*(\d+)/i);
  return match ? `${match[1]} × ${match[2]}` : '';
}

export function plotVisual(property, { className = '' } = {}) {
  const seed = seedFrom(property.id || property.code || property.title || 'plot');
  const dimensions = dimensionsFrom(property);
  const size = property.size || '';
  const sector = property.sector || 'Islamabad';

  // Parcel placement varies a little per listing so a grid of cards reads as
  // real records rather than one repeated graphic.
  const offsetX = 24 + (seed % 5) * 6;
  const offsetY = 18 + ((seed >> 3) % 4) * 7;
  const wide = (seed >> 5) % 2 === 0;
  const parcelW = wide ? 196 : 168;
  const parcelH = wide ? 132 : 150;
  const px = 150 + offsetX;
  const py = 70 + offsetY;

  const label = dimensions || size;
  const sublabel = dimensions && size ? size : sector;

  return `<svg class="plot-visual ${escapeHTML(className)}" viewBox="0 0 480 320" role="img"
    aria-label="Site plan showing a ${escapeHTML(label || 'residential')} plot in ${escapeHTML(sector)}" focusable="false">
    <rect width="480" height="320" fill="#eef3fb" />

    <g fill="#dce5f2" stroke="#cbd7e8" stroke-width="1.5">
      <rect x="18" y="26" width="108" height="86" />
      <rect x="18" y="130" width="108" height="76" />
      <rect x="18" y="224" width="108" height="70" />
      <rect x="392" y="26" width="70" height="104" />
      <rect x="392" y="148" width="70" height="146" />
      <rect x="150" y="26" width="226" height="28" />
    </g>

    <g stroke="#c3d0e4" stroke-width="1" opacity="0.65">
      <path d="M150 0V320M376 0V320M0 26H480M0 294H480" fill="none" />
    </g>

    <g fill="#e6ecf6">
      <rect x="126" y="0" width="24" height="320" />
      <rect x="376" y="0" width="16" height="320" />
      <rect x="0" y="206" width="480" height="18" />
    </g>
    <g stroke="#ffffff" stroke-width="2" stroke-dasharray="10 9" opacity="0.9">
      <path d="M138 0V320M0 215H480" fill="none" />
    </g>

    <rect x="${px}" y="${py}" width="${parcelW}" height="${parcelH}"
      fill="rgb(229 57 53 / 0.12)" stroke="#e53935" stroke-width="3" />
    <g stroke="#e53935" stroke-width="3" fill="none">
      <path d="M${px} ${py + 16}V${py}h16M${px + parcelW - 16} ${py}h16v16
        M${px + parcelW} ${py + parcelH - 16}v16h-16M${px + 16} ${py + parcelH}h-16v-16" />
    </g>

    <text x="${px + parcelW / 2}" y="${py + parcelH / 2 - 4}" text-anchor="middle"
      font-family="Manrope, system-ui, sans-serif" font-size="30" font-weight="800" fill="#17233a">${escapeHTML(label)}</text>
    <text x="${px + parcelW / 2}" y="${py + parcelH / 2 + 22}" text-anchor="middle"
      font-family="Manrope, system-ui, sans-serif" font-size="15" font-weight="700" fill="#52606d">${escapeHTML(sublabel)}</text>

    <g transform="translate(432 268)">
      <path d="M0 -16L7 4L0 -1L-7 4Z" fill="#2454a6" />
      <text x="0" y="18" text-anchor="middle" font-family="Manrope, system-ui, sans-serif"
        font-size="12" font-weight="800" fill="#2454a6">N</text>
    </g>
  </svg>`;
}
