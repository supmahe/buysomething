// ── Product data ──────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    quote: "Be the change you wish to see.",
    author: "Mahatma Gandhi",
    category: "motivation",
    price: 2.99,
    bg: "#2d3a3a",
  },
  {
    id: 2,
    quote: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    category: "hustle",
    price: 2.99,
    bg: "#3a2d2d",
  },
  {
    id: 3,
    quote: "Less, but better.",
    author: "Dieter Rams",
    category: "philosophy",
    price: 1.99,
    bg: "#2d2d3a",
  },
  {
    id: 4,
    quote: "Do it scared.",
    author: "Ruth Soukup",
    category: "motivation",
    price: 1.99,
    bg: "#2d3a32",
  },
  {
    id: 5,
    quote: "The obstacle is the way.",
    author: "Marcus Aurelius",
    category: "philosophy",
    price: 2.99,
    bg: "#3a352d",
  },
  {
    id: 6,
    quote: "You are enough.",
    author: "",
    category: "love",
    price: 1.99,
    bg: "#3a2d35",
  },
  {
    id: 7,
    quote: "Done is better than perfect.",
    author: "Sheryl Sandberg",
    category: "hustle",
    price: 2.99,
    bg: "#2d3838",
  },
  {
    id: 8,
    quote: "Choose joy.",
    author: "",
    category: "love",
    price: 0.99,
    bg: "#38302d",
  },
  {
    id: 9,
    quote: "Make it count.",
    author: "",
    category: "motivation",
    price: 0.99,
    bg: "#303838",
  },
  {
    id: 10,
    quote: "Silence is a source of great strength.",
    author: "Lao Tzu",
    category: "philosophy",
    price: 2.99,
    bg: "#2a2a2a",
  },
  {
    id: 11,
    quote: "Love deeply, live fully.",
    author: "",
    category: "love",
    price: 1.99,
    bg: "#3a2b2b",
  },
  {
    id: 12,
    quote: "Ship it.",
    author: "",
    category: "hustle",
    price: 0.99,
    bg: "#2b302d",
  },
];

// ── Cart state ─────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("ws_cart") || "[]");

function saveCart() {
  localStorage.setItem("ws_cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const existing = cart.find((i) => i.id === productId);
  if (existing) return; // digital goods: one copy per product
  const product = PRODUCTS.find((p) => p.id === productId);
  if (product) {
    cart.push({ id: product.id, qty: 1 });
    saveCart();
    renderCart();
    updateCartCount();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find((x) => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

// ── Render helpers ─────────────────────────────────────────────────
function renderProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map((p) => {
    const inCart = cart.some((i) => i.id === p.id);
    const hidden = filter !== "all" && p.category !== filter ? " hidden" : "";
    return `
      <article class="product-card${hidden}" data-id="${p.id}" data-category="${p.category}">
        <div class="card-poster" style="background:${p.bg}">
          <div>
            <p class="card-quote">"${p.quote}"</p>
            ${p.author ? `<p class="card-attribution">— ${p.author}</p>` : ""}
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <p class="card-category">${p.category}</p>
            <p class="card-price">$${p.price.toFixed(2)}</p>
          </div>
          <button
            class="add-btn${inCart ? " added" : ""}"
            data-id="${p.id}"
            aria-label="Add '${p.quote}' to cart"
          >${inCart ? "Added ✓" : "Add to cart"}</button>
        </div>
      </article>`;
  }).join("");

  // Attach add-to-cart listeners
  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id, 10);
      addToCart(id);
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      openCart();
    });
  });
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const footerEl = document.getElementById("cartFooter");
  const totalEl = document.getElementById("cartTotal");

  if (cart.length === 0) {
    itemsEl.innerHTML = "";
    emptyEl.hidden = false;
    footerEl.hidden = true;
    return;
  }

  emptyEl.hidden = true;
  footerEl.hidden = false;
  totalEl.textContent = `$${getCartTotal().toFixed(2)}`;

  itemsEl.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      if (!p) return "";
      return `
        <li class="cart-item" data-id="${p.id}">
          <div class="cart-item-swatch" style="background:${p.bg}">
            <span>${p.quote.slice(0, 20)}…</span>
          </div>
          <div class="cart-item-info">
            <p class="cart-item-title">"${p.quote}"</p>
            <p class="cart-item-price">$${p.price.toFixed(2)}</p>
          </div>
          <button class="cart-item-remove" data-id="${p.id}" aria-label="Remove from cart">✕</button>
        </li>`;
    })
    .join("");

  itemsEl.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(parseInt(btn.dataset.id, 10));
    });
  });
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  const total = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = total;
  countEl.classList.toggle("visible", total > 0);
}

// ── Cart drawer ────────────────────────────────────────────────────
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Checkout modal ─────────────────────────────────────────────────
function openCheckout() {
  closeCart();
  const summaryEl = document.getElementById("orderSummary");
  summaryEl.innerHTML =
    cart
      .map((item) => {
        const p = PRODUCTS.find((x) => x.id === item.id);
        if (!p) return "";
        return `<div class="order-summary-row">
          <span>"${p.quote.slice(0, 32)}…"</span>
          <span>$${p.price.toFixed(2)}</span>
        </div>`;
      })
      .join("") +
    `<div class="order-summary-row total">
      <span>Total</span>
      <span>$${getCartTotal().toFixed(2)}</span>
    </div>`;

  document.getElementById("stepForm").hidden = false;
  document.getElementById("stepSuccess").hidden = true;
  document.getElementById("emailInput").value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("emailError").hidden = true;
  document.getElementById("modalOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").hidden = true;
  document.body.style.overflow = "";
}

// ── Init ───────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  updateCartCount();

  // Cart open/close
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("continueShop").addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", openCheckout);

  // Modal close
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });

  // Done button resets and returns to shop
  document.getElementById("doneBtn").addEventListener("click", () => {
    closeModal();
    cart = [];
    saveCart();
    renderProducts(currentFilter);
    renderCart();
    updateCartCount();
  });

  // Filters
  let currentFilter = "all";
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(currentFilter);
    });
  });

  function applyFilter(filter) {
    document.querySelectorAll(".product-card").forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !match);
    });
  }

  // Checkout form
  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("emailInput");
    const emailError = document.getElementById("emailError");
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailVal)) {
      emailError.hidden = false;
      emailInput.focus();
      return;
    }
    emailError.hidden = true;

    // Simulate order placement
    document.getElementById("stepForm").hidden = true;
    document.getElementById("stepSuccess").hidden = false;
  });
});
