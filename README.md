# ECMAScript 6 starter project

A starter project to embrace incoming es6 js.

# What it has?

- Babel es6 compiler to transform es6 source code to es5 code (babel es6 runtime polyfill provided)
- Webpack tuned to build one file bundle
- Auto-Produce es5 code output when using as npm package
- ESLint tuned to ensure better code style
- `__assert__` keyword to enable debug check, which is similar to java "assert"
- CSS/SCSS/SASS styles file requirement support
- Embed small images as base64 data directly into styles file

# How to use it

1. Download the code
2. Run "npm install"
3. Run "npm install gulp -g" to install gulp globally (if you haven't installed it yet)
3. Writing your es6 code as you wish - note "src/index.js" is the default bundle main file
4. When finish coding, run "gulp". It'll produce es5 output for each js file under "lib/", and the bundled file under "bundles/"

Other notes:

- When using as npm package, it's tuned to export compiled code under "lib/" and "bundles/". No need to manually compile es6 code
- When include CSS/SCSS/SASS requires, in the target bundle the style is already split out into separate .css file
- Running `gulp` default task is to produce production build. To get debug build and watch mode, run `gulp -d`.

# Changes Log

### [Latest](https://github.com/adventure-yunfei/es6-starter-project/tree/master)

- Add CSS/SCSS/SASS styles file requirement support
- Add image files requirement support (embedded small images directly as base64 data)

### [1.0.1](https://github.com/adventure-yunfei/es6-starter-project/compare/1.0.0...1.0.1)

- Add `__assert__` keyword to enable debug check
- Fix: add mising npm prepublish scripts and exported files config

### [1.0.0](https://github.com/adventure-yunfei/es6-starter-project/tree/1.0.0)
