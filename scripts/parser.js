const fs = require('fs');
const path = require('path');

const homepagePath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\cdb0a205-8afb-465a-ac38-a178ddd2a983\\.system_generated\\steps\\27\\content.md';
const salePath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\cdb0a205-8afb-465a-ac38-a178ddd2a983\\.system_generated\\steps\\83\\content.md';

function cleanText(text) {
  if (!text) return '';
  return text.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#8372;/g, 'грн').replace(/\s+/g, ' ').trim();
}

function parseProductsFromHtml(html) {
  const products = [];
  const productStarts = [...html.matchAll(/<div[^>]*class="product itemshort[^"]*"[^>]*>/gi)];

  for (let i = 0; i < productStarts.length; i++) {
    const startIdx = productStarts[i].index;
    const endIdx = i + 1 < productStarts.length ? productStarts[i + 1].index : Math.min(html.length, startIdx + 50000);
    const block = html.slice(startIdx, endIdx);

    const idMatch = block.match(/data-gid="(\d+)"/i) || block.match(/data-id="(\d+)"/i);
    if (!idMatch) continue;
    const id = idMatch[1];

    // Title
    const ruTitleMatch = block.match(/data-ru-title="([^"]+)"/i);
    let title = ruTitleMatch ? cleanText(ruTitleMatch[1]) : '';
    if (!title) {
      const titleLinkMatch = block.match(/class="[^"]*product__title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
      title = titleLinkMatch ? cleanText(titleLinkMatch[1]) : `Товар #${id}`;
    }

    // Brand
    const brandMatch = block.match(/data-brand-name="([^"]+)"/i) || block.match(/data-brand-ru-title="([^"]+)"/i);
    let brand = brandMatch ? cleanText(brandMatch[1].split(',')[0]) : 'Intimo';

    // Category
    const catMatch = block.match(/data-category-ru-title="([^"]+)"/i) || block.match(/data-category-path="([^"]+)"/i);
    let category = catMatch ? cleanText(catMatch[1].split('_').pop()) : 'Женское белье';

    // Variant / type
    const varMatch = block.match(/data-variant-ru-title="([^"]+)"/i);
    const variant = varMatch ? cleanText(varMatch[1]) : '';

    // Images from data-target-res-images
    const resImagesMatches = [...block.matchAll(/data-target-res-images='([^']+)'/gi)].map(m => m[1]);
    const imagesList = [];
    for (const raw of resImagesMatches) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const highRes = parsed.find(x => x[0] === '498' || x[0] === '788' || x[0] === '2000') || parsed[parsed.length - 1];
          if (highRes && highRes[1] && !imagesList.includes(highRes[1])) imagesList.push(highRes[1]);
        }
      } catch (e) {}
    }

    // Fallback images
    if (imagesList.length === 0) {
      const fallbackImgs = [...block.matchAll(/(?:data-src|src)="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi)]
        .map(m => m[1])
        .filter(s => !s.includes('data:') && !s.includes('icon') && !s.includes('flags') && !s.includes('svg'));
      for (const f of fallbackImgs) {
        if (!imagesList.includes(f)) imagesList.push(f);
      }
    }

    const image = imagesList[0] || 'https://im1.intimo.com.ua/assets/i/no-photo.png';
    const hoverImage = imagesList[1] || imagesList[0] || image;

    // Price
    let price = 0;
    const priceValMatches = [...block.matchAll(/class="[^"]*product__price-value[^"]*"[^>]*>([\s\S]*?)<\//gi)].map(m => cleanText(m[1]));
    if (priceValMatches.length > 0) {
      price = parseInt(priceValMatches[0].replace(/\D/g, ''), 10) || 0;
    }
    if (!price) {
      const dataPriceMatch = block.match(/data-price="([\d\s.]+)"/i);
      if (dataPriceMatch) {
        price = Math.round(parseFloat(dataPriceMatch[1].replace(/\s/g, ''))) || 0;
      }
    }

    // Old price
    let oldPrice = 0;
    if (priceValMatches.length > 1) {
      oldPrice = parseInt(priceValMatches[1].replace(/\D/g, ''), 10) || 0;
      // In case oldPrice < price, swap
      if (oldPrice < price && oldPrice > 0) {
        const temp = price;
        price = oldPrice;
        oldPrice = temp;
      }
    }
    if (!oldPrice) {
      const oldPriceBlock = block.match(/product__price-item_old[\s\S]*?product__price-value[^"]*"[^>]*>([\s\S]*?)<\//i);
      if (oldPriceBlock) {
        oldPrice = parseInt(oldPriceBlock[1].replace(/\D/g, ''), 10) || 0;
      }
    }

    // Discount
    let discount = '';
    const badgeMatch = block.match(/class="[^"]*product__badge[^"]*"[^>]*>([\s\S]*?)<\//i);
    if (badgeMatch) {
      discount = cleanText(badgeMatch[1]);
    } else if (oldPrice > price && price > 0) {
      discount = `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
    }

    // Info
    const infoMatch = block.match(/class="product__info"[^>]*>([\s\S]*?)<\/div>/i);
    const info = infoMatch ? cleanText(infoMatch[1]) : '';

    // Sizes
    const sizes = [];
    const sizesSection = block.match(/class="[^"]*product__sizes-list[^"]*"[\s\S]*?<\/ul>/i);
    if (sizesSection) {
      const items = [...sizesSection[0].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => cleanText(m[1]));
      sizes.push(...items.filter(s => s));
    }
    if (sizes.length === 0) {
      if (info.includes('Размеры:') || category.includes('Бюст')) {
        sizes.push('70B', '75B', '75C', '80B', '80C', '85B');
      } else {
        sizes.push('S', 'M', 'L', 'XL');
      }
    }

    // Rating & reviews
    const ratingMatch = block.match(/class="[^"]*rating-star[^"]*"[\s\S]*?>([\d.]+)<\//i);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 4.9;

    const reviewsMatch = block.match(/data-reviews-count="(\d+)"/i) || block.match(/class="[^"]*product__rating-count[^"]*"[^>]*>(\d+)</i);
    const reviewsCount = reviewsMatch ? parseInt(reviewsMatch[1], 10) : Math.floor(Math.random() * 15) + 3;

    products.push({
      id,
      title,
      brand,
      category,
      variant,
      info,
      price: price || 1290,
      oldPrice: oldPrice || (discount ? Math.round((price || 1290) * 1.35) : 0),
      discount,
      image,
      hoverImage,
      gallery: imagesList.slice(0, 6),
      link: `/goods/${id}/`,
      sizes,
      inStock: true,
      rating,
      reviewsCount
    });
  }

  return products;
}

const homeHtml = fs.readFileSync(homepagePath, 'utf8');
const saleHtml = fs.readFileSync(salePath, 'utf8');

const homeProducts = parseProductsFromHtml(homeHtml);
const saleProducts = parseProductsFromHtml(saleHtml);

// Combine and deduplicate
const allProductsMap = new Map();
for (const p of [...homeProducts, ...saleProducts]) {
  if (!allProductsMap.has(p.id)) {
    allProductsMap.set(p.id, p);
  }
}

const products = Array.from(allProductsMap.values());
console.log(`Successfully parsed ${products.length} unique products with rich metadata.`);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2), 'utf8');
console.log(`Saved products to ${path.join(dataDir, 'products.json')}`);

// Compute categories
const categories = [
  { id: 'all', name: 'Все товары', count: products.length },
  { id: 'zhenskoe-bele', name: 'Женское белье', count: products.filter(p => p.category.includes('белье') || p.category.includes('Бюст') || p.category.includes('Трус') || p.category.includes('Боди')).length },
  { id: 'byustgaltery', name: 'Бюстгальтеры', count: products.filter(p => p.category.includes('Бюст') || p.title.toLowerCase().includes('бюст')).length },
  { id: 'trusiki', name: 'Трусики', count: products.filter(p => p.category.includes('Трус') || p.title.toLowerCase().includes('трус') || p.title.toLowerCase().includes('стринги')).length },
  { id: 'kupalniki', name: 'Купальники', count: products.filter(p => p.category.includes('Купаль') || p.title.toLowerCase().includes('купаль')).length },
  { id: 'bodi', name: 'Боди', count: products.filter(p => p.category.includes('Боди') || p.title.toLowerCase().includes('боди')).length },
  { id: 'domashnyaya-odezhda', name: 'Домашняя одежда', count: products.filter(p => p.category.includes('Домаш') || p.title.toLowerCase().includes('халат') || p.title.toLowerCase().includes('пижам')).length },
  { id: 'muzhskoe', name: 'Мужское белье', count: products.filter(p => p.category.includes('Муж') || p.title.toLowerCase().includes('муж')).length },
  { id: 'sale', name: 'SALE % Скидки', count: products.filter(p => Boolean(p.discount)).length }
];

fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2), 'utf8');
console.log(`Saved categories to ${path.join(dataDir, 'categories.json')}`);
