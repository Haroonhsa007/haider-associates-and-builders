import { fullLogo, compactLogo } from './logo.js';
import { icon, statusBadge } from './ui.js';
import { escapeHTML } from '../utils.js';

export const APP_NAV = [
  { group: 'Overview', items: [{ key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' }] },
  { group: 'Real Estate', items: [
    { key: 'properties', label: 'Properties', icon: 'building-2' },
    { key: 'leads', label: 'Leads', icon: 'contact-round' },
    { key: 'clients', label: 'Clients', icon: 'users' },
    { key: 'visits', label: 'Site Visits', icon: 'calendar-days' },
    { key: 'deals', label: 'Deals', icon: 'handshake' },
    { key: 'rentals', label: 'Rentals', icon: 'key-round' },
  ] },
  { group: 'Operations', items: [
    { key: 'agents', label: 'Agents', icon: 'badge-user' },
    { key: 'commissions', label: 'Commissions', icon: 'badge-percent' },
    { key: 'documents', label: 'Documents', icon: 'files' },
    { key: 'reports', label: 'Reports', icon: 'chart-no-axes-combined' },
  ] },
  { group: 'Construction', items: [{ key: 'projects', label: 'Projects', icon: 'hard-hat' }] },
  { group: 'System', items: [{ key: 'settings', label: 'Settings', icon: 'settings' }] },
];

const roleRoutes = {
  'Super Admin': '*',
  Admin: '*',
  Manager: '*',
  Agent: ['dashboard', 'properties', 'leads', 'clients', 'visits', 'deals', 'documents'],
  Accountant: ['dashboard', 'deals', 'rentals', 'commissions', 'documents', 'reports'],
  'Project Manager': ['dashboard', 'clients', 'projects', 'documents', 'reports'],
};

export function canAccess(role, routeKey) {
  const routes = roleRoutes[role] || roleRoutes.Agent;
  return routes === '*' || routes.includes(routeKey);
}

function publicNav(path) {
  const links = [
    ['/', 'Home'], ['/properties', 'Properties'], ['/services', 'Services'], ['/about', 'About'], ['/contact', 'Contact'],
  ];
  return links.map(([href, label]) => `<a href="#${href}"${path === href || (href !== '/' && path.startsWith(href)) ? ' aria-current="page"' : ''}>${escapeHTML(label)}</a>`).join('');
}

export const PHONE_DISPLAY = '0300-9146600';
export const PHONE_TEL = '03009146600';
export const WHATSAPP = '923009146600';

export function whatsappLink(message = 'Assalam o Alaikum, I would like to discuss a property with Haider Associates.') {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function publicShell(content, path) {
  return `<div class="public-shell">
    <header class="public-header">
      <a class="public-brand" href="#/" aria-label="Haider Associates and Builders home">${fullLogo({ reversed: false })}</a>
      <nav class="public-nav" aria-label="Public navigation">${publicNav(path)}</nav>
      <div class="public-header-actions">
        <a class="phone-link" href="tel:${PHONE_TEL}">${icon('phone')}<span>${PHONE_DISPLAY}</span></a>
        <a class="btn btn-whatsapp" href="${whatsappLink()}" target="_blank" rel="noreferrer">${icon('message-circle')} WhatsApp</a>
      </div>
      <button class="icon-btn public-menu-toggle" type="button" data-action="toggle-public-menu" aria-label="Open navigation" aria-expanded="false">${icon('menu')}</button>
    </header>
    <main id="main-content" class="public-main">${content}</main>
    <footer class="public-footer">
      <div>${fullLogo({ reversed: true })}<p>Sale, purchase and rent across Islamabad, plus architecture, structure, interior design and construction.<br />D-12 Markaz, Islamabad.</p></div>
      <div><h2>Contact</h2><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a><a href="${whatsappLink()}" target="_blank" rel="noreferrer">WhatsApp enquiry</a><p>Haider Cheema</p></div>
      <div><h2>Explore</h2>${publicNav(path)}<a href="#/login">Staff login</a></div>
      <p class="public-footer-note">&copy; ${new Date().getFullYear()} Haider Associates &amp; Builders. Listings shown are sample records for this demonstration site.</p>
    </footer>
    <div class="mobile-contact-bar">
      <a class="btn btn-primary" href="tel:${PHONE_TEL}">${icon('phone')} Call now</a>
      <a class="btn btn-whatsapp" href="${whatsappLink()}" target="_blank" rel="noreferrer">${icon('message-circle')} WhatsApp</a>
    </div>
  </div>`;
}

export function authShell(content) {
  return `<main id="main-content" class="auth-shell">
    <section class="auth-visual" aria-label="Haider Associates and Builders">
      <img src="./assets/images/properties/islamabad-villa-hero.jpg" width="1920" height="819" alt="Contemporary Islamabad villa near the Margalla Hills" />
      <div class="auth-brand">${fullLogo({ reversed: true })}<p>Private real-estate and construction operations for Islamabad.</p><a href="#/">Return to public website</a></div>
    </section>
    <section class="auth-panel">${content}</section>
  </main>`;
}

function navMarkup(path, role) {
  return APP_NAV.map(section => {
    const visible = section.items.filter(item => canAccess(role, item.key));
    if (!visible.length) return '';
    return `<div class="nav-group"><p>${escapeHTML(section.group)}</p>${visible.map(item => {
      const href = `/app/${item.key}`;
      const active = path === href || path.startsWith(`${href}/`);
      return `<a href="#${href}"${active ? ' aria-current="page"' : ''}>${icon(item.icon)}<span>${escapeHTML(item.label)}</span></a>`;
    }).join('')}</div>`;
  }).join('');
}

export function appShell(content, { path, state, session }) {
  const notifications = state.entities.notifications || [];
  const unread = notifications.filter(item => !item.read).length;
  const activeKey = path.split('/')[2] || 'dashboard';
  const activeItem = APP_NAV.flatMap(section => section.items).find(item => item.key === activeKey);
  const role = session?.role || 'Agent';
  const mobileItems = [
    ['dashboard', 'Dashboard', 'layout-dashboard'], ['properties', 'Properties', 'building-2'], ['leads', 'Leads', 'contact-round'], ['visits', 'Visits', 'calendar-days'], ['more', 'More', 'menu'],
  ];
  return `<div class="app-shell">
    <aside class="sidebar" aria-label="Application navigation">
      <a class="sidebar-brand" href="#/app/dashboard">${fullLogo({ reversed: true })}</a>
      <nav>${navMarkup(path, role)}</nav>
      <div class="sidebar-account"><div class="avatar">${escapeHTML((session?.name || 'Haider Cheema').split(' ').map(value => value[0]).slice(0, 2).join(''))}</div><div><strong>${escapeHTML(session?.name || 'Haider Cheema')}</strong><span>${escapeHTML(role)}</span></div><button class="icon-btn" type="button" data-action="logout" aria-label="Log out">${icon('log-out')}</button></div>
    </aside>
    <header class="topbar">
      <button class="icon-btn mobile-menu-btn" type="button" data-action="toggle-mobile-menu" aria-label="Open application menu" aria-expanded="false">${compactLogo({ reversed: false })}</button>
      <div class="topbar-title"><span>HAIDER OS</span><strong>${escapeHTML(activeItem?.label || 'Operations')}</strong></div>
      <button class="search-trigger" type="button" data-action="open-search" aria-label="Search properties, people and deals">${icon('search')}<span>Search properties, people and deals</span><kbd>/</kbd></button>
      <div class="topbar-actions">
        <span class="demo-badge">Demo workspace data</span>
        <button class="icon-btn notification-btn" type="button" data-action="toggle-notifications" aria-label="Notifications" aria-expanded="false">${icon('bell')}${unread ? `<span class="notification-count">${unread}</span>` : ''}</button>
        <a class="icon-btn" href="#/app/settings" aria-label="Settings">${icon('settings')}</a>
      </div>
      <aside class="notification-panel" id="notification-panel" hidden>
        <header><h2>Notifications</h2><button class="text-btn" type="button" data-action="mark-notifications-read">Mark all read</button></header>
        <div>${notifications.slice(0, 8).map(item => `<a href="#${escapeHTML(item.href || '/app/dashboard')}" data-id="${escapeHTML(item.id)}"><div>${icon(item.icon || 'bell')}</div><span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.message || '')}</small></span>${item.read ? '' : statusBadge('New')}</a>`).join('') || '<p class="notification-empty">No notifications.</p>'}</div>
      </aside>
    </header>
    <div class="mobile-drawer" id="mobile-drawer" hidden><div class="mobile-drawer-head">${fullLogo({ reversed: true })}<button class="icon-btn" type="button" data-action="toggle-mobile-menu" aria-label="Close menu">${icon('x')}</button></div><nav>${navMarkup(path, role)}</nav></div>
    <main id="main-content" class="main-content"><div class="page">${content}</div></main>
    <nav class="mobile-nav" aria-label="Mobile application navigation">${mobileItems.map(([key, label, iconName]) => key === 'more'
      ? `<button type="button" data-action="toggle-mobile-menu">${icon(iconName)}<span>${label}</span></button>`
      : `<a href="#/app/${key}"${activeKey === key ? ' aria-current="page"' : ''}>${icon(iconName)}<span>${label}</span></a>`).join('')}</nav>
  </div>`;
}
