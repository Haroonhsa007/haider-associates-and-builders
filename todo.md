Use this as the master Codex prompt. It is written to make Codex build the actual application, not a landing-page mockup.

PROMPT FOR CODEX

You are the lead product engineer, UI/UX designer, frontend architect and brand designer for a premium real-estate technology platform.

Build a complete, production-quality web application for:

HAIDER ASSOCIATES & BUILDERS

Primary contact:
HAIDER CHEEMA

Phone:
0300-9146600

Business:
Real Estate | Sale | Purchase | Rent | Architecture | Structure | Interior Design | Builders

Location:
Islamabad, Pakistan

The application must feel like a serious private operating system for an established Islamabad real-estate and construction company.

Do not build a generic real-estate template.

Do not build a simple landing page.

Build a complete functional application with realistic workflows, persistent data, dashboards, CRUD operations, search, filtering, forms, property management, lead management, agents, clients, site visits, deals, commissions, rentals, projects and documents.

TECH STACK

Use:

HTML5
Tailwind CSS
Vanilla JavaScript ES6+
Lucide icons or another lightweight icon library
CSS animations
JavaScript animations where appropriate
LocalStorage for persistence
No React
No Vue
No Angular
No backend requirement for this version

The application must run locally with a simple browser/server setup.

Structure the project cleanly:

index.html
assets/
css/
js/
data/
components/
pages/

Keep JavaScript modular.

Separate application state, data models, UI rendering, utilities and event handling.

Do not put the entire application into one giant JavaScript file.

BRAND DIRECTION

Use the uploaded Haider Associates & Builders photographs as the primary visual reference.

The branding visible in the photographs is critical.

Existing visual identity:

Primary red
Deep navy / blue
Dark charcoal
Warm cream
Muted gold

The existing physical branding uses:

HAIDER

HAIDER ASSOCIATES & BUILDERS

HAIDER CHEEMA

0300-9146600

The logo contains a house/building symbol with HAIDER typography.

Do not replace the identity with a generic modern startup logo.

Preserve the recognizable Haider identity while improving its digital presentation.

The visual language should feel:

Established
Premium
Architectural
Trustworthy
Professional
Islamabad property market
High-value real estate
Construction
Private client service

Avoid:

Generic SaaS appearance
Bright gradients
Cartoon graphics
Excessive glassmorphism
Neon colors
Cheap-looking cards
Overly rounded UI
Generic stock-business imagery
Startup-style purple gradients

Use strong typography, structured spacing, architectural lines and premium property photography.

BRAND COLORS

Create CSS variables for the brand system.

Primary Red:
#B52A32

Deep Navy:
#101B35

Dark:
#111318

Cream:
#F3EBDD

Gold:
#C8A96B

White:
#FFFFFF

Muted:
#7A7F89

Use the colors consistently.

Red should represent the Haider identity and important actions.

Deep navy should dominate the application shell.

Cream and gold should provide premium architectural accents.

Do not overuse gold.

LOGO

Create a reusable logo component.

Use the existing logo from the supplied reference material where available.

If the actual logo asset is unavailable, recreate a clean vector-style approximation based on the photographed logo:

House/building icon
HAIDER wordmark
Associates & Builders subtitle

Do not create a completely different logo.

Create both:

Full logo
Compact logo/icon

The full logo should work on dark and light backgrounds.

APPLICATION NAME

Use:

HAIDER OS

Subtitle:

Haider Associates & Builders

Do not prominently call the product a generic CRM.

This is the company's internal business operating system.

GLOBAL APPLICATION STRUCTURE

Create:

Login screen
Main dashboard
Properties
Leads
Clients
Agents
Site Visits
Deals
Rentals
Commissions
Projects
Documents
Reports
Settings

Desktop layout:

Fixed left sidebar
Top navigation
Main content area

Mobile layout:

Bottom navigation or collapsible sidebar
Responsive cards
Responsive tables
Mobile-friendly forms

SIDEBAR

Brand at top.

Navigation:

Dashboard
Properties
Leads
Clients
Agents
Site Visits
Deals
Rentals
Commissions
Projects
Documents
Reports
Settings

Separate sections visually:

REAL ESTATE

Properties
Leads
Clients
Site Visits
Deals
Rentals

OPERATIONS

Agents
Commissions
Documents
Reports

CONSTRUCTION

Projects

Use Lucide icons.

DASHBOARD

Build a serious executive dashboard.

Header:

Good morning, Haider

Islamabad Real Estate Operations

Show current date.

Top KPI cards:

Active Properties
New Leads
Site Visits
Active Deals
Monthly Sales
Expected Commission

Use realistic initial data.

Example:

