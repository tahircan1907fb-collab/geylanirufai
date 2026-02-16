import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0 select-none">
        <div className="absolute inset-0 bg-navy-900/20 z-10"></div> {/* Base layer */}
        <img
          src="https://picsum.photos/1920/1080?grayscale&blur=2"
          alt="Manevi Atmosfer"
          className="w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/70 to-navy-900/90 z-20"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-30 text-center text-white">
        <div className="animate-fade-in-up flex flex-col items-center">
          {/* Badge */}
          <div className="mb-8">
            <span className="inline-block px-6 py-2 border border-gold-500/30 rounded-full text-gold-400 text-xs md:text-sm tracking-[0.3em] uppercase bg-navy-900/50 backdrop-blur-md shadow-2xl shadow-gold-500/10 hover:border-gold-500/60 transition-colors duration-300">
              Tasavvuf Geleneğinin İzinde
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-tight tracking-tight drop-shadow-2xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 pb-2">Geylani Rufai</span>
            <span className="block text-4xl md:text-6xl lg:text-7xl mt-2 text-white/90 font-serif font-medium">İlim, İrfan ve Hizmet</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl font-sans text-gray-300 mb-12 leading-relaxed font-light tracking-wide">
            Tasavvuf geleneğini yaşatmak, gönülleri ilahi aşkla buluşturmak ve<br className="hidden md:block" /> gelecek nesillere bu manevi mirası aktarmak amacıyla hizmet ediyoruz.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
            <a
              href="#activities"
              className="group px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded font-bold text-lg hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
            >
              Faaliyetlerimiz
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded font-bold text-lg hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 transition-all duration-300 min-w-[200px] text-center"
            >
              Bize Katılın
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Curve - Enhanced */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px] fill-cream-50">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".1"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".3" fill="#D4AF37"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;