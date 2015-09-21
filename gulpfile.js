/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var gulp = require('gulp'),
  del = require('del'),
  watch = require('gulp-watch'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  debug = require('gulp-debug'),
  options = require('./cu-build.config');

var jsOutput, tsdOutput;
if (options.publish) {
  jsOutput = options.publish.jsOutput || './lib/js';
  tsdOutput = options.publish.tsdOutput || './lib/definitions';
} else {
  jsOutput = './lib/js';
  tsdOutput = './lib/definitions';
}

function javascript() {
  gulp.src('./src/*.js')
      .pipe(concat('main.js'))
      /* .pipe(uglify()) */
      .pipe(gulp.dest('./lib'))
      .pipe(debug({ title: 'output:' }));
}

function types() {
  gulp.src('./src/main.d.ts')
      .pipe(concat(options.name + '.d.ts'))
      .pipe(gulp.dest('./lib'))
      .pipe(debug({ title: 'output:' }));
}

function clean(cb) {
  del([jsOutput, tsdOutput], cb);
}

gulp.task('clean', clean);
gulp.task('javascript', ['clean'], javascript);
gulp.task('types', ['clean'], types);
gulp.task('publish', [ 'javascript', 'types', 'clean' ]);
gulp.task('default', [ 'publish' ]);
gulp.task('install');