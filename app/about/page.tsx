import Image from 'next/image';
import Link from 'next/link';
import './about.css';

export default function AboutPage() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>About FAJE</h1>
                    <p className="tagline">New Age Fashion</p>
                </div>
            </section>

            {/* Brand Story */}
            <section className="brand-story">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-content">
                            <h2>Our Story</h2>
                            <p>
                                FAJE is more than just a fashion brand – it's a celebration of the modern woman.
                                Born from a passion for creating pieces that empower, inspire, and elevate, we believe
                                that fashion should be an expression of confidence and individuality.
                            </p>
                            <p>
                                Every piece in our collection is thoughtfully designed to embody feminine strength,
                                contemporary elegance, and timeless sophistication. We craft garments for women who
                                dare to stand out, who embrace their boldness, and who refuse to compromise on quality.
                            </p>
                        </div>
                        <div className="story-image">
                            <div className="image-wrapper">
                                <Image
                                    src="/images/hero.png"
                                    alt="FAJE Fashion"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="values-section">
                <div className="container">
                    <h2 className="section-title">What We Stand For</h2>

                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Feminine Confidence</h3>
                            <p>
                                We design for women who embrace their femininity with confidence and grace.
                                Each piece is crafted to make you feel powerful and beautiful.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Modern Silhouettes</h3>
                            <p>
                                Our collections feature contemporary cuts and designs that blend timeless
                                elegance with modern aesthetics for the new age woman.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Premium Quality</h3>
                            <p>
                                We believe in creating pieces that last. Every garment is made with the
                                finest fabrics and meticulous attention to detail.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Bold Expression</h3>
                            <p>
                                Fashion is a form of self-expression. We create pieces for women who aren't
                                afraid to make a statement and stand out from the crowd.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <h2>Explore Our Collections</h2>
                    <p>Discover pieces designed for the bold, feminine & confident</p>
                    <Link href="/categories" className="btn btn-primary">
                        Shop Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
