'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './cart.css';

interface CartItem {
    id: string;
    name: string;
    price: number;
    size: string;
    image: string;
    quantity: number;
}

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleWhatsAppCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        let message = 'Hi, I would like to purchase the following items from FAJE:\n\n';

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (Size: ${item.size}) x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
        });

        message += `\nTotal: ₹${getTotalPrice().toLocaleString('en-IN')}`;

        const whatsappUrl = `https://wa.me/919000848356?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (!isLoaded) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="loading">Loading cart...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="cart-title">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <ShoppingBag size={80} />
                        <h2>Your cart is empty</h2>
                        <p>Discover our beautiful collections and add items to your cart</p>
                        <Link href="/categories" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {cart.map((item, index) => (
                                <div key={`${item.id}-${item.size}`} className="cart-item">
                                    <div className="item-image">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="item-size">Size: {item.size}</p>
                                        <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, -1)}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, 1)}
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        <p>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>

                                    <button
                                        className="item-remove"
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                            </div>

                            <button className="btn btn-whatsapp" onClick={handleWhatsAppCheckout}>
                                <MessageCircle size={20} />
                                Proceed via WhatsApp
                            </button>

                            <Link href="/categories" className="continue-shopping">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
