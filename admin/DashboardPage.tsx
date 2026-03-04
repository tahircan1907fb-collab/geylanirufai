import React, { useEffect, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';
import {
     Users, Calendar, Image, Settings, Plus,
     ArrowRight, Clock, MapPin, TrendingUp
} from 'lucide-react';

interface Stats {
     activities: number;
     events: number;
     gallery: number;
}

interface RecentEvent {
     id: number;
     title: string;
     date: string;
     time: string;
     location: string;
     category: string;
}

interface RecentActivity {
     id: number;
     title: string;
     description: string;
     icon: string;
}

const STAT_CARDS = [
     { key: 'activities' as const, label: 'Faaliyetler', icon: Users, color: 'from-emerald-500 to-emerald-600', link: '/admin/activities' },
     { key: 'events' as const, label: 'Etkinlikler', icon: Calendar, color: 'from-blue-500 to-blue-600', link: '/admin/events' },
     { key: 'gallery' as const, label: 'Galeri', icon: Image, color: 'from-amber-500 to-amber-600', link: '/admin/gallery' },
];

const QUICK_ACTIONS = [
     { label: 'Yeni Faaliyet', icon: Users, link: '/admin/activities', color: 'text-emerald-400' },
     { label: 'Yeni Etkinlik', icon: Calendar, link: '/admin/events', color: 'text-blue-400' },
     { label: 'Galeri Ekle', icon: Image, link: '/admin/gallery', color: 'text-amber-400' },
     { label: 'Ayarlar', icon: Settings, link: '/admin/settings/hero', color: 'text-slate-400' },
];

function formatDate(dateStr: string): string {
     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [y, m, d] = dateStr.split('-').map(Number);
          return new Date(y, m - 1, d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
     }
     return dateStr;
}

export default function DashboardPage() {
     const [stats, setStats] = useState<Stats>({ activities: 0, events: 0, gallery: 0 });
     const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
     const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     useEffect(() => {
          async function fetchData() {
               try {
                    const headers = authHeaders();
                    const [actRes, evtRes, galRes] = await Promise.all([
                         fetch('/api/activities', { headers }),
                         fetch('/api/events', { headers }),
                         fetch('/api/gallery', { headers }),
                    ]);
                    const safeJson = async (r: Response) => {
                         if (!r.ok) return [];
                         try { return await r.json(); } catch { return []; }
                    };
                    const [acts, evts, gals] = await Promise.all([safeJson(actRes), safeJson(evtRes), safeJson(galRes)]);

                    const actList = Array.isArray(acts) ? acts : [];
                    const evtList = Array.isArray(evts) ? evts : [];
                    const galList = Array.isArray(gals) ? gals : [];

                    setStats({
                         activities: actList.length,
                         events: evtList.length,
                         gallery: galList.length,
                    });

                    // Son eklenen aktiviteler (son 3)
                    setRecentActivities(actList.slice(-3).reverse());

                    // Yaklaşan etkinlikler (bugünden itibaren en yakın 3)
                    const today = new Date().toISOString().split('T')[0];
                    const upcoming = evtList
                         .filter((e: RecentEvent) => e.date >= today)
                         .sort((a: RecentEvent, b: RecentEvent) => a.date.localeCompare(b.date))
                         .slice(0, 3);
                    setRecentEvents(upcoming.length > 0 ? upcoming : evtList.slice(0, 3));
               } catch {
                    // silent
               } finally {
                    setLoading(false);
               }
          }
          fetchData();
     }, []);

     return (
          <div>
               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <span className="text-xs text-slate-500">
                         {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
               </div>

               {/* Stat Cards */}
               {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {[1, 2, 3].map((i) => (
                              <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />
                         ))}
                    </div>
               ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {STAT_CARDS.map((card) => (
                              <button
                                   key={card.key}
                                   onClick={() => navigate(card.link)}
                                   className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4 hover:border-amber-500/30 transition-all group text-left"
                              >
                                   <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <card.icon className="w-6 h-6 text-white" />
                                   </div>
                                   <div>
                                        <p className="text-2xl font-bold text-white">{stats[card.key]}</p>
                                        <p className="text-sm text-slate-400">{card.label}</p>
                                   </div>
                                   <ArrowRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-amber-400 transition-colors" />
                              </button>
                         ))}
                    </div>
               )}

               {/* Quick Actions */}
               <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {QUICK_ACTIONS.map((action) => (
                         <button
                              key={action.label}
                              onClick={() => navigate(action.link)}
                              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-slate-800 hover:border-amber-500/20 transition-all group"
                         >
                              <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                   <action.icon className={`w-5 h-5 ${action.color}`} />
                              </div>
                              <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{action.label}</span>
                         </button>
                    ))}
               </div>

               {/* Content Grid */}
               <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Events */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                         <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                   <Calendar className="w-4 h-4 text-blue-400" />
                                   <h2 className="text-white font-semibold">Yaklaşan Etkinlikler</h2>
                              </div>
                              <button
                                   onClick={() => navigate('/admin/events')}
                                   className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                              >
                                   Tümünü Gör →
                              </button>
                         </div>

                         {recentEvents.length === 0 ? (
                              <p className="text-sm text-slate-500 text-center py-4">Henüz etkinlik eklenmemiş</p>
                         ) : (
                              <div className="space-y-3">
                                   {recentEvents.map((event) => (
                                        <div key={event.id} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                                             <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center min-w-[52px]">
                                                  <span className="text-xs text-blue-400 font-bold block">{formatDate(event.date)}</span>
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-sm text-white font-medium truncate">{event.title}</p>
                                                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                                                       <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" />{event.location}</span>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                         <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                   <TrendingUp className="w-4 h-4 text-emerald-400" />
                                   <h2 className="text-white font-semibold">Son Faaliyetler</h2>
                              </div>
                              <button
                                   onClick={() => navigate('/admin/activities')}
                                   className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                              >
                                   Tümünü Gör →
                              </button>
                         </div>

                         {recentActivities.length === 0 ? (
                              <p className="text-sm text-slate-500 text-center py-4">Henüz faaliyet eklenmemiş</p>
                         ) : (
                              <div className="space-y-3">
                                   {recentActivities.map((act) => (
                                        <div key={act.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                                             <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                                                  <Users className="w-4 h-4 text-emerald-400" />
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-sm text-white font-medium truncate">{act.title}</p>
                                                  <p className="text-xs text-slate-500 truncate">{act.description}</p>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>

               {/* Quick info */}
               <div className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                         <Settings className="w-4 h-4 text-amber-400" />
                         <h2 className="text-white font-semibold text-sm">Hızlı Bilgi</h2>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-500">
                         <li>• Sol menüden içerik yönetimi sayfalarına ulaşabilirsiniz.</li>
                         <li>• Faaliyetler, etkinlikler ve galeri bölümlerini ekleyip düzenleyebilirsiniz.</li>
                         <li>• Ayarlar sayfasından site bilgilerini ve iletişim bilgilerini güncelleyebilirsiniz.</li>
                    </ul>
               </div>
          </div>
     );
}
