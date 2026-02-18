import React, { useEffect, useState } from 'react';
import { authHeaders } from '../components/ProtectedRoute'; // Adjust path
import { Save, CheckCircle } from 'lucide-react';

interface HeroSettingsData {
     heroBadge: string;
     heroTitle1: string;
     heroTitle2: string;
     heroDescription: string;
     heroButtonText1: string;
     heroButtonLink1: string;
     heroButtonText2: string;
     heroButtonLink2: string;
     heroImage: string;
}

const EMPTY: HeroSettingsData = {
     heroBadge: '', heroTitle1: '', heroTitle2: '', heroDescription: '',
     heroButtonText1: '', heroButtonLink1: '', heroButtonText2: '', heroButtonLink2: '',
     heroImage: '',
};

export default function HeroSettings() {
     const [form, setForm] = useState<HeroSettingsData>(EMPTY);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [saved, setSaved] = useState(false);

     useEffect(() => {
          fetch('/api/settings', { headers: authHeaders() })
               .then((r) => r.json())
               .then((data) => {
                    const { id, ...rest } = data;
                    // Filter only relevant keys
                    const filtered: any = {};
                    Object.keys(EMPTY).forEach(key => {
                         if (rest[key] !== undefined) filtered[key] = rest[key];
                    });
                    setForm({ ...EMPTY, ...filtered });
                    setLoading(false);
               });
     }, []);

     async function handleSave(e: React.FormEvent) {
          e.preventDefault();
          setSaving(true);
          await fetch('/api/settings', {
               method: 'PUT',
               headers: { ...authHeaders(), 'Content-Type': 'application/json' },
               body: JSON.stringify(form),
          });
          setSaving(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
     }

     const inputClass = "w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 transition";

     function update(key: keyof HeroSettingsData) {
          return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
               setForm({ ...form, [key]: e.target.value });
     }

     if (loading) {
          return <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>;
     }

     return (
          <form onSubmit={handleSave} className="max-w-4xl mx-auto">
               <div className="flex items-center justify-between mb-6">
                    <div>
                         <h1 className="text-2xl font-bold text-white">Ana Sayfa (Hero) Ayarları</h1>
                         <p className="text-slate-400 text-sm mt-1">Ana sayfanın en üstünde yer alan büyük görsel ve metin alanını düzenleyin.</p>
                    </div>
                    <button
                         type="submit"
                         disabled={saving}
                         className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                    >
                         {saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}</>}
                    </button>
               </div>

               <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
                    <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <label className="block text-sm text-slate-400 mb-1">Üst Rozet (Badge)</label>
                                   <input
                                        type="text"
                                        value={form.heroBadge}
                                        onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                                        className={inputClass}
                                        placeholder="Örn: Tasavvuf Geleneğinin İzinde"
                                   />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-400 mb-1">Arka Plan Görseli (URL)</label>
                                   <input
                                        type="text"
                                        value={form.heroImage}
                                        onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                                        className={inputClass}
                                        placeholder="https://..."
                                   />
                              </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <label className="block text-sm text-amber-500 mb-1 font-medium">Başlık 1 (Altın Renk)</label>
                                   <input
                                        type="text"
                                        value={form.heroTitle1}
                                        onChange={(e) => setForm({ ...form, heroTitle1: e.target.value })}
                                        className={`${inputClass} border-amber-500/30 ring-1 ring-amber-500/10`}
                                        placeholder="Örn: Geylani Rufai"
                                   />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Başlık 2 (Beyaz)</label>
                                   <input
                                        type="text"
                                        value={form.heroTitle2}
                                        onChange={(e) => setForm({ ...form, heroTitle2: e.target.value })}
                                        className={inputClass}
                                        placeholder="Örn: İlim, İrfan ve Hizmet Yolu"
                                   />
                              </div>
                         </div>

                         <div>
                              <label className="block text-sm text-slate-400 mb-1">Açıklama Metni</label>
                              <textarea
                                   value={form.heroDescription}
                                   onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                                   rows={3}
                                   className={`${inputClass} resize-none`}
                                   placeholder="Ana sayfada görünecek açıklama..."
                              />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              {/* Button 1 */}
                              <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                   <label className="block text-xs font-bold text-slate-500 uppercase">Sol Buton (Altın)</label>
                                   <div className="grid grid-cols-2 gap-2">
                                        <input
                                             type="text"
                                             value={form.heroButtonText1}
                                             onChange={(e) => setForm({ ...form, heroButtonText1: e.target.value })}
                                             className={inputClass}
                                             placeholder="Metin"
                                        />
                                        <input
                                             type="text"
                                             value={form.heroButtonLink1}
                                             onChange={(e) => setForm({ ...form, heroButtonLink1: e.target.value })}
                                             className={inputClass}
                                             placeholder="Link (#...)"
                                        />
                                   </div>
                              </div>

                              {/* Button 2 */}
                              <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                   <label className="block text-xs font-bold text-slate-500 uppercase">Sağ Buton (Şeffaf)</label>
                                   <div className="grid grid-cols-2 gap-2">
                                        <input
                                             type="text"
                                             value={form.heroButtonText2}
                                             onChange={(e) => setForm({ ...form, heroButtonText2: e.target.value })}
                                             className={inputClass}
                                             placeholder="Metin"
                                        />
                                        <input
                                             type="text"
                                             value={form.heroButtonLink2}
                                             onChange={(e) => setForm({ ...form, heroButtonLink2: e.target.value })}
                                             className={inputClass}
                                             placeholder="Link (#...)"
                                        />
                                   </div>
                              </div>
                         </div>
                    </div>
               </section>
          </form>
     );
}
