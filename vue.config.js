const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  // サブディレクトリでも動くように
  publicPath: './',
  css: {
    // 本番以外はcss sourceMapを有効にする
    sourceMap: process.env.NODE_ENV !== 'production',
  },
  // webpack.config.js の設定はここに書く
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              // 本番はconsole.logを削除する
              drop_console: process.env.NODE_ENV === 'production',
              // 本番はdebuggerを削除する
              drop_debugger: process.env.NODE_ENV === 'production',
            },
          },
        }),
      ],
    },
  },
};
