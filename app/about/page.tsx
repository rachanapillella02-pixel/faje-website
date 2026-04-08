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
                                FAJÉ was created to bridge the gap between aspirational style and attainable reality. 
                                We believe that luxury should feel personal, and equally important—it should feel possible.
                            </p>
                            <p>
                                Our brand sits in a unique space—delivering strong design identity, modern Indo-Western aesthetics, 
                                and confident styling. We remove the hesitation from fashion, allowing you to confidently 
                                express your ambition and modern identity without waiting for &quot;someday.&quot;
                            </p>
                        </div>
                        <div className="story-image">
                            <div className="image-wrapper">
                                <video
                                    src="/actual-files/outfit2/2-compressed.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
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
                            <h3>Modern & Confident</h3>
                            <p>
                                Fashion that feels fresh, distinct, and empowering. Designed for people who want to feel 
                                confident and proud of what they wear.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Premium Yet Attainable</h3>
                            <p>
                                We offer quality construction and premium styling with realistic pricing. 
                                It&apos;s not just about admiring an outfit—it&apos;s about confidently making it yours.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Relatable Identity</h3>
                            <p>
                                The face of FAJÉ represents everyday fashion-forward individuals—creators, professionals, 
                                and students who are building their presence.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Psychological Accessibility</h3>
                            <p>
                                We don&apos;t communicate exclusivity; we communicate confidence. We want you to know: 
                                You don&apos;t need permission to feel confident, and you don&apos;t need to wait.
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
