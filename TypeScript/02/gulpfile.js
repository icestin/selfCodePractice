var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var watchify = require('watchify');
var gutil = require('gulp-util');
var source  = require('vinyl-source-stream');
var tsify = require("tsify");

var path = {
    pages: ['src/*.html']
};
var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('copy-html', function() {
    return gulp.src(path.pages)
           .pipe(gulp.dest("dist"));
});

function bundle () {
    return watchedBrowserify.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}
gulp.task("default", ["copy-html"], bundle);
// 每次 TypeScript 文件改变时Browserify会执行bundle函数
watchedBrowserify.on('update', bundle);
// 将日志打印到控制台
watchedBrowserify.on('log', gutil.log);

