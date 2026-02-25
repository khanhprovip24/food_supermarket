// export const categories = [
//   {
//     id: 1,
//     name: 'Rau Củ Tươi',
//     slug: 'vegetables',
//     icon: '🥬',
//     description: 'Rau củ sạch, tươi mỗi ngày',
//     color: 'bg-green-100',
//   },
//   {
//     id: 2,
//     name: 'Thịt Tươi',
//     slug: 'meat',
//     icon: '🥩',
//     description: 'Thịt nguồn gốc rõ ràng',
//     color: 'bg-red-100',
//   },
//   {
//     id: 3,
//     name: 'Trái Cây',
//     slug: 'fruits',
//     icon: '🍎',
//     description: 'Trái cây ngon, giàu vitamin',
//     color: 'bg-yellow-100',
//   },
//   {
//     id: 4,
//     name: 'Hải Sản',
//     slug: 'seafood',
//     icon: '🦐',
//     description: 'Hải sản tươi sống',
//     color: 'bg-blue-100',
//   },
//   {
//     id: 5,
//     name: 'Trứng & Sữa',
//     slug: 'dairy',
//     icon: '🥚',
//     description: 'Sản phẩm từ trang trại',
//     color: 'bg-orange-100',
//   },
//   {
//     id: 6,
//     name: 'Gia Vị',
//     slug: 'spices',
//     icon: '🌶️',
//     description: 'Gia vị tự nhiên',
//     color: 'bg-purple-100',
//   },
// ];

// export const products = [
//   // Rau củ
//   {
//     id: 1,
//     name: 'Cải Xanh Hữu Cơ',
//     slug: 'cai-xanh-huu-co',
//     category: 'vegetables',
//     categoryId: 1,
//     price: 15000,
//     originalPrice: 20000,
//     discount: 25,
//     unit: 'bó',
//     stock: 45,
//     image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
//     images: [
//       'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
//       'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500',
//     ],
//     description: 'Cải xanh hữu cơ trồng theo phương pháp tự nhiên, không thuốc trừ sâu. Giàu vitamin K, C và chất xơ.',
//     rating: 4.8,
//     reviewCount: 127,
//     isFeatured: true,
//     isNew: true,
//     tags: ['Organic', 'Healthy', 'Fresh'],
//     nutritionInfo: {
//       calories: 23,
//       protein: '2.3g',
//       fiber: '2.6g',
//       vitaminC: '36mg',
//     },
//   },
//   {
//     id: 2,
//     name: 'Cà Chua Bi Cherry',
//     slug: 'ca-chua-bi-cherry',
//     category: 'vegetables',
//     categoryId: 1,
//     price: 35000,
//     originalPrice: null,
//     discount: 0,
//     unit: 'kg',
//     stock: 32,
//     image: 'https://images.unsplash.com/photo-1546470427-227e9e3c1b48?w=500',
//     images: ['https://images.unsplash.com/photo-1546470427-227e9e3c1b48?w=500'],
//     description: 'Cà chua bi ngọt tự nhiên, giàu lycopene và chất chống oxy hóa. Thích hợp ăn sống hoặc nấu ăn.',
//     rating: 4.9,
//     reviewCount: 89,
//     isFeatured: true,
//     isNew: false,
//     tags: ['Sweet', 'Antioxidant'],
//   },
//   {
//     id: 3,
//     name: 'Rau Muống Tươi',
//     slug: 'rau-muong-tuoi',
//     category: 'vegetables',
//     categoryId: 1,
//     price: 12000,
//     originalPrice: 15000,
//     discount: 20,
//     unit: 'bó',
//     stock: 78,
//     image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
//     description: 'Rau muống giòn ngon, giàu chất sắt và canxi, tốt cho sức khỏe.',
//     rating: 4.6,
//     reviewCount: 56,
//     isFeatured: false,
//     isNew: false,
//     tags: ['Fresh', 'Iron-rich'],
//   },

