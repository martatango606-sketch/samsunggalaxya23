const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');

async function commitAll() {
  console.log('--- Initializing Git with isomorphic-git ---');
  await git.init({ fs, dir, defaultBranch: 'main' });

  // Configure remote
  console.log('--- Setting remote origin ---');
  try {
    await git.addRemote({
      fs,
      dir,
      remote: 'origin',
      url: 'https://github.com/martatango606-sketch/samsunggalaxya23.git',
      force: true
    });
  } catch (e) {
    console.log('Remote note:', e.message);
  }

  // Get list of all files in workspace recursively (excluding .git and node_modules)
  function getFiles(currentDir, baseDir = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const fullPath = path.join(currentDir, entry.name);
      const relPath = baseDir ? `${baseDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath, relPath));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }

  const filesToAdd = getFiles(dir);
  console.log(`Found ${filesToAdd.length} files to stage.`);

  for (const filepath of filesToAdd) {
    await git.add({ fs, dir, filepath });
  }
  console.log('All files added to staging index.');

  // Check status
  const author = {
    name: 'martatango606-sketch',
    email: 'martatango606@users.noreply.github.com'
  };

  const sha = await git.commit({
    fs,
    dir,
    author,
    message: 'Initial commit: 1:1 Intimo clone with Railway hosting configuration\n\n- Scraped and structured products catalog from intimo.com.ua\n- Responsive 1:1 layout with categories, hero banners, and products grid\n- Interactive cart, live search, quick order and modals\n- REST API with /api/products, /api/search, /api/order and /health\n- Railway configuration (Dockerfile, railway.json, Procfile)'
  });

  console.log(`Commit created successfully! SHA: ${sha}`);

  // Read log
  const commits = await git.log({ fs, dir, depth: 5 });
  console.log('\n--- Git Log ---');
  for (const c of commits) {
    console.log(`Commit: ${c.oid}`);
    console.log(`Author: ${c.commit.author.name} <${c.commit.author.email}>`);
    console.log(`Message: ${c.commit.message.split('\n')[0]}`);
  }
}

commitAll().catch(err => {
  console.error('Git error:', err);
  process.exit(1);
});
