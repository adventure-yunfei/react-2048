#!/usr/bin/env node

/* eslint-env node */
var child_process = require('child_process');

var cp = child_process.exec('./node_modules/gulp/bin/gulp.js eslint', function (error) {
    process.exit(error ? error.code : 0);
});

cp.stdout.pipe(process.stdout);
cp.stderr.pipe(process.stderr);
