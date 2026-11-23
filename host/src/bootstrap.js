import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UiProvider } from "ui/UiContext";
import { isSessionExpired, forceLogout, clearStorageKeepingPreferences } from "auth/session";
import App from "./App";

const basename = (process.env.PUBLIC_URL || "").replace(/\/$/, "") || "/";
const savedDark = (() => {
  try {
    return localStorage.getItem("pref:dark") === "1";
  } catch {
    return false;
  }
})();

const path = basename === "/" ? window.location.pathname : window.location.pathname.slice(basename.length);
const isPrivate = /^\/(analytics|records)(\/|$)/.test(path);

// an expired session never gets to paint a private page; public pages (landing,
// sign-in) just drop the stale data and render
if (isSessionExpired() && isPrivate) {
  forceLogout("sure-doldu");
} else {
  if (isSessionExpired()) clearStorageKeepingPreferences();
  ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter basename={basename}>
      <UiProvider initialDarkMode={savedDark}>
        <App />
      </UiProvider>
    </BrowserRouter>
  );
}
