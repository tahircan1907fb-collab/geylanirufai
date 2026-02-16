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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
          ? 'bg-navy-900/90 backdrop-blur-md shadow-lg py-4'
          : 'bg-transparent py-8'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group relative z-50">
          <div className={`p-2.5 rounded-full border border-gold-500/30 transition-all duration-300 ${isScrolled ? 'bg-navy-900' : 'bg-white/10 backdrop-blur-sm group-hover:bg-gold-500/10'}`}>
            <Moon className="w-6 h-6 text-gold-500 fill-gold-500 transition-transform group-hover:rotate-[15deg]" />
          </div>
          <div className="flex flex-col">
            <span className={`font-heading font-bold text-lg md:text-xl tracking-wider transition-colors ${isScrolled ? 'text-white' : 'text-white'}`}>
              GEYLANİ RUFAİ
            </span>
            <span className="text-[0.6rem] tracking-[0.25em] text-gold-500 uppercase font-medium">
              Tasavvuf ve Kültür Derneği
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold tracking-widest text-white/90 hover:text-gold-400 transition-colors duration-200 uppercase relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full opacity-80"></span>
            </a>
          ))}
          <a
            href="#donate"
            className="px-6 py-2.5 border border-gold-500/80 text-gold-500 rounded bg-gold-500/5 hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            Bağış Yap
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white hover:text-gold-500 transition-colors relative z-50 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-0 bg-navy-900/98 backdrop-blur-xl z-40 lg:hidden flex items-center justify-center transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div className={`flex flex-col items-center justify-center gap-10 w-full transition-all duration-700 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="text-2xl font-heading text-white hover:text-gold-500 transition-colors relative group"
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="#donate"
            onClick={() => setIsOpen(false)}
            className="mt-8 px-10 py-4 border border-gold-500 text-gold-500 rounded-lg hover:bg-gold-500 hover:text-navy-900 transition-all font-bold text-lg tracking-wider"
          >
            BAĞIŞ YAP
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;