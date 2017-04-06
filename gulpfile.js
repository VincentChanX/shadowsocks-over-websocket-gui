var gulp = require('gulp');


var bowerComponentsPath = './bower_components/';

gulp.task('assets', function() {
    gulp.src([
        bowerComponentsPath + 'bootstrap/dist/css/*.min.css',
        bowerComponentsPath + 'fakeLoader/*.css'
    ]).pipe(gulp.dest('assets/css'));


    gulp.src([
        bowerComponentsPath + 'bootstrap/dist/js/*.min.js',
        bowerComponentsPath + 'jquery/dist/*.min.js',
        bowerComponentsPath + 'vue/dist/*.min.js',
        bowerComponentsPath + 'fakeLoader/*.min.js'

    ]).pipe(gulp.dest('assets/js'));
});


gulp.task('default', ['assets']);