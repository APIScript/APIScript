
var del = require('del');
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sequence = require('gulp-sequence');
var mocha = require('gulp-mocha');
var json = require('gulp-json-editor');

gulp.task('clean:build', function() {
    return del(['build/**/*']);
});

gulp.task('clean:package', function() {
    return del(['package/**/*']);
});

gulp.task('build:src', function () {

    return gulp.src('src/**/*.ts')
        .pipe(typescript({
            target: 'es5',
            declaration: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('package:package.json', function() {

    gulp.src('package.json')
        .pipe(json({ 'main': 'index.js', 'types': 'index.d.ts' }))
        .pipe(gulp.dest('package'));
});

gulp.task('package:license', function() {

    return gulp.src('./LICENSE')
        .pipe(gulp.dest('package'));
});

gulp.task('package:src', function() {

    return gulp.src('build/main/**/*')
        .pipe(gulp.dest('package'));
});

gulp.task('test', ['build'], function() {

    return gulp.src('build/test/**/*.js', { read: false })
        .pipe(mocha());
});

gulp.task('clean', ['clean:build', 'clean:package']);
gulp.task('build', sequence('clean:build', 'build:src'));
gulp.task('package', sequence('clean:package', 'build', 'package:src', 'package:license', 'package:package.json'));