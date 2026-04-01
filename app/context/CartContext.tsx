'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';

type CartItem = {
    id: string;
    name: string;
    price: number;
    size: string;
    image: string;
    quantity: number;
};

type ModalState = {
    isOpen: boolean;
    type: 'ALERT' | 'SUCCESS';
    message: string;
    item?: CartItem; // The item involved in the action
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, startRect?: DOMRect) => void;
    updateQuantity: (id: string, size: string, delta: number) => void;
    removeFromCart: (id: string, size: string) => void;
    clearCart: () => void;
    showModal: (message: string, type?: 'ALERT' | 'SUCCESS') => void;
    closeModal: () => void;
    cartCount: number;
    modalState: ModalState;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: 'ALERT',
        message: '',
    });

    // Flying animation state
    const [flyingItem, setFlyingItem] = useState<{
        image: string;
        start: { x: number; y: number; width: number };
        target: { x: number; y: number };
    } | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Failed to parse cart from local storage', error);
        }
    }, []);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>, startRect?: DOMRect) => {
        // Animation Logic
        if (startRect) {
            const cartIcon = document.getElementById('navbar-cart-icon');
            if (cartIcon) {
                const targetRect = cartIcon.getBoundingClientRect();
                setFlyingItem({
                    image: newItem.image,
                    start: {
                        x: startRect.left,
                        y: startRect.top,
                        width: startRect.width
                    },
                    target: {
                        x: targetRect.left + targetRect.width / 2,
                        y: targetRect.top + targetRect.height / 2
                    }
                });

                // Reset flying item after animation
                setTimeout(() => setFlyingItem(null), 800);
            }
        }

        // State update
        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === newItem.id && item.size === newItem.size);
            if (existingIndex >= 0) {
                const newCart = [...prev];
                newCart[existingIndex].quantity += 1;

                // Show Success Modal with Updated Item
                setModalState({
                    isOpen: true,
                    type: 'SUCCESS',
                    message: 'Added to cart!',
                    item: newCart[existingIndex]
                });

                return newCart;
            } else {
                const itemWithQty = { ...newItem, quantity: 1 };

                // Show Success Modal with New Item
                setModalState({
                    isOpen: true,
                    type: 'SUCCESS',
                    message: 'Added to cart!',
                    item: itemWithQty
                });

                return [...prev, itemWithQty];
            }
        });
    };

    const updateQuantity = (id: string, size: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === id && item.size === size) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const removeFromCart = (id: string, size: string) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
    };

    const clearCart = () => setCart([]);

    const showModal = (message: string, type: 'ALERT' | 'SUCCESS' = 'ALERT') => {
        setModalState({ isOpen: true, type, message });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, showModal, closeModal, cartCount, modalState }}>
            {children}
            {/* Global Modal */}
            <GlobalCartModal state={modalState} cart={cart} onClose={closeModal} onUpdateQty={updateQuantity} />

            {/* Flying Image Animation Element */}
            {flyingItem && (
                <div
                    style={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        width: flyingItem.start.width, // Start size same as button or thumbnail
                        height: flyingItem.start.width, // Square aspect
                        backgroundImage: `url(${flyingItem.image})`,
                        backgroundSize: 'cover',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        animation: 'flyToCart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                        // Use CSS vars to pass dynamic coords
                        // @ts-expect-error custom CSS properties
                        '--start-x': `${flyingItem.start.x}px`,
                        '--start-y': `${flyingItem.start.y}px`,
                        '--target-x': `${flyingItem.target.x}px`,
                        '--target-y': `${flyingItem.target.y}px`,
                    }}
                    className="flying-cart-item"
                />
            )}
        </CartContext.Provider>
    );
}

function GlobalCartModal({ state, cart, onClose, onUpdateQty }: { state: ModalState, cart: CartItem[], onClose: () => void, onUpdateQty: (id: string, size: string, delta: number) => void }) {
    if (!state.isOpen) return null;

    // Get live item data from cart to reflect quantity updates
    const currentItem = state.item ? (cart.find(i => i.id === state.item!.id && i.size === state.item!.size) || state.item) : undefined;

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal-content" onClick={e => e.stopPropagation()}>
                {state.type === 'ALERT' ? (
                    <div className="cart-modal-alert">
                        <div className="modal-icon-alert">!</div>
                        <p>{state.message}</p>
                        <button onClick={onClose} className="modal-btn-ok">OK</button>
                    </div>
                ) : (
                    <div className="cart-modal-success">
                        <div className="modal-header">
                            <span className="modal-check">✓</span>
                            <h3>{state.message}</h3>
                        </div>

                        {currentItem && (
                            <div className="modal-item-preview">
                                <Image src={currentItem.image} alt={currentItem.name} width={60} height={80} style={{ objectFit: 'cover' }} />
                                <div className="modal-item-details">
                                    <h4>{currentItem.name}</h4>
                                    <p className="modal-item-meta">{currentItem.size} • ₹{currentItem.price.toLocaleString()}</p>

                                    <div className="modal-qty-control">
                                        <button onClick={() => onUpdateQty(currentItem.id, currentItem.size, -1)} disabled={currentItem.quantity <= 1}>−</button>
                                        <span>{currentItem.quantity}</span>
                                        <button onClick={() => onUpdateQty(currentItem.id, currentItem.size, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={onClose} className="modal-btn-continue">Continue Shopping</button>
                            <a href="/cart" className="modal-btn-view">View Cart</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
