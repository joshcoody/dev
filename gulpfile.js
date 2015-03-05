var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var watch = require('gulp-watch');

// Static Server + watching html files
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: "./app"
  });
  gulp.watch("./*.html").on('change', reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("./assets/*.scss")
    .pipe(watch('./assets/*.css'))
    .pipe(sass({
      errLogToConsole: true,
      includePaths: '',
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(gulp.dest("./assets/"))
    .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
