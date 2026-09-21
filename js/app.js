import '@fontsource-variable/manrope';
import '@fontsource/barlow-condensed/latin-800.css';
import '../css/app.css';
import '../css/brand-redesign.css';
import { store } from './state.js';
import { downloadJSON, escapeHTML } from './utils.js';
import { matchRoute, navigate, parseLocation, startRouter } from './router.js';
import { appShell, authShell, canAccess, publicShell } from './components/shell.js';
import { confirmDialog, icon, openForm, renderIcons, toast } from './components/ui.js';
import { renderPublicPage } from './pages/public.js';
import { loginPage } from './pages/auth.js';
import { dashboardPage } from './pages/dashboard.js';
import { collectionPage, getEntityConfig } from './pages/collections.js';
import { detailPage } from './pages/details.js';
import { reportsPage, settingsPage } from './pages/reports.js';

const app = document.getElementById('app');
let currentLocation = parseLocation();
let isRendering = false;

function normalizeState(raw) {
  return {
    ...raw,
    entities: raw.entities || raw,
    company: raw.company || {
      name: raw.settings?.companyName,
      contactName: raw.settings?.primaryContact,
      phone: raw.settings?.phone,
      city: [raw.settings?.city, raw.settings?.country].filter(Boolean).join(', '),
    },
  };
}

function routeDetails(path) {
  const routes = [
    ['/properties/:id', 'public-property'],
    ['/app/properties/:id', 'properties-detail'], ['/app/leads/:id', 'leads-detail'], ['/app/clients/:id', 'clients-detail'], ['/app/agents/:id', 'agents-detail'], ['/app/deals/:id', 'deals-detail'], ['/app/rentals/:id', 'rentals-detail'], ['/app/projects/:id', 'projects-detail'],
  ];
  for (const [pattern, name] of routes) {
    const params = matchRoute(path, pattern);
    if (params) return { name, params };
  }
  return null;
}

function titleFor(path) {
  if (path === '/') return 'Haider Associates & Builders | Islamabad';
  const name = path.split('/').filter(Boolean).pop() || 'Home';
  return `${name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} | HAIDER OS`;
}

function render(location = parseLocation(), { focus = true } = {}) {
  if (isRendering) return;
  isRendering = true;
  currentLocation = location;
  const rawState = store.getState();
  const state = normalizeState(rawState);
  const session = store.getSession();
  const { path, query } = location;
  const detail = routeDetails(path);
  let html;

  try {
    if (path === '/login') {
      if (session) {
        navigate('/app/dashboard', { replace: true });
        return;
      }
      html = authShell(loginPage());
    } else if (path.startsWith('/app')) {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      const routeKey = path.split('/')[2] || 'dashboard';
      if (!canAccess(session.role, routeKey)) {
        toast('Your demo role does not include this module.', 'error');
        navigate('/app/dashboard', { replace: true });
        return;
      }
      let content;
      if (path === '/app' || path === '/app/dashboard') content = dashboardPage(state, session);
      else if (detail?.name.endsWith('-detail')) content = detailPage(detail.name.replace('-detail', ''), detail.params.id, state);
      else if (path === '/app/reports') content = reportsPage(state, query);
      else if (path === '/app/settings') content = settingsPage(state, session);
      else content = collectionPage(routeKey, state, query);
      html = appShell(content, { path, state, session });
    } else {
      const params = detail?.name === 'public-property' ? detail.params : null;
      html = publicShell(renderPublicPage(path, params, query, state), path);
    }

    app.innerHTML = html;
    app.setAttribute('aria-busy', 'false');
    document.title = titleFor(path);
    renderIcons();
    bindPageBehaviors();
    if (focus) window.setTimeout(() => document.getElementById('page-title')?.focus({ preventScroll: true }), 30);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  } catch (error) {
    console.error(error);
    app.innerHTML = `<main class="fatal-error" id="main-content"><div>${icon('triangle-alert')}</div><h1>HAIDER OS could not render this page.</h1><p>${escapeHTML(error.message)}</p><a class="btn btn-primary" href="#/app/dashboard">Return to dashboard</a></main>`;
    renderIcons();
  } finally {
    isRendering = false;
  }
}

function currentEntityContext() {
  const { path } = currentLocation;
  if (!path.startsWith('/app/')) return null;
  const key = path.split('/')[2];
  const id = path.split('/')[3] || null;
  return { key, id };
}

