'use client';

import { useRef, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Play } from 'lucide-react';
import { getProductById, getProductsByCategory } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './product.css';

function ImageWithLoader({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      {!isLoaded && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f8f8f8', borderRadius: '4px'
        }}>
          <div style={{
            width: '20px', height: '20px',
            border: '2px solid #e0e0e0',
            borderTopColor: '#5a2329',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover', opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    images: string[];
    video?: string;
    sizes: string[];
    fabric: string;
    care: string;
    description: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const product: Product | undefined = getProductById(resolvedParams.id);
    const [selectedSize, setSelectedSize] = useState('');
    // currentImageIndex: 0...(images.length-1) = image; images.length = video
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart, showModal, cart, updateQuantity } = useCart();
    const addToCartBtnRef = useRef<HTMLButtonElement>(null);

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

    const hasVideo = !!product.video;
    const videoIndex = product.images.length; // virtual index for the video tile
    const isShowingVideo = hasVideo && currentImageIndex === videoIndex;

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
            {product.images.map((image, index) => {
              return (
                <div
                  key={index}
                  className={`thumbnail-item ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{ position: 'relative' }}
                >
                  <ImageWithLoader
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                  />
                </div>
              );
            })}

                        {/* Video thumbnail tile */}
                        {hasVideo && (
                            <div
                                className={`thumbnail-item ${isShowingVideo ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(videoIndex)}
                                style={{
                                    background: '#111',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                {/* first frame preview */}
                                <video
                                    src={product.video}
                                    muted
                                    preload="metadata"
                                    style={{
                                        position: 'absolute', inset: 0,
                                        width: '100%', height: '100%',
                                        objectFit: 'cover',
                                        opacity: 0.5
                                    }}
                                />
                                <div style={{
                                    position: 'relative', zIndex: 2,
                                    background: 'rgba(255,255,255,0.9)',
                                    borderRadius: '50%',
                                    width: 32, height: 32,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Play size={16} fill="#5a2329" color="#5a2329" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Center: Main Display (Image or Video) */}
                    <div className="main-product-image" style={{ position: 'relative' }}>
                        {isShowingVideo ? (
                            <video
                                key="product-video"
                                src={product.video}
                                controls
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: 0, left: 0
                                }}
                            />
                        ) : (
                            <Image
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        )}

                        {/* Navigation Arrows */}
                        {currentImageIndex > 0 && (
                            <button
                                onClick={() => setCurrentImageIndex(i => i - 1)}
                                style={{
                                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    color: '#5a2329', fontSize: 20, fontWeight: 'bold'
                                }}
                                aria-label="Previous image"
                            >
                                &#10094;
                            </button>
                        )}
                        {currentImageIndex < (hasVideo ? product.images.length : product.images.length - 1) && (
                            <button
                                onClick={() => setCurrentImageIndex(i => i + 1)}
                                style={{
                                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    color: '#5a2329', fontSize: 20, fontWeight: 'bold'
                                }}
                                aria-label="Next image"
                            >
                                &#10095;
                            </button>
                        )}
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
