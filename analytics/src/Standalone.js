import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import makeTheme from "ui/theme";
import { useUiController } from "ui/UiContext";
import RemoteRoutes from "./RemoteRoutes";

// running the remote on its own (npm run start:analytics), without the host shell
export default function Standalone() {
  const [{ darkMode }] = useUiController();
  const theme = useMemo(() => makeTheme(darkMode, "analytics"), [darkMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <RemoteRoutes darkMode={darkMode} />
    </ThemeProvider>
  );
}