async function editEntity(entity, id = null, preset = {}) {
  const state = normalizeState(store.getState());
  const config = getEntityConfig(entity, state);
  if (!config) return;
  const initial = id ? state.entities[entity].find(item => item.id === id) : preset;
  const values = await openForm({
    title: id ? `Edit ${config.singular.toLowerCase()}` : `Add ${config.singular.toLowerCase()}`,
    description: id ? `Update ${initial?.code || 'this record'} in the local workspace.` : 'Create a demonstration record stored in this browser.',
    fields: config.fields,
    initial: initial || {},
    submitLabel: id ? 'Save changes' : `Add ${config.singular.toLowerCase()}`,
  });
  if (!values) return;
  if (entity === 'properties' && !id) {
    values.images = ['./assets/images/properties/islamabad-villa-hero.jpg'];
    values.isPublic = true;
    values.dateAdded = new Date().toISOString();
  }
  if (entity === 'projects' && !id) values.image = './assets/images/projects/villa-construction.jpg';
  if (entity === 'documents' && !id) {
    values.storage = 'mock-local-metadata';
    values.uploadedAt = new Date().toISOString();
  }
  id ? store.update(entity, id, values) : store.create(entity, values);
  toast(`${config.singular} ${id ? 'updated' : 'created'} successfully.`);
}

async function deleteEntity(entity, id) {
  const state = normalizeState(store.getState());
  const record = state.entities[entity]?.find(item => item.id === id);
  if (!record) return;
  const confirmed = await confirmDialog({ title: `Delete ${record.title || record.name || record.code}?`, message: 'This removes the local demo record and cannot be undone.', confirmLabel: 'Delete record' });
  if (!confirmed) return;
  store.remove(entity, id);
  toast('Record deleted.');
  if (currentLocation.path.endsWith(`/${id}`)) navigate(`/app/${entity}`);
}

function openGlobalSearch() {
  const state = normalizeState(store.getState());
  const collections = [
    ['properties', 'Property', 'building-2'], ['leads', 'Lead', 'contact-round'], ['clients', 'Client', 'users'], ['agents', 'Agent', 'badge-user'], ['deals', 'Deal', 'handshake'], ['projects', 'Project', 'hard-hat'],
  ];
  const index = collections.flatMap(([entity, label, iconName]) => state.entities[entity].map(item => ({ entity, label, iconName, id: item.id, title: item.title || item.name || item.code, meta: [item.code, item.sector, item.phone, item.status, item.stage, item.location].filter(Boolean).join(' · ') })));
  const previousFocus = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'command-palette';
  dialog.innerHTML = `<div class="command-panel"><header>${icon('search')}<label class="sr-only" for="global-search-input">Search HAIDER OS</label><input id="global-search-input" autocomplete="off" placeholder="Search properties, people and deals" /><kbd>Esc</kbd></header><div class="command-results" role="listbox" aria-live="polite"></div><footer><span>Use ↑ ↓ to move</span><span>Enter to open</span></footer></div>`;
  document.body.append(dialog);
  renderIcons();
  const input = dialog.querySelector('input');
  const results = dialog.querySelector('.command-results');
  let activeIndex = 0;
  let filtered = index.slice(0, 10);
  const draw = () => {
    const q = input.value.trim().toLowerCase();
    filtered = index.filter(item => !q || `${item.title} ${item.meta} ${item.label}`.toLowerCase().includes(q)).slice(0, 12);
    activeIndex = Math.min(activeIndex, Math.max(0, filtered.length - 1));
    results.innerHTML = filtered.length ? `<p>${filtered.length} results</p>${filtered.map((item, indexValue) => `<a role="option" aria-selected="${indexValue === activeIndex}" class="${indexValue === activeIndex ? 'is-active' : ''}" href="#/app/${item.entity}/${item.id}">${icon(item.iconName)}<span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.label)} · ${escapeHTML(item.meta)}</small></span>${icon('arrow-up-right')}</a>`).join('')}` : '<div class="command-empty">No matching records.</div>';
    renderIcons();
  };
  const close = () => { dialog.close(); dialog.remove(); previousFocus?.focus?.(); };
  input.addEventListener('input', draw);
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); draw(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); draw(); }
    if (event.key === 'Enter' && filtered[activeIndex]) { event.preventDefault(); const item = filtered[activeIndex]; close(); navigate(`/app/${item.entity}/${item.id}`); }
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  results.addEventListener('click', close);
  dialog.showModal();
  draw();
  input.focus();
}

