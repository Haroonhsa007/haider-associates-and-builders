import { escapeHTML, formatPKR } from '../utils.js';
import { icon, propertyCard, statusBadge, timeline } from '../components/ui.js';

function publicHero() {
  return `<section class="public-hero">
    <img class="public-hero-image" src="./assets/images/properties/islamabad-villa-hero.jpg" width="1920" height="819" alt="Contemporary Islamabad villa set against the Margalla Hills" fetchpriority="high" />
    <div class="public-hero-scrim"></div>
    <div class="public-hero-copy public-hero__content">
      <p class="public-kicker">Islamabad property and construction</p>
      <h1>Property decisions.<br /><span>Built properly.</span></h1>
      <p>Sale, purchase, rent, architecture and construction handled through one accountable local team.</p>
      <div class="hero-actions"><a class="btn btn-primary" href="#/properties">Browse properties</a><a class="btn btn-on-dark" href="tel:03009146600">Call 0300-9146600</a></div>
      <div class="hero-proof" aria-label="Haider Associates services"><span>Sale</span><span>Purchase</span><span>Rent</span><span>Architecture</span><span>Builders</span></div>
    </div>
  </section>`;
}

function propertySearch(state, values = {}) {
  const sectors = [...new Set(state.entities.properties.map(item => item.sector))].sort();
  return `<form class="public-search public-search-band" data-public-property-search>
    <div class="search-field"><label for="public-q">What are you looking for?</label><div>${icon('search')}<input id="public-q" name="q" value="${escapeHTML(values.q || '')}" placeholder="House, plot, office or sector" /></div></div>
    <div><label for="public-type">Property type</label><select id="public-type" name="type"><option value="">All property types</option>${[...new Set(state.entities.properties.map(item => item.propertyType))].map(type => `<option${values.type === type ? ' selected' : ''}>${escapeHTML(type)}</option>`).join('')}</select></div>
    <div><label for="public-sector">Sector</label><select id="public-sector" name="sector"><option value="">All sectors</option>${sectors.map(sector => `<option${values.sector === sector ? ' selected' : ''}>${escapeHTML(sector)}</option>`).join('')}</select></div>
    <button class="btn btn-navy" type="submit">Search Properties</button>
  </form>`;
}

function home(state) {
  const featured = state.entities.properties.filter(item => item.isPublic !== false && item.status !== 'Inactive').slice(0, 5);
  const projects = state.entities.projects.slice(0, 3);
  return `${publicHero()}
    ${propertySearch(state)}
    <section class="public-section public-container featured-section">
      <div class="public-section-heading public-section__intro"><p class="public-kicker">Property desk</p><h2>Current Islamabad inventory</h2><p>Residential, commercial and rental opportunities managed directly by the Haider Associates team.</p></div>
      <div class="public-property-grid featured-property-grid">${featured.map((item, index) => `<div class="featured-property-${index + 1}">${propertyCard(item, { publicView: true })}</div>`).join('')}</div>
      <a class="text-link" href="#/properties">Browse all properties ${icon('arrow-right')}</a>
    </section>
    <section class="public-section public-container public-services-preview">
      <div class="service-media"><img src="./assets/images/projects/villa-construction.jpg" width="1536" height="1024" loading="lazy" alt="Modern Islamabad home under construction" /></div>
      <div class="service-copy"><p class="public-kicker">What we handle</p><h2>One office. Every property decision.</h2><p>Find the property, structure the deal, develop the design and manage the build without losing responsibility between vendors.</p>
      <div class="service-list">${['Sale & Purchase', 'Rental Management', 'Architecture', 'Structure', 'Interior Design', 'Construction'].map((label, index) => `<a href="#/services"><span>${String(index + 1).padStart(2, '0')}</span><strong>${label}</strong>${icon('arrow-up-right')}</a>`).join('')}</div></div>
    </section>
    <section class="public-section public-container public-projects-preview"><div><p class="public-kicker">Architecture and build</p><h2>From plot to handover.</h2><p>Design, structure, execution, cost and documentation stay visible in one working process.</p><a class="btn btn-navy" href="#/projects">View projects</a></div><div class="project-image-grid">${projects.map((project, index) => `<article><img src="${escapeHTML(project.image || './assets/images/projects/villa-construction.jpg')}" width="960" height="640" loading="lazy" alt="${escapeHTML(project.name)}" /><h3>${escapeHTML(project.name)}</h3><p>${escapeHTML(project.location)} · ${escapeHTML(project.projectType)}</p></article>`).join('')}</div></section>
    <section class="public-contact-block"><div><p>Speak directly with the team</p><h2>Tell us what you need.</h2></div><div><a href="tel:03009146600">0300-9146600</a><a class="btn btn-primary" href="#/contact">Start an enquiry</a></div></section>`;
}

