import gulp from 'gulp';
import fetch from 'node-fetch';
import plumber from 'gulp-plumber';
import ejs from 'gulp-ejs';
import frontMatter from 'gulp-front-matter';
import wrapper from 'layout-wrapper';
import rename from 'gulp-rename';
import browser from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import del from 'del';
import fs from 'fs';
import webp from 'gulp-webp';
import merge from 'merge-stream';
import pathModule from 'path';
import { fileURLToPath } from 'url';
import gulpCached from 'gulp-cached';
import cssnano from 'cssnano';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import sortMediaQueries from 'postcss-sort-media-queries';
import dotenv from 'dotenv';
import open from 'open';

dotenv.config();

const theme_name = process.env.THEME_NAME;

const sass = gulpSass(dartSass);
const browserSync = browser.create();

// __dirname fix cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

// Cấu hình path
const path = {
  ejs: {
    layoutDir: `${__dirname}/src/layouts`,
    src: ['./src/**/*.ejs', '!./src/**/_*.ejs'],
    dist: './public/',
  },
  json: {
    package: './package.json',
  },
};

const rootFolder = pathModule.basename(process.cwd());

// Load dữ liệu JSON
const pkg = JSON.parse(fs.readFileSync(path.json.package, 'utf8'));



// Clean assets
function clean() {
  return del(['./public/assets/']);
}

// Hàm xử lý copy nhiều đích
function copyTo(src, ...dests) {
  let stream = gulp.src(src);
  dests.forEach(dest => {
    stream = stream.pipe(gulp.dest(dest));
  });
  return stream;
}

