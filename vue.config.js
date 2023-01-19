/* global process */
import path from 'path'
import webpackCopy from 'copy-webpack-plugin'

const isDevMode = process.env.NODE_ENV === 'development'

export default {
  pages: {
    background: 'src/entry/background.js',
    recorder: 'src/entry/recorder.js',
  },
  outputDir: 'chrome_extension',
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin('copy').use(webpackCopy, [
      {
        patterns: [
          {
            from: path.resolve(`src/manifest.json`),
            to: `${path.resolve('chrome_extension')}/manifest.json`,
          },
          {
            from: path.resolve(`public/`),
            to: `${path.resolve('chrome_extension')}/`,
          },
        ],
      },
    ])
  },
  configureWebpack: {
    output: {
      filename: `[name].js`,
      chunkFilename: `[name].js`,
    },
    devtool: isDevMode ? 'inline-source-map' : false,
  },
  css: {
    extract: false, // Make sure the css is the same
  },
}
