const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function override(config, env) {
  // Add bundle analyzer in development
  if (env === 'development') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: false,
      })
    );
  }

  // Optimize chunks
  config.optimization = {
    ...config.optimization,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: 'mui',
          chunks: 'all',
        },
      },
    },
  };

  // Add compression
  if (env === 'production') {
    config.optimization.minimizer.push(
      new (require('terser-webpack-plugin'))({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      })
    );
  }

  return config;
};