function bindPageBehaviors() {
  document.querySelectorAll('.lead-card[draggable="true"]').forEach(card => {
    card.addEventListener('dragstart', event => event.dataTransfer.setData('text/plain', card.dataset.leadId));
  });
  document.querySelectorAll('.pipeline-column').forEach(column => {
    column.addEventListener('dragover', event => event.preventDefault());
    column.addEventListener('drop', event => {
      event.preventDefault();
      const id = event.dataTransfer.getData('text/plain');
      moveLead(id, column.dataset.stage);
    });
  });
}

const stageStatus = { New: 'New', Contacted: 'Contacted', Qualified: 'Requirement Confirmed', Visit: 'Site Visit', Negotiation: 'Negotiation', Closed: 'Closed', Lost: 'Lost' };
function moveLead(id, stage) {
  if (!id || !stageStatus[stage]) return;
  store.update('leads', id, { status: stageStatus[stage] });
  toast(`Lead moved to ${stage}.`);
}

document.addEventListener('submit', async event => {
  const form = event.target;
  if (form.matches('[data-login-form]')) {
    event.preventDefault();
    const data = new FormData(form);
    const session = store.login(data.get('email'), data.get('password'));
    const error = form.querySelector('[data-login-error]');
    if (!session) { error.textContent = 'Email or password is incorrect. Use a demo account below.'; form.querySelector('#login-email').setAttribute('aria-invalid', 'true'); return; }
    toast('Signed in successfully.');
    navigate('/app/dashboard');
  }
  if (form.matches('[data-filter-form], [data-report-filter]')) {
    event.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((value, key) => { if (value) params.set(key, value); });
    const base = form.matches('[data-report-filter]') ? '/app/reports' : `/app/${form.dataset.entity}`;
    navigate(`${base}${params.size ? `?${params}` : ''}`);
  }
  if (form.matches('[data-public-property-search]')) {
    event.preventDefault();
    const params = new URLSearchParams();
    new FormData(form).forEach((value, key) => { if (value) params.set(key, value); });
    navigate(`/properties${params.size ? `?${params}` : ''}`);
  }
  if (form.matches('[data-contact-form]')) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form));
    store.create('leads', { ...data, source: 'Website', status: 'New', priority: 'Medium', leadType: 'Buyer', preferredLocation: 'Islamabad', createdDate: new Date().toISOString() });
    form.reset();
    toast('Enquiry saved to this browser. Haider Associates can follow up from the Leads module.');
  }
  if (form.matches('[data-company-settings]')) {
    event.preventDefault();
    const current = store.exportData({ asObject: true });
    const data = Object.fromEntries(new FormData(form));
    current.settings = { ...current.settings, companyName: data.name, primaryContact: data.contactName, phone: data.phone, city: data.city.replace(/,.*$/, '') };
    store.importData(current);
    toast('Company profile updated.');
  }
});

document.addEventListener('change', event => {
  if (event.target.matches('[data-stage-select]')) moveLead(event.target.dataset.stageSelect, event.target.value);
  if (event.target.matches('[data-import-input]')) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('Import file must be smaller than 5 MB.', 'error'); return; }
    file.text().then(async text => {
      const confirmed = await confirmDialog({ title: 'Replace local workspace?', message: 'Importing valid JSON replaces every current demo record.', confirmLabel: 'Import data', tone: 'danger' });
      if (!confirmed) return;
      try { store.importData(text); toast('Workspace imported successfully.'); } catch (error) { toast(error.message, 'error'); }
    });
  }
});

