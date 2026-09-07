const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(dest);
      });
    }).on('error', reject);
  });
}

async function run() {
  const cssDir = path.join(__dirname, '..', 'public', 'assets', 'css');
  fs.mkdirSync(cssDir, { recursive: true });

  const cssUrl = 'https://www.intimo.com.ua/assets/_csscomp_p1.1788532227.css';
  const destPath = path.join(cssDir, 'intimo.css');

  console.log(`Downloading CSS from ${cssUrl}...`);
  try {
    await downloadFile(cssUrl, destPath);
    console.log(`Saved CSS to ${destPath} (${fs.statSync(destPath).size} bytes)`);
  } catch (err) {
    console.error('Download error:', err.message);
  }
}

run();
