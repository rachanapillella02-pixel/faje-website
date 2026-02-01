import Link from 'next/link';
import Image from 'next/image';
import { categories } from '../data/products';
import './categories.css';

export default function CategoriesPage() {
    return (
        <div className="categories-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Our Collections</h1>
                    <p>Explore our curated selection of premium fashion pieces</p>
                </div>

                {/* Categories Grid */}
                <div className="categories-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products/${category.slug}`}
                            className="category-card"
                        >
                            <div className="category-image">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="category-overlay">
                                    <h2>{category.name}</h2>
                                    <p>{category.description}</p>
                                    <span className="category-cta">Shop Now →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
