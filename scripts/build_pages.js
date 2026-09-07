const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'categories.json'), 'utf8'));

function renderHeader(activePage = '') {
  return `
  <!-- Top Bar -->
  <div class="top-bar">
    <div class="top-bar__inner">
      <div class="top-bar__phones">
        <span>Киев: <strong>(044) 364-55-45</strong></span>
        <span>Бесплатно по Украине: <strong>0 800 200 745</strong></span>
        <span>Lifecell: <strong>(093) 309-91-88</strong></span>
        <span>Kyivstar: <strong>(067) 232-73-15</strong></span>
        <button class="top-bar__callback-btn" onclick="App.openCallback()">Перезвоните мне</button>
      </div>
      <div class="top-bar__meta">
        <span>Шоурум: г. Киев, ул. Князей Острожских, 46/2</span>
        <div class="lang-switch">
          <a href="/" class="active">RU</a> | <a href="/">UA</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Header -->
  <header class="site-header">
    <div class="header-main">
      <a href="/" class="header-logo">
        <img src="https://im1.intimo.com.ua/assets/i/intimo-logo.svg" alt="INTIMO.com.ua" onerror="this.src='https://im5.intimo.com.ua/assets/i/intimo-logo.png'">
      </a>

      <a href="/catalog" class="catalog-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        Каталог
      </a>

      <div class="search-box">
        <input type="text" id="headerSearch" class="search-box__input" placeholder="Поиск среди более 10 000 моделей белья...">
        <div class="search-box__icon">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div id="searchDropdown" class="search-results-dropdown"></div>
      </div>

      <div class="header-actions">
        <a href="/catalog" class="header-action-item">
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          <span>Избранное</span>
          <div id="favBadge" class="badge-count" style="display:none;">0</div>
        </a>

        <div class="header-action-item" onclick="App.openCart()">
          <svg viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span>Корзина</span>
          <div id="cartBadge" class="badge-count" style="display:none;">0</div>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="nav-bar">
      <div class="nav-bar__inner">
        <a href="/catalog?cat=zhenskoe-bele" class="nav-link ${activePage === 'zhenskoe' ? 'active' : ''}">Женщинам</a>
        <a href="/catalog?cat=byustgaltery" class="nav-link">Бюстгальтеры</a>
        <a href="/catalog?cat=trusiki" class="nav-link">Трусики</a>
        <a href="/catalog?cat=kupalniki" class="nav-link">Купальники</a>
        <a href="/catalog?cat=bodi" class="nav-link">Боди</a>
        <a href="/catalog?cat=domashnyaya-odezhda" class="nav-link">Домашняя одежда</a>
        <a href="/catalog?cat=muzhskoe" class="nav-link">Мужчинам</a>
        <a href="/catalog?sale=1" class="nav-link sale">SALE до -60%</a>
        <a href="/catalog" class="nav-link">Бренды</a>
      </div>
    </nav>
  </header>

  <!-- Promo alert strip -->
  <div class="promo-top-strip">
    <span>🔥 Весенняя распродажа белья и купальников со скидками до -60%! Бесплатная доставка от 1500 ₴</span>
    <a href="/catalog?sale=1">Смотреть скидки →</a>
  </div>
  `;
}

