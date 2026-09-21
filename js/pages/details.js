import { escapeHTML, formatDate, formatPKR } from '../utils.js';
import { emptyState, icon, propertyCard, statusBadge, timeline } from '../components/ui.js';

function entityActivities(state, id) {
  return (state.entities.activities || []).filter(item => item.entityId === id).sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
}

function detailActions(key, item) {
  return `<div class="detail-actions"><button class="btn btn-secondary" type="button" data-detail-action="edit" data-entity="${key}" data-id="${item.id}">${icon('pencil')} Edit</button>${key === 'properties' ? `<button class="btn btn-secondary" type="button" data-detail-action="duplicate" data-entity="${key}" data-id="${item.id}">${icon('copy')} Duplicate</button><a class="btn btn-secondary" href="tel:${escapeHTML(item.ownerPhone || '03009146600')}">${icon('phone')} Call</a><a class="btn btn-whatsapp" href="https://wa.me/92${String(item.ownerPhone || '03009146600').replace(/\D/g, '').replace(/^0/, '')}" target="_blank" rel="noreferrer">${icon('message-circle')} WhatsApp</a><button class="btn btn-primary" type="button" data-action="schedule-visit" data-id="${item.id}">${icon('calendar-plus')} Schedule Visit</button>` : ''}<button class="btn btn-quiet-danger" type="button" data-detail-action="delete" data-entity="${key}" data-id="${item.id}">${icon('trash-2')} Delete</button></div>`;
}

