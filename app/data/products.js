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
        image: '/actual-files/outfit3/18-03-2026 vika6549.jpg'
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        fabric: 'Silk Crepe',
        care: 'Dry clean only',
        description: 'Elegant pleated midi skirt in silk crepe. Timeless piece for refined styling.'
    },

    // OUTFITS
    {
        id: 'outfit-001',
        name: 'The Shimmer Set',
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        fabric: 'Textured Shimmer Blend',
        care: 'Dry clean only',
        description: 'Make a striking entrance with The Shimmer Set. This captivating ensemble features a beautifully ruched azure halter-neck crop top paired with a matching draped maxi skirt. The dramatic thigh-high slit and textured shimmer fabric create dynamic movement and an unforgettable silhouette for evening events.'
    },
    {
        id: 'outfit-002',
        name: 'The Satin Edit',
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        fabric: 'Premium Silk Satin',
        care: 'Dry clean only',
        description: 'The Satin Edit redefines modern elegance. Crafted from rich, fluid maroon satin, this stunning piece features delicate straps, a contemporary waist cutout detail, and a confident high thigh slit. It is thoughtfully draped to flatter the feminine form and exude quiet luxury.'
    },
    {
        id: 'outfit-003',
        name: 'The White Drape',
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
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        fabric: 'Silk Crepe & Premium Blend',
        care: 'Dry clean only',
        description: 'A masterclass in contrast, The White Drape is the pinnacle of modern Indo-Western luxury. It features a sweeping, asymmetrical white one-shoulder drape that cascades beautifully, perfectly balanced by exceptionally tailored black wide-leg trousers for a bold, powerful look.'
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
