// Al-Usman Furniture Mart - Initial Seed Data & Storage Helper

const INITIAL_PRODUCTS = [
    {
        id: "prod-1",
        name: "Royal Chesterfield Velvet Sofa Set (3+2+1)",
        category: "Living Room",
        price: 185000,
        originalPrice: 220000,
        rating: 4.9,
        reviewsCount: 38,
        stock: 5,
        material: "Solid Sheesham Wood & Turkish Velvet",
        dimensions: "3-Seater: 88\"W x 38\"D x 31\"H",
        badge: "Bestseller",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        description: "Handcrafted master Chesterfield sofa upholstered in premium anti-stain velvet with solid deep button tufting and hand-carved Sheesham wooden feet. Guaranteed luxury comfort for regal living rooms."
    },
    {
        id: "prod-2",
        name: "Grand Imperial King Size Bed with Hydraulic Storage",
        category: "Bedroom",
        price: 215000,
        originalPrice: 260000,
        rating: 5.0,
        reviewsCount: 52,
        stock: 4,
        material: "Teak Wood & High-Density Memory Foam Cushioning",
        dimensions: "King Size: 78\"W x 84\"L x 58\"H",
        badge: "Exclusive",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        description: "An architectural masterpiece featuring a tall cushioned headboard, built-in dual side charging docks, under-bed smooth hydraulic storage, and matching nightstands."
    },
    {
        id: "prod-3",
        name: "Milan Onyx Marble & Brass 8-Seater Dining Set",
        category: "Dining Room",
        price: 275000,
        originalPrice: 320000,
        rating: 4.8,
        reviewsCount: 29,
        stock: 3,
        material: "Imported Italian Marble & PVD Gold Coated Steel",
        dimensions: "Table: 96\"L x 42\"W x 30\"H",
        badge: "Luxury",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
        description: "Natural onyx polished marble top with beveled edges resting on champagne gold electroplated legs. Accompanied by 8 ergonomically contoured dining chairs."
    },
    {
        id: "prod-4",
        name: "Executive Scandinavian Ergonomic Leather Lounge Chair",
        category: "Office",
        price: 68000,
        originalPrice: 85000,
        rating: 4.9,
        reviewsCount: 44,
        stock: 12,
        material: "Top-grain Nappa Leather & Molded Walnut Veneer",
        dimensions: "Chair: 33\"W x 34\"D x 33\"H",
        badge: "Trending",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=800&q=80",
        description: "Classic mid-century silhouette engineered with 360-degree silent swivel, adjustable lumbar tilt, and an accompanying plush ottoman for executive comfort."
    },
    {
        id: "prod-5",
        name: "Nordic Minimalist Oak Wood Coffee Table Set",
        category: "Living Room",
        price: 42000,
        originalPrice: 50000,
        rating: 4.7,
        reviewsCount: 19,
        stock: 8,
        material: "Natural White Oak & Tempered Fluted Glass",
        dimensions: "Diameter: 36\" and 24\" (Nesting pair)",
        badge: "Sale 16% Off",
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80",
        description: "Pair of nesting circular coffee tables featuring ribbed tambour detailing, hidden storage cavity, and water-resistant protective matte finish."
    },
    {
        id: "prod-6",
        name: "Valencia Curved Bouclé Accent Armchair",
        category: "Luxury Lounge",
        price: 54000,
        originalPrice: 65000,
        rating: 4.9,
        reviewsCount: 23,
        stock: 7,
        material: "Cozy Textured Bouclé Fabric & Matte Black Base",
        dimensions: "32\"W x 31\"D x 30\"H",
        badge: "Hot",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        description: "Organic sculptural curves enveloped in cloud-soft French bouclé fabric. Perfect as a statement piece in living spaces, reading nooks, or boutique bedrooms."
    },
    {
        id: "prod-7",
        name: "Sovereign 6-Door Walk-In Mirrored Wardrobe",
        category: "Bedroom",
        price: 195000,
        originalPrice: 230000,
        rating: 4.8,
        reviewsCount: 16,
        stock: 3,
        material: "High Moisture Resistant MDF & Smoked Bronze Glass",
        dimensions: "108\"W x 24\"D x 96\"H",
        badge: "Custom Build",
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=800&q=80",
        description: "Contemporary modular closet system with motion-sensor warm LED strip lighting, jewelry drawer organizers, soft-closing Hettich hinges, and floor-to-ceiling mirror panel doors."
    },
    {
        id: "prod-8",
        name: "Handcrafted Antique Console Table with Mirror",
        category: "Decor & Lighting",
        price: 78000,
        originalPrice: 95000,
        rating: 4.9,
        reviewsCount: 31,
        stock: 6,
        material: "Antique Brass Plating & Hand-carved Walnut",
        dimensions: "52\"W x 16\"D x 34\"H",
        badge: "Artisan",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
        description: "Intricately detailed entryway entryway console featuring baroque floral engravings, matched with an oversized sunburst ornate wall mirror."
    },
    {
        id: "prod-9",
        name: "Zenith Solid Walnut Minimalist Bookshelf",
        category: "Office",
        price: 89000,
        originalPrice: 105000,
        rating: 4.8,
        reviewsCount: 14,
        stock: 5,
        material: "Solid American Walnut Wood",
        dimensions: "48\"W x 15\"D x 78\"H",
        badge: "New Arrival",
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
        description: "Geometric open-shelf unit designed for luxury libraries, home offices, and living room dividers. Heavy-duty construction with scratch-proof Danish oil seal."
    },
    {
        id: "prod-10",
        name: "Riviera Rattan Patio 4-Piece Outdoor Suite",
        category: "Luxury Lounge",
        price: 135000,
        originalPrice: 160000,
        rating: 4.7,
        reviewsCount: 18,
        stock: 4,
        material: "All-Weather Synthetic Wicker & Sunbrella Canvas",
        dimensions: "Loveseat: 60\"W, 2 Chairs, 1 Coffee Table",
        badge: "Waterproof",
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        description: "Weather-resistant, UV-protected all-season outdoor patio set with water-repellent thick cushions and rust-proof aluminum internal framing."
    },
    {
        id: "prod-11",
        name: "Casablanca Tufted Bed Bench / Ottoman",
        category: "Bedroom",
        price: 34000,
        originalPrice: 42000,
        rating: 4.9,
        reviewsCount: 27,
        stock: 10,
        material: "Diamond Quilted Fabric & Gold Chrome Legs",
        dimensions: "50\"W x 18\"D x 19\"H",
        badge: "Popular",
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        description: "Multi-purpose bedroom end bench offering hidden storage under the lift-up cushioned seat. Finished with brushed gold hairpin feet."
    },
    {
        id: "prod-12",
        name: "Aurora Crystal Chandelier & Modern Pendant Light",
        category: "Decor & Lighting",
        price: 58000,
        originalPrice: 72000,
        rating: 5.0,
        reviewsCount: 35,
        stock: 9,
        material: "K9 Faceted Crystals & Warm Dimmable LED System",
        dimensions: "Diameter: 32\" x Adjustable Drop Height",
        badge: "Bestseller",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
        description: "Spectacular cascade lighting fixture that radiates warm ambient glow across dining tables and high-ceiling foyers."
    }
];

