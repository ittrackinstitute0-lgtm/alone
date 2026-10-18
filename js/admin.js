// Al-Usman Furniture Mart - Admin Panel Engine

let adminSearchProd = "";
let adminCatFilter = "All";
let adminOrderSearchQuery = "";
let adminOrderStatus = "All";

document.addEventListener("DOMContentLoaded", () => {
    initAdmin();
});

function initAdmin() {
    renderDashboardMetrics();
    renderDashboardTables();
    renderAdminProducts();
    renderAdminOrders();
    renderAdminCoupons();
    loadSettingsForm();
}

// ================= View Switcher =================
function switchView(viewName, menuItem) {
    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    
    // Deactivate sidebar items
    document.querySelectorAll(".sidebar-menu-item").forEach(item => item.classList.remove("active"));
    if (menuItem) menuItem.classList.add("active");

    const titleElem = document.getElementById("currentViewTitle");
    const subTitleElem = document.getElementById("currentViewSubtitle");

    if (viewName === "dashboard") {
        document.getElementById("viewDashboard").classList.add("active");
        if (titleElem) titleElem.innerText = "Store Management Dashboard";
        if (subTitleElem) subTitleElem.innerText = "Live overview of Al-Usman Furniture Mart sales & inventory";
        renderDashboardMetrics();
        renderDashboardTables();
    } else if (viewName === "products") {
        document.getElementById("viewProducts").classList.add("active");
        if (titleElem) titleElem.innerText = "Products & Inventory Management";
        if (subTitleElem) subTitleElem.innerText = "Add, modify, restock or remove furniture items from the live store";
        renderAdminProducts();
    } else if (viewName === "orders") {
        document.getElementById("viewOrders").classList.add("active");
        if (titleElem) titleElem.innerText = "Customer Orders & Deliveries";
        if (subTitleElem) subTitleElem.innerText = "Track delivery phases, change order status, and issue invoices";
        renderAdminOrders();
    } else if (viewName === "coupons") {
        document.getElementById("viewCoupons").classList.add("active");
        if (titleElem) titleElem.innerText = "Promo & Discount Coupons";
        if (subTitleElem) subTitleElem.innerText = "Manage discount codes applied by customers during checkout";
        renderAdminCoupons();
    } else if (viewName === "settings") {
        document.getElementById("viewSettings").classList.add("active");
        if (titleElem) titleElem.innerText = "Al-Usman Storefront Settings";
        if (subTitleElem) subTitleElem.innerText = "Manage showroom contact information, WhatsApp numbers and delivery fees";
        loadSettingsForm();
    }
}

// ================= Dashboard Metrics & Summaries =================
function renderDashboardMetrics() {
    const products = DB.getProducts();
    const orders = DB.getOrders();

    // Total Revenue (From completed & valid orders)
    const validOrders = orders.filter(o => o.status !== "Cancelled");
    const totalRev = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Low stock count (<= 4 items)
    const lowStockCount = products.filter(p => p.stock <= 4).length;

    document.getElementById("metricRevenue").innerText = DB.formatPrice(totalRev);
    document.getElementById("metricOrders").innerText = orders.length;
    document.getElementById("metricProducts").innerText = products.length;
    document.getElementById("metricLowStock").innerText = lowStockCount;
}

