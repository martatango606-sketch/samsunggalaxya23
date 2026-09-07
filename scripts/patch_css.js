const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'assets', 'css', 'intimo.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace relative urls with full CDN urls so icons and fonts load reliably
css = css.replace(/url\(\.\.\/i\//g, 'url(https://im1.intimo.com.ua/assets/i/');
css = css.replace(/url\(["']?i\//g, 'url(https://im1.intimo.com.ua/assets/i/');
css = css.replace(/url\(["']?f\//g, 'url(https://im1.intimo.com.ua/assets/f/');
css = css.replace(/url\(["']?\/assets\/i\//g, 'url(https://im1.intimo.com.ua/assets/i/');
css = css.replace(/url\(["']?\/assets\/f\//g, 'url(https://im1.intimo.com.ua/assets/f/');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('intimo.css asset paths updated to CDN.');
