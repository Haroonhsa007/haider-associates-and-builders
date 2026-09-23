import { createSeedState } from "../data/seed.js";

// v2: listing photography is assigned by property type, so land records no
// longer carry a house photo. Bumping the version re-seeds existing browsers.
export const STATE_VERSION = 2;
export const STORAGE_KEY = `haider-os:state:v${STATE_VERSION}`;
export const SESSION_KEY = "haider-os:session";

const ENTITY_KEYS = Object.freeze([
  "properties",
  "leads",
  "agents",
  "clients",
  "visits",
  "deals",
  "rentals",
  "commissions",
  "projects",
  "documents",
  "activities",
  "notifications",
  "users",
]);

const ENTITY_ALIASES = Object.freeze({
  property: "properties",
  properties: "properties",
  lead: "leads",
  leads: "leads",
  agent: "agents",
  agents: "agents",
  client: "clients",
  clients: "clients",
  visit: "visits",
  visits: "visits",
  sitevisit: "visits",
  sitevisits: "visits",
  deal: "deals",
  deals: "deals",
  rental: "rentals",
  rentals: "rentals",
  commission: "commissions",
  commissions: "commissions",
  project: "projects",
  projects: "projects",
  document: "documents",
  documents: "documents",
  activity: "activities",
  activities: "activities",
  notification: "notifications",
  notifications: "notifications",
  user: "users",
  users: "users",
});

const CODE_PREFIXES = Object.freeze({
  properties: "HAB-P",
  leads: "LD",
  agents: "AG",
  clients: "CL",
  visits: "SV",
  deals: "DL",
  rentals: "RN",
  commissions: "COM",
  projects: "PRJ",
  documents: "DOC",
  activities: "ACT",
  notifications: "NTF",
  users: "USR",
});

let currentState = null;
let initialized = false;
let memoryState = null;
let memorySession = null;
const listeners = new Set();

function clone(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function normalizeEntityName(entity) {
  const normalized = String(entity ?? "").toLowerCase().replace(/[\s_-]+/g, "");
  const collection = ENTITY_ALIASES[normalized];
  if (!collection) throw new Error(`Unknown entity collection: ${entity}`);
  return collection;
}

function safeStorage(kind) {
  try {
    const storage = globalThis[kind];
    if (!storage) return null;
    const probe = "__haider_os_storage_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

function stateStorage() {
  return safeStorage("localStorage");
}

function sessionStorageAdapter() {
  return safeStorage("sessionStorage");
}

function makeId(entity) {
  const singular = entity.endsWith("ies")
    ? `${entity.slice(0, -3)}y`
    : entity.endsWith("s")
      ? entity.slice(0, -1)
      : entity;
  const random = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  return `${singular}-${random}`;
}

function stampState(state) {
  const now = new Date().toISOString();
  return {
    ...state,
    schemaVersion: STATE_VERSION,
    meta: {
      ...(state.meta ?? {}),
      appName: state.meta?.appName || "HAIDER OS",
      organization: state.meta?.organization || "Haider Associates & Builders",
      updatedAt: now,
    },
  };
}

function persist() {
  if (!currentState) return;
  currentState = stampState(currentState);
  const serialized = JSON.stringify(currentState);
  const storage = stateStorage();
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.warn("HAIDER OS could not persist local data.", error);
    }
  } else {
    memoryState = serialized;
  }
}

function notify(event) {
  const snapshot = clone(currentState);
  listeners.forEach((listener) => {
    try {
      listener(snapshot, event);
    } catch (error) {
      console.error("HAIDER OS state subscriber failed.", error);
    }
  });
}

function readPersistedState() {
  const storage = stateStorage();
  const serialized = storage ? storage.getItem(STORAGE_KEY) : memoryState;
  if (!serialized) return null;
  try {
    const parsed = JSON.parse(serialized);
    validateState(parsed);
    if (Number(parsed.schemaVersion ?? STATE_VERSION) !== STATE_VERSION) return null;
    return parsed;
  } catch (error) {
    console.warn("HAIDER OS found invalid local data and restored the demo seed.", error);
    if (storage) {
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        // Storage may have become unavailable after the initial read.
      }
    } else {
      memoryState = null;
    }
    return null;
  }
}

function ensureInitialized() {
  if (!initialized || !currentState) store.init();
}

