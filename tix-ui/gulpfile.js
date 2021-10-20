/* eslint-disable */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');

gulp.task('compile', function() {
  return gulp.src('./src/theme/src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('./src/theme/lib'));
});

gulp.task('copyfont', function() {
  return gulp.src('./src/theme/src/fonts/**')
    .pipe(cssmin())
    .pipe(gulp.dest('./src/theme/lib/fonts'));
});

gulp.task('build', ['compile', 'copyfont']);

gulp.task('watch', function() {
  gulp.watch('./src/theme/src/*.scss', ['compile']);
});

module.exports = gulp.start('watch');
