const path = require('path');

const extraNodeModules = {
	packages: path.resolve(path.join(__dirname, '../../packages')),
};

const watchFolders = [path.resolve(path.join(__dirname, '../../packages'))];

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];

module.exports = {
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: true,
				inlineRequires: true,
			},
		}),
	},
	resolver: {
		extraNodeModules,
		nodeModulesPaths,
	},
	watchFolders,
};
