'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var ngHtml2Js = require('gulp-ng-html2js');
var sequence = require('run-sequence');

var color = {
  green: function (message) {
    return gutil.colors.green(message);
  },
  blue: function (message) {
    return gutil.colors.blue(message);
  },
  gray: function (message) {
    return gutil.colors.gray(message);
  },
  yellow: function (message) {
    return gutil.colors.yellow(message);
  }
};

var templates = [
  // 'src/templates/template.html'
  'src/templates/template-bootstrap4.html'
];

var stylesheets = [
  'src/css/style-bootstrap4.css'
];

var scripts = [
  'src/js/app.js',
  'src/js/filters/*.js',
  'src/js/services/*.js',
  'src/js/directives/*.js'
];

// ---------------------------------------------------------------
// Clean

gulp.task('clean', function () {
  gutil.log(color.blue('Limpando diretórios'));
  return gulp.src('dist', { read: false })
    .pipe(clean({ force: true }));
});

// ---------------------------------------------------------------
// Concat

gulp.task('concat:js', function () {
  gutil.log(color.blue('Concatenado JS'));
  return gulp.src(scripts)
    .pipe(concat('veasy-table.js'))
    .pipe(gulp.dest('dist/js'))
    .on('error', gutil.log);
});

gulp.task('concat:css', function () {
  gutil.log(color.blue('Concatenando CSS'));
  return gulp.src(stylesheets)
    .pipe(concat('veasy-table.css'))
    .pipe(gulp.dest('dist/css'))
    .on('error', gutil.log);
});

// ---------------------------------------------------------------
// Uglify

gulp.task('min:js', function () {
  gutil.log(color.blue('Minificando JS'));
  return gulp.src(scripts)
    .pipe(uglify().on('error', gutil.log))
    .pipe(concat('veasy-table.min.js'))
    .pipe(gulp.dest('dist/js'))
    .on('error', gutil.log);
});

gulp.task('min:css', function () {
  gutil.log(color.blue('Minificando CSS'));
  return gulp.src(stylesheets)
    .pipe(minifyCss().on('error', gutil.log))
    .pipe(concat('veasy-table.min.css'))
    .pipe(gulp.dest('dist/css'))
    .on('error', gutil.log);
});

gulp.task('min:html', function () {
  gutil.log(color.blue('Minificando HTML'));
  gulp.src(templates)
    .pipe(minifyHtml({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(ngHtml2Js({
      moduleName: 'veasy.table.templates',
    }))
    .pipe(uglify())
    .pipe(concat('veasy-table-tpls-bs4.min.js'))
    .pipe(gulp.dest('dist/js'))
    .on('error', gutil.log);
});

// ---------------------------------------------------------------
// Principal

gulp.task('dist', function () {
  gutil.log(color.blue('Compilando em modo de distribuição'));
  sequence('clean', 'concat:js', 'concat:css', 'min:js', 'min:css', 'min:html');
});

gulp.task('watch', function () {
  gulp.watch([
    'src/**/*'
  ], ['dev']);
});

gulp.task('dev', function () {
  gutil.log(color.blue('Compilando em modo de desenvolvimento'));
  sequence('clean', 'concat:js', 'concat:css', 'min:js', 'min:css', 'min:html', 'watch');
});

