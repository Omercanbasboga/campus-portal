// Session guard: logs the user out the moment the session runs out, instead
// of letting pages sit there showing stale or empty data. Only the host runs
// it; the remotes are mounted inside the host, so a redirect here covers
// every route.
//
// In the original this redirected to the gateway's /logout so the backend
// and SSO sessions ended too. The demo has no backend, so it goes to the
// demo sign-in page.

const TOKEN_KEY = "accessToken";
const EXPIRES_AT_KEY = "sessionExpiresAt";
const USER_KEY = "demoUser";

const SESSION_MINUTES = Number(process.env.REACT_APP_SESSION_DURATION_MINUTES) || 30;
export const SESSION_DURATION_MS = SESSION_MINUTES * 60 * 1000;

// UI preferences (open tree branches, dark mode) survive a logout
export const PREFERENCE_PREFIX = "pref:";

const signInPath = () => `${(process.env.PUBLIC_URL || "").replace(/\/$/, "")}/giris`;

let logoutTimer = null;

export const isAuthenticated = () => !!localStorage.getItem(TOKEN_KEY);
export const currentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
};
export const expiresAt = () => Number(localStorage.getItem(EXPIRES_AT_KEY)) || 0;

export const clearStorageKeepingPreferences = () => {
  const preferences = Object.keys(localStorage)
    .filter((key) => key.startsWith(PREFERENCE_PREFIX))
    .map((key) => [key, localStorage.getItem(key)]);
  localStorage.clear();
  sessionStorage.clear();
  preferences.forEach(([key, value]) => localStorage.setItem(key, value));
};

const goToLogin = (reason) => {
  if (window.location.pathname !== signInPath()) {
    const q = reason ? `?neden=${encodeURIComponent(reason)}` : "";
    window.location.assign(`${signInPath()}${q}`);
  }
};

export const forceLogout = (reason) => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
  clearStorageKeepingPreferences();
  goToLogin(reason);
};

export const isSessionExpired = () => {
  const at = expiresAt();
  return at ? Date.now() >= at : false;
};

// re-arm the timer from the stored deadline (also after a refresh)
const scheduleLogout = () => {
  if (logoutTimer) clearTimeout(logoutTimer);
  logoutTimer = null;
  const at = expiresAt();
  if (!at) return;
  const remaining = at - Date.now();
  if (remaining <= 0) {
    forceLogout("sure-doldu");
    return;
  }
  logoutTimer = setTimeout(() => forceLogout("sure-doldu"), remaining);
};

export const startSession = (user) => {
  localStorage.setItem(TOKEN_KEY, "demo");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + SESSION_DURATION_MS));
  scheduleLogout();
};

// browsers throttle timers in background tabs, so check again on return
const handleVisibilityChange = () => {
  if (document.visibilityState === "visible" && isSessionExpired()) forceLogout("sure-doldu");
};

// localStorage.clear() in another tab fires one storage event with key null;
// follow that tab out. A sign-in in another tab moves the deadline, so the
// timer here has to move with it.
const handleStorageEvent = (event) => {
  if (event.key !== null && event.key !== TOKEN_KEY && event.key !== EXPIRES_AT_KEY) return;
  if (!isAuthenticated()) goToLogin("baska-sekme");
  else if (event.key === EXPIRES_AT_KEY) scheduleLogout();
};

let initialized = false;

export const initSessionGuard = () => {
  scheduleLogout();
  if (initialized) return;
  initialized = true;
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("storage", handleStorageEvent);
};
