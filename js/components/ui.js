import { createIcons, icons } from 'lucide';
import { escapeHTML, formatDate, formatPKR } from '../utils.js';
import { isLandListing, plotVisual } from './plot-visual.js';

export function icon(name, label = '') {
  const safeLabel = escapeHTML(label);
  return `<i data-lucide="${escapeHTML(name)}"${label ? ` role="img" aria-label="${safeLabel}"` : ' aria-hidden="true"'}></i>`;
}

export function renderIcons() {
  createIcons({ icons, attrs: { 'stroke-width': 1.75 } });
}

export function toast(message, tone = 'success') {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const item = document.createElement('div');
  item.className = `toast toast-${tone}`;
  item.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  item.innerHTML = `${icon(tone === 'error' ? 'circle-alert' : 'circle-check')}<span>${escapeHTML(message)}</span>`;
  region.append(item);
  renderIcons();
  requestAnimationFrame(() => item.classList.add('is-visible'));
  window.setTimeout(() => {
    item.classList.remove('is-visible');
    window.setTimeout(() => item.remove(), 220);
  }, 3200);
}

export function statusBadge(status = 'Unknown') {
  const key = String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `<span class="status-badge status-${key}">${escapeHTML(status)}</span>`;
}

export function pageHeader({ title, eyebrow = '', subtitle = '', action = '', actionIcon = 'plus' }) {
  return `<header class="page-header">
    <div>
      ${eyebrow ? `<p class="page-eyebrow">${escapeHTML(eyebrow)}</p>` : ''}
      <h1 id="page-title" tabindex="-1">${escapeHTML(title)}</h1>
      ${subtitle ? `<p>${escapeHTML(subtitle)}</p>` : ''}
    </div>
    ${action ? `<button class="btn btn-primary" type="button" data-action="primary">${icon(actionIcon)}<span>${escapeHTML(action)}</span></button>` : ''}
  </header>`;
}

export function emptyState(title, body, action = '') {
  return `<section class="empty-state" aria-label="Empty state">
    <div class="empty-icon">${icon('folder-open')}</div>
    <h2>${escapeHTML(title)}</h2>
    <p>${escapeHTML(body)}</p>
    ${action ? `<button class="btn btn-primary" type="button" data-action="primary">${icon('plus')}<span>${escapeHTML(action)}</span></button>` : ''}
  </section>`;
}

export function loadingState() {
  return `<div class="skeleton-page" aria-label="Loading" role="status">
    <span class="sr-only">Loading page</span>
    <div class="skeleton-line skeleton-title"></div>
    <div class="skeleton-grid">${Array.from({ length: 6 }, () => '<div class="skeleton-card"></div>').join('')}</div>
  </div>`;
}

/** Transaction label shown on the listing image, in brand red per the direction. */
function transactionTag(property) {
  const type = property.transactionType || 'Sale';
  if (type === 'Rent') return '<span class="property-tag property-tag--rent">For Rent</span>';
  if (type === 'Sale & Rent') return '<span class="property-tag">Sale or Rent</span>';
  return '<span class="property-tag">For Sale</span>';
}

export function listingMedia(property) {
  const image = property.images?.find(Boolean);
  if (!image && isLandListing(property)) return plotVisual(property);
  const src = image || './assets/images/properties/islamabad-villa-hero.jpg';
  return `<img src="${escapeHTML(src)}" width="720" height="480" loading="lazy" alt="${escapeHTML(property.title)}" />`;
}

export function propertyCard(property, { publicView = false } = {}) {
  const isRent = property.transactionType === 'Rent';
  const price = isRent && property.rentPrice
    ? `${formatPKR(property.rentPrice)} <small>/ month</small>`
    : formatPKR(property.demandPrice || property.rentPrice);
  const route = escapeHTML(publicView ? `/properties/${property.id}` : `/app/properties/${property.id}`);
  const enquiry = `Assalam o Alaikum, I am interested in ${property.title} (${property.code}).`;
  return `<article class="property-card">
    <a class="property-media" href="#${route}" aria-label="View ${escapeHTML(property.title)}">
      ${transactionTag(property)}
      ${listingMedia(property)}
    </a>
    <div class="property-card-body">
      <div class="property-card-meta"><span>${escapeHTML(property.propertyType)}</span>${statusBadge(property.status)}</div>
      <h3><a href="#${route}">${escapeHTML(property.title)}</a></h3>
      <p>${icon('map-pin')} ${escapeHTML(property.sector)}, Islamabad</p>
      <dl class="property-facts">
        <div><dt>Size</dt><dd>${escapeHTML(property.size)}</dd></div>
        ${property.bedrooms ? `<div><dt>Beds</dt><dd>${escapeHTML(property.bedrooms)}</dd></div>` : ''}
        ${property.bathrooms ? `<div><dt>Baths</dt><dd>${escapeHTML(property.bathrooms)}</dd></div>` : ''}
      </dl>
      <p class="property-price">${price}</p>
      ${publicView ? `<div class="property-card-actions">
        <a class="btn btn-primary" href="tel:03009146600">${icon('phone')} Call</a>
        <a class="btn btn-whatsapp" href="https://wa.me/923009146600?text=${encodeURIComponent(enquiry)}" target="_blank" rel="noreferrer">${icon('message-circle')} WhatsApp</a>
      </div>` : ''}
    </div>
  </article>`;
}