231 Active Properties
27 New Leads
8 Site Visits
12 Active Deals
PKR 18.4 Cr Sales Pipeline
PKR 42.8 Lac Expected Commission

These figures are application seed data and must be clearly editable.

Do not present invented figures as verified company statistics.

Dashboard sections:

Sales pipeline
Recent leads
Upcoming site visits
Recently added properties
Agent activity
Recent deals
Property distribution by sector
Monthly revenue
Lead sources

Create charts with lightweight JavaScript or SVG.

Do not depend on a heavy charting library unless needed.

PROPERTY MANAGEMENT

Create a complete property management interface.

Property fields:

Property ID
Title
Transaction Type
Property Type
Sector
Area
Street
Plot Number
Size
Bedrooms
Bathrooms
Demand Price
Rent Price
Facing
Condition
Description
Owner
Owner Phone
Assigned Agent
Status
Source
Date Added
Last Updated
Images
Documents
Notes

Property types:

Residential Plot
Commercial Plot
House
Apartment
Shop
Office
Upper Portion
Lower Portion
Farmhouse
Commercial Building
Other

Transaction types:

Sale
Rent
Sale & Rent

Statuses:

Available
Reserved
Negotiation
Sold
Rented
Inactive

Create:

Property table
Grid view
Property detail page
Add property form
Edit property form
Delete property
Duplicate property
Archive property

Search by:

Property ID
Location
Sector
Agent
Owner
Price

Filters:

Sale
Rent
Property type
Sector
Price range
Size
Agent
Status

PROPERTY DETAIL PAGE

Create a premium property profile.

Large image gallery.

Property title.

Example:

60 × 90 Residential Plot in D-12/2

Information:

1.2 Kanal
D-12/2
Plot 164
Street 41
Margalla Facing
PKR 14 Crore

Show:

Property information
Owner information
Assigned agent
Documents
Activity timeline
Leads interested
Site visits
Offers
Deal history

Buttons:

Edit
Share
WhatsApp
Call
Schedule Visit
Create Deal

PROPERTY SEED DATA

Use realistic Islamabad property data inspired by the publicly visible business footprint.

Important areas:

D-12
E-12
E-13
B-17

Include examples of:

50 × 90 plots
60 × 90 plots
25 × 40 plots
25 × 50 plots
1 Kanal houses
Commercial properties
Rental properties

Do not claim individual listings are currently available unless they exist in the application's local dataset.

AGENTS

Seed the application with the publicly visible agency team names discovered from the company's Zameen presence.

Include:

Haider Cheema Zaildar
Zeeshan Malik
Arslan Javaid
Muhammad Irfan Cheema
Syed Farhat Abbas Shah
Yasir Malik
M Husnain
Malik Faizan
Ejaz Ul Haq
Shahbaz Ali
Sajid Malik
Asif Bangash
Tahir Mehmood
Riaz Bakhtiari
Rana Yasir

Create agent profiles.

Fields:

Name
Phone
Email
Role
Specialization
Assigned Leads
Properties
Site Visits
Deals
Commission
Status
Join Date
Profile Image

Agent dashboard:

My Leads
My Properties
Today's Follow-ups
Upcoming Visits
Negotiations
Closed Deals
Commission

LEADS

Build a complete lead CRM.

Fields:

Lead ID
Name
Phone
WhatsApp
Email
Lead Type
Requirement
Budget
Preferred Location
Property Type
Size
Source
Assigned Agent
Priority
Status
Last Contact
Next Follow-up
Notes
Created Date

Lead statuses:

New
Contacted
Requirement Confirmed
Properties Sent
Site Visit
Negotiation
Token
Closed
Lost

Lead sources:

Website
WhatsApp
Phone
Zameen
Referral
Walk-in
Facebook
Instagram
Other

Create a visual pipeline board.

Columns:

New
Contacted
Qualified
Visit
Negotiation
Closed
Lost

Allow cards to move between stages.

CLIENTS

Create buyer, seller, landlord and tenant profiles.

Client fields:

Name
Phone
WhatsApp
Email
Type
CNIC placeholder
Preferred Areas
Budget
Property Requirement
Assigned Agent
Notes
Documents
Activity

Client detail should show:

Properties viewed
Properties saved
Site visits
Offers
Deals
Messages
Notes

SITE VISITS

Create appointment management.

Fields:

Client
Property
Agent
Date
Time
Status
Location
Notes
Feedback
Next Action

Statuses:

Scheduled
Confirmed
Completed
Cancelled
Rescheduled

Create calendar-style and list views.

DEALS

Create a full transaction workflow.

Fields:

