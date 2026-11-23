import { useMemo } from "react";
import PropTypes from "prop-types";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import makeTheme from "ui/theme";
import { UiProvider } from "ui/UiContext";
import Dashboard from "./dashboard";

// What the host mounts under /analytics/*. The host passes its theme mode as
// a prop; that's the whole contract between the two.
export default function RemoteRoutes({ darkMode }) {
  const theme = useMemo(() => makeTheme(darkMode, "analytics"), [darkMode]);
  return (
    <UiProvider darkMode={darkMode}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </ThemeProvider>
    </UiProvider>
  );
}

RemoteRoutes.propTypes = { darkMode: PropTypes.bool };
RemoteRoutes.defaultProps = { darkMode: false };
