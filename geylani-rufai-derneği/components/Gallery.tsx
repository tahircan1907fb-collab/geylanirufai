import React from 'react';
import SectionTitle from './SectionTitle';
import { GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-20 bg-cream-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="Galeri" subtitle="Faaliyetlerimizden kareler." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img) => (
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
      </div>
    </section>
  );
};

export default Gallery;