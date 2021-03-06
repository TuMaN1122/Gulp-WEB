var gulp       		= require('gulp'), // Подключаем Gulp
	less 			= require('gulp-less'); //Подключаем Less пакет
	browserSync  	= require('browser-sync'), // Подключаем Browser Sync
	notify			= require('gulp-notify'),	//Сообщения об ошибках
	plumber			= require('gulp-plumber'),	//Предотвращает остановку GULP при ошибках
	concat       	= require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       	= require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      	= require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       	= require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          	= require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     	= require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     	= require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        	= require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer 	= require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
	svgSprite 		= require('gulp-svg-sprite'), //Создание спрайта
	svgmin 			= require('gulp-svgmin'), //Минификация SVG
	cheerio 		= require('gulp-cheerio'), //Удаление лишних атрибутов из svg
	replace 		= require('gulp-replace'); //Решаем баг когда символ ‘>’ преобразуется в кодировку '&gt;'. 

var appDir 			= 'app/';

gulp.task('less', function(){ // Создаем таск less
	return gulp.src(['app/less/main.less', 'app/less/libs.less']) // Берем источник
		
		.pipe(plumber({ 
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					message: err.massage
				}
			})
		})) //Предотвращает остановку GULP при ошибках

		.pipe(less()) // Преобразуем less в CSS посредством gulp-less
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/jquery/jquery-3.3.1.min.js', // Берем jQuery
		'app/libs/pagescroll2id/jquery.malihu.PageScroll2id.js',  // Берем плавная пракрутка
		'app/libs/svg4everybody/svg4everybody.js'
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['less'], function() {
	return gulp.src(['app/css/libs.css', 'app/css/main.css']) // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/less/**/*.less', ['less']); // Наблюдение за less файлами в папке less
	gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*.{png,jpg,svg}') // Берем все изображения из app
		// .pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			.pipe(cache(imagemin([
			    imagemin.gifsicle({interlaced: true}),
			    imagemin.jpegtran({progressive: true}),
			    imagemin.optipng({optimizationLevel: 3}),
			    imagemin.svgo({
			        plugins: [
			            {removeViewBox: true},
			            {cleanupIDs: false}
			        ]
	    		})
			])))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

// --------------------------------------------Создание SVG спрайтов


gulp.task('svg', function () {
	return gulp.src(appDir + 'img/svg/icons/*svg')
	// minify svg
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	// remove all fill and style declarations in out shapes
	.pipe(cheerio({
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: {xmlMode: true}
	}))
	// cheerio plugin create unnecessary string '&gt;', so replace it.
	.pipe(replace('&gt;', '>'))
	// build svg sprite
	.pipe(svgSprite({
		mode: {
			symbol: {
				sprite: "../sprite.svg",
				render: {
					less: {
						dest:'../_sprite.less',
						template: appDir + "less/iconsvg/_sprite_template.less"
					}
				},
				example: true
			}
		}
	}))
	.pipe(gulp.dest(appDir + 'img/svg/sprite/'));
});

gulp.task('build', ['clean', 'img', 'less', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		// 'app/css/main.css',
		// 'app/css/libs.min.css'
		'app/css/*.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
