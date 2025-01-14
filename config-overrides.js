const webpack = require('webpack');

module.exports = function override(config, env) {
  // Adding necessary polyfills for Node.js core modules
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    os: require.resolve('os-browserify/browser'),
    net: require.resolve('net-browserify'),
    fs: require.resolve('browserify-fs'),
    stream: require.resolve('stream-browserify'),
    path: require.resolve('path-browserify'),
    zlib: require.resolve('browserify-zlib'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url'),
    util: require.resolve('util'),
    assert: require.resolve('assert'),
    tty: require.resolve('tty-browserify'),
    querystring: require.resolve('querystring-es3'),
    process: require.resolve('process/browser'),
    buffer: require.resolve('buffer/'),
  };

  // Ensuring webpack handles extensions properly
  config.resolve.extensions = [
    '.mjs',
    '.js',
    '.json',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.scss',
  ];

  // Adding ProvidePlugin for process to handle its usage in frontend
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // Provide the process module for the browser
      Buffer: ['buffer', 'Buffer'], // Provide the Buffer module for the browser
    }),
  ]);

  // Modify how Webpack resolves ESM extensions (force explicit extension handling)
  config.resolve.mainFields = ['browser', 'module', 'main'];

  return config;
};
