import { formatDate, formatPKR, getGreeting, escapeHTML } from '../utils.js';
import { icon, pageHeader, propertyCard, simpleBars, statusBadge } from '../components/ui.js';

function countBy(items, key) {
  return items.reduce((result, item) => {
    const value = item[key] || 'Other';
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}

export function dashboardPage(state, session) {
  const { properties, leads, visits, deals, agents } = state.entities;
  const today = new Date();
  const activeProperties = properties.filter(item => ['Available', 'Reserved', 'Negotiation'].includes(item.status));
  const newLeads = leads.filter(item => ['New', 'Contacted'].includes(item.status));
  const upcomingVisits = visits.filter(item => new Date(item.date) >= new Date(today.toDateString()) && !['Cancelled', 'Completed'].includes(item.status));
  const activeDeals = deals.filter(item => !['Completed', 'Cancelled'].includes(item.stage));
  const pipeline = activeDeals.reduce((sum, item) => sum + Number(item.salePrice || 0), 0);
  const expectedCommission = activeDeals.reduce((sum, item) => sum + Number(item.totalCommission || ((item.salePrice || 0) * (item.commissionPercent || 0) / 100)), 0);
  const leadSources = Object.entries(countBy(leads, 'source')).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  const sectors = Object.entries(countBy(properties, 'sector')).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const recentProperties = [...properties].sort((a, b) => new Date(b.dateAdded || b.createdAt) - new Date(a.dateAdded || a.createdAt)).slice(0, 4);
  const agentMap = Object.fromEntries(agents.map(agent => [agent.id, agent.name]));
  const stages = ['Offer', 'Negotiation', 'Token', 'Agreement', 'Payment', 'Completed'];
  const pipelineData = stages.map(label => ({ label, value: deals.filter(item => item.stage === label).length }));

  return `${pageHeader({ eyebrow: 'Operations control', title: `${getGreeting()}, ${(session?.name || 'Haider').split(' ')[0]}`, subtitle: `Islamabad property, client and project control · ${today.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` })}
    <section class="kpi-grid kpi-band" aria-labelledby="workspace-summary"><h2 class="sr-only" id="workspace-summary">Workspace summary</h2>
      ${[
        ['Active Properties', activeProperties.length, 'building-2', 'In current inventory'],
        ['New Leads', newLeads.length, 'contact-round', 'Require attention'],
        ['Upcoming Visits', upcomingVisits.length, 'calendar-check-2', 'Scheduled ahead'],
        ['Active Deals', activeDeals.length, 'handshake', 'Across open stages'],
      ].map(([label, value, iconName, note]) => `<article class="kpi-card kpi-item"><div>${icon(iconName)}</div><p>${label}</p><strong data-count="${value}">${value}</strong><span>${note}</span></article>`).join('')}
      <article class="kpi-card kpi-item kpi-financial"><p>Sales pipeline</p><strong>${formatPKR(pipeline)}</strong><span>Derived from active demo deals</span></article>
      <article class="kpi-card kpi-item kpi-financial"><p>Expected commission</p><strong>${formatPKR(expectedCommission)}</strong><span>Calculated from deal records</span></article>
    </section>

    <div class="dashboard-grid">
      <section class="panel panel-pipeline span-8"><header class="panel-header"><div><h2>Sales pipeline</h2><p>Open records by deal stage</p></div><a href="#/app/deals">View deals</a></header>${simpleBars(pipelineData)}</section>
      <section class="panel panel-visits span-4"><header class="panel-header"><div><h2>Upcoming visits</h2><p>Next client appointments</p></div><a href="#/app/visits">View calendar</a></header><div class="visit-list">${upcomingVisits.slice(0, 5).map(visit => {
        const property = properties.find(item => item.id === visit.propertyId);
        return `<article><time datetime="${escapeHTML(visit.date)}"><strong>${new Date(visit.date).toLocaleDateString('en-PK', { day: '2-digit' })}</strong><span>${new Date(visit.date).toLocaleDateString('en-PK', { month: 'short' })}</span></time><div><h3>${escapeHTML(visit.clientName || visit.client || 'Client visit')}</h3><p>${escapeHTML(property?.title || visit.location || 'Islamabad property')}</p><small>${escapeHTML(visit.time || '')} · ${escapeHTML(agentMap[visit.agentId] || 'Team')}</small></div>${statusBadge(visit.status)}</article>`;
      }).join('') || '<p class="panel-empty">No upcoming visits.</p>'}</div></section>
      <section class="panel panel-leads span-7"><header class="panel-header"><div><h2>Recent leads</h2><p>Newest enquiries and follow-ups</p></div><a href="#/app/leads">Open pipeline</a></header><div class="compact-list">${recentLeads.map(lead => `<a href="#/app/leads/${lead.id}"><div class="initials">${escapeHTML(lead.name.split(' ').map(value => value[0]).slice(0, 2).join(''))}</div><span><strong>${escapeHTML(lead.name)}</strong><small>${escapeHTML(lead.requirement || lead.propertyType)} · ${escapeHTML(lead.preferredLocation || '')}</small></span><span>${statusBadge(lead.status)}<small>${formatDate(lead.nextFollowUp)}</small></span></a>`).join('')}</div></section>
      <section class="panel panel-sectors span-5"><header class="panel-header"><div><h2>Property by sector</h2><p>Current inventory distribution</p></div></header>${simpleBars(sectors)}</section>
      <section class="panel panel-sources span-5"><header class="panel-header"><div><h2>Lead sources</h2><p>Where enquiries begin</p></div></header>${simpleBars(leadSources)}</section>
      <section class="panel panel-agents span-7"><header class="panel-header"><div><h2>Agent activity</h2><p>Open work assigned by agent</p></div><a href="#/app/agents">View team</a></header><div class="agent-activity-list">${agents.slice(0, 6).map(agent => {
        const agentLeads = leads.filter(item => item.assignedAgentId === agent.id && item.status !== 'Closed').length;
        const agentProperties = properties.filter(item => item.assignedAgentId === agent.id && item.status === 'Available').length;
        return `<a href="#/app/agents/${agent.id}"><div class="avatar">${escapeHTML(agent.name.split(' ').map(value => value[0]).slice(0, 2).join(''))}</div><span><strong>${escapeHTML(agent.name)}</strong><small>${escapeHTML(agent.specialization || 'Property advisory')}</small></span><dl><div><dt>Leads</dt><dd>${agentLeads}</dd></div><div><dt>Listings</dt><dd>${agentProperties}</dd></div></dl></a>`;
      }).join('')}</div></section>
      <section class="panel panel-properties span-12"><header class="panel-header"><div><h2>Recently added properties</h2><p>Latest records in the local workspace</p></div><a href="#/app/properties">View inventory</a></header><div class="dashboard-property-grid">${recentProperties.map(property => propertyCard(property)).join('')}</div></section>
    </div>`;
}
