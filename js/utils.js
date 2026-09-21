/**
 * Shared, dependency-free helpers for HAIDER OS.
 * All money values in the application are stored as integer Pakistani rupees.
 */

const PKR_NUMBER = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const COMPACT_NUMBER = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-PK", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-PK", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function toDate(value) {
  if (value instanceof Date) return new Date(value.getTime());
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

/**
 * Format integer rupees in familiar Pakistani units.
 * Examples: PKR 14 Crore, PKR 42.8 Lakh, PKR 75,000.
 */
export function formatPKR(value, options = {}) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "PKR 0";

  const { compact = true, signed = false } = options;
  const sign = amount < 0 ? "-" : signed && amount > 0 ? "+" : "";
  const absolute = Math.abs(amount);

  if (compact && absolute >= 10_000_000) {
    return `${sign}PKR ${COMPACT_NUMBER.format(absolute / 10_000_000)} Crore`;
  }
  if (compact && absolute >= 100_000) {
    return `${sign}PKR ${COMPACT_NUMBER.format(absolute / 100_000)} Lakh`;
  }
  return `${sign}PKR ${PKR_NUMBER.format(Math.round(absolute))}`;
}

export function formatDate(value, fallback = "Not set") {
  if (!value) return fallback;
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? fallback : DATE_FORMATTER.format(date);
}

export function formatDateTime(value, fallback = "Not set") {
  if (!value) return fallback;
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? fallback : DATE_TIME_FORMATTER.format(date);
}

/** Create a browser-safe unique identifier with a readable entity prefix. */
export function uid(prefix = "id") {
  const safePrefix = String(prefix || "id")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "id";

  if (globalThis.crypto?.randomUUID) {
    return `${safePrefix}_${globalThis.crypto.randomUUID()}`;
  }

  const random = Math.random().toString(36).slice(2, 10);
  return `${safePrefix}_${Date.now().toString(36)}_${random}`;
}

/** Escape untrusted values before placing them in an HTML string. */
export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

/** Trigger a JSON file download. Returns the generated filename for UI feedback. */
export function downloadJSON(data, filename = "haider-os-export.json") {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    throw new Error("JSON downloads are only available in a browser.");
  }

  const payload = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return filename;
}

/** Debounce while preserving `this`; `.cancel()` and `.flush()` aid cleanup/tests. */
export function debounce(callback, delay = 250) {
  let timeoutId;
  let latestArgs;
  let latestThis;

  function debounced(...args) {
    latestArgs = args;
    latestThis = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      callback.apply(latestThis, latestArgs);
    }, Math.max(0, Number(delay) || 0));
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  debounced.flush = () => {
    if (timeoutId === undefined) return undefined;
    clearTimeout(timeoutId);
    timeoutId = undefined;
    return callback.apply(latestThis, latestArgs);
  };

  return debounced;
}

/** Return a local-calendar YYYY-MM-DD value offset from the supplied date. */
export function daysFromNow(days = 0, from = new Date()) {
  const date = toDate(from);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + Number(days || 0));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getGreeting(date = new Date()) {
  const hour = toDate(date).getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