document.addEventListener('click', async event => {
  const target = event.target.closest('button, a, label');
  if (!target) return;
  const action = target.dataset.action;
  const rowAction = target.dataset.rowAction;
  const detailAction = target.dataset.detailAction;
  const context = currentEntityContext();

  if (target.dataset.demoLogin) {
    const session = store.login(target.dataset.demoLogin, 'demo123');
    if (session) { toast(`Signed in as ${session.role}.`); navigate('/app/dashboard'); }
  }
  if (rowAction) {
    const table = target.closest('[data-entity]');
    const entity = table?.dataset.entity || context?.key;
    if (rowAction === 'view' && entity !== 'reports') navigate(`/app/${entity}/${target.dataset.id}`);
    if (rowAction === 'edit') await editEntity(entity, target.dataset.id);
    if (rowAction === 'delete') await deleteEntity(entity, target.dataset.id);
  }
  if (detailAction) {
    const { entity, id } = target.dataset;
    if (detailAction === 'edit') await editEntity(entity, id);
    if (detailAction === 'delete') await deleteEntity(entity, id);
    if (detailAction === 'duplicate') {
      const state = normalizeState(store.getState());
      const original = state.entities[entity].find(item => item.id === id);
      if (original) { const { id: oldId, code, createdAt, updatedAt, ...copy } = original; store.create(entity, { ...copy, title: `${copy.title} (Copy)`, status: 'Inactive', dateAdded: new Date().toISOString() }); toast('Property duplicated as an inactive record.'); }
    }
  }
  if (action === 'primary' && context && getEntityConfig(context.key, normalizeState(store.getState()))) await editEntity(context.key);
  if (action === 'logout') { store.logout(); toast('Signed out.'); navigate('/login'); }
  if (action === 'toggle-password') {
    const input = document.getElementById('login-password');
    input.type = input.type === 'password' ? 'text' : 'password';
    target.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
  }
  if (action === 'open-search') openGlobalSearch();
  if (action === 'toggle-notifications') {
    const panel = document.getElementById('notification-panel');
    panel.hidden = !panel.hidden;
    target.setAttribute('aria-expanded', String(!panel.hidden));
  }
  if (action === 'mark-notifications-read') {
    normalizeState(store.getState()).entities.notifications.filter(item => !item.read).forEach(item => store.update('notifications', item.id, { read: true }));
    toast('Notifications marked as read.');
  }
  if (action === 'toggle-mobile-menu') {
    const drawer = document.getElementById('mobile-drawer');
    drawer.hidden = !drawer.hidden;
    document.body.classList.toggle('drawer-open', !drawer.hidden);
  }
  if (action === 'toggle-public-menu') {
    const nav = document.querySelector('.public-nav');
    nav.classList.toggle('is-open');
    target.setAttribute('aria-expanded', String(nav.classList.contains('is-open')));
  }
  if (action === 'public-inquiry') {
    const state = normalizeState(store.getState());
    const property = state.entities.properties.find(item => item.id === target.dataset.id);
    const values = await openForm({ title: 'Property enquiry', fields: [{ name: 'name', label: 'Full name', required: true }, { name: 'phone', label: 'Phone', required: true }, { name: 'email', label: 'Email', type: 'email' }, { name: 'notes', label: 'Message', type: 'textarea', full: true }], submitLabel: 'Send enquiry' });
    if (values) { store.create('leads', { ...values, source: 'Website', status: 'New', priority: 'Medium', leadType: 'Buyer', requirement: property?.title, preferredLocation: property?.sector, interestedPropertyIds: [property?.id].filter(Boolean) }); toast('Enquiry saved to this browser.'); }
  }
  if (action === 'schedule-visit') {
    const state = normalizeState(store.getState());
    const config = getEntityConfig('visits', state);
    const values = await openForm({ title: 'Schedule site visit', fields: config.fields, initial: { propertyId: target.dataset.id, status: 'Scheduled' }, submitLabel: 'Schedule visit' });
    if (values) { store.create('visits', values); toast('Site visit scheduled.'); }
  }
  if (action === 'add-related-document') await editEntity('documents', null, { entityType: 'Property', entityLabel: target.dataset.id, status: 'Current' });
  if (action === 'print-report') window.print();
  if (action === 'export-data') {
    const filename = `haider-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadJSON(store.exportData({ asObject: true }), filename);
    toast('Workspace exported as JSON.');
  }
  if (action === 'reset-data') {
    const confirmed = await confirmDialog({ title: 'Reset demo workspace?', message: 'This removes local changes and restores the original seeded records.', confirmLabel: 'Reset data' });
    if (confirmed) { store.reset(); toast('Demo data restored.'); }
  }
  if (target.dataset.galleryImage) {
    const dialog = document.createElement('dialog');
    dialog.className = 'image-lightbox';
    dialog.innerHTML = `<button class="icon-btn" aria-label="Close image">${icon('x')}</button><img src="${escapeHTML(target.dataset.galleryImage)}" alt="Expanded property view" />`;
    document.body.append(dialog); renderIcons(); dialog.querySelector('button').addEventListener('click', () => { dialog.close(); dialog.remove(); }); dialog.addEventListener('cancel', () => dialog.remove()); dialog.showModal();
  }
});

document.addEventListener('keydown', event => {
  const typing = event.target.matches('input, textarea, select, [contenteditable="true"]');
  if (event.key === '/' && !typing && store.getSession()) { event.preventDefault(); openGlobalSearch(); }
  if (event.key === 'Enter' && event.target.matches('tr[data-row-id]')) {
    const entity = event.target.closest('table')?.dataset.entity;
    if (entity && entity !== 'reports') navigate(`/app/${entity}/${event.target.dataset.rowId}`);
  }
});

store.init();
store.subscribe(() => render(currentLocation, { focus: false }));
startRouter(location => render(location));