// CSS
function style() {
  const dests = [
    './public/assets/css'
  ];
  const processors = [
    sortMediaQueries({ sort: 'mobile-first' }),
    cssnano()
  ];

  return gulp.src(`./src/wp-content/themes/${theme_name}/assets/scss/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulpCached('linting'))
    .pipe(gulp.dest(dests[0]))
}

// SCSS
function scss() {
  const dests = ['./public/assets/scss'].filter(Boolean);
  return copyTo(`./src/wp-content/themes/${theme_name}/assets/scss/**/*.scss`, ...dests);
}

// JS
function scripts() {
  const dests = ['./public/assets/js'].filter(Boolean);;
  return copyTo(`./src/wp-content/themes/${theme_name}/assets/js/**/*.js`, ...dests);
}

// JS
function file() {
  const dests = ['./public'].filter(Boolean);;
  return copyTo([
  `./src/wp-content/themes/${theme_name}/**/*.+(php|png|jpg|scss|css|js|json)`,
  `!./src/wp-content/themes/${theme_name}/{assets,node_modules}/**`
], ...dests);
}

// Vender
function vender() {
  const dests = ['./public/assets/vender'].filter(Boolean);
  return copyTo(`./src/wp-content/themes/${theme_name}/assets/vender/**/*.+(php|png|jpg|scss|css|js)`, ...dests);
}

// Images
// function images() {
//   const dests = ['./public/assets/images',`./src/wp-content/themes/${theme_name}/assets/images`].filter(Boolean);
//   return copyTo(`./src/wp-content/themes/${theme_name}/assets/images/**/*.+(jpg|jpeg|png|gif|webp|svg|ico)`, ...dests);
// }

function images() {
  const dests = [
    './public/assets/images',
    `./src/wp-content/themes/${theme_name}/assets/images`
  ].filter(Boolean);

  // Ảnh gốc
  const originalImages = gulp.src(`./src/wp-content/themes/${theme_name}/assets/images-convert/**/*.+(gif|svg|ico|webp)`)
    .pipe(gulp.dest(dests[0]))
    .pipe(gulp.dest(dests[1]))

  // Convert sang WebP
  const webpImages = gulp.src(`./src/wp-content/themes/${theme_name}/assets/images-convert/**/*.+(jpg|jpeg|png)`)
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest(dests[0]))
    .pipe(gulp.dest(dests[1]))

  return merge(originalImages,webpImages);
}

// Videos
function videos() {
  const dests = ['./public/assets/videos'].filter(Boolean);
  return copyTo(`./src/wp-content/themes/${theme_name}/assets/videos/**/*.+(mp4|webm|ogg)`, ...dests);
}

function addUnlinkHandler(watcher, srcDir, distDirs = []) {
  watcher.on("unlink", (filepath) => {
    const filePathFromSrc = pathModule.relative(srcDir, filepath); // vd: "main/app.js"

    distDirs.forEach(distDir => {
      const destFilePath = pathModule.join(distDir, filePathFromSrc);
      del.sync(destFilePath);
      console.log(`🗑️ Deleted: ${destFilePath}`);
    });
  });
}


function addUnlinkHandler01(watcher, srcDir, distDir, options = {}) {
  watcher.on('unlink', (filepath) => {
    const filePathFromSrc = pathModule.relative(srcDir, filepath);
    let destFilePath = pathModule.join(distDir, filePathFromSrc);

    // Nếu là EJS thì đổi sang .html
    if (options.extReplace) {
      destFilePath = destFilePath.replace(/\.ejs$/, options.extReplace);
    }

    del.sync(destFilePath);
    console.log(`🗑️ Deleted: ${destFilePath}`);
  });
}

function addUnlinkHandler_img(watcher, srcDir, distDirs = []) {
  watcher.on("unlink", (filepath) => {
    const filePathFromSrc = pathModule.relative(srcDir, filepath);
    distDirs.forEach(distDir => {
      const destFilePath = pathModule.join(distDir, filePathFromSrc);
      if (fs.existsSync(destFilePath)) {
        del.sync(destFilePath);
        console.log(`🗑️ Deleted: ${destFilePath}`);
      }
      // Nếu là ảnh jpg/jpeg/png thì xóa luôn file webp cùng tên
      if (/\.(jpg|jpeg|png)$/i.test(destFilePath)) {
        const webpFile = destFilePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        if (fs.existsSync(webpFile)) {
          del.sync(webpFile);
          console.log(`🗑️ Deleted: ${webpFile}`);
        }
      }
      // Sau khi xóa file, thử xóa thư mục nếu rỗng
      const dirPath = pathModule.dirname(destFilePath);
      try {
        if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
          fs.rmdirSync(dirPath);
          console.log(`🗑️ Deleted empty folder: ${dirPath}`);
        }
      } catch (err) {
        // Nếu không xóa được (thư mục không rỗng), bỏ qua
      }
    });
  });
}

function addScssUnlinkHandler(watcher, srcDir, distDirs = []) {
  watcher.on("unlink", (filepath) => {
    const filePathFromSrc = pathModule.relative(srcDir, filepath); 
    const baseName = filePathFromSrc.replace(/\.scss$/, ""); // bỏ đuôi .scss

    distDirs.forEach(distDir => {
      const cssFile = pathModule.join(distDir, baseName + ".css");
      const mapFile = pathModule.join(distDir, baseName + ".css.map");

      del.sync([cssFile, mapFile]);
      console.log(`🗑️ Deleted: ${cssFile}, ${mapFile}`);
    });
  });
}


// PostCSS
function post_css() {
  const processors = [
    sortMediaQueries({ sort: 'mobile-first' }),
  ];
  return gulp.src(`./src/wp-content/themes/${theme_name}/assets/scss/*.scss`)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/assets/css'));
}

// Watch task
function watchFiles() {
  browserSync.init({
    open: false,
    notify: false,
    logSnippet: false,
    watch: true,
    port: 8080,
  });

  // SCSS

  const scssWatcher = gulp.watch(`./src/wp-content/themes/${theme_name}/assets/scss/**/*.scss`, gulp.parallel(style));
  const scssDestDirs = [
    pathModule.resolve('./public/assets/css'),
  ];

  addScssUnlinkHandler(
    scssWatcher,
    pathModule.resolve(`./src/wp-content/themes/${theme_name}/assets/scss`),
    scssDestDirs
  );
  
  // Vender
  const venderWatcher = gulp.watch(`./src/wp-content/themes/${theme_name}/assets/vender/**`, vender);
  addUnlinkHandler(venderWatcher, pathModule.resolve(`./src/wp-content/themes/${theme_name}/assets/vender`), [
    pathModule.resolve('./public/assets/vender')
  ].filter(Boolean));

  // Vender
  const fileWatcher = gulp.watch(`./src/wp-content/themes/${theme_name}/**`, file);
  addUnlinkHandler(fileWatcher, pathModule.resolve(`./src/wp-content/themes/${rootFolder}`), [
    pathModule.resolve('./public')
  ].filter(Boolean));

  // JS
  const jsWatcher = gulp.watch(`./src/wp-content/themes/${theme_name}/assets/js/**/*.js`, gulp.parallel(scripts));
  addUnlinkHandler(jsWatcher, pathModule.resolve(`./src/wp-content/themes/${theme_name}/assets/js`), [
    pathModule.resolve('./public/assets/js'),
  ].filter(Boolean));

  // Images
  const imgWatcher = gulp.watch(`./src/wp-content/themes/${theme_name}/assets/images/**`, images);
  addUnlinkHandler_img(imgWatcher, pathModule.resolve(`./src/wp-content/themes/${theme_name}/assets/images`), [
    pathModule.resolve('./public/assets/images')
  ].filter(Boolean));

  // Videos
  const videoWatcher = gulp.watch(`./src/wp-content/themes/${theme_name}/assets/videos/**`, videos);
  addUnlinkHandler(videoWatcher, pathModule.resolve(`./src/wp-content/themes/${theme_name}/assets/videos`), [
    pathModule.resolve('./public/assets/videos')
  ].filter(Boolean));


  // Reload
  gulp.watch(['./public/*.html', `./src/wp-content/themes/${theme_name}/assets/sass/**/*.scss`]).on('change', browserSync.reload);

  open(`${process.env.URL_SITE}`);
}

// Export
const build = gulp.series(
  clean,
  gulp.parallel(style, file, vender, scripts, images, videos )
);

export {
  style,
  file,
  scss,
  scripts,
  vender,
  images,
  videos,
  watchFiles as watch,
  post_css,
  build,
  clean,
};
