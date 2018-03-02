var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var browserify = require('browserify');
var source  = require('vinyl-source-stream');
var tsify = require("tsify");

var path = {
    pages: ['src/*.html']
};
gulp.task('copy-html', function() {
    return gulp.src(path.pages)
           .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function (){
    return  browserify({
        basedir: '.',
        debug: true,
        entries: ['src/mian.ts'],
        cache: {},
        packageCache: {}

    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
    
});