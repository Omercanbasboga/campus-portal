import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import makeTheme from "ui/theme";
import { useUiController } from "ui/UiContext";
import RemoteRoutes from "./RemoteRoutes";

// running the remote on its own (npm run start:records), without the host shell
export default function Standalone() {
  const [{ darkMode }] = useUiController();
  return (
    <ThemeProvider theme={makeTheme(darkMode, "records")}>
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/records/*" element={<RemoteRoutes isMFE={false} darkMode={darkMode} />} />
        <Route path="*" element={<Navigate to="/records/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
