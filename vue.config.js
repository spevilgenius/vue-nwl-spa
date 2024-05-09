module.exports = {
  devServer: {
    host: 'localhost'
  },

  assetsDir: 'static',
  publicPath: process.env.BASE_URL,
  // publicPath: '/',

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

  chainWebpack: (config) => {
    // console.log(config.plugins)
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
  },

  filenameHashing: true,
  productionSourceMap: false,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/sass/spa/_mixins.scss";
          @import "@/assets/sass/spa/_functions.scss";
          @import "@/assets/sass/spa/_functions-overrides.scss";
          @import "@/assets/sass/spa/_variables.scss";
        `
      }
    }
  }
}
