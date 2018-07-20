# Gulp-WEB
Gulp сборка для верстальщика


Gulp-WEB_V1.6


Добавлена возможность создавать svg-спрайты.
Для создания спрайта используем:
- gulp-svg-sprite - создание спрайта
- gulp-svgmin - минификация SVG
- gulp-cheerio - удаление лишних атрибутов из svg
- gulp-replace - фиксинг некоторых багов, об этом ниже
Для запуска создания спрайта используется команда- "svg".
Для пред просмотра svg спрайтов открыть sprite.symbol.html (app/img/svg/sprite/symbol/sprite.symbol.html)

Для решения проблемы кроссбраузерности есть библиотека svg4everybody.
Подключаем её и инициализируем:
 $(document).ready(function () {
    svg4everybody({});
 });

==============================================================================
Пакеты в сборке:
- less- Less пакет.
- browserSync.
- autoprefixer- библиотека для автоматического добавления префиксов.
- notify- cообщение об ошибках и предупреждениях об ошибках.
- plumber- предотвращает остановку GULP при ошибках.
- concat- для конкатенации файлов.
- uglify- для сжатия JS.
- cssnano- для минификации CSS.
- rename- для переименования файлов.
- del- для удаления файлов и папок.
- imagemin- библиотека для работы с изображениями.
- pngquant- библиотека для работы с png.
- cache- библиотека кеширования.
- gulp-svg-sprite - создание спрайта
- gulp-svgmin - минификация SVG
- gulp-cheerio - удаление лишних атрибутов из svg
- gulp-replace - фиксинг некоторых багов, об этом ниже
===============================================================================================================================

Команды:
- запуск проекта "gulp"
- создание svg-спрайтов "svg"
- подготовка к продакшену "build"

===============================================================================================================================
===============================================================================================================================
Gulp-WEB_V1.4
- внесены мелкие правки.

Пакеты в сборке:
- less- Less пакет.
- browserSync.
- autoprefixer- библиотека для автоматического добавления префиксов.
- notify- cообщение об ошибках и предупреждениях об ошибках.
- plumber- предотвращает остановку GULP при ошибках.
- concat- для конкатенации файлов.
- uglify- для сжатия JS.
- cssnano- для минификации CSS.
- rename- для переименования файлов.
- del- для удаления файлов и папок.
- imagemin- библиотека для работы с изображениями.
- pngquant- библиотека для работы с png.
- cache- библиотека кеширования.


================================================================================================================================

Gulp-WEB_V1.3

Внесены изменения:
- заменил Sass на Less.
- в папке css теперь минифицируются все файлы, а не только libs.css как было ранее.

Добавил:
- gulp-notify (Сообщения об ошибках и предупреждениях об ошибках)
- gulp-plumber (Предотвращает падение(зависание) Gulp при ошибках)


Примечание.
- Для использования Bower скопировать файл .bowerrc из архива bowerrc.rar в директорию проекта.