export function timeline(events = []) {
  if (!events.length) return emptyState('No activity yet', 'Updates for this record will appear here.');
  return `<ol class="timeline">${events.map((event, index) => `<li class="timeline-item${index === 0 ? ' is-current' : ''}">
    <div class="timeline-icon">${icon(event.icon || 'history')}</div>
    <div><h4>${escapeHTML(event.title || event.type || 'Activity')}</h4><p>${escapeHTML(event.message || '')}</p><time datetime="${escapeHTML(event.timestamp || event.createdAt || '')}">${formatDate(event.timestamp || event.createdAt)} · ${escapeHTML(event.actor || 'HAIDER OS')}</time></div>
  </li>`).join('')}</ol>`;
}

export function simpleBars(items, { valueFormatter = value => value } = {}) {
  const max = Math.max(...items.map(item => Number(item.value) || 0), 1);
  return `<div class="bar-chart" role="img" aria-label="Bar chart">${items.map(item => {
    const width = Math.max(4, ((Number(item.value) || 0) / max) * 100);
    return `<div class="bar-row"><span>${escapeHTML(item.label)}</span><div class="bar-track"><span class="bar-fill" style="--bar-width:${width}%"></span></div><strong>${escapeHTML(valueFormatter(item.value))}</strong></div>`;
  }).join('')}</div>`;
}