const INITIAL_ORDERS = [
    {
        orderId: "ORD-9421",
        customerName: "Chaudhry Kamran",
        customerPhone: "0300-9876543",
        customerEmail: "kamran.lahore@gmail.com",
        city: "Lahore",
        address: "House 45-B, Phase 5 DHA",
        items: [
            { id: "prod-1", name: "Royal Chesterfield Velvet Sofa Set (3+2+1)", price: 185000, qty: 1 }
        ],
        subtotal: 185000,
        discount: 18500,
        delivery: 0,
        total: 166500,
        status: "Processing",
        paymentMethod: "Bank Transfer",
        date: "2026-10-17 14:35"
    },
    {
        orderId: "ORD-9420",
        customerName: "Dr. Fatima Zahra",
        customerPhone: "0321-4567890",
        customerEmail: "fatima.z@hospital.pk",
        city: "Islamabad",
        address: "Sector F-7/2, Street 14, Villa 9",
        items: [
            { id: "prod-2", name: "Grand Imperial King Size Bed with Hydraulic Storage", price: 215000, qty: 1 },
            { id: "prod-11", name: "Casablanca Tufted Bed Bench / Ottoman", price: 34000, qty: 1 }
        ],
        subtotal: 249000,
        discount: 10000,
        delivery: 0,
        total: 239000,
        status: "Shipped",
        paymentMethod: "Cash on Delivery (COD)",
        date: "2026-10-16 11:20"
    },
    {
        orderId: "ORD-9419",
        customerName: "Mian Usman Tariq",
        customerPhone: "0333-8889911",
        customerEmail: "usman.tariq@corp.com",
        city: "Gujranwala",
        address: "Model Town, Main Boulevard",
        items: [
            { id: "prod-4", name: "Executive Scandinavian Ergonomic Leather Lounge Chair", price: 68000, qty: 2 }
        ],
        subtotal: 136000,
        discount: 0,
        delivery: 0,
        total: 136000,
        status: "Delivered",
        paymentMethod: "JazzCash / EasyPaisa",
        date: "2026-10-15 17:45"
    }
];

