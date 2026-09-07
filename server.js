const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load products and categories data
let products = [];
let categories = [];

try {
  const productsRaw = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
  products = JSON.parse(productsRaw);
} catch (e) {
  console.error('Warning: could not load products.json', e.message);
}

try {
  const categoriesRaw = fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf8');
  categories = JSON.parse(categoriesRaw);
} catch (e) {
  console.error('Warning: could not load categories.json', e.message);
}

// Static assets (no-cache for instant live updates)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// API Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// GET /api/products
app.get('/api/products', (req, res) => {
  let result = [...products];
  const { category, brand, sale, minPrice, maxPrice, sort, limit, page = 1 } = req.query;

  if (category && category !== 'all') {
    const catLower = category.toLowerCase();
    result = result.filter(p =>
      (p.category && p.category.toLowerCase().includes(catLower)) ||
      (p.variant && p.variant.toLowerCase().includes(catLower)) ||
      (p.title && p.title.toLowerCase().includes(catLower))
    );
  }

  if (brand) {
    result = result.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (sale === 'true' || sale === '1') {
    result = result.filter(p => Boolean(p.discount) || p.oldPrice > p.price);
  }

  if (minPrice) {
    result = result.filter(p => p.price >= parseInt(minPrice, 10));
  }

  if (maxPrice) {
    result = result.filter(p => p.price <= parseInt(maxPrice, 10));
  }

  // Sorting
  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'popular') {
    result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }

  const total = result.length;
  if (limit) {
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const start = (pageNum - 1) * limitNum;
    result = result.slice(start, start + limitNum);
  }

  res.json({
    total,
    page: parseInt(page, 10),
    count: result.length,
    products: result
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => String(p.id) === String(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// GET /api/search
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json([]);
  }

  const matches = products.filter(p => {
    return (
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.variant && p.variant.toLowerCase().includes(query)) ||
      (p.info && p.info.toLowerCase().includes(query)) ||
      (p.id && p.id.includes(query))
    );
  }).slice(0, 10);

  res.json(matches);
});

// POST /api/order
app.post('/api/order', (req, res) => {
  const { name, phone, email, address, items, total } = req.body;
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  console.log(`[ORDER] New order #${orderId} received:`, {
    customer: { name, phone, email, address },
    itemsCount: items ? items.length : 0,
    total
  });

  res.status(201).json({
    success: true,
    orderId,
    message: 'Заказ успешно оформлен! Наш менеджер свяжется с вами в течение 10 минут.'
  });
});

// Client Page Routes
app.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'catalog.html'));
});

app.get('/goods/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/sale', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'catalog.html'));
});

// Fallback for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Intimo clone server running on http://0.0.0.0:${PORT}`);
});
