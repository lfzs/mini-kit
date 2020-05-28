const gulp = require('gulp')
const changed = require('gulp-changed')
const eslint = require('gulp-eslint')
const gulpif = require('gulp-if')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const color = require('colors')
const notifier = require('node-notifier')
const stylelint = require('gulp-stylelint')
const less = require('gulp-less')
const rename = require('gulp-rename')
const preprocess = require('gulp-preprocess')
const postcss = require('gulp-postcss')
const px2units = require('postcss-px2units')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const webpack = require('webpack')
const through = require('through2')
const path = require('path')

const paths = {
  js: ['src/app.js', 'src/**/*.js'],
  less: ['src/**/*.less'],
  wxml: ['src/**/*.wxml'],
  wxs: ['src/**/*.wxs'],
  other: ['src/**/*.json', 'src/**/*.wxss', 'src/**/*.wxs', 'src/**/*.{png,svg,jpg,jpeg,gif}'],
}

const platform = {
  weixin: {
    dist: 'dist',
    less: '.wxss',
    wxml: '.wxml',
    wxs: '.wxs',
  },
  alipay: {
    dist: 'dist-alipay',
    less: '.acss',
    wxml: '.axml',
    wxs: '.sjs',
    attrs: {
      'wx:for': 'a:for',
      'wx:key': 'a:key',
      'wx:if': 'a:if',
      'wx:elif': 'a:elif',
      'wx:else': 'a:else',

      'bind:': 'on',
      'bind': 'on',
      'catch:': 'catch',

      'tap': 'Tap',
      'longtap': 'TongTap',
      'touchstart': 'TouchStart',
      'touchmove': 'TouchMove',
      'touchend': 'TouchEnd',
      'touchcancel': 'TouchCancel',

      'input': {
        'blur': 'Blur',
      },

      'image': {
        'onload': 'onLoad',
      },

      'wxs': {
        'wxs': 'import-sjs',
        'module': 'name',
        'src': 'from',
      },

    },
  },
}[process.env.PLATFORM]

const isWeixin = process.env.PLATFORM === 'weixin'
const isDev = process.env.NODE_ENV === 'development'

const webpackConfig = {
  // mode: process.env.NODE_ENV === 'development' ? 'development' : 'production', devtool: false,
  mode: 'production',
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, platform.dist),
  },
}

function handleError(err) {
  /* eslint-disable */
  console.log(color.red('===================== Error Start ====================='))
  console.log(color.red('    line: '), color.green(err.lineNumber))
  console.log(color.red('  plugin: '), color.green(err.plugin))
  console.log(color.red(' message: '), color.green(err.message))
  console.log(color.red('=====================  Error End  ====================='))
  /* eslint-enable */

  notifier.notify({ title: `${err.plugin}错误`, message: err.fileName })
  this.emit('end')
}

function bundleJS() {
  return gulp.src(paths.js)
    .pipe(changed(platform.dist))
    .pipe(preprocess())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(!isDev, eslint.failAfterError()))
    .pipe(gulpif(!isDev, eslint.results(({ warningCount }) => warningCount > 0 && process.exit(1))))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(getNpm())
    .pipe(gulp.dest(platform.dist))
}

const getNpm = function() {
  const cacheNames = {}
  return () => through.obj((file, encoding, callback) => {
    if (!file.isBuffer()) return callback(null, file)
    const contents = file.contents.toString()
    const zIndex = path.relative(file.dirname, file.base).split(path.sep).join('/')
    const newContents = contents.replace(/require\("(?!\.)/g, `require("${zIndex || '.'}/`) // 非形如 ./ ../ 开头
    file.contents = Buffer.from(newContents)

    const reg = /require\((.*?)\)/g
    const names = (contents.match(reg) || []).filter(i => !i.includes('./'))

    const entry = {}
    names.map(i => {
      const name = i.split('"')[1]
      if (!cacheNames[name]) cacheNames[name] = entry[name] = name
    })

    // console.log(entry)
    if (!Object.keys(entry).length) return callback(null, file)
    webpack({ ...webpackConfig, entry }).run((err, stats) => callback(err || stats.hasErrors() ? JSON.stringify(entry, null, 2) : null, file))
  })
}()

function bundleLess() {
  return gulp.src(paths.less)
    .pipe(changed(platform.dist, { extension: platform.less }))
    .pipe(preprocess())
    .pipe(stylelint({
      failAfterError: !isDev,
      reporters: [{ formatter: 'string', console: true }],
    }))
    .pipe(less({ globalVars: require('./src/style/less-var.js') }))
    .on('error', handleError)
    .pipe(postcss(
      [px2units({ multiple: 2 }), autoprefixer()].concat(isDev ? [] : cssnano())
    ))
    .pipe(rename({ extname: platform.less }))
    .pipe(gulp.dest(platform.dist))
}

function copyWxml() {
  return gulp.src(paths.wxml)
    .pipe(changed(platform.dist, { extension: platform.wxml }))
    .pipe(preprocess())
    .pipe(gulpif(!isWeixin, fuckml()))
    .on('error', handleError)
    .pipe(rename({ extname: platform.wxml }))
    .pipe(gulp.dest(platform.dist))
}

function fuckml() {
  return through.obj((file, encoding, callback) => {
    if (!file.isBuffer()) return callback(null, file)
    const contents = file.contents.toString()

    const reg = /<(?!\/|!).+?>/gs // 匹配到标签的 前半部 或者 单闭合标签
    const replacer = (match) => {
      let newStr = match

      Object.entries(platform.attrs).map(([key, value]) => {
        if (typeof value === 'string') newStr = newStr.replace(key, value)
        else {
          const tagName = match.replace(/\s/g, ' ').split(' ')[0].slice(1)
          const tagAttrs = platform.attrs[tagName]
          if (tagAttrs) Object.entries(tagAttrs).map(([key, value]) => newStr = newStr.replace(key, value))
        }
      })
      return newStr
    }

    const newContents = contents.replace(reg, replacer)
    file.contents = Buffer.from(newContents)
    return callback(null, file)
  })
}

function copyWxs() {
  return gulp.src(paths.wxs)
    .pipe(changed(platform.dist, { extension: platform.wxs }))
    .pipe(preprocess())
    .pipe(changed(platform.dist))
    .on('error', handleError)
    .pipe(rename({ extname: platform.wxs }))
    .pipe(gulp.dest(platform.dist))
}

function copyOther() {
  return gulp.src(paths.other)
    .pipe(preprocess())
    .pipe(changed(platform.dist))
    .on('error', handleError)
    .pipe(gulp.dest(platform.dist))
}

function clean() {
  return del(platform.dist)
}

function watch() {
  gulp.watch(paths.js, gulp.series(bundleJS))
  gulp.watch(paths.less, gulp.series(bundleLess))
  gulp.watch(paths.wxml, gulp.series(copyWxml))
  gulp.watch(paths.wxs, gulp.series(copyWxs))
  gulp.watch(paths.other, gulp.series(copyOther))
}

gulp.task('dev', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, copyWxs, bundleJS), watch))
gulp.task('build', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, copyWxs, bundleJS)))
