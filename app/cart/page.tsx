'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, Upload } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
    CHECKOUT_COUPONS,
    FREE_DELIVERY_SUBTOTAL_EXCEEDS,
    IN_MOBILE_E164,
    deliveryChargeForSubtotal,
    getInPhoneDigits,
    isValidCustomerName,
    isValidEmailBasic,
    normalizeInPhoneDigits,
    validateCheckoutCustomer,
} from '@/lib/checkoutPricing';
import { IndianStateCombobox } from '@/components/IndianStateCombobox';
import { isValidIndianPincode, isValidIndianState, normalizeIndianState } from '@/lib/indianAddress';
import './cart.css';

const UPI_NUMBER = process.env.NEXT_PUBLIC_UPI_ID || '9618848356';
const UPI_NAME = 'FAJE';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [isLoaded, setIsLoaded] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [payStep, setPayStep] = useState<'qr' | 'contact' | 'address' | 'upload' | 'done'>('contact');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [qrLoaded, setQrLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '', houseNo: '', street: '', landmark: '', city: '', state: '', pincode: '' });
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        if (CHECKOUT_COUPONS[code]) {
            setCouponApplied(true);
            setCouponError('');
        } else {
            setCouponApplied(false);
            setCouponError('Invalid coupon code. Please try again.');
        }
    };

    const getCouponDiscount = () => {
        const code = couponCode.trim().toUpperCase();
        if (couponApplied && CHECKOUT_COUPONS[code]) {
            return Math.round(total * CHECKOUT_COUPONS[code].discount);
        }
        return 0;
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const total = getTotalPrice();
    const currentDeliveryCharge = deliveryChargeForSubtotal(total);
    const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_SUBTOTAL_EXCEEDS + 1 - total);
    const grandTotal = total + currentDeliveryCharge - getCouponDiscount();

    const canProceedContact =
        isValidCustomerName(customer.name) &&
        isValidEmailBasic(customer.email) &&
        IN_MOBILE_E164.test(customer.phone);

    const canProceedAddress =
        customer.houseNo.trim().length > 0 &&
        customer.street.trim().length > 0 &&
        customer.city.trim().length > 0 &&
        isValidIndianState(customer.state) &&
        isValidIndianPincode(customer.pincode);

    // Build UPI deeplink and QR
    const upiString = `upi://pay?pa=${UPI_NUMBER}@ybl&pn=${encodeURIComponent(UPI_NAME)}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent('FAJE Order')}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}&color=5a2329&bgcolor=ffffff&margin=8`;

    const MAX_PAYMENT_PROOF_BYTES = 10 * 1024 * 1024;

    const handleFile = (f: File | null) => {
        if (!f || !f.type.startsWith('image/')) return;
        if (f.size > MAX_PAYMENT_PROOF_BYTES) {
            alert('Image must be 10 MB or smaller.');
            return;
        }
        setScreenshot(f);
        const reader = new FileReader();
        reader.onloadend = () => setScreenshotPreview(reader.result as string);
        reader.readAsDataURL(f);
    };

    const handleSubmitScreenshot = async () => {
        if (!screenshot) return;
        const pin = customer.pincode.trim();
        const canonicalState = normalizeIndianState(customer.state);
        const fullAddress = `${customer.houseNo}, ${customer.street}${customer.landmark ? ', ' + customer.landmark : ''}, ${customer.city}, ${canonicalState ?? customer.state.trim()} - ${pin}`;
        const customerCheck = validateCheckoutCustomer({
            ...customer,
            state: canonicalState ?? customer.state,
            pincode: pin,
            address: fullAddress,
        });
        if (!customerCheck.ok) {
            alert(customerCheck.message);
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('screenshot', screenshot);
            formData.append('orderData', JSON.stringify({
                subtotal: total,
                deliveryCharge: currentDeliveryCharge,
                couponDiscount: getCouponDiscount(),
                couponCode: couponApplied ? couponCode.trim().toUpperCase() : '',
                total: grandTotal,
                items: cart.map(item => ({ name: item.name, size: item.size, quantity: item.quantity, price: item.price })),
                customer: {
                    ...customer,
                    state: canonicalState!,
                    pincode: pin,
                    address: fullAddress,
                },
            }));

            const res = await fetch('/api/checkout', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setPayStep('done');
                clearCart();
            } else {
                let msg = 'There was a problem uploading your proof. Please try again.';
                try {
                    const err = (await res.json()) as { error?: string };
                    if (err?.error && typeof err.error === 'string') {
                        msg = err.error;
                    }
                } catch {
                    /* ignore */
                }
                alert(msg);
            }
        } catch (error) {
            console.error(error);
            alert('Submission failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openUpiApp = () => {
        window.location.href = upiString;
    };

    const handleCloseModal = () => {
        setShowQR(false);
        setTimeout(() => {
            setPayStep('contact');
            setScreenshot(null);
            setScreenshotPreview(null);
            setCouponCode('');
            setCouponApplied(false);
            setCouponError('');
            setCustomer({ name: '', email: '', phone: '', houseNo: '', street: '', landmark: '', city: '', state: '', pincode: '' });
        }, 300);
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
                            {cart.map((item) => (
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
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery Charges</span>
                                <span>{currentDeliveryCharge > 0 ? `₹${currentDeliveryCharge.toLocaleString('en-IN')}` : <span style={{color: '#28a745', fontWeight: 'bold'}}>FREE</span>}</span>
                            </div>
                            {currentDeliveryCharge > 0 ? (
                                <p style={{ fontSize: 12, color: '#666', margin: '0 0 10px', lineHeight: 1.45 }}>
                                    Free delivery applies only when your subtotal is strictly greater than ₹{FREE_DELIVERY_SUBTOTAL_EXCEEDS.toLocaleString('en-IN')}.
                                    {amountToFreeDelivery > 0 && (
                                        <> Add ₹{amountToFreeDelivery.toLocaleString('en-IN')} more to unlock free delivery.</>
                                    )}
                                </p>
                            ) : (
                                <p style={{ fontSize: 12, color: '#2d6a4f', margin: '0 0 10px', lineHeight: 1.45 }}>
                                    Free delivery — your subtotal is above ₹{FREE_DELIVERY_SUBTOTAL_EXCEEDS.toLocaleString('en-IN')}.
                                </p>
                            )}

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                            </div>

                            {/* UPI Pay Button */}
                            <button
                                className="btn btn-upi-pay"
                                onClick={() => { setShowQR(true); setPayStep('contact'); setScreenshot(null); setScreenshotPreview(null); setQrLoaded(false); }}
                            >
                                Pay ₹{grandTotal.toLocaleString('en-IN')} via UPI
                            </button>

                            <Link href="/categories" className="continue-shopping">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* ── UPI QR Modal ─────────────────────────────── */}
            {showQR && (
                <div className="upi-modal-overlay" onClick={() => setShowQR(false)}>
                    <div className="upi-modal" onClick={e => e.stopPropagation()}>

                        {/* Close */}
                        <button
                            onClick={handleCloseModal}
                            style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', zIndex: 50, color: '#000', padding: '8px' }}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>

                        {payStep === 'qr' && (
                            <>
                                <div className="upi-modal-header">
                                    <div className="upi-badge">Step 3 of 4: UPI Payment</div>
                                    <p className="upi-amount">₹{grandTotal.toLocaleString('en-IN')}</p>
                                    <p className="upi-to">Pay to <strong>{UPI_NAME}</strong></p>
                                </div>

                                <div className="upi-qr-wrap">
                                    {!qrLoaded && (
                                        <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ animation: 'scan 1.5s linear infinite', color: '#5a2329' }}>
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="16 32" strokeLinecap="round" />
                                                <style>{`@keyframes scan { 100% { transform: rotate(360deg); } }`}</style>
                                            </svg>
                                        </div>
                                    )}
                                    {/* Real dynamic QR generated from amount */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={qrUrl}
                                        alt="UPI QR Code"
                                        width={200}
                                        height={200}
                                        style={{ display: qrLoaded ? 'block' : 'none', borderRadius: 8 }}
                                        onLoad={() => setQrLoaded(true)}
                                    />
                                </div>

                                <div className="upi-apps-row">
                                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(a => (
                                        <span key={a} className="upi-app-tag">{a}</span>
                                    ))}
                                </div>

                                <button className="btn btn-upi-app" onClick={openUpiApp}>
                                    Open UPI App
                                </button>

                                <button className="btn btn-paid" onClick={() => setPayStep('upload')}>
                                    ✓ I Have Paid — Proceed to Upload
                                </button>

                                <button className="btn btn-upi-app" onClick={() => setPayStep('address')} style={{ marginTop: 8 }}>
                                    ← Back to Details
                                </button>
                            </>
                        )}

                        {payStep === 'contact' && (
                            <>
                                <div className="upi-modal-header">
                                    <div className="upi-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Step 1 of 4</div>
                                    <h3 style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>Contact Information</h3>
                                    <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                                        Please provide your contact details
                                    </p>
                                </div>

                                <div className="checkout-form" style={{ marginTop: 0, paddingTop: 10, borderTop: 'none' }}>
                                    <input type="text" placeholder="Full Name *" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className="form-input" required />
                                    <input type="email" placeholder="Email Address *" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} className="form-input" required />
                                    <div>
                                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5a2329', marginBottom: 6 }}>Mobile number *</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontWeight: 600, color: '#5a2329', fontSize: 15, flexShrink: 0 }}>+91</span>
                                            <input
                                                type="tel"
                                                inputMode="numeric"
                                                autoComplete="tel-national"
                                                placeholder="9876543210"
                                                value={getInPhoneDigits(customer.phone)}
                                                onChange={e => setCustomer({ ...customer, phone: normalizeInPhoneDigits(e.target.value) })}
                                                className="form-input"
                                                style={{ flex: 1, marginBottom: 0 }}
                                                maxLength={10}
                                                pattern="[6-9][0-9]{9}"
                                                title="Enter 10 digits starting with 6, 7, 8, or 9"
                                                aria-invalid={getInPhoneDigits(customer.phone).length > 0 && !IN_MOBILE_E164.test(customer.phone)}
                                            />
                                        </div>
                                        <p style={{ fontSize: 11, color: '#888', marginTop: 6, marginBottom: 0 }}>
                                            10-digit Indian mobile (starts with 6–9)
                                        </p>
                                    </div>

                                    <button
                                        className="btn btn-paid"
                                        onClick={() => setPayStep('address')}
                                        disabled={!canProceedContact}
                                        style={{ marginTop: 12, opacity: !canProceedContact ? 0.7 : 1 }}
                                     >
                                        Next: Delivery Address →
                                    </button>
                                </div>

                                <button className="btn btn-upi-app" onClick={handleCloseModal} style={{ marginTop: 8 }}>
                                    Cancel
                                </button>
                            </>
                        )}

                        {payStep === 'address' && (
                            <>
                                <div className="upi-modal-header">
                                    <div className="upi-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Step 2 of 4</div>
                                    <h3 style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>Delivery Details</h3>
                                    <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                                        Where should we send your order?
                                    </p>
                                </div>

                                <div className="checkout-form" style={{ marginTop: 0, paddingTop: 10, borderTop: 'none' }}>
                                    <input type="text" placeholder="House / Flat Number *" value={customer.houseNo} onChange={e => setCustomer({ ...customer, houseNo: e.target.value })} className="form-input" required />
                                    <input type="text" placeholder="Street / Area *" value={customer.street} onChange={e => setCustomer({ ...customer, street: e.target.value })} className="form-input" required />
                                    <input type="text" placeholder="Landmark (Optional)" value={customer.landmark} onChange={e => setCustomer({ ...customer, landmark: e.target.value })} className="form-input" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <input type="text" placeholder="City *" value={customer.city} onChange={e => setCustomer({ ...customer, city: e.target.value })} className="form-input" required />
                                        <IndianStateCombobox
                                            value={customer.state}
                                            onChange={(state) => setCustomer({ ...customer, state })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="postal-code"
                                            placeholder="PIN code * (6 digits)"
                                            value={customer.pincode}
                                            onChange={e => setCustomer({ ...customer, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                            className="form-input"
                                            required
                                            maxLength={6}
                                            pattern="[1-9][0-9]{5}"
                                            title="6-digit Indian PIN (first digit 1–9)"
                                            aria-invalid={customer.pincode.length > 0 && !isValidIndianPincode(customer.pincode)}
                                        />
                                        <p style={{ fontSize: 11, color: '#888', marginTop: 6, marginBottom: 0 }}>
                                            Valid 6-digit PIN (cannot start with 0)
                                        </p>
                                    </div>

                                    {/* Coupon Code */}
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#5a2329', marginTop: 14, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Coupon Code</p>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={e => { setCouponCode(e.target.value); setCouponApplied(false); setCouponError(''); }}
                                            className="form-input"
                                            style={{ flex: 1, marginBottom: 0 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            style={{ padding: '0 16px', background: '#5a2329', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >Apply</button>
                                    </div>
                                    {couponApplied && (
                                        <p style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 600 }}>✓ {CHECKOUT_COUPONS[couponCode.trim().toUpperCase()]?.label}</p>
                                    )}
                                    {couponError && (
                                        <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{couponError}</p>
                                    )}

                                    {/* Concise Order Total */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf6f6', borderRadius: 8, padding: '12px 14px', marginTop: 14 }}>
                                        <span style={{ fontWeight: 600, color: '#5a2329', fontSize: 14 }}>Amount Payable</span>
                                        <span style={{ fontWeight: 700, fontSize: 16, color: '#5a2329' }}>
                                            ₹{grandTotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <button
                                        className="btn btn-paid"
                                        onClick={() => setPayStep('qr')}
                                        disabled={!canProceedAddress}
                                        style={{ marginTop: 12, opacity: !canProceedAddress ? 0.7 : 1 }}
                                    >
                                        Proceed to Payment →
                                    </button>
                                </div>

                                <button className="btn btn-upi-app" onClick={() => setPayStep('contact')} style={{ marginTop: 8 }}>
                                    ← Back to Contact Info
                                </button>
                            </>
                        )}

                        {payStep === 'upload' && (
                            <>
                                <div className="upi-modal-header">
                                    <div className="upi-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Step 4 of 4</div>
                                    <h3 style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>Upload Payment Screenshot</h3>
                                    <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                                        Upload your ₹{grandTotal.toLocaleString('en-IN')} payment proof to confirm your order
                                    </p>
                                </div>

                                {screenshotPreview ? (
                                    <div style={{ position: 'relative', margin: '16px 0' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={screenshotPreview} alt="payment screenshot" style={{ width: '100%', borderRadius: 12, maxHeight: 180, objectFit: 'cover' }} />
                                        <button onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                                            style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                        <p style={{ fontSize: 12, color: '#059669', marginTop: 6, fontWeight: 600 }}>✓ Screenshot ready to send</p>
                                    </div>
                                ) : (
                                    <label
                                        className={`upi-drop-zone${dragOver ? ' drag-over' : ''}`}
                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                                    >
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0] ?? null)} />
                                        <div style={{ marginBottom: 12, color: 'var(--color-wine)', display: 'flex', justifyContent: 'center' }}>
                                            <Upload size={34} strokeWidth={1.5} />
                                        </div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Tap to upload screenshot</p>
                                        <p style={{ fontSize: 11, color: '#bbb', marginTop: 3 }}>or drag & drop · PNG, JPG, WEBP</p>
                                    </label>
                                )}

                                {screenshotPreview && (
                                    <button
                                        className="btn btn-paid"
                                        onClick={handleSubmitScreenshot}
                                        disabled={isSubmitting}
                                        style={{ marginTop: 12, opacity: isSubmitting ? 0.7 : 1 }}
                                    >
                                        {isSubmitting ? 'Processing Order...' : 'Complete Order'}
                                    </button>
                                )}

                                <button className="btn btn-upi-app" onClick={() => setPayStep('qr')} style={{ marginTop: 8 }}>
                                    ← Back to Payment Details
                                </button>
                            </>
                        )}

                        {payStep === 'done' && (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>All done!</h3>
                                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 20 }}>
                                    Your order has been processed securely. We&apos;ll notify you once your payment is confirmed!
                                </p>
                                <button className="btn btn-paid" onClick={handleCloseModal}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
