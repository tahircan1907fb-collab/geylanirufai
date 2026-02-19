import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from './SectionTitle';
import { Calendar, MapPin, Clock, ArrowUp, ArrowDown } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [incomingStartIndex, setIncomingStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);

  const VISIBLE_COUNT = 3;
  const ANIMATION_DURATION = 620;
  const CARD_GAP = 16;

  // Helper to parse date string (YYYY-MM-DD or legacy text)
  const formatEventDate = (dateStr: string) => {
    // Check if it matches YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return {
        dateObj: date,
        day: day.toString(),
        month: date.toLocaleDateString('tr-TR', { month: 'long' }),
        year: year.toString(),
        full: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      };
    }
    // Fallback for legacy "12 Ekim 2023" format
    const parts = dateStr.split(' ');
    if (parts.length > 2) {
      return {
        day: parts[0],
        month: parts[1],
        year: parts[2],
        full: dateStr
      };
    }
    if (parts.length > 1) {
      return {
        day: parts[0],
        month: parts.slice(1).join(' '),
        year: '',
        full: dateStr
      };
    }
    return { day: dateStr, month: '', year: '', full: dateStr };
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Events fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const wrapIndex = (index: number, total: number) => {
    if (total === 0) return 0;
    return ((index % total) + total) % total;
  };

  const getVisibleEvents = (fromIndex: number) => {
    if (events.length === 0) return [];
    const count = Math.min(VISIBLE_COUNT, events.length);
    return Array.from({ length: count }, (_, offset) => {
      const idx = wrapIndex(fromIndex + offset, events.length);
      return events[idx];
    });
  };

  useEffect(() => {
    if (events.length === 0) {
      setStartIndex(0);
      setIncomingStartIndex(0);
      setIsAnimating(false);
      return;
    }

    setStartIndex((prev) => wrapIndex(prev, events.length));
    setIncomingStartIndex((prev) => wrapIndex(prev, events.length));
  }, [events.length]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const startSlide = (nextDirection: 'up' | 'down') => {
    if (events.length <= 1 || isAnimating) return;

    const nextIndex =
      nextDirection === 'down'
        ? wrapIndex(startIndex + 1, events.length)
        : wrapIndex(startIndex - 1, events.length);

    setIncomingStartIndex(nextIndex);
    setIsAnimating(true);
    const firstCardHeight = firstCardRef.current?.getBoundingClientRect().height ?? 170;
    const distance = firstCardHeight + CARD_GAP;
    setSlideOffset(0);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    requestAnimationFrame(() => {
      setSlideOffset(nextDirection === 'down' ? -distance : distance);
    });

    animationTimeoutRef.current = setTimeout(() => {
      setStartIndex(nextIndex);
      setIsAnimating(false);
      setSlideOffset(0);
    }, ANIMATION_DURATION);
  };

  const visibleEvents = getVisibleEvents(startIndex);
  const incomingEvents = getVisibleEvents(incomingStartIndex);

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
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 flex flex-col justify-center text-center lg:text-left h-full">
            <h3 className="text-3xl font-heading text-gold-500 mb-6">Manevi İklimi Birlikte Soluyalım</h3>
            <p className="text-gray-300 font-serif text-lg mb-8 leading-relaxed">
              Haftalık zikir halkaları, ilim meclisleri ve özel gün programlarımızla ruhumuzu besliyor, kardeşliğimizi pekiştiriyoruz. Tüm programlarımız halka açık ve ücretsizdir.
            </p>
            <div className="p-6 bg-gold-500/20 rounded-xl border border-gold-500/30">
              <p className="font-heading font-bold text-gold-400 text-xl mb-2">Günün Hadis-i Şerifi</p>
              <p className="italic font-serif">"Kişi sevdiği ile beraberdir."</p>
            </div>
          </div>

          {/* Right: Event List container */}
          <div className="relative">

            {loading ? (
              <div className="text-center py-12 text-gray-400 animate-pulse">Etkinlikler yükleniyor...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Şu an planlanmış etkinlik bulunmamaktadır.</div>
            ) : (
              <div className="relative sm:pr-20">
                <div className="relative overflow-hidden">
                  {isAnimating && (
                    <div className="absolute inset-0 space-y-4 z-0 pointer-events-none">
                      {incomingEvents.map((event, index) => {
                        const { day, month, year } = formatEventDate(event.date);

                        return (
                          <div
                            key={`incoming-${event.id}-${index}`}
                            className="bg-white text-navy-900 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-lg border-l-4 border-gold-500 min-h-[170px]"
                          >
                            <div className="bg-emerald-100 text-emerald-900 p-3 rounded-lg text-center min-w-[90px] self-stretch flex flex-col justify-center">
                              <span className="block text-2xl font-bold font-heading leading-tight">{day}</span>
                              <span className="block text-xs font-semibold uppercase tracking-wider mt-1">{month}</span>
                              {year && <span className="block text-xs text-emerald-700/70 font-medium mt-0.5">{year}</span>}
                            </div>

                            <div className="flex-1 w-full">
                              <div className="flex justify-between items-start mb-2 gap-3">
                                <h4 className="text-lg font-bold text-navy-900 leading-tight">{event.title}</h4>
                                <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full whitespace-nowrap">
                                  {event.category}
                                </span>
                              </div>

                              <div className="flex flex-col gap-2 text-sm text-gray-600 mt-3">
                                <div className="flex items-center gap-2">
                                  <Clock size={15} className="text-gold-600 shrink-0" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin size={15} className="text-gold-600 shrink-0" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className="space-y-4 relative z-10"
                    style={
                      isAnimating
                        ? {
                            transform: `translateY(${slideOffset}px)`,
                            transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
                          }
                        : undefined
                    }
                  >
                    {visibleEvents.map((event, index) => {
                      const { day, month, year } = formatEventDate(event.date);

                      return (
                        <div
                          key={`visible-${event.id}-${index}`}
                          ref={index === 0 ? firstCardRef : null}
                          className="bg-white text-navy-900 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-gold-500 min-h-[170px]"
                        >
                          <div className="bg-emerald-100 text-emerald-900 p-3 rounded-lg text-center min-w-[90px] self-stretch flex flex-col justify-center">
                            <span className="block text-2xl font-bold font-heading leading-tight">{day}</span>
                            <span className="block text-xs font-semibold uppercase tracking-wider mt-1">{month}</span>
                            {year && <span className="block text-xs text-emerald-700/70 font-medium mt-0.5">{year}</span>}
                          </div>

                          <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-2 gap-3">
                              <h4 className="text-lg font-bold text-navy-900 leading-tight">{event.title}</h4>
                              <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full whitespace-nowrap">
                                {event.category}
                              </span>
                            </div>

                            <div className="flex flex-col gap-2 text-sm text-gray-600 mt-3">
                              <div className="flex items-center gap-2">
                                <Clock size={15} className="text-gold-600 shrink-0" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={15} className="text-gold-600 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {events.length > 1 && (
                  <div className="mt-4 flex items-center justify-end gap-3 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col">
                    <button
                      type="button"
                      onClick={() => startSlide('up')}
                      className="w-11 h-11 rounded-full border border-white/20 bg-white/10 text-gold-400 hover:bg-gold-500 hover:text-emerald-950 transition-all duration-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Önceki etkinlik"
                      disabled={isAnimating}
                    >
                      <ArrowUp size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => startSlide('down')}
                      className="w-11 h-11 rounded-full border border-white/20 bg-white/10 text-gold-400 hover:bg-gold-500 hover:text-emerald-950 transition-all duration-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Sonraki etkinlik"
                      disabled={isAnimating}
                    >
                      <ArrowDown size={20} />
                    </button>
                  </div>
                )}

                {events.length > 1 && (
                  <div className="mt-3 text-right text-xs text-gold-400/90">
                    {wrapIndex(startIndex, events.length) + 1} / {events.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="text-gold-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors group">
            <Calendar size={18} className="group-hover:scale-110 transition-transform" />
            <span>Tüm Programı PDF İndir</span>
          </button>
        </div>
      </div>

    </section>
  );
};

export default Events;
