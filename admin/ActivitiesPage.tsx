import React, { useEffect, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { Plus, Edit2, Trash2, X, Save, Search } from 'lucide-react';
import { adminToast } from '../lib/adminToast';

interface Activity {
     id: number;
     title: string;
     description: string;
     icon: string;
     sortOrder: number;
}

const EMPTY: Omit<Activity, 'id'> = { title: '', description: '', icon: 'Users', sortOrder: 0 };

const ICON_OPTIONS = ['Users', 'Moon', 'BookOpen', 'HeartHandshake', 'Star', 'Music', 'Heart', 'Compass', 'Globe', 'Flower2'];

export default function ActivitiesPage() {
     const [items, setItems] = useState<Activity[]>([]);
     const [loading, setLoading] = useState(true);
     const [modalOpen, setModalOpen] = useState(false);
     const [editing, setEditing] = useState<Activity | null>(null);
     const [form, setForm] = useState(EMPTY);
     const [saving, setSaving] = useState(false);
     const [search, setSearch] = useState('');

     const headers = { ...authHeaders(), 'Content-Type': 'application/json' };

     async function fetchAll() {
          try {
               const res = await fetch('/api/activities', { headers: authHeaders() });
               if (!res.ok) {
                    console.error('Activities fetch failed:', res.status);
                    setItems([]);
                    return;
               }
               const data = await res.json();
               setItems(Array.isArray(data) ? data : []);
          } catch (err) {
               console.error('Activities fetch error:', err);
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

     function openEdit(item: Activity) {
          setEditing(item);
          setForm({ title: item.title, description: item.description, icon: item.icon, sortOrder: item.sortOrder });
          setModalOpen(true);
     }

     async function handleSave(e: React.FormEvent) {
          e.preventDefault();
          if (!form.title.trim() || !form.description.trim() || !form.icon.trim()) {
               adminToast('Lütfen zorunlu alanları doldurunuz.', 'warning');
               return;
          }

          setSaving(true);
          try {
               const endpoint = editing ? `/api/activities/${editing.id}` : '/api/activities';
               const method = editing ? 'PUT' : 'POST';
               const res = await fetch(endpoint, { method, headers, body: JSON.stringify(form) });
               if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'İşlem başarısız');
               }
               adminToast(editing ? 'Faaliyet güncellendi' : 'Yeni faaliyet eklendi', 'success');
               setModalOpen(false);
               fetchAll();
          } catch (error) {
               console.error('Activities save error:', error);
               adminToast('Kayıt işlemi sırasında bir hata oluştu', 'error');
          } finally {
               setSaving(false);
          }
     }

     async function handleDelete(id: number) {
          if (!confirm('Bu faaliyeti silmek istediğinize emin misiniz?')) return;
          try {
               const res = await fetch(`/api/activities/${id}`, { method: 'DELETE', headers });
               if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Silme işlemi başarısız');
               }
               adminToast('Faaliyet silindi', 'success');
               fetchAll();
          } catch (error) {
               console.error('Activities delete error:', error);
               adminToast('Silme işlemi sırasında bir hata oluştu', 'error');
          }
     }

     return (
          <div>
               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Faaliyetler</h1>
                    <button
                         onClick={openAdd}
                         className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition"
                    >
                         <Plus className="w-4 h-4" /> Ekle
                    </button>
               </div>

               {/* Search */}
               <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         placeholder="Faaliyet ara..."
                         className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                    />
               </div>

               {loading ? (
                    <div className="space-y-3">
                         {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}
                    </div>
               ) : items.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">Henüz faaliyet eklenmemiş.</p>
               ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                         <table className="w-full text-left">
                              <thead>
                                   <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase">
                                        <th className="px-4 py-3">Sıra</th>
                                        <th className="px-4 py-3">İkon</th>
                                        <th className="px-4 py-3">Başlık</th>
                                        <th className="px-4 py-3 hidden sm:table-cell">Açıklama</th>
                                        <th className="px-4 py-3 text-right">İşlem</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {items
                                        .filter((item) => !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase()))
                                        .map((item) => (
                                             <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                                                  <td className="px-4 py-3 text-slate-300 text-sm">{item.sortOrder}</td>
                                                  <td className="px-4 py-3 text-amber-400 text-sm font-mono">{item.icon}</td>
                                                  <td className="px-4 py-3 text-white text-sm font-medium">{item.title}</td>
                                                  <td className="px-4 py-3 text-slate-400 text-sm hidden sm:table-cell truncate max-w-[200px]">{item.description}</td>
                                                  <td className="px-4 py-3 text-right">
                                                       <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-amber-400 mr-2 transition">
                                                            <Edit2 className="w-4 h-4" />
                                                       </button>
                                                       <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-400 transition">
                                                            <Trash2 className="w-4 h-4" />
                                                       </button>
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
                         <form
                              onSubmit={handleSave}
                              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                         >
                              <div className="flex items-center justify-between mb-5">
                                   <h3 className="text-lg font-bold text-white">{editing ? 'Düzenle' : 'Yeni Faaliyet'}</h3>
                                   <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                                        <X className="w-5 h-5" />
                                   </button>
                              </div>

                              <div className="space-y-4">
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Başlık</label>
                                        <input
                                             value={form.title}
                                             onChange={(e) => setForm({ ...form, title: e.target.value })}
                                             className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Açıklama</label>
                                        <textarea
                                             value={form.description}
                                             onChange={(e) => setForm({ ...form, description: e.target.value })}
                                             rows={3}
                                             className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                                             required
                                        />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-sm text-slate-300 mb-1">İkon</label>
                                             <select
                                                  value={form.icon}
                                                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                                             >
                                                  {ICON_OPTIONS.map((ico) => (
                                                       <option key={ico} value={ico}>{ico}</option>
                                                  ))}
                                             </select>
                                        </div>
                                        <div>
                                             <label className="block text-sm text-slate-300 mb-1">Sıra No</label>
                                             <input
                                                  type="number"
                                                  value={form.sortOrder}
                                                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                                                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                                             />
                                        </div>
                                   </div>
                              </div>

                              <div className="flex justify-end gap-3 mt-6">
                                   <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
                                        disabled={saving}
                                   >
                                        İptal
                                   </button>
                                   <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                   >
                                        <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                   </button>
                              </div>
                         </form>
                    </div>
               )}
          </div>
     );
}
