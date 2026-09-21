const listeners = new Set();

export function parseLocation() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return { path: path.replace(/\/+$/, '') || '/', query: new URLSearchParams(queryPart) };
}

export function navigate(path, { replace = false } = {}) {
  const target = path.startsWith('#') ? path : `#${path}`;
  if (replace) window.location.replace(target);
  else window.location.hash = target;
}

export function matchRoute(path, pattern) {
  const keys = [];
  const expression = pattern
    .replace(/\//g, '\\/')
    .replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    });
  const match = path.match(new RegExp(`^${expression}$`));
  if (!match) return null;
  return keys.reduce((params, key, index) => {
    params[key] = decodeURIComponent(match[index + 1]);
    return params;
  }, {});
}

export function startRouter(callback) {
  listeners.add(callback);
  const onHashChange = () => listeners.forEach(listener => listener(parseLocation()));
  window.addEventListener('hashchange', onHashChange);
  onHashChange();
  return () => {
    listeners.delete(callback);
    window.removeEventListener('hashchange', onHashChange);
  };
}

