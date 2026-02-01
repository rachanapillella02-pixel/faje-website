'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, use } from 'react';
import { getProductsByCategory, getCategoryBySlug } from '../../data/products';
import './products.css';

export default function ProductsPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = use(params);
    const category = getCategoryBySlug(resolvedParams.category);
    const products = getProductsByCategory(resolvedParams.category);

    // State for hover effect
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    if (!category) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>Category Not Found</h1>
                <Link href="/categories" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                    Back to Categories
                </Link>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="container">
                {/* Category Header */}
                <div className="category-header">
                    <h1>{category.name}</h1>
                    <p>{category.description}</p>
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span> / </span>
                        <Link href="/categories">Categories</Link>
                        <span> / </span>
                        <span>{category.name}</span>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="products-grid">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="product-card"
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                <div className="product-image">
                                    <Image
                                        src={
                                            hoveredProduct === product.id && product.images[1]
                                                ? product.images[1]
                                                : product.images[0]
                                        }
                                        alt={product.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No products available in this category yet.</p>
                        <Link href="/categories" className="btn btn-primary">
                            Explore Other Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
