import { useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import makeTheme from "ui/theme";
import { useUiController } from "ui/UiContext";
import { initSessionGuard, isAuthenticated } from "auth/session";
import Shell from "shell/Shell";
import RemoteFrame from "shell/RemoteFrame";
import { REMOTES } from "shell/remotes";
import Landing from "pages/Landing";
import SignIn from "pages/SignIn";

function Protected({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    const devam = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/giris?devam=${devam}`} replace />;
  }
  return <Shell>{children}</Shell>;
}

export default function App() {
  const [{ darkMode }] = useUiController();
  const theme = useMemo(() => makeTheme(darkMode, "host"), [darkMode]);

  useEffect(() => {
    if (isAuthenticated()) initSessionGuard();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/giris" element={<SignIn />} />
        <Route
          path="/analytics/*"
          element={
            <Protected>
              <RemoteFrame remote={REMOTES.analytics} />
            </Protected>
          }
        />
        <Route
          path="/records/*"
          element={
            <Protected>
              <RemoteFrame remote={REMOTES.records} />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