function renderDashboardTables() {
    const orders = DB.getOrders();
    const products = DB.getProducts();

    // 1. Recent Orders Table (Top 5)
    const recentOrdersTbody = document.getElementById("dashboardRecentOrdersTable");
    if (recentOrdersTbody) {
        const topOrders = orders.slice(0, 5);
        if (topOrders.length === 0) {
            recentOrdersTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem;">No orders placed yet.</td></tr>`;
        } else {
            recentOrdersTbody.innerHTML = topOrders.map(order => `
                <tr>
                    <td><strong>#${order.orderId}</strong></td>
                    <td>
                        <div style="font-weight: 600;">${order.customerName}</div>
                        <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${order.customerPhone}</div>
                    </td>
                    <td>${order.city || 'N/A'}</td>
                    <td>${order.items.map(i => `${i.qty}x ${i.name}`).join(", ").substring(0, 35)}...</td>
                    <td><strong style="color: var(--admin-accent);">${DB.formatPrice(order.total)}</strong></td>
                    <td><span style="font-size: 0.8rem;">${order.paymentMethod}</span></td>
                    <td>${renderStatusPill(order.status)}</td>
                    <td>
                        <button class="table-btn" onclick="viewOrderInvoice('${order.orderId}')" title="View Invoice">
                            <i class="fa-solid fa-file-invoice"></i>
                        </button>
                    </td>
                </tr>
            `).join("");
        }
    }

    // 2. Featured Products Table
    const featuredTbody = document.getElementById("dashboardFeaturedProductsTable");
    if (featuredTbody) {
        const featured = products.filter(p => p.isFeatured || p.badge).slice(0, 5);
        featuredTbody.innerHTML = featured.map(prod => `
            <tr>
                <td>
                    <div class="product-cell">
                        <img src="${prod.image}" alt="${prod.name}">
                        <div class="product-cell-info">
                            <h5>${prod.name}</h5>
                            <span>${prod.material || 'Solid Wood'}</span>
                        </div>
                    </div>
                </td>
                <td>${prod.category}</td>
                <td><strong>${DB.formatPrice(prod.price)}</strong></td>
                <td>${renderStockPill(prod.stock)}</td>
                <td><span style="background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${prod.badge || 'Standard'}</span></td>
                <td>
                    <button class="table-btn btn-edit" onclick="openEditProductModal('${prod.id}')" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    }
}

function renderStatusPill(status) {
    const s = (status || "Pending").toLowerCase();
    let cls = "status-pending";
    if (s === "processing") cls = "status-processing";
    if (s === "shipped") cls = "status-shipped";
    if (s === "delivered") cls = "status-delivered";
    if (s === "cancelled") cls = "status-cancelled";

    return `<span class="status-pill ${cls}"><span class="pulse-dot" style="width: 6px; height: 6px;"></span> ${status}</span>`;
}

function renderStockPill(stock) {
    if (stock <= 0) {
        return `<span class="stock-pill stock-out">Out of Stock</span>`;
    } else if (stock <= 4) {
        return `<span class="stock-pill stock-low">Low: ${stock} Left</span>`;
    } else {
        return `<span class="stock-pill stock-high">In Stock (${stock})</span>`;
    }
}

// ================= Product Catalog Management (CRUD) =================
function renderAdminProducts() {
    let products = DB.getProducts();

    if (adminCatFilter !== "All") {
        products = products.filter(p => p.category.toLowerCase() === adminCatFilter.toLowerCase());
    }

    if (adminSearchProd.trim() !== "") {
        const q = adminSearchProd.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.material && p.material.toLowerCase().includes(q))
        );
    }

    const tbody = document.getElementById("adminProductsTableBody");
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem;">No furniture products match your filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(prod => `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="${prod.image}" alt="${prod.name}">
                    <div class="product-cell-info">
                        <h5>${prod.name}</h5>
                        <span>ID: ${prod.id}</span>
                    </div>
                </div>
            </td>
            <td><strong>${prod.category}</strong></td>
            <td><strong style="color: var(--admin-accent);">${DB.formatPrice(prod.price)}</strong></td>
            <td>${prod.originalPrice ? `<span style="text-decoration: line-through; color: var(--admin-text-muted);">${DB.formatPrice(prod.originalPrice)}</span>` : '-'}</td>
            <td>${renderStockPill(prod.stock)}</td>
            <td><span style="font-size: 0.8rem; color: var(--admin-text-muted);">${prod.material || 'Solid Wood'}</span></td>
            <td>
                <div style="display: flex; gap: 0.4rem;">
                    <button class="table-btn btn-edit" onclick="openEditProductModal('${prod.id}')" title="Edit Furniture">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="table-btn btn-delete" onclick="handleDeleteProduct('${prod.id}')" title="Delete Product">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

function handleAdminProductSearch(val) {
    adminSearchProd = val;
    renderAdminProducts();
}

function handleAdminProductCategoryFilter(val) {
    adminCatFilter = val;
    renderAdminProducts();
}

// Add/Edit Product Modal
function openAddProductModal() {
    document.getElementById("productModalTitle").innerText = "Add New Luxury Furniture";
    document.getElementById("productForm").reset();
    document.getElementById("prodEditId").value = "";
    document.getElementById("prodStock").value = "5";
    document.getElementById("productModal").classList.add("active");
}

function openEditProductModal(productId) {
    const products = DB.getProducts();
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    document.getElementById("productModalTitle").innerText = "Edit Furniture: " + prod.name;
    document.getElementById("prodEditId").value = prod.id;
    document.getElementById("prodName").value = prod.name;
    document.getElementById("prodCategory").value = prod.category;
    document.getElementById("prodBadge").value = prod.badge || "";
    document.getElementById("prodPrice").value = prod.price;
    document.getElementById("prodOriginalPrice").value = prod.originalPrice || "";
    document.getElementById("prodStock").value = prod.stock;
    document.getElementById("prodMaterial").value = prod.material || "";
    document.getElementById("prodDimensions").value = prod.dimensions || "";
    document.getElementById("prodImage").value = prod.image;
    document.getElementById("prodDesc").value = prod.description || "";

    document.getElementById("productModal").classList.add("active");
}

function closeProductModal() {
    document.getElementById("productModal").classList.remove("active");
}

function handleSaveProduct(e) {
    e.preventDefault();

    const editId = document.getElementById("prodEditId").value;
    const name = document.getElementById("prodName").value.trim();
    const category = document.getElementById("prodCategory").value;
    const badge = document.getElementById("prodBadge").value.trim();
    const price = Number(document.getElementById("prodPrice").value);
    const originalPrice = document.getElementById("prodOriginalPrice").value ? Number(document.getElementById("prodOriginalPrice").value) : null;
    const stock = Number(document.getElementById("prodStock").value);
    const material = document.getElementById("prodMaterial").value.trim();
    const dimensions = document.getElementById("prodDimensions").value.trim();
    const image = document.getElementById("prodImage").value.trim();
    const description = document.getElementById("prodDesc").value.trim();

    let products = DB.getProducts();

    if (editId) {
        // Edit existing
        const index = products.findIndex(p => p.id === editId);
        if (index > -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                badge,
                price,
                originalPrice,
                stock,
                material,
                dimensions,
                image,
                description
            };
        }
    } else {
        // Add new
        const newProduct = {
            id: "prod-" + Date.now(),
            name,
            category,
            badge,
            price,
            originalPrice,
            stock,
            material,
            dimensions,
            image,
            description,
            rating: 5.0,
            reviewsCount: 1,
            isFeatured: true
        };
        products.unshift(newProduct);
    }

    DB.saveProducts(products);
    closeProductModal();
    renderAdminProducts();
    renderDashboardMetrics();
    renderDashboardTables();
    alert("Product saved successfully to Al-Usman Furniture Mart catalog!");
}

function handleDeleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this furniture product? This action cannot be undone.")) return;

    let products = DB.getProducts();
    products = products.filter(p => p.id !== productId);
    DB.saveProducts(products);

    renderAdminProducts();
    renderDashboardMetrics();
    renderDashboardTables();
}

function setSampleImage(num) {
    const samples = [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=800&q=80"
    ];
    document.getElementById("prodImage").value = samples[num - 1];
}

// ================= Orders Management =================
function renderAdminOrders() {
    let orders = DB.getOrders();

    if (adminOrderStatus !== "All") {
        orders = orders.filter(o => o.status.toLowerCase() === adminOrderStatus.toLowerCase());
    }

    if (adminOrderSearchQuery.trim() !== "") {
        const q = adminOrderSearchQuery.toLowerCase();
        orders = orders.filter(o => 
            o.orderId.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerPhone.includes(q) ||
            (o.city && o.city.toLowerCase().includes(q))
        );
    }

    const tbody = document.getElementById("adminOrdersTableBody");
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2.5rem;">No customer orders found matching filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>#${order.orderId}</strong></td>
            <td><span style="font-size: 0.78rem; color: var(--admin-text-muted);">${order.date}</span></td>
            <td>
                <div style="font-weight: 600;">${order.customerName}</div>
                <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${order.customerPhone}</div>
                ${order.customerEmail ? `<div style="font-size: 0.72rem; color: var(--admin-text-muted);">${order.customerEmail}</div>` : ''}
            </td>
            <td>
                <div style="max-width: 220px; font-size: 0.8rem;">
                    <strong>${order.city}:</strong> ${order.address}
                </div>
            </td>
            <td><strong style="color: var(--admin-accent); font-size: 0.95rem;">${DB.formatPrice(order.total)}</strong></td>
            <td><span style="font-size: 0.82rem;">${order.paymentMethod}</span></td>
            <td>
                <select class="admin-input" style="padding: 0.35rem 0.5rem; font-size: 0.8rem; font-weight: 600;" 
                        onchange="updateOrderStatus('${order.orderId}', this.value)">
                    <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
                    <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
                    <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                    <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="table-btn" onclick="viewOrderInvoice('${order.orderId}')" title="View / Print Invoice">
                    <i class="fa-solid fa-file-invoice"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function handleAdminOrderSearch(val) {
    adminOrderSearchQuery = val;
    renderAdminOrders();
}

function handleAdminOrderStatusFilter(val) {
    adminOrderStatus = val;
    renderAdminOrders();
}

function updateOrderStatus(orderId, newStatus) {
    let orders = DB.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    order.status = newStatus;
    DB.saveOrders(orders);

    renderDashboardMetrics();
    renderDashboardTables();
    renderAdminOrders();
}

function viewOrderInvoice(orderId) {
    const orders = DB.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    const modalContent = document.getElementById("adminOrderModalContent");
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid var(--admin-border); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
            <h2 style="font-family: 'Cinzel', serif; letter-spacing: 0.05em; color: var(--admin-primary); margin-bottom: 0.2rem;">Al-Usman Furniture Mart</h2>
            <p style="font-size: 0.82rem; color: var(--admin-text-muted);">Main GT Road, Gujranwala / Lahore, Pakistan • +92 300 1234567</p>
            <div style="margin-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
                <span><strong>Invoice:</strong> #${order.orderId}</span>
                <span><strong>Date:</strong> ${order.date}</span>
                <span>${renderStatusPill(order.status)}</span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
            <div style="background: #f8fafc; padding: 1rem; border-radius: 6px;">
                <h5 style="margin-bottom: 0.4rem; color: var(--admin-primary);">Customer Details</h5>
                <div><strong>Name:</strong> ${order.customerName}</div>
                <div><strong>Phone:</strong> ${order.customerPhone}</div>
                <div><strong>Email:</strong> ${order.customerEmail || 'N/A'}</div>
            </div>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 6px;">
                <h5 style="margin-bottom: 0.4rem; color: var(--admin-primary);">Shipping & Payment</h5>
                <div><strong>City:</strong> ${order.city}</div>
                <div><strong>Address:</strong> ${order.address}</div>
                <div><strong>Payment:</strong> ${order.paymentMethod}</div>
            </div>
        </div>

        <h5 style="margin-bottom: 0.5rem;">Ordered Furniture Items:</h5>
        <table class="admin-table" style="margin-bottom: 1.25rem;">
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td><strong>${item.name}</strong></td>
                        <td>${DB.formatPrice(item.price)}</td>
                        <td>${item.qty}</td>
                        <td><strong>${DB.formatPrice(item.price * item.qty)}</strong></td>
                    </tr>
                `).join("")}
            </tbody>
        </table>

        <div style="border-top: 1px solid var(--admin-border); padding-top: 0.75rem; max-width: 280px; margin-left: auto; font-size: 0.88rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <span>Subtotal:</span>
                <span>${DB.formatPrice(order.subtotal)}</span>
            </div>
            ${order.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; color: var(--success);">
                <span>Discount:</span>
                <span>- ${DB.formatPrice(order.discount)}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <span>Delivery:</span>
                <span>${order.delivery === 0 ? 'Free' : DB.formatPrice(order.delivery)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 700; color: var(--admin-accent); border-top: 1px solid var(--admin-border); padding-top: 0.5rem;">
                <span>Total Amount:</span>
                <span>${DB.formatPrice(order.total)}</span>
            </div>
        </div>
    `;

    document.getElementById("adminOrderModal").classList.add("active");
}

function closeAdminOrderModal() {
    document.getElementById("adminOrderModal").classList.remove("active");
}

// ================= Coupon Management =================
function renderAdminCoupons() {
    const settings = DB.getSettings();
    const tbody = document.getElementById("adminCouponsTableBody");
    if (!tbody) return;

    tbody.innerHTML = settings.coupons.map((coupon, idx) => `
        <tr>
            <td><strong style="color: var(--admin-primary); font-family: monospace; font-size: 0.95rem;">${coupon.code}</strong></td>
            <td>${coupon.discountPercent ? `${coupon.discountPercent}% Off` : DB.formatPrice(coupon.discountFlat) + ' Flat'}</td>
            <td>${coupon.minSpend ? DB.formatPrice(coupon.minSpend) : 'No Minimum'}</td>
            <td><span style="color: var(--admin-text-muted);">${coupon.description || 'Promotional Coupon'}</span></td>
            <td>
                <button class="table-btn btn-delete" onclick="handleDeleteCoupon(${idx})" title="Delete Coupon">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function openAddCouponModal() {
    document.getElementById("couponForm").reset();
    document.getElementById("couponModal").classList.add("active");
}

function closeAddCouponModal() {
    document.getElementById("couponModal").classList.remove("active");
}

function handleSaveCoupon(e) {
    e.preventDefault();
    const code = document.getElementById("couponCode").value.trim().toUpperCase();
    const percent = document.getElementById("couponPercent").value ? Number(document.getElementById("couponPercent").value) : null;
    const minSpend = document.getElementById("couponMinSpend").value ? Number(document.getElementById("couponMinSpend").value) : 0;
    const desc = document.getElementById("couponDesc").value.trim();

    let settings = DB.getSettings();
    settings.coupons.push({
        code: code,
        discountPercent: percent,
        minSpend: minSpend,
        description: desc
    });

    DB.saveSettings(settings);
    closeAddCouponModal();
    renderAdminCoupons();
    alert(`Coupon ${code} added successfully!`);
}

function handleDeleteCoupon(index) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    let settings = DB.getSettings();
    settings.coupons.splice(index, 1);
    DB.saveSettings(settings);
    renderAdminCoupons();
}

// ================= Store Settings =================
function loadSettingsForm() {
    const s = DB.getSettings();
    document.getElementById("settingStoreName").value = s.storeName || "Al-Usman Furniture Mart";
    document.getElementById("settingTagline").value = s.tagline || "";
    document.getElementById("settingPhone").value = s.phone || "+92 300 1234567";
    document.getElementById("settingWhatsApp").value = s.whatsapp || "923001234567";
    document.getElementById("settingFreeDeliveryThreshold").value = s.freeDeliveryThreshold || 50000;
    document.getElementById("settingShippingFee").value = s.shippingFee || 3500;
    document.getElementById("settingAddress").value = s.address || "";
}

function handleSaveSettings(e) {
    e.preventDefault();
    let s = DB.getSettings();
    s.storeName = document.getElementById("settingStoreName").value.trim();
    s.tagline = document.getElementById("settingTagline").value.trim();
    s.phone = document.getElementById("settingPhone").value.trim();
    s.whatsapp = document.getElementById("settingWhatsApp").value.trim();
    s.freeDeliveryThreshold = Number(document.getElementById("settingFreeDeliveryThreshold").value);
    s.shippingFee = Number(document.getElementById("settingShippingFee").value);
    s.address = document.getElementById("settingAddress").value.trim();

    DB.saveSettings(s);
    alert("Store settings updated successfully!");
}
