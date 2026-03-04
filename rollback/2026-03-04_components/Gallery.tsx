import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';

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

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section id="gallery" className="py-20 bg-cream-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="Galeri" subtitle="Faaliyetlerimizden kareler." />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/3] cursor-pointer">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/60 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center p-4">
                  <p className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-2">{img.category}</p>
                  <h4 className="text-white font-heading text-lg">{img.alt}</h4>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