export function dataTable({ columns, rows, entity, emptyTitle = 'No records found', actions = true }) {
  if (!rows.length) return emptyState(emptyTitle, 'Change the filters or add a new record.');
  const header = columns.map(column => `<th scope="col">${escapeHTML(column.label)}</th>`).join('');
  const body = rows.map(row => `<tr data-row-id="${escapeHTML(row.id)}" tabindex="0">
    ${columns.map(column => `<td data-label="${escapeHTML(column.label)}">${column.render ? column.render(row) : escapeHTML(row[column.key] ?? 'Not set')}</td>`).join('')}
    ${actions ? `<td data-label="Actions"><div class="row-actions">
      <button class="icon-btn" type="button" data-row-action="view" data-id="${escapeHTML(row.id)}" aria-label="View record">${icon('arrow-up-right')}</button>
      <button class="icon-btn" type="button" data-row-action="edit" data-id="${escapeHTML(row.id)}" aria-label="Edit record">${icon('pencil')}</button>
      <button class="icon-btn danger" type="button" data-row-action="delete" data-id="${escapeHTML(row.id)}" aria-label="Delete record">${icon('trash-2')}</button>
    </div></td>` : ''}
  </tr>`).join('');
  return `<div class="table-wrap"><table class="data-table" data-entity="${escapeHTML(entity)}"><thead><tr>${header}${actions ? '<th scope="col"><span class="sr-only">Actions</span></th>' : ''}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function fieldTemplate(field, value) {
  const id = `field-${field.name}`;
  const required = field.required ? ' required aria-required="true"' : '';
  const describedBy = `${id}-help ${id}-error`;
  const safeValue = escapeHTML(value ?? field.defaultValue ?? '');
  let control;
  if (field.type === 'select') {
    control = `<select id="${id}" name="${escapeHTML(field.name)}" aria-describedby="${describedBy}"${required}>${(field.options || []).map(option => {
      const optionValue = typeof option === 'string' ? option : option.value;
      const optionLabel = typeof option === 'string' ? option : option.label;
      return `<option value="${escapeHTML(optionValue)}"${String(optionValue) === String(value) ? ' selected' : ''}>${escapeHTML(optionLabel)}</option>`;
    }).join('')}</select>`;
  } else if (field.type === 'textarea') {
    control = `<textarea id="${id}" name="${escapeHTML(field.name)}" rows="4" aria-describedby="${describedBy}"${required}>${safeValue}</textarea>`;
  } else if (field.type === 'checkbox') {
    control = `<input id="${id}" name="${escapeHTML(field.name)}" type="checkbox" value="true"${value ? ' checked' : ''} aria-describedby="${describedBy}" />`;
  } else {
    control = `<input id="${id}" name="${escapeHTML(field.name)}" type="${escapeHTML(field.type || 'text')}" value="${safeValue}" aria-describedby="${describedBy}"${field.min != null ? ` min="${field.min}"` : ''}${field.max != null ? ` max="${field.max}"` : ''}${field.step != null ? ` step="${field.step}"` : ''}${field.placeholder ? ` placeholder="${escapeHTML(field.placeholder)}"` : ''}${required} />`;
  }
  return `<div class="form-field${field.full ? ' field-full' : ''}${field.type === 'checkbox' ? ' field-checkbox' : ''}">
    <label for="${id}">${escapeHTML(field.label)}${field.required ? ' <span aria-hidden="true">*</span>' : ''}</label>
    ${control}
    <small id="${id}-help">${escapeHTML(field.help || '')}</small>
    <span class="field-error" id="${id}-error" role="alert"></span>
  </div>`;
}

export function openForm({ title, description = '', fields = [], initial = {}, submitLabel = 'Save record', size = 'large' }) {
  return new Promise(resolve => {
    const previousFocus = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.className = `modal modal-${size}`;
    dialog.innerHTML = `<form method="dialog" class="modal-panel" novalidate>
      <header class="modal-header"><div><h2 id="form-dialog-title">${escapeHTML(title)}</h2>${description ? `<p>${escapeHTML(description)}</p>` : ''}</div><button class="icon-btn" value="cancel" formnovalidate aria-label="Close dialog">${icon('x')}</button></header>
      <div class="modal-body form-grid">${fields.map(field => fieldTemplate(field, initial[field.name])).join('')}</div>
      <footer class="modal-footer"><button type="button" class="btn btn-secondary" data-cancel>Cancel</button><button type="submit" class="btn btn-primary">${icon('save')}<span>${escapeHTML(submitLabel)}</span></button></footer>
    </form>`;
    dialog.setAttribute('aria-labelledby', 'form-dialog-title');
    document.body.append(dialog);
    renderIcons();
    const close = result => {
      dialog.close();
      dialog.remove();
      previousFocus?.focus?.();
      resolve(result);
    };
    dialog.querySelector('[data-cancel]').addEventListener('click', () => close(null));
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(null); });
    dialog.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.checkValidity()) {
        form.querySelectorAll(':invalid').forEach(control => {
          control.setAttribute('aria-invalid', 'true');
          const error = form.querySelector(`#${control.id}-error`);
          if (error) error.textContent = control.validationMessage;
        });
        form.querySelector(':invalid')?.focus();
        return;
      }
      const data = {};
      fields.forEach(field => {
        const input = form.elements[field.name];
        if (field.type === 'checkbox') data[field.name] = input.checked;
        else if (field.type === 'number') data[field.name] = input.value === '' ? 0 : Number(input.value);
        else data[field.name] = input.value.trim?.() ?? input.value;
      });
      close(data);
    });
    dialog.showModal();
    dialog.querySelector('input, select, textarea, button')?.focus();
  });
}

export function confirmDialog({ title = 'Confirm action', message, confirmLabel = 'Confirm', tone = 'danger' }) {
  return new Promise(resolve => {
    const previousFocus = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.className = 'modal modal-small';
    dialog.innerHTML = `<div class="modal-panel confirm-panel" role="document">
      <div class="confirm-icon ${tone}">${icon(tone === 'danger' ? 'triangle-alert' : 'circle-help')}</div>
      <h2>${escapeHTML(title)}</h2><p>${escapeHTML(message)}</p>
      <div class="modal-footer"><button class="btn btn-secondary" type="button" data-value="false">Cancel</button><button class="btn ${tone === 'danger' ? 'btn-danger' : 'btn-primary'}" type="button" data-value="true">${escapeHTML(confirmLabel)}</button></div>
    </div>`;
    document.body.append(dialog);
    renderIcons();
    const finish = value => { dialog.close(); dialog.remove(); previousFocus?.focus?.(); resolve(value); };
    dialog.querySelectorAll('[data-value]').forEach(button => button.addEventListener('click', () => finish(button.dataset.value === 'true')));
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(false); });
    dialog.showModal();
    dialog.querySelector('[data-value="false"]')?.focus();
  });
}