function deriveDealValues(record) {
  const price = Number(record.salePrice);
  const percent = Number(record.commissionPercent);
  if (!Number.isFinite(price) || !Number.isFinite(percent)) return record;
  const totalCommission = Math.round(price * percent / 100);
  const requestedShare = Number(record.agentSplitPercent ?? currentState?.settings?.agentCommissionSharePercent ?? 35);
  const agentShare = Math.min(100, Math.max(0, Number.isFinite(requestedShare) ? requestedShare : 35));
  const agentCommission = Math.round(totalCommission * agentShare / 100);
  const stage = record.stage ?? record.dealStage ?? "Offer";
  return {
    ...record,
    salePrice: Math.round(price),
    commissionPercent: percent,
    agentSplitPercent: agentShare,
    totalCommission,
    agentCommission,
    companyShare: totalCommission - agentCommission,
    stage,
    dealStage: stage,
  };
}

function addActivity(action, entity, entityId, description) {
  if (entity === "activities" || !currentState?.activities) return;
  const session = readSession();
  const createdAt = new Date().toISOString();
  const userName = session?.name ?? "Demo user";
  currentState.activities.unshift({
    id: makeId("activities"),
    entityType: entity,
    entityId,
    action,
    title: action,
    description,
    message: description,
    userId: session?.userId ?? null,
    userName,
    actor: userName,
    createdAt,
    timestamp: createdAt,
  });
}

function validateRecordArray(key, value) {
  if (!Array.isArray(value)) throw new Error(`Import field "${key}" must be an array.`);
  const ids = new Set();
  value.forEach((record, index) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      throw new Error(`Import field "${key}" contains an invalid record at index ${index}.`);
    }
    if (typeof record.id !== "string" || !record.id.trim()) {
      throw new Error(`Import field "${key}" contains a record without an id.`);
    }
    if (ids.has(record.id)) throw new Error(`Import field "${key}" contains duplicate id "${record.id}".`);
    ids.add(record.id);
  });
}

function validateState(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("Imported data must be a JSON object.");
  }
  ENTITY_KEYS.forEach((key) => validateRecordArray(key, candidate[key]));
  if (!candidate.settings || typeof candidate.settings !== "object" || Array.isArray(candidate.settings)) {
    throw new Error('Import field "settings" must be an object.');
  }
  return true;
}

/**
 * Generate the next human-readable code.
 *
 * Preferred signature: nextCode("properties", propertyArray).
 * A literal prefix also works: nextCode("HAB-P", propertyArray).
 */
