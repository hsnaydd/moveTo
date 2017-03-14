'use strict';

var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var gulpLoadPlugins =  require('gulp-load-plugins');
var lazypipe = require('lazypipe');

var $ = gulpLoadPlugins();
var reload = browserSync.reload;
var pkg = require('./package.json');
var today = $.util.date('dd-mm-yyyy HH:MM');

var browserSyncConfigs = {
  notify: false,
  // Disable open automatically when Browsersync starts.
  open: false,
  server: ['./'],
  port: 3000
};

var banner = [
  '/*!',
  ' * MoveTo - ' + pkg.description,
  ' * Version ' + pkg.version + ' (' + today + ')',
  ' * Licensed under ' + pkg.license,
  ' * Copyright ' + $.util.date('yyyy') + ' ' + pkg.author,
  ' */\n\n'
].join('\n');


gulp.task('scripts:lint', cb => {
  return gulp.src('src/scripts/**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe(browserSync.active ? $.util.noop() : $.eslint.failOnError());
});

gulp.task('scripts', ['scripts:lint'], () => {

  const scriptsMinChannel = lazypipe()
    .pipe($.uglify)
    .pipe($.rename, {suffix: '.min'})
    .pipe($.header, banner)
    .pipe(gulp.dest, 'dist/');

  return gulp.src('src/**/*.js')
    .pipe($.babel())
    .pipe($.header(banner))
    .pipe(gulp.dest('dist'))
    .pipe(scriptsMinChannel());
});

gulp.task('clean:dist', () => del(['dist/*'], {dot: true}));

gulp.task('build', cb =>
  runSequence(
    ['clean:dist'],
    ['scripts'],
    cb
  )
);

gulp.task('serve', () => {
  browserSync(browserSyncConfigs);
  gulp.watch(['src/**/*.js'], ['scripts', reload]);
});