function renderFooter() {
  return `
  <!-- Benefits -->
  <section class="benefits-section">
    <div class="benefits-grid">
      <div class="benefit-item">
        <div class="benefit-item__icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div>
          <div class="benefit-item__title">Бесплатная доставка</div>
          <div class="benefit-item__desc">По Киеву и Украине от 1500 ₴</div>
        </div>
      </div>

      <div class="benefit-item">
        <div class="benefit-item__icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div class="benefit-item__title">100% Оригинал</div>
          <div class="benefit-item__desc">Только сертифицированные бренды</div>
        </div>
      </div>

      <div class="benefit-item">
        <div class="benefit-item__icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 14 14"/>
          </svg>
        </div>
        <div>
          <div class="benefit-item__title">Примерка перед покупкой</div>
          <div class="benefit-item__desc">Курьер подождет 15 минут</div>
        </div>
      </div>

      <div class="benefit-item">
        <div class="benefit-item__icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </div>
        <div>
          <div class="benefit-item__title">Обмен и возврат</div>
          <div class="benefit-item__desc">Легкий возврат в течение 14 дней</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="footer__inner">
      <div class="footer__grid">
        <div>
          <div class="footer__title">Интернет-магазин INTIMO</div>
          <p style="color: #cbbcc8; font-size: 14px; line-height: 1.6;">
            Крупнейший в Украине интернет-магазин брендового нижнего белья, купальников и домашней одежды. Работаем с 2002 года. Более 50 000 довольных клиентов.
          </p>
          <div style="margin-top: 15px; font-size: 13px; color: #a996a6;">
            г. Киев, ул. Князей Острожских, 46/2<br>
            Пн–Пт: 10:00–20:00, Сб–Вс: 10:00–17:00
          </div>
        </div>

        <div>
          <div class="footer__title">Покупателям</div>
          <ul class="footer__links">
            <li><a href="/catalog">Каталог товаров</a></li>
            <li><a href="/catalog?sale=1">Скидки и акции</a></li>
            <li><a href="#">Доставка и оплата</a></li>
            <li><a href="#">Примерка белья</a></li>
            <li><a href="#">Таблица размеров</a></li>
            <li><a href="#">Возврат и обмен</a></li>
          </ul>
        </div>

        <div>
          <div class="footer__title">О компании</div>
          <ul class="footer__links">
            <li><a href="#">О магазине INTIMO</a></li>
            <li><a href="#">Шоурум в Киеве</a></li>
            <li><a href="#">Отзывы покупателей</a></li>
            <li><a href="#">Блог о стиле и белье</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
        </div>

        <div>
          <div class="footer__title">Контакты и подписка</div>
          <div class="footer__contacts">
            <p>Бесплатно по Украине: <strong>0 800 200 745</strong></p>
            <p>Viber / Telegram: <strong>(093) 309-91-88</strong></p>
            <p>Email: <strong>info@intimo.com.ua</strong></p>
          </div>
          <div style="margin-top: 15px;">
            <div style="font-size: 13px; margin-bottom: 6px; color: #cbbcc8;">Получайте промокоды и закрытые распродажи:</div>
            <form class="footer__newsletter-form" onsubmit="event.preventDefault(); App.showToast('Спасибо за подписку! Промокод отправлен.');">
              <input type="email" required placeholder="Ваш email..." class="footer__newsletter-input">
              <button type="submit" class="footer__newsletter-btn">ОК</button>
            </form>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div>© 2002–2026 INTIMO. Все права защищены. Клон для Railway.</div>
        <div>
          <span style="margin-right: 15px;">Visa / Mastercard / Apple Pay / Google Pay</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- Cart Drawer -->
  <div id="cartOverlay" class="cart-drawer-overlay" onclick="App.closeCart()"></div>
  <div id="cartDrawer" class="cart-drawer">
    <div class="cart-drawer__header">
      <div class="cart-drawer__title">Корзина покупок</div>
      <button class="cart-drawer__close" onclick="App.closeCart()">✕</button>
    </div>
    <div id="cartDrawerBody" class="cart-drawer__body"></div>
    <div class="cart-drawer__footer">
      <div class="cart-total-row">
        <span>Итого к оплате:</span>
        <span id="cartDrawerTotal">0 ₴</span>
      </div>
      <button id="cartCheckoutBtn" class="cart-checkout-btn">Оформить заказ</button>
    </div>
  </div>

  <!-- Quick Buy Modal -->
  <div id="quickBuyModal" class="modal-overlay">
    <div class="modal-dialog">
      <button class="modal-close" onclick="App.closeQuickBuy()">✕</button>
      <h3 id="quickBuyTitle" class="modal-title">Быстрый заказ</h3>
      <p class="modal-desc">Оставьте ваш номер телефона, и наш консультант согласует доставку и размер.</p>
      <div style="margin-bottom: 16px; font-size: 15px; color: #be2c4b; font-weight: 700;" id="quickBuyPrice"></div>
      <form onsubmit="handleQuickBuySubmit(event)">
        <div class="form-group">
          <label>Ваше имя</label>
          <input type="text" id="quickBuyName" required placeholder="Мария" class="form-input">
        </div>
        <div class="form-group">
          <label>Номер телефона</label>
          <input type="tel" id="quickBuyPhone" required placeholder="+38 (0__) ___-__-__" class="form-input">
        </div>
        <div class="form-group">
          <label>Город / Адрес доставки</label>
          <input type="text" id="quickBuyAddress" placeholder="г. Киев, Новая Почта №12" class="form-input">
        </div>
        <button type="submit" class="btn-submit">Подтвердить заказ</button>
      </form>
    </div>
  </div>

  <!-- Callback Modal -->
  <div id="callbackModal" class="modal-overlay">
    <div class="modal-dialog">
      <button class="modal-close" onclick="App.closeCallback()">✕</button>
      <h3 class="modal-title">Заказать обратный звонок</h3>
      <p class="modal-desc">Мы перезвоним вам в течение 10 минут в рабочее время.</p>
      <form onsubmit="handleCallbackSubmit(event)">
        <div class="form-group">
          <label>Ваше имя</label>
          <input type="text" required placeholder="Имя" class="form-input">
        </div>
        <div class="form-group">
          <label>Телефон</label>
          <input type="tel" required placeholder="+38 (0__) ___-__-__" class="form-input">
        </div>
        <button type="submit" class="btn-submit">Жду звонка</button>
      </form>
    </div>
  </div>

  <script src="/assets/js/main.js"></script>
  <script>
    async function handleQuickBuySubmit(e) {
      e.preventDefault();
      const name = document.getElementById('quickBuyName').value;
      const phone = document.getElementById('quickBuyPhone').value;
      const address = document.getElementById('quickBuyAddress').value;

      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, address, items: App.cart, total: 0 })
        });
        const data = await res.json();
        App.closeQuickBuy();
        App.cart = [];
        App.saveCart();
        alert(data.message || 'Заказ успешно принят!');
      } catch (err) {
        alert('Заказ принят! Спасибо за покупку.');
        App.closeQuickBuy();
      }
    }

    function handleCallbackSubmit(e) {
      e.preventDefault();
      App.closeCallback();
      App.showToast('Заявка на звонок принята! Скоро наберем.');
    }
  </script>
  `;
}

