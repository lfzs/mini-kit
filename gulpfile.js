const gulp = require('gulp')
const debug = require('gulp-debug')
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
const fs = require('fs')

const paths = {
  js: ['src/app.js', 'src/**/*.js'],
  html: ['src/**/*.wxml'],
  style: ['src/**/*.less'],
  other: ['src/**/*.json', 'src/**/*.wxss', 'src/**/*.wxs', 'src/**/*.{png,svg,jpg,jpeg,gif}'],
}

const webpackConfig = {
  // mode: process.env.NODE_ENV === 'development' ? 'development' : 'production', devtool: false,
  mode: 'production',
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
},
}

function handleError(err) {
  console.log(color.red('===================== Error Start ====================='))
  console.log(color.red('    line: '), color.green(err.lineNumber))
  console.log(color.red('  plugin: '), color.green(err.plugin))
  console.log(color.red(' message: '), color.green(err.message))
  console.log(color.red('=====================  Error End  ====================='))

  notifier.notify({
    title: `${err.plugin}错误`,
    message: err.fileName
  })
  this.emit('end')
}

function bundleJS() {
  return gulp.src(paths.js)
    .pipe(changed('dist'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(process.env.NODE_ENV !== 'development', eslint.failOnError()))
    .pipe(babel())
    .pipe(getNpm())
    .pipe(gulp.dest('dist'))
    // .pipe(debug({ title: 'js编译', showCount: false }))
}

const tempNames = {}
function getNpm() {
  return through.obj((file, encoding, callback) => {
    if(!file.isBuffer()) return callback(null, file)
    const contents = file.contents.toString()

    const zIndex = path.relative(file.dirname, file.base).replace(/\\/g, '/')
    const newContents = contents.replace(/require\("(?!\.)/g, `require("${zIndex || '.' }/`) // 非形如 ./ ../ 开头
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
          entry[_name] =  _name
        }
      }
    })
    // console.log(entry)
    Object.keys(entry).length && webpack({ ...webpackConfig, entry }).run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(color.red('===================== webpack Error ====================='))
        console.log(color.red('file '), color.green(file.path))
        console.log(color.red('entry '), color.green(entry))
      }
    })

    callback(null, file)
  })
}

function bundleLess() {
  return gulp.src(paths.style)
    .pipe(changed('dist', { extension: '.wxss' }))
    .pipe(stylelint({
      failAfterError: process.env.NODE_ENV !== 'development',
      reporters: [{ formatter: 'string', console: true }],
    }))
    .pipe(less({ globalVars: require('./src/style/less-var.js') }))
    .on('error', handleError)
    .pipe(postcss(
      [px2units({ multiple: 2 }), autoprefixer()].concat(process.env.NODE_ENV === 'development' ? [] : cssnano())
    ))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest('dist'))
    // .pipe(debug({ title: 'less编译', showCount: false }))
}

function copyWxml() {
  return gulp.src(paths.html)
    .pipe(changed('dist'))
    .on('error', handleError)
    .pipe(gulp.dest('dist'))
    // .pipe(debug({ title: '复制wxml文件', showCount: false }))
}

function copyOther() {
  return gulp.src(paths.other)
    .pipe(changed('dist'))
    .on('error', handleError)
    .pipe(gulp.dest('dist'))
    // .pipe(debug({ title: '复制other文件', showCount: false }))
}

function clean() {
  return del('dist')
}

function jsLint() {
  return gulp.src(paths.js)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError())
}

function styleLint() {
  return gulp.src(paths.style)
  .pipe(stylelint({
    failAfterError: true,
    reporters: [{ formatter: 'string', console: true }],
  }))
}

function watch() {
  gulp.watch(paths.js, gulp.series(bundleJS))
  gulp.watch(paths.style, gulp.series(bundleLess))
  gulp.watch(paths.html, gulp.series(copyWxml))
  gulp.watch(paths.other, gulp.series(copyOther))
}

gulp.task('dev', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, bundleJS), watch))
gulp.task('build', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, bundleJS)))
gulp.task('lint', gulp.parallel(jsLint, styleLint))
