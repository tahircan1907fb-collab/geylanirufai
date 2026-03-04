import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  BookOpen,
  Heart,
  HeartHandshake,
  Compass,
  Flower2,
  Globe,
  Moon,
  Music,
  Star,
  Users,
  LucideIcon,
} from 'lucide-react';

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Moon,
  BookOpen,
  HeartHandshake,
  Star,
  Music,
  Heart,
  Compass,
  Globe,
  Flower2,
};

const FALLBACK: ActivityItem[] = [
  { id: 1, title: 'Sohbet Programları', description: 'Haftalık tasavvuf ve ilim sohbetleri.', icon: 'Users', sortOrder: 1 },
  { id: 2, title: 'Zikir Meclisleri', description: 'Geleneksel zikir halkaları ve manevi buluşmalar.', icon: 'Moon', sortOrder: 2 },
  { id: 3, title: 'İlim Dersleri', description: 'Düzenli fıkıh, akaid ve siyer dersleri.', icon: 'BookOpen', sortOrder: 3 },
];

const Activities: React.FC = () => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useScrollReveal();

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch('/api/activities');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = Array.isArray(data) ? data : [];
        setItems(normalized.length > 0 ? normalized : FALLBACK);
      } catch {
        setItems(FALLBACK);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return (
    <section id="activities" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Faaliyetlerimiz"
          subtitle="Manevi ve sosyal alandaki çalışmalarımızla gönüllere dokunuyoruz."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((activity, index) => {
              const Icon = ICON_MAP[activity.icon] || Users;
              const delayClass = `scroll-reveal-delay-${Math.min(index + 1, 6)}`;
              return (
                <div
                  key={activity.id}
                  className={`group bg-cream-50 p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gold-500/30 relative overflow-hidden scroll-reveal ${delayClass} hover:-translate-y-2`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>

                  <div className="w-14 h-14 bg-emerald-900 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:bg-gold-500 transition-colors duration-300 relative z-10 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-heading font-bold text-navy-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {activity.title}
                  </h3>

                  <p className="text-gray-600 font-serif leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Activities;
