const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');
const webpack = require('webpack');

//add all packages from the monorepo here as well, or they won't be compiled
const packages = [];
packages.push(path.join(__dirname, '../../packages/blueboard-client'));
packages.push(path.join(__dirname, '../../packages/blueboard-client-react'));

module.exports = {
    webpack: {
        configure: (webpackConfig, arg) => {
            const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'));
            if (isFound) {
                const include = Array.isArray(match.loader.include) ? match.loader.include : [match.loader.include];

                match.loader.include = include.concat(packages);
            }

            return webpackConfig;
        },
    },
};
