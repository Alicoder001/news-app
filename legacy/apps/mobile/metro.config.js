// https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for monorepo
config.watchFolders = [
  // Watch the shared packages
  require('path').resolve(__dirname, '../../packages'),
];

// Add resolver for workspace packages
config.resolver.nodeModulesPaths = [
  require('path').resolve(__dirname, 'node_modules'),
  require('path').resolve(__dirname, '../../node_modules'),
];

// Fix for import.meta in web (common with zustand/react-query in Expo SDK 54)
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config;
