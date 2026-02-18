import React, { useEffect, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { Plus, Trash2, X, Save } from 'lucide-react';

interface GalleryItem {
     id: number;
     src: string;
     alt: string;
     category: string;
}

const EMPTY: Omit<GalleryItem, 'id'> = { src: '', alt: '', category: '' };

export default function GalleryPage() {
     const [items, setItems] = useState<GalleryItem[]>([]);
     const [loading, setLoading] = useState(true);
     const [modalOpen, setModalOpen] = useState(false);
     const [form, setForm] = useState(EMPTY);

     const headers = { ...authHeaders(), 'Content-Type': 'application/json' };

     async function fetchAll() {
          const res = await fetch('/api/gallery', { headers: authHeaders() });
          const data = await res.json();
          setItems(data);
          setLoading(false);
     }

     useEffect(() => { fetchAll(); }, []);

     async function handleSave(e: React.FormEvent) {
          e.preventDefault();
          await fetch('/api/gallery', { method: 'POST', headers, body: JSON.stringify(form) });
          setModalOpen(false);
          setForm(EMPTY);
          fetchAll();
     }

     async function handleDelete(id: number) {
          if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
          await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers });
          fetchAll();
     }

     return (
          <div>
               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Galeri</h1>
                    <button onClick={() => { setForm(EMPTY); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition">
                         <Plus className="w-4 h-4" /> Ekle
                    </button>
               </div>

               {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="aspect-[4/3] bg-slate-800 rounded-xl animate-pulse" />)}
                    </div>
               ) : items.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">Henüz görsel eklenmemiş.</p>
               ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {items.map((item) => (
                              <div key={item.id} className="group relative bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                                   <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full aspect-[4/3] object-cover"
                                        loading="lazy"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                                             <div>
                                                  <p className="text-white text-sm font-medium">{item.alt}</p>
                                                  <p className="text-slate-300 text-xs">{item.category}</p>
                                             </div>
                                             <button
                                                  onClick={() => handleDelete(item.id)}
                                                  className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-600 transition"
                                             >
                                                  <Trash2 className="w-4 h-4" />
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Modal */}
               {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                         <form onSubmit={handleSave} className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                              <div className="flex items-center justify-between mb-5">
                                   <h3 className="text-lg font-bold text-white">Yeni Görsel</h3>
                                   <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                              </div>

                              <div className="space-y-4">
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Görsel URL</label>
                                        <input
                                             value={form.src}
                                             onChange={(e) => setForm({ ...form, src: e.target.value })}
                                             placeholder="https://..."
                                             className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Alt Metin</label>
                                        <input
                                             value={form.alt}
                                             onChange={(e) => setForm({ ...form, alt: e.target.value })}
                                             className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm text-slate-300 mb-1">Kategori</label>
                                        <input
                                             value={form.category}
                                             onChange={(e) => setForm({ ...form, category: e.target.value })}
                                             placeholder="Zikir, Sohbet, Özel..."
                                             className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                                             required
                                        />
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
