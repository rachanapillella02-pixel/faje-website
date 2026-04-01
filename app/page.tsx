'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import './page.css';

function HoverVideoCard({ href, imageSrc, videoSrc, title, price }: { href: string; imageSrc: string; videoSrc: string; title: string; price: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video auto-play prevented:', e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link 
      href={href} 
      className="nc-card" 
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="nc-category-tag">Outfits</span>
      <div className="nc-image-wrapper" style={{ position: 'relative' }}>
        <Image 
          src={imageSrc} 
          alt={title} 
          fill 
          style={{ 
            objectFit: 'cover', 
            objectPosition: 'top',
            opacity: isHovered ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }} 
        />
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
      <h3 className="nc-product-title">{title}</h3>
      <div className="nc-card-bottom">
        <span className="nc-price">{price}</span>
        <span className="nc-add-btn"><ArrowRight size={18} /></span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">✦</div>
          <p className="hero-label">TIMELESS ELEGANCE</p>
          <h1 className="hero-headline">
            Discover the <br />
            <span className="headline-emphasis">beauty</span> of fashion
          </h1>
          <Link href="/categories" className="hero-cta-large">
            Explore Collections <ArrowRight size={20} />
          </Link>
        </div>
        <div className="hero-image">
          <Image
            src="/images/hero.png"
            alt="FAJE New Age Fashion"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Featured Grid Section */}
      <section className="featured-grid">
        <div className="container">
          <div className="grid-layout">
            {/* Large Feature - Dresses */}
            <Link href="/products/dresses" className="grid-item large">
              <div className="grid-image">
                <Image
                  src="/images/categories/dresses.png"
                  alt="Dresses Collection"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="grid-content">
                <h2>Elegant Dresses</h2>
                <p>Timeless pieces for every occasion</p>
                <span className="grid-link">Shop Now →</span>
              </div>
            </Link>

            {/* Medium Feature - Tops */}
            <div className="grid-item medium">
              <div className="grid-image">
                <Image
                  src="/actual-files/outfit1/18-03-2026 vika6495.jpg"
                  alt="Tops Collection"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="grid-content">
                <h3>Sophisticated Tops</h3>
              </div>
            </div>

            {/* Medium Feature - Bottoms */}
            <div className="grid-item medium">
              <div className="grid-image">
                <Image
                  src="/actual-files/outfit3/18-03-2026 vika6542.jpg"
                  alt="Bottoms Collection"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="grid-content">
                <h3>Tailored Bottoms</h3>
              </div>
            </div>

            {/* Small Feature - Text Block */}
            <div className="grid-item small text-block">
              <h3>New Season</h3>
              <p>Discover our latest collection of premium pieces designed for the modern woman.</p>
            </div>

            {/* Large Feature - Outfits */}
            <Link href="/products/outfits" className="grid-item large-horizontal">
              <div className="grid-image">
                <Image
                  src="/images/categories/outfits.png"
                  alt="Outfits Collection"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="grid-content">
                <h2>Complete Outfits</h2>
                <p>Effortlessly chic co-ord sets</p>
                <span className="grid-link">Shop Collection →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Showcase Section - Inspired by Jewelry Reference */}
      <section className="showcase-section">
        <div className="showcase-container">
          {/* Left Column */}
          <div className="showcase-left">
            <div className="showcase-image-small">
              <Image
                src="/images/products/dress/dress-wine-1.png"
                alt="Premium Dress"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <p className="showcase-desc">
              We craft timeless pieces for the modern woman who values elegance.
            </p>
            <div className="showcase-cta-wrapper">
              <h3 className="showcase-subtitle">
                Find best <span className="italic-emphasis">Fashion</span><br />
                for your wardrobe
              </h3>
              <Link href="/categories" className="showcase-btn">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Center Column */}
          <div className="showcase-center">
            <h2 className="showcase-headline">
              Embrace timeless with <br />
              <span className="headline-italic">exclusive</span> fashion
              designs
            </h2>
            <div className="showcase-model-image">
              <Image
                src="/images/hero.png"
                alt="FAJE Fashion Model"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="showcase-right">
            <div className="showcase-sparkles">✦ ✦</div>
            <div className="product-card-featured">
              <h4 className="product-card-title">Silk Midi Dress</h4>
              <div className="product-card-image">
                <Image
                  src="/actual-files/outfit2/18-03-2026 vika6513.jpg"
                  alt="Silk Midi Dress"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <Link href="/product/dress-001" className="product-card-cta">
                VIEW DETAILS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-content">
            <h2>The FAJE Philosophy</h2>
            <p>
              We believe in creating pieces that empower women to express their unique style.
              Each garment is thoughtfully designed with premium fabrics and meticulous attention
              to detail, ensuring you look and feel your absolute best.
            </p>
            <Link href="/about" className="text-link">
              Learn More About Us →
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Feature Section */}
      <section className="dual-feature">
        <div className="feature-block">
          <div className="feature-content">
            <h2 className=' color-white'>Timeless Elegance</h2>
            <p>Pieces designed to transcend seasons and trends</p>
            <Link href="/products/dresses" className="btn btn-light">
              Shop Dresses
            </Link>
          </div>
        </div>
        <div className="feature-block image-bg">
          <Image
            src="/images/categories/dresses.png"
            alt="Fashion Collection"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Why Choose FAJE */}
      <section className="why-choose">
        <div className="container">
          <h2 className="section-title">Why Choose FAJE</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Premium Quality</h3>
              <p>Only the finest fabrics and materials, sourced from trusted suppliers worldwide.</p>
            </div>
            <div className="feature-card">
              <h3>Timeless Design</h3>
              <p>Contemporary pieces that blend modern aesthetics with classic elegance.</p>
            </div>
            <div className="feature-card">
              <h3>Perfect Fit</h3>
              <p>Thoughtfully tailored to flatter and celebrate the feminine form.</p>
            </div>
            {/* <div className="feature-card">
              <h3>Sustainable</h3>
              <p>Committed to ethical production and sustainable fashion practices.</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <p className="cta-eyebrow">Discover Your Style</p>
          <h2>Elevate Your Wardrobe</h2>
          <p className="cta-description">Explore our curated collections of premium pieces</p>
          <Link href="/categories" className="cta-button">
            Shop Collections
          </Link>
        </div>
      </section>

      {/* New Collections Section - Clean & White */}
      <section className="new-collections-section">
        <div className="new-collections-container">
          <div className="new-collections-header">
            <h2 className="nc-title">New <span className="nc-title-italic">fashion</span> collections</h2>
            <div className="nc-action">
              <Link href="/categories" className="nc-view-link">VIEW COLLECTION</Link>
              <Link href="/categories" className="nc-arrow-btn">
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="nc-scroll-container">

            {/* Outfit 1 */}
            <HoverVideoCard
                href="/product/outfit-001"
                imageSrc="/actual-files/outfit1/1.jpg"
                videoSrc="/actual-files/outfit1/1-compressed.mp4"
                title="Outfit 1"
                price="₹5"
            />

            {/* Outfit 2 */}
            <HoverVideoCard
                href="/product/outfit-002"
                imageSrc="/actual-files/outfit2/18-03-2026 vika6511.jpg"
                videoSrc="/actual-files/outfit2/2-compressed.mp4"
                title="Outfit 2"
                price="₹4"
            />

            {/* Outfit 3 */}
            <HoverVideoCard
                href="/product/outfit-003"
                imageSrc="/actual-files/outfit3/18-03-2026 vika6539.jpg"
                videoSrc="/actual-files/outfit3/3-compressed.mp4"
                title="Outfit 3"
                price="₹5"
            />

          </div>
        </div>
      </section>
    </div >
  );
}
