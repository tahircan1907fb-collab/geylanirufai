import React, { useEffect, useRef, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { Plus, Trash2, X, Save, Upload, Camera } from 'lucide-react';

interface GalleryItem {
     id: number;
     src: string;
     alt: string;
     category: string;
}

const EMPTY: Omit<GalleryItem, 'id'> = { src: '', alt: '', category: '' };
const MAX_IMAGE_SIZE_MB = 5;

export default function GalleryPage() {
     const [items, setItems] = useState<GalleryItem[]>([]);
     const [loading, setLoading] = useState(true);
     const [modalOpen, setModalOpen] = useState(false);
     const [form, setForm] = useState(EMPTY);
     const [saving, setSaving] = useState(false);
     const [uploadError, setUploadError] = useState('');

     const fileInputRef = useRef<HTMLInputElement | null>(null);
     const cameraInputRef = useRef<HTMLInputElement | null>(null);

     const headers = { ...authHeaders(), 'Content-Type': 'application/json' };

     async function fetchAll() {
          try {
               const res = await fetch('/api/gallery', { headers: authHeaders() });
               if (!res.ok) {
                    console.error('Gallery fetch failed:', res.status);
                    setItems([]);
                    return;
               }
               const data = await res.json();
               setItems(Array.isArray(data) ? data : []);
          } catch (err) {
               console.error('Gallery fetch error:', err);
               setItems([]);
          } finally {
               setLoading(false);
          }
     }

     useEffect(() => { fetchAll(); }, []);

     async function handleSave(e: React.FormEvent) {
          e.preventDefault();
          if (!form.src.trim()) {
               setUploadError('Lutfen gorsel URL girin veya cihazinizdan bir resim secin.');
               return;
          }

          setSaving(true);
          await fetch('/api/gallery', { method: 'POST', headers, body: JSON.stringify(form) });
          setSaving(false);
          setModalOpen(false);
          setForm(EMPTY);
          setUploadError('');
          fetchAll();
     }

     function handleFilePicked(file: File) {
          if (!file.type.startsWith('image/')) {
               setUploadError('Sadece resim dosyalari secilebilir.');
               return;
          }

          if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
               setUploadError(`Resim boyutu en fazla ${MAX_IMAGE_SIZE_MB}MB olabilir.`);
               return;
          }

          setUploadError('');

          const reader = new FileReader();
          reader.onload = () => {
               const result = typeof reader.result === 'string' ? reader.result : '';
               setForm((prev) => ({ ...prev, src: result }));
               if (!form.alt.trim()) {
                    const cleanName = file.name.replace(/\.[^/.]+$/, '');
                    setForm((prev) => ({ ...prev, alt: cleanName }));
               }
          };
          reader.readAsDataURL(file);
     }

     function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
          const file = e.target.files?.[0];
          if (!file) return;
          handleFilePicked(file);
          e.target.value = '';
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
                    <button onClick={() => { setForm(EMPTY); setUploadError(''); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition">
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
                                         <label className="block text-sm text-slate-300 mb-2">Resim Yukle (Telefon veya Bilgisayar)</label>
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                              <button
                                                   type="button"
                                                   onClick={() => fileInputRef.current?.click()}
                                                   className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm hover:border-amber-500 transition flex items-center justify-center gap-2"
                                              >
                                                   <Upload className="w-4 h-4" /> Cihazdan Sec
                                              </button>
                                              <button
                                                   type="button"
                                                   onClick={() => cameraInputRef.current?.click()}
                                                   className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm hover:border-amber-500 transition flex items-center justify-center gap-2"
                                              >
                                                   <Camera className="w-4 h-4" /> Kamera ile Cek
                                              </button>
                                         </div>
                                         <input
                                              ref={fileInputRef}
                                              type="file"
                                              accept="image/*"
                                              onChange={onFileChange}
                                              className="hidden"
                                         />
                                         <input
                                              ref={cameraInputRef}
                                              type="file"
                                              accept="image/*"
                                              capture="environment"
                                              onChange={onFileChange}
                                              className="hidden"
                                         />
                                         <p className="text-xs text-slate-400 mt-2">Telefon ve bilgisayardan resim secebilirsiniz. Maksimum boyut: {MAX_IMAGE_SIZE_MB}MB.</p>
                                    </div>

                                    <div>
                                         <label className="block text-sm text-slate-300 mb-1">Görsel URL</label>
                                         <input
                                              value={form.src}
                                              onChange={(e) => {
                                                   setForm({ ...form, src: e.target.value });
                                                   if (uploadError) setUploadError('');
                                              }}
                                              placeholder="https://..."
                                              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                                         />
                                    </div>

                                    {form.src && (
                                         <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                                              <img src={form.src} alt="Onizleme" className="w-full max-h-56 object-cover" />
                                         </div>
                                    )}
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

                                    {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
                               </div>

                               <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition">İptal</button>
                                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed">
                                         <Save className="w-4 h-4" /> Kaydet
                                    </button>
                               </div>
                         </form>
                    </div>
               )}
          </div>
     );
}
