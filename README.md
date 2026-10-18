# 🪑 Al-Usman Furniture Mart - Modern Luxury E-Commerce Platform

Ek mukammal, professional, aur advanced **E-Commerce Furniture Storefront** aur **Admin Panel Dashboard**, jo khaas tor par **Al-Usman Furniture Mart** ke liye design kiya gaya hai. Isme Pakistani luxury furniture market ke mutabiq Sheesham wood, Teak wood, marble dining sets, aur Italian aesthetic shamil hain.

---

## 🌟 Key Highlights & Features

### 🛍️ 1. Customer Storefront (`index.html`)
- **Modern Luxury Aesthetic**: Royal charcoal, warm oak/gold palette, Playfair Display serif typography, aur responsive fluid layout.
- **Dynamic Product Catalog**:
  - Categories: Living Room, Bedroom, Dining Room, Office, Luxury Lounge, Decor & Lighting.
  - Live Search Bar & Category Filter Pills.
  - Sorting: Price (Low to High, High to Low), Highest Rated, Featured.
- **Interactive Shopping Cart (Drawer)**:
  - Real-time quantity increment/decrement (+ / -).
  - Promo Coupon Engine:
    - `ALUSMAN10`: Flat 10% Off
    - `FURNITURE5K`: Flat Rs. 5,000 Off
    - `SPECIAL15`: 15% VIP Discount on orders above 150K
  - Automatic Free Delivery calculation on orders above Rs. 50,000.
- **Complete Checkout Flow**:
  - Customer Name, Phone, Email, Delivery City (Lahore, Islamabad, Karachi, Gujranwala, etc.), Street Address & Notes.
  - Payment Modes: Cash on Delivery (COD), Direct Bank Transfer, JazzCash / EasyPaisa, Debit/Credit Card.
  - Generates instant Order Invoice with printable receipt.
- **Direct WhatsApp Integration**:
  - Floating WhatsApp Chat button.
  - Individual product "Order via WhatsApp" button with pre-filled message.
  - "Order Cart directly on WhatsApp" generator.
- **Wishlist & Quick View**:
  - Saved favorites drawer with one-click "Move to Cart".
  - Quick View modal with high-res gallery, timber specs, and dimensions.

---

### ⚙️ 2. Comprehensive Admin Panel (`admin.html`)
- **Dashboard Overview**:
  - **Total Revenue (PKR)**: Auto-calculated from all confirmed customer orders.
  - **Total Orders Count**.
  - **Active Products Inventory Count**.
  - **Low Stock Alerts**: Identifies products with $\le$ 4 items remaining.
  - **Recent Orders Table**: Real-time overview of customer requests.
- **Product Inventory Management (Full CRUD)**:
  - Add new furniture items (Title, Category, Price, Stock, Material, Dimensions, Image URL, Description, Badges).
  - Edit existing furniture details and pricing.
  - Delete products with confirmation.
  - Pre-set sample image buttons for quick testing.
- **Customer Orders Management**:
  - Status Switcher: Change order status between `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`.
  - Filter orders by status or search by Customer Name / Phone / Order ID.
  - View & Print official Customer Invoice slip.
- **Coupon Manager**:
  - View, create, and delete promotional discount codes.
- **Store Settings**:
  - Update Mart showroom address, helpline numbers, WhatsApp business number, and delivery fee thresholds.

---

## 🚀 How to Run the Website

Koi heavy setup ya server install karne ki zaroorat nahi hai. Pure **HTML5, CSS3, aur Modern Vanilla JavaScript** par mushtamil hai:

1. **Option 1: Direct File Open**
   - Simply double click [`index.html`](file:///c:/Users/Admin/Downloads/alone/index.html) to open the Storefront in any browser (Chrome, Edge, Firefox, etc.).
   - Double click [`admin.html`](file:///c:/Users/Admin/Downloads/alone/admin.html) to open the Admin Panel Dashboard.

2. **Option 2: Local HTTP Server (Python)**
   Agar aap local web server chalana chahte hain:
   ```bash
   python -m http.server 8000
   ```
   Aur browser me visit karein:
   - Storefront: `http://localhost:8000/index.html`
   - Admin Panel: `http://localhost:8000/admin.html`

---

## 📁 File Structure

```text
alone/
├── index.html          # Main Customer Storefront (Home, Catalog, Cart, Checkout)
├── admin.html          # Store Owner & Admin Panel Dashboard
├── css/
│   ├── style.css       # Luxury Storefront Stylesheet & Responsive Breakpoints
│   └── admin.css       # Admin Dashboard Stylesheet, Sidebar, Tables & Modals
├── js/
│   ├── data.js         # Initial Furniture Catalog, Orders Seed & LocalStorage Layer
│   ├── app.js          # Storefront Interactions, Cart, Search, Filters, Checkout
│   └── admin.js        # Admin Operations, CRUD, Metrics & Status Updates
└── README.md           # Documentation & Guide
```

---

## 💾 Real-Time Synchronization (LocalStorage)
Storefront aur Admin Panel apas me `localStorage` ke zariye mukammal synced hain:
- Jab bhi koi customer Storefront (`index.html`) par order place karta hai, wo fauran Admin Panel (`admin.html`) ke Dashboard aur Orders table me nazar ata hai aur revenue update ho jati hai.
- Jab Admin panel me koi naya product add kiya jata hai ya price/stock change hoti hai, wo foran customer website par reflect hoti hai!
