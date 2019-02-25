/**
 * Created by Jackie.Wu on 2018/8/3.
 */
module.exports = (() => {
  // Provide custom regenerator runtime and core-js
  require('babel-polyfill');

  // Javascript require hook
  require('babel-register')({
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['add-module-exports']
  });

  require('css-modules-require-hook')({
    extensions: ['.css', '.less'],
    processorOpts: {parser: require('postcss-less').parse}
  });

  // Image require hook
  require('asset-require-hook')({
    name: '/[hash].[ext]',
    extensions: ['jpg', 'png', 'gif', 'webp'],
    limit: 8000
  });

  require('react');

})();
