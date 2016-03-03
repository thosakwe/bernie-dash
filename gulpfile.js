var gulp = require('gulp');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('streamify');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');

gulp.task('watch', function () {
    var bundler = watchify(browserify({
        debug: true,
        entries: ['./src/game.js']
    }));
    bundler.transform(babelify, {presets: ['es2015'], sourceMaps: true});

    function bundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', function () {
                var args = Array.prototype.slice.call(arguments);
                notify.onError({
                    title: "Compile Error",
                    message: "<%= error.message %>"
                }).apply(this, args);
                this.emit('end'); // Keep gulp from hanging on this task
            })
            .pipe(source('dist.js'))
            /*.pipe(streamify(uglify({
             inSourceMap: 'game.js.map',
             outSourceMap: true
             })))*/
            .pipe(gulp.dest('./src'));
    }

    bundler.on('update', function () {
        console.log("Rebundling at ", new Date());
        bundle();
    });
    return bundle();
});

gulp.task('default', ['watch']);