Deal ID
Property
Buyer
Seller
Agent
Deal Type
Sale Price
Commission %
Total Commission
Token Amount
Payment Status
Deal Stage
Expected Closing
Documents
Notes

Stages:

Offer
Negotiation
Token
Agreement
Payment
Completed
Cancelled

Create deal timeline.

COMMISSION

Automatically calculate:

Sale price × commission percentage

Show:

Total company commission
Agent commission
Company share
Paid
Pending

Create monthly commission report.

RENTALS

Create rental management.

Fields:

Property
Owner
Tenant
Agent
Monthly Rent
Security
Lease Start
Lease End
Commission
Status
Documents

Dashboard:

Active Rentals
Expiring Leases
New Rentals
Monthly Rental Value
Pending Renewals

PROJECTS

Create a construction and architecture management module.

Project categories:

Architecture
Structure
Interior Design
Construction
Renovation

Fields:

Project ID
Client
Project Name
Location
Project Type
Plot Size
Budget
Contract Value
Architect
Engineer
Project Manager
Start Date
Expected Completion
Status
Progress
Documents
Expenses
Notes

Project stages:

Lead
Consultation
Design
Approval
Construction
Finishing
Completed

Project detail:

Progress bar
Financial summary
Team
Milestones
Expenses
Documents
Activity timeline

DOCUMENTS

Create a document management interface.

Categories:

Property Documents
Client Documents
Deal Documents
Rental Documents
Construction Documents
Identity Documents
Contracts
Receipts
Other

Allow:

Upload UI
Search
Filter
Preview
Download
Delete

Since this frontend version has no backend, use LocalStorage and mock file metadata.

Do not pretend files are uploaded to a real server.

REPORTS

Build useful business reports.

Reports:

Property inventory
Sales pipeline
Closed deals
Agent performance
Lead conversion
Rental portfolio
Commission
Property by sector
Property by type
Monthly activity

Allow date filtering.

Create print-friendly report layouts.

SEARCH

Create global search.

Search across:

Properties
Leads
Clients
Agents
Deals
Projects

Use a command-palette style interface.

Keyboard shortcut:

/

Search results should show entity type, name, relevant information and action.

NOTIFICATIONS

Create a notification system.

Examples:

New lead assigned
Site visit tomorrow
Follow-up overdue
Deal awaiting payment
Lease expiring
Document missing

Create notification dropdown in the top navigation.

ACTIVITY TIMELINE

Every major entity should have an activity timeline.

Examples:

Lead created
Agent assigned
Property sent
Client contacted
Site visit scheduled
Offer received
Negotiation updated
Deal created
Payment received

Use timestamps and user names.

DATA PERSISTENCE

Use LocalStorage.

Create a centralized application state.

Seed the application on first launch.

After modifications, persist data.

Provide:

Reset demo data
Export data
Import data

Export all application data as JSON.

Import JSON back into the application.

Do not lose data during navigation or page refresh.

IMAGE SYSTEM

The property application needs strong visual presentation.

Use the supplied Haider branding images as reference material.

Where image generation capability is available, generate original architectural/property imagery matching:

Islamabad luxury homes
D-12 residential plots
E-12 residential streets
Modern Islamabad villas
Commercial properties
Contemporary Pakistani architecture
Premium interiors
Construction projects

Do not use generic random imagery where a generated branded asset would work better.

Create an assets structure:

assets/images/properties/
assets/images/projects/
assets/images/brand/
assets/images/team/

Use generated images consistently.

Do not use recognizable real people as team portraits unless actual supplied photographs exist.

If image generation is unavailable, create elegant local placeholders using CSS/SVG and structure the code so generated assets can be dropped in later.

ANIMATIONS

Use tasteful professional animation.

Page transitions
Sidebar transitions
Modal transitions
Card hover effects
Table row interactions
Dropdown animations
Pipeline movement
KPI number animation
Chart entrance animation
Image gallery transitions
Toast notifications
Loading skeletons

Use CSS transitions and lightweight JavaScript.

Do not over-animate.

The application should feel fast and expensive.

DESIGN DETAILS

Use:

Strong hierarchy
Large property photography
Thin architectural lines
Subtle borders
Premium shadows
Clean tables
Compact controls
Strong red accents
Deep navy navigation
Cream/gold supporting accents

Use moderate border radius.

Avoid excessive pill-shaped elements.

Avoid excessive rounded cards.

The design should look suitable for a serious Islamabad property company handling high-value transactions.

TYPOGRAPHY

Use a strong serif or display face for major brand headings where appropriate.

Use a clean sans-serif for application UI.

Maintain excellent readability.

The word HAIDER should receive special typographic treatment in brand areas.

PUBLIC WEBSITE

In addition to the internal application, create a polished public-facing website.

