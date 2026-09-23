import { escapeHTML, formatDate, formatPKR } from '../utils.js';
import { dataTable, icon, pageHeader, simpleBars, statusBadge } from '../components/ui.js';

function groupCount(items, field) {
  return Object.entries(items.reduce((acc, item) => {
    const key = item[field] || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function reportDefinitions(state) {
  const { properties, leads, deals, agents, rentals, activities } = state.entities;
  const agentRows = agents.map(agent => {
    const assignedLeads = leads.filter(item => item.assignedAgentId === agent.id);
    const closed = deals.filter(item => item.agentId === agent.id && item.stage === 'Completed');
    return { ...agent, assignedLeads: assignedLeads.length, closedDeals: closed.length, value: closed.reduce((sum, item) => sum + Number(item.salePrice || 0), 0) };
  });
  return {
    inventory: {
      title: 'Property inventory', description: 'Inventory count and value by sector.', chart: groupCount(properties, 'sector'),
      columns: [{ key: 'title', label: 'Property' }, { key: 'sector', label: 'Sector' }, { key: 'propertyType', label: 'Type' }, { key: 'demandPrice', label: 'Demand', render: item => formatPKR(item.demandPrice || item.rentPrice) }, { key: 'status', label: 'Status', render: item => statusBadge(item.status) }], rows: properties,
    },
    pipeline: {
      title: 'Sales pipeline', description: 'Deal volume and value across each active stage.', chart: groupCount(deals, 'stage'),
      columns: [{ key: 'code', label: 'Deal' }, { key: 'stage', label: 'Stage', render: item => statusBadge(item.stage) }, { key: 'salePrice', label: 'Value', render: item => formatPKR(item.salePrice) }, { key: 'expectedClosing', label: 'Expected closing', render: item => formatDate(item.expectedClosing) }, { key: 'paymentStatus', label: 'Payment' }], rows: deals,
    },
    performance: {
      title: 'Agent performance', description: 'Assigned leads, completed deals and closed value.', chart: agentRows.map(item => ({ label: item.name.split(' ')[0], value: item.closedDeals })),
      columns: [{ key: 'name', label: 'Agent' }, { key: 'specialization', label: 'Specialization' }, { key: 'assignedLeads', label: 'Assigned leads' }, { key: 'closedDeals', label: 'Closed deals' }, { key: 'value', label: 'Closed value', render: item => formatPKR(item.value) }], rows: agentRows,
    },
    conversion: {
      title: 'Lead conversion', description: 'Lead distribution across the qualification lifecycle.', chart: groupCount(leads, 'status'),
      columns: [{ key: 'name', label: 'Lead' }, { key: 'source', label: 'Source' }, { key: 'preferredLocation', label: 'Location' }, { key: 'budget', label: 'Budget', render: item => formatPKR(item.budget) }, { key: 'status', label: 'Status', render: item => statusBadge(item.status) }], rows: leads,
    },
    rentals: {
      title: 'Rental portfolio', description: 'Lease status, expiry and monthly rental value.', chart: groupCount(rentals, 'status'),
      columns: [{ key: 'code', label: 'Rental' }, { key: 'monthlyRent', label: 'Monthly rent', render: item => formatPKR(item.monthlyRent) }, { key: 'leaseStart', label: 'Lease start', render: item => formatDate(item.leaseStart) }, { key: 'leaseEnd', label: 'Lease end', render: item => formatDate(item.leaseEnd) }, { key: 'status', label: 'Status', render: item => statusBadge(item.status) }], rows: rentals,
    },
    activity: {
      title: 'Monthly activity', description: 'Recorded actions in the local demonstration workspace.', chart: Object.entries(activities.reduce((acc, item) => { const label = new Date(item.timestamp || item.createdAt).toLocaleDateString('en-PK', { month: 'short' }); acc[label] = (acc[label] || 0) + 1; return acc; }, {})).map(([label, value]) => ({ label, value })),
      columns: [{ key: 'title', label: 'Activity' }, { key: 'entityType', label: 'Record type' }, { key: 'actor', label: 'Actor' }, { key: 'timestamp', label: 'Date', render: item => formatDate(item.timestamp || item.createdAt) }], rows: activities,
    },
  };
}

export function reportsPage(state, query) {
  const reports = reportDefinitions(state);
  const activeKey = reports[query.get('report')] ? query.get('report') : 'inventory';
  const active = reports[activeKey];
  const from = query.get('from') || '';
  const to = query.get('to') || '';
  const rows = active.rows.filter(item => {
    const date = new Date(item.createdAt || item.dateAdded || item.timestamp || 0);
    return (!from || date >= new Date(from)) && (!to || date <= new Date(`${to}T23:59:59`));
  });
  return `${pageHeader({ title: 'Reports', subtitle: 'Operational reporting from the current local browser dataset.' })}<div class="report-tabs" role="navigation" aria-label="Report types">${Object.entries(reports).map(([key, report]) => `<a href="#/app/reports?report=${key}"${key === activeKey ? ' aria-current="page"' : ''}>${escapeHTML(report.title)}</a>`).join('')}</div><form class="report-filter" data-report-filter><input type="hidden" name="report" value="${activeKey}" /><div><label for="report-from">From</label><input id="report-from" name="from" type="date" value="${escapeHTML(from)}" /></div><div><label for="report-to">To</label><input id="report-to" name="to" type="date" value="${escapeHTML(to)}" /></div><button class="btn btn-secondary" type="submit">Apply dates</button><button class="btn btn-navy" type="button" data-action="print-report">${icon('printer')} Print report</button></form><section class="report-heading"><div><p>HAIDER OS · Demo report</p><h2>${escapeHTML(active.title)}</h2><span>${escapeHTML(active.description)}</span></div><div><strong>${rows.length}</strong><span>matching records</span></div></section><div class="report-layout"><section class="panel"><h2>${escapeHTML(active.title)} summary</h2>${simpleBars(active.chart.slice(0, 10), { valueFormatter: value => String(value) })}</section><aside class="report-note"><h2>Reporting note</h2><p>Figures are calculated from local demonstration records. They are not verified company statistics.</p><dl><div><dt>Generated</dt><dd>${new Date().toLocaleDateString('en-PK')}</dd></div><div><dt>Date range</dt><dd>${from || 'All'} to ${to || 'All'}</dd></div><div><dt>Currency</dt><dd>Pakistani Rupee</dd></div></dl></aside></div>${dataTable({ columns: active.columns, rows, entity: 'reports', emptyTitle: 'No report records in this period', actions: false })}`;
}

export function settingsPage(state, session) {
  const counts = Object.entries(state.entities).filter(([, value]) => Array.isArray(value)).map(([key, value]) => [key, value.length]);
  return `${pageHeader({ title: 'Settings', subtitle: 'Workspace profile, local data controls and demonstration access.' })}<div class="settings-layout"><section class="settings-main"><article class="settings-section"><header><div>${icon('building-2')}</div><span><h2>Company profile</h2><p>Identity used across public and internal surfaces.</p></span></header><form data-company-settings class="form-grid"><div class="form-field"><label for="company-name">Company name</label><input id="company-name" name="name" value="${escapeHTML(state.company?.name || 'Haider Associates & Builders')}" /></div><div class="form-field"><label for="contact-name">Primary contact</label><input id="contact-name" name="contactName" value="${escapeHTML(state.company?.contactName || 'Haider Cheema')}" /></div><div class="form-field"><label for="company-phone">Phone</label><input id="company-phone" name="phone" value="${escapeHTML(state.company?.phone || '0300-9146600')}" /></div><div class="form-field"><label for="company-city">Location</label><input id="company-city" name="city" value="${escapeHTML(state.company?.city || 'Islamabad, Pakistan')}" /></div><div class="field-full"><button class="btn btn-primary" type="submit">Save profile</button></div></form></article><article class="settings-section"><header><div>${icon('database')}</div><span><h2>Local data</h2><p>Export, import or reset this browser's demonstration workspace.</p></span></header><div class="data-actions"><button class="btn btn-navy" type="button" data-action="export-data">${icon('download')} Export JSON</button><label class="btn btn-secondary" for="import-data">${icon('upload')} Import JSON</label><input class="sr-only" id="import-data" type="file" accept="application/json" data-import-input /><button class="btn btn-danger" type="button" data-action="reset-data">${icon('rotate-ccw')} Reset demo data</button></div><div class="storage-notice">All records live in LocalStorage on this device. Import replaces the current dataset after validation.</div></article><article class="settings-section"><header><div>${icon('shield-check')}</div><span><h2>Access model</h2><p>Role visibility is a demonstration and does not secure data.</p></span></header><div class="role-grid">${['Super Admin', 'Admin', 'Manager', 'Agent', 'Accountant', 'Project Manager'].map(role => `<article${session?.role === role ? ' class="is-active"' : ''}><strong>${role}</strong><p>${role === 'Agent' ? 'Own property, lead and visit workflows' : role === 'Accountant' ? 'Deals, rentals, commission and reporting' : role === 'Project Manager' ? 'Projects, clients and documents' : 'Broad operational access'}</p></article>`).join('')}</div></article></section><aside class="settings-summary"><div class="avatar large">${escapeHTML((session?.name || 'HC').split(' ').map(value => value[0]).slice(0, 2).join(''))}</div><h2>${escapeHTML(session?.name || 'Haider Cheema')}</h2>${statusBadge(session?.role || 'Super Admin')}<hr /><h3>Dataset summary</h3><dl>${counts.map(([label, value]) => `<div><dt>${escapeHTML(label.replace(/([A-Z])/g, ' $1'))}</dt><dd>${value}</dd></div>`).join('')}</dl><p>Schema ${escapeHTML(state.schemaVersion ?? state.meta?.schemaVersion ?? 1)} · Seeded demonstration data</p></aside></div>`;
}
