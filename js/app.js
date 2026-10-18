// Al-Usman Furniture Mart - Main Storefront Application Engine

// Application State
let currentCategory = "All";
let searchQuery = "";
let currentSort = "default";
let appliedCoupon = null;

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const categoryFilterTabs = document.getElementById("categoryFilterTabs");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// Drawer & Modal Elements
const drawerBackdrop = document.getElementById("drawerBackdrop");
const cartDrawer = document.getElementById("cartDrawer");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const quickViewModal = document.getElementById("quickViewModal");
const checkoutModal = document.getElementById("checkoutModal");
const orderSuccessModal = document.getElementById("orderSuccessModal");

// Badge Counts
const cartCount = document.getElementById("cartCount");
const cartDrawerCount = document.getElementById("cartDrawerCount");
const wishlistCount = document.getElementById("wishlistCount");
const wishlistDrawerCount = document.getElementById("wishlistDrawerCount");

// Initialize on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    renderProducts();
    updateCartUI();
    updateWishlistUI();
}

function setupEventListeners() {
    // Cart Drawer Triggers
    const cartBtn = document.getElementById("cartTriggerBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    if (cartBtn) cartBtn.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeAllDrawers);

    // Wishlist Drawer Triggers
    const wishlistBtn = document.getElementById("wishlistTriggerBtn");
    const closeWishlistBtn = document.getElementById("closeWishlistBtn");
    if (wishlistBtn) wishlistBtn.addEventListener("click", openWishlist);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener("click", closeAllDrawers);

    // Backdrop Click
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener("click", () => {
            closeAllDrawers();
            closeQuickViewModal();
            closeCheckoutModal();
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById("mobileMenuBtn");
    if (mobileBtn) {
        mobileBtn.addEventListener("click", () => {
            const nav = document.querySelector(".nav-links");
            if (nav) {
                const isShowing = nav.style.display === "flex";
                nav.style.display = isShowing ? "none" : "flex";
                if (!isShowing) {
                    nav.style.flexDirection = "column";
                    nav.style.position = "absolute";
                    nav.style.top = "100%";
                    nav.style.left = "0";
                    nav.style.right = "0";
                    nav.style.background = "#fff";
                    nav.style.padding = "1.5rem";
                    nav.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
                }
            }
        });
    }
}

// ================= Product Rendering & Filtering =================
function renderProducts() {
    if (!productsGrid) return;
    
    let products = DB.getProducts();

    // 1. Filter by category
    if (currentCategory !== "All") {
        products = products.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    }

    // 2. Search query filter
    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.material && p.material.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
    }

    // 3. Sorting
    if (currentSort === "price-asc") {
        products.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
        products.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
        products.sort((a, b) => b.rating - a.rating);
    }

    // Empty state check
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                <i class="fa-solid fa-couch" style="font-size: 3rem; color: var(--border); margin-bottom: 1rem;"></i>
                <h3 style="font-size: 1.3rem; color: var(--primary);">No Furniture Found</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your category filter or search keywords.</p>
                <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
            </div>
        `;
        return;
    }

    const wishlist = DB.getWishlist();

    productsGrid.innerHTML = products.map(prod => {
        const isWishlisted = wishlist.includes(prod.id);
        const discountPercent = prod.originalPrice && prod.originalPrice > prod.price 
            ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
            : 0;

        return `
            <div class="product-card" data-id="${prod.id}">
                <div class="product-thumb">
                    <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                    ${prod.badge ? `<span class="product-badge ${prod.badge.toLowerCase().includes('sale') ? 'sale' : 'bestseller'}">${prod.badge}</span>` : ''}
                    
                    <div class="product-quick-actions">
                        <button class="card-icon-btn ${isWishlisted ? 'active' : ''}" 
                                onclick="toggleWishlist('${prod.id}')" 
                                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                        <button class="card-icon-btn" 
                                onclick="openQuickView('${prod.id}')" 
                                title="Quick View">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>

                    <div class="quick-view-overlay-btn" onclick="openQuickView('${prod.id}')">
                        <i class="fa-solid fa-eye"></i> Quick View Details
                    </div>
                </div>

                <div class="product-info">
                    <div class="product-category-meta">
                        <span>${prod.category}</span>
                        <span>Stock: ${prod.stock > 0 ? prod.stock + ' Left' : '<span style="color:red">Out of stock</span>'}</span>
                    </div>

                    <h3 class="product-title" title="${prod.name}">${prod.name}</h3>
                    <p class="product-material"><i class="fa-solid fa-tree" style="color: var(--accent);"></i> ${prod.material || 'Solid Hardwood'}</p>

                    <div class="product-rating">
                        ${renderStars(prod.rating)}
                        <span>${prod.rating || 5.0} (${prod.reviewsCount || 10})</span>
                    </div>

                    <div class="product-price-row">
                        <span class="current-price">${DB.formatPrice(prod.price)}</span>
                        ${prod.originalPrice ? `<span class="original-price">${DB.formatPrice(prod.originalPrice)}</span>` : ''}
                        ${discountPercent > 0 ? `<span style="font-size: 0.75rem; color: var(--danger); font-weight: 700;">-${discountPercent}%</span>` : ''}
                    </div>
                </div>

                <div class="product-card-footer">
                    <button class="btn-add-cart" onclick="addToCart('${prod.id}', 1)">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                    </button>
                    <a href="https://wa.me/923001234567?text=Hello%20Al-Usman%20Furniture,%20I%20am%20interested%20in:%20${encodeURIComponent(prod.name)}%20(${encodeURIComponent(DB.formatPrice(prod.price))})" 
                       target="_blank" 
                       class="btn-card-wa" 
                       title="Order this via WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        `;
    }).join("");
}

