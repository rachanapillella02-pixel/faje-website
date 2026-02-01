import Image from 'next/image';
import './lookbook.css';

export default function LookbookPage() {
    const lookbookImages = [
        { id: 1, src: '/images/hero.png', alt: 'FAJE Collection 1' },
        { id: 2, src: '/images/categories/dresses.png', alt: 'FAJE Collection 2' },
        { id: 3, src: '/images/categories/co-ords.png', alt: 'FAJE Collection 3' },
        { id: 4, src: '/images/categories/ethnic.png', alt: 'FAJE Collection 4' },
        { id: 5, src: '/images/categories/party.png', alt: 'FAJE Collection 5' },
        { id: 6, src: '/images/categories/tops.png', alt: 'FAJE Collection 6' },
    ];

    return (
        <div className="lookbook-page">
            <div className="container">
                {/* Page Header */}
                <div className="lookbook-header">
                    <h1>Lookbook</h1>
                    <p>A visual journey through our latest collections</p>
                </div>

                {/* Lookbook Grid */}
                <div className="lookbook-grid">
                    {lookbookImages.map((image, index) => (
                        <div
                            key={image.id}
                            className={`lookbook-item ${index % 5 === 0 ? 'large' : ''}`}
                        >
                            <div className="lookbook-image">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