//   // Thịt
//   {
//     id: 4,
//     name: 'Thịt Ba Chỉ Heo Sạch',
//     slug: 'thit-ba-chi-heo-sach',
//     category: 'meat',
//     categoryId: 2,
//     price: 120000,
//     originalPrice: null,
//     discount: 0,
//     unit: 'kg',
//     stock: 25,
//     image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=500',
//     description: 'Thịt ba chỉ heo từ trang trại sạch, nuôi theo tiêu chuẩn VietGAP. Thịt mềm, thơm ngon.',
//     rating: 4.7,
//     reviewCount: 143,
//     isFeatured: true,
//     isNew: false,
//     tags: ['VietGAP', 'Premium Quality'],
//   },
//   {
//     id: 5,
//     name: 'Ức Gà Không Xương',
//     slug: 'uc-ga-khong-xuong',
//     category: 'meat',
//     categoryId: 2,
//     price: 95000,
//     originalPrice: 110000,
//     discount: 14,
//     unit: 'kg',
//     stock: 18,
//     image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500',
//     description: 'Ức gà tươi không xương, protein cao, ít chất béo. Lý tưởng cho thực đơn ăn kiêng.',
//     rating: 4.9,
//     reviewCount: 201,
//     isFeatured: true,
//     isNew: true,
//     tags: ['High Protein', 'Low Fat', 'Healthy'],
//   },

//   // Trái cây
//   {
//     id: 6,
//     name: 'Táo Fuji Nhật Bản',
//     slug: 'tao-fuji-nhat-ban',
//     category: 'fruits',
//     categoryId: 3,
//     price: 65000,
//     originalPrice: 80000,
//     discount: 19,
//     unit: 'kg',
//     stock: 42,
//     image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
//     description: 'Táo Fuji nhập khẩu từ Nhật Bản, giòn ngọt, giàu vitamin C và chất xơ.',
//     rating: 5.0,
//     reviewCount: 312,
//     isFeatured: true,
//     isNew: false,
//     tags: ['Import', 'Premium', 'Vitamin C'],
//   },
//   {
//     id: 7,
//     name: 'Cam Sành Hà Tĩnh',
//     slug: 'cam-sanh-ha-tinh',
//     category: 'fruits',
//     categoryId: 3,
//     price: 45000,
//     originalPrice: null,
//     discount: 0,
//     unit: 'kg',
//     stock: 67,
//     image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500',
//     description: 'Cam sành đặc sản Hà Tĩnh, vị ngọt thanh, nhiều nước. Giàu vitamin C tự nhiên.',
//     rating: 4.8,
//     reviewCount: 178,
//     isFeatured: false,
//     isNew: false,
//     tags: ['Local Product', 'Juicy'],
//   },

//   // Hải sản
//   {
//     id: 8,
//     name: 'Tôm Sú Tươi',
//     slug: 'tom-su-tuoi',
//     category: 'seafood',
//     categoryId: 4,
//     price: 280000,
//     originalPrice: 320000,
//     discount: 13,
//     unit: 'kg',
//     stock: 15,
//     image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500',
//     description: 'Tôm sú size to, tươi sống, nuôi tại vùng biển sạch. Thịt tôm chắc, ngọt tự nhiên.',
//     rating: 4.9,
//     reviewCount: 95,
//     isFeatured: true,
//     isNew: true,
//     tags: ['Fresh Seafood', 'Premium'],
//   },

//   // Trứng & Sữa
//   {
//     id: 9,
//     name: 'Trứng Gà Omega-3',
//     slug: 'trung-ga-omega-3',
//     category: 'dairy',
//     categoryId: 5,
//     price: 55000,
//     originalPrice: null,
//     discount: 0,
//     unit: 'vỉ 10 quả',
//     stock: 89,
//     image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500',
//     description: 'Trứng gà giàu Omega-3, từ gà chăn thả tự nhiên. Lòng đỏ màu cam đậm, dinh dưỡng cao.',
//     rating: 4.7,
//     reviewCount: 234,
//     isFeatured: false,
//     isNew: false,
//     tags: ['Omega-3', 'Free Range'],
//   },
//   {
//     id: 10,
//     name: 'Sữa Tươi Organic',
//     slug: 'sua-tuoi-organic',
//     category: 'dairy',
//     categoryId: 5,
//     price: 38000,
//     originalPrice: null,
//     discount: 0,
//     unit: 'lít',
//     stock: 52,
//     image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
//     description: 'Sữa tươi nguyên chất từ bò hữu cơ, không chất bảo quản, giàu canxi và protein.',
//     rating: 4.8,
//     reviewCount: 167,
//     isFeatured: true,
//     isNew: true,
//     tags: ['Organic', 'No Preservatives'],
//   },
// ];

// export default { categories, products };

