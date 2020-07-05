使用gulp搭建html脚手架

注意：使用cnpm 安装，gulp-imagemin 安装会报错（待检查）

gulp使用3.9.1版本

将src下文件 根据环境判断是否压缩

使用插件：
  > 
	cross-env // 添加环境变量  
	gulp-sourcemaps // 用于报错查看  
	gulp-html-tpl // 引用html模板  
	art-template // 模板渲染  
	gulp-html-minify // 压缩html  
	gulp-sass // sass  
	gulp-autoprefixer // css标识  
	gulp-clean-css // 压缩css  
	gulp-uglify // 压缩js  
	gulp-babel // 转es6  
	gulp-connect // serve  
	run-sequence// 同步执行文件  
	gulp-concat // 合并文件  
	gulp-clean // 删除文件  
	gulp-rename // 重命名  
	open // 自动打开窗口  
	gulp-if // 用于判断是否执行  
	gulp-imagemin // 压缩图片
