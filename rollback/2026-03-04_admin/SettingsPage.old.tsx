import React, { useEffect, useState } from 'react';
import { authHeaders } from './components/ProtectedRoute';
import { Save, CheckCircle } from 'lucide-react';

interface SiteSettingsData {
     aboutTitle: string;
     aboutText1: string;
     aboutText2: string;
     aboutQuote: string;
     iban: string;
     ibanHolder: string;
     phone: string;
     email: string;
     address: string;
     instagram: string;
     facebook: string;
     youtube: string;
     whatsapp: string;
     // Hero
     heroBadge: string;
     heroTitle1: string;
     heroTitle2: string;
     heroDescription: string;
     heroButtonText1: string;
     heroButtonLink1: string;
     heroButtonText2: string;
     heroButtonLink2: string;
     heroImage: string;
     // Map
     mapEmbedUrl: string;
     mapTitle: string;
}

const EMPTY: SiteSettingsData = {
     aboutTitle: '', aboutText1: '', aboutText2: '', aboutQuote: '',
     iban: '', ibanHolder: '', phone: '', email: '', address: '',
     instagram: '', facebook: '', youtube: '', whatsapp: '',
     heroBadge: '', heroTitle1: '', heroTitle2: '', heroDescription: '',
     heroButtonText1: '', heroButtonLink1: '', heroButtonText2: '', heroButtonLink2: '',
     heroImage: '',
     mapEmbedUrl: '', mapTitle: '',
};

export default function SettingsPage() {
     const [form, setForm] = useState<SiteSettingsData>(EMPTY);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [saved, setSaved] = useState(false);

     useEffect(() => {
          fetch('/api/settings', { headers: authHeaders() })
               .then((r) => r.json())
               .then((data) => {
                    const { id, ...rest } = data;
                    // Ensure no undefined values to prevent uncontrolled input warning
                    setForm({ ...EMPTY, ...rest });
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

     function update(key: keyof SiteSettingsData) {
          return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
               setForm({ ...form, [key]: e.target.value });
     }

     if (loading) {
          return <div className="space-y-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>;
     }

     return (
          <form onSubmit={handleSave}>
               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
                    <button
                         type="submit"
                         disabled={saving}
                         className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                    >
                         {saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}</>}
                    </button>
               </div>

               <div className="space-y-6">
                    {/* Hero Bölümü */}
                    <section className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                         <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                              Ana Sayfa (Hero) Ayarları
                         </h2>
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

                    {/* Hakkımızda */}
                    <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                         <h2 className="text-white font-semibold mb-4">Hakkımızda</h2>
                         <div className="space-y-3">
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Başlık</label>
                                   <input value={form.aboutTitle} onChange={update('aboutTitle')} className={inputClass} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Paragraf 1</label>
                                   <textarea value={form.aboutText1} onChange={update('aboutText1')} rows={3} className={`${inputClass} resize-none`} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Paragraf 2</label>
                                   <textarea value={form.aboutText2} onChange={update('aboutText2')} rows={3} className={`${inputClass} resize-none`} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Alıntı</label>
                                   <input value={form.aboutQuote} onChange={update('aboutQuote')} className={inputClass} />
                              </div>
                         </div>
                    </section>

                    {/* Bağış */}
                    <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                         <h2 className="text-white font-semibold mb-4">Bağış Bilgileri</h2>
                         <div className="space-y-3">
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">IBAN</label>
                                   <input value={form.iban} onChange={update('iban')} className={inputClass} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Hesap Sahibi</label>
                                   <input value={form.ibanHolder} onChange={update('ibanHolder')} className={inputClass} />
                              </div>
                         </div>
                    </section>

                    {/* İletişim */}
                    <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                         <h2 className="text-white font-semibold mb-4">İletişim</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Telefon</label>
                                   <input value={form.phone} onChange={update('phone')} className={inputClass} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">E-posta</label>
                                   <input value={form.email} onChange={update('email')} className={inputClass} />
                              </div>
                              <div className="sm:col-span-2">
                                   <label className="block text-sm text-slate-300 mb-1">Adres</label>
                                   <textarea value={form.address} onChange={update('address')} rows={2} className={`${inputClass} resize-none`} />
                              </div>
                         </div>
                    </section>

                    {/* Harita Ayarları */}
                    <section className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                         <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                              Harita Ayarları
                         </h2>
                         <p className="text-xs text-slate-400 mb-4">
                              Google Maps'ten embed URL'sini yapıştırın. Adım: Google Maps → Konum ara → Paylaş → Haritayı yerleştir → iframe src URL'sini kopyala.
                         </p>
                         <div className="space-y-4">
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Harita Başlığı</label>
                                   <input
                                        value={form.mapTitle}
                                        onChange={update('mapTitle')}
                                        className={inputClass}
                                        placeholder="Örn: Dernek Konumu"
                                   />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Google Harita Gömme URL'si</label>
                                   <textarea
                                        value={form.mapEmbedUrl}
                                        onChange={update('mapEmbedUrl')}
                                        rows={3}
                                        className={`${inputClass} resize-none font-mono text-xs`}
                                        placeholder="https://www.google.com/maps/embed?pb=..."
                                   />
                              </div>
                         </div>
                    </section>

                    {/* Sosyal Medya */}
                    <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                         <h2 className="text-white font-semibold mb-4">Sosyal Medya</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Instagram</label>
                                   <input value={form.instagram} onChange={update('instagram')} placeholder="https://instagram.com/..." className={inputClass} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">Facebook</label>
                                   <input value={form.facebook} onChange={update('facebook')} placeholder="https://facebook.com/..." className={inputClass} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">YouTube</label>
                                   <input value={form.youtube} onChange={update('youtube')} placeholder="https://youtube.com/..." className={inputClass} />
                              </div>
                              <div>
                                   <label className="block text-sm text-slate-300 mb-1">WhatsApp</label>
                                   <input value={form.whatsapp} onChange={update('whatsapp')} placeholder="https://wa.me/..." className={inputClass} />
                              </div>
                         </div>
                    </section>
               </div>
          </form>
     );
}
