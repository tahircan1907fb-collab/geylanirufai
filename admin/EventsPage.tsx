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
     const [saving, setSaving] = useState(false);

     const headers = { ...authHeaders(), 'Content-Type': 'application/json' };

     async function fetchAll() {
          try {
               const res = await fetch('/api/events', { headers: authHeaders() });
               if (!res.ok) {
                    console.error('Events fetch failed:', res.status);
                    setItems([]);
                    return;
               }
               const data = await res.json();
               setItems(Array.isArray(data) ? data : []);
          } catch (err) {
               console.error('Events fetch error:', err);
               setItems([]);
          } finally {
               setLoading(false);
          }
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

          if (!form.title || !form.date || !form.time || !form.location) {
               alert('Lütfen tüm zorunlu alanları doldurunuz.');
               return;
          }

          setSaving(true);
          try {
               let res;
               const body = JSON.stringify(form);

                if (editing) {
                     // Update: PUT
                     res = await fetch(`/api/events/${editing.id}`, { method: 'PUT', headers, body });
               } else {
                    // Create: POST
                    res = await fetch('/api/events', { method: 'POST', headers, body });
               }

               if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'İşlem başarısız');
               }

               alert(editing ? 'Etkinlik başarıyla güncellendi.' : 'Yeni etkinlik başarıyla eklendi.');
               setModalOpen(false);
               fetchAll();
          } catch (error) {
               console.error('Save error:', error);
               alert('Bir hata oluştu: ' + String(error));
          } finally {
               setSaving(false);
          }
     }

     async function handleDelete(id: number) {
          if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return;

          try {
                const res = await fetch(`/api/events/${id}`, { method: 'DELETE', headers });
               if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Silme işlemi başarısız');
               }
               alert('Etkinlik başarıyla silindi.');
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

     const formatDate = (dateStr: string) => {
          if (!dateStr) return 'Tarih Yok';
          const [year, month, day] = dateStr.split('-').map(Number);
          if (year && month && day) {
               const date = new Date(year, month - 1, day);
               return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
          }
          return dateStr;
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
                                             <td className="px-4 py-3 text-slate-300 text-sm hidden sm:table-cell">{formatDate(item.date)}</td>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
                         <form onSubmit={handleSave} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                              <button type="button" onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
                                   <X className="w-5 h-5" />
                              </button>

                              <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
                                   {editing ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}
                              </h3>

                              <div className="space-y-5">
                                   <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Başlık <span className="text-red-500">*</span></label>
                                        <input
                                             value={form.title}
                                             onChange={(e) => setForm({ ...form, title: e.target.value })}
                                             className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                             placeholder="Örn: Haftalık Sohbet"
                                             required
                                        />
                                   </div>
                                   <div className="grid grid-cols-2 gap-5">
                                        <div>
                                             <label className="block text-sm font-medium text-slate-300 mb-1.5">Tarih <span className="text-red-500">*</span></label>
                                             <input
                                                  type="date"
                                                  value={form.date}
                                                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                                  required
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-sm font-medium text-slate-300 mb-1.5">Saat <span className="text-red-500">*</span></label>
                                             <input
                                                  type="time"
                                                  value={form.time}
                                                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                                                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                                  required
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Konum <span className="text-red-500">*</span></label>
                                        <input
                                             value={form.location}
                                             onChange={(e) => setForm({ ...form, location: e.target.value })}
                                             className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                                             placeholder="Örn: Dernek Merkezi"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Kategori</label>
                                        <select
                                             value={form.category}
                                             onChange={(e) => setForm({ ...form, category: e.target.value })}
                                             className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors appearance-none cursor-pointer"
                                        >
                                             {CATEGORIES.map((c) => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                                        </select>
                                   </div>
                              </div>

                              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                                   <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                        disabled={saving}
                                   >
                                        İptal
                                   </button>
                                   <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-navy-900 text-sm font-bold rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                                   >
                                        {saving ? (
                                             <>
                                                  <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                                                  Kaydediliyor...
                                             </>
                                        ) : (
                                             <>
                                                  <Save className="w-4 h-4" />
                                                  {editing ? 'Güncelle' : 'Kaydet'}
                                             </>
                                        )}
                                   </button>
                              </div>
                         </form>
                    </div>
               )}
          </div>
     );
}
