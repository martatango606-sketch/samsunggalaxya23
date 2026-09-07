const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

async function push() {
  console.log('=== Git Push to origin/main ===');
  if (!token) {
    console.error('Ошибка: не указан токен доступа GitHub.');
    console.log('Использование: node scripts/git_push.js <ВАШ_GITHUB_TOKEN>');
    console.log('Или установите переменную окружения GITHUB_TOKEN.');
    process.exit(1);
  }

  console.log('Отправка коммитов в https://github.com/martatango606-sketch/samsunggalaxya23...');
  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      force: true,
      onAuth: () => ({
        username: token,
        password: ''
      })
    });
    console.log('Успешно отправлено в репозиторий!', pushResult);
  } catch (err) {
    console.error('Ошибка при отправке:', err.message);
    if (err.data && err.data.response) {
      console.error('Ответ сервера GitHub:', err.data.response);
    }
    process.exit(1);
  }
}

push();
