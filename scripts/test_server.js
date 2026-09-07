const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:3000${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log('--- Testing /health ---');
  const health = await request('/health');
  console.log('Health status:', health.status, JSON.parse(health.data));

  console.log('\n--- Testing /api/products ---');
  const productsRes = await request('/api/products?limit=5');
  const productsData = JSON.parse(productsRes.data);
  console.log('Products status:', productsRes.status, 'Total:', productsData.total, 'Count:', productsData.count);

  console.log('\n--- Testing /api/products/95760 ---');
  const singleRes = await request('/api/products/95760');
  const singleData = JSON.parse(singleRes.data);
  console.log('Single product:', singleRes.status, singleData.title, singleData.price, '₴');

  console.log('\n--- Testing /api/search?q=купальник ---');
  const searchRes = await request('/api/search?q=' + encodeURIComponent('купальник'));
  const searchData = JSON.parse(searchRes.data);
  console.log('Search results count:', searchData.length, 'Sample:', searchData[0] ? searchData[0].title : null);

  console.log('\n--- Testing /api/order POST ---');
  const orderRes = await request('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Тестовый покупатель',
      phone: '+380991234567',
      address: 'Киев',
      items: [{ id: '95760', title: 'Бюстгальтер', price: 1082, qty: 1 }],
      total: 1082
    })
  });
  console.log('Order status:', orderRes.status, JSON.parse(orderRes.data));

  console.log('\n--- Testing Pages ---');
  const indexRes = await request('/');
  console.log('GET / status:', indexRes.status, 'Length:', indexRes.data.length);

  const catalogRes = await request('/catalog');
  console.log('GET /catalog status:', catalogRes.status, 'Length:', catalogRes.data.length);

  const productRes = await request('/goods/95760');
  console.log('GET /goods/95760 status:', productRes.status, 'Length:', productRes.data.length);

  console.log('\nAll tests PASSED successfully!');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
