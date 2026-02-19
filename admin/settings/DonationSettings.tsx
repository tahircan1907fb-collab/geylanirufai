import React, { useEffect, useState } from 'react';
import { authHeaders } from '../components/ProtectedRoute';
import { Save, CheckCircle } from 'lucide-react';

interface DonationSettingsData {
     iban: string;
     ibanHolder: string;
}

const EMPTY: DonationSettingsData = {
     iban: '', ibanHolder: '',
};

export default function DonationSettings() {
     const [form, setForm] = useState<DonationSettingsData>(EMPTY);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [saved, setSaved] = useState(false);

     useEffect(() => {
          fetch('/api/settings', { headers: authHeaders() })
               .then((r) => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.json();
               })
               .then((data) => {
                    const { id, ...rest } = data;
                    const filtered: any = {};
                    Object.keys(EMPTY).forEach(key => {
                         if (rest[key] !== undefined) filtered[key] = rest[key];
                    });
                    setForm({ ...EMPTY, ...filtered });
               })
               .catch((err) => console.error('DonationSettings fetch error:', err))
               .finally(() => setLoading(false));
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

     function update(key: keyof DonationSettingsData) {
          return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
               setForm({ ...form, [key]: e.target.value });
     }

     if (loading) {
          return <div className="space-y-4">{[1].map((i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>;
     }

     return (
          <form onSubmit={handleSave} className="max-w-4xl mx-auto">
               <div className="flex items-center justify-between mb-6">
                    <div>
                         <h1 className="text-2xl font-bold text-white">Bağış Bilgileri Ayarları</h1>
                         <p className="text-slate-400 text-sm mt-1">Banka hesap bilgilerini düzenleyin.</p>
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
                              <label className="block text-sm text-slate-300 mb-1">IBAN</label>
                              <input value={form.iban} onChange={update('iban')} className={`${inputClass} font-mono`} placeholder="TR..." />
                         </div>
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Hesap Sahibi</label>
                              <input value={form.ibanHolder} onChange={update('ibanHolder')} className={inputClass} />
                         </div>
                    </div>
               </section>
          </form>
     );
}
