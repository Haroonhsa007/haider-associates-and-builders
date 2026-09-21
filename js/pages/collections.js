import { escapeHTML, formatDate, formatPKR } from '../utils.js';
import { dataTable, emptyState, icon, pageHeader, propertyCard, simpleBars, statusBadge } from '../components/ui.js';

const propertyStatuses = ['Available', 'Reserved', 'Negotiation', 'Sold', 'Rented', 'Inactive'];
const leadStatuses = ['New', 'Contacted', 'Requirement Confirmed', 'Properties Sent', 'Site Visit', 'Negotiation', 'Token', 'Closed', 'Lost'];

const text = (name, label, required = false, full = false) => ({ name, label, required, full });
const number = (name, label, required = false) => ({ name, label, type: 'number', required, min: 0 });
const select = (name, label, options, required = false) => ({ name, label, type: 'select', options, required });

function relationOptions(items, labelKey = 'name') {
  return [{ value: '', label: 'Not assigned' }, ...items.map(item => ({ value: item.id, label: item[labelKey] || item.title }))];
}

export function getEntityConfig(key, state) {
  const agents = relationOptions(state.entities.agents);
  const clients = relationOptions(state.entities.clients);
  const properties = relationOptions(state.entities.properties, 'title');
  const configs = {
    properties: {
      singular: 'Property', title: 'Properties', subtitle: 'Manage Islamabad sale, rental and construction-linked inventory.', icon: 'building-2',
      statuses: propertyStatuses,
      fields: [text('title', 'Property title', true, true), select('transactionType', 'Transaction type', ['Sale', 'Rent', 'Sale & Rent'], true), select('propertyType', 'Property type', ['Residential Plot', 'Commercial Plot', 'House', 'Apartment', 'Shop', 'Office', 'Upper Portion', 'Lower Portion', 'Farmhouse', 'Commercial Building', 'Other'], true), text('sector', 'Sector', true), text('area', 'Area'), text('street', 'Street'), text('plotNumber', 'Plot number'), text('size', 'Size', true), number('bedrooms', 'Bedrooms'), number('bathrooms', 'Bathrooms'), number('demandPrice', 'Demand price (PKR)'), number('rentPrice', 'Monthly rent (PKR)'), text('facing', 'Facing'), select('condition', 'Condition', ['New', 'Excellent', 'Good', 'Needs renovation', 'Plot']), text('owner', 'Owner name', true), text('ownerPhone', 'Owner phone', true), select('assignedAgentId', 'Assigned agent', agents), select('status', 'Status', propertyStatuses, true), select('source', 'Source', ['Direct', 'Referral', 'Zameen', 'Website', 'Walk-in', 'Other']), { name: 'description', label: 'Description', type: 'textarea', full: true }],
      columns: [
        { key: 'title', label: 'Property', render: item => `<a class="table-primary" href="#/app/properties/${item.id}"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.code)}</small></a>` },
        { key: 'sector', label: 'Location', render: item => `<strong>${escapeHTML(item.sector)}</strong><small>${escapeHTML(item.area || 'Islamabad')}</small>` },
        { key: 'propertyType', label: 'Type' }, { key: 'size', label: 'Size' },
        { key: 'demandPrice', label: 'Demand', render: item => `<strong>${formatPKR(item.demandPrice || item.rentPrice)}</strong>` },
        { key: 'status', label: 'Status', render: item => statusBadge(item.status) },
      ],
    },
    leads: {
      singular: 'Lead', title: 'Leads', subtitle: 'Qualify requirements, plan follow-ups and move enquiries toward a decision.', icon: 'contact-round', statuses: leadStatuses,
      fields: [text('name', 'Lead name', true), text('phone', 'Phone', true), text('whatsapp', 'WhatsApp'), { ...text('email', 'Email'), type: 'email' }, select('leadType', 'Lead type', ['Buyer', 'Seller', 'Tenant', 'Landlord', 'Project Client'], true), text('requirement', 'Requirement', true, true), number('budget', 'Budget (PKR)'), text('preferredLocation', 'Preferred location'), select('propertyType', 'Property type', ['Residential Plot', 'Commercial Plot', 'House', 'Apartment', 'Shop', 'Office', 'Other']), text('size', 'Preferred size'), select('source', 'Source', ['Website', 'WhatsApp', 'Phone', 'Zameen', 'Referral', 'Walk-in', 'Facebook', 'Instagram', 'Other']), select('assignedAgentId', 'Assigned agent', agents), select('priority', 'Priority', ['High', 'Medium', 'Low']), select('status', 'Status', leadStatuses, true), { name: 'nextFollowUp', label: 'Next follow-up', type: 'date' }, { name: 'notes', label: 'Notes', type: 'textarea', full: true }],
      columns: [
        { key: 'name', label: 'Lead', render: item => `<a class="table-primary" href="#/app/leads/${item.id}"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.code)} · ${escapeHTML(item.phone)}</small></a>` },
        { key: 'requirement', label: 'Requirement' }, { key: 'budget', label: 'Budget', render: item => formatPKR(item.budget) },
        { key: 'assignedAgentId', label: 'Agent', render: item => escapeHTML(state.entities.agents.find(agent => agent.id === item.assignedAgentId)?.name || 'Unassigned') },
        { key: 'status', label: 'Status', render: item => statusBadge(item.status) }, { key: 'nextFollowUp', label: 'Next follow-up', render: item => formatDate(item.nextFollowUp) },
      ],
    },
    clients: {
      singular: 'Client', title: 'Clients', subtitle: 'Buyer, seller, landlord and tenant relationships in one record.', icon: 'users', statuses: ['Active', 'Inactive'],
      fields: [text('name', 'Client name', true), text('phone', 'Phone', true), text('whatsapp', 'WhatsApp'), { ...text('email', 'Email'), type: 'email' }, select('type', 'Client type', ['Buyer', 'Seller', 'Landlord', 'Tenant', 'Project Client'], true), text('cnic', 'CNIC placeholder'), text('preferredAreas', 'Preferred areas'), number('budget', 'Budget (PKR)'), text('propertyRequirement', 'Property requirement', false, true), select('assignedAgentId', 'Assigned agent', agents), select('status', 'Status', ['Active', 'Inactive']), { name: 'notes', label: 'Notes', type: 'textarea', full: true }],
      columns: [
        { key: 'name', label: 'Client', render: item => `<a class="table-primary" href="#/app/clients/${item.id}"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.code)} · ${escapeHTML(item.phone)}</small></a>` },
        { key: 'type', label: 'Relationship' }, { key: 'preferredAreas', label: 'Preferred areas' }, { key: 'budget', label: 'Budget', render: item => formatPKR(item.budget) }, { key: 'status', label: 'Status', render: item => statusBadge(item.status || 'Active') },
      ],
    },
    agents: {
      singular: 'Agent', title: 'Agents', subtitle: 'Team workload, property specializations and performance.', icon: 'badge-user', statuses: ['Active', 'Inactive', 'On Leave'],
      fields: [text('name', 'Full name', true), text('phone', 'Phone', true), { ...text('email', 'Email'), type: 'email' }, select('role', 'Role', ['Senior Property Consultant', 'Property Consultant', 'Sales Executive', 'Manager', 'Project Manager']), text('specialization', 'Specialization', true), select('status', 'Status', ['Active', 'Inactive', 'On Leave']), { name: 'joinDate', label: 'Join date', type: 'date' }],
      columns: [
        { key: 'name', label: 'Agent', render: item => `<a class="table-primary" href="#/app/agents/${item.id}"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.role || 'Property Consultant')}</small></a>` },
        { key: 'specialization', label: 'Specialization' }, { key: 'phone', label: 'Contact' },
        { key: 'workload', label: 'Open leads', render: item => String(state.entities.leads.filter(lead => lead.assignedAgentId === item.id && !['Closed', 'Lost'].includes(lead.status)).length) },
        { key: 'status', label: 'Status', render: item => statusBadge(item.status) },
      ],
    },
    visits: {
      singular: 'Site visit', title: 'Site Visits', subtitle: 'Coordinate client appointments, confirmations, feedback and next actions.', icon: 'calendar-days', statuses: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
      fields: [select('clientId', 'Client', clients, true), select('propertyId', 'Property', properties, true), select('agentId', 'Agent', agents, true), { name: 'date', label: 'Date', type: 'date', required: true }, { name: 'time', label: 'Time', type: 'time', required: true }, select('status', 'Status', ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'], true), text('location', 'Meeting location'), { name: 'notes', label: 'Notes', type: 'textarea', full: true }, { name: 'feedback', label: 'Feedback', type: 'textarea', full: true }, text('nextAction', 'Next action', false, true)],
      columns: [
        { key: 'date', label: 'Date and time', render: item => `<strong>${formatDate(item.date)}</strong><small>${escapeHTML(item.time)}</small>` },
        { key: 'clientId', label: 'Client', render: item => escapeHTML(state.entities.clients.find(client => client.id === item.clientId)?.name || item.clientName || 'Client') },
        { key: 'propertyId', label: 'Property', render: item => escapeHTML(state.entities.properties.find(property => property.id === item.propertyId)?.title || 'Property') },
        { key: 'agentId', label: 'Agent', render: item => escapeHTML(state.entities.agents.find(agent => agent.id === item.agentId)?.name || 'Unassigned') },
        { key: 'status', label: 'Status', render: item => statusBadge(item.status) },
      ],
    },
    deals: {
      singular: 'Deal', title: 'Deals', subtitle: 'Manage offers, negotiation, token, payment and completion.', icon: 'handshake', statuses: ['Offer', 'Negotiation', 'Token', 'Agreement', 'Payment', 'Completed', 'Cancelled'],
      fields: [select('propertyId', 'Property', properties, true), select('buyerId', 'Buyer', clients), select('sellerId', 'Seller', clients), select('agentId', 'Agent', agents, true), select('dealType', 'Deal type', ['Sale', 'Rent']), number('salePrice', 'Sale price (PKR)', true), { name: 'commissionPercent', label: 'Commission %', type: 'number', min: 0, max: 10, step: 0.1, required: true }, { name: 'agentSplitPercent', label: 'Agent split %', type: 'number', min: 0, max: 100, step: 1 }, number('tokenAmount', 'Token amount (PKR)'), select('paymentStatus', 'Payment status', ['Unpaid', 'Token Paid', 'Partial', 'Paid']), select('stage', 'Deal stage', ['Offer', 'Negotiation', 'Token', 'Agreement', 'Payment', 'Completed', 'Cancelled'], true), { name: 'expectedClosing', label: 'Expected closing', type: 'date' }, { name: 'notes', label: 'Notes', type: 'textarea', full: true }],
      columns: [
        { key: 'code', label: 'Deal', render: item => `<a class="table-primary" href="#/app/deals/${item.id}"><strong>${escapeHTML(item.code)}</strong><small>${escapeHTML(state.entities.properties.find(property => property.id === item.propertyId)?.title || 'Property')}</small></a>` },
        { key: 'salePrice', label: 'Value', render: item => `<strong>${formatPKR(item.salePrice)}</strong>` },
        { key: 'totalCommission', label: 'Commission', render: item => formatPKR(item.totalCommission || item.salePrice * item.commissionPercent / 100) },
        { key: 'expectedClosing', label: 'Expected close', render: item => formatDate(item.expectedClosing) }, { key: 'stage', label: 'Stage', render: item => statusBadge(item.stage) },
      ],
    },
    rentals: {
      singular: 'Rental', title: 'Rentals', subtitle: 'Active leases, renewal planning and landlord coordination.', icon: 'key-round', statuses: ['Active', 'Expiring', 'Renewal Pending', 'Ended', 'Cancelled'],
      fields: [select('propertyId', 'Property', properties, true), select('ownerId', 'Owner', clients, true), select('tenantId', 'Tenant', clients, true), select('agentId', 'Agent', agents), number('monthlyRent', 'Monthly rent (PKR)', true), number('security', 'Security deposit (PKR)'), { name: 'leaseStart', label: 'Lease start', type: 'date', required: true }, { name: 'leaseEnd', label: 'Lease end', type: 'date', required: true }, number('commission', 'Commission (PKR)'), select('status', 'Status', ['Active', 'Expiring', 'Renewal Pending', 'Ended', 'Cancelled'], true)],
      columns: [
        { key: 'propertyId', label: 'Property', render: item => `<a class="table-primary" href="#/app/rentals/${item.id}"><strong>${escapeHTML(state.entities.properties.find(property => property.id === item.propertyId)?.title || 'Rental property')}</strong><small>${escapeHTML(item.code)}</small></a>` },
        { key: 'tenantId', label: 'Tenant', render: item => escapeHTML(state.entities.clients.find(client => client.id === item.tenantId)?.name || 'Not set') }, { key: 'monthlyRent', label: 'Monthly rent', render: item => formatPKR(item.monthlyRent) },
        { key: 'leaseEnd', label: 'Lease end', render: item => formatDate(item.leaseEnd) }, { key: 'status', label: 'Status', render: item => statusBadge(item.status) },
      ],
    },
    projects: {
      singular: 'Project', title: 'Projects', subtitle: 'Architecture, structure, interior and construction delivery.', icon: 'hard-hat', statuses: ['Lead', 'Consultation', 'Design', 'Approval', 'Construction', 'Finishing', 'Completed'],
      fields: [select('clientId', 'Client', clients, true), text('name', 'Project name', true, true), text('location', 'Location', true), select('projectType', 'Project type', ['Architecture', 'Structure', 'Interior Design', 'Construction', 'Renovation'], true), text('plotSize', 'Plot size'), number('budget', 'Budget (PKR)'), number('contractValue', 'Contract value (PKR)'), text('architect', 'Architect'), text('engineer', 'Engineer'), text('projectManager', 'Project manager'), { name: 'startDate', label: 'Start date', type: 'date' }, { name: 'expectedCompletion', label: 'Expected completion', type: 'date' }, select('status', 'Stage', ['Lead', 'Consultation', 'Design', 'Approval', 'Construction', 'Finishing', 'Completed'], true), { name: 'progress', label: 'Progress %', type: 'number', min: 0, max: 100 }, { name: 'notes', label: 'Notes', type: 'textarea', full: true }],
      columns: [
        { key: 'name', label: 'Project', render: item => `<a class="table-primary" href="#/app/projects/${item.id}"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.code)} · ${escapeHTML(item.location)}</small></a>` },
        { key: 'projectType', label: 'Category' }, { key: 'contractValue', label: 'Contract value', render: item => formatPKR(item.contractValue) },
        { key: 'progress', label: 'Progress', render: item => `<div class="inline-progress"><span style="--progress:${Number(item.progress) || 0}%"></span><strong>${escapeHTML(item.progress || 0)}%</strong></div>` },
        { key: 'status', label: 'Stage', render: item => statusBadge(item.status) },
      ],
    },
    documents: {
      singular: 'Document', title: 'Documents', subtitle: 'Local metadata for property, client, deal, rental and project files.', icon: 'files', statuses: ['Current', 'Missing', 'Expired'],
      fields: [text('name', 'Document name', true, true), select('category', 'Category', ['Property Documents', 'Client Documents', 'Deal Documents', 'Rental Documents', 'Construction Documents', 'Identity Documents', 'Contracts', 'Receipts', 'Other'], true), select('entityType', 'Related entity', ['Property', 'Client', 'Deal', 'Rental', 'Project', 'General']), text('entityLabel', 'Record name or reference'), text('fileName', 'File name', true), select('status', 'Status', ['Current', 'Missing', 'Expired']), { name: 'notes', label: 'Notes', type: 'textarea', full: true }],
      columns: [
        { key: 'name', label: 'Document', render: item => `<span class="table-primary"><strong>${icon('file-text')} ${escapeHTML(item.name)}</strong><small>${escapeHTML(item.fileName || 'Metadata only')}</small></span>` },
        { key: 'category', label: 'Category' }, { key: 'entityLabel', label: 'Related record' }, { key: 'createdAt', label: 'Added', render: item => formatDate(item.uploadedAt || item.createdAt) }, { key: 'status', label: 'Status', render: item => statusBadge(item.status || 'Current') },
      ],
    },
  };
  return configs[key];
}

function filterRows(rows, query, config) {
  const q = (query.get('q') || '').toLowerCase();
  const status = query.get('status') || '';
  return rows.filter(item => {
    const haystack = Object.values(item).filter(value => typeof value === 'string' || typeof value === 'number').join(' ').toLowerCase();
    const itemStatus = item.status || item.stage || '';
    return (!q || haystack.includes(q)) && (!status || itemStatus === status);
  });
}

function filterBar(key, config, query, extra = '') {
  const q = query.get('q') || '';
  const status = query.get('status') || '';
  return `<form class="filter-bar" data-filter-form data-entity="${key}"><div class="filter-search">${icon('search')}<label class="sr-only" for="collection-search">Search ${escapeHTML(config.title)}</label><input id="collection-search" name="q" value="${escapeHTML(q)}" placeholder="Search ${escapeHTML(config.title.toLowerCase())}" /></div><div><label class="sr-only" for="status-filter">Status</label><select id="status-filter" name="status"><option value="">All statuses</option>${(config.statuses || []).map(item => `<option${status === item ? ' selected' : ''}>${escapeHTML(item)}</option>`).join('')}</select></div>${extra}<button class="btn btn-secondary" type="submit">Apply filters</button>${q || status ? `<a class="text-btn" href="#/app/${key}">Clear</a>` : ''}</form>`;
}

function propertyCollection(state, query, config) {
  const rows = filterRows(state.entities.properties, query, config);
  const view = query.get('view') || 'table';
  const sectors = [...new Set(state.entities.properties.map(item => item.sector))];
  const sector = query.get('sector') || '';
  const filtered = sector ? rows.filter(item => item.sector === sector) : rows;
  const extra = `<div><label class="sr-only" for="sector-filter">Sector</label><select id="sector-filter" name="sector"><option value="">All sectors</option>${sectors.map(item => `<option${sector === item ? ' selected' : ''}>${escapeHTML(item)}</option>`).join('')}</select></div><div class="view-toggle" aria-label="View"><a href="#/app/properties?view=table"${view === 'table' ? ' aria-current="page"' : ''} aria-label="Table view">${icon('list')}</a><a href="#/app/properties?view=grid"${view === 'grid' ? ' aria-current="page"' : ''} aria-label="Grid view">${icon('grid-2x2')}</a></div>`;
  return `${pageHeader({ title: config.title, subtitle: `${filtered.length} records · All figures are demo workspace data`, action: 'Add property' })}${filterBar('properties', config, query, extra)}<div class="result-summary"><p><strong>${filtered.length}</strong> matching properties</p><span>Updated from local browser storage</span></div>${view === 'grid' ? `<div class="property-grid app-property-grid">${filtered.map(item => propertyCard(item)).join('')}</div>` : dataTable({ columns: config.columns, rows: filtered, entity: 'properties' })}`;
}

const pipelineStages = [
  ['New', ['New']], ['Contacted', ['Contacted']], ['Qualified', ['Requirement Confirmed', 'Properties Sent', 'Qualified']], ['Visit', ['Site Visit', 'Visit']], ['Negotiation', ['Negotiation', 'Token']], ['Closed', ['Closed']], ['Lost', ['Lost']],
];

function leadPipeline(state, query, config) {
  const filtered = filterRows(state.entities.leads, query, config);
  const agents = Object.fromEntries(state.entities.agents.map(item => [item.id, item.name]));
  return `${pageHeader({ title: 'Lead Pipeline', subtitle: 'Move each enquiry through qualification, visits and negotiation.', action: 'Add lead' })}${filterBar('leads', config, query, `<div class="view-toggle"><a href="#/app/leads?view=pipeline" aria-current="page" aria-label="Pipeline view">${icon('columns-3')}</a><a href="#/app/leads?view=list" aria-label="List view">${icon('list')}</a></div>`)}<div class="pipeline-board">${pipelineStages.map(([stage, statuses]) => {
    const items = filtered.filter(item => statuses.includes(item.status));
    return `<section class="pipeline-column" data-stage="${stage}"><header><h2>${stage}</h2><span>${items.length}</span></header><div class="pipeline-cards">${items.map(lead => `<article class="lead-card" draggable="true" data-lead-id="${lead.id}"><div><span>${statusBadge(lead.priority || 'Medium')}</span><button class="icon-btn" type="button" data-row-action="edit" data-id="${lead.id}" aria-label="Edit ${escapeHTML(lead.name)}">${icon('ellipsis')}</button></div><h3><a href="#/app/leads/${lead.id}">${escapeHTML(lead.name)}</a></h3><p>${escapeHTML(lead.requirement || lead.propertyType)}</p><dl><div><dt>Budget</dt><dd>${formatPKR(lead.budget)}</dd></div><div><dt>Location</dt><dd>${escapeHTML(lead.preferredLocation || 'Open')}</dd></div></dl><footer><span>${escapeHTML(agents[lead.assignedAgentId] || 'Unassigned')}</span><label><span class="sr-only">Move ${escapeHTML(lead.name)} to stage</span><select data-stage-select="${lead.id}">${pipelineStages.map(([label]) => `<option${label === stage ? ' selected' : ''}>${label}</option>`).join('')}</select></label></footer></article>`).join('') || '<p class="pipeline-empty">No leads in this stage.</p>'}</div></section>`;
  }).join('')}</div>`;
}

function leadCollection(state, query, config) {
  const view = query.get('view') || 'pipeline';
  if (view !== 'list') return leadPipeline(state, query, config);
  const rows = filterRows(state.entities.leads, query, config);
  return `${pageHeader({ title: config.title, subtitle: config.subtitle, action: 'Add lead' })}${filterBar('leads', config, query, `<div class="view-toggle"><a href="#/app/leads?view=pipeline" aria-label="Pipeline view">${icon('columns-3')}</a><a href="#/app/leads?view=list" aria-current="page" aria-label="List view">${icon('list')}</a></div>`)}${dataTable({ columns: config.columns, rows, entity: 'leads' })}`;
}

function visitsCollection(state, query, config) {
  const rows = filterRows([...state.entities.visits].sort((a, b) => new Date(a.date) - new Date(b.date)), query, config);
  const confirmed = rows.filter(item => item.status === 'Confirmed').length;
  const completed = rows.filter(item => item.status === 'Completed').length;
  return `${pageHeader({ title: config.title, subtitle: config.subtitle, action: 'Schedule visit', actionIcon: 'calendar-plus' })}<section class="summary-strip"><div><span>Scheduled</span><strong>${rows.filter(item => item.status === 'Scheduled').length}</strong></div><div><span>Confirmed</span><strong>${confirmed}</strong></div><div><span>Completed</span><strong>${completed}</strong></div><div><span>Rescheduled</span><strong>${rows.filter(item => item.status === 'Rescheduled').length}</strong></div></section>${filterBar('visits', config, query)}<div class="visit-agenda"><h2>Visit agenda</h2>${dataTable({ columns: config.columns, rows, entity: 'visits' })}</div>`;
}

function rentalCollection(state, query, config) {
  const rows = filterRows(state.entities.rentals, query, config);
  const monthlyValue = state.entities.rentals.filter(item => item.status === 'Active').reduce((sum, item) => sum + Number(item.monthlyRent || 0), 0);
  return `${pageHeader({ title: config.title, subtitle: config.subtitle, action: 'Add rental' })}<section class="summary-strip"><div><span>Active rentals</span><strong>${state.entities.rentals.filter(item => item.status === 'Active').length}</strong></div><div><span>Expiring leases</span><strong>${state.entities.rentals.filter(item => item.status === 'Expiring').length}</strong></div><div><span>Monthly rental value</span><strong>${formatPKR(monthlyValue)}</strong></div><div><span>Pending renewals</span><strong>${state.entities.rentals.filter(item => item.status === 'Renewal Pending').length}</strong></div></section>${filterBar('rentals', config, query)}${dataTable({ columns: config.columns, rows, entity: 'rentals' })}`;
}

function commissionsPage(state) {
  const deals = state.entities.deals.map(deal => {
    const total = Number(deal.totalCommission || ((deal.salePrice || 0) * (deal.commissionPercent || 0) / 100));
    const split = Number(deal.agentSplitPercent ?? 40);
    const paid = Number(deal.paidCommission || (deal.paymentStatus === 'Paid' ? total : 0));
    return { ...deal, total, agentShare: total * split / 100, companyShare: total * (100 - split) / 100, paid, pending: total - paid };
  });
  const totals = deals.reduce((sum, item) => ({ total: sum.total + item.total, agent: sum.agent + item.agentShare, company: sum.company + item.companyShare, paid: sum.paid + item.paid, pending: sum.pending + item.pending }), { total: 0, agent: 0, company: 0, paid: 0, pending: 0 });
  const columns = [
    { key: 'code', label: 'Deal', render: item => `<a class="table-primary" href="#/app/deals/${item.id}"><strong>${escapeHTML(item.code)}</strong><small>${escapeHTML(state.entities.properties.find(property => property.id === item.propertyId)?.title || 'Property')}</small></a>` },
    { key: 'total', label: 'Total', render: item => formatPKR(item.total) }, { key: 'agentShare', label: 'Agent share', render: item => formatPKR(item.agentShare) }, { key: 'companyShare', label: 'Company share', render: item => formatPKR(item.companyShare) }, { key: 'pending', label: 'Pending', render: item => formatPKR(item.pending) }, { key: 'paymentStatus', label: 'Payment', render: item => statusBadge(item.paymentStatus || 'Pending') },
  ];
  const byMonth = Object.entries(deals.reduce((acc, item) => { const key = new Date(item.createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' }); acc[key] = (acc[key] || 0) + item.total; return acc; }, {})).map(([label, value]) => ({ label, value }));
  return `${pageHeader({ title: 'Commissions', subtitle: 'Calculated from sale value, commission rate and agent split.' })}<section class="summary-strip commission-summary"><div><span>Total commission</span><strong>${formatPKR(totals.total)}</strong></div><div><span>Agent share</span><strong>${formatPKR(totals.agent)}</strong></div><div><span>Company share</span><strong>${formatPKR(totals.company)}</strong></div><div><span>Paid</span><strong>${formatPKR(totals.paid)}</strong></div><div><span>Pending</span><strong>${formatPKR(totals.pending)}</strong></div></section><div class="two-column-workspace"><section class="panel"><header class="panel-header"><div><h2>Monthly commission</h2><p>Based on demo deal creation dates</p></div></header>${simpleBars(byMonth, { valueFormatter: formatPKR })}</section><section class="panel commission-note"><div>${icon('calculator')}</div><h2>Commission method</h2><p>Total commission is sale price multiplied by commission percentage. Agent and company shares use the split stored on each deal.</p></section></div>${dataTable({ columns, rows: deals, entity: 'deals' })}`;
}

export function collectionPage(key, state, query) {
  if (key === 'commissions') return commissionsPage(state);
  const config = getEntityConfig(key, state);
  if (!config) return emptyState('Page unavailable', 'This module has not been configured.');
  if (key === 'properties') return propertyCollection(state, query, config);
  if (key === 'leads') return leadCollection(state, query, config);
  if (key === 'visits') return visitsCollection(state, query, config);
  if (key === 'rentals') return rentalCollection(state, query, config);
  const rows = filterRows(state.entities[key] || [], query, config);
  const action = key === 'documents' ? 'Add document metadata' : `Add ${config.singular.toLowerCase()}`;
  return `${pageHeader({ title: config.title, subtitle: config.subtitle, action })}${key === 'documents' ? '<div class="storage-notice">The frontend demo stores file metadata only. No document is uploaded to a server.</div>' : ''}${filterBar(key, config, query)}${dataTable({ columns: config.columns, rows, entity: key })}`;
}

