import React from 'react';
import SectionTitle from './SectionTitle';
import { useScrollReveal } from '../hooks/useScrollReveal';

const About: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-cream-50 islamic-pattern scroll-reveal">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Hakkımızda"
          subtitle="Geylani ve Rufai yolunun edep ve erkanını günümüze taşıyoruz."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-heading text-emerald-900 font-bold leading-snug">
              Köklerimiz Mazide, Gözümüz Atide
            </h3>
            <p className="text-gray-700 font-serif leading-relaxed text-lg">
              Derneğimiz, asırlardır Anadolu'yu ve gönül coğrafyamızı mayalayan tasavvuf neşesini, modern çağın insanına ulaştırmak gayesiyle kurulmuştur. Kadim Geylani ve Rufai yollarının birleştirici, sevgi dolu ve hizmet eksenli anlayışını şiar ediniyoruz.
            </p>
            <p className="text-gray-700 font-serif leading-relaxed text-lg">
              Misyonumuz; ilim, irfan ve hikmet ekseninde, yaratılanı Yaratandan ötürü seven, topluma faydalı, maneviyatı güçlü bireylerin yetişmesine katkı sağlamaktır.
            </p>

            <div className="pt-8 grid grid-cols-2 gap-6">
              <div className="p-5 border-l-4 border-gold-500 bg-white shadow-sm rounded-r-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-navy-900 mb-2 text-lg">Hizmet</h4>
                <p className="text-sm text-gray-600 leading-relaxed">İnsana ve mahlukata karşılıksız hizmet.</p>
              </div>
              <div className="p-5 border-l-4 border-gold-500 bg-white shadow-sm rounded-r-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-navy-900 mb-2 text-lg">Muhabbet</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Gönüller arasında sevgi köprüleri kurmak.</p>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gold-500/20 rounded-lg transform rotate-2 group-hover:rotate-1 transition-transform duration-500"></div>
            <img
              src="https://picsum.photos/600/500?grayscale"
              alt="Dernek Sohbet Ortamı"
              className="relative rounded-lg shadow-xl w-full object-cover h-[400px] md:h-[500px]"
              loading="lazy"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded border-l-4 border-emerald-800 shadow-lg">
              <p className="text-emerald-900 font-serif italic text-center text-lg">
                "Gaye rızadır, vasıta hizmettir."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;