export function nextCode(entityOrPrefix, records = [], width = 4) {
  let prefix;
  let collection = records;
  try {
    const entity = normalizeEntityName(entityOrPrefix);
    prefix = CODE_PREFIXES[entity];
  } catch {
    prefix = String(entityOrPrefix || "REC").toUpperCase();
  }
  if (!Array.isArray(collection)) collection = [];

  const highest = collection.reduce((maximum, record) => {
    const match = String(record?.code ?? "").match(/(\d+)$/);
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0);
  return `${prefix}-${String(highest + 1).padStart(width, "0")}`;
}

function readSession() {
  const storage = sessionStorageAdapter();
  const serialized = storage ? storage.getItem(SESSION_KEY) : memorySession;
  if (!serialized) return null;
  try {
    const session = JSON.parse(serialized);
    if (!session?.userId || !session?.expiresAt || Date.parse(session.expiresAt) <= Date.now()) {
      if (storage) storage.removeItem(SESSION_KEY);
      else memorySession = null;
      return null;
    }
    return session;
  } catch {
    if (storage) storage.removeItem(SESSION_KEY);
    else memorySession = null;
    return null;
  }
}

function writeSession(session) {
  const serialized = JSON.stringify(session);
  const storage = sessionStorageAdapter();
  if (storage) storage.setItem(SESSION_KEY, serialized);
  else memorySession = serialized;
}

export const store = {
  /** Initialize once from the single versioned LocalStorage key, or create seed data. */
  init({ force = false } = {}) {
    if (initialized && currentState && !force) return clone(currentState);
    currentState = readPersistedState() ?? createSeedState();
    initialized = true;
    persist();
    return clone(currentState);
  },

  getState() {
    ensureInitialized();
    return clone(currentState);
  },

  getEntities(entity) {
    ensureInitialized();
    const collection = normalizeEntityName(entity);
    return clone(currentState[collection]);
  },

  subscribe(listener) {
    if (typeof listener !== "function") throw new TypeError("A state subscriber must be a function.");
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  create(entity, input = {}) {
    ensureInitialized();
    const collection = normalizeEntityName(entity);
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new TypeError("The new entity must be an object.");
    }
    const now = new Date().toISOString();
    let record = {
      ...clone(input),
      id: input.id || makeId(collection),
      code: input.code || nextCode(collection, currentState[collection]),
      createdAt: input.createdAt || now,
      updatedAt: now,
    };
    if (currentState[collection].some((item) => item.id === record.id)) {
      throw new Error(`An item with id "${record.id}" already exists in ${collection}.`);
    }
    if (collection === "deals") record = deriveDealValues(record);
    currentState[collection].unshift(record);
    addActivity("Record created", collection, record.id, `${record.code || record.id} was created.`);
    persist();
    notify({ type: "create", entity: collection, id: record.id });
    return clone(record);
  },

  update(entity, id, changes = {}) {
    ensureInitialized();
    const collection = normalizeEntityName(entity);
    if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
      throw new TypeError("Entity changes must be an object.");
    }
    const index = currentState[collection].findIndex((item) => item.id === id);
    if (index === -1) return null;
    const original = currentState[collection][index];
    let updated = {
      ...original,
      ...clone(changes),
      id: original.id,
      updatedAt: new Date().toISOString(),
    };
    if (collection === "deals") {
      if (Object.prototype.hasOwnProperty.call(changes, "dealStage") && !Object.prototype.hasOwnProperty.call(changes, "stage")) {
        updated.stage = changes.dealStage;
      }
      if (Object.prototype.hasOwnProperty.call(changes, "stage")) updated.dealStage = changes.stage;
      updated = deriveDealValues(updated);
    }
    currentState[collection][index] = updated;
    addActivity("Record updated", collection, id, `${updated.code || id} was updated.`);
    persist();
    notify({ type: "update", entity: collection, id });
    return clone(updated);
  },

  remove(entity, id) {
    ensureInitialized();
    const collection = normalizeEntityName(entity);
    const index = currentState[collection].findIndex((item) => item.id === id);
    if (index === -1) return false;
    const [removed] = currentState[collection].splice(index, 1);
    addActivity("Record removed", collection, id, `${removed.code || id} was removed.`);
    persist();
    notify({ type: "remove", entity: collection, id });
    return true;
  },

  /** Restore a fresh demo dataset; session is intentionally retained. */
  reset() {
    currentState = createSeedState();
    initialized = true;
    persist();
    notify({ type: "reset" });
    return clone(currentState);
  },

  /** Return a complete, formatted JSON snapshot suitable for download. */
  exportData({ asObject = false } = {}) {
    ensureInitialized();
    const snapshot = clone(currentState);
    return asObject ? snapshot : JSON.stringify(snapshot, null, 2);
  },

  /** Validate every expected collection before atomically replacing local state. */
  importData(payload) {
    let candidate;
    try {
      candidate = typeof payload === "string" ? JSON.parse(payload) : clone(payload);
    } catch {
      throw new Error("The selected file does not contain valid JSON.");
    }
    validateState(candidate);
    currentState = stampState({
      ...candidate,
      schemaVersion: STATE_VERSION,
      meta: {
        ...(candidate.meta ?? {}),
        importedAt: new Date().toISOString(),
      },
    });
    initialized = true;
    persist();
    notify({ type: "import" });
    return clone(currentState);
  },

  /** Demo-only authentication. Credentials are local and not production security. */
  login(email, password) {
    ensureInitialized();
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const user = currentState.users.find((candidate) => (
      candidate.active !== false
      && candidate.email.toLowerCase() === normalizedEmail
      && candidate.password === String(password ?? "")
    ));
    if (!user) return null;

    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      agentId: user.agentId ?? null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      demoOnly: true,
    };
    writeSession(session);
    notify({ type: "login", userId: user.id });
    return clone(session);
  },

  logout() {
    const storage = sessionStorageAdapter();
    if (storage) storage.removeItem(SESSION_KEY);
    memorySession = null;
    notify({ type: "logout" });
    return true;
  },

  getSession() {
    ensureInitialized();
    const session = readSession();
    if (!session) return null;
    const user = currentState.users.find((candidate) => candidate.id === session.userId && candidate.active !== false);
    if (!user) {
      this.logout();
      return null;
    }
    return clone(session);
  },

  nextCode(entity) {
    ensureInitialized();
    const collection = normalizeEntityName(entity);
    return nextCode(collection, currentState[collection]);
  },
};

// Keep separately opened tabs synchronized without introducing another storage key.
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const incoming = JSON.parse(event.newValue);
      validateState(incoming);
      currentState = incoming;
      initialized = true;
      notify({ type: "external-update" });
    } catch (error) {
      console.warn("HAIDER OS ignored invalid data from another tab.", error);
    }
  });
}
