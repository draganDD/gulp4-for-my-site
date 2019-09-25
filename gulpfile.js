
var gulp=require('gulp'),
    autoprefixer=require('gulp-autoprefixer'),
    browserSync=require('browser-sync').create(),
    reload=browserSync.reload(),
    less=require('gulp-less'),
    cleanCSS=require('gulp-clean-css'),
    sourcemaps=require('gulp-sourcemaps'),
    concat=require('gulp-concat'),
    imagemin=require('gulp-imagemin'),
    changed=require('gulp-changed'),
    uglify=require('gulp-uglify');


gulp.task('lesscss',function() {
   return gulp.src('app/less/*.less')
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(less({
        outputStyle: 'expanded'
    }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
})



gulp.task('concatCSS',function() {
    return gulp.src(['app/**/*.css','!app/css/nav2.css',])
    .pipe(sourcemaps.init({loadMaps:true,largeFile:true}))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('javascript',function() {
    return gulp.src('app/js/*.js')
    .pipe(concat('dev.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

//translation: slike (ser) -> pictures (eng)
gulp.task('imgmin',function() {
    return gulp.src('app/slike/**/*')
    .pipe(changed('dist/slike/'))
    .pipe(imagemin([
        imagemin.gifsicle({interlaced:true}),
        imagemin.jpegtran({progressive:true}),
        imagemin.optipng({optimizationLevel:5})             
    ]))
    .pipe(gulp.dest('dist/slike/'))
})



gulp.task('watch',function() {

    browserSync.init({
        open:'external',
         server:'./'
    });
   
    gulp.watch('./**/*.less',gulp.parallel('lesscss','concatCSS'));
    gulp.watch('app/js/*.js',gulp.series('javascript'));
    //translation: slike (ser) -> pictures (eng)
    gulp.watch('app/slike',gulp.series('imgmin'));

    gulp.watch('*.html').on('change', browserSync.reload);
})

gulp.task('default',gulp.parallel('watch'))
