import React from 'react';
import SectionTitle from './SectionTitle';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-cream-50 islamic-pattern">
      <div className="container mx-auto px-4">
        <SectionTitle title="İletişim" subtitle="Bizimle irtibata geçin, çayımızı içmeye bekleriz." />

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Info Side */}
            <div className="lg:w-1/3 bg-emerald-900 p-10 text-white flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-heading font-bold mb-8 text-gold-500">Adres Bilgileri</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-gold-500 shrink-0 mt-1" />
                            <p>Molla Gürani Mah. İlim Sok. No: 12<br/>Fatih / İstanbul</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="text-gold-500 shrink-0" />
                            <p>+90 212 555 12 34</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="text-gold-500 shrink-0" />
                            <p>iletisim@geylanirufai.org.tr</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gold-500">Bizi Takip Edin</h4>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-white/10 rounded hover:bg-gold-500 hover:text-navy-900 transition-colors"><Instagram size={20}/></a>
                        <a href="#" className="p-2 bg-white/10 rounded hover:bg-gold-500 hover:text-navy-900 transition-colors"><Facebook size={20}/></a>
                        <a href="#" className="p-2 bg-white/10 rounded hover:bg-gold-500 hover:text-navy-900 transition-colors"><Youtube size={20}/></a>
                    </div>
                </div>
            </div>

            {/* Map & Form Side */}
            <div className="lg:w-2/3 p-10">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50" placeholder="Ahmet Yılmaz" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresiniz</label>
                            <input type="email" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50" placeholder="ornek@email.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Konu</label>
                        <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50">
                            <option>Genel Bilgi</option>
                            <option>Faaliyetler Hakkında</option>
                            <option>Bağış Bildirimi</option>
                            <option>Ziyaret Talebi</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label>
                        <textarea rows={4} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-cream-50" placeholder="Mesajınızı buraya yazınız..."></textarea>
                    </div>
                    <button type="submit" className="px-8 py-3 bg-emerald-900 text-white font-bold rounded hover:bg-emerald-800 transition-colors shadow-lg">
                        Gönder
                    </button>
                </form>
            </div>
        </div>

        {/* Fake Map */}
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg h-64 border-4 border-white">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.749007530666!2d28.976375615413345!3d41.00823797929987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9be92011c27%3A0x236e6f6f37444fae!2sSultan%20Ahmet%2C%20Ayasofya%20Meydan%C4%B1%2C%2034122%20Fatih%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1633023222534!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy">
            </iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;