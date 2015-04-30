var gulp = require('gulp'),
    riot = require('gulp-riot'),
    babel = require('gulp-babel'),

    rimraf = require('rimraf'),

    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify');

var babelConfig = {
    stage: 1,
    optional: 'runtime'
};

gulp.task('scripts-app', function() {
    return gulp.src('src/app/**/*.js')
        .pipe(babel(babelConfig))
        .pipe(gulp.dest('dist/app'));
});

gulp.task('scripts-client', function() {
    return gulp.src('src/client/**/*.js')
        .pipe(gulp.dest('dist/client'));
});

gulp.task('scripts-server', function() {
    return gulp.src('src/server/**/*.js')
        .pipe(babel(babelConfig))
        .pipe(gulp.dest('dist/server'));
});

gulp.task('browserify', [
    'scripts-app',
    'scripts-client'
], function() {
    var b = browserify({
        entries: './dist/client/index.js',
        debug: true,
        transform: [
            babelify.configure(babelConfig)
        ]
    });

    return b.bundle()
        .pipe(source('index.js')) // overwrite existing
        .pipe(buffer())
        .pipe(gulp.dest('dist/client'));
});

gulp.task('scripts', ['scripts-server', 'browserify']);

gulp.task('views-html', function() {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('views-tags', function() {
    return gulp.src('src/**/*.tag')
        .pipe(riot())
        .pipe(gulp.dest('dist'));
});

gulp.task('views', ['views-html', 'views-tags']);

gulp.task('clean', function() {
    rimraf('./dist', function(e) {
        if (e) console.error(e);
    });
})

gulp.task('build', ['scripts', 'views']);

gulp.task('serve', function() {

});

gulp.task('watch', ['build'], function() {
    gulp.watch([
        'src/**/*.js',
        'src/**/*.html',
        'src/**/*.tag'
    ], ['build', 'serve']);
});

gulp.task('default', ['build', 'serve']);