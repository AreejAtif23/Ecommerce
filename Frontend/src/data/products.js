// src/data/products.js
export const products = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 2999,
    category: "Electronics",
    rating: 4.8,
    description: "Premium headphones with 40hr battery life, active noise cancellation, and deep bass.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
    ]
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    price: 1999,
    category: "Electronics",
    rating: 4.6,
    description: "Fitness tracker with heart rate monitor, GPS, and 7-day battery life.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"
    ]
  },
  {
    id: 3,
    name: "Minimalist Backpack",
    price: 899,
    category: "Fashion",
    rating: 4.7,
    description: "Water-resistant laptop backpack with USB charging port.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500"
    ]
  },
  {
    id: 4,
    name: "Cotton T-Shirt Pack",
    price: 499,
    category: "Fashion",
    rating: 4.5,
    description: "Pack of 3 premium cotton t-shirts, breathable fabric.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"
    ]
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 1299,
    category: "Electronics",
    rating: 4.9,
    description: "RGB gaming mouse with 16000 DPI, programmable buttons.",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500"
    ]
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug",
    price: 299,
    category: "Home",
    rating: 4.4,
    description: "Handmade ceramic mug, dishwasher safe, 350ml capacity.",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500"
    ]
  },
  {
    id: 7,
    name: "Desk Lamp",
    price: 799,
    category: "Home",
    rating: 4.6,
    description: "LED desk lamp with adjustable brightness and color temperature.",
    images: [
      "https://images.unsplash.com/photo-1507473886765-bc3406f0e7e4?w=500",
      "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500"
    ]
  },
  {
    id: 8,
    name: "Running Shoes",
    price: 2499,
    category: "Fashion",
    rating: 4.7,
    description: "Lightweight running shoes with memory foam insole.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
    ]
  },
  {
    id: 9,
    name: "Power Bank 20000mAh",
    price: 1499,
    category: "Electronics",
    rating: 4.8,
    description: "Fast charging power bank with dual USB ports.",
    images: [
      "https://images.unsplash.com/photo-1609592425631-6931aed3edba?w=500",
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500"
    ]
  },
  {
    id: 10,
    name: "Yoga Mat",
    price: 599,
    category: "Sports",
    rating: 4.5,
    description: "Non-slip eco-friendly yoga mat with carrying strap.",
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
    ]
  },
  {
    id: 11,
    name: "Wireless Keyboard",
    price: 1799,
    category: "Electronics",
    rating: 4.7,
    description: "Slim wireless keyboard with numeric keypad, 2-year battery life.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      "https://images.unsplash.com/photo-1618384887929-16ec33add9a1?w=500"
    ]
  },
  {
    id: 12,
    name: "Sunglasses",
    price: 1299,
    category: "Fashion",
    rating: 4.6,
    description: "Polarized UV protection sunglasses, classic design.",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    ]
  }
];

export const categories = [...new Set(products.map(p => p.category))];