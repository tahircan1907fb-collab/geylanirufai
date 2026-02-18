import React, { useEffect, useState } from 'react';
import { authHeaders } from '../components/ProtectedRoute'; // Adjust according to project structure
import { Save, CheckCircle } from 'lucide-react';
import MapPicker from '../../components/MapPicker';

interface MapSettingsData {
     mapTitle: string;
     mapLat: number;
     mapLng: number;
     mapZoom: number;
}

const EMPTY: MapSettingsData = {
     mapTitle: '', mapLat: 41.0082, mapLng: 28.9784, mapZoom: 15,
};

export default function MapSettings() {
     const [form, setForm] = useState<MapSettingsData>(EMPTY);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [saved, setSaved] = useState(false);

     useEffect(() => {
          fetch('/api/settings', { headers: authHeaders() })
               .then((r) => r.json())
               .then((data) => {
                    const { id, ...rest } = data;
                    const filtered: any = {};
                    // Map relevant fields from response
                    if (rest.mapTitle !== undefined) filtered.mapTitle = rest.mapTitle;
                    if (rest.mapLat !== undefined) filtered.mapLat = Number(rest.mapLat);
                    if (rest.mapLng !== undefined) filtered.mapLng = Number(rest.mapLng);
                    if (rest.mapZoom !== undefined) filtered.mapZoom = Number(rest.mapZoom);

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

     function update(key: keyof MapSettingsData) {
          return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
               setForm({ ...form, [key]: e.target.value });
     }

     const handleLocationSelect = (lat: number, lng: number, zoom: number) => {
          setForm(prev => ({ ...prev, mapLat: lat, mapLng: lng, mapZoom: zoom }));
     };

     if (loading) {
          return <div className="space-y-4">{[1].map((i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>;
     }

     return (
          <form onSubmit={handleSave} className="max-w-4xl mx-auto">
               <div className="flex items-center justify-between mb-6">
                    <div>
                         <h1 className="text-2xl font-bold text-white">Harita Ayarları</h1>
                         <p className="text-slate-400 text-sm mt-1">Harita üzerinden konumu işaretleyin.</p>
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
                         <div>
                              <label className="block text-sm text-slate-300 mb-1">Harita Başlığı</label>
                              <input
                                   value={form.mapTitle}
                                   onChange={update('mapTitle')}
                                   className={inputClass}
                                   placeholder="Örn: Dernek Konumu"
                              />
                         </div>

                         <div className="rounded-lg overflow-hidden border border-slate-600 relative z-0">
                              <MapPicker
                                   initialLat={form.mapLat}
                                   initialLng={form.mapLng}
                                   initialZoom={form.mapZoom}
                                   onLocationSelect={handleLocationSelect}
                              />
                         </div>

                         <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 font-mono mt-2 bg-slate-900/50 p-2 rounded">
                              <div>Enlem: {form.mapLat.toFixed(6)}</div>
                              <div>Boylam: {form.mapLng.toFixed(6)}</div>
                              <div>Yakınlaştırma: {form.mapZoom}</div>
                         </div>
                    </div>
               </section>
          </form>
     );
}
