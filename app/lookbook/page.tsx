import Image from 'next/image';
import './lookbook.css';

type LookbookItem =
    | { id: number; type: 'image'; src: string; alt: string }
    | { id: number; type: 'video'; src: string; poster: string };

export default function LookbookPage() {
    const lookbookItems: LookbookItem[] = [
        // Outfit 1
        { id: 1, type: 'image', src: '/actual-files/outfit1/18-03-2026 vika6495.jpg', alt: 'Outfit 1 — Look A' },
        { id: 2, type: 'image', src: '/actual-files/outfit1/18-03-2026 vika6482.jpg', alt: 'Outfit 1 — Look B' },
        { id: 3, type: 'video', src: '/actual-files/outfit1/1-compressed.mp4', poster: '/actual-files/outfit1/18-03-2026 vika6495.jpg' },
        // Outfit 2
        { id: 4, type: 'image', src: '/actual-files/outfit2/18-03-2026 vika6511.jpg', alt: 'Outfit 2 — Look A' },
        { id: 5, type: 'image', src: '/actual-files/outfit2/18-03-2026 vika6521.jpg', alt: 'Outfit 2 — Look B' },
        { id: 6, type: 'video', src: '/actual-files/outfit2/2-compressed.mp4', poster: '/actual-files/outfit2/18-03-2026 vika6511.jpg' },
        // Outfit 3
        { id: 7, type: 'image', src: '/actual-files/outfit3/18-03-2026 vika6539.jpg', alt: 'Outfit 3 — Look A' },
        { id: 8, type: 'image', src: '/actual-files/outfit3/18-03-2026 vika6549.jpg', alt: 'Outfit 3 — Look B' },
        { id: 9, type: 'video', src: '/actual-files/outfit3/3-compressed.mp4', poster: '/actual-files/outfit3/18-03-2026 vika6539.jpg' },
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
                    {lookbookItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`lookbook-item ${index % 5 === 0 ? 'large' : ''}`}
                        >
                            <div className="lookbook-image">
                                {item.type === 'video' ? (
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster={item.poster}
                                    >
                                        <source src={item.src} type="video/mp4" />
                                    </video>
                                ) : (
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