function renderStars(rating = 5) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}

// Category filter handler
function filterByCategory(catName) {
    currentCategory = catName;

    // Update active tab styling
    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(pill => {
        if (pill.innerText.trim().toLowerCase() === catName.toLowerCase() || 
            (catName === "All" && pill.innerText.includes("All"))) {
            pill.classList.add("active");
        } else {
            pill.classList.remove("active");
        }
    });

    renderProducts();

    // Scroll smoothly to catalog
    const catalogElem = document.getElementById("catalog");
    if (catalogElem && window.scrollY < catalogElem.offsetTop - 150) {
        catalogElem.scrollIntoView({ behavior: "smooth" });
    }
}

// Search handler
function handleSearch(val) {
    searchQuery = val;
    renderProducts();
}

function focusSearch() {
    if (searchInput) {
        searchInput.focus();
    }
}

// Sort handler
function handleSort(val) {
    currentSort = val;
    renderProducts();
}

function resetFilters() {
    currentCategory = "All";
    searchQuery = "";
    currentSort = "default";
    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "default";
    filterByCategory("All");
}

// ================= Cart Operations =================
function addToCart(productId, qty = 1) {
    const products = DB.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = DB.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            material: product.material,
            qty: qty
        });
    }

    DB.saveCart(cart);
    updateCartUI();
    showToast(`Added "${product.name}" to your cart!`);
    openCart();
}

function updateCartQty(productId, delta) {
    let cart = DB.getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    DB.saveCart(cart);
    updateCartUI();
}

function removeCartItem(productId) {
    let cart = DB.getCart();
    cart = cart.filter(i => i.id !== productId);
    DB.saveCart(cart);
    updateCartUI();
    showToast("Item removed from cart");
}