function propertiesPage(state, query) {
  const values = { q: query.get('q') || '', type: query.get('type') || '', sector: query.get('sector') || '' };
  const q = values.q.toLowerCase();
  const properties = state.entities.properties.filter(item => item.isPublic !== false && item.status !== 'Inactive').filter(item => {
    const matchesQuery = !q || [item.title, item.code, item.sector, item.area, item.propertyType].join(' ').toLowerCase().includes(q);
    return matchesQuery && (!values.type || item.propertyType === values.type) && (!values.sector || item.sector === values.sector);
  });
  return `<section class="public-page-hero"><p class="public-kicker">Islamabad inventory</p><h1>Property opportunities without the noise.</h1><p>Search houses, plots, commercial spaces and rentals managed through the Haider Associates property desk.</p></section>
    ${propertySearch(state, values)}
    <section class="public-section public-container public-property-results"><header><h2>${properties.length} properties</h2><p>All records shown here are sample data for this application.</p></header><div class="property-grid">${properties.map(item => propertyCard(item, { publicView: true })).join('')}</div></section>`;
}

function propertyDetail(state, id) {
  const property = state.entities.properties.find(item => item.id === id && item.isPublic !== false);
  if (!property) return notFound();
  const images = [...new Set([...(property.images || []), './assets/images/properties/premium-interior.jpg', './assets/images/properties/islamabad-commercial.jpg'])].slice(0, 3);
  const ownerSafeDescription = property.description || 'A well-positioned Islamabad property managed through the Haider Associates demo workspace.';
  return `<article class="public-property-detail">
    <div class="public-detail-heading"><a href="#/properties">${icon('arrow-left')} Back to properties</a><div><p>${escapeHTML(property.code)} · Demo listing</p><h1>${escapeHTML(property.title)}</h1><span>${escapeHTML(property.sector)}, Islamabad</span></div><strong>${formatPKR(property.demandPrice || property.rentPrice)}</strong></div>
    <div class="public-gallery">${images.map((image, index) => `<img src="${escapeHTML(image)}" width="1200" height="800" ${index ? 'loading="lazy"' : ''} alt="${escapeHTML(property.title)} view ${index + 1}" />`).join('')}</div>
    <div class="public-detail-layout"><section><h2>Property overview</h2><p class="detail-intro">${escapeHTML(ownerSafeDescription)}</p><dl class="spec-grid">
      ${[['Type', property.propertyType], ['Transaction', property.transactionType], ['Size', property.size], ['Plot', property.plotNumber], ['Street', property.street], ['Facing', property.facing], ['Condition', property.condition], ['Status', property.status]].map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHTML(value || 'Not specified')}</dd></div>`).join('')}
    </dl><h2>Recent listing activity</h2>${timeline((state.entities.activities || []).filter(item => item.entityId === property.id).slice(0, 5))}</section>
    <aside class="public-inquiry-card"><p>Property enquiry</p><h2>${formatPKR(property.demandPrice || property.rentPrice)}</h2>${statusBadge(property.status)}<dl><div><dt>Sector</dt><dd>${escapeHTML(property.sector)}</dd></div><div><dt>Size</dt><dd>${escapeHTML(property.size)}</dd></div><div><dt>Reference</dt><dd>${escapeHTML(property.code)}</dd></div></dl><a class="btn btn-primary" href="tel:03009146600">${icon('phone')} Call 0300-9146600</a><a class="btn btn-whatsapp" href="https://wa.me/923009146600?text=${encodeURIComponent(`I am interested in ${property.title} (${property.code})`)}" target="_blank" rel="noreferrer">${icon('message-circle')} WhatsApp enquiry</a><button class="btn btn-secondary" type="button" data-action="public-inquiry" data-id="${escapeHTML(property.id)}">Send an enquiry</button><small>This is a demo listing in a local-only application.</small></aside></div>
  </article>`;
}

const serviceItems = [
  ['Sale', 'Focused property marketing, qualification and transaction coordination.'],
  ['Purchase', 'Requirement-led searches across Islamabad residential and commercial sectors.'],
  ['Rent', 'Tenant, landlord, lease and renewal workflows managed in one place.'],
  ['Architecture', 'Brief development, concept planning and coordinated design documentation.'],
  ['Structure', 'Structural coordination that supports safe, practical construction decisions.'],
  ['Interior Design', 'Material, layout and detailing direction for refined Pakistani interiors.'],
  ['Builders', 'Project tracking from consultation and approvals through construction and finishing.'],
];

function services() {
  return `<section class="public-page-hero"><p class="public-kicker">Sale, purchase, rent and build</p><h1>One point of responsibility.</h1><p>Property advisory and construction coordination for clients who want direct answers and visible progress.</p></section><section class="public-section public-container service-index">${serviceItems.map(([name, body]) => `<article><div>${icon(name === 'Builders' ? 'hard-hat' : name === 'Rent' ? 'key-round' : 'ruler')}</div><h2>${name}</h2><p>${body}</p><a href="#/contact">Discuss this service ${icon('arrow-right')}</a></article>`).join('')}</section>`;
}

function about() {
  return `<section class="public-page-hero"><p class="public-kicker">Haider Associates & Builders</p><h1>Local property judgement. Clear responsibility.</h1><p>Direct real estate and construction support for Islamabad buyers, sellers, landlords and project owners.</p></section><section class="public-section public-container public-about-grid"><div><img src="./assets/images/properties/premium-interior.jpg" width="1536" height="1024" alt="Refined contemporary interior in an Islamabad home" /></div><div><h2>Work directly with the people responsible.</h2><p>Haider Associates brings property inventory, clients, site visits, transactions and construction work into one disciplined operating process while keeping communication personal.</p><dl><div><dt>Primary contact</dt><dd>Haider Cheema</dd></div><div><dt>Location</dt><dd>Islamabad, Pakistan</dd></div><div><dt>Phone</dt><dd><a href="tel:03009146600">0300-9146600</a></dd></div></dl><p class="disclaimer">Demo listings and project records are included to demonstrate the digital platform.</p></div></section>`;
}

function projectsPage(state) {
  return `<section class="public-page-hero"><p class="public-kicker">Architecture and construction</p><h1>Track the work. Own the outcome.</h1><p>Project records connect the brief, site progress, budget and documentation. The examples below are demonstration data.</p></section><section class="public-section public-container public-project-list">${state.entities.projects.map(project => `<article><img src="${escapeHTML(project.image || './assets/images/projects/villa-construction.jpg')}" width="1200" height="800" loading="lazy" alt="${escapeHTML(project.name)}" /><div><span>${escapeHTML(project.projectType)} · ${escapeHTML(project.status)}</span><h2>${escapeHTML(project.name)}</h2><p>${escapeHTML(project.location)} · ${escapeHTML(project.plotSize || '')}</p><div class="project-progress" aria-label="${escapeHTML(project.progress)} percent complete"><span style="--progress:${Number(project.progress) || 0}%"></span></div><strong>${escapeHTML(project.progress)}% complete</strong></div></article>`).join('')}</section>`;
}

function contact() {
  return `<section class="public-page-hero"><p class="public-kicker">Talk to Haider Associates</p><h1>Tell us the decision in front of you.</h1><p>Buying, selling, renting or building in Islamabad. Start with a direct conversation.</p></section><section class="public-section public-container public-contact-layout"><div class="contact-details"><h2>Haider Associates & Builders</h2><p>Sale, purchase, rent, architecture, structure, interior design and construction.</p><a href="tel:03009146600">${icon('phone')}<span><small>Call Haider Cheema</small>0300-9146600</span></a><a href="https://wa.me/923009146600" target="_blank" rel="noreferrer">${icon('message-circle')}<span><small>WhatsApp</small>Start a conversation</span></a><div>${icon('map-pin')}<span><small>Location</small>Islamabad, Pakistan</span></div></div><form class="public-contact-form" data-contact-form novalidate><h2>Send an enquiry</h2><div class="form-grid"><div class="form-field"><label for="contact-name">Full name <span aria-hidden="true">*</span></label><input id="contact-name" name="name" required /></div><div class="form-field"><label for="contact-phone">Phone <span aria-hidden="true">*</span></label><input id="contact-phone" name="phone" type="tel" required /></div><div class="form-field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" /></div><div class="form-field"><label for="contact-type">I am interested in</label><select id="contact-type" name="requirement"><option>Buying a property</option><option>Selling a property</option><option>Rental</option><option>Architecture</option><option>Construction</option><option>Interior Design</option></select></div><div class="form-field field-full"><label for="contact-message">How can we help?</label><textarea id="contact-message" name="notes" rows="5"></textarea></div></div><button class="btn btn-primary" type="submit">Send enquiry</button><p>This demo stores the enquiry in this browser only.</p></form></section>`;
}

function notFound() {
  return `<section class="public-page-hero"><p class="public-kicker">Not found</p><h1>We could not find that page.</h1><p>The property may no longer be public or the link may be incorrect.</p><a class="btn btn-primary" href="#/properties">View Properties</a></section>`;
}

export function renderPublicPage(path, params, query, state) {
  if (path === '/') return home(state);
  if (path === '/properties') return propertiesPage(state, query);
  if (path.startsWith('/properties/') && params?.id) return propertyDetail(state, params.id);
  if (path === '/services') return services();
  if (path === '/about') return about();
  if (path === '/projects') return projectsPage(state);
  if (path === '/contact') return contact();
  return notFound();
}
