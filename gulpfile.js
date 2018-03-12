const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const colors = require('colors');
const concat = require('concat');
const minify = require('minify');
const source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');
const argv = require('yargs').argv;

function getJsLibName() {
    var libName = 'bundle.js';
    if (argv.min) { //按命令参数"--min"判断是否为压缩版
        libName = 'bundle.min.js';
    }

    return libName;
}

gulp.task('js', function() {
    return browserify({
            entries: './app/js/index.js' //指定打包入口文件
        }).transform(babelify, { //此处babel的各配置项格式与.babelrc文件相同
            presets: [
                'es2015', //转换es6代码
                'stage-0', //指定转换es7代码的语法提案阶段
                'react' //转换React的jsx
            ],
            plugins: [
                'transform-object-assign', //转换es6 Object.assign插件
                // 'external-helpers', //将es6代码转换后使用的公用函数单独抽出来保存为babelHelpers
                ['transform-es2015-classes', { "loose": false }], //转换es6 class插件
                ['transform-es2015-modules-commonjs', { "loose": false }] //转换es6 module插件
            ]
        }).bundle()
        .pipe(source(getJsLibName())) //将常规流转换为包含Stream的vinyl对象，并且重命名
        .pipe(buffer())
        .pipe(gulp.dest('./dist/js'))
        .pipe(reload({
            stream: true
        }));

});
gulp.task('sass', () => {

});
gulp.task('html', () => {
    gulp.src('./app/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('serve', ['js', 'sass', 'html'], () => {
    console.log('serve start:'.bgRed);
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        ui: {
            port: 3002
        }
    });
    gulp.watch('./app/scss/*.scss', ['sass']);
    gulp.watch('./app/js/*.js', ['js']);
    gulp.watch('./app/*.html').on('change', reload);
});
gulp.task('default', ['server'])