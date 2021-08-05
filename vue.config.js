module.exports = {
  devServer: {
    host: 'localhost'
  },

  assetsDir: 'static',
  //publicPath: process.env.BASE_URL,
  publicPath: '/',

  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        automaticNameDelimiter: '_',
        minSize: 0
      }
    }
  },

  chainWebpack: config => {
    // console.log(config.plugins)
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
  },

  filenameHashing: true,
  productionSourceMap: false,
  runtimeCompiler: true
  /* css: {
    loaderOptions: {
      sass: {
        prependData: `
          $BACKGROUNDCOLOR: ${process.env.APP_BACKGROUND};
        `
      }
    }
  } */
}
