const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

  config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter(ext => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg",'js', 'jsx', 'json', 'ts', 'tsx'],
    platformExts: ['web.js', 'web.jsx', 'web.ts', 'web.tsx', 'js', 'jsx', 'ts', 'tsx']
  };

  return config;
})();