const INITIAL_SETTINGS = {
    storeName: "Al-Usman Furniture Mart",
    tagline: "Finest Handcrafted Luxury Furniture & Timeless Elegance",
    phone: "+92 300 1234567",
    whatsapp: "923001234567",
    email: "contact@al-usmanfurniture.com",
    address: "Showroom #12-16, Luxury Furniture Boulevard, Main GT Road, Gujranwala / Lahore, Pakistan",
    currency: "PKR",
    currencySymbol: "Rs. ",
    freeDeliveryThreshold: 50000,
    shippingFee: 3500,
    coupons: [
        { code: "ALUSMAN10", discountPercent: 10, minSpend: 50000, description: "10% Flat Discount for Luxury Orders" },
        { code: "FURNITURE5K", discountFlat: 5000, minSpend: 80000, description: "Rs. 5,000 Flat Discount on Furniture Sets" },
        { code: "SPECIAL15", discountPercent: 15, minSpend: 150000, description: "VIP 15% Off on Orders above 150K" }
    ]
};

// Storage Service Wrapper
const DB = {
    getProducts: function() {
        const stored = localStorage.getItem("al_usman_products");
        if (!stored) {
            localStorage.setItem("al_usman_products", JSON.stringify(INITIAL_PRODUCTS));
            return INITIAL_PRODUCTS;
        }
        try {
            return JSON.parse(stored);
        } catch(e) {
            return INITIAL_PRODUCTS;
        }
    },
    saveProducts: function(products) {
        localStorage.setItem("al_usman_products", JSON.stringify(products));
    },
    getOrders: function() {
        const stored = localStorage.getItem("al_usman_orders");
        if (!stored) {
            localStorage.setItem("al_usman_orders", JSON.stringify(INITIAL_ORDERS));
            return INITIAL_ORDERS;
        }
        try {
            return JSON.parse(stored);
        } catch(e) {
            return INITIAL_ORDERS;
        }
    },
    saveOrders: function(orders) {
        localStorage.setItem("al_usman_orders", JSON.stringify(orders));
    },
    getCart: function() {
        const stored = localStorage.getItem("al_usman_cart");
        try {
            return stored ? JSON.parse(stored) : [];
        } catch(e) {
            return [];
        }
    },
    saveCart: function(cart) {
        localStorage.setItem("al_usman_cart", JSON.stringify(cart));
    },
    getWishlist: function() {
        const stored = localStorage.getItem("al_usman_wishlist");
        try {
            return stored ? JSON.parse(stored) : [];
        } catch(e) {
            return [];
        }
    },
    saveWishlist: function(wishlist) {
        localStorage.setItem("al_usman_wishlist", JSON.stringify(wishlist));
    },
    getSettings: function() {
        const stored = localStorage.getItem("al_usman_settings");
        if (!stored) {
            localStorage.setItem("al_usman_settings", JSON.stringify(INITIAL_SETTINGS));
            return INITIAL_SETTINGS;
        }
        try {
            return JSON.parse(stored);
        } catch(e) {
            return INITIAL_SETTINGS;
        }
    },
    saveSettings: function(settings) {
        localStorage.setItem("al_usman_settings", JSON.stringify(settings));
    },
    formatPrice: function(num) {
        return "Rs. " + Number(num || 0).toLocaleString("en-PK");
    }
};