function updateCartUI() {
    const cart = DB.getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cartCount) cartCount.innerText = totalQty;
    if (cartDrawerCount) cartDrawerCount.innerText = totalQty;

    const cartContainer = document.getElementById("cartItemsContainer");
    const cartFooter = document.getElementById("cartFooter");

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-basket-shopping"></i>
                <h4 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 0.5rem;">Your Cart is Empty</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">Explore our royal Sheesham & Teak furniture pieces and add elegance to your home.</p>
                <button class="btn btn-primary" onclick="closeAllDrawers()">Start Shopping</button>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = "none";
        return;
    }

    if (cartFooter) cartFooter.style.display = "block";

    cartContainer.innerHTML = `
        <div class="cart-items-list">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">${DB.formatPrice(item.price)}</div>
                        <div class="cart-qty-control">
                            <button class="cart-qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                            <span class="cart-qty-val">${item.qty}</span>
                            <button class="cart-qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <div class="btn-remove-item" onclick="removeCartItem('${item.id}')" title="Remove">
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                </div>
            `).join("")}
        </div>
    `;

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const settings = DB.getSettings();
    let delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.shippingFee;
    let discount = 0;

    if (appliedCoupon) {
        if (appliedCoupon.discountPercent) {
            discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
        } else if (appliedCoupon.discountFlat) {
            discount = appliedCoupon.discountFlat;
        }
    }

    const grandTotal = Math.max(0, subtotal - discount + delivery);

    const subtotalElem = document.getElementById("cartSubtotal");
    const discountRow = document.getElementById("discountRow");
    const discountElem = document.getElementById("cartDiscount");
    const deliveryElem = document.getElementById("cartDelivery");
    const grandTotalElem = document.getElementById("cartGrandTotal");

    if (subtotalElem) subtotalElem.innerText = DB.formatPrice(subtotal);
    if (deliveryElem) deliveryElem.innerText = delivery === 0 ? "Free (Orders > 50K)" : DB.formatPrice(delivery);

    if (discount > 0 && discountRow && discountElem) {
        discountRow.style.display = "flex";
        discountElem.innerText = "- " + DB.formatPrice(discount);
    } else if (discountRow) {
        discountRow.style.display = "none";
    }

    if (grandTotalElem) grandTotalElem.innerText = DB.formatPrice(grandTotal);
}

// Coupon system
function applyCoupon() {
    const input = document.getElementById("couponInput");
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast("Please enter a promo code");
        return;
    }

    const settings = DB.getSettings();
    const coupon = settings.coupons.find(c => c.code.toUpperCase() === code);

    if (!coupon) {
        showToast("Invalid coupon code. Try 'ALUSMAN10' for 10% off!");
        return;
    }

    const cart = DB.getCart();
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    if (coupon.minSpend && subtotal < coupon.minSpend) {
        showToast(`This coupon requires minimum spend of ${DB.formatPrice(coupon.minSpend)}`);
        return;
    }

    appliedCoupon = coupon;
    updateCartUI();
    showToast(`Coupon "${code}" applied successfully! 🎉`);
}

// ================= Wishlist Operations =================
function toggleWishlist(productId) {
    let wishlist = DB.getWishlist();
    const exists = wishlist.includes(productId);

    if (exists) {
        wishlist = wishlist.filter(id => id !== productId);
        showToast("Removed from wishlist");
    } else {
        wishlist.push(productId);
        showToast("Saved to your wishlist! ❤️");
    }

    DB.saveWishlist(wishlist);
    updateWishlistUI();
    renderProducts();
}

function updateWishlistUI() {
    const wishlist = DB.getWishlist();
    if (wishlistCount) wishlistCount.innerText = wishlist.length;
    if (wishlistDrawerCount) wishlistDrawerCount.innerText = wishlist.length;

    const container = document.getElementById("wishlistItemsContainer");
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-heart"></i>
                <h4 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 0.5rem;">Wishlist is Empty</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">Save luxury items here to inspect or order later.</p>
                <button class="btn btn-primary" onclick="closeAllDrawers()">Browse Collection</button>
            </div>
        `;
        return;
    }

    const products = DB.getProducts();
    const savedProducts = products.filter(p => wishlist.includes(p.id));

    container.innerHTML = `
        <div class="cart-items-list">
            ${savedProducts.map(prod => `
                <div class="cart-item">
                    <img src="${prod.image}" alt="${prod.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${prod.name}</h4>
                        <div class="cart-item-price">${DB.formatPrice(prod.price)}</div>
                        <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;" onclick="addToCart('${prod.id}', 1); toggleWishlist('${prod.id}');">
                            <i class="fa-solid fa-bag-shopping"></i> Move to Cart
                        </button>
                    </div>
                    <div class="btn-remove-item" onclick="toggleWishlist('${prod.id}')" title="Remove">
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

// ================= Drawer & Modal Controls =================
function openCart() {
    closeAllDrawers();
    if (cartDrawer) cartDrawer.classList.add("active");
    if (drawerBackdrop) drawerBackdrop.classList.add("active");
}

function openWishlist() {
    closeAllDrawers();
    if (wishlistDrawer) wishlistDrawer.classList.add("active");
    if (drawerBackdrop) drawerBackdrop.classList.add("active");
}

function closeAllDrawers() {
    if (cartDrawer) cartDrawer.classList.remove("active");
    if (wishlistDrawer) wishlistDrawer.classList.remove("active");
    if (drawerBackdrop) drawerBackdrop.classList.remove("active");
}