function propertyDetail(item, state) {
  const agent = state.entities.agents.find(value => value.id === item.assignedAgentId);
  const relatedLeads = state.entities.leads.filter(value => (value.interestedPropertyIds || []).includes(item.id));
  const visits = state.entities.visits.filter(value => value.propertyId === item.id);
  const deals = state.entities.deals.filter(value => value.propertyId === item.id);
  const docs = state.entities.documents.filter(value => value.entityId === item.id || value.entityLabel === item.code || value.entityLabel === item.title);
  const images = [...new Set([...(item.images || []), './assets/images/properties/premium-interior.jpg', './assets/images/properties/islamabad-commercial.jpg'])].slice(0, 3);
  return `<article class="entity-detail property-detail">
    <header class="detail-header"><div><a class="back-link" href="#/app/properties">${icon('arrow-left')} Properties</a><p>${escapeHTML(item.code)} · ${escapeHTML(item.transactionType)}</p><h1 id="page-title" tabindex="-1">${escapeHTML(item.title)}</h1><span>${icon('map-pin')} ${escapeHTML(item.sector)}, Islamabad</span></div><div><strong>${formatPKR(item.demandPrice || item.rentPrice)}</strong>${statusBadge(item.status)}</div></header>
    ${detailActions('properties', item)}
    <div class="detail-gallery">${images.map((image, index) => `<button type="button" data-gallery-image="${escapeHTML(image)}" aria-label="Open property image ${index + 1}"><img src="${escapeHTML(image)}" width="1200" height="800" ${index ? 'loading="lazy"' : ''} alt="${escapeHTML(item.title)} view ${index + 1}" /></button>`).join('')}</div>
    <nav class="detail-tabs" aria-label="Property sections"><a href="#property-overview">Overview</a><a href="#property-owner">Ownership</a><a href="#property-related">Leads & visits</a><a href="#property-documents">Documents</a><a href="#property-activity">Activity</a></nav>
    <div class="detail-columns"><div>
      <section class="detail-section" id="property-overview"><header><h2>Property information</h2></header><p class="detail-lead">${escapeHTML(item.description || 'A locally managed demo property record for the Islamabad market.')}</p><dl class="spec-grid">${[
        ['Property type', item.propertyType], ['Transaction', item.transactionType], ['Sector', item.sector], ['Area', item.area], ['Street', item.street], ['Plot number', item.plotNumber], ['Size', item.size], ['Bedrooms', item.bedrooms], ['Bathrooms', item.bathrooms], ['Facing', item.facing], ['Condition', item.condition], ['Source', item.source],
      ].map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHTML(value || 'Not specified')}</dd></div>`).join('')}</dl></section>
      <section class="detail-section" id="property-related"><header><h2>Related work</h2></header><div class="related-grid"><div><span>Interested leads</span><strong>${relatedLeads.length}</strong><p>${relatedLeads.slice(0, 3).map(lead => escapeHTML(lead.name)).join(', ') || 'None linked yet'}</p></div><div><span>Site visits</span><strong>${visits.length}</strong><p>${visits.slice(0, 2).map(visit => `${formatDate(visit.date)} ${statusBadge(visit.status)}`).join(' ') || 'No visits scheduled'}</p></div><div><span>Deal history</span><strong>${deals.length}</strong><p>${deals.slice(0, 2).map(deal => `${escapeHTML(deal.code)} ${statusBadge(deal.stage)}`).join(' ') || 'No deal records'}</p></div></div></section>
      <section class="detail-section" id="property-documents"><header><h2>Documents</h2><button class="text-btn" type="button" data-action="add-related-document" data-id="${item.id}">Add metadata</button></header>${docs.length ? `<div class="document-list">${docs.map(doc => `<article>${icon('file-text')}<span><strong>${escapeHTML(doc.name)}</strong><small>${escapeHTML(doc.category)} · Metadata only</small></span>${statusBadge(doc.status || 'Current')}</article>`).join('')}</div>` : emptyState('No property documents', 'Document metadata linked to this property will appear here.')}</section>
      <section class="detail-section" id="property-activity"><header><h2>Activity timeline</h2></header>${timeline(entityActivities(state, item.id))}</section>
    </div><aside class="detail-summary" id="property-owner"><p>Ownership & assignment</p><h2>${escapeHTML(item.owner || 'Owner not set')}</h2><a href="tel:${escapeHTML(item.ownerPhone || '')}">${escapeHTML(item.ownerPhone || 'No phone recorded')}</a><hr /><dl><div><dt>Assigned agent</dt><dd>${escapeHTML(agent?.name || 'Unassigned')}</dd></div><div><dt>Added</dt><dd>${formatDate(item.dateAdded || item.createdAt)}</dd></div><div><dt>Last updated</dt><dd>${formatDate(item.updatedAt)}</dd></div></dl><a class="btn btn-navy" href="#/app/agents/${agent?.id || ''}">View assigned agent</a></aside></div>
  </article>`;
}

function leadDetail(item, state) {
  const agent = state.entities.agents.find(value => value.id === item.assignedAgentId);
  const visits = state.entities.visits.filter(value => value.leadId === item.id || value.clientId === item.clientId);
  const linkedProperties = state.entities.properties.filter(value => (item.interestedPropertyIds || []).includes(value.id));
  return `<article class="entity-detail"><header class="detail-header"><div><a class="back-link" href="#/app/leads">${icon('arrow-left')} Leads</a><p>${escapeHTML(item.code)} · ${escapeHTML(item.source)}</p><h1 id="page-title" tabindex="-1">${escapeHTML(item.name)}</h1><span>${escapeHTML(item.requirement || item.propertyType)}</span></div><div>${statusBadge(item.status)}${statusBadge(item.priority || 'Medium')}</div></header>${detailActions('leads', item)}<div class="detail-columns"><div><section class="detail-section"><header><h2>Requirement</h2></header><dl class="spec-grid"><div><dt>Budget</dt><dd>${formatPKR(item.budget)}</dd></div><div><dt>Preferred location</dt><dd>${escapeHTML(item.preferredLocation || 'Open')}</dd></div><div><dt>Property type</dt><dd>${escapeHTML(item.propertyType || 'Open')}</dd></div><div><dt>Size</dt><dd>${escapeHTML(item.size || 'Flexible')}</dd></div><div><dt>Last contact</dt><dd>${formatDate(item.lastContact)}</dd></div><div><dt>Next follow-up</dt><dd>${formatDate(item.nextFollowUp)}</dd></div></dl><p class="detail-note">${escapeHTML(item.notes || 'No internal notes recorded.')}</p></section><section class="detail-section"><header><h2>Properties sent</h2></header><div class="property-grid compact-property-grid">${linkedProperties.map(property => propertyCard(property)).join('') || emptyState('No properties linked', 'Add matching properties to the lead record.')}</div></section><section class="detail-section"><header><h2>Visits</h2></header>${visits.length ? `<div class="document-list">${visits.map(visit => `<article>${icon('calendar')}<span><strong>${formatDate(visit.date)} at ${escapeHTML(visit.time)}</strong><small>${escapeHTML(visit.location || 'Islamabad')}</small></span>${statusBadge(visit.status)}</article>`).join('')}</div>` : emptyState('No visits yet', 'Schedule a site visit when the lead is ready.')}</section><section class="detail-section"><header><h2>Activity</h2></header>${timeline(entityActivities(state, item.id))}</section></div><aside class="detail-summary"><p>Contact</p><h2>${escapeHTML(item.name)}</h2><a href="tel:${escapeHTML(item.phone)}">${escapeHTML(item.phone)}</a><a href="https://wa.me/92${String(item.whatsapp || item.phone).replace(/\D/g, '').replace(/^0/, '')}" target="_blank" rel="noreferrer">WhatsApp lead</a><hr /><dl><div><dt>Assigned agent</dt><dd>${escapeHTML(agent?.name || 'Unassigned')}</dd></div><div><dt>Lead type</dt><dd>${escapeHTML(item.leadType || 'Buyer')}</dd></div><div><dt>Created</dt><dd>${formatDate(item.createdAt)}</dd></div></dl></aside></div></article>`;
}

function genericDetail(key, item, state) {
  const config = {
    clients: { label: 'Client', back: 'Clients', fields: [['Phone', 'phone'], ['WhatsApp', 'whatsapp'], ['Email', 'email'], ['Relationship', 'type'], ['Preferred areas', 'preferredAreas'], ['Budget', 'budget'], ['Requirement', 'propertyRequirement'], ['Status', 'status']] },
    agents: { label: 'Agent', back: 'Agents', fields: [['Phone', 'phone'], ['Email', 'email'], ['Role', 'role'], ['Specialization', 'specialization'], ['Status', 'status'], ['Join date', 'joinDate']] },
    deals: { label: 'Deal', back: 'Deals', fields: [['Stage', 'stage'], ['Deal type', 'dealType'], ['Sale price', 'salePrice'], ['Commission %', 'commissionPercent'], ['Total commission', 'totalCommission'], ['Token amount', 'tokenAmount'], ['Payment', 'paymentStatus'], ['Expected closing', 'expectedClosing']] },
    rentals: { label: 'Rental', back: 'Rentals', fields: [['Monthly rent', 'monthlyRent'], ['Security', 'security'], ['Lease start', 'leaseStart'], ['Lease end', 'leaseEnd'], ['Commission', 'commission'], ['Status', 'status']] },
    projects: { label: 'Project', back: 'Projects', fields: [['Location', 'location'], ['Project type', 'projectType'], ['Plot size', 'plotSize'], ['Budget', 'budget'], ['Contract value', 'contractValue'], ['Architect', 'architect'], ['Engineer', 'engineer'], ['Project manager', 'projectManager'], ['Start date', 'startDate'], ['Expected completion', 'expectedCompletion'], ['Stage', 'status'], ['Progress', 'progress']] },
  }[key];
  if (!config) return emptyState('Record unavailable', 'This detail view is not configured.');
  const name = item.name || item.title || item.code;
  const moneyFields = ['budget', 'salePrice', 'totalCommission', 'tokenAmount', 'monthlyRent', 'security', 'commission', 'contractValue'];
  const dateFields = ['joinDate', 'expectedClosing', 'leaseStart', 'leaseEnd', 'startDate', 'expectedCompletion'];
  const activity = entityActivities(state, item.id);
  const status = item.status || item.stage || 'Active';
  return `<article class="entity-detail"><header class="detail-header"><div><a class="back-link" href="#/app/${key}">${icon('arrow-left')} ${config.back}</a><p>${escapeHTML(item.code || config.label)}</p><h1 id="page-title" tabindex="-1">${escapeHTML(name)}</h1><span>${escapeHTML(item.location || item.role || item.type || item.dealType || config.label)}</span></div><div>${statusBadge(status)}</div></header>${detailActions(key, item)}${key === 'projects' ? `<div class="project-hero"><img src="${escapeHTML(item.image || './assets/images/projects/villa-construction.jpg')}" width="1536" height="1024" alt="${escapeHTML(name)} project" /><div><span>Project progress</span><strong>${escapeHTML(item.progress || 0)}%</strong><div class="project-progress"><span style="--progress:${Number(item.progress) || 0}%"></span></div></div></div>` : ''}<div class="detail-columns"><div><section class="detail-section"><header><h2>${config.label} information</h2></header><dl class="spec-grid">${config.fields.map(([label, field]) => {
    let value = item[field];
    if (moneyFields.includes(field)) value = formatPKR(value);
    if (dateFields.includes(field)) value = formatDate(value);
    if (field === 'progress') value = `${value || 0}%`;
    return `<div><dt>${label}</dt><dd>${escapeHTML(value || 'Not specified')}</dd></div>`;
  }).join('')}</dl>${item.notes ? `<p class="detail-note">${escapeHTML(item.notes)}</p>` : ''}</section><section class="detail-section"><header><h2>Activity timeline</h2></header>${timeline(activity)}</section></div><aside class="detail-summary"><p>Record overview</p><h2>${escapeHTML(name)}</h2><dl><div><dt>Reference</dt><dd>${escapeHTML(item.code || item.id)}</dd></div><div><dt>Status</dt><dd>${escapeHTML(status)}</dd></div><div><dt>Created</dt><dd>${formatDate(item.createdAt)}</dd></div><div><dt>Updated</dt><dd>${formatDate(item.updatedAt)}</dd></div></dl><small>This is a demo record stored in this browser.</small></aside></div></article>`;
}

export function detailPage(key, id, state) {
  const item = state.entities[key]?.find(value => value.id === id);
  if (!item) return emptyState('Record not found', 'This record may have been deleted or the link is incorrect.');
  if (key === 'properties') return propertyDetail(item, state);
  if (key === 'leads') return leadDetail(item, state);
  return genericDetail(key, item, state);
}
