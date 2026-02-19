import React, { useEffect, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface EventItem {
     id: number;
     title: string;
     date: string;
     time: string;
     location: string;
     category: string;
}

const EMPTY: Omit<EventItem, 'id'> = { title: '', date: '', time: '', location: '', category: 'Sohbet' };
const CATEGORIES = ['Sohbet', 'Zikir', 'Özel'];

export default function EventsPage() {
     const [items, setItems] = useState<EventItem[]>([]);
     const [loading, setLoading] = useState(true);
     const [modalOpen, setModalOpen] = useState(false);
     const [editing, setEditing] = useState<EventItem | null>(null);
     const [form, setForm] = useState(EMPTY);

     const headers = { ...authHeaders(), 'Content-Type': 'application/json' };

     async function fetchAll() {
          const res = await fetch('/api/events', { headers: authHeaders() });
          const data = await res.json();
          setItems(data);
          setLoading(false);
     }

     useEffect(() => { fetchAll(); }, []);

     function openAdd() {
          setEditing(null);
          setForm(EMPTY);
          setModalOpen(true);
     }

     function openEdit(item: EventItem) {
          setEditing(item);
          setForm({ title: item.title, date: item.date, time: item.time, location: item.location, category: item.category });
          setModalOpen(true);
     }

     async function handleSave(e: React.FormEvent) {
          e.preventDefault();
          try {
               let res;
               if (editing) {
                    // Update: PUT /api/events?id=123 (Vercel dynamic route)
                    // Note: In local dev with `vercel dev`, it handles path segments too, but query param is safer if rewrites arent perfect.
                    // Let's stick to standard path `/api/events/${id}` assuming vercel.json rewrites are set (they are).
                    res = await fetch(`/api/events?id=${editing.id}`, { method: 'PUT', headers, body: JSON.stringify(form) });
               } else {
                    // Create: POST /api/events
                    res = await fetch('/api/events', { method: 'POST', headers, body: JSON.stringify(form) });
               }

               if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Kaydetme işlemi başarısız');
               }

               setModalOpen(false);
               fetchAll();
          } catch (error) {
               console.error('Save error:', error);
               alert('Kaydetme işlemi sırasında bir hata oluştu: ' + String(error));
          }
     }

     async function handleDelete(id: number) {
          if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return;

          try {
               const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE', headers });
               if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Silme işlemi başarısız');
               }
               fetchAll();
          } catch (error) {
               console.error('Delete error:', error);
               alert('Silme işlemi sırasında bir hata oluştu: ' + String(error));
          }
     }

     const categoryColor = (cat: string) => {
          switch (cat) {
               case 'Sohbet': return 'bg-green-500/10 text-green-400';
               case 'Zikir': return 'bg-blue-500/10 text-blue-400';
               default: return 'bg-amber-500/10 text-amber-400';
          }
     };

     return (
          <div>
               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Etkinlikler</h1>
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition">
                         <Plus className="w-4 h-4" /> Ekle
                    </button>
               </div>

               {loading ? (
                    <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>
               ) : items.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">Henüz etkinlik eklenmemiş.</p>
               ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                         <table className="w-full text-left">
                              <thead>
                                   <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase">
                                        <th className="px-4 py-3">Başlık</th>
                                        <th className="px-4 py-3 hidden sm:table-cell">Tarih</th>
                                        <th className="px-4 py-3 hidden sm:table-cell">Saat</th>
                                        <th className="px-4 py-3 hidden md:table-cell">Konum</th>
                                        <th className="px-4 py-3">Kategori</th>
                                        <th className="px-4 py-3 text-right">İşlem</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {items.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                                             <td className="px-4 py-3 text-white text-sm font-medium">{item.title}</td>
                                             <td className="px-4 py-3 text-slate-300 text-sm hidden sm:table-cell">{item.date}</td>
                                             <td className="px-4 py-3 text-slate-300 text-sm hidden sm:table-cell">{item.time}</td>
                                             <td className="px-4 py-3 text-slate-400 text-sm hidden md:table-cell">{item.location}</td>
                                             <td className="px-4 py-3">
                                                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${categoryColor(item.category)}`}>
                                                       {item.category}
                                                  </span>
                                             </td>
                                             <td className="px-4 py-3 text-right">
                                                  <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-amber-400 mr-2 transition"><Edit2 className="w-4 h-4" /></button>
                                                  <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>
               )}

               {/* Modal */}
               {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                         <form onSubmit={handleSave} className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                              <div className="flex items-center justify-between mb-5">
                                   <h3 className="text-lg font-bold text-white">{editing ? 'Düzenle' : 'Yeni Etkinlik'}</h3>
                                   <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                              </div>

                              <div className="space-y-4">
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Başlık</label>
                                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" required />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-sm text-slate-300 mb-1">Tarih</label>
                                             <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="12 Ekim 2023" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" required />
                                        </div>
                                        <div>
                                             <label className="block text-sm text-slate-300 mb-1">Saat</label>
                                             <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="20:30" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" required />
                                        </div>
                                   </div>
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Konum</label>
                                        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" required />
                                   </div>
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Kategori</label>
                                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500">
                                             {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                   </div>
                              </div>

                              <div className="flex justify-end gap-3 mt-6">
                                   <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition">İptal</button>
                                   <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition">
                                        <Save className="w-4 h-4" /> Kaydet
                                   </button>
                              </div>
                         </form>
                    </div>
               )}
          </div>
     );
}
