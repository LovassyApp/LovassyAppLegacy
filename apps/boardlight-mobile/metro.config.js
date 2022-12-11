const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const extraNodeModules = {
  packages: path.resolve(path.join(__dirname, "../../packages")),
};

const watchFolders = [path.resolve(path.join(__dirname, "../../packages"))];

const nodeModulesPaths = [path.resolve(path.join(__dirname, "./node_modules"))];

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
    inlineRequires: true,
  },
});

config.resolver.extraNodeModules = extraNodeModules;
config.resolver.nodeModulesPaths = nodeModulesPaths;
config.watchFolders = watchFolders;

module.exports = config;
