import React from 'react';
import SectionTitle from './SectionTitle';
import { ACTIVITIES } from '../constants';

const Activities: React.FC = () => {
  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Faaliyetlerimiz" 
          subtitle="Manevi ve sosyal alandaki çalışmalarımızla gönüllere dokunuyoruz."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACTIVITIES.map((activity, index) => (
            <div 
              key={index}
              className="group bg-cream-50 p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gold-500/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
              
              <div className="w-14 h-14 bg-emerald-900 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:bg-gold-500 transition-colors duration-300 relative z-10">
                <activity.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-heading font-bold text-navy-900 mb-3 group-hover:text-gold-600 transition-colors">
                {activity.title}
              </h3>
              
              <p className="text-gray-600 font-serif leading-relaxed">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;