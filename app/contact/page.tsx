'use client';

import { useState } from 'react';
import { Instagram, Mail } from 'lucide-react';
import './contact.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
            <div className="container">
                {/* Page Header */}
                <div className="contact-header">
                    <h1>Get In Touch</h1>
                    <p>We&apos;d love to hear from you</p>
                </div>

                {/* Contact Grid */}
                <div className="contact-grid">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <h2>Connect With Us</h2>
                        <p className="contact-description">
                            Have questions about our products or need styling advice?
                            Reach out to us through any of these channels.
                        </p>

                        <div className="contact-methods">
                            <a
                                href="https://www.instagram.com/withfaje/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-method"
                            >
                                <div className="method-icon">
                                    <Instagram size={32} />
                                </div>
                                <div className="method-details">
                                    <h3>Instagram</h3>
                                    <p>@withfaje</p>
                                </div>
                            </a>

                            <a
                                href="mailto:contact@thefaje.com"
                                className="contact-method"
                            >
                                <div className="method-icon">
                                    <Mail size={32} />
                                </div>
                                <div className="method-details">
                                    <h3>Email</h3>
                                    <p>contact@thefaje.com</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>

                            {status === 'success' && (
                                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '0.9rem' }}>
                                    Your message was sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            
                            {status === 'error' && (
                                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.9rem' }}>
                                    There was an error sending your message. Please try again or email us directly.
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={status === 'submitting'}
                                style={{ opacity: status === 'submitting' ? 0.7 : 1 }}
                            >
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
