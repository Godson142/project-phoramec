/* ==========================================================================
   PHORAMEC IMPORTS AVENUE - Core Application Script
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Initial Seed Data & Mock Products
// --------------------------------------------------------------------------
const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    title: "Premium Wool Winter Trench Coat",
    category: "clothes",
    price: 120.00,
    stockStatus: "In Stock",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-2",
    title: "Avenue Classic Italian Loafers",
    category: "shoes",
    price: 85.00,
    stockStatus: "In Stock",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-3",
    title: "PHORAMEC Smart Air Fryer 5.5L XL",
    category: "appliances",
    price: 149.99,
    stockStatus: "Pre-Order",
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-4",
    title: "RoboSweep Intelligent Vacuum Cleaner",
    category: "gadgets",
    price: 299.00,
    stockStatus: "In Stock",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-5",
    title: "MacBook Pro M3 Pro (16-inch, Space Black)",
    category: "laptops",
    price: 2499.00,
    stockStatus: "Pre-Order",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-6",
    title: "iPhone 15 Pro Max (256GB, Natural Titanium)",
    category: "phones",
    price: 1199.00,
    stockStatus: "In Stock",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-7",
    title: "Pro Charge 100W GaN Triple USB Fast Charger",
    category: "phones",
    price: 45.00,
    stockStatus: "In Stock",
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80"
  }
];

const CATEGORY_PLACEHOLDERS = {
  clothes: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600",
  shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
  appliances: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600",
  gadgets: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600",
  laptops: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=600",
  phones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
};

// --------------------------------------------------------------------------
// 2. Application State Management
// --------------------------------------------------------------------------
let state = {
  products: [],
  cart: [],
  requests: [],
  orders: [],
  activeCategory: "all",
  searchQuery: "",
  filterAvailability: "all",
  sortBy: "default",
  isAdminMode: false,
  currentTheme: "light",
  tourStepIndex: 0
};

// --------------------------------------------------------------------------
// 3. Initialization Pipeline
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadDataFromStorage();
  initEventListeners();
  renderAll();
});

// Load persistent data from browser localStorage
function loadDataFromStorage() {
  // Products Loading
  const storedProducts = localStorage.getItem("ph_products");
  if (storedProducts) {
    state.products = JSON.parse(storedProducts);
  } else {
    state.products = [...INITIAL_PRODUCTS];
    localStorage.setItem("ph_products", JSON.stringify(state.products));
  }

  // Cart Loading
  const storedCart = localStorage.getItem("ph_cart");
  if (storedCart) {
    state.cart = JSON.parse(storedCart);
  }

  // Custom Sourcing Requests Loading
  const storedRequests = localStorage.getItem("ph_custom_requests");
  if (storedRequests) {
    state.requests = JSON.parse(storedRequests);
  } else {
    // Seed one sample tracking request so dashboard doesn't look barren on load
    state.requests = [
      {
        id: "req-9901",
        itemName: "PlayStation 5 Pro Console (Dubai Edition)",
        category: "gadgets",
        budget: 699,
        description: "Need the official Sony Middle East bundle with dual controllers if possible.",
        imageSim: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600",
        date: "2026-06-25",
        statusStep: 2, // Quoted / Waiting Payment
        statusHistory: [
          { label: "Request Placed", date: "June 25, 2026", completed: true },
          { label: "Quoted", date: "June 26, 2026", completed: true },
          { label: "Procured", date: "", completed: false },
          { label: "Cleared", date: "", completed: false },
          { label: "Delivered", date: "", completed: false }
        ]
      }
    ];
    localStorage.setItem("ph_custom_requests", JSON.stringify(state.requests));
  }

  // Placed Orders Loading
  const storedOrders = localStorage.getItem("ph_orders");
  if (storedOrders) {
    state.orders = JSON.parse(storedOrders);
  } else {
    // Seed one sample standard order so dashboard doesn't look barren
    state.orders = [
      {
        id: "order-1011",
        customerName: "Godson Logah",
        customerPhone: "+233 24 123 4567",
        customerAddress: "Flat 4, Spintex Road, Accra",
        items: [
          { id: "prod-6", title: "iPhone 15 Pro Max (256GB, Natural Titanium)", price: 1199, qty: 1 }
        ],
        total: 1199,
        payChannel: "simulated",
        date: "2026-06-26",
        statusStep: 1, // Shipped from Source
        statusHistory: [
          { label: "Order Received", date: "June 26, 2026", completed: true },
          { label: "Shipped", date: "June 27, 2026", completed: true },
          { label: "In Customs", date: "", completed: false },
          { label: "Arrived Accra", date: "", completed: false },
          { label: "Delivered", date: "", completed: false }
        ]
      }
    ];
    localStorage.setItem("ph_orders", JSON.stringify(state.orders));
  }
}

// --------------------------------------------------------------------------
// 4. Dynamic Theme Configuration (System matching & Override)
// --------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem("ph_theme_pref");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  if (savedTheme) {
    state.currentTheme = savedTheme;
  } else if (prefersDark.matches) {
    state.currentTheme = "dark";
  } else {
    state.currentTheme = "light";
  }

  applyTheme();

  // Listen to system level preference updates
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("ph_theme_pref")) {
      state.currentTheme = e.matches ? "dark" : "light";
      applyTheme();
    }
  });
}

function applyTheme() {
  if (state.currentTheme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
  localStorage.setItem("ph_theme_pref", state.currentTheme);
}

function toggleTheme() {
  state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
  applyTheme();
}

// --------------------------------------------------------------------------
// 5. DOM Event Listeners & Actions
// --------------------------------------------------------------------------
function initEventListeners() {
  // Theme Switcher Click
  document.getElementById("theme-toggle-btn").addEventListener("click", toggleTheme);

  // Search Input live keyup
  const searchInput = document.getElementById("global-search");
  const clearSearchBtn = document.getElementById("clear-search-btn");

  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    if (state.searchQuery.length > 0) {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }
    renderStorefrontCatalog();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.style.display = "none";
    renderStorefrontCatalog();
  });

  // Category Selector Tabs
  document.getElementById("category-tabs-container").addEventListener("click", (e) => {
    const tab = e.target.closest(".category-tab");
    if (!tab) return;

    document.querySelectorAll(".category-tab").forEach(el => el.classList.remove("active"));
    tab.classList.add("active");

    state.activeCategory = tab.dataset.category;
    renderStorefrontCatalog();
  });

  // Filters selectors
  document.getElementById("filter-availability").addEventListener("change", (e) => {
    state.filterAvailability = e.target.value;
    renderStorefrontCatalog();
  });

  document.getElementById("sort-by").addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderStorefrontCatalog();
  });

  document.getElementById("reset-filters-btn").addEventListener("click", () => {
    document.getElementById("filter-availability").value = "all";
    document.getElementById("sort-by").value = "default";
    state.filterAvailability = "all";
    state.sortBy = "default";
    state.searchQuery = "";
    document.getElementById("global-search").value = "";
    clearSearchBtn.style.display = "none";
    
    document.querySelectorAll(".category-tab").forEach(tab => {
      if (tab.dataset.category === "all") tab.classList.add("active");
      else tab.classList.remove("active");
    });
    state.activeCategory = "all";
    renderStorefrontCatalog();
  });

  // Navigation Panel Views Switching (Store vs Admin)
  document.getElementById("admin-mode-toggle").addEventListener("click", toggleAdminMode);
  document.getElementById("logo-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (state.isAdminMode) {
      toggleAdminMode();
    }
  });

  // Custom Request Form Submission
  document.getElementById("custom-request-form").addEventListener("submit", handleCustomRequestSubmit);

  // Cart Drawer open/close triggers
  document.getElementById("cart-trigger-btn").addEventListener("click", () => toggleCartDrawer(true));
  document.getElementById("cart-close-btn").addEventListener("click", () => toggleCartDrawer(false));
  document.getElementById("cart-drawer-overlay").addEventListener("click", (e) => {
    if (e.target.id === "cart-drawer-overlay") toggleCartDrawer(false);
  });
  document.getElementById("cart-start-shopping").addEventListener("click", () => {
    toggleCartDrawer(false);
    document.getElementById("catalog-section").scrollIntoView();
  });

  // Proceed to Checkout Trigger
  document.getElementById("cart-checkout-btn").addEventListener("click", () => {
    toggleCartDrawer(false);
    toggleCheckoutModal(true);
  });

  // Checkout Modal triggers
  document.getElementById("checkout-close-btn").addEventListener("click", () => toggleCheckoutModal(false));
  document.getElementById("checkout-cancel-btn").addEventListener("click", () => toggleCheckoutModal(false));
  document.getElementById("checkout-modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "checkout-modal-overlay") toggleCheckoutModal(false);
  });
  document.getElementById("checkout-billing-form").addEventListener("submit", handleCheckoutSubmit);

  // Success Modal close
  document.getElementById("success-close-btn").addEventListener("click", () => {
    toggleSuccessModal(false);
    document.getElementById("tracking-section").scrollIntoView();
  });

  // Owner Admin: Product creation form
  document.getElementById("admin-upload-form").addEventListener("submit", handleAdminUploadSubmit);

  // Owner Admin: Inventory Search
  document.getElementById("inventory-search").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    renderAdminInventory(term);
  });

  // Help Guide Walkthrough Button Triggers
  document.getElementById("help-tour-btn").addEventListener("click", startHelpTour);
  document.getElementById("footer-tour-trigger").addEventListener("click", (e) => {
    e.preventDefault();
    startHelpTour();
  });
  document.getElementById("tour-skip-btn").addEventListener("click", endHelpTour);
  document.getElementById("tour-prev-btn").addEventListener("click", prevTourStep);
  document.getElementById("tour-next-btn").addEventListener("click", nextTourStep);

  // Footer navigation shortcuts
  document.querySelectorAll("[data-footer-cat]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (state.isAdminMode) toggleAdminMode();
      const targetCat = e.target.dataset.footer-cat;
      const matchingTab = Array.from(document.querySelectorAll(".category-tab")).find(tab => tab.dataset.category === targetCat);
      if (matchingTab) {
        matchingTab.click();
        document.getElementById("catalog-section").scrollIntoView();
      }
    });
  });

  document.getElementById("footer-admin-trigger").addEventListener("click", (e) => {
    e.preventDefault();
    if (!state.isAdminMode) toggleAdminMode();
    document.getElementById("main-header").scrollIntoView();
  });

  // Tracking Filter Tabs
  document.getElementById("track-tab-all").addEventListener("click", () => selectTrackTab("all"));
  document.getElementById("track-tab-standards").addEventListener("click", () => selectTrackTab("standards"));
  document.getElementById("track-tab-requests").addEventListener("click", () => selectTrackTab("requests"));
}

// --------------------------------------------------------------------------
// 6. View Rendering Managers
// --------------------------------------------------------------------------
function renderAll() {
  renderStorefrontCatalog();
  renderCart();
  renderTrackingDashboard();
  renderAdminWorkspace();
}

// Global View Switch Toggle (Admin / Customer)
function toggleAdminMode() {
  state.isAdminMode = !state.isAdminMode;
  const adminBtn = document.getElementById("admin-mode-toggle");
  const adminView = document.getElementById("admin-view");
  const customerView = document.getElementById("customer-view");

  if (state.isAdminMode) {
    adminBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
      <span>Customer View</span>
    `;
    adminBtn.classList.add("active");
    customerView.classList.remove("active");
    adminView.classList.add("active");
    renderAdminWorkspace();
  } else {
    adminBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
      <span>Admin Portal</span>
    `;
    adminBtn.classList.remove("active");
    adminView.classList.remove("active");
    customerView.classList.add("active");
    renderStorefrontCatalog();
    renderTrackingDashboard();
  }
}

// --------------------------------------------------------------------------
// 7. Storefront Catalog Logic
// --------------------------------------------------------------------------
function renderStorefrontCatalog() {
  const grid = document.getElementById("product-grid");
  const emptyState = document.getElementById("catalog-empty-state");
  const indicator = document.getElementById("results-count-indicator");

  // Filter Catalog Array based on criteria
  let filtered = state.products.filter(item => {
    // Category matches
    const catMatches = state.activeCategory === "all" || item.category === state.activeCategory;
    // Search query matches
    const searchMatches = !state.searchQuery || 
      item.title.toLowerCase().includes(state.searchQuery) || 
      item.category.toLowerCase().includes(state.searchQuery);
    // Availability Filter
    let availMatches = true;
    if (state.filterAvailability === "in-stock") {
      availMatches = item.stockStatus === "In Stock";
    } else if (state.filterAvailability === "pre-order") {
      availMatches = item.stockStatus === "Pre-Order";
    }

    return catMatches && searchMatches && availMatches;
  });

  // Sorting logic
  if (state.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "title-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Update results text
  indicator.textContent = `Found ${filtered.length} items`;

  // Render HTML Cards
  if (filtered.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    grid.style.display = "grid";
    grid.innerHTML = filtered.map(item => `
      <div class="product-card" id="card-${item.id}">
        <div class="product-image-container">
          <span class="product-cat-tag">${item.category}</span>
          <span class="product-stock-tag ${item.stockStatus === "In Stock" ? "in-stock" : "pre-order"}">${item.stockStatus}</span>
          <img src="${item.image || getCategoryPlaceholder(item.category)}" alt="${item.title}" referrerpolicy="no-referrer">
        </div>
        <div class="product-card-body">
          <h3 class="product-title">${item.title}</h3>
          <div class="product-price">$${item.price.toFixed(2)}</div>
          <button class="product-action-btn" onclick="addToCart('${item.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Add to Sourcing Cart
          </button>
        </div>
      </div>
    `).join("");
  }
}

function getCategoryPlaceholder(cat) {
  return CATEGORY_PLACEHOLDERS[cat] || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600";
}

// --------------------------------------------------------------------------
// 8. Shopping Cart Operations
// --------------------------------------------------------------------------
function toggleCartDrawer(open) {
  const overlay = document.getElementById("cart-drawer-overlay");
  if (open) {
    overlay.classList.add("active");
    renderCart();
  } else {
    overlay.classList.remove("active");
  }
}

window.addToCart = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  
  // Highlight badge with a quick scale up/down animation
  const badge = document.getElementById("cart-count");
  badge.style.transform = "scale(1.4)";
  setTimeout(() => {
    badge.style.transform = "scale(1)";
  }, 300);

  // Prompt drawer show briefly to show added item
  toggleCartDrawer(true);
};

function saveCart() {
  localStorage.setItem("ph_cart", JSON.stringify(state.cart));
}

function renderCart() {
  const container = document.getElementById("cart-items-container");
  const emptyView = document.getElementById("cart-empty-state");
  const footer = document.getElementById("cart-footer");
  const badgeCount = document.getElementById("cart-count");

  // Sum total items count and grand total cash
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCash = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update navbar badge
  badgeCount.textContent = totalQty;

  if (state.cart.length === 0) {
    container.style.display = "none";
    footer.style.display = "none";
    emptyView.style.display = "block";
  } else {
    emptyView.style.display = "none";
    container.style.display = "flex";
    footer.style.display = "block";

    container.innerHTML = state.cart.map(item => {
      const prodData = state.products.find(p => p.id === item.id) || {};
      const img = prodData.image || getCategoryPlaceholder(item.category);
      return `
        <div class="cart-item" id="cart-item-${item.id}">
          <div class="cart-item-img">
            <img src="${img}" alt="${item.title}" referrerpolicy="no-referrer">
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <span class="cart-item-category">${item.category}</span>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn minus" onclick="changeCartQty('${item.id}', -1)">&minus;</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn plus" onclick="changeCartQty('${item.id}', 1)">&plus;</button>
          </div>
          <button class="cart-item-delete" onclick="removeCartItem('${item.id}')" title="Delete from Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      `;
    }).join("");

    // Calculate sum totals labels
    document.getElementById("cart-summary-qty").textContent = `${totalQty} items`;
    document.getElementById("cart-summary-total").textContent = `$${totalCash.toFixed(2)}`;
  }
}

window.changeCartQty = function(productId, delta) {
  const item = state.cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeCartItem(productId);
    return;
  }

  saveCart();
  renderCart();
};

window.removeCartItem = function(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
};

// --------------------------------------------------------------------------
// 9. Checkout & Simulated Payment Gates
// --------------------------------------------------------------------------
function toggleCheckoutModal(open) {
  const overlay = document.getElementById("checkout-modal-overlay");
  if (open) {
    overlay.classList.add("active");
    // Feed Order details in modal header summary
    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const totalCash = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById("checkout-item-count").textContent = `${totalQty} items selected`;
    document.getElementById("checkout-total-price").textContent = `$${totalCash.toFixed(2)}`;
  } else {
    overlay.classList.remove("active");
  }
}

// Payment selectors click
document.querySelectorAll(".payment-option").forEach(el => {
  el.addEventListener("click", () => {
    document.querySelectorAll(".payment-option").forEach(p => p.classList.remove("active"));
    el.classList.add("active");
    el.querySelector("input").checked = true;
  });
});

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("chk-name").value.trim();
  const phone = document.getElementById("chk-phone").value.trim();
  const address = document.getElementById("chk-address").value.trim();
  const payChannel = document.querySelector('input[name="pay-channel"]:checked').value;

  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCash = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Generate a random order identification token
  const orderId = "order-" + Math.floor(1000 + Math.random() * 9000);

  // Create order item struct
  const newOrder = {
    id: orderId,
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    items: [...state.cart],
    total: totalCash,
    payChannel: payChannel,
    date: new Date().toISOString().split('T')[0],
    statusStep: 0, // Order Placed / Received
    statusHistory: [
      { label: "Order Received", date: getFormattedToday(), completed: true },
      { label: "Shipped from Depot", date: "", completed: false },
      { label: "In Customs Clearance", date: "", completed: false },
      { label: "Arrived at Accra Hub", date: "", completed: false },
      { label: "Delivered", date: "", completed: false }
    ]
  };

  // Push into orders database
  state.orders.unshift(newOrder);
  localStorage.setItem("ph_orders", JSON.stringify(state.orders));

  // Reset checkout card forms & Cart
  document.getElementById("checkout-billing-form").reset();
  state.cart = [];
  saveCart();
  renderCart();

  // Hide Checkout & Trigger Success Modal
  toggleCheckoutModal(false);
  toggleSuccessModal(true, newOrder);
}

function getFormattedToday() {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

function toggleSuccessModal(open, orderData = null) {
  const overlay = document.getElementById("success-modal-overlay");
  if (open) {
    overlay.classList.add("active");
    if (orderData) {
      const stubBtn = document.getElementById("whatsapp-send-btn");
      
      // WhatsApp message formatting
      const itemsList = orderData.items.map(it => `• ${it.title} (x${it.qty}) - $${(it.price * it.qty).toFixed(2)}`).join("%0A");
      const messageBody = `*PHORAMEC IMPORTS AVENUE - ORDER INVOICE*%0A%0A` +
        `*Order ID:* ${orderData.id}%0A` +
        `*Name:* ${orderData.customerName}%0A` +
        `*Phone:* ${orderData.customerPhone}%0A` +
        `*Address:* ${orderData.customerAddress}%0A%0A` +
        `*Items Ordered:*%0A${itemsList}%0A%0A` +
        `*Grand Total:* $${orderData.total.toFixed(2)}%0A` +
        `*Status:* Pending Sourcing Verification. Please approve locally!`;

      // Set click redirect on stub WhatsApp button
      stubBtn.onclick = () => {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=233241234567&text=${messageBody}`;
        window.open(whatsappUrl, '_blank');
      };
    }
  } else {
    overlay.classList.remove("active");
  }
}

// --------------------------------------------------------------------------
// 10. "Can't Find What You Need?" Custom Sourcing Submission
// --------------------------------------------------------------------------
function handleCustomRequestSubmit(e) {
  e.preventDefault();

  const itemName = document.getElementById("req-item-name").value.trim();
  const category = document.getElementById("req-category").value;
  const budget = parseFloat(document.getElementById("req-budget").value);
  const spec = document.getElementById("req-description").value.trim();
  const imageSim = document.getElementById("req-image-sim").value.trim();

  const reqId = "req-" + Math.floor(1000 + Math.random() * 9000);

  const newRequest = {
    id: reqId,
    itemName: itemName,
    category: category,
    budget: budget,
    description: spec,
    imageSim: imageSim || getCategoryPlaceholder(category),
    date: new Date().toISOString().split('T')[0],
    statusStep: 0, // Request Placed / Under Review
    statusHistory: [
      { label: "Request Placed", date: getFormattedToday(), completed: true },
      { label: "Review & Pricing", date: "", completed: false },
      { label: "Procured / Transit", date: "", completed: false },
      { label: "Customs Clearing", date: "", completed: false },
      { label: "Delivered & Fitted", date: "", completed: false }
    ]
  };

  // Insert to state requests
  state.requests.unshift(newRequest);
  localStorage.setItem("ph_custom_requests", JSON.stringify(state.requests));

  // Reset Sourcing form
  document.getElementById("custom-request-form").reset();

  // Scroll to tracker & update views
  renderTrackingDashboard();
  document.getElementById("tracking-section").scrollIntoView();

  // Feedback notifications alert
  showLocalNotification("Procurement Sourcing request successfully queued!");
}

function showLocalNotification(text) {
  // Simple floating alert
  const alertEl = document.createElement("div");
  alertEl.style.position = "fixed";
  alertEl.style.bottom = "24px";
  alertEl.style.left = "24px";
  alertEl.style.backgroundColor = "var(--primary-color)";
  alertEl.style.color = "var(--bg-secondary)";
  alertEl.style.padding = "14px 24px";
  alertEl.style.borderRadius = "var(--border-radius-sm)";
  alertEl.style.boxShadow = "var(--modal-shadow)";
  alertEl.style.zIndex = "999";
  alertEl.style.fontSize = "13.5px";
  alertEl.style.fontWeight = "600";
  alertEl.style.animation = "fadeIn 0.3s ease-out";
  alertEl.textContent = text;

  document.body.appendChild(alertEl);
  setTimeout(() => {
    alertEl.style.opacity = "0";
    alertEl.style.transform = "translateY(10px)";
    alertEl.style.transition = "all 0.4s ease";
    setTimeout(() => alertEl.remove(), 400);
  }, 3500);
}

// --------------------------------------------------------------------------
// 11. Customer Order Tracking Dashboard Rendering
// --------------------------------------------------------------------------
let activeTrackTab = "all";

function selectTrackTab(tab) {
  activeTrackTab = tab;
  document.querySelectorAll(".track-tab").forEach(el => el.classList.remove("active"));
  document.getElementById(`track-tab-${tab}`).classList.add("active");
  renderTrackingDashboard();
}

function renderTrackingDashboard() {
  const container = document.getElementById("tracking-list");
  const emptyView = document.getElementById("tracking-empty-state");

  // Filter based on selected tabs
  let renderedOrders = [...state.orders];
  let renderedRequests = [...state.requests];

  // Update tabs counter badges
  document.getElementById("track-count-all").textContent = state.orders.length + state.requests.length;
  document.getElementById("track-count-standards").textContent = state.orders.length;
  document.getElementById("track-count-requests").textContent = state.requests.length;

  let totalAvailable = 0;
  let html = "";

  if (activeTrackTab === "all" || activeTrackTab === "standards") {
    totalAvailable += renderedOrders.length;
    renderedOrders.forEach(order => {
      html += renderStandardOrderTimeline(order);
    });
  }

  if (activeTrackTab === "all" || activeTrackTab === "requests") {
    totalAvailable += renderedRequests.length;
    renderedRequests.forEach(req => {
      html += renderCustomRequestTimeline(req);
    });
  }

  if (totalAvailable === 0) {
    container.style.display = "none";
    emptyView.style.display = "block";
  } else {
    emptyView.style.display = "none";
    container.style.display = "flex";
    container.innerHTML = html;
  }
}

// Render regular checkouts timeline HTML
function renderStandardOrderTimeline(order) {
  const totalWidth = (order.statusStep / 4) * 100;
  
  const stepsHTML = order.statusHistory.map((step, idx) => {
    let stateClass = "";
    if (idx < order.statusStep) stateClass = "completed";
    else if (idx === order.statusStep) stateClass = "current";

    return `
      <div class="timeline-step ${stateClass}">
        <div class="step-node">${idx + 1}</div>
        <div class="step-label">
          ${step.label}
          ${step.date ? `<br><span style="font-size:9.5px; opacity:0.8; font-weight:normal;">${step.date}</span>` : ""}
        </div>
      </div>
    `;
  }).join("");

  const itemsString = order.items.map(it => `${it.title} (x${it.qty})`).join(", ");

  return `
    <div class="tracking-card">
      <div class="track-card-header">
        <div class="track-title-block">
          <h4>Standard Import Purchase</h4>
          <span class="track-id">ID: ${(order.id || "").toUpperCase()} • Sourced globally</span>
        </div>
        <div class="track-meta-block">
          <div class="track-price">$${order.total.toFixed(2)}</div>
          <span class="track-date">Placed on ${order.date}</span>
        </div>
      </div>
      
      <!-- Specifications items list -->
      <div class="track-specifications">
        <strong>Cart Items Sourced:</strong>
        <p>${itemsString}</p>
        <span style="font-size:11px; color:var(--text-tertiary); display:block; margin-top:8px;">
          Delivery to: <strong>${order.customerName}</strong> (${order.customerPhone}) — ${order.customerAddress}
        </span>
      </div>

      <!-- Timeline visual bar -->
      <div class="track-timeline-wrapper">
        <div class="track-timeline">
          <div class="timeline-progress-bar" style="width: calc(${totalWidth}% - 10px);"></div>
          ${stepsHTML}
        </div>
      </div>
    </div>
  `;
}

// Render concierge requests timeline HTML
function renderCustomRequestTimeline(req) {
  const totalWidth = (req.statusStep / 4) * 100;
  
  const stepsHTML = req.statusHistory.map((step, idx) => {
    let stateClass = "";
    if (idx < req.statusStep) stateClass = "completed";
    else if (idx === req.statusStep) stateClass = "current";

    return `
      <div class="timeline-step ${stateClass}">
        <div class="step-node">${idx + 1}</div>
        <div class="step-label">
          ${step.label}
          ${step.date ? `<br><span style="font-size:9.5px; opacity:0.8; font-weight:normal;">${step.date}</span>` : ""}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="tracking-card">
      <div class="track-card-header">
        <div class="track-title-block">
          <h4 style="color:var(--accent-color);">Custom Concierge Request</h4>
          <span class="track-id">ID: ${(req.id || "").toUpperCase()} • VIP Private Sourcing</span>
        </div>
        <div class="track-meta-block">
          <div class="track-price">$${req.budget.toFixed(2)} <span style="font-size:11px; font-weight:500; color:var(--text-tertiary);">Budget</span></div>
          <span class="track-date">Submitted on ${req.date}</span>
        </div>
      </div>
      
      <!-- Specifications details -->
      <div class="track-specifications" style="border-color: rgba(207, 164, 93, 0.3);">
        <strong>Item Description & Spec:</strong>
        <p><strong>${req.itemName}</strong></p>
        ${req.description ? `<p style="margin-top:4px; font-style:italic; font-size:12px;">"${req.description}"</p>` : ""}
      </div>

      <!-- Timeline visual bar -->
      <div class="track-timeline-wrapper">
        <div class="track-timeline">
          <div class="timeline-progress-bar" style="width: calc(${totalWidth}% - 10px);"></div>
          ${stepsHTML}
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 12. Owner/Admin Dashboard Workspaces
// --------------------------------------------------------------------------
function renderAdminWorkspace() {
  // Sum count badges
  document.getElementById("admin-stat-products").textContent = state.products.length;
  document.getElementById("admin-stat-requests").textContent = state.requests.filter(r => r.statusStep < 4).length;
  document.getElementById("admin-stat-orders").textContent = state.orders.filter(o => o.statusStep < 4).length;

  renderAdminInventory("");
  renderAdminSubmittedRequests();
  renderAdminCustomerOrders();
}

// Owner Admin: Sourcing requests list & cycles status updates
function renderAdminSubmittedRequests() {
  const container = document.getElementById("admin-requests-list");
  const emptyState = document.getElementById("admin-requests-empty");

  if (state.requests.length === 0) {
    container.style.display = "none";
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    container.style.display = "flex";

    container.innerHTML = state.requests.map(req => {
      const stepLabels = ["Request Placed", "Review & Pricing", "Procured / Transit", "Customs Clearing", "Delivered"];
      const currentLabel = stepLabels[req.statusStep] || "Completed";
      const nextLabel = stepLabels[req.statusStep + 1] || null;

      return `
        <div class="admin-list-card">
          <div class="admin-list-card-header">
            <div class="admin-card-client-info">
              <h5>Custom Request: ${req.itemName}</h5>
              <span class="client-tel">Submit date: ${req.date} • VIP Sourcing</span>
            </div>
            <span class="badge" style="background-color:var(--accent-color); color:#000;">ID: ${(req.id || "").toUpperCase()}</span>
          </div>

          <div class="admin-card-item-info">
            <strong>Estimated Client Budget:</strong> $${req.budget.toFixed(2)}<br>
            <strong>Specifications:</strong> ${req.description || "No spec notes."}
          </div>

          <div class="admin-card-actions">
            <div>
              <span class="admin-status-lbl" style="color:var(--primary-color);">Status: ${currentLabel}</span>
            </div>
            ${nextLabel ? `
              <button class="admin-cycle-btn" onclick="cycleRequestStatus('${req.id}')">
                Mark as "${nextLabel}"
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            ` : `<span class="badge completed" style="background-color:var(--success-bg); color:var(--success);">Completed & Sourced</span>`}
          </div>
        </div>
      `;
    }).join("");
  }
}

window.cycleRequestStatus = function(reqId) {
  const req = state.requests.find(r => r.id === reqId);
  if (!req) return;

  if (req.statusStep < 4) {
    req.statusStep += 1;
    req.statusHistory[req.statusStep].date = getFormattedToday();
    req.statusHistory[req.statusStep].completed = true;
    
    // Save
    localStorage.setItem("ph_custom_requests", JSON.stringify(state.requests));
    
    // Update displays
    renderAdminWorkspace();
    renderTrackingDashboard();
    showLocalNotification(`Sourcing request status successfully advanced!`);
  }
};

// Owner Admin: Customer standard checkout fulfillments management
function renderAdminCustomerOrders() {
  const container = document.getElementById("admin-orders-list");
  const emptyState = document.getElementById("admin-orders-empty");

  if (state.orders.length === 0) {
    container.style.display = "none";
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    container.style.display = "flex";

    container.innerHTML = state.orders.map(order => {
      const stepLabels = ["Order Received", "Shipped from Depot", "Customs Clearing", "Arrived Accra Hub", "Delivered"];
      const currentLabel = stepLabels[order.statusStep] || "Delivered";
      const nextLabel = stepLabels[order.statusStep + 1] || null;

      const itemsStr = order.items.map(it => `• ${it.title} (x${it.qty})`).join("<br>");

      return `
        <div class="admin-list-card">
          <div class="admin-list-card-header">
            <div class="admin-card-client-info">
              <h5>Invoice Stub: ${order.customerName}</h5>
              <span class="client-tel">WhatsApp: ${order.customerPhone} • ${order.date}</span>
            </div>
            <span class="badge">ID: ${(order.id || "").toUpperCase()}</span>
          </div>

          <div class="admin-card-item-info">
            <strong>Shipping Destination:</strong> ${order.customerAddress}<br>
            <strong>Payment Mode:</strong> Simulated (${(order.payChannel || "simulated").toUpperCase()})<br>
            <div style="margin-top:8px;"><strong>Cart Payload:</strong><br>${itemsStr}</div>
          </div>

          <div class="admin-card-actions">
            <div>
              <span class="admin-status-lbl" style="color:var(--primary-color);">Status: ${currentLabel}</span>
            </div>
            ${nextLabel ? `
              <button class="admin-cycle-btn" onclick="cycleOrderStatus('${order.id}')">
                Mark as "${nextLabel}"
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            ` : `<span class="badge completed" style="background-color:var(--success-bg); color:var(--success);">Fulfilled & Delivered</span>`}
          </div>
        </div>
      `;
    }).join("");
  }
}

window.cycleOrderStatus = function(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  if (order.statusStep < 4) {
    order.statusStep += 1;
    order.statusHistory[order.statusStep].date = getFormattedToday();
    order.statusHistory[order.statusStep].completed = true;

    // Save
    localStorage.setItem("ph_orders", JSON.stringify(state.orders));

    // Update displays
    renderAdminWorkspace();
    renderTrackingDashboard();
    showLocalNotification(`Order tracking stage advanced successfully!`);
  }
};

// Owner Admin: Render inventory tables & edit items
function renderAdminInventory(searchTerm = "") {
  const tbody = document.getElementById("admin-inventory-list");
  const countSpan = document.getElementById("admin-inventory-count");

  let filtered = state.products;
  if (searchTerm) {
    filtered = state.products.filter(p => 
      p.title.toLowerCase().includes(searchTerm) || 
      p.category.toLowerCase().includes(searchTerm)
    );
  }

  countSpan.textContent = `${filtered.length} items`;

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td><strong>${item.title}</strong></td>
      <td><span class="badge">${item.category}</span></td>
      <td><strong>$${item.price.toFixed(2)}</strong></td>
      <td>
        <span class="badge" style="background-color:${item.stockStatus === "In Stock" ? "var(--success-bg)" : "var(--warning-bg)"}; color:${item.stockStatus === "In Stock" ? "var(--success)" : "var(--warning)"}; font-weight:700;">
          ${item.stockStatus}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" onclick="toggleItemStock('${item.id}')" title="Toggle Stock (In Stock / Pre-Order)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
          </button>
          <button class="btn-icon delete" onclick="deleteItem('${item.id}')" title="Remove Product">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

// Action: Admin toggle availability
window.toggleItemStock = function(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  prod.stockStatus = prod.stockStatus === "In Stock" ? "Pre-Order" : "In Stock";
  localStorage.setItem("ph_products", JSON.stringify(state.products));

  renderStorefrontCatalog();
  renderAdminWorkspace();
  showLocalNotification(`"${prod.title}" availability status updated!`);
};

// Action: Admin delete item
window.deleteItem = function(productId) {
  if (confirm("Are you sure you want to remove this product from your storefront catalog? This is permanent.")) {
    state.products = state.products.filter(p => p.id !== productId);
    localStorage.setItem("ph_products", JSON.stringify(state.products));

    renderStorefrontCatalog();
    renderAdminWorkspace();
    showLocalNotification("Product removed from catalog database.");
  }
};

// Action: Form submit upload dynamic product
function handleAdminUploadSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("prod-title").value.trim();
  const category = document.getElementById("prod-category").value;
  const price = parseFloat(document.getElementById("prod-price").value);
  const stockStatus = document.getElementById("prod-stock").value;
  const image = document.getElementById("prod-image").value.trim();

  const prodId = "prod-" + Math.floor(100 + Math.random() * 900);

  const newProd = {
    id: prodId,
    title: title,
    category: category,
    price: price,
    stockStatus: stockStatus,
    image: image || getCategoryPlaceholder(category)
  };

  state.products.push(newProd);
  localStorage.setItem("ph_products", JSON.stringify(state.products));

  // Reset Form
  document.getElementById("admin-upload-form").reset();

  // Redraw
  renderStorefrontCatalog();
  renderAdminWorkspace();
  showLocalNotification(`"${title}" published to live catalog successfully!`);
}

// --------------------------------------------------------------------------
// 13. Interactive User Walkthrough Tour Guide Engine
// --------------------------------------------------------------------------
const TOUR_STEPS = [
  {
    targetId: "logo-link",
    title: "Welcome to PHORAMEC IMPORTS AVENUE!",
    description: "Our famous Dubai, USA & UK WhatsApp concierge service has evolved. We've built this modern web application to help you browse global items, checkout, and track cargo clearance timelines directly!"
  },
  {
    targetId: "tour-search-bar",
    title: "Instant Live Search",
    description: "Filter garments, designer shoes, electronics, and laptops instantly as you type. Use the category filter tabs right beneath this bar to narrow down items of your interest!"
  },
  {
    targetId: "custom-request-section",
    title: "Can't Find What You Need?",
    description: "Replicate our VIP personal WhatsApp concierge. Submit details, specification links, and estimated budgets for custom products. Our clearance and sourcing offices clear customs and procure it for you!"
  },
  {
    targetId: "admin-mode-toggle",
    title: "Roleplay as the Owner!",
    description: "Click this 'Admin Portal' at any time to switch views. You can upload new cargo products, view inbox customer custom requests, and advance shipping tracking pipelines with 1 click. Check it out!"
  }
];

function startHelpTour() {
  state.tourStepIndex = 0;
  showTourStep();
}

function showTourStep() {
  const overlay = document.getElementById("tour-overlay");
  const tourBox = document.getElementById("tour-box");
  const step = TOUR_STEPS[state.tourStepIndex];

  // Open overlay
  overlay.classList.add("active");

  // Remove previous highlights
  document.querySelectorAll(".tour-highlighted").forEach(el => el.classList.remove("tour-highlighted"));

  // Try to find the targeted component
  const targetElement = document.getElementById(step.targetId);

  // Set step badges
  document.getElementById("tour-step-current").textContent = state.tourStepIndex + 1;
  document.getElementById("tour-step-total").textContent = TOUR_STEPS.length;
  document.getElementById("tour-title").textContent = step.title;
  document.getElementById("tour-description").textContent = step.description;

  // Toggle navigation actions inside tour box
  document.getElementById("tour-prev-btn").disabled = state.tourStepIndex === 0;
  if (state.tourStepIndex === TOUR_STEPS.length - 1) {
    document.getElementById("tour-next-btn").textContent = "Finish Tour";
  } else {
    document.getElementById("tour-next-btn").textContent = "Next Step";
  }

  // Position Tour Box Relative to Element or center
  if (targetElement && window.innerWidth > 768) {
    targetElement.classList.add("tour-highlighted");
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

    // Ensure style measurements
    setTimeout(() => {
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      let boxTop = rect.bottom + scrollTop + 15;
      let boxLeft = rect.left + scrollLeft;

      // Handle horizontal overflows
      if (boxLeft + 320 > window.innerWidth) {
        boxLeft = window.innerWidth - 340;
      }
      if (boxLeft < 0) {
        boxLeft = 10;
      }

      // Handle vertical overflows
      if (rect.bottom + 15 + 220 > window.innerHeight) {
        boxTop = rect.top + scrollTop - 220; // Float on top of target
      }

      tourBox.style.position = "absolute";
      tourBox.style.top = `${boxTop}px`;
      tourBox.style.left = `${boxLeft}px`;
      tourBox.style.transform = "none";
    }, 100);
  } else {
    // If mobile or element not found, center tour modal
    tourBox.style.position = "fixed";
    tourBox.style.top = "50%";
    tourBox.style.left = "50%";
    tourBox.style.transform = "translate(-50%, -50%)";
  }
}

function nextTourStep() {
  if (state.tourStepIndex < TOUR_STEPS.length - 1) {
    state.tourStepIndex += 1;
    showTourStep();
  } else {
    endHelpTour();
  }
}

function prevTourStep() {
  if (state.tourStepIndex > 0) {
    state.tourStepIndex -= 1;
    showTourStep();
  }
}

function endHelpTour() {
  document.getElementById("tour-overlay").classList.remove("active");
  document.querySelectorAll(".tour-highlighted").forEach(el => el.classList.remove("tour-highlighted"));
}
