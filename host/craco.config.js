const {
  allowSharedFolder,
  absoluteHtmlPaths,
  singletons,
  SINGLETONS,
  ModuleFederationPlugin,
} = require("../shared/craco.shared");
const deps = require("./package.json").dependencies;

// where the remotes live; dev servers by default, the Pages paths in CI
const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_URL || "http://localhost:3002";
const RECORDS_URL = process.env.REACT_APP_RECORDS_URL || "http://localhost:3003";

module.exports = {
  webpack: {
    configure: (config) => {
      allowSharedFolder(config);
      absoluteHtmlPaths(config);
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "host",
          remotes: {
            analytics: `analytics@${ANALYTICS_URL}/remoteEntry.js`,
            records: `records@${RECORDS_URL}/remoteEntry.js`,
          },
          // the host owns React, the router and emotion; remotes reuse these copies
          shared: singletons(deps, SINGLETONS, true),
        })
      );
      return config;
    },
  },
};
