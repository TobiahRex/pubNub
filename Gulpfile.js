"use strict";
const gulp        = require("gulp");
const concat      = require("gulp-concat");
const sass        = require("gulp-sass");
const sourcemaps  = require("gulp-sourcemaps");
const plumber     = require("gulp-plumber");
const nodemon     = require("gulp-nodemon");

gulp.task("default",    ["build", "watch", "serve"]);
gulp.task("watch",      ["watch.js", "watch.css", "watch.html"]);
gulp.task("build",      ["js", "css", "html"]);
gulp.task("watch.js",   ()=>{
  return gulp.watch("./app/js/**/*.js", ["js"])
});
gulp.task("watch.css",  ()=>{
  return gulp.watch("./app/css/**", ["css"]);
});
gulp.task("watch.html", ()=>{
  return gulp.watch("./app/html/**", ["html"]);
})
gulp.task("serve",      ()=>{
  nodemon({
    ignore : ["app", "public", "Gulpfile.js"]
  });
});
gulp.task("js",         ()=>{
  return gulp.src("./app/js/**/*.js")
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(concat("bundle.js"))
  .pipe(gulp.dest("./public/js"))
});
gulp.task("css",        ()=>{
  return gulp.src("./app/css/**/")
  .pipe(sass().on("error", sass.logError))
  .pipe(gulp.dest("./public/css"));
});
gulp.task("html",       ()=>{
  return gulp.src("./app/html/**/")
  .pipe(gulp.dest("./public/html"));
});
