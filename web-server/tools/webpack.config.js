const path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, '../src/components/chat/chat.jsx')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../public/bundled/'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'chat-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(jsx)|(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      },
      {
        test: [/.css$|.scss$/],
        use:[
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
};