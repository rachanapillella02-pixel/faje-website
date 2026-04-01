'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, use } from 'react';
import { getProductsByCategory, getCategoryBySlug } from '../../data/products';
import './products.css';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    video?: string;
    category: string;
}

export default function ProductsPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = use(params);
    const category = getCategoryBySlug(resolvedParams.category);
    const products: Product[] = getProductsByCategory(resolvedParams.category);

    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

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

    const handleMouseEnter = (productId: string, hasVideo: boolean) => {
        setHoveredProduct(productId);
        if (hasVideo && videoRefs.current[productId]) {
            videoRefs.current[productId]!.currentTime = 0;
            videoRefs.current[productId]!.play().catch(() => {});
        }
    };

    const handleMouseLeave = (productId: string, hasVideo: boolean) => {
        setHoveredProduct(null);
        if (hasVideo && videoRefs.current[productId]) {
            videoRefs.current[productId]!.pause();
            videoRefs.current[productId]!.currentTime = 0;
        }
    };

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
                        {products.map((product) => {
                            const hasVideo = !!product.video;
                            const isHovered = hoveredProduct === product.id;

                            return (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="product-card"
                                    onMouseEnter={() => handleMouseEnter(product.id, hasVideo)}
                                    onMouseLeave={() => handleMouseLeave(product.id, hasVideo)}
                                >
                                    <div className="product-image" style={{ position: 'relative', overflow: 'hidden' }}>
                                        {/* Default image — always rendered, hidden on hover if video */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            opacity: (hasVideo && isHovered) ? 0 : 1,
                                            transition: 'opacity 0.3s ease',
                                            zIndex: 1
                                        }}>
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Video — only for products with a video */}
                                        {hasVideo && (
                                            <video
                                                ref={(el) => { videoRefs.current[product.id] = el; }}
                                                src={product.video}
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                style={{
                                                    position: 'absolute', inset: 0,
                                                    width: '100%', height: '100%',
                                                    objectFit: 'cover',
                                                    opacity: isHovered ? 1 : 0,
                                                    transition: 'opacity 0.3s ease',
                                                    zIndex: 2
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </Link>
                            );
                        })}
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
