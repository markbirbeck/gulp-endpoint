var gulp = require('gulp');
var concat = require('gulp-concat');
var swig = require('gulp-swig');
var frontMatter = require('gulp-front-matter');

gulp.task('concat', function() {
  return gulp.src(['hello.txt', 'world.txt'])
    .pipe(concat('result.txt', {newLine: ' '}))
    .pipe(gulp.dest('output'));
});

gulp.task('compile-page', function() {
  return gulp.src('page.html')
    .pipe(frontMatter({property: 'data'}))
    .pipe(swig())
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['compile-page']);
