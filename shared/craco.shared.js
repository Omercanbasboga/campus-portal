// Shared craco setup for the three apps: lets each app import the shared UI
// folder (outside its own src/) and adds the Module Federation plugin.
const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;

const SHARED_DIR = path.resolve(__dirname);

function allowSharedFolder(webpackConfig) {
  // CRA refuses imports from outside src/; drop that guard.
  webpackConfig.resolve.plugins = (webpackConfig.resolve.plugins || []).filter(
    (p) => p.constructor.name !== "ModuleScopePlugin"
  );
  webpackConfig.resolve.alias = { ...webpackConfig.resolve.alias, ui: path.join(SHARED_DIR, "ui") };

  // and run babel over it like over src/
  const oneOf = webpackConfig.module.rules.find((r) => Array.isArray(r.oneOf)).oneOf;
  oneOf.forEach((rule) => {
    if (rule.loader && rule.loader.includes("babel-loader") && rule.include) {
      rule.include = [].concat(rule.include, SHARED_DIR);
    }
  });
}

// Chunks use publicPath "auto" so a remote resolves them from wherever its
// remoteEntry.js was loaded. The app's own index.html still needs absolute
// script paths, otherwise deep links like /records/user-details/1 break.
function absoluteHtmlPaths(webpackConfig, remoteName) {
  const base = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL.replace(/\/$/, "")}/` : "/";
  webpackConfig.plugins.forEach((plugin) => {
    if (plugin.constructor.name !== "HtmlWebpackPlugin") return;
    // v5 copies its options in the constructor, so patch both copies
    [plugin.userOptions, plugin.options].filter(Boolean).forEach((opts) => {
      opts.publicPath = base;
      // remoteEntry.js is for other apps to load, not for our own page
      if (remoteName) opts.excludeChunks = [...(opts.excludeChunks || []), remoteName];
    });
  });
}

function singletons(deps, names, eager) {
  return Object.fromEntries(
    names
      .filter((n) => deps[n])
      .map((n) => [n, { singleton: true, eager, requiredVersion: deps[n] }])
  );
}

// Libraries that hold global state and must exist once on the page. MUI is
// not on the list: the apps import it by deep path (@mui/material/Tabs), and
// sharing those piecemeal would mix the host's components with a remote's
// own copies. Each app bundles the MUI parts it uses and sets up its own
// ThemeProvider from the darkMode prop instead.
const SINGLETONS = ["react", "react-dom", "react-router-dom", "@emotion/react", "@emotion/styled"];

module.exports = {
  allowSharedFolder,
  absoluteHtmlPaths,
  singletons,
  SINGLETONS,
  ModuleFederationPlugin,
};
