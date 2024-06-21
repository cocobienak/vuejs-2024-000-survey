const webpack = require('webpack');
module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  
  // publicPath: process.env.NODE_ENV === 'production' ? '/manage-event/' : '/',
  // publicPath: process.env.NODE_ENV === 'production' ? '/manage/' : '/',
  // publicPath: process.env.NODE_ENV === 'production' ? '/sanctuary-manage/' : '/',
  // publicPath: '/',
  // publicPath: '/survey-manage/',

  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
       symlinks: false
    },
    plugins: [ new webpack.ProvidePlugin({ 'window.Quill': 'quill/dist/quill.js', 'Quill': 'quill/dist/quill.js', })]
  },


  transpileDependencies: [
    '@coreui/utils'
  ]
}