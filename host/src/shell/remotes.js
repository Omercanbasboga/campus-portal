import { lazy } from "react";
import { APP_COLOR } from "ui/tokens";

// The two remotes the shell knows about. Each is built and deployed on its own;
// the browser fetches its remoteEntry.js the first time one of its routes opens.
export const REMOTES = {
  analytics: {
    key: "analytics",
    label: "Oturum analitiği",
    summary: "Kampüs uygulamalarına girişler: trafik, cihazlar, kullanıcılar, güvenlik alarmları.",
    color: APP_COLOR.analytics,
    basePath: "/analytics",
    Routes: lazy(() => import("analytics/Routes")),
  },
  records: {
    key: "records",
    label: "Kayıtlar",
    summary: "Personel, öğrenci ve birim kayıtları; organizasyon şeması ve kişi detayları.",
    color: APP_COLOR.records,
    basePath: "/records",
    Routes: lazy(() => import("records/Routes")),
  },
};

// same env names and defaults as host/craco.config.js
export const REMOTE_URL = {
  analytics: process.env.REACT_APP_ANALYTICS_URL || "http://localhost:3002",
  records: process.env.REACT_APP_RECORDS_URL || "http://localhost:3003",
};

// how long remoteEntry.js took and how big it was, from the browser's own timing
export function remoteEntryTiming(key) {
  const url = new URL(`${REMOTE_URL[key]}/remoteEntry.js`, window.location.href).href;
  const entry = performance
    .getEntriesByType("resource")
    .filter((e) => e.name.split("?")[0] === url)
    .pop();
  if (!entry) return null;
  return {
    ms: Math.round(entry.duration),
    kb: entry.transferSize ? Math.round(entry.transferSize / 102.4) / 10 : null,
    url: entry.name,
  };
}
