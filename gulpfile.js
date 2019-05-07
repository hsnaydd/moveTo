'use strict';

const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins');
const lazypipe = require('lazypipe');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const pkg = require('./package.json');
const today = $.util.date('dd-mm-yyyy HH:MM');

const browserSyncConfigs = {
  notify: false,
  // Disable open automatically when Browsersync starts.
  open: false,
  server: ['./'],
  port: 3000
};

const banner = [
  '/*!',
  ' * MoveTo - ' + pkg.description,
  ' * Version ' + pkg.version + ' (' + today + ')',
  ' * Licensed under ' + pkg.license,
  ' * Copyright ' + $.util.date('yyyy') + ' ' + pkg.author,
  ' */\n\n'
].join('\n');


gulp.task('scripts:lint', (cb) => {
  return gulp.src('src/**/*.js')
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
    .pipe($.babel({presets: ['@babel/preset-env']}))
    .pipe($.header(banner))
    .pipe(gulp.dest('dist'))
    .pipe(scriptsMinChannel());
});

gulp.task('clean:dist', () => del(['dist/*'], {dot: true}));

gulp.task('build', (cb) =>
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
