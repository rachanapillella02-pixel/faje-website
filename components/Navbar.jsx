'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../app/context/CartContext';
import './Navbar.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link href="/" className="navbar-logo">
                    <Image
                        src="/logo.png"
                        alt="FAJE - New Age Fashion"
                        width={200}
                        height={70}
                        priority
                        style={{ objectFit: 'contain', width: 'auto', height: '60px' }}
                    />
                </Link>

                {/* Desktop Navigation */}
                <ul className="navbar-menu">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/categories">Categories</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/lookbook">Lookbook</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>

                {/* Cart Icon */}
                <Link href="/cart" className="navbar-cart" id="navbar-cart-icon">
                    <ShoppingBag size={24} />
                    {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="navbar-mobile">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/categories" onClick={() => setIsMenuOpen(false)}>Categories</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link href="/lookbook" onClick={() => setIsMenuOpen(false)}>Lookbook</Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                </div>
            )}
        </nav>
    );
}
