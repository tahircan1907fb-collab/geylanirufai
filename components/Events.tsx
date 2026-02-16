import React from 'react';
import SectionTitle from './SectionTitle';
import { UPCOMING_EVENTS } from '../constants';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events: React.FC = () => {
  return (
    <section id="events" className="py-20 bg-emerald-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle 
          title="Etkinlik Takvimi" 
          subtitle="Yaklaşan manevi buluşmalarımıza davetlisiniz."
          light={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Left: Featured Event Highlight or Intro */}
           <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 flex flex-col justify-center text-center lg:text-left">
                <h3 className="text-3xl font-heading text-gold-500 mb-6">Manevi İklimi Birlikte Soluyalım</h3>
                <p className="text-gray-300 font-serif text-lg mb-8 leading-relaxed">
                    Haftalık zikir halkaları, ilim meclisleri ve özel gün programlarımızla ruhumuzu besliyor, kardeşliğimizi pekiştiriyoruz. Tüm programlarımız halka açık ve ücretsizdir.
                </p>
                <div className="p-6 bg-gold-500/20 rounded-xl border border-gold-500/30">
                    <p className="font-heading font-bold text-gold-400 text-xl mb-2">Günün Hadis-i Şerifi</p>
                    <p className="italic font-serif">"Kişi sevdiği ile beraberdir."</p>
                </div>
           </div>

           {/* Right: Event List */}
           <div className="space-y-4">
              {UPCOMING_EVENTS.map((event) => (
                  <div key={event.id} className="bg-white text-navy-900 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-lg hover:transform hover:-translate-x-2 transition-all duration-300 group">
                      {/* Date Box */}
                      <div className="bg-emerald-100 text-emerald-900 p-4 rounded-lg text-center min-w-[90px]">
                          <span className="block text-2xl font-bold font-heading">{event.date.split(' ')[0]}</span>
                          <span className="block text-xs font-semibold uppercase">{event.date.split(' ')[1]}</span>
                      </div>

                      <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2 group-hover:text-emerald-800 transition-colors">{event.title}</h4>
                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                  <Clock size={16} className="text-gold-600" />
                                  <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                  <MapPin size={16} className="text-gold-600" />
                                  <span>{event.location}</span>
                              </div>
                          </div>
                      </div>

                      <button className="px-4 py-2 border border-emerald-900 text-emerald-900 rounded hover:bg-emerald-900 hover:text-white transition-colors text-sm font-semibold whitespace-nowrap">
                          Takvime Ekle
                      </button>
                  </div>
              ))}
              
              <div className="text-center mt-6">
                <button className="text-gold-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors">
                    <Calendar size={18} />
                    <span>Tüm Programı PDF İndir</span>
                </button>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Events;