import React, { useEffect, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { Users, Calendar, Image, Settings } from 'lucide-react';

interface Stats {
     activities: number;
     events: number;
     gallery: number;
}

const STAT_CARDS = [
     { key: 'activities' as const, label: 'Faaliyetler', icon: Users, color: 'from-emerald-500 to-emerald-600' },
     { key: 'events' as const, label: 'Etkinlikler', icon: Calendar, color: 'from-blue-500 to-blue-600' },
     { key: 'gallery' as const, label: 'Galeri', icon: Image, color: 'from-purple-500 to-purple-600' },
];

export default function DashboardPage() {
     const [stats, setStats] = useState<Stats>({ activities: 0, events: 0, gallery: 0 });
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function fetchStats() {
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
                    setStats({
                         activities: Array.isArray(acts) ? acts.length : 0,
                         events: Array.isArray(evts) ? evts.length : 0,
                         gallery: Array.isArray(gals) ? gals.length : 0,
                    });
               } catch {
                    // silent
               } finally {
                    setLoading(false);
               }
          }
          fetchStats();
     }, []);

     return (
          <div>
               <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

               {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {[1, 2, 3].map((i) => (
                              <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />
                         ))}
                    </div>
               ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {STAT_CARDS.map((card) => (
                              <div
                                   key={card.key}
                                   className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4"
                              >
                                   <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <card.icon className="w-6 h-6 text-white" />
                                   </div>
                                   <div>
                                        <p className="text-2xl font-bold text-white">{stats[card.key]}</p>
                                        <p className="text-sm text-slate-400">{card.label}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Quick info */}
               <div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                         <Settings className="w-4 h-4 text-amber-400" />
                         <h2 className="text-white font-semibold">Hızlı Bilgi</h2>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                         <li>• Sol menüden içerik yönetimi sayfalarına ulaşabilirsiniz.</li>
                         <li>• Faaliyetler, etkinlikler ve galeri bölümlerini ekleyip düzenleyebilirsiniz.</li>
                         <li>• Ayarlar sayfasından site bilgilerini ve iletişim bilgilerini güncelleyebilirsiniz.</li>
                    </ul>
               </div>
          </div>
     );
}
