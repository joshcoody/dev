var gulp = require('gulp');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var clip = require('gulp-clip-empty-files');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var files = {
  'scss': {
    'source': 'source/scss/*.scss',
    'destination': './source/css'
  },
  'css': {
    'source': 'source/css/*.css',
    'destination': './public/'
  },
  'images': {
    'source': 'source/images/*',
    'destination': './public/'
  },
  'js': {
    'source': 'source/js/*',
    'destination': './public/'
  },
  'html': {
    'source': './index.html'
  }
};

gulp.task('scss', function() {
  return gulp.src(files.scss.source)
    .pipe(newer(files.scss.destination))
    .pipe(clip())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded',
      includePaths: ['~/Mixins']
    }))
    .pipe(autoprefixer({
      browsers: ['last 6 versions', 'ie 8'],
      cascade: false
    }))
    .pipe(gulp.dest(files.scss.destination));
});

gulp.task('css', ['scss'], function() {
  return gulp.src(files.css.source)
    .pipe(newer(files.css.destination))
    .pipe(clip())
    //.pipe(concat('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 6 versions', 'ie 8'],
      cascade: false
    }))
    .pipe(minifyCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(files.css.destination))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('images', function() {
  return gulp.src(files.images.source)
    .pipe(newer(files.images.destination))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(files.images.destination));
});

gulp.task('js', function() {
  return gulp.src(files.js.source)
    .pipe(newer(files.js.destination))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(files.js.destination));
});

gulp.task('watch', function() {
  gulp.watch(files.scss.source, ['css']);
  gulp.watch(files.images.source, ['images']);
  gulp.watch(files.js.source, ['js']);
  gulp.watch(files.html.source).on('change', reload);
});

gulp.task('serve', function() {
  browserSync({
    server: './',
    open: false
  });
});

gulp.task('default', ['css', 'images', 'js', 'watch', 'serve']);
