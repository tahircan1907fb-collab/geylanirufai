import React, { useEffect, useState } from 'react';
import { authHeaders } from '../components/ProtectedRoute';
import { Save, CheckCircle } from 'lucide-react';

interface AboutSettingsData {
     aboutTitle: string;
     aboutText1: string;
     aboutText2: string;
     aboutQuote: string;
}

const EMPTY: AboutSettingsData = {
     aboutTitle: '', aboutText1: '', aboutText2: '', aboutQuote: '',
};

export default function AboutSettings() {
     const [form, setForm] = useState<AboutSettingsData>(EMPTY);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [saved, setSaved] = useState(false);

     useEffect(() => {
          fetch('/api/settings', { headers: authHeaders() })
               .then((r) => r.json())
               .then((data) => {
                    const { id, ...rest } = data;
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

     function update(key: keyof AboutSettingsData) {
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
                         <h1 className="text-2xl font-bold text-white">Hakkımızda Ayarları</h1>
                         <p className="text-slate-400 text-sm mt-1">Kurumsal tanıtım metinlerini ve vizyon notunu düzenleyin.</p>
                    </div>
                    <button
                         type="submit"
                         disabled={saving}
                         className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                    >
                         {saved ? <><CheckCircle className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}</>}
                    </button>
               </div>

               <section className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-xl">
                    <div className="space-y-4">
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Başlık</label>
                              <input value={form.aboutTitle} onChange={update('aboutTitle')} className={inputClass} />
                         </div>
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Paragraf 1</label>
                              <textarea value={form.aboutText1} onChange={update('aboutText1')} rows={3} className={`${inputClass} resize-none`} placeholder="İlk paragraf metni..." />
                         </div>
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Paragraf 2</label>
                              <textarea value={form.aboutText2} onChange={update('aboutText2')} rows={3} className={`${inputClass} resize-none`} placeholder="İkinci paragraf metni..." />
                         </div>
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Alıntı (Vizyon Sözü)</label>
                              <input value={form.aboutQuote} onChange={update('aboutQuote')} className={inputClass} placeholder="Örn: 'İlim ilim bilmektir...'" />
                         </div>
                    </div>
               </section>
          </form>
     );
}
