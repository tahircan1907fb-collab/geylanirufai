import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

// Default hero content (used as fallback when API is unavailable)
const DEFAULT_HERO: HeroData = {
  heroBadge: 'Tasavvuf Geleneğinin İzinde',
  heroTitle1: 'Geylani Rufai',
  heroTitle2: 'İlim ve Kültür Derneği',
  heroDescription:
    'Seyyid Abdülkâdir Geylânî ve Seyyid Ahmed er-Rifâî efendilerimizin öğretilerini yaşam prensibi edinmek için kurulmuş bir kuruluştur.',
  heroButtonText1: 'Faaliyetlerimiz',
  heroButtonLink1: '#activities',
  heroButtonText2: 'Bize Katılın',
  heroButtonLink2: '#contact',
  heroImage: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
};

interface HeroData {
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  heroButtonText1: string;
  heroButtonLink1: string;
  heroButtonText2: string;
  heroButtonLink2: string;
  heroImage: string;
}

const Hero: React.FC = () => {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((settings) =>
        setData({
          heroBadge: settings.heroBadge || DEFAULT_HERO.heroBadge,
          heroTitle1: settings.heroTitle1 || DEFAULT_HERO.heroTitle1,
          heroTitle2: settings.heroTitle2 || DEFAULT_HERO.heroTitle2,
          heroDescription: settings.heroDescription || DEFAULT_HERO.heroDescription,
          heroButtonText1: settings.heroButtonText1 || DEFAULT_HERO.heroButtonText1,
          heroButtonLink1: settings.heroButtonLink1 || DEFAULT_HERO.heroButtonLink1,
          heroButtonText2: settings.heroButtonText2 || DEFAULT_HERO.heroButtonText2,
          heroButtonLink2: settings.heroButtonLink2 || DEFAULT_HERO.heroButtonLink2,
          heroImage: settings.heroImage || DEFAULT_HERO.heroImage,
        })
      )
      .catch((error) => {
        console.error('Hero settings fetch error:', error);
        // Fallback to defaults is already handled by initial state
      });
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={data.heroImage}
          alt="Manevi Atmosfer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <div className="animate-fade-in-up">
          <div className="mb-6 flex justify-center">
            <span className="px-4 py-1 border border-gold-500/50 rounded-full text-gold-400 text-xs md:text-sm tracking-[0.2em] uppercase bg-black/20 backdrop-blur-sm">
              {data.heroBadge}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
            <span className="block text-gold-500">{data.heroTitle1}</span>
            <span className="block">{data.heroTitle2}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl font-serif text-gray-200 mb-10 leading-relaxed">
            {data.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={data.heroButtonLink1}
              className="px-8 py-4 bg-gold-500 text-navy-900 rounded font-bold hover:bg-gold-400 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gold-500/20"
            >
              {data.heroButtonText1} <ArrowRight size={20} />
            </a>
            <a
              href={data.heroButtonLink2}
              className="px-8 py-4 bg-transparent border border-white text-white rounded font-bold hover:bg-white/10 transition-all duration-300"
            >
              {data.heroButtonText2}
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] fill-cream-50">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#D4AF37"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;