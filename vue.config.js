/* global process */
import path from 'path'
import fs from 'fs'
import webpackCopy from 'copy-webpack-plugin'

// Generate pages object
const pages = {}

function getEntryFile(entryPath) {
  let files = fs.readdirSync(entryPath)
  return files
}

const chromeName = getEntryFile(path.resolve(`src/entry`))

function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined
}
chromeName.forEach((name) => {
  const fileExtension = getFileExtension(name)
  const fileName = name.replace('.' + fileExtension, '')
  pages[fileName] = {
    entry: `src/entry/${name}`,
    template: 'public/index.html',
    filename: `${fileName}.html`,
  }
})

const isDevMode = process.env.NODE_ENV === 'development'

export default {
  pages,
  outputDir: 'chrome_extension',
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin('copy').use(webpackCopy, [
      {
        patterns: [
          {
            from: path.resolve(`src/manifest.${process.env.NODE_ENV}.json`),
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
