// Categories Data
export const categories = [
    // {
    //     id: 'dresses',
    //     name: 'Dresses',
    //     slug: 'dresses',
    //     description: 'Elegant dresses for every occasion',
    //     image: '/images/categories/dresses.png'
    // },
    // {
    //     id: 'tops',
    //     name: 'Tops',
    //     slug: 'tops',
    //     description: 'Sophisticated blouses and tops',
    //     image: '/images/categories/tops.png'
    // },
    // {
    //     id: 'bottoms',
    //     name: 'Bottoms',
    //     slug: 'bottoms',
    //     description: 'Tailored trousers and skirts',
    //     image: '/images/categories/bottoms.png'
    // },
    {
        id: 'outfits',
        name: 'Outfits',
        slug: 'outfits',
        description: 'Complete co-ord sets and ensembles',
        image: '/images/categories/outfits.png'
    }
];

// Products Data
export const products = [
    // DRESSES
    {
        id: 'dress-001',
        name: 'Silk Midi Dress',
        category: 'dresses',
        price: 5,
        images: [
            '/images/products/dress/dress-wine-1.png',
            '/images/products/dress/dress-beige-1.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Premium Silk',
        care: 'Dry clean only',
        description: 'An elegant wine-colored silk midi dress featuring a sophisticated silhouette. Perfect for evening events and special occasions.'
    },
    {
        id: 'dress-002',
        name: 'Linen Maxi Dress',
        category: 'dresses',
        price: 4,
        images: [
            '/images/products/dress/dress-beige-1.png',
            '/images/products/dress/dress-wine-1.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Premium Linen',
        care: 'Machine wash cold',
        description: 'A flowing beige linen maxi dress with elegant draping. Breathable and perfect for warm weather elegance.'
    },
    {
        id: 'dress-003',
        name: 'Wrap Dress',
        category: 'dresses',
        price: 5,
        images: [
            '/images/products/dress/dress-001-1.png',
            '/images/products/dress/dress-002-1.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Silk Blend',
        care: 'Dry clean only',
        description: 'Classic wrap dress in luxurious silk blend. Flattering silhouette with adjustable fit.'
    },

    // TOPS
    {
        id: 'top-001',
        name: 'Silk Blouse',
        category: 'tops',
        price: 3,
        images: [
            '/images/products/tops/top-silk-1.png',
            '/images/products/tops/top-001-1.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Pure Silk',
        care: 'Dry clean only',
        description: 'Luxurious cream silk blouse with elegant draping. Versatile piece for both professional and casual settings.'
    },
    {
        id: 'top-002',
        name: 'Oversized Shirt',
        category: 'tops',
        price: 2,
        images: [
            '/images/products/tops/top1.png',
            '/images/products/tops/top2.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Cotton Poplin',
        care: 'Machine wash cold',
        description: 'Contemporary oversized shirt in premium cotton. Perfect for effortless chic styling.'
    },
    {
        id: 'top-003',
        name: 'Puff Sleeve Top',
        category: 'tops',
        price: 3,
        images: [
            '/images/products/tops/top3.png',
            '/images/products/tops/top5.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Silk Satin',
        care: 'Dry clean only',
        description: 'Romantic puff sleeve top in luxurious silk satin. Statement piece for special occasions.'
    },
    {
        id: 'top-004',
        name: 'Classic Blouse',
        category: 'tops',
        price: 2,
        images: [
            '/images/products/tops/top6.png',
            '/images/products/tops/op4.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Cotton Blend',
        care: 'Machine wash cold',
        description: 'Timeless blouse design in premium cotton blend. A wardrobe essential for any occasion.'
    },

    // BOTTOMS
    {
        id: 'bottom-001',
        name: 'Tailored Trousers',
        category: 'bottoms',
        price: 4,
        images: [
            '/images/products/bottoms/bot1.png',
            '/images/products/bottoms/bot2.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Wool Blend',
        care: 'Dry clean only',
        description: 'High-waisted tailored trousers in neutral beige. Impeccable fit with premium tailoring.'
    },
    {
        id: 'bottom-002',
        name: 'Wide Leg Pants',
        category: 'bottoms',
        price: 4,
        images: [
            '/images/products/bottoms/bot3.png',
            '/images/products/bottoms/bot5.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Linen Blend',
        care: 'Machine wash cold',
        description: 'Flowing wide-leg pants in premium linen blend. Comfortable and sophisticated.'
    },
    {
        id: 'bottom-003',
        name: 'Pleated Skirt',
        category: 'bottoms',
        price: 3,
        images: [
            '/images/products/bottoms/bot6.png',
            '/images/products/bottoms/bot.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Silk Crepe',
        care: 'Dry clean only',
        description: 'Elegant pleated midi skirt in silk crepe. Timeless piece for refined styling.'
    },

    // OUTFITS
    {
        id: 'outfit-001',
        name: 'Outfit 1',
        category: 'outfits',
        price: 5,
        images: [
            '/actual-files/outfit1/1.jpg',
            '/actual-files/outfit1/18-03-2026 vika6479.jpg',
            '/actual-files/outfit1/18-03-2026 vika6482.jpg',
            '/actual-files/outfit1/18-03-2026 vika6484.jpg',
            '/actual-files/outfit1/18-03-2026 vika6485.jpg',
            '/actual-files/outfit1/18-03-2026 vika6488.jpg',
            '/actual-files/outfit1/18-03-2026 vika6493.jpg',
            '/actual-files/outfit1/18-03-2026 vika6495.jpg',
        ],
        video: '/actual-files/outfit1/1.mp4',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Premium Blend',
        care: 'Dry clean only',
        description: 'A stunning complete outfit set captured in our latest collection shoot. Effortlessly elegant and versatile for any occasion.'
    },
    {
        id: 'outfit-002',
        name: 'Outfit 2',
        category: 'outfits',
        price: 4,
        images: [
            '/actual-files/outfit2/18-03-2026 vika6511.jpg',
            '/actual-files/outfit2/18-03-2026 vika6513.jpg',
            '/actual-files/outfit2/18-03-2026 vika6518.jpg',
            '/actual-files/outfit2/18-03-2026 vika6521.jpg',
            '/actual-files/outfit2/18-03-2026 vika6528.jpg',
            '/actual-files/outfit2/18-03-2026 vika6532.jpg',
        ],
        video: '/actual-files/outfit2/2.mp4',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Premium Linen',
        care: 'Machine wash cold',
        description: 'A beautifully crafted ensemble from the FAJE collection. Light, breathable fabric perfect for a polished everyday look.'
    },
    {
        id: 'outfit-003',
        name: 'Outfit 3',
        category: 'outfits',
        price: 5,
        images: [
            '/actual-files/outfit3/18-03-2026 vika6539.jpg',
            '/actual-files/outfit3/18-03-2026 vika6542.jpg',
            '/actual-files/outfit3/18-03-2026 vika6545.jpg',
            '/actual-files/outfit3/18-03-2026 vika6547.jpg',
            '/actual-files/outfit3/18-03-2026 vika6549.jpg',
            '/actual-files/outfit3/18-03-2026 vika6550.jpg',
        ],
        video: '/actual-files/outfit3/3.mp4',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Pure Silk',
        care: 'Dry clean only',
        description: 'Luxurious coordinated set from the FAJE signature line. An impeccable silhouette for refined, modern styling.'
    }
];

// Helper Functions
export function getProductsByCategory(categorySlug) {
    return products.filter(product => product.category === categorySlug);
}

export function getProductById(id) {
    return products.find(product => product.id === id);
}

export function getFeaturedProducts() {
    return products.slice(0, 6);
}

export function getCategoryBySlug(slug) {
    return categories.find(category => category.slug === slug);
}