function renderProductCard(p) {
  const safeP = JSON.stringify({
    id: p.id,
    title: p.title.replace(/"/g, '&quot;'),
    price: p.price,
    brand: p.brand,
    image: p.image
  }).replace(/"/g, '&quot;');

  return `
  <div class="product-card">
    <div class="product-card__image-wrap">
      ${p.discount ? `<div class="product-card__badge">${p.discount}</div>` : ''}
      <button class="product-card__favorite" data-id="${p.id}" onclick="App.toggleFavorite('${p.id}', this)" title="В избранное">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
      <a href="/goods/${p.id}/">
        <img class="product-card__image" src="${p.image}" alt="${p.title}" loading="lazy">
        <img class="product-card__image product-card__image_hover" src="${p.hoverImage}" alt="${p.title}" loading="lazy">
      </a>
    </div>
    <div class="product-card__body">
      <div class="product-card__brand">${p.brand}</div>
      <a href="/goods/${p.id}/" class="product-card__title" title="${p.title}">${p.title}</a>
      ${p.info ? `<div class="product-card__info">${p.info}</div>` : ''}
      <div class="product-card__sizes">
        ${p.sizes.slice(0, 4).map(s => `<span class="size-pill">${s}</span>`).join('')}
      </div>
      <div class="product-card__price-row">
        <span class="product-card__price">${p.price.toLocaleString()} ₴</span>
        ${p.oldPrice ? `<span class="product-card__old-price">${p.oldPrice.toLocaleString()} ₴</span>` : ''}
      </div>
      <div class="product-card__actions">
        <button class="btn-buy" onclick="App.addToCart(${safeP})">В корзину</button>
        <button class="btn-quick-buy" onclick="App.openQuickBuy(${safeP})">1 клик</button>
      </div>
    </div>
  </div>
  `;
}

// Generate Index Page
function buildIndexPage() {
  const popular = products.slice(0, 8);
  const newArrivals = products.slice(8, 16);
  const discounts = products.filter(p => p.discount || p.oldPrice > p.price).slice(0, 8);

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Женское белье 2026: купить нижнее белье Киев, Украина в INTIMO</title>
  <link rel="stylesheet" href="/assets/css/intimo.css">
  <link rel="stylesheet" href="/assets/css/custom.css">
  <link rel="icon" sizes="192x192" href="https://im1.intimo.com.ua/assets/i/app-icon-192x192.png">
  <link rel="shortcut icon" href="https://im1.intimo.com.ua/assets/i/favicon.png?v=4">
</head>
<body>
  ${renderHeader('home')}

  <!-- Hero Slider / Promo Grid -->
  <section class="hero-section">
    <div class="hero-grid">
      <div class="hero-banner-main" style="background-image: url('https://im1.intimo.com.ua/img/nb/1788249527_img_1_1_25_772_600x500.jpg');">
        <div class="hero-banner-main__content">
          <h1 class="hero-banner-main__title">Коллекция белья 2026</h1>
          <p class="hero-banner-main__subtitle">Европейское качество, идеальная посадка и нежнейшие материалы</p>
          <a href="/catalog?cat=zhenskoe-bele" class="btn-white">Перейти в каталог →</a>
        </div>
      </div>
      <div class="hero-banner-side">
        <div class="side-banner-item" style="background-image: url('https://im1.intimo.com.ua/img/nb/1786449972_img_1_1_23_768_498x747.jpg');">
          <div class="side-banner-item__content">
            <div class="side-banner-item__title">Купальники 2026</div>
            <a href="/catalog?cat=kupalniki" class="btn-white">Выбрать купальник →</a>
          </div>
        </div>
        <div class="side-banner-item" style="background-image: url('https://im1.intimo.com.ua/img/nb/1784284448_img_1_1_23_767_498x747_4.jpg');">
          <div class="side-banner-item__content">
            <div class="side-banner-item__title">Скидки до -60%</div>
            <a href="/catalog?sale=1" class="btn-white">В раздел SALE →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="categories-slider">
    <div class="categories-slider__title">Популярные категории</div>
    <div class="categories-grid">
      <a href="/catalog?cat=byustgaltery" class="cat-circle-card">
        <img class="cat-circle-card__img" src="https://im1.intimo.com.ua/images/goods/_47/95760/95760-11.jpg" alt="Бюстгальтеры">
        <div class="cat-circle-card__name">Бюстгальтеры</div>
      </a>
      <a href="/catalog?cat=trusiki" class="cat-circle-card">
        <img class="cat-circle-card__img" src="https://im1.intimo.com.ua/images/goods/_50/101288/273561-11.jpg" alt="Трусики">
        <div class="cat-circle-card__name">Трусики</div>
      </a>
      <a href="/catalog?cat=kupalniki" class="cat-circle-card">
        <img class="cat-circle-card__img" src="https://im1.intimo.com.ua/images/goods/_74/148692/148692-11.jpg" alt="Купальники">
        <div class="cat-circle-card__name">Купальники</div>
      </a>
      <a href="/catalog?cat=bodi" class="cat-circle-card">
        <img class="cat-circle-card__img" src="https://im1.intimo.com.ua/images/goods/_56/113762/113762-10.jpg" alt="Боди">
        <div class="cat-circle-card__name">Боди и корсеты</div>
      </a>
      <a href="/catalog?cat=domashnyaya-odezhda" class="cat-circle-card">
        <img class="cat-circle-card__img" src="https://im1.intimo.com.ua/img/nb/1786449884_img_2_1_25_768_600x500.jpg" alt="Одежда для дома">
        <div class="cat-circle-card__name">Домашняя одежда</div>
      </a>
      <a href="/catalog?cat=muzhskoe" class="cat-circle-card">
        <img class="cat-circle-card__img" src="https://im1.intimo.com.ua/img/nb/1780655886_img_1_1_23_756_498x747.jpg" alt="Мужское белье">
        <div class="cat-circle-card__name">Мужчинам</div>
      </a>
      <a href="/catalog?sale=1" class="cat-circle-card">
        <img class="cat-circle-card__img" src="https://im1.intimo.com.ua/img/nb/1717769142_bs_img_14_процент_40x40.png" alt="Скидки">
        <div class="cat-circle-card__name">SALE %</div>
      </a>
    </div>
  </section>

  <!-- Popular Products Section -->
  <section class="products-section">
    <div class="section-header">
      <div class="section-tabs">
        <button class="section-tab-btn active" onclick="showTab('popular', this)">Хиты продаж</button>
        <button class="section-tab-btn" onclick="showTab('new', this)">Новинки</button>
        <button class="section-tab-btn" onclick="showTab('sale', this)">Акции и скидки</button>
      </div>
      <a href="/catalog" class="section-view-all">Все товары →</a>
    </div>

    <div id="tabPopular" class="products-grid">
      ${popular.map(p => renderProductCard(p)).join('')}
    </div>
    <div id="tabNew" class="products-grid" style="display:none;">
      ${newArrivals.map(p => renderProductCard(p)).join('')}
    </div>
    <div id="tabSale" class="products-grid" style="display:none;">
      ${discounts.map(p => renderProductCard(p)).join('')}
    </div>
  </section>

  <!-- SEO / About Store Block -->
  <section class="products-section" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 12px; padding: 30px;">
    <h2 style="font-size: 22px; color: var(--color-dark); margin-top: 0; margin-bottom: 15px;">Купить женское нижнее белье в Киеве и Украине в магазине INTIMO</h2>
    <div style="font-size: 14px; line-height: 1.7; color: #555;">
      <p>Нижнее белье — это не просто предмет гардероба, а основа женской уверенности, комфорта и привлекательности. В интернет-магазине INTIMO представлен роскошный ассортимент качественного нижнего белья от ведущих мировых и украинских брендов: Nana, Anabel Arto, Aubade, Jolidon, Marc & André, Rosme и других.</p>
      <p>У нас вы можете легко подобрать и купить бюстгальтеры любых форм (push-up, балконет, мягкая чашка, планж), кружевные и бесшовные трусики, соблазнительные боди, стильные купальники, а также комфортную домашнюю одежду и пижамы.</p>
    </div>
  </section>

  ${renderFooter()}

  <script>
    function showTab(name, btn) {
      document.querySelectorAll('.section-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tabPopular').style.display = name === 'popular' ? 'grid' : 'none';
      document.getElementById('tabNew').style.display = name === 'new' ? 'grid' : 'none';
      document.getElementById('tabSale').style.display = name === 'sale' ? 'grid' : 'none';
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'index.html'), html, 'utf8');
  console.log('Built public/index.html');
}

// Generate Catalog Page
function buildCatalogPage() {
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Каталог нижнего белья и купальников | INTIMO</title>
  <link rel="stylesheet" href="/assets/css/intimo.css">
  <link rel="stylesheet" href="/assets/css/custom.css">
  <link rel="icon" sizes="192x192" href="https://im1.intimo.com.ua/assets/i/app-icon-192x192.png">
  <link rel="shortcut icon" href="https://im1.intimo.com.ua/assets/i/favicon.png?v=4">
  <style>
    .catalog-layout {
      max-width: 1320px;
      margin: 25px auto;
      padding: 0 15px;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 25px;
    }
    @media (max-width: 860px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }
      .catalog-sidebar {
        display: none;
      }
    }
    .catalog-sidebar {
      background: #fff;
      border: 1px solid var(--color-border);
      border-radius: 10px;
      padding: 20px;
      height: fit-content;
    }
    .filter-group {
      margin-bottom: 24px;
      border-bottom: 1px solid #f2e5e8;
      padding-bottom: 18px;
    }
    .filter-group:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .filter-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--color-dark);
      margin-bottom: 12px;
    }
    .filter-link {
      display: block;
      padding: 6px 0;
      color: #666;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }
    .filter-link:hover, .filter-link.active {
      color: var(--color-primary);
      font-weight: 600;
    }
    .catalog-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      background: #fff;
      border: 1px solid var(--color-border);
      padding: 12px 20px;
      border-radius: 8px;
    }
    .sort-select {
      padding: 8px 12px;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      outline: none;
      font-size: 14px;
    }
  </style>
