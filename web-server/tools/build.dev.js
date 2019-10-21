const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

webpackConfig.mode = "development";
webpackConfig.devtool = 'inline-source-map';
console.log('Generating minified bundle for production via webpack, please wait...');

webpack(webpackConfig).run((err, stats) => {
  console.log(`Webpack stats: ${stats}`);
  if (err || stats.hasErrors()){
    return 1;
  }
  console.log('Your app has been compiled in production mode and written to dist');
  return 0;
});