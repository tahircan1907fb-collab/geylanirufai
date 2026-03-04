import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface AboutData {
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutQuote: string;
}

const DEFAULT_ABOUT: AboutData = {
  aboutTitle: 'Köklerimiz Mazide, Gözümüz Atide',
  aboutText1:
    'Derneğimiz, asırlardır Anadolu yu ve gönül coğrafyamızı mayalayan tasavvuf neşesini modern çağın insanına ulaştırmak gayesiyle kurulmuştur.',
  aboutText2:
    'Misyonumuz; ilim, irfan ve hikmet ekseninde, topluma faydalı ve maneviyatı güçlü bireylerin yetişmesine katkı sağlamaktır.',
  aboutQuote: 'Gaye rızadır, vasıta hizmettir.',
};

const About: React.FC = () => {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);
  const sectionRef = useScrollReveal();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((settings) => {
        setData({
          aboutTitle: settings.aboutTitle || DEFAULT_ABOUT.aboutTitle,
          aboutText1: settings.aboutText1 || DEFAULT_ABOUT.aboutText1,
          aboutText2: settings.aboutText2 || DEFAULT_ABOUT.aboutText2,
          aboutQuote: settings.aboutQuote || DEFAULT_ABOUT.aboutQuote,
        });
      })
      .catch(() => {
        setData(DEFAULT_ABOUT);
      });
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 bg-cream-50 islamic-pattern" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Hakkımızda"
          subtitle="Geylani ve Rufai yolunun edep ve erkanını günümüze taşıyoruz."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 scroll-reveal-left">
            <h3 className="text-2xl font-heading text-emerald-900 font-bold">
              {data.aboutTitle}
            </h3>
            <p className="text-gray-700 font-serif leading-relaxed text-lg">
              {data.aboutText1}
            </p>
            <p className="text-gray-700 font-serif leading-relaxed text-lg">
              {data.aboutText2}
            </p>

            <div className="pt-6 grid grid-cols-2 gap-4">
              <div className="p-4 border-l-4 border-gold-500 bg-white shadow-sm scroll-reveal scroll-reveal-delay-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-navy-900 mb-2">Hizmet</h4>
                <p className="text-sm text-gray-600">İnsana ve mahlukata karşılıksız hizmet.</p>
              </div>
              <div className="p-4 border-l-4 border-gold-500 bg-white shadow-sm scroll-reveal scroll-reveal-delay-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-navy-900 mb-2">Muhabbet</h4>
                <p className="text-sm text-gray-600">Gönüller arasında sevgi köprüleri kurmak.</p>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative group scroll-reveal-right">
            <div className="absolute -inset-4 bg-gold-500/20 rounded-lg transform rotate-2 group-hover:rotate-1 transition-transform duration-500"></div>
            <img
              src="https://picsum.photos/600/500?grayscale"
              alt="Dernek Sohbet Ortamı"
              className="relative rounded-lg shadow-xl w-full object-cover h-[400px] md:h-[500px]"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded border-l-4 border-emerald-800 shadow-lg">
              <p className="text-emerald-900 font-serif italic text-center">
                "{data.aboutQuote}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
