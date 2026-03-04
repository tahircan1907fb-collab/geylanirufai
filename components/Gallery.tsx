import React, { useEffect, useState, useCallback } from 'react';
import SectionTitle from './SectionTitle';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { X, ZoomIn } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const FALLBACK_IMAGES: GalleryImage[] = [
  { id: 1, src: 'https://picsum.photos/800/600?random=1', alt: 'Zikir Halkası', category: 'Zikir' },
  { id: 2, src: 'https://picsum.photos/800/600?random=2', alt: 'Sohbet Meclisi', category: 'Sohbet' },
  { id: 3, src: 'https://picsum.photos/800/600?random=3', alt: 'İftar Programı', category: 'Özel' },
];

const ALL_FILTER = 'Tümü';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const sectionRef = useScrollReveal();

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = Array.isArray(data) ? data : [];
        setImages(normalized.length > 0 ? normalized : FALLBACK_IMAGES);
      } catch {
        setImages(FALLBACK_IMAGES);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const categories = [ALL_FILTER, ...Array.from(new Set(images.map((img) => img.category)))];
  const filteredImages = activeFilter === ALL_FILTER ? images : images.filter((img) => img.category === activeFilter);

  const closeLightbox = useCallback(() => setLightboxImage(null), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightboxImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxImage, closeLightbox]);

  return (
    <section id="gallery" className="py-20 bg-cream-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <SectionTitle title="Galeri" subtitle="Faaliyetlerimizden kareler." />

        {/* Category Filter Tabs */}
        {!loading && (
          <div className="flex flex-wrap justify-center gap-3 mb-10 scroll-reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === cat
                    ? 'bg-emerald-900 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-emerald-900/10 border border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, index) => {
              const delayClass = `scroll-reveal-delay-${Math.min(index + 1, 6)}`;
              return (
                <div
                  key={img.id}
                  className={`group relative overflow-hidden rounded-lg shadow-md aspect-[4/3] cursor-pointer scroll-reveal ${delayClass}`}
                  onClick={() => setLightboxImage(img)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/60 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center p-4">
                      <ZoomIn className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                      <p className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-2">{img.category}</p>
                      <h4 className="text-white font-heading text-lg">{img.alt}</h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Kapat">
            <X size={24} />
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lightbox-caption">
            <span className="text-gold-500 font-bold mr-2">{lightboxImage.category}</span>
            {lightboxImage.alt}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