</head>
<body>
  ${renderHeader('catalog')}

  <div class="catalog-layout">
    <!-- Sidebar Filters -->
    <aside class="catalog-sidebar">
      <div class="filter-group">
        <div class="filter-title">Категории</div>
        <a href="/catalog" class="filter-link" onclick="filterCategory('all', event)">Все товары</a>
        <a href="/catalog?cat=byustgaltery" class="filter-link" onclick="filterCategory('byustgaltery', event)">Бюстгальтеры</a>
        <a href="/catalog?cat=trusiki" class="filter-link" onclick="filterCategory('trusiki', event)">Трусики</a>
        <a href="/catalog?cat=kupalniki" class="filter-link" onclick="filterCategory('kupalniki', event)">Купальники</a>
        <a href="/catalog?cat=bodi" class="filter-link" onclick="filterCategory('bodi', event)">Боди и корсеты</a>
        <a href="/catalog?cat=domashnyaya-odezhda" class="filter-link" onclick="filterCategory('domashnyaya-odezhda', event)">Домашняя одежда</a>
        <a href="/catalog?cat=muzhskoe" class="filter-link" onclick="filterCategory('muzhskoe', event)">Мужское белье</a>
        <a href="/catalog?sale=1" class="filter-link" style="color: var(--color-primary); font-weight: 700;" onclick="filterCategory('sale', event)">🔥 SALE Скидки</a>
      </div>

      <div class="filter-group">
        <div class="filter-title">Диапазон цен (₴)</div>
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <input type="number" id="minPrice" placeholder="От" class="form-input" style="padding: 6px 8px; font-size: 13px;">
          <input type="number" id="maxPrice" placeholder="До" class="form-input" style="padding: 6px 8px; font-size: 13px;">
        </div>
        <button class="btn-buy" style="width: 100%; padding: 6px;" onclick="applyPriceFilter()">Применить</button>
      </div>
    </aside>

    <!-- Products Grid -->
    <main>
      <div class="catalog-topbar">
        <div>
          <span id="catalogCount" style="font-weight: 700; color: var(--color-dark); font-size: 18px;">Товары</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 13px; color: #666;">Сортировка:</span>
          <select id="sortSelect" class="sort-select" onchange="loadCatalog()">
            <option value="popular">По популярности</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>
      </div>

      <div id="catalogGrid" class="products-grid">
        ${products.slice(0, 24).map(p => renderProductCard(p)).join('')}
      </div>
    </main>
  </div>

  ${renderFooter()}

  <script>
    let currentCat = '';
    let isSale = false;

    function initCatalog() {
      const params = new URLSearchParams(window.location.search);
      currentCat = params.get('cat') || 'all';
      isSale = params.get('sale') === '1';
      loadCatalog();
    }

    function filterCategory(cat, e) {
      if (e) e.preventDefault();
      currentCat = cat;
      isSale = (cat === 'sale');
      loadCatalog();
    }

    function applyPriceFilter() {
      loadCatalog();
    }

    async function loadCatalog() {
      const min = document.getElementById('minPrice').value;
      const max = document.getElementById('maxPrice').value;
      const sort = document.getElementById('sortSelect').value;

      let url = \`/api/products?sort=\${sort}\`;
      if (currentCat && currentCat !== 'all' && currentCat !== 'sale') {
        url += \`&category=\${encodeURIComponent(currentCat)}\`;
      }
      if (isSale) {
        url += '&sale=1';
      }
      if (min) url += \`&minPrice=\${min}\`;
      if (max) url += \`&maxPrice=\${max}\`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const grid = document.getElementById('catalogGrid');
        document.getElementById('catalogCount').textContent = \`Найдено \${data.total} товаров\`;

        if (data.products.length === 0) {
          grid.innerHTML = \`<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #888;">
            <h3>По вашему запросу ничего не найдено</h3>
            <p>Попробуйте сбросить фильтры</p>
          </div>\`;
          return;
        }

        grid.innerHTML = data.products.map(p => {
          const safeP = JSON.stringify({
            id: p.id,
            title: p.title.replace(/"/g, '&quot;'),
            price: p.price,
            brand: p.brand,
            image: p.image
          }).replace(/"/g, '&quot;');

          return \`
          <div class="product-card">
            <div class="product-card__image-wrap">
              \${p.discount ? \`<div class="product-card__badge">\${p.discount}</div>\` : ''}
              <button class="product-card__favorite" data-id="\${p.id}" onclick="App.toggleFavorite('\${p.id}', this)" title="В избранное">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
              <a href="/goods/\${p.id}/">
                <img class="product-card__image" src="\${p.image}" alt="\${p.title}" loading="lazy">
                <img class="product-card__image product-card__image_hover" src="\${p.hoverImage}" alt="\${p.title}" loading="lazy">
              </a>
            </div>
            <div class="product-card__body">
              <div class="product-card__brand">\${p.brand}</div>
              <a href="/goods/\${p.id}/" class="product-card__title" title="\${p.title}">\${p.title}</a>
              \${p.info ? \`<div class="product-card__info">\${p.info}</div>\` : ''}
              <div class="product-card__sizes">
                \${p.sizes.slice(0, 4).map(s => \`<span class="size-pill">\${s}</span>\`).join('')}
              </div>
              <div class="product-card__price-row">
                <span class="product-card__price">\${p.price.toLocaleString()} ₴</span>
                \${p.oldPrice ? \`<span class="product-card__old-price">\${p.oldPrice.toLocaleString()} ₴</span>\` : ''}
              </div>
              <div class="product-card__actions">
                <button class="btn-buy" onclick="App.addToCart(\${safeP})">В корзину</button>
                <button class="btn-quick-buy" onclick="App.openQuickBuy(\${safeP})">1 клик</button>
              </div>
            </div>
          </div>
          \`;
        }).join('');
        App.updateFavoritesUI();
      } catch (err) {
        console.error(err);
      }
    }

    document.addEventListener('DOMContentLoaded', initCatalog);
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'catalog.html'), html, 'utf8');
  console.log('Built public/catalog.html');
}

// Generate Product Page
function buildProductPage() {
  const sample = products[0];

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title id="pageTitle">Купить нижнее белье в INTIMO</title>
  <link rel="stylesheet" href="/assets/css/intimo.css">
  <link rel="stylesheet" href="/assets/css/custom.css">
  <link rel="icon" sizes="192x192" href="https://im1.intimo.com.ua/assets/i/app-icon-192x192.png">
  <link rel="shortcut icon" href="https://im1.intimo.com.ua/assets/i/favicon.png?v=4">
  <style>
    .product-detail-layout {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 15px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    @media (max-width: 768px) {
      .product-detail-layout {
        grid-template-columns: 1fr;
      }
    }
    .gallery-main {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--color-border);
      background: #fff;
    }
    .gallery-main img {
      width: 100%;
      height: 580px;
      object-fit: cover;
      display: block;
    }
    .gallery-thumbs {
      display: flex;
      gap: 10px;
      margin-top: 14px;
      overflow-x: auto;
    }
    .gallery-thumb {
      width: 80px;
      height: 100px;
      border-radius: 6px;
      border: 2px solid transparent;
      cursor: pointer;
      overflow: hidden;
    }
    .gallery-thumb.active {
      border-color: var(--color-primary);
    }
    .gallery-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-info-panel {
      background: #fff;
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 30px;
    }
    .product-brand-tag {
      font-size: 14px;
      color: var(--color-primary);
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .product-h1 {
      font-size: 26px;
      color: var(--color-dark);
      font-weight: 700;
      margin: 0 0 14px;
      line-height: 1.3;
    }
    .price-box {
      display: flex;
      align-items: baseline;
      gap: 15px;
      margin: 20px 0;
      padding: 15px 0;
      border-top: 1px solid #f2e5e8;
      border-bottom: 1px solid #f2e5e8;
    }
    .price-main {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-primary);
    }
    .price-old {
      font-size: 18px;
      color: #999;
      text-decoration: line-through;
    }
    .size-selector {
      margin: 20px 0;
    }
    .size-selector label {
      display: block;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--color-dark);
    }
    .size-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .size-btn {
      padding: 8px 16px;
      border: 1px solid var(--color-border);
      background: #fff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .size-btn.active {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: #fff;
    }
    .product-actions-box {
      display: flex;
      gap: 14px;
      margin-top: 25px;
    }
    .product-actions-box .btn-buy {
      flex: 2;
      padding: 14px;
      font-size: 16px;
    }
    .product-actions-box .btn-quick-buy {
      flex: 1;
      padding: 14px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  ${renderHeader('product')}

  <div class="product-detail-layout">
    <!-- Gallery -->
    <div>
      <div class="gallery-main">
        <img id="mainImage" src="${sample.image}" alt="${sample.title}">
      </div>
      <div id="thumbsList" class="gallery-thumbs"></div>
    </div>

    <!-- Info Panel -->
    <div class="product-info-panel">
      <div id="productBrand" class="product-brand-tag">${sample.brand}</div>
      <h1 id="productTitle" class="product-h1">${sample.title}</h1>
      <div id="productCategory" style="font-size: 14px; color: #888; margin-bottom: 10px;">${sample.category} • ${sample.variant || 'Оригинал'}</div>

      <div class="price-box">
        <div id="productPrice" class="price-main">${sample.price.toLocaleString()} ₴</div>
        <div id="productOldPrice" class="price-old" style="display:${sample.oldPrice ? 'block' : 'none'};">${sample.oldPrice.toLocaleString()} ₴</div>
        <div id="productDiscount" class="product-card__badge" style="position:static; display:${sample.discount ? 'inline-block' : 'none'};">${sample.discount}</div>
      </div>

      <div class="size-selector">
        <label>Выберите размер:</label>
        <div id="sizesList" class="size-options"></div>
      </div>

      <div class="product-actions-box">
        <button id="buyBtn" class="btn-buy" onclick="addToCartCurrent()">В корзину</button>
        <button class="btn-quick-buy" onclick="quickBuyCurrent()">Купить в 1 клик</button>
      </div>

      <div style="margin-top: 30px; border-top: 1px solid #f2e5e8; padding-top: 20px;">
        <h4 style="margin: 0 0 10px; color: var(--color-dark);">Условия покупки</h4>
        <ul style="padding-left: 20px; font-size: 13px; color: #666; line-height: 1.8;">
          <li>Бесплатная доставка при заказе от 1500 ₴</li>
          <li>Примерка перед покупкой (Киев)</li>
          <li>Оплата при получении или онлайн картой</li>
          <li>100% гарантия подлинности бренда</li>
        </ul>
      </div>
    </div>
  </div>

  ${renderFooter()}

  <script>
    let currentProduct = null;
    let selectedSize = '';

    async function loadProduct() {
      // Get ID from pathname /goods/101288/
      const match = window.location.pathname.match(/\\/goods\\/(\\d+)/);
      const id = match ? match[1] : '${sample.id}';

      try {
        const res = await fetch('/api/products/' + id);
        if (!res.ok) throw new Error('Not found');
        currentProduct = await res.json();
      } catch (e) {
        currentProduct = ${JSON.stringify(sample)};
      }

      renderCurrent();
    }

    function renderCurrent() {
      document.title = currentProduct.title + ' | INTIMO';
      document.getElementById('productBrand').textContent = currentProduct.brand;
      document.getElementById('productTitle').textContent = currentProduct.title;
      document.getElementById('productPrice').textContent = currentProduct.price.toLocaleString() + ' ₴';

      if (currentProduct.oldPrice) {
        document.getElementById('productOldPrice').textContent = currentProduct.oldPrice.toLocaleString() + ' ₴';
        document.getElementById('productOldPrice').style.display = 'block';
      }
      if (currentProduct.discount) {
        document.getElementById('productDiscount').textContent = currentProduct.discount;
        document.getElementById('productDiscount').style.display = 'inline-block';
      }

      document.getElementById('mainImage').src = currentProduct.image;

      // Gallery thumbs
      const gallery = currentProduct.gallery && currentProduct.gallery.length > 0
        ? currentProduct.gallery
        : [currentProduct.image, currentProduct.hoverImage].filter(Boolean);

      const thumbsList = document.getElementById('thumbsList');
      thumbsList.innerHTML = gallery.map((img, i) => \`
        <div class="gallery-thumb \${i === 0 ? 'active' : ''}" onclick="switchImg('\${img}', this)">
          <img src="\${img}" alt="">
        </div>
      \`).join('');

      // Sizes
      const sizes = currentProduct.sizes || ['70B', '75B', '80B', 'S', 'M', 'L'];
      selectedSize = sizes[0];
      const sizesList = document.getElementById('sizesList');
      sizesList.innerHTML = sizes.map((s, i) => \`
        <button class="size-btn \${i === 0 ? 'active' : ''}" onclick="selectSize('\${s}', this)">\${s}</button>
      \`).join('');
    }

    function switchImg(url, thumb) {
      document.getElementById('mainImage').src = url;
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    }

    function selectSize(size, btn) {
      selectedSize = size;
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function addToCartCurrent() {
      if (!currentProduct) return;
      App.addToCart(currentProduct, selectedSize);
    }

    function quickBuyCurrent() {
      if (!currentProduct) return;
      App.openQuickBuy(currentProduct);
    }

    document.addEventListener('DOMContentLoaded', loadProduct);
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'product.html'), html, 'utf8');
  console.log('Built public/product.html');
}

buildIndexPage();
buildCatalogPage();
buildProductPage();
console.log('All pages built successfully!');
