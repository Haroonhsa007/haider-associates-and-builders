import { LAND_TYPES } from "../js/components/plot-visual.js";

/**
 * HAIDER OS demo seed.
 *
 * These are fictional sample records for product demonstration. They do not
 * represent verified listings, clients, projects, transactions, or performance.
 */

const DAY_MS = 86_400_000;

function localDate(offset = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isoDateTime(offset = 0, hour = 10, minute = 0) {
  const date = new Date(Date.now() + offset * DAY_MS);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function imagePath(folder) {
  if (folder === "projects") return "./assets/images/projects/villa-construction.jpg";
  return "";
}

/**
 * Photography is chosen by what the record actually is, never by index.
 *
 * Land records deliberately return no photograph: a plot is not a house, so the
 * listing falls back to the site-plan drawing in components/plot-visual.js.
 * Attaching real listing photos (the Zameen ad images, for example) to a record
 * overrides this automatically.
 */
export function propertyImages(propertyType) {
  const commercial = ["Office", "Shop", "Commercial Building"];
  const interior = ["Apartment", "Upper Portion", "Lower Portion"];
  if (LAND_TYPES.has(propertyType)) return [];
  if (commercial.includes(propertyType)) return ["./assets/images/properties/islamabad-commercial.jpg"];
  if (interior.includes(propertyType)) return ["./assets/images/properties/premium-interior.jpg"];
  return ["./assets/images/properties/islamabad-villa-hero.jpg"];
}

const agentRows = [
  ["Haider Cheema Zaildar", "0300-9146600", "haider@haiderassociates.pk", "Super Admin", "Investment & prime sectors"],
  ["Zeeshan Malik", "0301-7824101", "zeeshan@haiderassociates.pk", "Manager", "Residential plots"],
  ["Arslan Javaid", "0333-5129410", "arslan@haiderassociates.pk", "Senior Agent", "D-12 & E-12"],
  ["Muhammad Irfan Cheema", "0321-8542031", "irfan@haiderassociates.pk", "Senior Agent", "Houses & villas"],
  ["Syed Farhat Abbas Shah", "0307-6221458", "farhat@haiderassociates.pk", "Agent", "Commercial property"],
  ["Yasir Malik", "0312-4408170", "yasir@haiderassociates.pk", "Agent", "Rentals"],
  ["M Husnain", "0345-6102784", "husnain@haiderassociates.pk", "Agent", "B-17"],
  ["Malik Faizan", "0309-7731142", "faizan@haiderassociates.pk", "Agent", "E-13"],
  ["Ejaz Ul Haq", "0334-9016735", "ejaz@haiderassociates.pk", "Agent", "Commercial leasing"],
  ["Shahbaz Ali", "0315-2248706", "shahbaz@haiderassociates.pk", "Agent", "Apartments"],
  ["Sajid Malik", "0306-7183924", "sajid@haiderassociates.pk", "Agent", "New developments"],
  ["Asif Bangash", "0322-6851490", "asif@haiderassociates.pk", "Agent", "Farmhouses"],
  ["Tahir Mehmood", "0346-4301752", "tahir@haiderassociates.pk", "Agent", "G sectors"],
  ["Riaz Bakhtiari", "0332-7590268", "riaz@haiderassociates.pk", "Agent", "Overseas clients"],
  ["Rana Yasir", "0308-1965437", "rana@haiderassociates.pk", "Agent", "Construction sales"],
];

const clientRows = [
  ["Adeel Ahmed", "0301-5550181", "adeel.ahmed@example.pk", "Buyer", ["D-12", "E-12"], 145_000_000],
  ["Sana Imran", "0321-5550182", "sana.imran@example.pk", "Buyer", ["E-11", "F-11"], 85_000_000],
  ["Kamran Abbasi", "0333-5550183", "kamran.abbasi@example.pk", "Seller", ["D-12"], 140_000_000],
  ["Hina Qureshi", "0300-5550184", "hina.qureshi@example.pk", "Landlord", ["F-8", "G-9"], 0],
  ["Bilal Khan", "0345-5550185", "bilal.khan@example.pk", "Tenant", ["DHA Phase II", "Bahria Town"], 350_000],
  ["Mariam Siddiqui", "0312-5550186", "mariam.s@example.pk", "Buyer", ["B-17", "E-13"], 45_000_000],
  ["Omer Farooq", "0307-5550187", "omer.farooq@example.pk", "Seller", ["B-17"], 32_000_000],
  ["Nadia Mahmood", "0322-5550188", "nadia.mahmood@example.pk", "Tenant", ["E-11", "F-10"], 240_000],
  ["Waqas Ali", "0334-5550189", "waqas.ali@example.pk", "Buyer", ["I-8", "G-11"], 110_000_000],
  ["Amna Raza", "0306-5550190", "amna.raza@example.pk", "Seller", ["E-12"], 72_000_000],
  ["Farhan Mir", "0315-5550191", "farhan.mir@example.pk", "Landlord", ["Blue Area", "F-7"], 0],
  ["Mehwish Tariq", "0308-5550192", "mehwish.t@example.pk", "Buyer", ["D-12", "G-13"], 58_000_000],
  ["Usman Ghani", "0346-5550193", "usman.ghani@example.pk", "Seller", ["G-13"], 50_000_000],
  ["Rabia Hassan", "0332-5550194", "rabia.hassan@example.pk", "Tenant", ["F-10", "F-11"], 185_000],
  ["Saad Chaudhry", "0309-5550195", "saad.c@example.pk", "Buyer", ["Gulberg Greens"], 180_000_000],
  ["Zara Sheikh", "0320-5550196", "zara.sheikh@example.pk", "Landlord", ["E-11"], 0],
  ["Hamza Nadeem", "0335-5550197", "hamza.n@example.pk", "Buyer", ["B-17", "D-17"], 26_000_000],
  ["Iqra Saleem", "0311-5550198", "iqra.saleem@example.pk", "Seller", ["DHA Phase II"], 95_000_000],
  ["Faisal Nawaz", "0305-5550199", "faisal.nawaz@example.pk", "Tenant", ["Blue Area", "G-8"], 450_000],
  ["Ayesha Khalid", "0347-5550200", "ayesha.k@example.pk", "Buyer", ["E-12", "D-12"], 135_000_000],
];

function buildAgents() {
  return agentRows.map(([name, phone, email, role, specialization], index) => ({
    id: `agent-${String(index + 1).padStart(3, "0")}`,
    code: `AG-${String(index + 1).padStart(3, "0")}`,
    name,
    phone,
    email,
    role,
    specialization,
    assignedLeads: 0,
    properties: 0,
    siteVisits: 0,
    deals: 0,
    commission: 0,
    status: index < 13 ? "Active" : "On Leave",
    joinDate: localDate(-1440 + index * 62),
      profileImage: "",
  }));
}

function buildClients() {
  return clientRows.map(([name, phone, email, type, preferredAreas, budget], index) => ({
    id: `client-${String(index + 1).padStart(3, "0")}`,
    code: `CL-${String(index + 1).padStart(4, "0")}`,
    name,
    phone,
    whatsapp: phone,
    email,
    type,
    cnic: "•••••-•••••••-•",
    preferredAreas,
    budget,
    propertyRequirement: type === "Tenant" ? "Ready property on a one-year lease" : type === "Buyer" ? "Verified-title property for personal use or investment" : "Professional marketing and qualified inquiries",
    assignedAgentId: `agent-${String((index % 15) + 1).padStart(3, "0")}`,
    status: "Active",
    notes: "Demo client record. Verify identity and requirements before any transaction.",
    documents: [],
    activity: [],
    createdAt: isoDateTime(-140 + index * 5, 11, index % 2 ? 30 : 0),
    updatedAt: isoDateTime(-Math.max(1, 20 - index), 14, 15),
  }));
}

const propertyRows = [
  ["60 × 90 Residential Plot in D-12/2", "Sale", "Residential Plot", "D-12/2", "D-12", "41", "164", "1.2 Kanal", 0, 0, 140_000_000, 0, "Margalla", "Possession", 3, 1, "Available", "Referral"],
  ["50 × 90 Corner Plot in D-12/3", "Sale", "Residential Plot", "D-12/3", "D-12", "18", "72", "1 Kanal", 0, 0, 118_000_000, 0, "North East", "Possession", 13, 3, "Negotiation", "Zameen"],
  ["Architect-Designed 1 Kanal House", "Sale", "House", "D-12/1", "D-12", "6", "21", "1 Kanal", 6, 7, 265_000_000, 0, "Margalla", "Brand New", 3, 4, "Available", "Walk-in"],
  ["25 × 50 Residential Plot in E-12/2", "Sale", "Residential Plot", "E-12/2", "E-12", "32", "418", "5 Marla", 0, 0, 19_500_000, 0, "West", "Possession", 10, 8, "Available", "Website"],
  ["50 × 90 Boulevard Plot in E-12/3", "Sale", "Residential Plot", "E-12/3", "E-12", "12", "89", "1 Kanal", 0, 0, 72_500_000, 0, "South", "Possession", 10, 2, "Reserved", "Phone"],
  ["60 × 90 Plot Near Margalla Avenue", "Sale", "Residential Plot", "E-12/1", "E-12", "9", "116", "1.2 Kanal", 0, 0, 82_000_000, 0, "Margalla", "Possession", 18, 3, "Negotiation", "Zameen"],
  ["25 × 40 Park-Facing Plot", "Sale", "Residential Plot", "E-13", "E-13", "15", "204", "4 Marla", 0, 0, 12_800_000, 0, "Park", "Developed", 7, 8, "Available", "Facebook"],
  ["30 × 60 Residential Plot", "Sale", "Residential Plot", "E-13", "E-13", "27", "311", "8 Marla", 0, 0, 22_500_000, 0, "North", "Developed", 7, 7, "Available", "Referral"],
  ["B-17 Multi Gardens 1 Kanal Plot", "Sale", "Residential Plot", "B-17 Block B", "B-17", "8", "124", "1 Kanal", 0, 0, 31_000_000, 0, "Boulevard", "Possession", 7, 7, "Available", "Zameen"],
  ["B-17 Compact Family House", "Sale", "House", "B-17 Block C", "B-17", "22", "65", "8 Marla", 4, 5, 48_500_000, 0, "East", "Excellent", 7, 11, "Sold", "Website"],
  ["D-17 Commercial Plot", "Sale", "Commercial Plot", "D-17 Markaz", "D-17", "Main Boulevard", "C-18", "8 Marla", 0, 0, 86_000_000, 0, "Boulevard", "Possession", 13, 5, "Available", "Referral"],
  ["Blue Area Corporate Office", "Rent", "Office", "Blue Area", "Blue Area", "Jinnah Avenue", "B-704", "2,100 sq ft", 0, 2, 0, 650_000, "Jinnah Avenue", "Fitted", 11, 9, "Rented", "Phone"],
  ["F-7 Markaz Retail Shop", "Sale & Rent", "Shop", "F-7 Markaz", "F-7", "College Road", "S-12", "650 sq ft", 0, 1, 95_000_000, 420_000, "Market", "Renovated", 11, 5, "Negotiation", "Walk-in"],
  ["F-8 Upper Portion with Terrace", "Rent", "Upper Portion", "F-8/1", "F-8", "33", "19", "1 Kanal", 3, 3, 0, 285_000, "Green Belt", "Excellent", 4, 6, "Rented", "WhatsApp"],
  ["F-10 Family Apartment", "Rent", "Apartment", "F-10 Markaz", "F-10", "Service Road", "A-402", "1,850 sq ft", 3, 3, 0, 195_000, "City", "Furnished", 16, 10, "Rented", "Instagram"],
  ["F-11 Ground Floor Portion", "Rent", "Lower Portion", "F-11/3", "F-11", "48", "82", "1 Kanal", 3, 4, 0, 235_000, "Park", "Excellent", 16, 6, "Rented", "Website"],
  ["G-9 Furnished Executive Apartment", "Rent", "Apartment", "G-9/3", "G-9", "Ibn-e-Sina Road", "E-203", "1,400 sq ft", 2, 2, 0, 165_000, "City", "Furnished", 4, 10, "Rented", "Zameen"],
  ["G-11 Corner House", "Sale", "House", "G-11/2", "G-11", "56", "101", "14 Marla", 5, 6, 135_000_000, 0, "Corner", "Renovated", 13, 13, "Available", "Referral"],
  ["G-13 10 Marla Residential Plot", "Sale", "Residential Plot", "G-13/4", "G-13", "120", "908", "10 Marla", 0, 0, 49_000_000, 0, "South", "Possession", 13, 13, "Reserved", "Phone"],
  ["I-8 Modern Family House", "Sale", "House", "I-8/2", "I-8", "14", "37", "12 Marla", 5, 6, 168_000_000, 0, "Park", "Brand New", 18, 4, "Available", "Website"],
  ["E-11 High-Rise Apartment", "Rent", "Apartment", "E-11/2", "E-11", "Main Margalla Road", "T-1106", "2,000 sq ft", 3, 3, 0, 260_000, "Margalla", "Furnished", 16, 10, "Rented", "Zameen"],
  ["Gulberg Greens Farmhouse Plot", "Sale", "Farmhouse", "Gulberg Greens Block C", "Gulberg Greens", "Farm Avenue", "F-44", "4 Kanal", 0, 0, 175_000_000, 0, "Green Belt", "Possession", 15, 12, "Available", "Referral"],
  ["DHA Phase II Designer Villa", "Sale & Rent", "House", "DHA Phase II Sector J", "DHA Phase II", "7", "88", "1 Kanal", 5, 6, 185_000_000, 550_000, "Park", "Brand New", 18, 4, "Available", "Instagram"],
  ["Bahria Town Civic Center Office", "Rent", "Office", "Civic Center Phase 4", "Bahria Town", "Business Avenue", "O-305", "1,250 sq ft", 0, 1, 0, 180_000, "Boulevard", "Fitted", 11, 9, "Rented", "Facebook"],
  ["D-12 Main Markaz Commercial Unit", "Rent", "Shop", "D-12 Markaz", "D-12", "Markaz Road", "LG-07", "900 sq ft", 0, 1, 0, 325_000, "Market", "Shell", 3, 5, "Rented", "Walk-in"],
  ["E-12 Newly Built Upper Portion", "Rent", "Upper Portion", "E-12/4", "E-12", "16", "220", "1 Kanal", 3, 3, 0, 155_000, "West", "Brand New", 10, 6, "Rented", "WhatsApp"],
  ["B-17 Commercial Building", "Sale", "Commercial Building", "B-17 Block A", "B-17", "Main Boulevard", "C-09", "10 Marla", 0, 5, 155_000_000, 0, "Boulevard", "Tenanted", 7, 5, "Available", "Referral"],
  ["Park Enclave 1 Kanal Plot", "Sale", "Residential Plot", "Park Enclave Phase 1", "Park Enclave", "Park Road", "442", "1 Kanal", 0, 0, 62_000_000, 0, "Park", "Possession", 15, 11, "Available", "Zameen"],
  ["PWD Family Upper Portion", "Rent", "Upper Portion", "PWD Block C", "PWD", "Central Avenue", "145", "10 Marla", 3, 3, 0, 95_000, "East", "Excellent", 4, 15, "Rented", "Phone"],
  ["Soan Garden Ground Floor", "Rent", "Lower Portion", "Soan Garden Block H", "Soan Garden", "Street 6", "87", "8 Marla", 2, 2, 0, 72_000, "South", "Good", 16, 15, "Rented", "Website"],
];

function buildProperties(clients) {
  return propertyRows.map((row, index) => {
    const [title, transactionType, propertyType, sector, area, street, plotNumber, size, bedrooms, bathrooms, demandPrice, rentPrice, facing, condition, ownerNumber, agentNumber, status, source] = row;
    const owner = clients[ownerNumber - 1];
    return {
      id: `property-${String(index + 1).padStart(3, "0")}`,
      code: `HAB-P-${String(index + 1).padStart(4, "0")}`,
      title,
      transactionType,
      propertyType,
      sector,
      area,
      street,
      plotNumber,
      size,
      bedrooms,
      bathrooms,
      demandPrice,
      rentPrice,
      facing,
      condition,
      description: `Demo ${propertyType.toLowerCase()} record in ${sector}, Islamabad. Details and availability require verification before publication.`,
      ownerId: owner.id,
      owner: owner.name,
      ownerPhone: owner.phone,
      assignedAgentId: `agent-${String(agentNumber).padStart(3, "0")}`,
      status,
      source,
      dateAdded: localDate(-105 + index * 3),
      lastUpdated: isoDateTime(-Math.max(0, 30 - index), 12 + (index % 5), 10),
      images: propertyImages(propertyType),
      documents: [],
      notes: "Seeded demo inventory; legal title and listing authority are not verified.",
      archived: false,
    };
  });
}

const leadNames = [
  "Ali Raza", "Fatima Noor", "Hassan Akbar", "Sidra Malik", "Danish Iqbal",
  "Laiba Ahmed", "Imran Shah", "Rimsha Khan", "Talha Saeed", "Bushra Javed",
  "Noman Yousaf", "Mahnoor Ali", "Ahmad Waleed", "Areeba Faisal", "Salman Tariq",
  "Saba Rehman", "Mustafa Kamal", "Kiran Aslam", "Zohaib Anwar", "Eman Khalid",
];
const leadStatuses = ["New", "Contacted", "Requirement Confirmed", "Properties Sent", "Site Visit", "Negotiation", "Token", "Closed", "Lost"];
const leadSources = ["Website", "WhatsApp", "Phone", "Zameen", "Referral", "Walk-in", "Facebook", "Instagram"];

function buildLeads() {
  return leadNames.map((name, index) => ({
    id: `lead-${String(index + 1).padStart(3, "0")}`,
    code: `LD-${String(index + 1).padStart(4, "0")}`,
    name,
    phone: `03${String(10 + (index % 7)).padStart(2, "0")}-55${String(5210 + index).padStart(5, "0")}`,
    whatsapp: `03${String(10 + (index % 7)).padStart(2, "0")}-55${String(5210 + index).padStart(5, "0")}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.pk`,
    leadType: index % 5 === 0 ? "Seller" : index % 4 === 0 ? "Tenant" : "Buyer",
    requirement: index % 4 === 0 ? "Ready rental property" : index % 3 === 0 ? "House for family residence" : "Residential plot for investment",
    budget: index % 4 === 0 ? 250_000 : 20_000_000 + index * 6_500_000,
    preferredLocation: [["D-12", "E-12"], ["B-17", "E-13"], ["F-10", "F-11"], ["G-11", "I-8"]][index % 4],
    propertyType: index % 4 === 0 ? "Apartment" : index % 3 === 0 ? "House" : "Residential Plot",
    size: index % 3 === 0 ? "1 Kanal" : index % 3 === 1 ? "10 Marla" : "5 Marla",
    source: leadSources[index % leadSources.length],
    assignedAgentId: `agent-${String((index % 15) + 1).padStart(3, "0")}`,
    priority: index % 5 === 0 ? "High" : index % 3 === 0 ? "Low" : "Medium",
    status: leadStatuses[index % leadStatuses.length],
    lastContact: isoDateTime(-Math.max(0, 20 - index), 10 + (index % 6), 15),
    nextFollowUp: localDate((index % 9) - 2),
    notes: "Demo inquiry. Confirm budget, timeline, and preferred inventory on next contact.",
    interestedPropertyIds: [`property-${String((index % 30) + 1).padStart(3, "0")}`],
    createdAt: isoDateTime(-35 + index, 9, 30),
    updatedAt: isoDateTime(-Math.max(0, 12 - index), 16, 0),
  }));
}

function buildVisits() {
  const statuses = ["Scheduled", "Confirmed", "Completed", "Completed", "Cancelled", "Rescheduled"];
  return Array.from({ length: 12 }, (_, index) => ({
    id: `visit-${String(index + 1).padStart(3, "0")}`,
    code: `SV-${String(index + 1).padStart(4, "0")}`,
    clientId: `client-${String((index % 20) + 1).padStart(3, "0")}`,
    leadId: `lead-${String((index % 20) + 1).padStart(3, "0")}`,
    propertyId: `property-${String((index % 30) + 1).padStart(3, "0")}`,
    agentId: `agent-${String((index % 15) + 1).padStart(3, "0")}`,
    date: localDate(index - 5),
    time: `${String(10 + (index % 7)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
    status: statuses[index % statuses.length],
    location: propertyRows[index % propertyRows.length][3],
    notes: "Meet at the site entrance; reconfirm 90 minutes before the visit.",
    feedback: index % 3 === 2 ? "Client liked the location and requested ownership documents." : "",
    nextAction: index % 3 === 2 ? "Share documents and arrange negotiation call" : "Confirm attendance",
    createdAt: isoDateTime(-18 + index, 11, 0),
    updatedAt: isoDateTime(-Math.max(0, 7 - index), 15, 30),
  }));
}

const dealRows = [
  [10, 6, 7, 11, "Sale", 46_500_000, 2, 2_000_000, "Partially Paid", "Completed", -35],
  [5, 20, 10, 2, "Sale", 70_000_000, 2, 5_000_000, "Pending", "Negotiation", 18],
  [2, 1, 13, 3, "Sale", 114_000_000, 1.5, 10_000_000, "Token Paid", "Token", 24],
  [13, 9, 11, 5, "Sale", 91_000_000, 2, 4_000_000, "Pending", "Agreement", 11],
  [18, 9, 13, 13, "Sale", 130_000_000, 1.5, 8_000_000, "Pending", "Offer", 30],
  [19, 12, 13, 13, "Sale", 47_500_000, 2, 3_000_000, "Token Paid", "Payment", 8],
  [23, 15, 18, 4, "Sale", 178_000_000, 1, 15_000_000, "Pending", "Negotiation", 42],
  [11, 17, 13, 5, "Sale", 82_000_000, 2, 6_000_000, "Pending", "Offer", 35],
  [1, 20, 3, 1, "Sale", 136_000_000, 1.5, 12_000_000, "Token Paid", "Agreement", 16],
  [27, 6, 7, 7, "Sale", 149_000_000, 1.5, 10_000_000, "Pending", "Cancelled", -12],
];

function buildDeals() {
  return dealRows.map(([property, buyer, seller, agent, dealType, salePrice, commissionPercent, tokenAmount, paymentStatus, dealStage, closeOffset], index) => {
    const totalCommission = Math.round(salePrice * commissionPercent / 100);
    return {
      id: `deal-${String(index + 1).padStart(3, "0")}`,
      code: `DL-${String(index + 1).padStart(4, "0")}`,
      propertyId: `property-${String(property).padStart(3, "0")}`,
      buyerId: `client-${String(buyer).padStart(3, "0")}`,
      sellerId: `client-${String(seller).padStart(3, "0")}`,
      agentId: `agent-${String(agent).padStart(3, "0")}`,
      dealType,
      salePrice,
      commissionPercent,
      agentSplitPercent: 35,
      totalCommission,
      agentCommission: Math.round(totalCommission * 0.35),
      companyShare: Math.round(totalCommission * 0.65),
      tokenAmount,
      paymentStatus,
      paidCommission: dealStage === "Completed" ? totalCommission : 0,
      dealStage,
      stage: dealStage,
      expectedClosing: localDate(closeOffset),
      documents: [],
      notes: "Demo deal workflow. Figures do not represent a verified company transaction.",
      createdAt: isoDateTime(-50 + index * 4, 13, 0),
      updatedAt: isoDateTime(-Math.max(0, 15 - index), 14, 30),
    };
  });
}

const rentalRows = [
  [12, 11, 19, 9, 625_000, 1_250_000, -100, 265, 625_000, "Active"],
  [14, 4, 8, 6, 275_000, 550_000, -290, 75, 275_000, "Active"],
  [15, 16, 14, 10, 190_000, 380_000, -330, 35, 190_000, "Expiring"],
  [16, 16, 14, 6, 225_000, 450_000, -80, 285, 225_000, "Active"],
  [17, 4, 8, 10, 160_000, 320_000, -190, 175, 160_000, "Active"],
  [21, 16, 8, 10, 250_000, 500_000, -350, 15, 250_000, "Renewal Pending"],
  [24, 11, 19, 9, 175_000, 350_000, -60, 305, 175_000, "Active"],
  [25, 3, 5, 5, 315_000, 630_000, -25, 340, 315_000, "Active"],
  [26, 10, 14, 6, 150_000, 300_000, -155, 210, 150_000, "Active"],
  [29, 4, 5, 15, 92_000, 184_000, -345, 20, 92_000, "Expiring"],
];

function buildRentals() {
  return rentalRows.map(([property, owner, tenant, agent, monthlyRent, security, startOffset, endOffset, commission, status], index) => ({
    id: `rental-${String(index + 1).padStart(3, "0")}`,
    code: `RN-${String(index + 1).padStart(4, "0")}`,
    propertyId: `property-${String(property).padStart(3, "0")}`,
    ownerId: `client-${String(owner).padStart(3, "0")}`,
    tenantId: `client-${String(tenant).padStart(3, "0")}`,
    agentId: `agent-${String(agent).padStart(3, "0")}`,
    monthlyRent,
    security,
    leaseStart: localDate(startOffset),
    leaseEnd: localDate(endOffset),
    commission,
    commissionStatus: index % 4 === 0 ? "Pending" : "Paid",
    status,
    documents: [],
    notes: "Demo lease metadata only; signed agreement is required for legal terms.",
    createdAt: isoDateTime(startOffset - 7, 11, 0),
    updatedAt: isoDateTime(-index, 13, 15),
  }));
}

const projectRows = [
  ["D-12 Contemporary Residence", "D-12/1, Islamabad", "Architecture", "1 Kanal", 28_000_000, 4_200_000, "Design", 38],
  ["Gulberg Greens Courtyard Villa", "Gulberg Greens, Islamabad", "Construction", "2 Kanal", 95_000_000, 88_000_000, "Construction", 62],
  ["Blue Area Executive Floor", "Blue Area, Islamabad", "Interior Design", "6,500 sq ft", 22_000_000, 19_500_000, "Finishing", 84],
  ["E-12 Family Home", "E-12/3, Islamabad", "Structure", "1 Kanal", 18_000_000, 7_500_000, "Approval", 20],
  ["F-8 Residence Renewal", "F-8/1, Islamabad", "Renovation", "1 Kanal", 34_000_000, 31_000_000, "Construction", 55],
  ["B-17 Mixed-Use Building", "B-17 Block A, Islamabad", "Construction", "10 Marla", 72_000_000, 65_000_000, "Consultation", 12],
  ["Park Enclave House", "Park Enclave, Islamabad", "Architecture", "1 Kanal", 10_000_000, 5_800_000, "Design", 46],
  ["DHA Phase II Villa Interior", "DHA Phase II, Islamabad", "Interior Design", "1 Kanal", 26_000_000, 23_000_000, "Completed", 100],
  ["I-8 Commercial Retrofit", "I-8 Markaz, Islamabad", "Renovation", "4,200 sq ft", 31_000_000, 28_500_000, "Finishing", 91],
  ["E-13 Compact Residence", "E-13, Islamabad", "Construction", "8 Marla", 42_000_000, 39_000_000, "Lead", 5],
];

function buildProjects() {
  const stages = ["Lead", "Consultation", "Design", "Approval", "Construction", "Finishing", "Completed"];
  return projectRows.map(([projectName, location, projectType, plotSize, budget, contractValue, status, progress], index) => ({
    id: `project-${String(index + 1).padStart(3, "0")}`,
    code: `PRJ-${String(index + 1).padStart(4, "0")}`,
    clientId: `client-${String((index * 2 % 20) + 1).padStart(3, "0")}`,
    projectName,
    name: projectName,
    location,
    projectType,
    plotSize,
    budget,
    contractValue,
    architect: index % 2 ? "Ar. Sarah Nadeem" : "Ar. Hamza Tariq",
    engineer: index % 3 ? "Engr. Usman Ali" : "Engr. Fahad Khan",
    projectManager: index % 2 ? "Rana Yasir" : "Muhammad Irfan Cheema",
    startDate: localDate(-210 + index * 17),
    expectedCompletion: localDate(45 + index * 38),
    status: stages.includes(status) ? status : "Lead",
    progress,
    coverImage: imagePath("projects"),
    image: imagePath("projects"),
    documents: [],
    expenses: Math.round(contractValue * progress / 100 * 0.72),
    notes: "Demo project record; scope and financial values are sample data.",
    createdAt: isoDateTime(-220 + index * 17, 10, 0),
    updatedAt: isoDateTime(-index * 2, 15, 0),
  }));
}

function buildDocuments() {
  const categories = ["Property Documents", "Client Documents", "Deal Documents", "Rental Documents", "Construction Documents", "Identity Documents", "Contracts", "Receipts", "Other"];
  return Array.from({ length: 20 }, (_, index) => {
    const entityCycle = index % 4;
    const entityType = ["properties", "clients", "deals", "projects"][entityCycle];
    const maximum = [30, 20, 10, 10][entityCycle];
    return {
      id: `document-${String(index + 1).padStart(3, "0")}`,
      code: `DOC-${String(index + 1).padStart(4, "0")}`,
      name: ["Ownership verification", "Client identification", "Offer summary", "Concept drawing", "Payment receipt"][index % 5] + ` ${index + 1}`,
      category: categories[index % categories.length],
      entityType,
      entityId: `${entityType.slice(0, -1)}-${String((index % maximum) + 1).padStart(3, "0")}`,
      entityLabel: `${entityType.slice(0, -1).replace(/^./, (letter) => letter.toUpperCase())} ${String((index % maximum) + 1).padStart(3, "0")}`,
      fileName: `demo-document-${String(index + 1).padStart(2, "0")}.pdf`,
      mimeType: "application/pdf",
      size: 180_000 + index * 23_750,
      uploadedBy: `agent-${String((index % 15) + 1).padStart(3, "0")}`,
      uploadedAt: isoDateTime(-40 + index * 2, 10 + (index % 5), 20),
      storage: "mock-local-metadata",
      url: "",
      status: "Current",
      notes: "Metadata-only demo file. No server upload has taken place.",
    };
  });
}

function buildActivities() {
  const actions = ["Lead created", "Agent assigned", "Property sent", "Client contacted", "Site visit scheduled", "Offer received", "Negotiation updated", "Deal created", "Payment received", "Document added"];
  const types = ["lead", "lead", "property", "client", "visit", "deal", "deal", "deal", "deal", "document"];
  const maxByType = { lead: 20, property: 30, client: 20, visit: 12, deal: 10, document: 20 };
  return Array.from({ length: 30 }, (_, index) => {
    const position = index % actions.length;
    const type = types[position];
    const createdAt = isoDateTime(-Math.floor(index / 2), 9 + (index % 8), index % 2 ? 30 : 0);
    return {
      id: `activity-${String(index + 1).padStart(3, "0")}`,
      entityType: `${type}s`,
      entityId: `${type}-${String((index % maxByType[type]) + 1).padStart(3, "0")}`,
      action: actions[position],
      title: actions[position],
      description: `${actions[position]} in the HAIDER OS demonstration workspace.`,
      message: `${actions[position]} in the HAIDER OS demonstration workspace.`,
      userId: `user-${String((index % 3) + 1).padStart(3, "0")}`,
      userName: ["Haider Cheema Zaildar", "Zeeshan Malik", "Arslan Javaid"][index % 3],
      actor: ["Haider Cheema Zaildar", "Zeeshan Malik", "Arslan Javaid"][index % 3],
      createdAt,
      timestamp: createdAt,
    };
  });
}

function buildNotifications() {
  const templates = [
    ["New lead assigned", "A new buyer inquiry is ready for review.", "lead"],
    ["Site visit tomorrow", "Reconfirm the client and property access.", "visit"],
    ["Follow-up overdue", "A scheduled lead follow-up needs attention.", "lead"],
    ["Deal awaiting payment", "Payment milestone remains pending.", "deal"],
    ["Lease expiring", "Begin renewal discussion with both parties.", "rental"],
    ["Document missing", "Required transaction document is not attached.", "document"],
  ];
  return Array.from({ length: 15 }, (_, index) => {
    const [title, message, entityType] = templates[index % templates.length];
    const max = { lead: 20, visit: 12, deal: 10, rental: 10, document: 20 }[entityType];
    return {
      id: `notification-${String(index + 1).padStart(3, "0")}`,
      title,
      message,
      type: index % 5 === 0 ? "warning" : "info",
      entityType: `${entityType}s`,
      entityId: `${entityType}-${String((index % max) + 1).padStart(3, "0")}`,
      recipientUserId: `user-${String((index % 3) + 1).padStart(3, "0")}`,
      read: index > 9,
      createdAt: isoDateTime(-Math.floor(index / 3), 8 + (index % 9), 15),
    };
  });
}

function buildCommissions(deals) {
  return deals.map((deal, index) => ({
    id: `commission-${String(index + 1).padStart(3, "0")}`,
    code: `COM-${String(index + 1).padStart(4, "0")}`,
    dealId: deal.id,
    agentId: deal.agentId,
    totalCommission: deal.totalCommission,
    agentCommission: deal.agentCommission,
    companyShare: deal.companyShare,
    status: deal.dealStage === "Completed" ? "Paid" : index % 3 === 0 ? "Partially Paid" : "Pending",
    paidAmount: deal.dealStage === "Completed" ? deal.totalCommission : index % 3 === 0 ? Math.round(deal.totalCommission * 0.25) : 0,
    dueDate: deal.expectedClosing,
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
  }));
}

function updateAgentMetrics(agents, collections) {
  return agents.map((agent) => {
    const assignedLeads = collections.leads.filter((item) => item.assignedAgentId === agent.id).length;
    const properties = collections.properties.filter((item) => item.assignedAgentId === agent.id).length;
    const siteVisits = collections.visits.filter((item) => item.agentId === agent.id).length;
    const deals = collections.deals.filter((item) => item.agentId === agent.id).length;
    const commission = collections.commissions
      .filter((item) => item.agentId === agent.id)
      .reduce((sum, item) => sum + item.agentCommission, 0);
    return { ...agent, assignedLeads, properties, siteVisits, deals, commission };
  });
}

export function createSeedState() {
  const clients = buildClients();
  const properties = buildProperties(clients);
  const leads = buildLeads();
  const visits = buildVisits();
  const deals = buildDeals();
  const rentals = buildRentals();
  const projects = buildProjects();
  const documents = buildDocuments();
  const activities = buildActivities();
  const notifications = buildNotifications();
  const commissions = buildCommissions(deals);
  const agents = updateAgentMetrics(buildAgents(), { properties, leads, visits, deals, commissions });
  const now = new Date().toISOString();

  return {
    schemaVersion: 1,
    meta: {
      appName: "HAIDER OS",
      organization: "Haider Associates & Builders",
      seeded: true,
      demoOnly: true,
      createdAt: now,
      updatedAt: now,
    },
    properties,
    leads,
    agents,
    clients,
    visits,
    deals,
    rentals,
    commissions,
    projects,
    documents,
    activities,
    notifications,
    users: [
      {
        id: "user-001",
        name: "Haider Cheema Zaildar",
        email: "admin@haiderassociates.pk",
        password: "demo123",
        role: "Super Admin",
        agentId: "agent-001",
        active: true,
      },
      {
        id: "user-002",
        name: "Zeeshan Malik",
        email: "manager@haiderassociates.pk",
        password: "demo123",
        role: "Manager",
        agentId: "agent-002",
        active: true,
      },
      {
        id: "user-003",
        name: "Arslan Javaid",
        email: "agent@haiderassociates.pk",
        password: "demo123",
        role: "Agent",
        agentId: "agent-003",
        active: true,
      },
    ],
    settings: {
      companyName: "Haider Associates & Builders",
      productName: "HAIDER OS",
      primaryContact: "Haider Cheema",
      phone: "0300-9146600",
      email: "admin@haiderassociates.pk",
      city: "Islamabad",
      country: "Pakistan",
      currency: "PKR",
      locale: "en-PK",
      dateFormat: "DD MMM YYYY",
      defaultCommissionPercent: 2,
      agentCommissionSharePercent: 35,
      theme: "light",
      compactSidebar: false,
      demoMode: true,
    },
  };
}
