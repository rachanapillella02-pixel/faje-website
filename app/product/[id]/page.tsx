'use client';

import { useRef, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, MessageCircle, Heart, Plus, Minus } from 'lucide-react';
import { getProductById, getProductsByCategory } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './product.css';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const product = getProductById(resolvedParams.id);
    const [selectedSize, setSelectedSize] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart, showModal, cart, updateQuantity } = useCart();
    const addToCartBtnRef = useRef<HTMLButtonElement>(null);

    // Check if item is already in cart
    const cartItem = selectedSize ? cart.find(item => item.id === product?.id && item.size === selectedSize) : undefined;
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>Product Not Found</h1>
                <Link href="/categories" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                    Back to Categories
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
            showModal('Please select a size', 'ALERT');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            size: selectedSize,
            image: product.images[0]
        }, addToCartBtnRef.current?.getBoundingClientRect());
    };

    const handleWhatsAppPurchase = () => {
        if (!selectedSize) {
            showModal('Please select a size', 'ALERT');
            return;
        }

        const message = `Hi, I'm interested in buying the FAJE ${product.name} (Size: ${selectedSize}) - ₹${product.price.toLocaleString('en-IN')}`;
        const whatsappUrl = `https://wa.me/919000848356?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link href="/">Home</Link>
                    <span> / </span>
                    <Link href="/categories">Shop</Link>
                    <span> / </span>
                    <Link href={`/products/${product.category}`}>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Link>
                </div>

                {/* Product Detail Grid */}
                <div className="product-detail-container">
                    {/* Left: Thumbnail Gallery */}
                    <div className="thumbnail-column">
                        {product.images.map((image, index) => (
                            <div
                                key={index}
                                className={`thumbnail-item ${currentImageIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Center: Main Product Image */}
                    <div className="main-product-image">
                        <Image
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>

                    {/* Right: Product Info */}
                    <div className="product-info-panel">
                        <h1 className="product-name">{product.name}</h1>

                        <div className="product-price-section">
                            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="tax-info">Tax included.</span>
                        </div>

                        <div className="product-description">
                            <p>{product.description}</p>
                        </div>

                        {/* Size Selector */}
                        <div className="size-section">
                            <div className="size-header">
                                <label>Size</label>
                                <Link href="#" className="size-guide">Size Chart</Link>
                            </div>
                            <div className="size-grid">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="product-meta">
                            <div className="meta-row">
                                <span className="meta-label">Fabric:</span>
                                <span className="meta-value">{product.fabric}</span>
                            </div>
                            <div className="meta-row">
                                <span className="meta-label">Care:</span>
                                <span className="meta-value">{product.care}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="product-actions">
                            {quantityInCart > 0 ? (
                                <div className="qty-control-wrapper">
                                    <div className="qty-control-btn-group">
                                        <button
                                            onClick={() => updateQuantity(product.id, selectedSize, -1)}
                                            className="qty-btn"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="qty-value">{quantityInCart}</span>
                                        <button
                                            onClick={() => updateQuantity(product.id, selectedSize, 1)}
                                            className="qty-btn"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="qty-label">Added to Cart</div>
                                </div>
                            ) : (
                                <button
                                    className="action-btn primary"
                                    onClick={handleAddToCart}
                                    ref={addToCartBtnRef}
                                >
                                    Add to Cart
                                </button>
                            )}

                            <button
                                className="action-btn whatsapp"
                                onClick={handleWhatsAppPurchase}
                            >
                                <MessageCircle size={18} />
                                Buy via WhatsApp
                            </button>
                        </div>

                        <Link href="/cart" className="view-cart-link">
                            View Shopping Cart
                        </Link>

                        {/* Additional Info */}
                        <div className="additional-info">
                            <details>
                                <summary>Description</summary>
                                <p>{product.description}</p>
                            </details>
                            <details>
                                <summary>Shipping & Returns</summary>
                                <p>Free shipping on orders above ₹2,999. Easy returns within 7 days.</p>
                            </details>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                <div className="similar-products-section">
                    <h2 className="similar-products-title">
                        You Might Also Like
                    </h2>
                    <div className="similar-products-grid">
                        {getProductsByCategory(product.category)
                            .filter(p => p.id !== product.id)
                            .slice(0, 3)
                            .map(similarProduct => (
                                <Link href={`/product/${similarProduct.id}`} key={similarProduct.id} className="similar-product-card">
                                    <div className="similar-product-image-wrapper">
                                        <Image
                                            src={similarProduct.images[0]}
                                            alt={similarProduct.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="similar-product-info">
                                        <h3 className="similar-product-name">
                                            {similarProduct.name}
                                        </h3>
                                        <p className="similar-product-price">
                                            ₹{similarProduct.price.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
