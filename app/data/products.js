// Categories Data
export const categories = [
    {
        id: 'dresses',
        name: 'Dresses',
        slug: 'dresses',
        description: 'Elegant dresses for every occasion',
        image: '/images/categories/dresses.png'
    },
    {
        id: 'tops',
        name: 'Tops',
        slug: 'tops',
        description: 'Sophisticated blouses and tops',
        image: '/images/categories/tops.png'
    },
    {
        id: 'bottoms',
        name: 'Bottoms',
        slug: 'bottoms',
        description: 'Tailored trousers and skirts',
        image: '/images/categories/bottoms.png'
    },
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
        name: 'Power Suit Set',
        category: 'outfits',
        price: 5,
        images: [
            '/images/categories/outfits.png',
            '/images/categories/outfits.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Wool Blend',
        care: 'Dry clean only',
        description: 'Matching wine-colored blazer and trousers set. Impeccable tailoring for the modern professional.'
    },
    {
        id: 'outfit-002',
        name: 'Linen Co-ord Set',
        category: 'outfits',
        price: 4,
        images: [
            '/images/categories/bottoms.png',
            '/images/categories/tops.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Premium Linen',
        care: 'Machine wash cold',
        description: 'Matching linen blazer and shorts set. Perfect for summer sophistication.'
    },
    {
        id: 'outfit-003',
        name: 'Silk Coord Set',
        category: 'outfits',
        price: 5,
        images: [
            '/images/products/tops/top-silk-1.png',
            '/images/categories/bottoms.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Pure Silk',
        care: 'Dry clean only',
        description: 'Luxurious silk top and skirt set. Effortless elegance for any occasion.'
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