const mockProducts = [
  // 🥬 RAU CỦ
  {
    id: 1,
    name: "Rau cải xanh",
    slug: "rau-cai-xanh",
    category: "Rau củ",
    price: 15000,
    unit: "bó",
    image: "/images/rau-cai-xanh.jpg",
    description: "Rau cải xanh tươi, thu hoạch trong ngày."
  },
  {
    id: 2,
    name: "Cà rốt Đà Lạt",
    slug: "ca-rot-da-lat",
    category: "Rau củ",
    price: 18000,
    unit: "kg",
    image: "/images/ca-rot.jpg",
    description: "Cà rốt giòn ngọt, giàu vitamin A."
  },
  {
    id: 3,
    name: "Bông cải xanh",
    slug: "bong-cai-xanh",
    category: "Rau củ",
    price: 25000,
    unit: "cái",
    image: "/images/bong-cai.jpg",
    description: "Bông cải xanh tươi, sạch, an toàn."
  },

  // 🍎 TRÁI CÂY
  {
    id: 4,
    name: "Táo Fuji",
    slug: "tao-fuji",
    category: "Trái cây",
    price: 45000,
    unit: "kg",
    image: "/images/tao.jpg",
    description: "Táo Fuji nhập khẩu, ngọt tự nhiên."
  },
  {
    id: 5,
    name: "Cam sành",
    slug: "cam-sanh",
    category: "Trái cây",
    price: 30000,
    unit: "kg",
    image: "/images/cam.jpg",
    description: "Cam sành mọng nước, nhiều vitamin C."
  },

  // 🥩 THỊT
  {
    id: 6,
    name: "Thịt ba chỉ heo",
    slug: "thit-ba-chi-heo",
    category: "Thịt",
    price: 120000,
    unit: "kg",
    image: "/images/ba-chi.jpg",
    description: "Ba chỉ heo tươi mỗi ngày, mềm ngon."
  },
  {
    id: 7,
    name: "Thịt bò thăn",
    slug: "thit-bo-than",
    category: "Thịt",
    price: 250000,
    unit: "kg",
    image: "/images/bo-than.jpg",
    description: "Thịt bò thăn mềm, thích hợp làm steak."
  },
  {
    id: 8,
    name: "Ức gà phi lê",
    slug: "uc-ga-phi-le",
    category: "Thịt",
    price: 95000,
    unit: "kg",
    image: "/images/uc-ga.jpg",
    description: "Ức gà tươi, ít mỡ, giàu protein."
  },

  // 🐟 CÁ
  {
    id: 9,
    name: "Cá hồi Na Uy",
    slug: "ca-hoi-na-uy",
    category: "Cá",
    price: 320000,
    unit: "kg",
    image: "/images/ca-hoi.jpg",
    description: "Cá hồi tươi nhập khẩu, giàu omega-3."
  },
  {
    id: 10,
    name: "Cá basa phi lê",
    slug: "ca-basa-phi-le",
    category: "Cá",
    price: 85000,
    unit: "kg",
    image: "/images/ca-basa.jpg",
    description: "Cá basa phi lê tươi ngon."
  },

  // 🦐 HẢI SẢN
  {
    id: 11,
    name: "Tôm sú",
    slug: "tom-su",
    category: "Hải sản",
    price: 220000,
    unit: "kg",
    image: "/images/tom-su.jpg",
    description: "Tôm sú tươi sống, chắc thịt."
  },
  {
    id: 12,
    name: "Mực ống",
    slug: "muc-ong",
    category: "Hải sản",
    price: 190000,
    unit: "kg",
    image: "/images/muc-ong.jpg",
    description: "Mực ống tươi, ngọt tự nhiên."
  },

  // 🥚 TRỨNG
  {
    id: 13,
    name: "Trứng gà ta (10 quả)",
    slug: "trung-ga-ta",
    category: "Trứng",
    price: 35000,
    unit: "vỉ",
    image: "/images/trung-ga.jpg",
    description: "Trứng gà ta sạch, giàu dinh dưỡng."
  },

  // 🥔 KHÁC
  {
    id: 14,
    name: "Khoai tây Đà Lạt",
    slug: "khoai-tay-da-lat",
    category: "Rau củ",
    price: 20000,
    unit: "kg",
    image: "/images/khoai-tay.jpg",
    description: "Khoai tây tươi, thích hợp chiên hoặc nấu canh."
  },
  {
    id: 15,
    name: "Dưa leo",
    slug: "dua-leo",
    category: "Rau củ",
    price: 12000,
    unit: "kg",
    image: "/images/dua-leo.jpg",
    description: "Dưa leo giòn mát, tươi mỗi ngày."
  }
];

export const fetchProductBySlug = (slug) => {
  return mockProducts.find((product) => product.slug === slug);
};

export default mockProducts;

