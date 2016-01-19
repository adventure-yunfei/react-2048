// This is an example to use assert in js
import __assert__ from 'js-assert/__assert__';
const a = 1, b = 2;
__assert__(a === b, '"a" should equal to "b"!');

// This is an example to require styles file (scss/sass/css)
import './test.css';
import './test.scss';

// This is an example to require image in js (it may be directly base64 encode string, or just a url)
import './test.png';

export default 'src main and bundle entry file, change it as you want';
