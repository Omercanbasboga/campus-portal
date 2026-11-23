const { allowSharedFolder, absoluteHtmlPaths, singletons, SINGLETONS, ModuleFederationPlugin } = require("../shared/craco.shared");
const deps = require("./package.json").dependencies;

module.exports = {
  webpack: {
    configure: (config) => {
      allowSharedFolder(config);
      absoluteHtmlPaths(config, "records");
      config.output.publicPath = "auto";
      config.output.uniqueName = "records";
      // fast refresh breaks inside a federated remote
      config.plugins = config.plugins.filter((p) => p.constructor.name !== "ReactRefreshPlugin");
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "records",
          filename: "remoteEntry.js",
          exposes: { "./Routes": "./src/RemoteRoutes" },
          shared: singletons(deps, SINGLETONS, false),
        })
      );
      return config;
    },
  },
};
