const gulp = require('gulp')
const changed = require('gulp-changed')
const eslint = require('gulp-eslint')
const gulpif = require('gulp-if')
const babel = require('gulp-babel')
const del = require('del')
const color = require('colors')
const notifier = require('node-notifier')
const stylelint = require('gulp-stylelint')
const less = require('gulp-less')
const rename = require('gulp-rename')
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
  other: ['src/**/*.json', 'src/**/*.wxss', 'src/**/*.wxs', 'src/**/*.{png,svg,jpg,jpeg,gif}'],
}

const isDev = process.env.NODE_ENV === 'development'

const webpackConfig = {
  // mode: process.env.NODE_ENV === 'development' ? 'development' : 'production', devtool: false,
  mode: 'production',
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
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

  notifier.notify({
    title: `${err.plugin}错误`,
    message: err.fileName,
  })
  this.emit('end')
}

function bundleJS() {
  return gulp.src(paths.js)
    .pipe(changed('dist'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(!isDev, eslint.failAfterError()))
    .pipe(gulpif(!isDev, eslint.results(({ warningCount }) => warningCount > 0 && process.exit())))
    .pipe(babel())
    .pipe(getNpm())
    .pipe(gulp.dest('dist'))
}

const tempNames = {}
function getNpm() {
  return through.obj((file, encoding, callback) => {
    if (!file.isBuffer()) return callback(null, file)
    const contents = file.contents.toString()

    const zIndex = path.relative(file.dirname, file.base).replace(/\\/g, '/')
    const newContents = contents.replace(/require\("(?!\.)/g, `require("${zIndex || '.'}/`) // 非形如 ./ ../ 开头
    file.contents = Buffer.from(newContents)

    const reg = /require\((.*?)\)/g
    const packageNames = contents.match(reg) || []
    const entry = {}

    packageNames.map(name => {
      if (!name.includes('./')) {
        const _name = name.split('"')[1]
        // console.log(_name)
        if (!tempNames[_name]) {
          tempNames[_name] = _name
          entry[_name] = _name
        }
      }
    })
    // console.log(entry)
    Object.keys(entry).length && webpack({ ...webpackConfig, entry }).run((err, stats) => {
      if (err || stats.hasErrors()) {
        /* eslint-disable */
        console.log(color.red('===================== webpack Error ====================='))
        console.log(color.red('file '), color.green(file.path))
        console.log(color.red('entry '), color.green(entry))
        /* eslint-enable */
      }
    })

    callback(null, file)
  })
}

function bundleLess() {
  return gulp.src(paths.less)
    .pipe(changed('dist', { extension: '.wxss' }))
    .pipe(stylelint({
      failAfterError: !isDev,
      reporters: [{ formatter: 'string', console: true }],
    }))
    .pipe(less({ globalVars: require('./src/style/less-var.js') }))
    .on('error', handleError)
    .pipe(postcss(
      [px2units({ multiple: 2 }), autoprefixer()].concat(isDev ? [] : cssnano())
    ))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest('dist'))
}

function copyWxml() {
  return gulp.src(paths.wxml)
    .pipe(changed('dist'))
    .on('error', handleError)
    .pipe(gulp.dest('dist'))
}

function copyOther() {
  return gulp.src(paths.other)
    .pipe(changed('dist'))
    .on('error', handleError)
    .pipe(gulp.dest('dist'))
}

function clean() {
  return del('dist')
}

function watch() {
  gulp.watch(paths.js, gulp.series(bundleJS))
  gulp.watch(paths.less, gulp.series(bundleLess))
  gulp.watch(paths.wxml, gulp.series(copyWxml))
  gulp.watch(paths.other, gulp.series(copyOther))
}

gulp.task('dev', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, bundleJS), watch))
gulp.task('build', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, bundleJS)))
