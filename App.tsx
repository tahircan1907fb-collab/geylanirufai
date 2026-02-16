import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Activities from './components/Activities';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Donation from './components/Donation';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SEO from './components/SEO';

function App() {
  return (
    <div className="font-sans antialiased text-gray-800 bg-cream-50">
      <SEO />
      <Header />
      <main>
        <Hero />
        <About />
        <Activities />
        <Events />
        <Gallery />
        <Donation />
        <Contact />
      </main>
      <Footer />

      {/* WhatsApp Button (Fixed) */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20b858] transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
}

export default App;