// Quick View Modal
function openQuickView(productId) {
    const products = DB.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const content = document.getElementById("quickViewContent");
    if (!content) return;

    content.innerHTML = `
        <div class="qv-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="qv-details">
            <span style="font-size: 0.82rem; text-transform: uppercase; color: var(--accent); font-weight: 700; letter-spacing: 0.08em;">${product.category}</span>
            <h3 style="margin: 0.35rem 0 0.75rem;">${product.name}</h3>
            <div class="product-rating" style="margin-bottom: 0.75rem;">
                ${renderStars(product.rating)}
                <span>${product.rating || 5.0} (${product.reviewsCount || 10} verified customer reviews)</span>
            </div>
            <div class="qv-price">
                ${DB.formatPrice(product.price)}
                ${product.originalPrice ? `<span style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through; margin-left: 0.6rem;">${DB.formatPrice(product.originalPrice)}</span>` : ''}
            </div>

            <ul class="qv-meta-list">
                <li><strong>Wood / Material:</strong> ${product.material || 'Solid Sheesham Wood'}</li>
                <li><strong>Dimensions:</strong> ${product.dimensions || 'Custom Sizes Available'}</li>
                <li><strong>Availability:</strong> <span style="color: ${product.stock > 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">${product.stock > 0 ? `In Stock (${product.stock} units ready)` : 'Made to Order'}</span></li>
                <li><strong>Warranty:</strong> 10-Year Termite & Structural Guarantee</li>
                <li><strong>Delivery:</strong> Free white-glove setup in major cities</li>
            </ul>

            <p class="qv-desc">${product.description || 'Finest luxury furniture handcrafted by Al-Usman master artisans using seasoned kiln-dried hardwood.'}</p>

            <div style="display: flex; gap: 0.85rem; margin-top: 1.5rem; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="addToCart('${product.id}', 1); closeQuickViewModal();">
                    <i class="fa-solid fa-bag-shopping"></i> Add to Shopping Cart
                </button>
                <a href="https://wa.me/923001234567?text=Hello%20Al-Usman%20Furniture,%20I%20want%20to%20order%20the%20${encodeURIComponent(product.name)}" target="_blank" class="btn btn-whatsapp">
                    <i class="fa-brands fa-whatsapp"></i> Buy via WhatsApp
                </a>
            </div>
        </div>
    `;

    if (quickViewModal) quickViewModal.classList.add("active");
}

function closeQuickViewModal() {
    if (quickViewModal) quickViewModal.classList.remove("active");
}

// Checkout Modal
function openCheckoutModal() {
    const cart = DB.getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty! Add items first.");
        return;
    }

    closeAllDrawers();

    // Populate order review summary
    const summaryContainer = document.getElementById("checkoutSummaryItems");
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const settings = DB.getSettings();
    let delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.shippingFee;
    let discount = 0;

    if (appliedCoupon) {
        if (appliedCoupon.discountPercent) {
            discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
        } else if (appliedCoupon.discountFlat) {
            discount = appliedCoupon.discountFlat;
        }
    }

    const total = Math.max(0, subtotal - discount + delivery);

    if (summaryContainer) {
        summaryContainer.innerHTML = cart.map(i => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
                <span style="max-width: 65%; font-weight: 500;">${i.qty}x ${i.name}</span>
                <span style="font-weight: 600;">${DB.formatPrice(i.price * i.qty)}</span>
            </div>
        `).join("");
    }

    document.getElementById("coSubtotal").innerText = DB.formatPrice(subtotal);
    document.getElementById("coDelivery").innerText = delivery === 0 ? "Free" : DB.formatPrice(delivery);
    document.getElementById("coTotal").innerText = DB.formatPrice(total);

    const coDiscountRow = document.getElementById("coDiscountRow");
    const coDiscount = document.getElementById("coDiscount");
    if (discount > 0 && coDiscountRow && coDiscount) {
        coDiscountRow.style.display = "flex";
        coDiscount.innerText = "- " + DB.formatPrice(discount);
    } else if (coDiscountRow) {
        coDiscountRow.style.display = "none";
    }

    if (checkoutModal) checkoutModal.classList.add("active");
}

function closeCheckoutModal() {
    if (checkoutModal) checkoutModal.classList.remove("active");
}

function selectPaymentMethod(element, method) {
    document.querySelectorAll(".payment-option-card").forEach(el => el.classList.remove("selected"));
    element.classList.add("selected");
    const hiddenInput = document.getElementById("selectedPaymentMethod");
    if (hiddenInput) hiddenInput.value = method;
}

