'use strict';

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const lazypipe = require('lazypipe');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const header = require('gulp-header');
const babel = require('gulp-babel');

const pkg = require('./package.json');

const [todayDateISO, todayTimeISO] = new Date().toISOString().split('T');
const [todayYear, todayMonth, todayDay] = todayDateISO.split('-');
const [todayHour, todayMinute] = todayTimeISO.split(':');
const today = `${todayDay}-${todayMonth}-${todayYear} ${todayHour}:${todayMinute}`;

const banner = [
  '/*!',
  ' * MoveTo - ' + pkg.description,
  ' * Version ' + pkg.version + ' (' + today + ')',
  ' * Licensed under ' + pkg.license,
  ' * Copyright ' + todayYear + ' ' + pkg.author,
  ' */\n\n'
].join('\n');

function jsLint() {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(browserSync.active ? () => undefined : eslint.failOnError());
}

function jsMain(cb) {
  const scriptsMinChannel = lazypipe()
    .pipe(uglify)
    .pipe(rename, {suffix: '.min'})
    .pipe(header, banner)
    .pipe(gulp.dest, 'dist/');

  return gulp.src('src/**/*.js')
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(header(banner))
    .pipe(gulp.dest('dist'))
    .pipe(scriptsMinChannel())
    .on('end', cb);
}

function reload(cb) {
  browserSync.reload();
  cb();
}

function serve() {
  browserSync.init({
    ghostMode: false,
    notify: false,
    server: ['./'],
    port: 3000
  });

  gulp.watch('src/**/*.js', gulp.series('scripts', reload));
}

gulp.task('scripts:lint', jsLint);
gulp.task('scripts:main', jsMain);
gulp.task('scripts', gulp.series('scripts:lint', 'scripts:main'));

gulp.task('clean:dist', () => del(['dist/*'], { dot: true }));

gulp.task('build', gulp.series('clean:dist', 'scripts'));

gulp.task('serve', serve);
