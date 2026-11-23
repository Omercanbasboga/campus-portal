import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { ConfigProvider, theme as antdTheme } from "antd";
import makeTheme from "ui/theme";
import { APP_COLOR } from "ui/tokens";
import PropTypes from "prop-types";
import { UiProvider } from "ui/UiContext";
import Page from "ui/Page";
import Text from "ui/Text";

import Dashboard from "./pages/dashboard/dashboard";
import UserList from "./pages/user-list";
import StudentList from "./pages/student-list";
import OrganizationChart from "./pages/organization-chart";
import DepartmentDetails from "./pages/department-details";
import UserDetails from "./pages/user-details";
import StudentDetails from "./pages/student-details";

function NotFound() {
  return (
    <Page>
      <Text variant="h5">Bu sayfa kayıtlar uygulamasında yok.</Text>
      <Text variant="body2" color="text">
        Soldaki menüden bir liste seçin.
      </Text>
    </Page>
  );
}

// What the host mounts under /records/*. Theme mode comes in as a prop.
export default function RemoteRoutes({ isMFE, darkMode }) {
  const theme = useMemo(() => makeTheme(darkMode, "records"), [darkMode]);
  return (
    <UiProvider darkMode={darkMode}>
      <ThemeProvider theme={theme}>
        <ConfigProvider
          theme={{
            algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            token: {
              colorPrimary: APP_COLOR.records,
              fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
            },
          }}
        >
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard isMFE={isMFE} />} />
            <Route path="user-list" element={<UserList isMFE={isMFE} />} />
            <Route path="student-list" element={<StudentList isMFE={isMFE} />} />
            <Route path="organization-chart" element={<OrganizationChart isMFE={isMFE} />} />
            <Route path="department-details/:id" element={<DepartmentDetails isMFE={isMFE} />} />
            <Route path="user-details/:id" element={<UserDetails isMFE={isMFE} />} />
            <Route path="student-details/:id" element={<StudentDetails isMFE={isMFE} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ConfigProvider>
      </ThemeProvider>
    </UiProvider>
  );
}

RemoteRoutes.propTypes = { isMFE: PropTypes.bool, darkMode: PropTypes.bool };
RemoteRoutes.defaultProps = { isMFE: true, darkMode: false };