// Order Placement Handler
function handlePlaceOrder(e) {
    e.preventDefault();

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const city = document.getElementById("custCity").value;
    const address = document.getElementById("custAddress").value.trim();
    const notes = document.getElementById("custNotes").value.trim();
    const paymentMethod = document.getElementById("selectedPaymentMethod").value;

    const cart = DB.getCart();
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const settings = DB.getSettings();
    let delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.shippingFee;
    let discount = 0;

    if (appliedCoupon) {
        if (appliedCoupon.discountPercent) {
            discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
        } else if (appliedCoupon.discountFlat) {
            discount = appliedCoupon.discountFlat;
        }
    }

    const total = Math.max(0, subtotal - discount + delivery);
    const newOrderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = now.getFullYear() + "-" + 
                    String(now.getMonth() + 1).padStart(2, '0') + "-" + 
                    String(now.getDate()).padStart(2, '0') + " " + 
                    String(now.getHours()).padStart(2, '0') + ":" + 
                    String(now.getMinutes()).padStart(2, '0');

    const newOrder = {
        orderId: newOrderId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        city: city,
        address: address,
        notes: notes,
        items: [...cart],
        subtotal: subtotal,
        discount: discount,
        delivery: delivery,
        total: total,
        paymentMethod: paymentMethod,
        status: "Pending",
        date: dateStr
    };

    // Save to Database
    const orders = DB.getOrders();
    orders.unshift(newOrder);
    DB.saveOrders(orders);

    // Update product stock counts
    let products = DB.getProducts();
    cart.forEach(cartItem => {
        const prod = products.find(p => p.id === cartItem.id);
        if (prod && prod.stock > 0) {
            prod.stock = Math.max(0, prod.stock - cartItem.qty);
        }
    });
    DB.saveProducts(products);

    // Clear cart & coupon
    DB.saveCart([]);
    appliedCoupon = null;
    updateCartUI();
    renderProducts();

    // Close checkout and show invoice modal
    closeCheckoutModal();
    showOrderSuccess(newOrder);
}

function showOrderSuccess(order) {
    const detailsBox = document.getElementById("receiptDetailsBox");
    if (detailsBox) {
        detailsBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <div>
                    <h5 style="font-size: 1.05rem; color: var(--primary);">Invoice #${order.orderId}</h5>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${order.date}</span>
                </div>
                <div style="text-align: right;">
                    <span style="background: #e8f8ed; color: #10b981; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">${order.status}</span>
                </div>
            </div>

            <div style="font-size: 0.85rem; margin-bottom: 0.75rem; line-height: 1.6;">
                <strong>Deliver To:</strong> ${order.customerName} (${order.customerPhone})<br>
                <strong>City & Address:</strong> ${order.address}, ${order.city}<br>
                <strong>Payment Mode:</strong> ${order.paymentMethod}
            </div>

            <div style="border-top: 1px dashed var(--border); padding-top: 0.6rem; font-size: 0.85rem;">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                        <span>${item.qty}x ${item.name}</span>
                        <span>${DB.formatPrice(item.price * item.qty)}</span>
                    </div>
                `).join("")}
            </div>

            <div style="border-top: 1px solid var(--border); margin-top: 0.6rem; padding-top: 0.6rem; font-size: 0.95rem; font-weight: 700; display: flex; justify-content: space-between;">
                <span>Total Amount:</span>
                <span style="color: var(--accent);">${DB.formatPrice(order.total)}</span>
            </div>
        `;
    }

    if (orderSuccessModal) orderSuccessModal.classList.add("active");
}

function closeOrderSuccessModal() {
    if (orderSuccessModal) orderSuccessModal.classList.remove("active");
}

function printReceipt() {
    window.print();
}

// WhatsApp Direct Checkout
function checkoutViaWhatsApp() {
    const cart = DB.getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let msg = `*Assalam-o-Alaikum Al-Usman Furniture Mart!*\n\nI want to place an order for the following items:\n`;

    cart.forEach((item, index) => {
        msg += `${index + 1}. *${item.name}*\n   Qty: ${item.qty} | Price: ${DB.formatPrice(item.price * item.qty)}\n`;
    });

    msg += `\n*Total Estimated Amount:* ${DB.formatPrice(subtotal)}`;
    msg += `\n\nPlease confirm availability and delivery timeline.`;

    const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
}

// Toast notification helper
function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent);"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-20px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