Pages:

Home
Properties
Property Detail
Services
About
Projects
Contact

Hero:

HAIDER ASSOCIATES & BUILDERS

Real Estate, Architecture & Construction

Islamabad, Pakistan

0300-9146600

Primary actions:

View Properties
Contact Haider Associates

Services:

Sale
Purchase
Rent
Architecture
Structure
Interior Design
Builders

Property search should connect to the same local property dataset used by the application.

Do not make the public website visually identical to the admin dashboard.

The public site should feel premium and editorial.

The internal system should feel operational and data-driven.

RESPONSIVE DESIGN

Test:

Desktop 1440px
Laptop 1280px
Tablet 768px
Mobile 390px

No horizontal scrolling.

Tables should transform appropriately on mobile.

Forms must work on mobile.

IMAGE PERFORMANCE

Lazy-load property images.

Use appropriate image dimensions.

Avoid huge unoptimized assets.

ACCESSIBILITY

Use semantic HTML.

Keyboard navigation.

Visible focus states.

Accessible labels.

Good contrast.

ARIA attributes where needed.

PERFORMANCE

Keep the application fast.

Avoid unnecessary dependencies.

Avoid huge JavaScript bundles.

Avoid excessive DOM manipulation.

SECURITY MODEL

Since this version has no backend, create the UI and state structure so authentication and role permissions can later connect to a real backend.

Define roles:

Super Admin
Admin
Manager
Agent
Accountant
Project Manager

Different navigation visibility should reflect roles.

Use mock authentication for the current version.

Example accounts:

[admin@haiderassociates.pk](mailto:admin@haiderassociates.pk)
[manager@haiderassociates.pk](mailto:manager@haiderassociates.pk)
[agent@haiderassociates.pk](mailto:agent@haiderassociates.pk)

Use a simple local authentication layer.

Do not present this as production-grade security.

APPLICATION ARCHITECTURE

Create reusable components:

Sidebar
Topbar
Modal
Drawer
Table
DataTable
PropertyCard
AgentCard
LeadCard
StatusBadge
KPI
Chart
Timeline
Notification
FormField
Search
EmptyState
LoadingState
Toast
ConfirmDialog

Do not duplicate UI markup unnecessarily.

UX DETAILS

Every action needs feedback.

When saving:

Show success toast.

When deleting:

Show confirmation.

When filtering:

Update results immediately.

When searching:

Show results immediately.

When there is no data:

Show a professional empty state.

When loading:

Show skeleton loaders.

Do not leave buttons non-functional.

Every major button should perform a meaningful action.

DEMO DATA

Seed enough data to make the application feel alive.

At least:

30 properties
20 leads
15 agents
20 clients
12 site visits
10 deals
10 rental records
10 projects
20 documents
30 activity events
15 notifications

Use realistic Pakistani names and Islamabad locations.

Use PKR currency.

Format currency correctly.

Examples:

PKR 1.95 Crore
PKR 7.25 Crore
PKR 14 Crore
PKR 26 Crore

Use both Crore and Lakh formatting where appropriate.

Do not use dollar signs.

DO NOT INVENT COMPANY CLAIMS

The application is a product build based on publicly available business information.

Keep company facts separate from seeded application data.

Do not claim:

Verified awards
Verified certifications
Verified Google reviews
Verified offices
Verified projects
Verified clients

unless supplied as verified data.

Create realistic sample records but label them internally as seed/demo records in code.

FINAL QUALITY BAR

Before finishing:

Check every navigation item.

Check every button.

Check every form.

Check every modal.

Check add/edit/delete flows.

Check LocalStorage persistence.

Check search.

Check filters.

Check responsive layouts.

Check mobile navigation.

Check dark/light contrast where applicable.

Check browser console for errors.

Check broken images.

Check missing links.

Check overflow.

Check animations.

Check empty states.

Check seeded data.

Check currency formatting.

Check all pages.

Do not stop after creating the dashboard.

The finished application should feel like a complete internal business platform.

Most importantly:

Make HAIDER ASSOCIATES & BUILDERS look like an established, premium Islamabad real-estate and construction company.

The physical branding shown in the supplied photographs must remain recognizable.

The red HAIDER identity, deep navy environment, cream/gold accents, architectural visual language and 0300-9146600 contact identity must be carried consistently throughout the product.

The final result should feel custom-built for Haider Associates & Builders, not adapted from a generic CRM template.

Start by inspecting the existing repository.

Then establish the design system.

Then build the application architecture.

Then build the public website.

Then build the internal operating system.

Then seed the database.

Then test every workflow.

Do not ask for permission between these steps. Make reasonable product decisions and implement the complete application.
