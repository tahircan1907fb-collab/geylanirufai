import React, { useState, useEffect } from 'react';
import { Menu, X, Moon } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-900/95 backdrop-blur-sm shadow-lg py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
            <div className={`p-2 rounded-full border border-gold-500/30 transition-colors ${isScrolled ? 'bg-navy-900' : 'bg-white/10'}`}>
                 <Moon className="w-6 h-6 text-gold-500 fill-gold-500" />
            </div>
          <div className="flex flex-col">
            <span className={`font-heading font-bold text-lg md:text-xl tracking-wider ${isScrolled || window.innerWidth < 768 ? 'text-white' : 'text-white'}`}>
              GEYLANİ RUFAİ
            </span>
            <span className="text-[0.65rem] tracking-[0.2em] text-gold-500 uppercase">
              Tasavvuf ve Kültür Derneği
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold tracking-wide text-white hover:text-gold-500 transition-colors duration-200 uppercase relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a 
            href="#donate"
            className="px-5 py-2 border border-gold-500 text-gold-500 rounded hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 font-bold text-sm uppercase"
          >
            Bağış Yap
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white hover:text-gold-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div 
        className={`fixed inset-0 bg-navy-900/95 backdrop-blur-md z-40 lg:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '0px' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <button 
                className="absolute top-6 right-6 text-white hover:text-gold-500"
                onClick={() => setIsOpen(false)}
            >
                <X size={32} />
            </button>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xl font-heading text-white hover:text-gold-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
           <a 
            href="#donate"
            onClick={() => setIsOpen(false)}
            className="mt-4 px-8 py-3 border border-gold-500 text-gold-500 rounded hover:bg-gold-500 hover:text-navy-900 transition-all font-bold"
          >
            BAĞIŞ YAP
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;