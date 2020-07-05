const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps'); // 用于报错查看
const htmltpl = require('gulp-html-tpl') // 引用html模板
const artTemplate = require('art-template') // 模板渲染
const minifyHtml = require('gulp-html-minify') // 压缩html
const sass = require('gulp-sass') // sass
const autoprefixer = require('gulp-autoprefixer') // css标识
const minifyCss = require('gulp-clean-css') // 压缩css
const uglify = require('gulp-uglify') // 压缩js
const babel = require('gulp-babel'); // 转es6
const connect = require('gulp-connect'); // serve
const runSequence = require('run-sequence')// 同步执行文件
const concat = require('gulp-concat'); // 合并文件
const clean = require('gulp-clean') // 删除文件
const rename = require('gulp-rename') // 重命名
const open = require('open') // 自动打开窗口
const gulpif = require('gulp-if') // 用于判断是否执行
const logColor = require('./log-color') // console.log颜色
const imagemin = require('gulp-imagemin') // 压缩图片
// 设置环境变量
const env = process.env.NODE_ENV || 'dev'

gulp.task('start', function () {
	logColor('cyan', 'gulp start!')
})

// html
gulp.task('html', function () {
	return gulp.src(['src/views/**/*.html', 'src/components/**/*.html'])
		.pipe(
			htmltpl({
				tag: 'component',
				paths: ['src/components'],
				engine: function(template, data) {
					return template && artTemplate.compile(template)(data)
				},
				// 传入页面的初始化数据
				data: {
					env: env, // 环境变量
					header: false
				}
			})
		)
		.pipe(
			gulpif(
				env === 'prod',
				minifyHtml()
			)
		)
		.pipe(gulp.dest('dist/'))
		.pipe(connect.reload())
})

// scss to css
gulp.task('scss', function () {
	return gulp.src(['src/style/**/*.scss', '!src/style/lib/*'])
		.pipe(sass())
		.pipe(gulp.dest('src/style'))
})

gulp.task('lib-css', function() {
	return gulp.src('src/style/lib/*')
		.pipe(gulp.dest('dist/css/lib'))
})

// css
gulp.task('css', ['scss', 'lib-css'], function () {
	return gulp.src(['src/style/**/*.css', '!src/style/lib/*'])
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(
			gulpif(
				env === 'prod',
				minifyCss({ compatibility: 'ie8' })
			)
		)
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload())
})

gulp.task('lib-js', function () {
	return gulp.src('src/javascript/lib/*')
		.pipe(gulp.dest('dist/js/lib'))
})

gulp.task('js', ['lib-js'], function () {
	return gulp.src(['src/javascript/**/*.js', '!src/javascript/lib/*'])
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('index.js'))
		.pipe(
			gulpif(
				env === 'prod',
				uglify()
			)
		)
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload())
})

gulp.task('image', function() {
	return gulp.src('src/image/**/*.{jpg,png,jpeg,gif,svg}')
	.pipe(
		imagemin({
			optimizationLevel: 5, // 取值范围：0-7（优化等级），默认：3
			progressive: true, // 无损压缩jpg图片，默认：false
			interlaced: true, // 隔行扫描gif进行渲染，默认：false
			multipass: true // 多次优化svg直到完全优化，默认：false
		})
	)
	.pipe(gulp.dest('dist/image'))
})

// 监听
gulp.task('watch', function () {
	gulp.watch('src/**/*.html', ['html'])
	gulp.watch('src/style/**.{css,scss,less}', ['css'])
	gulp.watch('src/javascript/**/*.js', ['js'])
	gulp.watch('src/image/**/*.{jpg,png,jpeg,gif,svg}', ['image'])
})

// 开启服务
gulp.task('serve', function () {
	const port = 2333
	connect.server({
		root: 'dist',
		host: 'localhost',
		livereload: true,
		port
	});
	open(`http://localhost:${port}/`)
})

// clean 删除dist
gulp.task('clean', function () {
	return gulp.src('dist', {
			read: false
		})
		.pipe(clean())
})

gulp.task('finish', function() {
	connect.reload()
	logColor('blueBG', `当前环境: ${env}`)
})

// 防止一边删除一边生成bug
// gulp.task('default', ['clean'], function() {
// 	gulp.start('serve', 'css', 'js', 'html', 'watch', 'reload')
// })
gulp.task('default', function (cb) {
	runSequence(
		['start', 'clean'],
		['serve', 'css', 'js', 'image', 'html', 'watch'],
		['finish'],
		cb
	)
})