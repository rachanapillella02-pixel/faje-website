import { Instagram, Mail } from 'lucide-react';
import './contact.css';

export default function ContactPage() {
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
                                href="mailto:contact@faje.com"
                                className="contact-method"
                            >
                                <div className="method-icon">
                                    <Mail size={32} />
                                </div>
                                <div className="method-details">
                                    <h3>Email</h3>
                                    <p>contact@faje.com</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <form className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
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
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
