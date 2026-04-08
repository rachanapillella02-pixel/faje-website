import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <h2 className="footer-logo">FAJE</h2>
                    <p className="footer-tagline">New Age Fashion</p>
                    <p className="footer-description">
                        Designed for the bold, feminine & confident.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/categories">Categories</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/lookbook">Lookbook</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div className="footer-links">
                    <h3>Shop</h3>
                    <ul>
                        <li><Link href="/products/outfits">Outfits</Link></li>
                    </ul>
                </div>

                {/* Connect */}
                 <div className="footer-connect">
                     <h3>Connect With Us</h3>
                     <div className="footer-social">
                         <a
                             href="https://www.instagram.com/withfaje/"
                             target="_blank"
                             rel="noopener noreferrer"
                             aria-label="Instagram"
                         >
                             <Instagram size={24} />
                         </a>
                         <a
                             href="mailto:contact@thefaje.com"
                             aria-label="Email"
                         >
                             <Mail size={24} />
                         </a>
                     </div>
                     <a className="footer-email" href="mailto:contact@thefaje.com">
                         contact@thefaje.com
                     </a>
                 </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} FAJE. All rights reserved.</p>
            </div>
        </footer>
    );
}
