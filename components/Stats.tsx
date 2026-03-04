import React, { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Users, CalendarDays, Heart, BookOpen } from 'lucide-react';

interface StatItem {
     icon: React.ElementType;
     value: number;
     suffix: string;
     label: string;
}

const STATS: StatItem[] = [
     { icon: Users, value: 500, suffix: '+', label: 'Aktif Üye' },
     { icon: CalendarDays, value: 15, suffix: '', label: 'Yıllık Hizmet' },
     { icon: Heart, value: 100, suffix: '+', label: 'Düzenlenen Etkinlik' },
     { icon: BookOpen, value: 50, suffix: '+', label: 'İlim Meclisi' },
];

const COUNTER_DURATION_MS = 2000;
const COUNTER_STEPS = 60;

function useCounter(target: number, shouldStart: boolean): number {
     const [current, setCurrent] = useState(0);

     useEffect(() => {
          if (!shouldStart) return;

          let step = 0;
          const increment = target / COUNTER_STEPS;
          const interval = COUNTER_DURATION_MS / COUNTER_STEPS;

          const timer = setInterval(() => {
               step++;
               if (step >= COUNTER_STEPS) {
                    setCurrent(target);
                    clearInterval(timer);
               } else {
                    setCurrent(Math.ceil(increment * step));
               }
          }, interval);

          return () => clearInterval(timer);
     }, [target, shouldStart]);

     return current;
}

const StatCard: React.FC<{ stat: StatItem; index: number; isVisible: boolean }> = ({ stat, index, isVisible }) => {
     const count = useCounter(stat.value, isVisible);
     const Icon = stat.icon;
     const delayClass = `scroll-reveal-delay-${index + 1}`;

     return (
          <div className={`text-center scroll-reveal ${delayClass}`}>
               <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <Icon className="w-8 h-8 text-gold-500" />
               </div>
               <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 counter-value">
                    {count}{stat.suffix}
               </div>
               <p className="text-gray-400 text-sm font-serif">{stat.label}</p>
          </div>
     );
};

const Stats: React.FC = () => {
     const sectionRef = useScrollReveal();
     const observerRef = useRef<HTMLDivElement>(null);
     const [isVisible, setIsVisible] = useState(false);

     useEffect(() => {
          const el = observerRef.current;
          if (!el) return;

          const observer = new IntersectionObserver(
               ([entry]) => {
                    if (entry.isIntersecting) {
                         setIsVisible(true);
                         observer.disconnect();
                    }
               },
               { threshold: 0.3 }
          );

          observer.observe(el);
          return () => observer.disconnect();
     }, []);

     return (
          <section className="py-16 bg-navy-900 relative overflow-hidden" ref={sectionRef}>
               {/* Subtle pattern */}
               <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

               <div className="container mx-auto px-4 relative z-10" ref={observerRef}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                         {STATS.map((stat, i) => (
                              <StatCard key={stat.label} stat={stat} index={i} isVisible={isVisible} />
                         ))}
                    </div>
               </div>
          </section>
     );
};

export default Stats;
