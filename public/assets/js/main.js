// Main interactive JS for Intimo Clone

const App = {
  cart: [],
  favorites: [],

  init() {
    this.loadState();
    this.bindEvents();
    this.updateCartUI();
    this.updateFavoritesUI();
  },

  loadState() {
    try {
      this.cart = JSON.parse(localStorage.getItem('intimo_cart')) || [];
    } catch (e) {
      this.cart = [];
    }
    try {
      this.favorites = JSON.parse(localStorage.getItem('intimo_favs')) || [];
    } catch (e) {
      this.favorites = [];
    }
  },

  saveCart() {
    localStorage.setItem('intimo_cart', JSON.stringify(this.cart));
    this.updateCartUI();
  },

  saveFavorites() {
    localStorage.setItem('intimo_favs', JSON.stringify(this.favorites));
    this.updateFavoritesUI();
  },

  addToCart(product, size = 'M') {
    const existing = this.cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        brand: product.brand,
        size: size,
        qty: 1
      });
    }
    this.saveCart();
    this.showToast(`«${product.title}» добавлен в корзину!`);
    this.openCart();
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
  },

  updateQty(index, delta) {
    if (!this.cart[index]) return;
    this.cart[index].qty += delta;
    if (this.cart[index].qty <= 0) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
  },

  toggleFavorite(productId, buttonElem) {
    const idx = this.favorites.indexOf(String(productId));
    if (idx > -1) {
      this.favorites.splice(idx, 1);
      if (buttonElem) buttonElem.classList.remove('is-active');
      this.showToast('Удалено из избранного');
    } else {
      this.favorites.push(String(productId));
      if (buttonElem) buttonElem.classList.add('is-active');
      this.showToast('Добавлено в избранное ❤️');
    }
    this.saveFavorites();
  },

  updateCartUI() {
    const count = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }

    const drawerBody = document.getElementById('cartDrawerBody');
    const drawerTotal = document.getElementById('cartDrawerTotal');

    if (drawerTotal) {
      drawerTotal.textContent = total.toLocaleString() + ' ₴';
    }

    if (drawerBody) {
      if (this.cart.length === 0) {
        drawerBody.innerHTML = `
          <div style="text-align: center; padding: 40px 10px; color: #888;">
            <svg width="48" height="48" fill="none" stroke="#be2c4b" stroke-width="1.5" viewBox="0 0 24 24" style="margin-bottom: 12px;">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p style="font-size: 16px; font-weight: 600; color: #3b243a; margin-bottom: 6px;">Ваша корзина пуста</p>
            <p style="font-size: 13px;">Выберите товары из каталога или раздела новинок</p>
          </div>
        `;
      } else {
        drawerBody.innerHTML = this.cart.map((item, i) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item__info">
              <div class="cart-item__title">${item.title}</div>
              <div class="cart-item__size">Размер: ${item.size}</div>
              <div class="cart-item__price">${(item.price * item.qty).toLocaleString()} ₴</div>
            </div>
            <div class="cart-item__qty">
              <button onclick="App.updateQty(${i}, -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="App.updateQty(${i}, 1)">+</button>
            </div>
            <button class="cart-item__remove" onclick="App.removeFromCart(${i})" title="Удалить">✕</button>
          </div>
        `).join('');
      }
    }
  },

  updateFavoritesUI() {
    const favBadge = document.getElementById('favBadge');
    if (favBadge) {
      favBadge.textContent = this.favorites.length;
      favBadge.style.display = this.favorites.length > 0 ? 'flex' : 'none';
    }
    document.querySelectorAll('.product-card__favorite').forEach(btn => {
      const pid = btn.getAttribute('data-id');
      if (this.favorites.includes(String(pid))) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  },

  openCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('is-active');
      overlay.classList.add('is-active');
    }
  },

  closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('is-active');
      overlay.classList.remove('is-active');
    }
  },

  openQuickBuy(product) {
    const modal = document.getElementById('quickBuyModal');
    if (!modal) return;
    document.getElementById('quickBuyTitle').textContent = `Заказ: ${product.title}`;
    document.getElementById('quickBuyPrice').textContent = `${product.price.toLocaleString()} ₴`;
    modal.setAttribute('data-product-id', product.id);
    modal.classList.add('is-active');
  },

  closeQuickBuy() {
    const modal = document.getElementById('quickBuyModal');
    if (modal) modal.classList.remove('is-active');
  },

  openCallback() {
    const modal = document.getElementById('callbackModal');
    if (modal) modal.classList.add('is-active');
  },

  closeCallback() {
    const modal = document.getElementById('callbackModal');
    if (modal) modal.classList.remove('is-active');
  },

  showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  },

  bindEvents() {
    // Search input live handler
    const searchInput = document.getElementById('headerSearch');
    const searchDropdown = document.getElementById('searchDropdown');

    if (searchInput && searchDropdown) {
      let debounceTimeout = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        const query = e.target.value.trim();
        if (query.length < 2) {
          searchDropdown.classList.remove('is-open');
          return;
        }

        debounceTimeout = setTimeout(async () => {
          try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.length === 0) {
              searchDropdown.innerHTML = `<div style="padding: 14px; color: #888; text-align: center;">Ничего не найдено</div>`;
            } else {
              searchDropdown.innerHTML = data.map(item => `
                <a href="/goods/${item.id}/" class="search-result-item">
                  <img src="${item.image}" alt="${item.title}">
                  <div class="search-result-item__info">
                    <div class="search-result-item__title">${item.title}</div>
                    <div style="font-size: 11px; color: #888;">${item.brand} • ${item.category}</div>
                    <div class="search-result-item__price">${item.price.toLocaleString()} ₴</div>
                  </div>
                </a>
              `).join('');
            }
            searchDropdown.classList.add('is-open');
          } catch (err) {
            console.error(err);
          }
        }, 250);
      });

      // Close dropdown on click outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.remove('is-open');
        }
      });
    }

    // Checkout button handler in Cart
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          alert('Ваша корзина пуста!');
          return;
        }
        this.closeCart();
        const modal = document.getElementById('quickBuyModal');
        if (modal) {
          const total = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
          document.getElementById('quickBuyTitle').textContent = `Оформление заказа (${this.cart.length} поз.)`;
          document.getElementById('quickBuyPrice').textContent = `${total.toLocaleString()} ₴`;
          modal.classList.add('is-active');
        }
      });
    }
  }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
